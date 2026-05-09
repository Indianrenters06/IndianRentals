const mongoose = require('mongoose');

const pricingPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a plan name'],
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    baseRate: {
        type: Number,
        required: true
    },
    duration: {
        type: Number, // in months
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    features: [{
        type: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('PricingPlan', pricingPlanSchema);
