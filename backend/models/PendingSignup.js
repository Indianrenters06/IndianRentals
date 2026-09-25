const mongoose = require('mongoose');

// A mobile sign-up waiting for its SMS code. The User is only created once the
// code is verified, so abandoned sign-ups never leave half-made accounts —
// these rows simply expire (TTL index on `expiresAt`).
const pendingSignupSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    otp: { type: String, required: true },
    // Wrong guesses against the current code; it is voided after MAX_OTP_ATTEMPTS.
    otpAttempts: { type: Number, default: 0 },
    termsAcceptedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
}, { timestamps: true });

module.exports = mongoose.model('PendingSignup', pendingSignupSchema);
