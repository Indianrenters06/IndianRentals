const mongoose = require('mongoose');

const featuredShowcaseBannerSchema = new mongoose.Schema({
    title:    { type: String, default: '' },
    subtitle: { type: String, default: '' },
    image:    { type: String, default: '' },
    bg:       { type: String, default: 'linear-gradient(135deg, #2a1a5e 0%, #4c3099 40%, #7c5cbf 70%, #b08ad4 100%)' },
    href:     { type: String, default: '/products' },
}, { _id: false });

const rentalProcessStepSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    icon: { type: String, default: 'FaLaptopCode' }, // icon name string
    highlight: { type: Boolean, default: false }, // yellow highlight card
    image: { type: String, default: '' },
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
    
    // ── Rent By Category (homepage) ──────────────────────────────────────────
    categorySectionEnabled: { type: Boolean, default: true },
    categorySectionTitle: { type: String, default: 'Rent by Category' },

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

    // ── Featured Showcase Section (homepage) ──────────────────────────────────
    featuredShowcaseEnabled:    { type: Boolean, default: true },
    featuredShowcaseProductIds: { type: [String], default: [] }, // 2 pinned product _ids
    featuredShowcaseBanners: {
        type: [featuredShowcaseBannerSchema],
        default: [
            { title: 'Apple Products',   subtitle: 'MacBooks | iPads | iPhones | Mac Studio | Mac Mini', image: '', bg: 'linear-gradient(135deg, #2a1a5e 0%, #4c3099 40%, #7c5cbf 70%, #b08ad4 100%)', href: '/categories/apple' },
            { title: 'Gaming Laptops',   subtitle: 'ASUS ROG | Lenovo Legion | MSI | HP Omen',          image: '', bg: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 40%, #1e5f8c 70%, #2a9fd6 100%)', href: '/categories/gaming' },
            { title: 'Smart Devices',    subtitle: 'Tablets | Smartwatches | Earbuds | Accessories',    image: '', bg: 'linear-gradient(135deg, #1a2e1a 0%, #1e5c3a 40%, #25874f 70%, #3ac47d 100%)', href: '/categories/smart-devices' },
        ]
    },

    // ── Feature Section (homepage) ────────────────────────────────────────────
    featureSectionEnabled: { type: Boolean, default: true },
    featureSectionTitle: { type: String, default: 'MacBook Air' },
    featureSectionSubtitle: { type: String, default: 'Skip the setup hassle. Get high-performance workstations pre-configured with Ollama for instant AI development. Run large language models locally.' },
    featureSectionImage: { type: String, default: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961205/indian-rentals/gfjrzgp5llzcjap30wkt.png' },
    featureSectionCtaText: { type: String, default: 'Rent Now' },
    featureSectionCtaLink: { type: String, default: '/store' },
    featureSectionStats: {
        type: [{
            value: String,
            label: String,
            sublabel: String
        }],
        default: [
            { value: '23x', label: 'Up to', sublabel: 'faster than the fastest Intel-based MacBook Air' },
            { value: '2x', label: 'Up to', sublabel: 'faster than MacBook Air(M1)' },
            { value: '18 hr', label: 'Up to', sublabel: 'battery life' }
        ]
    },

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
