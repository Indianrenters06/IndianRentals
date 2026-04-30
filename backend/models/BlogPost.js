const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog post title is required'],
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    excerpt: {
        type: String,
        trim: true,
        default: '',
    },
    content: {
        type: String,
        default: '',
    },
    coverImage: {
        type: String,
        default: '',
    },
    images: {
        type: [String],
        default: [],
    },
    author: {
        type: String,
        default: 'Admin',
    },
    tags: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },
    views: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Auto-generate slug from title
blogPostSchema.pre('save', function () {
    if (this.isModified('title') || !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');
    }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
