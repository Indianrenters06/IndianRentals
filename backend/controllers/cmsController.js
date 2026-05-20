const asyncHandler = require('express-async-handler');
const CMS = require('../models/CMS');

const ALLOWED_PAGES = ['homepage', 'about', 'terms', 'privacy', 'contact', 'shipping', 'refund', 'faq', 'rental-process', 'kyc-policy', 'categories-page', 'rules'];

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
    console.log('GET /api/cms - Fetching all pages');
    const pages = await CMS.find({}).lean();
    console.log(`Found ${pages.length} pages in DB`);

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
        'whyChooseUsEnabled', 'whyChooseUsTitle', 'whyChooseUsSubtitle', 'whyChooseUsImage',

        // Stats
        'statsDevices', 'statsCustomers', 'statsCities',

        // Category section
        'categorySectionEnabled', 'categorySectionTitle',

        // Featured Showcase section
        'featuredShowcaseEnabled', 'featuredShowcaseProductIds', 'featuredShowcaseBanners',

        // Feature section
        'featureSectionEnabled', 'featureSectionTitle', 'featureSectionSubtitle', 
        'featureSectionImage', 'featureSectionCtaText', 'featureSectionCtaLink', 'featureSectionStats',

        // Generic Info
        'pageContent', 'bannerImage', 'bannerTitle',

        // About Us specific fields
        'aboutStoryTitle', 'aboutStoryPara1', 'aboutStoryPara2', 'aboutStoryImage',
        'aboutStat1Value', 'aboutStat1Label', 'aboutStat2Value', 'aboutStat2Label',
        'aboutVisionTabLabel', 'aboutVision1Title', 'aboutVision1Text', 'aboutVision2Title', 'aboutVision2Text', 'aboutVision3Title', 'aboutVision3Text',
        'aboutMissionTabLabel', 'aboutMission1Title', 'aboutMission1Text', 'aboutMission2Title', 'aboutMission2Text', 'aboutMission3Title', 'aboutMission3Text',
        'aboutWhyTitle', 'aboutWhyText', 'aboutWhyImage',
        'aboutWhyStat1Value', 'aboutWhyStat1Label', 'aboutWhyStat2Value', 'aboutWhyStat2Label', 'aboutWhyStat3Value', 'aboutWhyStat3Label',

        // FAQ Page
        'faqTitle', 'faqSubtitle', 'faqItems', 'faqSectionEnabled',

        // Rental Process Page Features
        'rentalFeaturesTitle', 'rentalFeaturesSubtitle', 'rentalFeatures',

        // Contact Page
        'contactTitle', 'contactSubtitle', 'contactEmail', 'contactPhone', 'contactAddress', 'contactMapUrl', 'contactWhatsApp',

        // Categories Page
        'categoriesPageTitle', 'categoriesPageSubtitle', 'categoriesGrid',

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
