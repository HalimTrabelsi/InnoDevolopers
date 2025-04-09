const mongoose = require('mongoose');

const revenueSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Sales', 'Subscriptions', 'Services', 'Other'],
      default: 'Sales',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrenceInterval: {
      type: String,
      enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Cancelled'],
      default: 'Completed',
    },
  },
  { timestamps: true }
);


revenueSchema.methods.toJSON = function () {
  const revenue = this.toObject();
  delete revenue.__v; // Remove version key
  return revenue;
};

const Revenue = mongoose.models.Revenue || mongoose.model('Revenue', revenueSchema);

module.exports = { Revenue };