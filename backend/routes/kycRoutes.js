const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { createOrUpdateKYC, getKYCStatus, uploadKYCDocuments, getAllKYC, updateKYCStatus } = require('../controllers/kycController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createOrUpdateKYC);
router.get('/', protect, getKYCStatus);
router.post('/upload', protect, upload.fields([
    { name: 'identityProof', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 },
    { name: 'bankStatement', maxCount: 1 }
]), uploadKYCDocuments);

// Admin Routes
router.get('/admin/all', protect, admin, getAllKYC);
router.put('/admin/:id', protect, admin, updateKYCStatus);

module.exports = router;
