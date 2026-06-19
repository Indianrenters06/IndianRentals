const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    submitKYC,
    getAllUsers,
    updateKYCStatus,
    getUserById,
    deleteUser,
    updateUser,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getAllUsers);

router.post('/kyc', protect, submitKYC);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Saved addresses for the logged-in user.
// NOTE: must be declared before the '/:id' routes below, otherwise
// '/addresses' gets captured as an :id and routed to the admin handlers.
router.route('/addresses')
    .get(protect, getAddresses)
    .post(protect, addAddress);
router.route('/addresses/:addressId')
    .put(protect, updateAddress)
    .delete(protect, deleteAddress);

router.put('/:id/kyc', protect, admin, updateKYCStatus);

router.route('/:id')
    .delete(protect, admin, deleteUser)
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser);

module.exports = router;
