const express = require('express');
const router = express.Router();
const { verifyCibil, verifyEpf, verifySalary, verifyDigilocker, verifySelfie, verifyLiveness, generateAiNotes } = require('../controllers/verificationController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/cibil', authorize('loan_auditor', 'admin'), verifyCibil);
router.post('/epf', authorize('loan_auditor', 'admin'), verifyEpf);
router.post('/salary', authorize('loan_auditor', 'admin'), verifySalary);
router.post('/digilocker', authorize('loan_auditor', 'admin'), verifyDigilocker);
router.post('/selfie', authorize('loan_auditor', 'admin', 'customer'), verifySelfie);
router.post('/liveness', authorize('loan_auditor', 'admin', 'customer'), verifyLiveness);
router.post('/ai-notes', authorize('loan_auditor', 'admin'), generateAiNotes);

module.exports = router;
