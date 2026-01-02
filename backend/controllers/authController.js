const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const sendEmail = require('../utils/sendEmail');

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register a new user & Send OTPs
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const emailOtp = generateOTP();
    const phoneOtp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const user = await User.create({
        name,
        email,
        password,
        phone,
        role: role || 'customer',
        emailOtp,
        phoneOtp,
        otpExpires,
        isEmailVerified: false,
        isPhoneVerified: false,
    });

    if (user) {
        // Send Email
        const message = `Your Email OTP for IndianRentals is: ${emailOtp}`;
        try {
            await sendEmail({
                email: user.email,
                subject: 'IndianRentals - Verify your Email',
                message,
            });
        } catch (error) {
            console.error('Email send failed:', error);
            // Don't fail the registration, just let them resend or handle it
        }

        // Send SMS (Mock for now)
        console.log(`[MOCK SMS] To: ${user.phone}, Message: Your Phone OTP is: ${phoneOtp}`);

        res.status(201).json({
            message: 'Registration successful. Please verify your email and phone.',
            userId: user._id,
            email: user.email,
            phone: user.phone,
            // In dev mode, maybe send OTPs in response for easy testing? 
            // Let's keep it secure-ish but log it on server console.
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Verify OTPs and Login
// @route   POST /api/auth/verify
// @access  Public
const verifyOtp = asyncHandler(async (req, res) => {
    const { userId, emailOtp, phoneOtp } = req.body;

    const user = await User.findById(userId).select('+password'); // select if needed, but we just need otps

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.otpExpires < Date.now()) {
        res.status(400);
        throw new Error('OTP expired. Please resend.');
    }

    // Verify Email OTP
    if (user.emailOtp !== emailOtp) {
        res.status(400);
        throw new Error('Invalid Email OTP');
    }

    // Verify Phone OTP (Optional: You can enforce only one or both. Requirements said "both")
    if (user.phoneOtp !== phoneOtp) {
        res.status(400);
        throw new Error('Invalid Phone OTP');
    }

    // If successful
    user.isEmailVerified = true;
    user.isPhoneVerified = true;
    user.emailOtp = undefined;
    user.phoneOtp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(res, user._id);

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        kyc: user.kyc,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        token: token,
    });
});

// @desc    Auth user & Send OTP (2FA)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {

        // Generate new OTPs even for login (2FA)
        const emailOtp = generateOTP();
        const phoneOtp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Update user
        user.emailOtp = emailOtp;
        user.phoneOtp = phoneOtp;
        user.otpExpires = otpExpires;
        await user.save();

        // Send Email
        try {
            await sendEmail({
                email: user.email,
                subject: 'IndianRentals - Login OTP',
                message: `Your Login OTP is: ${emailOtp}`,
            });
        } catch (error) {
            console.error('Email send failed:', error);
        }

        // Mock SMS
        console.log(`[MOCK SMS] To: ${user.phone}, Message: Your Login OTP is: ${phoneOtp}`);

        res.json({
            message: 'OTP sent to email and phone',
            userId: user._id,
            email: user.email,
            phone: user.phone,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    verifyOtp,
};
