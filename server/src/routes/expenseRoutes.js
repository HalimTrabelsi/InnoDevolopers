const express = require('express');
const router = express.Router();
const { getTopExpenses, addExpense } = require('../controllers/expenseController');

// Route to fetch top expenses
router.get('/top-expenses', getTopExpenses);

// Route to add a new expense
router.post('/add-expense', addExpense);

module.exports = router;
