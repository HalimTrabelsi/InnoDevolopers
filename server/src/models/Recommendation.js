const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  text: { type: String, required: true },
  priority: { type: String, enum: ['critical', 'important', 'suggestion'], default: 'suggestion' },
  action: {
    type: { type: String },
    label: String,
  },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model('Recommendation', recommendationSchema);