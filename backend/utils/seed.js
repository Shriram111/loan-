const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('../models/User');
const LoanProduct = require('../models/LoanProduct');
const InterestRate = require('../models/InterestRate');

const seedData = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany({});
    await LoanProduct.deleteMany({});
    await InterestRate.deleteMany({});

    const users = await User.create([
      { fullName: 'Admin User', email: 'admin@saarthi.com', mobile: '9999999999', password: 'admin123', role: 'admin', isEmailVerified: true },
      { fullName: 'Rajesh Kumar', email: 'officer@saarthi.com', mobile: '9888888888', password: 'officer123', role: 'loan_officer', isEmailVerified: true },
      { fullName: 'Priya Sharma', email: 'auditor@saarthi.com', mobile: '9777777777', password: 'auditor123', role: 'loan_auditor', isEmailVerified: true },
      { fullName: 'Amit Patel', email: 'customer@saarthi.com', mobile: '9666666666', password: 'customer123', role: 'customer', isEmailVerified: true },
      { fullName: 'Sneha Gupta', email: 'sneha@example.com', mobile: '9555555555', password: 'customer123', role: 'customer', isEmailVerified: true },
    ]);

    const products = await LoanProduct.create([
      { name: 'Personal Loan', description: 'Quick personal loans for your needs', minAmount: 50000, maxAmount: 5000000, minTenure: 12, maxTenure: 60, interestRateMin: 10.5, interestRateMax: 21, processingFee: 2, eligibilityRequirements: ['Salaried or self-employed', 'Minimum age 21 years', 'Minimum income ₹15,000/month'] },
      { name: 'Home Loan', description: 'Fulfill your dream of owning a home', minAmount: 500000, maxAmount: 50000000, minTenure: 120, maxTenure: 360, interestRateMin: 8.5, interestRateMax: 12, processingFee: 0.5, eligibilityRequirements: ['Salaried or self-employed', 'Minimum age 21 years', 'Property should be in India'] },
      { name: 'Vehicle Loan', description: 'Finance your dream vehicle', minAmount: 100000, maxAmount: 10000000, minTenure: 12, maxTenure: 84, interestRateMin: 7.5, interestRateMax: 14, processingFee: 1, eligibilityRequirements: ['Minimum age 21 years', 'Valid driving license', 'Minimum income ₹20,000/month'] },
      { name: 'Education Loan', description: 'Invest in your future education', minAmount: 100000, maxAmount: 20000000, minTenure: 12, maxTenure: 120, interestRateMin: 8, interestRateMax: 13, processingFee: 1, eligibilityRequirements: ['Admission to recognized institution', 'Co-applicant required', 'Good academic record'] },
      { name: 'Business Loan', description: 'Grow your business with funding', minAmount: 200000, maxAmount: 25000000, minTenure: 12, maxTenure: 60, interestRateMin: 11, interestRateMax: 22, processingFee: 2.5, eligibilityRequirements: ['Business running for 2+ years', 'Minimum annual revenue ₹10 lakhs', 'Good credit score'] },
      { name: 'Gold Loan', description: 'Instant loans against gold', minAmount: 10000, maxAmount: 5000000, minTenure: 6, maxTenure: 36, interestRateMin: 7, interestRateMax: 15, processingFee: 0.5, eligibilityRequirements: ['Valid gold ornaments', 'Minimum age 18 years', 'KYC documents required'] },
    ]);

    await InterestRate.create([
      { loanType: 'Personal Loan', loanProductId: products[0]._id, minRate: 10.5, maxRate: 21, processingFeePercent: 2, maxTenureMonths: 60, effectiveDate: new Date() },
      { loanType: 'Home Loan', loanProductId: products[1]._id, minRate: 8.5, maxRate: 12, processingFeePercent: 0.5, maxTenureMonths: 360, effectiveDate: new Date() },
      { loanType: 'Vehicle Loan', loanProductId: products[2]._id, minRate: 7.5, maxRate: 14, processingFeePercent: 1, maxTenureMonths: 84, effectiveDate: new Date() },
      { loanType: 'Education Loan', loanProductId: products[3]._id, minRate: 8, maxRate: 13, processingFeePercent: 1, maxTenureMonths: 120, effectiveDate: new Date() },
      { loanType: 'Business Loan', loanProductId: products[4]._id, minRate: 11, maxRate: 22, processingFeePercent: 2.5, maxTenureMonths: 60, effectiveDate: new Date() },
      { loanType: 'Gold Loan', loanProductId: products[5]._id, minRate: 7, maxRate: 15, processingFeePercent: 0.5, maxTenureMonths: 36, effectiveDate: new Date() },
    ]);

    console.log('Seed completed successfully!');
    console.log('Users:', users.map((u) => `${u.email} (${u.role})`).join(', '));
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
