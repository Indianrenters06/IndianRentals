const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    verifyOtp
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/verify', verifyOtp);
router.post('/send-otp', require('../controllers/authController').sendLoginOtp);
router.post('/verify-login', require('../controllers/authController').verifyLoginOtp);

module.exports = router;
