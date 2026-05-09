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
    // Top-level category name string (e.g. "Apple", "IT Products")
    category: {
        type: String,
        required: [true, 'Please provide a category']
    },
    // Reference to the Category document for the subcategory (optional)
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
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
    },
    city: {
        type: String,
        required: [true, 'Please provide the city where the product is located']
    },
    state: {
        type: String,
        required: [true, 'Please provide the state where the product is located']
    },
    returnPolicy: {
        type: String,
        default: ""
    },
    shippingPolicy: {
        type: String,
        default: ""
    },
    mrp: {
        type: Number,
        default: 0
    },
    deliveryTime: {
        type: String,
        default: "2-4 days"
    },
    benefits: [{
        type: String
    }],
    specifications: [{
        label: String,
        value: String
    }],
    faqs: [{
        question: String,
        answer: String
    }],
    addons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Addon'
    }],
    seoTitle: {
        type: String,
        default: ""
    },
    seoDescription: {
        type: String,
        default: ""
    },
    seoKeywords: {
        type: String,
        default: ""
    },
    slug: {
        type: String,
        unique: true,
        sparse: true
    }
}, {
    timestamps: true
});

const reviewSchema = mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, {
    timestamps: true,
});

productSchema.add({
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
});

module.exports = mongoose.model('Product', productSchema);
