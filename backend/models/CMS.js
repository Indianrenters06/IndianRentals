const mongoose = require('mongoose');

const rentalProcessStepSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    icon: { type: String, default: 'FaLaptopCode' }, // icon name string
    highlight: { type: Boolean, default: false }, // yellow highlight card
}, { _id: false });

const heroSlideSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    image: { type: String, default: '' },
    bgColor: { type: String, default: '#00A8FF' },
    ctaText: { type: String, default: 'Rent Now' },
    ctaLink: { type: String, default: '/products' },
}, { _id: false });

const cmsSchema = new mongoose.Schema({
    pageName: {
        type: String,
        required: true,
        unique: true,
    },

    // ── Hero Slides (homepage) ────────────────────────────────────────────────
    heroEnabled: { type: Boolean, default: true },
    heroSlides: { type: [heroSlideSchema], default: [] },
    // Legacy single-hero fields (kept for backward compat)
    heroTitle: { type: String, default: '' },
    heroSubtitle: { type: String, default: '' },
    heroImage: { type: String, default: '' },
    overlayColor: { type: String, default: 'rgba(0,0,0,0.5)' },
    heroBgColor: { type: String, default: '' },

    // ── Best Rented Products (homepage) ───────────────────────────────────────
    bestRentedEnabled: { type: Boolean, default: true },
    bestRentedTitle: { type: String, default: 'Best Rented Products' },
    bestRentedProductIds: { type: [String], default: [] }, // pinned product _ids

    // ── New Launch Products (homepage) ────────────────────────────────────────
    newLaunchEnabled: { type: Boolean, default: true },
    newLaunchTitle: { type: String, default: 'New Launches This Week' },
    newLaunchProductIds: { type: [String], default: [] }, // pinned product _ids

    // ── Rental Process / KYC Steps (homepage) ─────────────────────────────────
    rentalProcessEnabled: { type: Boolean, default: true },
    rentalProcessTitle: { type: String, default: 'Rental Process' },
    rentalProcessSubtitle: { type: String, default: 'Choose, secure, receive, and create with zero hassle. No installation, no configuration, no delay.' },
    rentalProcessSteps: { type: [rentalProcessStepSchema], default: [] },

    // ── Testimonials Section (homepage) ───────────────────────────────────────
    testimonialsEnabled: { type: Boolean, default: true },
    testimonialSectionTitle: { type: String, default: 'What Our Customers Say' },
    testimonialSectionSubtitle: { type: String, default: 'Real experiences from innovators, businesses, and creators powering their ambitions with IndianRenters.' },
    testimonialGoogleReviewCount: { type: String, default: '5000+' },
    testimonialGoogleRating: { type: String, default: '4.9' },

    // ── Why Choose Us (homepage) ──────────────────────────────────────────────
    whyChooseUsTitle: { type: String, default: 'Why Choose Us?' },
    whyChooseUsSubtitle: { type: String, default: "Join thousands who've switched to the flexible, affordable way to access high-end tech. IndianRenters delivers AI-ready workstations, laptops, and IT gear with zero ownership hassle and instant support." },
    whyChooseUsImage: { type: String, default: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961565/indian-rentals/anmpufdlxxxblkxqxpds.jpg' },

    // ── Metrics/Stats (homepage) ─────────────────────────────────────────────
    statsDevices: { type: String, default: '90k+' },
    statsCustomers: { type: String, default: '30k+' },
    statsCities: { type: String, default: '401+' },

    // ── Generic rich page content ─────────────────────────────────────────────
    pageContent: { type: String, default: '' },
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
