const asyncHandler = require('express-async-handler');
const CMS = require('../models/CMS');

const ALLOWED_PAGES = ['homepage', 'about', 'terms', 'privacy', 'contact', 'shipping', 'refund', 'faq', 'rental-process', 'kyc-policy', 'categories-page', 'delivery-charges', 'late-fee-rules', 'cancellation-rules', 'subscription-rules', 'product-page'];

// ── Helpers ───────────────────────────────────────────────────────────────────
// Offers live under the legacy `clientLogos` key. Older documents stored a plain
// image URL string per offer; the editor now sends { image, link }. Accept both
// and always persist the object form.
const normaliseOffers = (items) =>
    (Array.isArray(items) ? items : [])
        .map((item) =>
            typeof item === 'string'
                ? { image: item, link: '' }
                : { image: String(item?.image || ''), link: String(item?.link || '') }
        )
        .filter((offer) => offer.image);

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

        // Offer section (legacy `client*` field names)
        'clientSectionEnabled', 'clientSectionTitle',

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

        // Homepage FAQ
        'homepageFaqEnabled', 'homepageFaqTitle', 'homepageFaqSubtitle', 'homepageFaqItems',

        // FAQ Page
        'faqTitle', 'faqSubtitle', 'faqItems', 'faqSectionEnabled',

        // Rental Process Page Features
        'rentalFeaturesTitle', 'rentalFeaturesSubtitle', 'rentalFeatures',

        // Contact Page
        'contactTitle', 'contactSubtitle', 'contactEmail', 'contactPhone', 'contactAddress', 'contactMapUrl', 'contactWhatsApp',

        // Categories Page
        'categoriesPageTitle', 'categoriesPageSubtitle', 'categoriesGrid',

        // Product Page — every field the editor sends must be listed here, or the
        // save silently drops it while still reporting success.
        'productPageBenefits', 'productPageDeliveryText', 'productPageDiscountText',
        'productPageLoadingText', 'productPageNotFoundText',
        'productPageBreadcrumbHomeLabel', 'productPageBreadcrumbHomeLink',
        'productPageCtaText', 'productPageCtaTextMobile', 'productPageCompareLinkText',
        'productPagePriceBreakdownText', 'productPagePriceBreakdownLink',
        'productPageTenureSliderLabel', 'productPageTenures',
        'productPagePerMonthLabel', 'productPageMobilePriceSuffix', 'productPageQuantityLabel',
        'productPageMonthLabel', 'productPageMonthsLabel',
        'productPageViewAllBenefitsText',
        'productPageDepositLabel', 'productPageKycNote', 'productPageKycLine1', 'productPageKycLine2', 'productPageKycImage',
        'productPageCancelCardText', 'productPageCancelCardLinkText',
        'productPageExtendCardText', 'productPageExtendCardLinkText', 'productPageExtendCardLink',
        'productPageDeliveryLabel', 'productPagePincodePlaceholder',
        'productPagePincodeCtaLine1', 'productPagePincodeCtaLine2', 'productPagePincodeCheckingText',
        'productPagePincodeMobileCtaText', 'productPagePincodeInvalidText', 'productPagePincodeErrorText',
        'productPageTabDetailsLabel', 'productPageTabReturnLabel', 'productPageTabShippingLabel', 'productPageTabReviewLabel',
        'productPageDefaultReturnPolicy', 'productPageDefaultShippingPolicy', 'productPageDefaultSpecs',
        'productPageReviewPrompt', 'productPageReviewPlaceholder', 'productPageReviewSubmitText', 'productPageReviewThanksText',
        'productPageBenefitsHeading', 'productPageTestimonialsHeading', 'productPageTestimonialsSubheading',
        'productPageFaqHeading', 'productPageFaqSubheading',
        'productPageRelatedHeading', 'productPageGlobalRelatedIds',
        'productPageEnableCompare', 'productPageEnableRelated', 'productPageEnableFaq', 'productPageEnableTestimonials',
        'productPageEnableRating', 'productPageEnablePriceBreakdown',
        'productPageEnableTenureSlider', 'productPageEnableQuantity',
        'productPageEnableBreadcrumb', 'productPageEnableWishlist', 'productPageEnableShare',
        'productPageEnableThumbnails', 'productPageEnableDeliveryBadge',
        'productPageEnableBenefits', 'productPageEnableViewAllBenefits',
        'productPageEnableDepositCard', 'productPageEnableKycCard', 'productPageEnableInfoCards',
        'productPageEnablePincodeCheck', 'productPageEnableTabs',
        'productPageEnableTabReturn', 'productPageEnableTabShipping', 'productPageEnableTabReview',
        'productPageEnableRentVsBuy',

        // SEO
        'metaTitle', 'metaDescription', 'publishStatus', 'scheduledPublishTime',
    ];

    fields.forEach((field) => {
        if (req.body[field] !== undefined) {
            cms[field] = req.body[field];
        }
    });

    if (req.body.clientLogos !== undefined) {
        cms.clientLogos = normaliseOffers(req.body.clientLogos);
        // Mixed paths need an explicit dirty flag or mongoose skips the write.
        cms.markModified('clientLogos');
    }

    const updated = await cms.save();
    res.json(updated);
});

module.exports = {
    getAllPages,
    getPage,
    updatePage,
};
