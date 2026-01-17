const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getDashboardStats, getCitizens, uploadNINs } = require('../controllers/adminController');
const docUpload = require('../utils/docUpload');

// All routes are protected
router.use(protect);

router.get('/stats', authorize('admin', 'board', 'officer_read'), getDashboardStats);
router.get('/citizens', authorize('admin', 'officer_read', 'officer_engagement'), getCitizens);
router.post('/upload-nins', authorize('admin', 'officer_upload'), docUpload.single('csvFile'), uploadNINs);

module.exports = router;
