const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a category name'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        // URL for the category image/icon
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
