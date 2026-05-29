const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    verifyOtp,
    adminLogin,
    sendLoginOtp,
    verifyLoginOtp,
    adminForgotPassword,
    adminResetPassword,
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', adminLogin);
router.post('/logout', logoutUser);
router.post('/verify', verifyOtp);
router.post('/send-otp', sendLoginOtp);
router.post('/verify-login', verifyLoginOtp);
router.post('/admin-forgot-password', adminForgotPassword);
router.post('/admin-reset-password', adminResetPassword);

module.exports = router;
