const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a product description']
    },
    category: {
        type: String,
        required: [true, 'Please provide a category']
    },
    brand: {
        type: String
    },
    images: [{
        type: String,
        // We'll store image URLs here
    }],
    rentalPrice: {
        type: Number,
        required: [true, 'Please provide a rental price (e.g., per month)']
    },
    securityDeposit: {
        type: Number,
        required: [true, 'Please provide a security deposit amount']
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    condition: {
        type: String,
        enum: ['New', 'Good', 'Fair'],
        default: 'Good'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
