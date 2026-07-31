const express = require('express');
const router = express.Router();
const { getUsers, updateUser, getAnalytics, getAuditLogs } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.get('/analytics', getAnalytics);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
