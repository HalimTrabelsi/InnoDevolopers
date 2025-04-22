const express = require('express');
  const router = express.Router();
  const authMiddleware = require('../middlewares/authorization');
  const financialTrendsController = require('../controllers/financialTrendsController');

  router.get(
    '/data',
    authMiddleware(['Business owner', 'Financial manager', 'Admin']),
    financialTrendsController.getFinancialTrendsData
  );

  module.exports = router;