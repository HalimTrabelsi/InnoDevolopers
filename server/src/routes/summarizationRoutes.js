// server/routes/summarizationRoutes.js
const express = require('express');
const router = express.Router();
const { summarizeText } = require('../controllers/summarizationController');

router.post('/summarize', summarizeText);

module.exports = router;