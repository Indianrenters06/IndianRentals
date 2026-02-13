const mongoose = require('mongoose');

const testimonialSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String, // e.g. "Software Engineer", "Student"
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        default: 5,
    },
    image: {
        type: String,
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
