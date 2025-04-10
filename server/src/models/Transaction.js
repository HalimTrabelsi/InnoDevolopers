
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    anomalie: { type: Boolean, default: false },
    commentaireAnomalie: { type: String, default: "" },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    compteBancaire: { type: String, required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ipAddress: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, default: Date.now },
    __v: { type: Number, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);

// models/Transaction.js
class Transaction {
    constructor(crypto, amount, rate, currency) {
      this.crypto = crypto;
      this.amount = amount;
      this.rate = rate;
      this.currency = currency;
      this.convertedAmount = this.convertAmount();
    }
  
    // Méthode pour convertir le montant
    convertAmount() {
      return this.amount * this.rate;
    }
  }
  
  module.exports = Transaction;
  

