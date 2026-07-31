const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { createOrUpdateKYC, getKYCStatus, uploadKYCDocuments, getAllKYC, updateKYCStatus, downloadKYCDocument } = require('../controllers/kycController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createOrUpdateKYC);
router.get('/', protect, getKYCStatus);

// Accept all field names used by both the checkout and profile KYC forms
router.post('/upload', protect, upload.fields([
    { name: 'identityProof', maxCount: 1 },   // checkout form
    { name: 'addressProof', maxCount: 1 },    // checkout form
    { name: 'bankStatement', maxCount: 1 },   // checkout form
    { name: 'aadharFront', maxCount: 1 },     // profile form
    { name: 'aadharBack', maxCount: 1 },      // profile form
    { name: 'panCard', maxCount: 1 },         // profile form
    { name: 'photo', maxCount: 1 },           // selfie / photo
]), uploadKYCDocuments);

// Admin Routes
router.get('/admin/all', protect, admin, getAllKYC);
// Declared before '/admin/:id' so the literal segment is not swallowed by the param route.
router.get('/admin/:id/document/:field', protect, admin, downloadKYCDocument);
router.put('/admin/:id', protect, admin, updateKYCStatus);

module.exports = router;
