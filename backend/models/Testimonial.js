const mongoose = require('mongoose');

const testimonialSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String, // e.g. "Software Engineer", "Student"
        default: '',
    },
    message: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        default: 5,
        min: 1,
        max: 5,
    },
    image: {
        type: String,
        default: "",
    },
    source: { type: String, enum: ["indianrenters", "google"], default: "indianrenters" },
    sourceUrl: { type: String, default: "" },
    isApproved: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
