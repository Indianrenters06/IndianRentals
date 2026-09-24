const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { createNotification } = require('./notificationController');

const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');
const { sendTemplatedEmail } = require('../utils/sendTemplatedEmail');

const crypto = require('crypto');

// Generate 6-digit OTP (crypto RNG — Math.random is predictable)
const generateOTP = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

const MAX_OTP_ATTEMPTS = 5;

// True only when an OTP is actually pending and the submitted one matches.
// Guards against `undefined === undefined` passing once the OTP was cleared.
const otpMatches = (stored, given) =>
    typeof given === 'string' && (given = given.trim()) &&
    typeof stored === 'string' && stored.length > 0 &&
    typeof given === 'string' && given.length === stored.length &&
    crypto.timingSafeEqual(Buffer.from(stored), Buffer.from(given));

const otpExpired = (user) => !user.otpExpires || user.otpExpires < Date.now();

// Count a wrong guess; after MAX_OTP_ATTEMPTS the OTP is voided so a
// 6-digit code can't be brute-forced within its 10-minute window.
const rejectWrongOtp = async (user, res, message) => {
    user.otpAttempts = (user.otpAttempts || 0) + 1;
    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
        user.emailOtp = undefined;
        user.phoneOtp = undefined;
        user.otpExpires = undefined;
        user.otpAttempts = 0;
        await user.save();
        res.status(429);
        throw new Error('Too many wrong attempts. Please request a new OTP.');
    }
    await user.save();
    res.status(400);
    throw new Error(message);
};

// An OTP must never travel back in the HTTP response — /send-otp is public and
// unauthenticated, so returning it there hands out a login for any account.
// Outside production, log it to the server console instead so local testing
// still works when email/SMS delivery is down.
const logOtpForDev = (target, otp) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`[DEV OTP] ${target} -> ${otp}`);
    }
};

