import React, { useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import styles from './payment.css';

const stripePromise = loadStripe('pk_test_51QmNFiBHq30Q7wRRS2u1lBBUM6LS0X9sdUtWBu1UJWgQvUvXmUmF327Y8NOgFDga7ym5qDWimgsJqsqi47lzm9WO00KlOv4Lxu');

const PaymentFromExpress = () => {
  const [userId, setUserId] = useState('67bc888c89b0c925344f8703');
  const [amount, setAmount] = useState(100);
  const [currency, setCurrency] = useState('eur');
  const [bankAccountNumber, setBankAccountNumber] = useState('TN59 1000 6035 583340670 65');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`http://localhost:5001/stripe/pay/${userId}`, {
        amount,
        currency,
        bankAccountNumber,
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const data = response.data;
      if (data.sessionId) {
        const stripe = await stripePromise;
        const { error: stripeError } = await stripe.redirectToCheckout({ 
          sessionId: data.sessionId 
        });
        if (stripeError) throw stripeError;
      } else {
        throw new Error('Aucun session ID reçu');
      }
    } catch (err) {
      setError(err.message || "Erreur lors du paiement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.paymentContainer}>
      <h2 className={styles.title}>
        <span role="img" aria-label="money-bag">💰</span>
        Paiement Sécurisé
        <span role="img" aria-label="credit-card">💳</span>
      </h2>

      <form onSubmit={handlePayment} className={styles.paymentForm}>
        <div className={styles.formGroup}>
          <label htmlFor="userId">Identifiant Utilisateur :</label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className={styles.inputField}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="amount">Montant (€) :</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className={styles.inputField}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="currency">Devise :</label>
          <input
            id="currency"
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={styles.inputField}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="bankAccountNumber">IBAN :</label>
          <input
            id="bankAccountNumber"
            type="text"
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value)}
            className={styles.inputField}
          />
        </div>

        <button
          id="button1" 
          type="submit" 
          disabled={loading}
          className={styles.payButton}
        >
          {loading ? (
            <span className={styles.buttonLoading}>
              <span className={styles.spinner} /> Traitement...
            </span>
          ) : (
            'Payer Maintenant'
          )}
        </button>
      </form>

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default PaymentFromExpress;