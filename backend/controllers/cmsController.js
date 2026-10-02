const asyncHandler = require('express-async-handler');
const sanitizeHtml = require('../utils/sanitizeHtml');
const CMS = require('../models/CMS');
const jwt = require('jsonwebtoken');
const { validateProductReferences } = require('../utils/cmsProductReferences');
const { normalizeContent } = require('../utils/contactValidation');
const { decodeLegacyContactContent } = require('../utils/legacyCmsContent');

const SERVICE_SLUGS = ['laptop-rental', 'macbook-rental', 'camera-rental', 'av-equipment-rental', 'server-rental', 'office-equipment-rental'];
const ALLOWED_PAGES = ['homepage', 'about', 'terms', 'privacy', 'contact', 'shipping', 'refund', 'faq', 'rental-process', 'kyc-policy', 'categories-page', 'rules', 'delivery-charges', 'late-fee-rules', 'cancellation-rules', 'subscription-rules', 'product-page', 'blog', ...SERVICE_SLUGS.map(slug => `service-${slug}`)];

const validateServiceContent = (content) => {
    const requiredText = ['title', 'headline', 'description', 'image', 'imageAlt', 'categoryHref', 'categoryLabel'];
    if (!content || Array.isArray(content) || typeof content !== 'object' || requiredText.some(key => typeof content[key] !== 'string' || !content[key].trim())) {
        throw new Error('Service pages require a title, headline, introduction, image, category and catalogue details.');
    }
    if (!content.categoryHref.startsWith('/') || content.categoryHref.startsWith('//') || !/^(\/|https:\/\/)/.test(content.image) || !['browse', 'quote'].includes(content.primaryAction)) {
        throw new Error('Service page links, image or primary action are invalid.');
    }
    if (['catalogueCategory', 'catalogueKeyword'].some(key => content[key] !== undefined && typeof content[key] !== 'string')) throw new Error('Catalogue filters must be text.');
    for (const [key, first, second] of [['useCases', 'title', 'description'], ['faqs', 'q', 'a']]) {
        if (!Array.isArray(content[key]) || content[key].some(item => !item || typeof item[first] !== 'string' || !item[first].trim() || typeof item[second] !== 'string' || !item[second].trim())) {
            throw new Error(`Service page ${key} must contain complete entries.`);
        }
    }
    if (!Array.isArray(content.keywords) || content.keywords.some(word => typeof word !== 'string')) throw new Error('Service page search phrases must be text.');
};

const assertKnownPage = (req, res) => {
    if (!ALLOWED_PAGES.includes(req.params.page)) {
        res.status(404);
        throw new Error('CMS page not found');
    }
};

const publicContent = (pageName, cms, draft = null) => {
    const out = { ...(cms.toJSON ? cms.toJSON() : cms), ...(draft || {}) };
    delete out.draftData;
    delete out.draftUpdatedAt;
    if (out.careersContent) out.careersContent = require('../utils/careersValidation').publicContent(out.careersContent);
    if (out.pageContent) out.pageContent = sanitizeHtml(out.pageContent);
    if (pageName === 'contact') out.contactContent = normalizeContent(out.contactContent || decodeLegacyContactContent(out.pageContent) || {});
    return out;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
// Offers live under the legacy `clientLogos` key. Older documents stored a plain
// image URL string per offer; the editor now sends campaign copy as well. Accept both
// and always persist the object form.
const normaliseOffers = (items) =>
    (Array.isArray(items) ? items : [])
        .map((item) =>
            typeof item === 'string'
                ? { image: item.trim(), link: '', title: '', subtitle: '', ctaText: '', altText: '' }
                : {
                    image: String(item?.image || '').trim(),
                    link: String(item?.link || '').trim(),
                    title: String(item?.title || '').trim().slice(0, 90),
                    subtitle: String(item?.subtitle || '').trim().slice(0, 160),
                    ctaText: String(item?.ctaText || '').trim().slice(0, 50),
                    altText: String(item?.altText || '').trim().slice(0, 160),
                }
        )
        .filter((offer) => offer.image);

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
            if (found) return { ...found, draftData: undefined, hasDraft: Boolean(found.draftData && Object.keys(found.draftData).length) };
            return { pageName: name, publishStatus: 'published', hasDraft: false, updatedAt: null };
        })
    );

    res.json(result);
});

// ── @desc   Get a single CMS page by name
// ── @route  GET /api/cms/:page   (e.g. /api/cms/homepage)
// ── @access Public
const getPage = asyncHandler(async (req, res) => {
    assertKnownPage(req, res);
    const { page } = req.params;
    const cms = await CMS.findOne({ pageName: page }) || new CMS({ pageName: page });
    res.json(publicContent(page, cms));
});

const getDraftPage = asyncHandler(async (req, res) => {
    assertKnownPage(req, res);
    const cms = await CMS.findOne({ pageName: req.params.page }) || new CMS({ pageName: req.params.page });
    res.json({ ...publicContent(req.params.page, cms, cms.draftData), _workflow: {
        hasDraft: Boolean(cms.draftData && Object.keys(cms.draftData).length),
        draftUpdatedAt: cms.draftUpdatedAt || null,
        publishedAt: cms.publishedAt || cms.updatedAt || null,
    } });
});

