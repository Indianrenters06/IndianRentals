const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['auth', 'order', 'kyc', 'rental', 'payment', 'promotional', 'other'],
        default: 'other',
    },
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        required: true,
    },
    variables: [{
        type: String, // e.g. "{{userName}}", "{{otp}}", "{{orderId}}"
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);
