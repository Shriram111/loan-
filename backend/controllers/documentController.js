const Document = require('../models/Document');
const LoanApplication = require('../models/LoanApplication');
const path = require('path');

exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const document = await Document.create({
      applicationId: req.body.applicationId,
      userId: req.user._id,
      documentType: req.body.documentType,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      status: 'uploaded',
    });

    await LoanApplication.findByIdAndUpdate(req.body.applicationId, { $push: { documents: document._id } });

    res.status(201).json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
};

exports.getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ applicationId: req.params.applicationId })
      .populate('verifiedBy', 'fullName')
      .sort('-createdAt');
    res.json({ success: true, data: documents });
  } catch (error) {
    next(error);
  }
};

exports.verifyDocument = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { status, verificationRemarks: remarks, verifiedBy: req.user._id, verifiedAt: new Date() },
      { new: true }
    );
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.json({ success: true, data: document });
  } catch (error) {
    next(error);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    await LoanApplication.findByIdAndUpdate(document.applicationId, { $pull: { documents: document._id } });
    res.json({ success: true, message: 'Document deleted' });
  } catch (error) {
    next(error);
  }
};
