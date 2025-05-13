const express = require('express');
const router = express.Router();
const { getTopExpenses, getAllExpenses, getExpensesByCategory, getTotalExpenses,getMonthlyExpenses, getRecurringStats, getStatusSummary, getLatestExpenses, searchExpenses} = require('../controllers/expenseController');

router.get('/top-expenses', getTopExpenses);
router.get('/all', getAllExpenses);
router.get('/categories', getExpensesByCategory);
router.get('/total', getTotalExpenses);
router.get('/monthly', getMonthlyExpenses);
router.get('/recurring-stats', getRecurringStats);
router.get('/status-summary', getStatusSummary);
router.get('/latest', getLatestExpenses);
router.get('/search', searchExpenses);

module.exports = router;
