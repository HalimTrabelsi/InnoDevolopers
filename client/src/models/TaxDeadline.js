const mongoose = require('mongoose');

const taxDeadlineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  message: { type: String, required: true }
});

const TaxDeadline = mongoose.model('TaxDeadline', taxDeadlineSchema);
module.exports = TaxDeadline;
