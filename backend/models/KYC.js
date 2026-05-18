const mongoose = require('mongoose');

const KYCSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    // ── Personal Details ────────────────────────────────────────────────────────
    personalDetails: {
        // Basic identity
        name: String,
        fullName: String,
        dob: String,
        gender: String,

        // Contact
        email: String,
        phone: String,

        // Father / Guardian
        fatherName: String,
        fatherPhone: String,

        // Address
        address: String,
        permanentAddress: String,
        currentAddress: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: 'India' },

        // ID Type selected in form
        idType: String,
        idNumber: String,
    },

    // ── Company Details ─────────────────────────────────────────────────────────
    companyDetails: {
        companyName: String,
        companyType: String,
        employeeCount: String,
        employees: String,          // alias used in checkout form
        designation: String,
        serviceDuration: String,
        duration: String,           // alias used in checkout form
        companyEmail: String,
        email: String,              // alias used in checkout form
        companyAddress: String,
        address: String,            // alias used in checkout form
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: 'India' },
        gstNumber: String,
    },

    // ── Reference Details ───────────────────────────────────────────────────────
    referenceDetails: {
        name: String,
        relation: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
        country: { type: String, default: 'India' },
    },

    // ── Uploaded Document URLs (Cloudinary) ─────────────────────────────────────
    documents: {
        identityProof: String,      // /api/kyc/upload field: identityProof
        addressProof: String,       // /api/kyc/upload field: addressProof
        bankStatement: String,      // /api/kyc/upload field: bankStatement
        // Additional aliases stored by profile KYC form
        aadharFront: String,
        aadharBack: String,
        panCard: String,
        gstCertificate: String,
        photo: String,
        // Type labels chosen by user
        identityProofType: String,
        addressProofType: String,
    },

    // ── Status ──────────────────────────────────────────────────────────────────
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'incomplete', 'review'],
        default: 'pending'
    },
    rejectionReason: String,
    remarks: String,

}, { timestamps: true });

module.exports = mongoose.model('KYC', KYCSchema);
