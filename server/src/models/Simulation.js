const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nom du scénario
  revenueChange: { type: Number, default: 0 }, // Variation des revenus (en %)
  expenseChange: { type: Number, default: 0 }, // Variation des dépenses (en TND)
  investment: { type: Number, default: 0 }, // Nouvel investissement (en TND)
  simulatedRevenues: { type: Number, required: true },
  simulatedExpenses: { type: Number, required: true },
  simulatedCashFlow: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Simulation', simulationSchema);