const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    siteName: { type: String, default: 'IndianRentals' },
    siteLogo: { type: String, default: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1776892240/1d1f7c4e3c0490bcddb69ceb328c67be2f7cf361_6_kufcee.png' },
    contactEmail: { type: String, default: 'support@indianrentals.com' },
    contactPhone: { type: String, default: '+91 1234567890' },
    address: { type: String, default: '' },

    // Platform behaviour flags
    maintenanceMode: { type: Boolean, default: false },
    allowRegistrations: { type: Boolean, default: true },
    requireKYC: { type: Boolean, default: true },

    // Gateway Keys (Mock)
    paymentGatewaySecret: { type: String, default: '' },

    gstConfig: {
        enabled: { type: Boolean, default: true },
        percentage: { type: Number, default: 18 } // 18% GST default
    },

    deliveryCharges: {
        baseCharge: { type: Number, default: 100 },
        freeDeliveryAbove: { type: Number, default: 2000 }
    },

    lateFeeRules: {
        perDayCharge: { type: Number, default: 50 },
        gracePeriodDays: { type: Number, default: 1 }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
