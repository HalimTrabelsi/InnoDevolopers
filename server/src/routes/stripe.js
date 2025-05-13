const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const CompteBancaire = require('../models/compteBancaire');
const Transaction = require('../models/FinancialTransaction');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');
const axios = require('axios'); // ✅ manquant

// Route de paiement Stripe
router.post('/pay/:userId', async (req, res) => {
  const { userId } = req.params;
  const { amount, currency, bankAccountNumber } = req.body;

  if (!amount || !currency || !bankAccountNumber) {
    return res.status(400).json({ error: 'Données manquantes' });
  }

  try {
    const isZeroDecimal = ['JPY', 'KRW'].includes(currency.toUpperCase());
    const unit_amount = isZeroDecimal ? amount : Math.round(amount * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: currency.toLowerCase(),
          product_data: { name: 'Recharge de compte' },
          unit_amount: unit_amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      metadata: {
        userId,
        numeroCompte: bankAccountNumber // ✅ cohérent avec webhook
      },
      success_url: `http://localhost:3000/comptes-bancaires`,
      cancel_url: `http://localhost:3000/erreur-paiement`,
    });

    // Mise à jour temporaire avant confirmation via webhook
    const updatedAccount = await CompteBancaire.findOneAndUpdate(
      { numeroCompte: bankAccountNumber },
      { $inc: { balance: amount } },
      { new: true, runValidators: true }
    );

    if (!updatedAccount) throw new Error('Compte bancaire introuvable');

    // ✅ Récupération IP réelle + géoloc
    let ipAddress = requestIp.getClientIp(req);

    if (!ipAddress || ipAddress === '::1' || ipAddress === '127.0.0.1') {
      try {
        const response = await axios.get('https://api64.ipify.org?format=json');
        ipAddress = response.data.ip;
      } catch (err) {
        console.error('Erreur IP publique :', err.message);
        ipAddress = 'Inconnu';
      }
    }

    const geo = geoip.lookup(ipAddress);
    const location = geo ? `${geo.city || 'Inconnu'}, ${geo.country || 'Inconnu'}` : 'Inconnu';

    const transaction = new Transaction({
      amount,
      description: `Recharge Stripe - ${session.id}`,
      type: 'credit',
      user: userId,
      compteBancaire: bankAccountNumber,
      ipAddress,
      location,
      status: 'pending'
    });

    await transaction.save();

    console.log(`✅ Recharge initiée pour ${amount} ${currency}`);
    res.json({ sessionId: session.id });

  } catch (error) {
    console.error('Erreur paiement :', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Webhook Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log('🟢 Événement Stripe reçu :', event.type);
  } catch (err) {
    console.error('⚠️ Signature Stripe invalide :', err);
    return res.status(400).send(`Erreur Webhook : ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      if (session.payment_status !== 'paid') throw new Error('Paiement non confirmé');

      const { userId, numeroCompte } = session.metadata;
      const amount = session.amount_total / (session.currency === 'jpy' ? 1 : 100);

      const updatedAccount = await CompteBancaire.findOneAndUpdate(
        { numeroCompte },
        { $inc: { balance: amount } },
        { new: true, runValidators: true }
      );

      if (!updatedAccount) throw new Error('Compte bancaire introuvable');

      const transaction = new Transaction({
        amount,
        description: `Recharge Stripe - ${session.id}`,
        type: 'credit',
        user: userId,
        compteBancaire: numeroCompte,
        status: 'completed',
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Inconnu',
      });

      await transaction.save();

      console.log(`✅ Paiement confirmé pour ${amount} ${session.currency}`);
      res.json({ received: true });

    } catch (error) {
      console.error('❌ Erreur Webhook :', error);
      return res.status(400).json({ error: error.message });
    }
  } else {
    res.status(200).send('Événement ignoré');
  }
});

module.exports = router;
