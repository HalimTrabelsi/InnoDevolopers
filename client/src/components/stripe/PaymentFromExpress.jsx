import React, { useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import './payment.css'; // Import CSS standard
import { justeNom } from '../AuthUtils'; // adapte le chemin

const stripePromise = loadStripe('pk_test_51QmNFiBHq30Q7wRRS2u1lBBUM6LS0X9sdUtWBu1UJWgQvUvXmUmF327Y8NOgFDga7ym5qDWimgsJqsqi47lzm9WO00KlOv4Lxu');

const PaymentFromExpress = () => {
  const [userId, setUserId] = useState(justeNom());
  const [amount, setAmount] = useState(100);
  const [currency, setCurrency] = useState('eur');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
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
      } 
      
      else {
        throw new Error('Aucun session ID reçu');
      }
    } catch (err) {
      setError(err.message || "Erreur lors du paiement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="paymentContainer"> {/* Supprimé styles. */}
      <h2 className="title"> {/* Supprimé styles. */}
        <span role="img" aria-label="money-bag">💰</span>
        Secure Payment
        <span role="img" aria-label="credit-card">💳</span>
      </h2>

      <form onSubmit={handlePayment} className="paymentForm"> {/* Supprimé styles. */}
        <div className="formGroup"> {/* Supprimé styles. */}
          <label htmlFor="userId">User </label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="inputField" 
          />
        </div>

        <div className="formGroup"> {/* Supprimé styles. */}
          <label htmlFor="amount">Amount(TND) :</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="inputField"
          />
        </div>

        <div className="formGroup"> {/* Supprimé styles. */}
          <label htmlFor="currency">Currency :</label>
          <input
            id="currency"
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="inputField"
          />
        </div>

        <div className="formGroup"> {/* Supprimé styles. */}
          <label htmlFor="bankAccountNumber">IBAN :</label>
          <input
            id="bankAccountNumber"
            type="text"
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value)}
            className="inputField" 
          />
        </div>

        <button
          id="button1" 
          type="submit" 
          disabled={loading}
          className="payButton"
        >
          {loading ? (
            <span className="buttonLoading"> {/* Supprimé styles. */}
              <span className="spinner" /> {/* Supprimé styles. */} Traitement...
            </span>
          ) : (
            'Payer Maintenant'
          )}
        </button>
      </form>

      {error && <div className="errorMessage">{error}</div>} {/* Supprimé styles. */}
    </div>
  );
};

export default PaymentFromExpress;