const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const CompteBancaire = require('../models/compteBancaire');
const Transaction = require('../models/FinancialTransaction');

// Fonction pour effectuer un paiement et mettre à jour le solde
router.post('/pay/:userId', async (req, res) => {
  const { userId } = req.params;
  const { amount, currency, bankAccountNumber } = req.body;

  // Validation des données
  if (!amount || !currency || !bankAccountNumber) {
    return res.status(400).json({ error: 'Données manquantes' });
  }

  try {
    // Conversion du montant selon la devise
    const isZeroDecimal = ['JPY', 'KRW'].includes(currency.toUpperCase());
    const unit_amount = isZeroDecimal ? amount : Math.round(amount * 100);

    // Création de la session Stripe
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
        userId: userId,
        bankAccountNumber: bankAccountNumber
      },
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    // Attente de la réponse du paiement via le webhook Stripe
    const sessionId = session.id;

    // Traitement du paiement après la réussite du paiement
    // Mise à jour atomique du solde du compte bancaire et création de la transaction
    const updatedAccount = await CompteBancaire.findOneAndUpdate(
      { numeroCompte: bankAccountNumber },
      { $inc: { balance: amount } },
      { new: true, runValidators: true }
    );

    if (!updatedAccount) {
      throw new Error('Compte bancaire introuvable');
    }

    // Création de la transaction
    const transaction = new Transaction({
      amount: amount,
      description: `Recharge Stripe - ${sessionId}`,
      type: 'credit', // Le type est 'credit' car il s'agit d'un ajout au solde
      user: userId,
      compteBancaire: bankAccountNumber,
      ipAddress: req.ip, // Capture de l'adresse IP de la requête
      location: req.headers['x-forwarded-for'] || req.connection.remoteAddress, // Adresse IP du client
    });

    // Sauvegarder la transaction dans l'historique
    await transaction.save();

    console.log(`✅ Recharge réussie pour ${amount} ${currency}`);
    
    // Réponse avec l'ID de la session Stripe
    res.json({ sessionId });
  } catch (error) {
    console.error('Erreur lors du paiement:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook Stripe pour valider la réussite du paiement et effectuer les mises à jour après paiement

// Webhook Stripe pour valider la réussite du paiement et effectuer les mises à jour après paiement
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log('Événement reçu:', event.type);
  } catch (err) {
    console.error('⚠️ Webhook invalide:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gestion de l'événement de paiement terminé
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    try {
      // Vérification du statut de paiement
      if (session.payment_status !== 'paid') {
        console.error('Paiement non finalisé:', session.payment_status);
        throw new Error('Paiement non finalisé');
      }

      // Extraction des données des métadonnées
      const { userId, numeroCompte } = session.metadata; // Changed from bankAccountNumber to numeroCompte
      // Conversion du montant en fonction de la devise
      const amount = session.amount_total / (session.currency === 'jpy' ? 1 : 100);

      // Mise à jour atomique du solde du compte bancaire
      const updatedAccount = await CompteBancaire.findOneAndUpdate(
        { numeroCompte: numeroCompte }, // Changed from bankAccountNumber to numeroCompte
        { $inc: { balance: amount } },
        { new: true, runValidators: true }
      );

      if (!updatedAccount) {
        throw new Error('Compte bancaire introuvable');
      }

      // Création de la transaction dans l'historique
      const transaction = new Transaction({
        amount,
        description: `Recharge Stripe - ${session.id}`,
        type: 'credit',
        user: userId,
        compteBancaire: numeroCompte,
        status: 'completed',
        ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress, // Meilleure gestion IP
      });
      await transaction.save(); // Sauvegarder la transaction dans l'historique

      console.log(`✅ Recharge réussie pour ${amount} ${session.currency}`);
      res.json({ received: true });
    } catch (error) {
      console.error('❌ Erreur de traitement:', error);
      return res.status(400).json({ error: error.message });
    }
  } else {
    res.status(200).send('Événement non traité');
  }
});


module.exports = router;
