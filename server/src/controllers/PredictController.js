const axios = require('axios');
const { Revenue } = require('../models/revenue');

exports.getPrediction = async (req, res) => {
  try {
    const revenus = await Revenue.find()
      .sort({ date: 1 })
      .limit(6)
      .select('amount');

    const amounts = revenus.map(r => r.amount);

    const response = await axios.post('http://localhost:5001/api/predict', {
      revenue: amounts
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return res.status(200).json({
      prediction: response.data.revenu_prevu
    });

  } catch (err) {
    console.error("❌ Error:", err.message);
    return res.status(500).json({ error: 'prediction error' });
  }
};
