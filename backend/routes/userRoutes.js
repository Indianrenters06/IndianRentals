const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    submitKYC,
    getAllUsers,
    updateKYCStatus,
    getUserById,
    deleteUser,
    updateUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getAllUsers);

router.post('/kyc', protect, submitKYC);
router.get('/profile', protect, getUserProfile);

router.put('/:id/kyc', protect, admin, updateKYCStatus);

router.route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser);

module.exports = router;
