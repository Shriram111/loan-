const LoanProduct = require('../models/LoanProduct');
const InterestRate = require('../models/InterestRate');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await LoanProduct.find({ isActive: true });
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await LoanProduct.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await LoanProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await LoanProduct.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Product deactivated' });
  } catch (error) {
    next(error);
  }
};

exports.getInterestRates = async (req, res, next) => {
  try {
    const rates = await InterestRate.find({ isActive: true }).populate('loanProductId');
    res.json({ success: true, data: rates });
  } catch (error) {
    next(error);
  }
};

exports.createInterestRate = async (req, res, next) => {
  try {
    const rate = await InterestRate.create(req.body);
    res.status(201).json({ success: true, data: rate });
  } catch (error) {
    next(error);
  }
};

exports.updateInterestRate = async (req, res, next) => {
  try {
    const rate = await InterestRate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: rate });
  } catch (error) {
    next(error);
  }
};

exports.calculateEmi = async (req, res, next) => {
  try {
    const { principal, annualRate, tenureMonths } = req.body;
    const monthlyRate = annualRate / 12 / 100;
    let emi;
    if (monthlyRate === 0) {
      emi = principal / tenureMonths;
    } else {
      emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    }
    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - principal;

    const schedule = [];
    let balance = principal;
    for (let i = 1; i <= tenureMonths; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;
      schedule.push({
        month: i,
        emi: Math.round(emi),
        principal: Math.round(principalPayment),
        interest: Math.round(interestPayment),
        balance: Math.max(0, Math.round(balance)),
      });
    }

    res.json({
      success: true,
      data: {
        emi: Math.round(emi),
        totalPayment: Math.round(totalPayment),
        totalInterest: Math.round(totalInterest),
        schedule,
      },
    });
  } catch (error) {
    next(error);
  }
};
