const LoanApplication = require('../models/LoanApplication');
const Notification = require('../models/Notification');

exports.verifyCibil = async (req, res, next) => {
  try {
    const { applicationId } = req.body;
    const mockCibilData = {
      score: Math.floor(Math.random() * 300) + 550,
      category: '',
      creditHistory: 'Good',
      totalActiveLoans: Math.floor(Math.random() * 3) + 1,
      totalOutstanding: Math.floor(Math.random() * 500000) + 50000,
      creditUtilisation: Math.floor(Math.random() * 40) + 10,
      paymentHistory: '98% on-time',
      recentEnquiries: Math.floor(Math.random() * 3),
    };
    mockCibilData.category = mockCibilData.score >= 750 ? 'Excellent' : mockCibilData.score >= 650 ? 'Good' : mockCibilData.score >= 550 ? 'Fair' : 'Poor';

    const application = await LoanApplication.findByIdAndUpdate(
      applicationId,
      { 'verification.cibil': { status: 'verified', score: mockCibilData.score, data: mockCibilData } },
      { new: true }
    );

    res.json({ success: true, data: mockCibilData, message: 'CIBIL verification completed (simulated)' });
  } catch (error) {
    next(error);
  }
};

exports.verifyEpf = async (req, res, next) => {
  try {
    const { applicationId } = req.body;
    const mockEpfData = {
      uan: '10' + Math.floor(Math.random() * 10000000000),
      employmentStatus: 'Active',
      employerName: 'Tech Solutions Pvt Ltd',
      employmentHistory: [
        { employer: 'Tech Solutions Pvt Ltd', from: '2021-04', to: 'Present' },
        { employer: 'Digital Works Ltd', from: '2018-06', to: '2021-03' },
      ],
      monthlyContribution: Math.floor(Math.random() * 5000) + 1800,
      totalBalance: Math.floor(Math.random() * 1000000) + 200000,
      lastContributionDate: '2026-06',
    };

    await LoanApplication.findByIdAndUpdate(applicationId, {
      'verification.epf': { status: 'verified', data: mockEpfData },
    });

    res.json({ success: true, data: mockEpfData, message: 'EPF verification completed (simulated)' });
  } catch (error) {
    next(error);
  }
};

exports.verifySalary = async (req, res, next) => {
  try {
    const { applicationId } = req.body;
    const basic = Math.floor(Math.random() * 30000) + 25000;
    const hra = Math.floor(basic * 0.4);
    const allowances = Math.floor(basic * 0.2);
    const gross = basic + hra + allowances;
    const deductions = Math.floor(gross * 0.15);
    const net = gross - deductions;

    const mockSalaryData = {
      employeeName: 'Applicant Name',
      employeeId: 'EMP' + Math.floor(Math.random() * 10000),
      companyName: 'Tech Solutions Pvt Ltd',
      salaryMonth: 'June 2026',
      basic, hra, allowances, gross, deductions, net,
      aiConfidenceScore: Math.floor(Math.random() * 10) + 88,
      checks: {
        nameConsistency: true,
        employerConsistency: true,
        salaryConsistency: true,
        calculationValidation: true,
        documentQuality: true,
        suspiciousModification: false,
      },
    };

    await LoanApplication.findByIdAndUpdate(applicationId, {
      'verification.salary': { status: 'verified', data: mockSalaryData },
    });

    res.json({ success: true, data: mockSalaryData, message: 'Salary verification completed (simulated)' });
  } catch (error) {
    next(error);
  }
};

exports.verifyDigilocker = async (req, res, next) => {
  try {
    const { applicationId } = req.body;
    const mockDigiData = {
      requestId: 'DL-' + Date.now(),
      status: 'verified',
      panVerification: { verified: true, nameMatch: true, dobMatch: true },
      aadhaarVerification: { verified: true, nameMatch: true, dobMatch: true, addressMatch: true },
      source: 'DigiLocker (Simulated)',
    };

    await LoanApplication.findByIdAndUpdate(applicationId, {
      'verification.digilocker': { status: 'verified', data: mockDigiData },
    });

    res.json({ success: true, data: mockDigiData, message: 'DigiLocker verification completed (simulated)' });
  } catch (error) {
    next(error);
  }
};

exports.verifySelfie = async (req, res, next) => {
  try {
    const { applicationId } = req.body;
    const mockSelfieData = {
      faceDetected: true,
      imageQuality: 'Good',
      faceMatchScore: Math.floor(Math.random() * 8) + 90,
      livenessCheck: true,
    };

    await LoanApplication.findByIdAndUpdate(applicationId, {
      'verification.selfie': { status: 'verified', data: mockSelfieData },
    });

    res.json({ success: true, data: mockSelfieData, message: 'Selfie verification completed (simulated)' });
  } catch (error) {
    next(error);
  }
};

exports.verifyLiveness = async (req, res, next) => {
  try {
    const { applicationId } = req.body;
    const mockLivenessData = {
      blinkDetected: true,
      headTurnLeft: true,
      headTurnRight: true,
      smileDetected: true,
      lookStraight: true,
      overallScore: Math.floor(Math.random() * 10) + 90,
      isLive: true,
    };

    await LoanApplication.findByIdAndUpdate(applicationId, {
      'verification.liveness': { status: 'verified', data: mockLivenessData },
    });

    res.json({ success: true, data: mockLivenessData, message: 'Liveness verification completed (simulated)' });
  } catch (error) {
    next(error);
  }
};

exports.generateAiNotes = async (req, res, next) => {
  try {
    const { applicationId } = req.body;
    const application = await LoanApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const cibilScore = application.verification.cibil?.score || 0;
    const riskLevel = cibilScore >= 750 ? 'Low' : cibilScore >= 650 ? 'Medium' : 'High';

    const aiNotes = {
      summary: `The applicant has a ${riskLevel.toLowerCase()} risk credit profile with a CIBIL score of ${cibilScore}. Employment information is consistent across available records. The declared monthly income matches verified salary information.`,
      confidenceScore: Math.floor(Math.random() * 10) + 88,
      riskLevel,
      positiveFindings: [
        'CIBIL score is within acceptable range',
        'Employment details are consistent',
        'Documents are properly uploaded',
      ],
      riskFindings: cibilScore < 650 ? ['CIBIL score is below preferred threshold'] : [],
      missingInformation: [],
      recommendedAction: riskLevel === 'Low' ? 'Proceed to final loan audit' : 'Additional review recommended',
    };

    await LoanApplication.findByIdAndUpdate(applicationId, { aiNotes });

    res.json({ success: true, data: aiNotes });
  } catch (error) {
    next(error);
  }
};
