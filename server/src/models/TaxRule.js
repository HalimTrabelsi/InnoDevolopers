const mongoose = require('mongoose');

const TaxRuleSchema = new mongoose.Schema({
  taxType: {
    type: String,
    required: true,
    enum: ['TVA', 'IRPP', 'IS', 'SSC', 'ProfessionalTraining', 'SocialLodging'], 
  },
  rate: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  applicableCategories: {
    type: [String],
    required: true, 
  },
  conditions: {
    type: Object,
    default: {},
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('TaxRule', TaxRuleSchema);