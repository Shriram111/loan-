const mongoose = require('mongoose');

const loanProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  description: String,
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
  minTenure: { type: Number, required: true },
  maxTenure: { type: Number, required: true },
  interestRateMin: { type: Number, required: true },
  interestRateMax: { type: Number, required: true },
  processingFee: { type: Number, default: 0 },
  eligibilityRequirements: [String],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

loanProductSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

module.exports = mongoose.model('LoanProduct', loanProductSchema);
