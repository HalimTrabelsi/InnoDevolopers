const express = require('express');
const router = express.Router();
const { getPrediction } = require('../controllers/PredictController');

router.post('/predict', getPrediction); 

module.exports = router;
