const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { userResponse } = require('../utils/userResponse');

const addressSchema = new mongoose.Schema({
    name: { type: String, trim: true, default: '' },
    addressLine: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    pincode: { type: String, trim: true, default: '' },
    country: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    isBillingSame: { type: Boolean, default: false },
    isDefault: { type: Boolean, default: false }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true
    },
    // Mobile-only sign-ups ('phone' provider) have no email until they add one
    // in their profile. `sparse` lets any number of them leave it unset; the
    // live index is migrated by scripts/make_email_index_sparse.js.
    email: {
        type: String,
        required: [function () { return this.authProvider !== 'phone'; }, 'Please provide your email'],
        unique: true,
        sparse: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: function () {
            return this.authProvider === 'local';
        },
        // Complexity is enforced ONLY when the password is actually being set or
        // changed (i.e. it's still plaintext). On every other save() the stored
        // value is a bcrypt hash — which contains '.' and '/' and would always
        // fail the complexity regex — so we must skip it for unmodified passwords.
        // Without this guard, saving any existing user (e.g. login's 2FA OTP save,
        // KYC status sync) throws a validation error and breaks the flow.
        validate: {
            validator: function (value) {
                if (!this.isModified('password')) return true;
                if (!value && this.authProvider === 'google') return true;
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
            },
            message: 'Password must be at least 8 characters and contain an uppercase letter, a lowercase letter, a number, and a special character'
        },
        select: false // Don't return password by default
    },
    phone: {
        type: String,
        default: '',
        required: function () {
            return this.authProvider === 'local' || this.authProvider === 'phone';
        }
    },
    // local = email + password, google = Google OAuth, phone = mobile OTP only
    authProvider: {
        type: String,
        enum: ['local', 'google', 'phone'],
        default: 'local'
    },
    googleId: {
        type: String,
        default: ''
    },
    // Cloudinary URL of the profile picture. Empty means "use the default icon".
    avatar: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'staff', 'super_admin', 'operations_manager', 'sales_executive', 'finance_executive'],
        default: 'customer'
    },
    sessionVersion: {
        type: Number,
        // Do not hydrate a default onto legacy records: a later unrelated save
        // must never overwrite a concurrent logout's increment with zero.
        default: function () { return this.isNew ? 0 : undefined; },
        min: 0,
        validate: { validator: Number.isSafeInteger, message: 'Invalid session version' },
    },
    // For staff members: which admin sections they can access
    // e.g. ['cms', 'products', 'orders', 'inventory', 'users', 'kyc', 'payments', 'coupons', 'reports', 'notifications', 'settings']
    adminPermissions: {
        type: [String],
        default: []
    },
    // Transaction write lock shared with KYC review/resubmission.
    checkoutGuardRevision: { type: Number, default: 0, select: false },
    kyc: {
        status: {
            type: String,
            enum: ['not_submitted', 'pending', 'approved', 'rejected'],
            default: 'not_submitted'
        },
        documentType: {
            type: String, // e.g., 'Aadhar', 'PAN', 'Passport'
        },
        documentNumber: {
            type: String,
        },
        documentImage: {
            type: String, // URL to the uploaded image
        },
        submittedAt: {
            type: Date
        },
        rejectionReason: {
            type: String
        }
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isPhoneVerified: {
        type: Boolean,
        default: false,
    },
    emailOtp: {
        type: String,
        select: false,
    },
    phoneOtp: {
        type: String,
        select: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    blockedReason: {
        type: String,
        default: ''
    },
    otpExpires: {
        type: Date,
        select: false,
    },
    // Wrong guesses against the current OTP; it is voided after MAX_OTP_ATTEMPTS.
    otpAttempts: {
        type: Number,
        default: 0,
        select: false,
    },
    // Existing pending codes without a purpose require a new OTP request.
    otpPurpose: { type: String, enum: ['signup', 'login', 'admin_reset'], select: false },
    addresses: {
        type: [addressSchema],
        default: []
    },
    // Stamped every time a session is actually issued (after OTP, not at the
    // password step). Drives "Active Users" on the dashboard and the Active
    // Members list. Undefined for accounts that have not logged in since this
    // field was introduced.
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true,
    toJSON: { transform: (doc, value) => userResponse(value) },
    toObject: { transform: (doc, value) => userResponse(value) },
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.password || !this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // Password hash and revocation are one MongoDB update. $inc preserves a
    // concurrent logout/password change, unlike assigning oldVersion + 1.
    if (!this.isNew) this.$inc('sessionVersion', 1);
});

// Method to match password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
