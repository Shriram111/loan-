const User = require('../models/User');
const LoanApplication = require('../models/LoanApplication');
const AuditLog = require('../models/AuditLog');

exports.getUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort('-createdAt').skip((page - 1) * limit).limit(parseInt(limit));
    res.json({ success: true, data: users, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalApplications = await LoanApplication.countDocuments();
    const approved = await LoanApplication.countDocuments({ status: 'approved' });
    const rejected = await LoanApplication.countDocuments({ status: 'rejected' });
    const pending = await LoanApplication.countDocuments({ status: { $in: ['draft', 'submitted', 'under_review', 'verification_in_progress'] } });

    const avgCibil = await LoanApplication.aggregate([
      { $match: { 'verification.cibil.score': { $exists: true } } },
      { $group: { _id: null, avg: { $avg: '$verification.cibil.score' } } },
    ]);

    const avgAuditScore = await LoanApplication.aggregate([
      { $match: { auditScore: { $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: '$auditScore' } } },
    ]);

    const totalLoanValue = await LoanApplication.aggregate([
      { $match: { status: { $in: ['approved', 'conditionally_approved'] } } },
      { $group: { _id: null, total: { $sum: '$loanDetails.loanAmount' } } },
    ]);

    const loanTypeDistribution = await LoanApplication.aggregate([
      { $group: { _id: '$loanDetails.loanType', count: { $sum: 1 } } },
    ]);

    const statusDistribution = await LoanApplication.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalApplications,
        approvedApplications: approved,
        rejectedApplications: rejected,
        pendingApplications: pending,
        averageCibilScore: avgCibil[0]?.avg || 0,
        averageAuditScore: avgAuditScore[0]?.avg || 0,
        totalLoanValue: totalLoanValue[0]?.total || 0,
        loanTypeDistribution,
        statusDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await AuditLog.countDocuments();
    const logs = await AuditLog.find().populate('userId', 'fullName email').sort('-createdAt').skip((page - 1) * limit).limit(parseInt(limit));
    res.json({ success: true, data: logs, pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};
