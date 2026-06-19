const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        // Complexity is enforced ONLY when the password is actually being set or
        // changed (i.e. it's still plaintext). On every other save() the stored
        // value is a bcrypt hash — which contains '.' and '/' and would always
        // fail the complexity regex — so we must skip it for unmodified passwords.
        // Without this guard, saving any existing user (e.g. login's 2FA OTP save,
        // KYC status sync) throws a validation error and breaks the flow.
        validate: {
            validator: function (value) {
                if (!this.isModified('password')) return true;
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
            },
            message: 'Password must be at least 8 characters and contain an uppercase letter, a lowercase letter, a number, and a special character'
        },
        select: false // Don't return password by default
    },
    phone: {
        type: String,
        required: [true, 'Please provide your phone number']
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'staff', 'super_admin', 'operations_manager', 'sales_executive', 'finance_executive'],
        default: 'customer'
    },
    // For staff members: which admin sections they can access
    // e.g. ['cms', 'products', 'orders', 'inventory', 'users', 'kyc', 'payments', 'coupons', 'reports', 'notifications', 'settings']
    adminPermissions: {
        type: [String],
        default: []
    },
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
    },
    phoneOtp: {
        type: String,
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
    },
    addresses: {
        type: [addressSchema],
        default: []
    }
}, {
    timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to match password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
