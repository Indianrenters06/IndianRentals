const asyncHandler = require('express-async-handler');
const CMS = require('../models/CMS');

const ALLOWED_PAGES = ['homepage', 'about', 'terms', 'privacy', 'contact'];

// ── Helpers ───────────────────────────────────────────────────────────────────
const getOrCreatePage = async (pageName) => {
    let page = await CMS.findOne({ pageName });
    if (!page) {
        page = await CMS.create({ pageName });
    }
    return page;
};

// ── @desc   List all CMS pages (admin overview)
// ── @route  GET /api/cms
// ── @access Public
const getAllPages = asyncHandler(async (req, res) => {
    const pages = await CMS.find({}).lean();

    // Ensure all known pages exist in the response
    const result = await Promise.all(
        ALLOWED_PAGES.map(async (name) => {
            const found = pages.find((p) => p.pageName === name);
            if (found) return found;
            return { pageName: name, publishStatus: 'published', updatedAt: null };
        })
    );

    res.json(result);
});

// ── @desc   Get a single CMS page by name
// ── @route  GET /api/cms/:page   (e.g. /api/cms/homepage)
// ── @access Public
const getPage = asyncHandler(async (req, res) => {
    const { page } = req.params;
    const cms = await getOrCreatePage(page);
    res.json(cms);
});

// ── @desc   Update (upsert) a CMS page
// ── @route  PUT /api/cms/:page
// ── @access Private/Admin
const updatePage = asyncHandler(async (req, res) => {
    const { page } = req.params;

    let cms = await CMS.findOne({ pageName: page });
    if (!cms) {
        cms = await CMS.create({ pageName: page });
    }

    const fields = [
        // Hero
        'heroEnabled', 'heroSlides',
        // Legacy Hero (fallback)
        'heroTitle', 'heroSubtitle', 'heroImage', 'overlayColor', 'heroBgColor',

        // Best Rented
        'bestRentedEnabled', 'bestRentedTitle', 'bestRentedProductIds',

        // New Launch
        'newLaunchEnabled', 'newLaunchTitle', 'newLaunchProductIds',

        // Rental Process / KYC
        'rentalProcessEnabled', 'rentalProcessTitle', 'rentalProcessSubtitle', 'rentalProcessSteps',

        // Testimonials
        'testimonialsEnabled', 'testimonialSectionTitle', 'testimonialSectionSubtitle', 'testimonialGoogleReviewCount', 'testimonialGoogleRating',

        // Why Choose Us
        'whyChooseUsTitle', 'whyChooseUsSubtitle', 'whyChooseUsImage',

        // Stats
        'statsDevices', 'statsCustomers', 'statsCities',

        // Category section
        'categorySectionEnabled', 'categorySectionTitle',

        // Feature section
        'featureSectionEnabled', 'featureSectionTitle', 'featureSectionSubtitle', 
        'featureSectionImage', 'featureSectionCtaText', 'featureSectionCtaLink', 'featureSectionStats',

        // Generic Info
        'pageContent', 'bannerImage', 'bannerTitle',

        // SEO
        'metaTitle', 'metaDescription', 'publishStatus', 'scheduledPublishTime',
    ];

    fields.forEach((field) => {
        if (req.body[field] !== undefined) {
            cms[field] = req.body[field];
        }
    });

    const updated = await cms.save();
    res.json(updated);
});

module.exports = {
    getAllPages,
    getPage,
    updatePage,
};
