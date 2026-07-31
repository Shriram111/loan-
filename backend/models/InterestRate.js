const mongoose = require('mongoose');

const interestRateSchema = new mongoose.Schema({
  loanType: { type: String, required: true },
  loanProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanProduct' },
  minRate: { type: Number, required: true },
  maxRate: { type: Number, required: true },
  processingFeePercent: { type: Number, default: 0 },
  maxTenureMonths: { type: Number, required: true },
  effectiveDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('InterestRate', interestRateSchema);
