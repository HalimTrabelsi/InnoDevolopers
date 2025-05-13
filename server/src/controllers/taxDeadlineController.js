const TaxDeadline = require('../models/TaxDeadline');

exports.createDeadline = async (req, res) => {
  try {
    const { title, date, message } = req.body;
    const newDeadline = await TaxDeadline.create({
      userId: req.user.id,
      title,
      date,
      message
    });
    res.status(201).json({ success: true, data: newDeadline });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating deadline" });
  }
};

exports.getUserDeadlines = async (req, res) => {
  try {
    const deadlines = await TaxDeadline.find({ userId: req.user.id }).sort({ date: 1 });
    if (!deadlines.length) {
      return res.status(404).json({ success: false, message: "No deadlines found" });
    }
    res.status(200).json({ success: true, data: deadlines });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching deadlines" });
  }
};
