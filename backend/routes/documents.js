const express = require('express');
const router = express.Router();
const { uploadDocument, getDocuments, verifyDocument, deleteDocument } = require('../controllers/documentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);
router.post('/upload', upload.single('file'), uploadDocument);
router.get('/:applicationId', getDocuments);
router.put('/:id/verify', authorize('loan_auditor', 'admin'), verifyDocument);
router.delete('/:id', deleteDocument);

module.exports = router;
