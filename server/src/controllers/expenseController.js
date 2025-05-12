const Expense = require('../models/expenses');

// Fetch top expenses
exports.getTopExpenses = async (req, res) => {
  try {
    // Find top 5 expenses sorted by amount in descending order
    const topExpenses = await Expense.find()
      .sort({ amount: -1 }) // Sort by amount in descending order
      .limit(5); // Limit to the top 5 expenses

    res.status(200).json({ success: true, data: topExpenses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add a new expense
exports.addExpense = async (req, res) => {
  try {
    const { category, amount, date } = req.body;

    // Validate input fields
    if (!category || !amount || !date) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Create a new expense record
    const newExpense = new Expense({
      category,
      amount,
      date: new Date(date),
    });

    // Save the expense to the database
    await newExpense.save();
    res.status(201).json({ success: true, data: newExpense });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
module.exports = {
  getTopExpenses,
  addExpense,
};