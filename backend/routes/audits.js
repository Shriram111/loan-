const express = require('express');
const router = express.Router();
const { getAuditDashboard, getApplicationForAudit, submitAudit, generateReport } = require('../controllers/auditController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('loan_auditor', 'admin'));
router.get('/dashboard', getAuditDashboard);
router.get('/:applicationId', getApplicationForAudit);
router.post('/:applicationId', submitAudit);
router.post('/:applicationId/report', generateReport);

module.exports = router;