// ── @desc   Update (upsert) a CMS page
// ── @route  PUT /api/cms/:page
// ── @access Private/Admin
const updatePage = asyncHandler(async (req, res) => {
    assertKnownPage(req, res);
    const { page } = req.params;
    if (page.startsWith('service-') && req.body.serviceContent !== undefined) {
        try { validateServiceContent(req.body.serviceContent); }
        catch (error) { res.status(400); throw error; }
    }
    if (req.body.bannerShowText !== undefined && typeof req.body.bannerShowText !== 'boolean') {
        res.status(400); throw new Error('Banner text visibility must be true or false.');
    }
    if (req.body.bannerBackground !== undefined && (typeof req.body.bannerBackground !== 'string' || (req.body.bannerBackground !== '' && !/^#[\da-f]{6}$/i.test(req.body.bannerBackground)))) {
        res.status(400); throw new Error('Banner background must be a six-digit hex colour, such as #ffcf46.');
    }

    let contactContent;
    if (req.body.contactContent !== undefined) {
        try { contactContent = normalizeContent(req.body.contactContent); }
        catch (error) { res.status(400); throw error; }
    }
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
        'featureSectionImage', 'featureSectionMediaType', 'featureSectionMobileMedia',
        'featureSectionPosterImage', 'featureSectionMediaAlt', 'featureSectionInteraction',
        'featureSectionCtaText', 'featureSectionCtaLink', 'featureSectionStats',

        // Generic Info
        'pageContent', 'bannerImage', 'bannerTitle', 'bannerShowText', 'bannerBackground',

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

        // Blog landing page
        'blogTitle', 'blogSubtitle', 'blogTabs',
        'serviceContent',

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
        'metaTitle', 'metaDescription',
    ];

    const draft = { ...(cms.draftData || {}) };
    fields.forEach((field) => {
        if (req.body[field] !== undefined) {
            draft[field] = req.body[field];
        }
    });
    if (typeof draft.pageContent === 'string') draft.pageContent = sanitizeHtml(draft.pageContent);

    if (req.body.clientLogos !== undefined) {
        draft.clientLogos = normaliseOffers(req.body.clientLogos);
    }

    if (contactContent !== undefined) draft.contactContent = contactContent;
    const candidate = new CMS({ ...cms.toObject(), ...draft });
    await candidate.validate();
    cms.draftData = draft;
    cms.draftUpdatedAt = new Date();
    cms.markModified('draftData');
    await cms.save();
    res.json({ ...publicContent(page, cms, draft), _workflow: { hasDraft: true, draftUpdatedAt: cms.draftUpdatedAt, publishedAt: cms.publishedAt || null } });
});

const publishPage = asyncHandler(async (req, res) => {
    assertKnownPage(req, res);
    const cms = await CMS.findOne({ pageName: req.params.page });
    if (!cms?.draftData || !Object.keys(cms.draftData).length) {
        res.status(409);
        throw new Error('There is no saved draft to publish');
    }
    if (req.params.page === 'homepage') {
        try { await validateProductReferences({ ...(cms.toObject?.() || cms), ...cms.draftData }); }
        catch (error) { res.status(error.statusCode || 503); throw error; }
    }
    for (const [field, value] of Object.entries(cms.draftData)) cms[field] = value;
    cms.draftData = undefined;
    cms.draftUpdatedAt = null;
    cms.publishedAt = new Date();
    cms.publishStatus = 'published';
    const updated = await cms.save();
    res.json(publicContent(req.params.page, updated));
});

const discardDraft = asyncHandler(async (req, res) => {
    assertKnownPage(req, res);
    const cms = await CMS.findOne({ pageName: req.params.page });
    if (cms) {
        cms.draftData = undefined;
        cms.draftUpdatedAt = null;
        await cms.save();
    }
    res.json({ discarded: true });
});

const getPreviewToken = asyncHandler(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, private');
    res.setHeader('Referrer-Policy', 'no-referrer');
    assertKnownPage(req, res);
    const cms = await CMS.findOne({ pageName: req.params.page });
    if (!cms?.draftData) {
        res.status(409);
        throw new Error('Save a draft before previewing');
    }
    const token = jwt.sign({ purpose: 'cms-preview', page: req.params.page }, process.env.JWT_SECRET, { expiresIn: '10m' });
    res.json({ token, expiresInSeconds: 600 });
});

const getPreviewPage = asyncHandler(async (req, res) => {
    assertKnownPage(req, res);
    let claims;
    try { claims = jwt.verify(req.query.token || '', process.env.JWT_SECRET); }
    catch { res.status(403); throw new Error('Preview link is invalid or expired'); }
    if (claims.purpose !== 'cms-preview' || claims.page !== req.params.page) {
        res.status(403);
        throw new Error('Preview link does not match this page');
    }
    const cms = await CMS.findOne({ pageName: req.params.page });
    if (!cms?.draftData) { res.status(404); throw new Error('Draft not found'); }
    res.set('Cache-Control', 'private, no-store');
    res.set('X-Robots-Tag', 'noindex, nofollow');
    res.set('Referrer-Policy', 'no-referrer');
    res.json(publicContent(req.params.page, cms, cms.draftData));
});

module.exports = {
    getAllPages,
    getPage,
    getDraftPage,
    updatePage,
    publishPage,
    discardDraft,
    getPreviewToken,
    getPreviewPage,
};
