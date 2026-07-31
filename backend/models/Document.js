const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanApplication', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  documentType: {
    type: String,
    enum: ['pan_card', 'aadhaar_card', 'salary_slip', 'bank_statement', 'epf_statement', 'employment_certificate', 'address_proof', 'additional'],
    required: true,
  },
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileSize: Number,
  mimeType: String,
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'ai_review', 'verified', 'rejected', 'additional_info_required'],
    default: 'uploaded',
  },
  verificationRemarks: String,
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
