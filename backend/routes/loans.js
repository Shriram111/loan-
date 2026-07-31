const express = require('express');
const router = express.Router();
const { createApplication, getApplications, getApplication, updateApplication, deleteApplication, submitApplication, assignOfficer } = require('../controllers/loanController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/', createApplication);
router.get('/', getApplications);
router.get('/:id', getApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);
router.post('/:id/submit', submitApplication);
router.put('/:id/assign', authorize('admin'), assignOfficer);

module.exports = router;
