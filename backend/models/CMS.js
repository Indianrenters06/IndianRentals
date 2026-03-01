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

    // ── Why Choose Us (homepage) ──────────────────────────────────────────────
    whyChooseUsTitle: { type: String, default: 'Why Choose Us?' },
    whyChooseUsSubtitle: { type: String, default: "Join thousands who've switched to the flexible, affordable way to access high-end tech. IndianRenters delivers AI-ready workstations, laptops, and IT gear with zero ownership hassle and instant support." },
    whyChooseUsImage: { type: String, default: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961565/indian-rentals/anmpufdlxxxblkxqxpds.jpg' },

    // ── Metrics/Stats (homepage) ─────────────────────────────────────────────
    statsDevices: { type: String, default: '90k+' },
    statsCustomers: { type: String, default: '30k+' },
    statsCities: { type: String, default: '401+' },

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
