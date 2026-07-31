const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema({
  applicationId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedAuditor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'verification_in_progress', 'audit_in_progress', 'approved', 'conditionally_approved', 'rejected', 'on_hold'],
    default: 'draft',
  },
  personalDetails: {
    fullName: String,
    dateOfBirth: Date,
    gender: String,
    mobile: String,
    email: String,
    panNumber: String,
    aadhaarNumber: String,
    currentAddress: String,
    permanentAddress: String,
  },
  employmentDetails: {
    employmentType: String,
    companyName: String,
    designation: String,
    workExperience: Number,
    monthlySalary: Number,
    annualIncome: Number,
    epfAccount: String,
  },
  loanDetails: {
    loanType: String,
    loanAmount: Number,
    loanTenure: Number,
    purposeOfLoan: String,
    existingMonthlyEmi: Number,
    existingLoanDetails: String,
  },
  bankDetails: {
    accountHolderName: String,
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    accountType: String,
  },
  verification: {
    cibil: { status: { type: String, default: 'pending' }, score: Number, data: mongoose.Schema.Types.Mixed },
    epf: { status: { type: String, default: 'pending' }, data: mongoose.Schema.Types.Mixed },
    salary: { status: { type: String, default: 'pending' }, data: mongoose.Schema.Types.Mixed },
    digilocker: { status: { type: String, default: 'pending' }, data: mongoose.Schema.Types.Mixed },
    selfie: { status: { type: String, default: 'pending' }, data: mongoose.Schema.Types.Mixed },
    liveness: { status: { type: String, default: 'pending' }, data: mongoose.Schema.Types.Mixed },
    panHolding: { status: { type: String, default: 'pending' } },
    aadhaarHolding: { status: { type: String, default: 'pending' } },
    liveVideo: { status: { type: String, default: 'pending' } },
  },
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  auditScore: { type: Number, default: 0 },
  riskLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  aiNotes: { type: mongoose.Schema.Types.Mixed },
  auditNotes: String,
  auditorDecision: String,
  rejectionReason: String,
  submittedAt: Date,
  auditedAt: Date,
  approvedAt: Date,
}, { timestamps: true });

loanApplicationSchema.pre('save', async function (next) {
  if (!this.applicationId) {
    const count = await mongoose.model('LoanApplication').countDocuments();
    this.applicationId = `SB-${Date.now()}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);
