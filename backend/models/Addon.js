const mongoose = require('mongoose');

const addonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide an addon name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a description']
    },
    price: {
        type: String,
        required: [true, 'Please provide a price (e.g. ₹499/order)']
    },
    category: {
        type: String,
        required: [true, 'Please provide a category']
    },
    stock: {
        type: String,
        default: 'Unlimited'
    },
    isConditional: {
        type: Boolean,
        default: false
    },
    conditionRule: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Addon', addonSchema);
