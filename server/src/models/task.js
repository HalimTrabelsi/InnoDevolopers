const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
}, { timestamps: true });

const task = mongoose.model("task", taskSchema);
module.exports = task;
