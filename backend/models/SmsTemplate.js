const mongoose = require('mongoose');

const smsTemplateSchema = new mongoose.Schema({
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
    body: {
        type: String,
        required: true,
        maxlength: 1600,
    },
    variables: [{
        type: String, // e.g. "{{userName}}", "{{otp}}"
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('SmsTemplate', smsTemplateSchema);
