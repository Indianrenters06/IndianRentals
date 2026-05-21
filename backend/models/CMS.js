const mongoose = require('mongoose');

const featuredShowcaseBannerSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    image: { type: String, default: '' },
    bg: { type: String, default: 'linear-gradient(135deg, #2a1a5e 0%, #4c3099 40%, #7c5cbf 70%, #b08ad4 100%)' },
    href: { type: String, default: '/products' },
}, { _id: false });

const rentalProcessStepSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    icon: { type: String, default: 'FaLaptopCode' }, // icon name string
    highlight: { type: Boolean, default: false }, // yellow highlight card
    image: { type: String, default: '' },
    link: { type: String, default: '' },
}, { _id: false });

const heroSlideSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    image: { type: String, default: '' },
    bgColor: { type: String, default: '#0075ff' },
    bgGradient: { type: String, default: '' },
    textColor: { type: String, default: '#FFFFFF' },
    ctaText: { type: String, default: 'Rent Now' },
    ctaLink: { type: String, default: '/products' },
    slideLink: { type: String, default: '' },
}, { _id: false });

const faqItemSchema = new mongoose.Schema({
    question: { type: String, default: '' },
    answer: { type: String, default: '' },
}, { _id: false });

const featureItemSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
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

    // ── Client Section (homepage) ─────────────────────────────────────────────
    clientSectionEnabled: { type: Boolean, default: true },
    clientSectionTitle: { type: String, default: 'Trusted By' },
    clientLogos: { type: [String], default: [] },

    // ── Metrics/Stats (homepage) ─────────────────────────────────────────────
    statsDevices: { type: String, default: '90k+' },
    statsCustomers: { type: String, default: '30k+' },
    statsCities: { type: String, default: '401+' },

    // ── Featured Showcase Section (homepage) ──────────────────────────────────
    featuredShowcaseEnabled: { type: Boolean, default: true },
    featuredShowcaseProductIds: { type: [String], default: [] }, // 2 pinned product _ids
    featuredShowcaseBanners: {
        type: [featuredShowcaseBannerSchema],
        default: [
            { title: 'Apple Products', subtitle: 'MacBooks | iPads | iPhones | Mac Studio | Mac Mini', image: '', bg: 'linear-gradient(135deg, #2a1a5e 0%, #4c3099 40%, #7c5cbf 70%, #b08ad4 100%)', href: '/categories/apple' },
            { title: 'Gaming Laptops', subtitle: 'ASUS ROG | Lenovo Legion | MSI | HP Omen', image: '', bg: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 40%, #1e5f8c 70%, #2a9fd6 100%)', href: '/categories/gaming' },
            { title: 'Smart Devices', subtitle: 'Tablets | Smartwatches | Earbuds | Accessories', image: '', bg: 'linear-gradient(135deg, #1a2e1a 0%, #1e5c3a 40%, #25874f 70%, #3ac47d 100%)', href: '/categories/smart-devices' },
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

    // ── About Us — Banner ────────────────────────────────────────────────────
    bannerImage: { type: String, default: '' },
    bannerTitle: { type: String, default: '' },

    // ── About Us — Our Story ──────────────────────────────────────────────────
    aboutStoryTitle:    { type: String, default: 'Our Story' },
    aboutStoryPara1:    { type: String, default: "From a small computer training room in 1992 to India's go-to rental partner, this journey has been about making access smarter than ownership. The promise stays simple: rent anything needed, when it's needed, anywhere it's needed—without friction." },
    aboutStoryPara2:    { type: String, default: "Today, a 100+ product catalog powers startups, enterprises, and events across major cities, backed by fast delivery, clean gear, and dependable support." },
    aboutStoryImage:    { type: String, default: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png' },

    // ── About Us — Story Stats ────────────────────────────────────────────────
    aboutStat1Value:    { type: String, default: '4.8/5.0' },
    aboutStat1Label:    { type: String, default: 'Customer Satisfaction' },
    aboutStat2Value:    { type: String, default: '10,000+' },
    aboutStat2Label:    { type: String, default: 'Happy Clients' },

    // ── About Us — Vision Tab ─────────────────────────────────────────────────
    aboutVisionTabLabel: { type: String, default: 'Our Vision' },
    aboutVision1Title:   { type: String, default: 'Rent Anything' },
    aboutVision1Text:    { type: String, default: "Laptops, Macs, mobiles, AV, cameras, medical and more—if it's not listed, it's sourced on request." },
    aboutVision2Title:   { type: String, default: 'Rent Anytime' },
    aboutVision2Text:    { type: String, default: 'Tenures that fit the job: 1, 3, 6, or 12 months, with easy extensions and mid-term upgrades.' },
    aboutVision3Title:   { type: String, default: 'Rent Anywhere' },
    aboutVision3Text:    { type: String, default: 'Rapid delivery and support across major Indian cities through a reliable partner network.' },

    // ── About Us — Mission Tab ────────────────────────────────────────────────
    aboutMissionTabLabel: { type: String, default: 'Our Mission' },
    aboutMission1Title:   { type: String, default: 'Awesome Service' },
    aboutMission1Text:    { type: String, default: "Laptops, Macs, mobiles, AV, cameras, medical and more—if it's not listed, it's sourced on request." },
    aboutMission2Title:   { type: String, default: 'Awesome Quality' },
    aboutMission2Text:    { type: String, default: 'Tenures that fit the job: 1, 3, 6, or 12 months, with easy extensions and mid-term upgrades.' },
    aboutMission3Title:   { type: String, default: 'Happy Customers' },
    aboutMission3Text:    { type: String, default: 'Rapid delivery and support across major Indian cities through a reliable partner network.' },

    // ── About Us — Why Choose Us ──────────────────────────────────────────────
    aboutWhyTitle:      { type: String, default: 'Why Choose Us?' },
    aboutWhyText:       { type: String, default: "Join thousands who've switched to the flexible, affordable way to access high-end tech. IndianRenters delivers AI-ready workstations, laptops, and IT gear with zero ownership hassle and instant support." },
    aboutWhyImage:      { type: String, default: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961565/indian-rentals/anmpufdlxxxblkxqxpds.jpg' },
    aboutWhyStat1Value: { type: String, default: '90k+' },
    aboutWhyStat1Label: { type: String, default: 'Devices in Stock' },
    aboutWhyStat2Value: { type: String, default: '30k+' },
    aboutWhyStat2Label: { type: String, default: 'Happy Customers' },
    aboutWhyStat3Value: { type: String, default: '401+' },
    aboutWhyStat3Label: { type: String, default: 'Cities Covered' },

    // ── Generic rich page content ─────────────────────────────────────────────
    pageContent: { type: String, default: '' },
    
    // ── Categories Page ───────────────────────────────────────────────────────
    categoriesPageTitle: { type: String, default: 'All Categories' },
    categoriesPageSubtitle: { type: String, default: 'Lorem ipsum dolor sit amet consectetur. Vel libero cras laoreet ut dignissim eget. Scelerisque mauris pharetra tristique cras sit malesuada. Egestas pulvinar interdum sapien et. Consequat neque at donec turpis leo. Quis at.' },
    categoriesGrid: {
        type: [{
            title: String,
            image: String,
            href: String
        }],
        default: [
            { title: "Apple Products", image: "/macbook-pro-new.jpg", href: "/category/apple" },
            { title: "IT Products", image: "/it-products-new.jpg", href: "/category/it-products" },
            { title: "AV Products", image: "/it-products-new.jpg", href: "/category/av-products" },
            { title: "Office Equipment", image: "/office-equipment-new.jpg", href: "/category/office-equipment" },
            { title: "DSLR Cameras", image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769967871/indian-rentals/ea5ryxbvie8spmdb9slz.jpg", href: "/category/dslr" }
        ]
    },

    // ── FAQ Page ──────────────────────────────────────────────────────────────
    faqTitle: { type: String, default: 'FAQs' },
    faqSubtitle: { type: String, default: 'Everything you need to know about renting with IndianRenters.com' },
    faqItems: { type: [faqItemSchema], default: [] },
    faqSectionEnabled: { type: Boolean, default: true },

    // ── Rental Process Page Features ──────────────────────────────────────────
    rentalFeaturesTitle: { type: String, default: 'Features' },
    rentalFeaturesSubtitle: { type: String, default: 'Rent with confidence. Every product comes with transparent pricing, flexible terms, and reliable support.' },
    rentalFeatures: { type: [featureItemSchema], default: [] },

    // ── Contact Page ──────────────────────────────────────────────────────────
    contactTitle: { type: String, default: 'Contact Us' },
    contactSubtitle: { type: String, default: 'Have questions? We are here to help.' },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    contactAddress: { type: String, default: '' },
    contactMapUrl: { type: String, default: '' },
    contactWhatsApp: { type: String, default: '' },

    // ── Product Page ──────────────────────────────────────────────────────────
    productPageBenefits: {
        type: [String],
        default: ["Fully Functional", "Accessories Included", "Free Repairs & Maintenance", "Professionally sanitized"]
    },
    productPageDeliveryText: { type: String, default: "2-4 days" },
    productPageDiscountText: { type: String, default: "20% off" },
    productPageEnableCompare: { type: Boolean, default: true },
    productPageEnableRelated: { type: Boolean, default: true },
    productPageEnableFaq: { type: Boolean, default: true },
    productPageEnableTestimonials: { type: Boolean, default: true },

    // ── SEO ──────────────────────────────────────────────────────────────────
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },

    // ── Blog Page ─────────────────────────────────────────────────────────────
    blogTitle: { type: String, default: 'Latest News & Resources' },
    blogSubtitle: { type: String, default: 'The latest industry news, interviews, technologies, and resources.' },
    blogTabs: { type: [String], default: ['View all', 'Short term', 'Long term', 'Production on service', 'Next Tech', 'News'] },

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
