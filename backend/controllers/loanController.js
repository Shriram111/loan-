const LoanApplication = require('../models/LoanApplication');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

exports.createApplication = async (req, res, next) => {
  try {
    const application = await LoanApplication.create({ ...req.body, userId: req.user._id, status: 'draft' });
    await AuditLog.create({ userId: req.user._id, action: 'create_application', entity: 'LoanApplication', entityId: application._id, ipAddress: req.ip });
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

exports.getApplications = async (req, res, next) => {
  try {
    const { status, loanType, search, page = 1, limit = 10, sort = '-createdAt' } = req.query;
    let query = {};

    if (req.user.role === 'customer') {
      query.userId = req.user._id;
    } else if (req.user.role === 'loan_officer') {
      query.assignedOfficer = req.user._id;
    } else if (req.user.role === 'loan_auditor') {
      query.assignedAuditor = req.user._id;
    }

    if (status) query.status = status;
    if (loanType) query['loanDetails.loanType'] = loanType;
    if (search) {
      query.$or = [
        { applicationId: { $regex: search, $options: 'i' } },
        { 'personalDetails.fullName': { $regex: search, $options: 'i' } },
      ];
    }

    const total = await LoanApplication.countDocuments(query);
    const applications = await LoanApplication.find(query)
      .populate('userId', 'fullName email')
      .populate('assignedOfficer', 'fullName email')
      .populate('assignedAuditor', 'fullName email')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: applications,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit), limit: parseInt(limit) },
    });
  } catch (error) {
    next(error);
  }
};

exports.getApplication = async (req, res, next) => {
  try {
    const application = await LoanApplication.findById(req.params.id)
      .populate('userId', 'fullName email mobile')
      .populate('assignedOfficer', 'fullName email')
      .populate('assignedAuditor', 'fullName email');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

exports.updateApplication = async (req, res, next) => {
  try {
    const application = await LoanApplication.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

exports.deleteApplication = async (req, res, next) => {
  try {
    const application = await LoanApplication.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.json({ success: true, message: 'Application deleted' });
  } catch (error) {
    next(error);
  }
};

exports.submitApplication = async (req, res, next) => {
  try {
    const application = await LoanApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    application.status = 'submitted';
    application.submittedAt = new Date();
    await application.save();

    await Notification.create({
      userId: application.userId,
      title: 'Application Submitted',
      message: `Your loan application ${application.applicationId} has been submitted successfully.`,
      type: 'success',
    });

    await AuditLog.create({ userId: req.user._id, action: 'submit_application', entity: 'LoanApplication', entityId: application._id, ipAddress: req.ip });

    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

exports.assignOfficer = async (req, res, next) => {
  try {
    const { officerId, auditorId } = req.body;
    const update = {};
    if (officerId) update.assignedOfficer = officerId;
    if (auditorId) update.assignedAuditor = auditorId;
    update.status = 'under_review';

    const application = await LoanApplication.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};
