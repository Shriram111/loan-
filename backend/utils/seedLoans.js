const mongoose = require('mongoose');
const config = require('../config');
const User = require('../models/User');
const LoanApplication = require('../models/LoanApplication');

const seedLoans = async () => {
  await mongoose.connect(config.mongoUri);
  console.log('Connected for loan seeding...');

  const customers = await User.find({ role: 'customer' });
  const officers = await User.find({ role: 'loan_officer' });
  const auditors = await User.find({ role: 'loan_auditor' });

  if (customers.length === 0) { console.log('No customers found'); process.exit(1); }

  const loanTypes = ['Personal Loan', 'Home Loan', 'Vehicle Loan', 'Education Loan', 'Business Loan', 'Gold Loan'];
  const statuses = ['draft', 'submitted', 'under_review', 'verification_in_progress', 'approved', 'rejected', 'on_hold'];

  const applications = [];
  for (let i = 0; i < 12; i++) {
    const customer = customers[i % customers.length];
    const officer = officers.length > 0 ? officers[0] : null;
    const auditor = auditors.length > 0 ? auditors[0] : null;
    const loanType = loanTypes[i % loanTypes.length];
    const status = statuses[i % statuses.length];
    const amount = (Math.floor(Math.random() * 50) + 5) * 100000;

    applications.push({
      userId: customer._id,
      assignedOfficer: officer?._id,
      assignedAuditor: auditor?._id,
      status,
      personalDetails: {
        fullName: customer.fullName,
        dateOfBirth: new Date(1990, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        gender: i % 2 === 0 ? 'male' : 'female',
        mobile: customer.mobile,
        email: customer.email,
        panNumber: 'ABCDE' + (1000 + i) + 'F',
        aadhaarNumber: '1234 5678 ' + (9000 + i),
        currentAddress: '123 Main Street, Mumbai, Maharashtra',
        permanentAddress: '123 Main Street, Mumbai, Maharashtra',
      },
      employmentDetails: {
        employmentType: i % 2 === 0 ? 'salaried' : 'self_employed',
        companyName: i % 2 === 0 ? 'Tech Solutions Pvt Ltd' : 'Patel Enterprises',
        designation: i % 2 === 0 ? 'Software Engineer' : 'Business Owner',
        workExperience: Math.floor(Math.random() * 10) + 1,
        monthlySalary: Math.floor(Math.random() * 80000) + 30000,
        annualIncome: Math.floor(Math.random() * 1200000) + 500000,
      },
      loanDetails: {
        loanType,
        loanAmount: amount,
        loanTenure: [12, 24, 36, 60, 120, 240][i % 6],
        purposeOfLoan: `${loanType} financing`,
        existingMonthlyEmi: i % 3 === 0 ? Math.floor(Math.random() * 15000) + 5000 : 0,
      },
      bankDetails: {
        accountHolderName: customer.fullName,
        bankName: 'HDFC Bank',
        accountNumber: '501000' + (10000000 + i),
        ifscCode: 'HDFC0001234',
        accountType: 'savings',
      },
      verification: {
        cibil: status !== 'draft' ? { status: 'verified', score: Math.floor(Math.random() * 200) + 650, data: {} } : { status: 'pending' },
        epf: status !== 'draft' ? { status: 'verified', data: {} } : { status: 'pending' },
        salary: status !== 'draft' ? { status: 'verified', data: {} } : { status: 'pending' },
        digilocker: status !== 'draft' ? { status: 'verified', data: {} } : { status: 'pending' },
        selfie: status !== 'draft' ? { status: 'verified', data: {} } : { status: 'pending' },
        liveness: status !== 'draft' ? { status: 'verified', data: {} } : { status: 'pending' },
      },
      auditScore: ['approved', 'rejected'].includes(status) ? Math.floor(Math.random() * 20) + 80 : 0,
      riskLevel: ['approved', 'rejected'].includes(status) ? ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] : 'medium',
    });
  }

  await LoanApplication.deleteMany({});
  for (const app of applications) {
    await LoanApplication.create(app);
  }
  console.log(`Seeded ${applications.length} loan applications`);
  process.exit(0);
};

seedLoans().catch((e) => { console.error(e); process.exit(1); });
