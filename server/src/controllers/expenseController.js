const Expense = require('../models/expenses');

exports.getTopExpenses = async (req, res) => {
  try {
    const topExpenses = await Expense.find()
      .sort({ amount: -1 }) 
      .limit(5);

    res.status(200).json({ success: true, data: topExpenses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
exports.getAllExpenses = async (req, res) => {
  try {
    const allExpenses = await Expense.find().sort({ date: -1 }); // Sort by most recent
    res.status(200).json({ success: true, data: allExpenses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getExpensesByCategory = async (req, res) => {
  try {
    const result = await Expense.aggregate([
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getTotalExpenses = async (req, res) => {
  try {
    const total = await Expense.aggregate([
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);

    console.log("Total expense:", total); 

    res.status(200).json({ success: true, total: total[0]?.totalAmount || 0 });
  } catch (error) {
    console.error("ERROR:", error); 
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.getMonthlyExpenses = async (req, res) => {
  try {
    const monthly = await Expense.aggregate([
      {
        $project: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          amount: 1
        }
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalAmount: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.status(200).json({ success: true, data: monthly });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getRecurringStats = async (req, res) => {
  try {
    const recurring = await Expense.countDocuments({ isRecurring: true });
    const nonRecurring = await Expense.countDocuments({ isRecurring: false });

    res.status(200).json({ 
      success: true, 
      data: { recurring, nonRecurring } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.getStatusSummary = async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getLatestExpenses = async (req, res) => {
  try {
    const latest = await Expense.find().sort({ date: -1 }).limit(5);
    res.status(200).json({ success: true, data: latest });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.searchExpenses = async (req, res) => {
  try {
    const { category, description, status } = req.query;
    const query = {};

    if (category) query.category = category;
    if (description) query.description = { $regex: description, $options: "i" };
    if (status) query.status = status;

    const results = await Expense.find(query);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
