const LoanApplication = require('../models/LoanApplication');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

exports.getAuditDashboard = async (req, res, next) => {
  try {
    const total = await LoanApplication.countDocuments();
    const pending = await LoanApplication.countDocuments({ status: { $in: ['submitted', 'under_review', 'verification_in_progress'] } });
    const approved = await LoanApplication.countDocuments({ status: { $in: ['approved', 'conditionally_approved'] } });
    const rejected = await LoanApplication.countDocuments({ status: 'rejected' });
    const inAudit = await LoanApplication.countDocuments({ status: 'audit_in_progress' });

    res.json({
      success: true,
      data: { total, pending, approved, rejected, inAudit },
    });
  } catch (error) {
    next(error);
  }
};

exports.getApplicationForAudit = async (req, res, next) => {
  try {
    const application = await LoanApplication.findById(req.params.applicationId)
      .populate('userId', 'fullName email mobile')
      .populate('assignedOfficer', 'fullName')
      .populate('assignedAuditor', 'fullName');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

exports.submitAudit = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { auditScore, riskLevel, auditNotes, auditorDecision, rejectionReason } = req.body;

    const application = await LoanApplication.findByIdAndUpdate(
      applicationId,
      { auditScore, riskLevel, auditNotes, auditorDecision, rejectionReason, auditedAt: new Date(), status: auditorDecision === 'approve' ? 'approved' : auditorDecision === 'reject' ? 'rejected' : auditorDecision === 'conditional' ? 'conditionally_approved' : 'on_hold' },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    await Notification.create({
      userId: application.userId,
      title: `Loan Application ${auditorDecision === 'approve' ? 'Approved' : auditorDecision === 'reject' ? 'Rejected' : 'Updated'}`,
      message: `Your loan application ${application.applicationId} has been ${auditorDecision}.`,
      type: auditorDecision === 'approve' ? 'success' : auditorDecision === 'reject' ? 'error' : 'info',
    });

    await AuditLog.create({ userId: req.user._id, action: 'audit_decision', entity: 'LoanApplication', entityId: application._id, details: { decision: auditorDecision, score: auditScore }, ipAddress: req.ip });

    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

exports.generateReport = async (req, res, next) => {
  try {
    const application = await LoanApplication.findById(req.params.applicationId)
      .populate('userId', 'fullName email mobile')
      .populate('assignedOfficer', 'fullName')
      .populate('assignedAuditor', 'fullName');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const report = {
      reportId: `RPT-${Date.now()}`,
      application,
      generatedAt: new Date(),
      generatedBy: req.user.fullName,
      disclaimer: 'This report is generated for internal loan assessment and audit purposes. Verification results may require additional manual review.',
    };

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};
