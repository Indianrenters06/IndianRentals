const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const PendingSignup = require('../models/PendingSignup');
const generateToken = require('../utils/generateToken');
const { createNotification } = require('./notificationController');

const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');
const { sendTemplatedEmail } = require('../utils/sendTemplatedEmail');

const crypto = require('crypto');
const { userResponse } = require('../utils/userResponse');
const { requireActiveAccount } = require('../utils/accountAccess');
const { currentVersionFilter } = require('../utils/sessionVersion');
const OTP_SELECTION = '+emailOtp +phoneOtp +otpExpires +otpAttempts +otpPurpose';
const requireOtpPurpose = (user, purposes, res) => {
    if (!purposes.includes(user.otpPurpose)) {
        res.status(400);
        throw new Error('Please request a new code for this verification');
    }
};

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
        user.otpPurpose = undefined;
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
        console.log('[DEV OTP] Verification code generated; delivery details are not logged.');
    }
};

// @desc    Register a new user & Send OTPs
// @route   POST /api/auth/register
// @access  Public
const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Without an email the query below would be `{}` and match any account —
    // including mobile-only ones that have no password to compare against.
    if (typeof email !== 'string' || !email || typeof password !== 'string' || !password) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    const user = await User.findOne({ email }).select('+password');

    if (user && user.password && (await user.matchPassword(password))) {
        requireActiveAccount(user, res);
        if (user.role === 'customer') {
            res.status(401);
            throw new Error('Not authorized to access the admin panel');
        }

        const token = generateToken(res, user);

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
        otpPurpose: 'signup',
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
            console.error('Email send failed:');
            // Don't fail the registration, just let them resend or handle it
        }

        // Send SMS
        try {
            await sendSMS({
                phone: user.phone,
                message: `Your Phone OTP is: ${phoneOtp}`,
            });
        } catch (error) {
            console.error('SMS send failed:');
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

    const user = await User.findById(userId).select(OTP_SELECTION);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    requireActiveAccount(user, res);
    requireOtpPurpose(user, ['signup', 'login'], res);
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
    user.otpPurpose = undefined;
    user.otpAttempts = 0;
    // Verification completes signup and issues a session, so it counts as a login.
    user.lastLogin = new Date();
    await user.save();

    // Send the Welcome email now that the account is fully verified.
    sendTemplatedEmail('Welcome Email', user.email, {
        userName: user.name,
        email: user.email,
    });

    const token = generateToken(res, user);

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        kyc: userResponse(user).kyc,
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
        requireActiveAccount(user, res);

        // Generate new OTPs even for login (2FA)
        const emailOtp = generateOTP();
        const phoneOtp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Update user
        user.emailOtp = emailOtp;
        user.phoneOtp = phoneOtp;
        user.otpExpires = otpExpires;
        user.otpAttempts = 0;
        user.otpPurpose = 'login';
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
            console.error('Email send failed:');
        }

        // Send SMS
        try {
            await sendSMS({
                phone: user.phone,
                message: `Your Login OTP is: ${phoneOtp}`,
            });
        } catch (error) {
            console.error('SMS send failed:');
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

// @desc    Revoke all account sessions, then clear this browser's cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
    let result;
    try {
        result = await User.updateOne(
            { _id: req.user._id, ...currentVersionFilter(req.user) },
            { $inc: { sessionVersion: 1 } },
        );
    } catch {
        res.status(503);
        throw new Error('Could not end your sessions. Please try again');
    }
    if (result.matchedCount !== 1) {
        res.status(401);
        throw new Error('Session already ended. Please sign in again');
    }
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0),
    });
    res.setHeader('Cache-Control', 'no-store, private');
    res.status(200).json({ message: 'Logged out successfully' });
});

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

    requireActiveAccount(user, res);

    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.otpExpires = otpExpires;
    user.otpAttempts = 0;
    user.otpPurpose = 'login';

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
            console.error('Email send failed (Network Error?):');
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
            console.error('SMS send failed:');
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

    const user = await User.findOne(query).select(OTP_SELECTION);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    requireActiveAccount(user, res);
    requireOtpPurpose(user, ['login'], res);
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
    user.otpPurpose = undefined;
    user.otpAttempts = 0;
    // This is the customer login path — the password step above only sends an OTP.
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(res, user);

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

    requireActiveAccount(user, res);

    const otp = generateOTP();
    user.emailOtp = otp;
    user.phoneOtp = undefined;
    user.otpPurpose = 'admin_reset';
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
        console.error('Failed to send reset OTP email:');
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

    const user = await User.findOne({ email }).select(`+password ${OTP_SELECTION}`);
    if (!user || user.role === 'customer') {
        res.status(404);
        throw new Error('Admin account not found');
    }

    requireActiveAccount(user, res);
    requireOtpPurpose(user, ['admin_reset'], res);
    if (!user.emailOtp || otpExpired(user)) {
        res.status(400);
        throw new Error('OTP expired. Please request a new one.');
    }

    if (!otpMatches(user.emailOtp, otp)) {
        await rejectWrongOtp(user, res, 'Invalid OTP');
    }

    user.password = newPassword;
    // Consume exactly the verified recovery code in the same update as the
    // password hash and the model's atomic session-version increment.
    user.$where = { ...(user.$where || {}), emailOtp: user.emailOtp,
        otpPurpose: 'admin_reset', otpExpires: user.otpExpires };
    user.emailOtp = undefined;
    user.phoneOtp = undefined;
    user.otpPurpose = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    try { await user.save(); }
    catch (error) {
        if (error.name === 'DocumentNotFoundError' || error.name === 'VersionError') {
            res.status(409);
            throw new Error('This recovery code was already used or changed. Please request a new one');
        }
        throw error;
    }

    res.json({ message: 'Password reset successfully. You can now log in.' });
});

