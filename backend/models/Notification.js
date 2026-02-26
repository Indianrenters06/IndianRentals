const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['order', 'kyc', 'system', 'user'],
        default: 'system'
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId, // Link to order ID, KYC ID, etc.
        default: null
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
