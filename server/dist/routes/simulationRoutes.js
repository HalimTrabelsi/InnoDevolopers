const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');

router.post('/simulate', simulationController.simulateScenario);

module.exports = router;