const { OAuth2Client } = require('google-auth-library');
const googleAudience = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(googleAudience);

// @desc    Google Sign In / Register
// @route   POST /api/auth/google-login
// @access  Public
const googleLogin = asyncHandler(async (req, res) => {
    const { access_token } = req.body;

    if (!access_token) {
        res.status(400);
        throw new Error('No Google access_token provided');
    }

    if (!googleAudience) { res.status(503); throw new Error('Google sign-in is not configured'); }
    let payload;
    try {
        const info = await googleClient.getTokenInfo(access_token);
        if (info.aud !== googleAudience || info.expiry_date <= Date.now()) throw new Error('Invalid Google token audience');
        const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        if (!userInfoRes.ok) {
            console.error('Google userInfo endpoint failed');
            res.status(401);
            throw new Error('Invalid Google access token');
        }

        payload = await userInfoRes.json();
    } catch (googleErr) {
        console.error('Google API error:');
        res.status(401);
        throw new Error('Invalid Google access token');
    }

    const { email, name, picture, sub } = payload;
    if (!email || !sub || payload.email_verified !== true) {
        res.status(400);
        throw new Error('A verified Google email is required');
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
                role: 'customer',
            });

            await createNotification({
                title: 'New User Registered (Google)',
                message: `User ${user.name} (${user.email}) just joined IndianRentals via Google.`,
                type: 'user',
                relatedId: user._id
            });
        } else {
            requireActiveAccount(user, res);
            if (user.googleId && user.googleId !== sub) { res.status(401); throw new Error('Google identity does not match this account'); }
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

        const token = generateToken(res, user);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || '',
            avatar: user.avatar || '',
            kyc: userResponse(user).kyc,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified || false,
            token: token,
        });
    } catch (dbErr) {
        console.error('Database error during Google login:');
        res.status(dbErr.statusCode || (res.statusCode >= 400 ? res.statusCode : 500));
        throw new Error(dbErr.message || 'Error processing Google login in database');
    }
});

// Mobile numbers are stored as "+91XXXXXXXXXX" — the same form /send-otp looks them up by.
const INDIAN_MOBILE = /^\+91[6-9]\d{9}$/;

// @desc    Mobile sign-up, step 1: hold the details and SMS a code
// @route   POST /api/auth/register-otp
// @access  Public
const sendRegisterOtp = asyncHandler(async (req, res) => {
    const { name, phone, acceptTerms } = req.body;

    if (typeof name !== 'string' || !name.trim()) {
        res.status(400);
        throw new Error('Please enter your name.');
    }
    if (typeof phone !== 'string' || !INDIAN_MOBILE.test(phone)) {
        res.status(400);
        throw new Error('Please enter a valid 10-digit mobile number.');
    }
    if (acceptTerms !== true) {
        res.status(400);
        throw new Error('Please accept the Terms and Privacy Policy.');
    }

    const Settings = require('../models/Settings');
    const settings = await Settings.findOne();
    if (settings && settings.allowRegistrations === false) {
        res.status(403);
        throw new Error('New registrations are currently disabled by the administrator.');
    }

    if (await User.exists({ phone })) {
        res.status(400);
        throw new Error('An account with this number already exists. Please sign in instead.');
    }

    const otp = generateOTP();
    await PendingSignup.findOneAndUpdate(
        { phone },
        {
            name: name.trim(),
            otp,
            otpAttempts: 0,
            termsAcceptedAt: new Date(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        },
        { upsert: true, setDefaultsOnInsert: true }
    );

    try {
        await sendSMS({ phone, message: `Your IndianRenters verification code is: ${otp}` });
    } catch (error) {
        console.error('SMS send failed:');
    }
    logOtpForDev(phone, otp);

    res.json({ message: 'Verification code sent to your phone' });
});

// @desc    Mobile sign-up, step 2: check the code, then create the account
// @route   POST /api/auth/register-verify
// @access  Public
const verifyRegisterOtp = asyncHandler(async (req, res) => {
    const { phone, otp } = req.body;

    if (typeof phone !== 'string' || !INDIAN_MOBILE.test(phone) || !otp) {
        res.status(400);
        throw new Error('Please provide your mobile number and the code.');
    }

    const pending = await PendingSignup.findOne({ phone });
    if (!pending || pending.expiresAt < Date.now()) {
        res.status(400);
        throw new Error('Code expired. Please request a new one.');
    }

    if (!otpMatches(pending.otp, otp)) {
        pending.otpAttempts += 1;
        if (pending.otpAttempts >= MAX_OTP_ATTEMPTS) {
            await pending.deleteOne();
            res.status(429);
            throw new Error('Too many wrong attempts. Please request a new code.');
        }
        await pending.save();
        res.status(400);
        throw new Error('That code is incorrect. Please check it and try again.');
    }

    // The number may have been registered while this code was pending.
    if (await User.exists({ phone })) {
        await pending.deleteOne();
        res.status(400);
        throw new Error('An account with this number already exists. Please sign in instead.');
    }

    const user = await User.create({
        name: pending.name,
        phone,
        authProvider: 'phone',
        role: 'customer',
        isPhoneVerified: true,
        lastLogin: new Date(),
    });
    await pending.deleteOne();

    await createNotification({
        title: 'New User Registered',
        message: `User ${user.name} (${user.phone}) just joined IndianRentals.`,
        type: 'user',
        relatedId: user._id
    });

    const token = generateToken(res, user);

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email || '',
        phone: user.phone,
        role: user.role,
        avatar: user.avatar || '',
        kyc: userResponse(user).kyc,
        isEmailVerified: false,
        isPhoneVerified: true,
        token: token,
    });
});

module.exports = {
    registerUser,
    sendRegisterOtp,
    verifyRegisterOtp,
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
