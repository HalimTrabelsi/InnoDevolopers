const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true, enum: ['credit', 'debit'] },
  date: { type: Date, required: true, default: Date.now },
  user: {  ref: 'User',type: mongoose.Schema.Types.ObjectId, required: true },
  compteBancaire: { type: String, ref: 'CompteBancaire', required: true },
  recipient: { ref: 'User',type: mongoose.Schema.Types.ObjectId }, 
  ipAddress: { type: String },
  location: { type: String },
  anomalie: { type: Boolean, default: false },
  commentaireAnomalie: { type: String, default: "" },
  taxType: {String}, 
  taxCalculated: {Number},
  isTaxValidated: {Boolean},
  category: {String}, 
  consumption: {Number}, 
  isExport: {Boolean},
},
{ collection: "transactions" }
);

module.exports = mongoose.model('Transaction', transactionSchema);

