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

module.exports = router;
