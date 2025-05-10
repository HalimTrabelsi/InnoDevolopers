import React, { useState } from 'react';
import axios from 'axios';

const RevenuePrediction = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5001/api/predict'); 
      setPrediction(response.data.prediction);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '50px', textAlign: 'center' }}>
      <h2>🔮 Revenue Prediction </h2>
      <button
        onClick={handlePredict}
        style={{
          backgroundColor: '#27ae60',
          padding: '10px 20px',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Loading...' : 'Predict Next Week'}
      </button>

      {prediction && (
        <div style={{ marginTop: '20px', fontSize: '20px', color: '#2980b9' }}>
          📈 Expected Revenue : <strong>{prediction} DTN</strong>
        </div>
      )}
    </div>
  );
};

export default RevenuePrediction;
