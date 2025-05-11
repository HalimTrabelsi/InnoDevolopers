const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authorization');
const financialTrendsController = require('../controllers/financialTrendsController');

router.get(
  '/data',
  authMiddleware(['Business owner', 'Financial manager', 'Admin']),
  financialTrendsController.getFinancialTrendsData
);

router.get(
  '/transactions',
  authMiddleware(['Business owner', 'Financial manager', 'Admin']),
  financialTrendsController.getTransactionsByMonth
);

router.post(
  '/recommendations',
  authMiddleware(['Business owner', 'Financial manager', 'Admin']),
  financialTrendsController.saveRecommendation
);

router.patch(
  '/recommendations/:id',
  authMiddleware(['Business owner', 'Financial manager', 'Admin']),
  financialTrendsController.updateRecommendationStatus
);

module.exports = router;