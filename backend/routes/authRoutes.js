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
    googleLogin,
} = require('../controllers/authController');

const rateLimit = require('express-rate-limit');

// Per-IP limits (req.ip is the real client — see 'trust proxy' in index.js).
// Kept loose enough for offices behind one shared IP; OTP brute force is
// also capped per-OTP in the controller.
const limiter = (max, message) => rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: max,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { message },
});
// Password / account creation attempts
const loginLimiter = limiter(20, 'Too many login attempts. Please try again in 15 minutes.');
// Anything that sends an email/SMS (costs money, can be used to spam)
const sendOtpLimiter = limiter(10, 'Too many OTP requests. Please try again in 15 minutes.');
// OTP guesses (also capped per-OTP in the controller)
const verifyLimiter = limiter(20, 'Too many verification attempts. Please try again in 15 minutes.');

router.post('/register', sendOtpLimiter, registerUser);
router.post('/login', loginLimiter, sendOtpLimiter, loginUser);
router.post('/admin-login', loginLimiter, adminLogin);
router.post('/logout', logoutUser);
router.post('/verify', verifyLimiter, verifyOtp);
router.post('/send-otp', sendOtpLimiter, sendLoginOtp);
router.post('/verify-login', verifyLimiter, verifyLoginOtp);
router.post('/admin-forgot-password', sendOtpLimiter, adminForgotPassword);
router.post('/admin-reset-password', verifyLimiter, adminResetPassword);
router.post('/google-login', loginLimiter, googleLogin);

module.exports = router;
