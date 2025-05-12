const express = require('express');
const router = express.Router();
const { getTopExpenses, addExpense } = require('../controllers/expenseController');

router.get('/top-expenses', getTopExpenses);

router.post('/add-expense', addExpense);

module.exports = router;
