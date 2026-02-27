const mongoose = require('mongoose');

const cmsSchema = new mongoose.Schema({
    pageName: {
        type: String,
        required: true,
        unique: true,
        // e.g. 'homepage', 'about', 'terms', 'privacy', 'contact'
    },
    // ── Hero (homepage) ──────────────────────────────────────────────────────
    heroEnabled: { type: Boolean, default: true },
    heroTitle: { type: String, default: '' },
    heroSubtitle: { type: String, default: '' },
    heroImage: { type: String, default: '' },
    overlayColor: { type: String, default: 'rgba(0,0,0,0.5)' },
    heroBgColor: { type: String, default: '' },  // e.g. '#00A8FF'

    // ── Generic rich page content (markdown / HTML) ──────────────────────────
    // Used for Terms, Privacy, About, Contact static content
    pageContent: { type: String, default: '' },

    // ── Banner image shown at the top of the page ────────────────────────────
    bannerImage: { type: String, default: '' },
    bannerTitle: { type: String, default: '' },

    // ── SEO ──────────────────────────────────────────────────────────────────
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },

    // ── Status ───────────────────────────────────────────────────────────────
    publishStatus: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published',
    },
    scheduledPublishTime: { type: Date, default: null },
}, {
    timestamps: true,
});

module.exports = mongoose.model('CMS', cmsSchema);
