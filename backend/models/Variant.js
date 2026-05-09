const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    name: {
        type: String, // e.g. "Color", "Size", "RAM"
        required: true,
        trim: true
    },
    options: [{
        type: String // e.g. ["Red", "Blue", "Black"] or ["8GB", "16GB"]
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Variant', variantSchema);
