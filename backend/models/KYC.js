const mongoose = require('mongoose');

const KYCSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    personalDetails: {
        panCard: String,
        aadharCard: String,
        dob: Date,
        gender: String,
        permanentAddress: String,
        currentAddress: String
    },
    companyDetails: {
        gstNumber: String,
        companyName: String,
        companyAddress: String,
        companyEmail: String
    },
    referenceDetails: {
        name: String,
        relation: String,
        phone: String
    },
    documents: {
        aadharFront: String,
        aadharBack: String,
        panCard: String,
        gstCertificate: String,
        photo: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'incomplete'],
        default: 'incomplete'
    },
    remarks: String,

}, { timestamps: true });

module.exports = mongoose.model('KYC', KYCSchema);
