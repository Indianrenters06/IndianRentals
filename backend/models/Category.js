const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a category name'],
        trim: true
    },
    slug: {
        type: String,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        // URL for the category image/icon
    },
    // If null/undefined → this is a top-level (parent) category
    // If set → this is a subcategory whose parent is the referenced Category
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Auto-generate slug from name before saving
categorySchema.pre('save', function (next) {
    if (this.isModified('name') || !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');
    }
    next();
});

// Compound unique index: name must be unique within the same parent
categorySchema.index({ name: 1, parent: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