// @desc    Register a new user & Send OTPs
// @route   POST /api/auth/register
// @access  Public
const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        if (user.role === 'customer') {
            res.status(401);
            throw new Error('Not authorized to access the admin panel');
        }

        const token = generateToken(res, user._id);

        // Admin sign-in has no OTP step, so the session starts here.
        await User.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            adminPermissions: user.adminPermissions || [],
            token: token,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user & Send OTPs
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const Settings = require('../models/Settings');
    const settings = await Settings.findOne();
    if (settings && settings.allowRegistrations === false) {
        res.status(403);
        throw new Error('New registrations are currently disabled by the administrator.');
    }

    const emailOtp = generateOTP();
    const phoneOtp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const user = await User.create({
        name,
        email,
        password,
        phone,
        // Never trust a client-sent role — admin/staff accounts are created
        // only from the admin panel (Settings > Team).
        role: 'customer',
        emailOtp,
        phoneOtp,
        otpExpires,
        otpAttempts: 0,
        isEmailVerified: false,
        isPhoneVerified: false,
    });

    if (user) {
        // Send Email OTP — try the admin "OTP Verification" template first,
        // fall back to a plain message so the OTP always reaches the user.
        try {
            const sentViaTemplate = await sendTemplatedEmail('OTP Verification', user.email, {
                USER_NAME: user.name,
                OTP_CODE: emailOtp,
                EXPIRY_MINUTES: 10,
                purpose: 'verify your email address',
            });
            if (!sentViaTemplate) {
                await sendEmail({
                    email: user.email,
                    subject: 'IndianRentals - Verify your Email',
                    message: `Your Email OTP for IndianRentals is: ${emailOtp}`,
                });
            }
        } catch (error) {
            console.error('Email send failed:', error);
            // Don't fail the registration, just let them resend or handle it
        }

        // Send SMS
        try {
            await sendSMS({
                phone: user.phone,
                message: `Your Phone OTP is: ${phoneOtp}`,
            });
        } catch (error) {
            console.error('SMS send failed:', error);
        }

        await createNotification({
            title: 'New User Registered',
            message: `User ${name} (${email}) just joined IndianRentals.`,
            type: 'user',
            relatedId: user._id
        });

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

    if (otpExpired(user)) {
        res.status(400);
        throw new Error('OTP expired. Please resend.');
    }

    // Verify Email OTP
    if (!otpMatches(user.emailOtp, emailOtp)) {
        await rejectWrongOtp(user, res, 'Invalid Email OTP');
    }

    // Verify Phone OTP (Optional: You can enforce only one or both. Requirements said "both")
    if (!otpMatches(user.phoneOtp, phoneOtp)) {
        await rejectWrongOtp(user, res, 'Invalid Phone OTP');
    }

    // If successful
    user.isEmailVerified = true;
    user.isPhoneVerified = true;
    user.emailOtp = undefined;
    user.phoneOtp = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    // Verification completes signup and issues a session, so it counts as a login.
    user.lastLogin = new Date();
    await user.save();

    // Send the Welcome email now that the account is fully verified.
    sendTemplatedEmail('Welcome Email', user.email, {
        userName: user.name,
        email: user.email,
    });

    const token = generateToken(res, user._id);

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
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
        user.otpAttempts = 0;
        await user.save();

        // Send Email
        try {
            const sentViaTemplate = await sendTemplatedEmail('OTP Verification', user.email, {
                USER_NAME: user.name,
                OTP_CODE: emailOtp,
                EXPIRY_MINUTES: 10,
                purpose: 'log in to your account',
            });
            if (!sentViaTemplate) {
                await sendEmail({
                    email: user.email,
                    subject: 'IndianRentals - Login OTP',
                    message: `Your Login OTP is: ${emailOtp}`,
                });
            }
        } catch (error) {
            console.error('Email send failed:', error);
        }

        // Send SMS
        try {
            await sendSMS({
                phone: user.phone,
                message: `Your Login OTP is: ${phoneOtp}`,
            });
        } catch (error) {
            console.error('SMS send failed:', error);
        }

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

// @desc    Send OTP for Login (Email or Phone)
// @route   POST /api/auth/send-otp
// @access  Public
const sendLoginOtp = asyncHandler(async (req, res) => {
    const { identifier } = req.body;

    if (!identifier) {
        res.status(400);
        throw new Error('Please provide email or phone number');
    }

    // Check if identifier is email or phone
    const isEmail = identifier.includes('@');
    const query = isEmail ? { email: identifier } : { phone: identifier };

    const user = await User.findOne(query);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.otpExpires = otpExpires;
    user.otpAttempts = 0;

    if (isEmail) {
        user.emailOtp = otp;
        user.phoneOtp = undefined; // Clear other OTP to avoid confusion? Or just keep it.

        await user.save();

        try {
            const sentViaTemplate = await sendTemplatedEmail('OTP Verification', user.email, {
                USER_NAME: user.name,
                OTP_CODE: otp,
                EXPIRY_MINUTES: 10,
                purpose: 'log in to your account',
            });
            if (!sentViaTemplate) {
                await sendEmail({
                    email: user.email,
                    subject: 'IndianRentals - Login OTP',
                    message: `Your Login OTP for IndianRentals is: ${otp}`,
                });
            }
        } catch (error) {
            console.error('Email send failed (Network Error?):', error);
            // Non-blocking failure: proceed so user can still login using Network Tab OTP
        }
        logOtpForDev(user.email, otp);
        res.json({ message: 'OTP sent to your email', type: 'email' });

    } else {
        user.phoneOtp = otp;
        user.emailOtp = undefined;

        await user.save();

        // Send SMS
        try {
            await sendSMS({
                phone: user.phone,
                message: `Your Login OTP is: ${otp}`,
            });
        } catch (error) {
            console.error('SMS send failed:', error);
            // res.status(500);
            // throw new Error('SMS could not be sent');
        }
        logOtpForDev(user.phone, otp);
        res.json({
            message: 'OTP sent to your phone',
            type: 'phone',
        });
    }
});

// @desc    Verify Login OTP
// @route   POST /api/auth/verify-login
// @access  Public
const verifyLoginOtp = asyncHandler(async (req, res) => {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
        res.status(400);
        throw new Error('Please provide identifier and OTP');
    }

    const isEmail = identifier.includes('@');
    const query = isEmail ? { email: identifier } : { phone: identifier };

    const user = await User.findOne(query);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (otpExpired(user)) {
        res.status(400);
        throw new Error('OTP expired. Please request a new one.');
    }

    const isValid = otpMatches(isEmail ? user.emailOtp : user.phoneOtp, otp);

    if (!isValid) {
        await rejectWrongOtp(user, res, 'Invalid OTP');
    }

    // Only mark verified the channel the OTP was actually proven on.
    if (isEmail) user.isEmailVerified = true;
    else user.isPhoneVerified = true;

    user.emailOtp = undefined;
    user.phoneOtp = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    // This is the customer login path — the password step above only sends an OTP.
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(res, user._id);

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isAdmin: user.isAdmin || false,
        token: token,
    });
});

const adminForgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) { res.status(400); throw new Error('Please provide your email'); }

    const user = await User.findOne({ email });
    if (!user || user.role === 'customer') {
        // Return a generic message so email enumeration is not possible
        return res.json({ message: 'If that email belongs to an admin account, an OTP has been sent.' });
    }

    const otp = generateOTP();
    user.emailOtp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.otpAttempts = 0;
    await user.save();

    try {
        await sendEmail({
            email: user.email,
            subject: 'IndianRentals Admin – Password Reset OTP',
            message: `Your password reset OTP is: ${otp}\n\nThis OTP is valid for 10 minutes. Do not share it with anyone.`,
        });
    } catch (err) {
        console.error('Failed to send reset OTP email:', err);
        res.status(500);
        throw new Error('Failed to send OTP email. Please try again.');
    }

    res.json({ message: 'OTP sent to your email address.' });
});

const adminResetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        res.status(400);
        throw new Error('Please provide email, OTP, and new password');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || user.role === 'customer') {
        res.status(404);
        throw new Error('Admin account not found');
    }

    if (!user.emailOtp || otpExpired(user)) {
        res.status(400);
        throw new Error('OTP expired. Please request a new one.');
    }

    if (!otpMatches(user.emailOtp, otp)) {
        await rejectWrongOtp(user, res, 'Invalid OTP');
    }

    user.password = newPassword;
    user.emailOtp = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });
});

const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'dummy-client-id');

// @desc    Google Sign In / Register
// @route   POST /api/auth/google-login
// @access  Public
const googleLogin = asyncHandler(async (req, res) => {
    const { access_token } = req.body;

    if (!access_token) {
        res.status(400);
        throw new Error('No Google access_token provided');
    }

    let payload;
    try {
        const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        if (!userInfoRes.ok) {
            const errText = await userInfoRes.text();
            console.error('Google userInfo endpoint failed:', userInfoRes.status, errText);
            res.status(401);
            throw new Error('Failed to verify token with Google: ' + (errText || userInfoRes.statusText));
        }

        payload = await userInfoRes.json();
    } catch (googleErr) {
        console.error('Google API error:', googleErr);
        res.status(401);
        throw new Error(googleErr.message || 'Invalid Google access_token');
    }

    const { email, name, picture, sub } = payload;
    if (!email) {
        res.status(400);
        throw new Error('Google account did not return an email address');
    }

    try {
        let user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Register new user via Google
            const Settings = require('../models/Settings');
            const settings = await Settings.findOne();
            if (settings && settings.allowRegistrations === false) {
                res.status(403);
                throw new Error('New registrations are currently disabled by the administrator.');
            }

            user = await User.create({
                name: name || email.split('@')[0],
                email: email.toLowerCase(),
                phone: '',
                authProvider: 'google',
                googleId: sub || '',
                isEmailVerified: true,
                avatar: picture || '',
                password: `GoogleAuth_${crypto.randomBytes(8).toString('hex')}!Aa1`,
                role: 'customer',
            });

            await createNotification({
                title: 'New User Registered (Google)',
                message: `User ${user.name} (${user.email}) just joined IndianRentals via Google.`,
                type: 'user',
                relatedId: user._id
            });
        } else {
            // Existing user: link Google ID, verify email, update avatar if empty
            if (!user.avatar && picture) {
                user.avatar = picture;
            }
            if (!user.googleId && sub) {
                user.googleId = sub;
            }
            if (!user.isEmailVerified) {
                user.isEmailVerified = true;
            }
        }

        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(res, user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || '',
            avatar: user.avatar || '',
            kyc: user.kyc,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified || false,
            token: token,
        });
    } catch (dbErr) {
        console.error('Database error during Google login:', dbErr);
        res.status(500);
        throw new Error(dbErr.message || 'Error processing Google login in database');
    }
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    verifyOtp,
    sendLoginOtp,
    verifyLoginOtp,
    adminLogin,
    adminForgotPassword,
    adminResetPassword,
    googleLogin,
};
