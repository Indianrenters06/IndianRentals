const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    submitKYC,
    getAllUsers,
    updateKYCStatus
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getAllUsers);

router.post('/kyc', protect, submitKYC);
router.get('/profile', protect, getUserProfile);

router.put('/:id/kyc', protect, admin, updateKYCStatus);

module.exports = router;
