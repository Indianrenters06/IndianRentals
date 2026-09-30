"use client";
import { cmsUrl } from '@/lib/cmsPreview';
import { categoryHref } from '@/lib/categoryRoutes';
import { isProductOutOfStock } from '@/lib/productAvailability';
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { FaHeart, FaShareAlt, FaMinus, FaPlus, FaShoppingCart, FaStar, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { BsTruck, BsBoxSeam, BsCreditCard } from 'react-icons/bs';

import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/features/cartSlice';
import { getProductById } from '../../../services/productService';
import { checkServiceability } from '../../../services/serviceabilityService';
import BestRentedProducts from '../../../components/BestRentedProducts';
import SimpleRentComparison from './SimpleRentComparison';
import FaqSection from '../../../components/FaqSection';
import Testimonials from '../../../components/Testimonials';
import CompareTenures from '../../../components/CompareTenures';
import ProductDetailDrawer from '../../../components/ProductDetailDrawer';
import DeliveryCheck from '../../../components/DeliveryCheck';
import ProductReviewForm from '../../../components/ProductReviewForm';

import { Heart, Export as ExportIcon, Package, Truck, CalendarDots, MapPin, ArrowRight, ShieldCheck, CheckCircle, Wrench, Sparkle, Cube, UserCircle, Bank } from '@phosphor-icons/react';
import styles from './page.module.css';
import { StarIcon } from '@heroicons/react/24/solid';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, FreeMode, A11y } from 'swiper/modules';
import CarouselControls, { SwiperControls } from '../../../components/CarouselControls';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

export default function ProductDetailPage() {
    const router = useRouter();
    const params = useParams(); // Get ID from URL
    const dispatch = useDispatch();

    // Product Data State
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI States
    const [duration, setDuration] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('details');
    const [openFaq, setOpenFaq] = useState(0);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [gallerySwiper, setGallerySwiper] = useState(null);
    const [mobileImageIndex, setMobileImageIndex] = useState(0);
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    const [activeInfoDrawer, setActiveInfoDrawer] = useState(null);

    // Delivery pincode serviceability
    const [pincode, setPincode] = useState('');
    const [pinChecking, setPinChecking] = useState(false);
    const [pinResult, setPinResult] = useState(null); // { serviceable, message }

    // CMS Layout State — the global product-page template.
    const [globalLayout, setGlobalLayout] = useState(null);

    // Fetch Product Data
    useEffect(() => {
        if (!params.id) return;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                // The ID from URL might be a slug or actual ID.
                // Since our backend uses MongoDB IDs, we hope the link passed the ID.
                const data = await getProductById(params.id);
                setProduct(data);
            } catch (err) {
                console.error("Failed to load product", err);
                setError("Product not found");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params.id]);

    // The CMS template is independent of the product, so it loads in parallel —
    // that way even the loading/not-found copy comes from the CMS.
    useEffect(() => {
        const fetchLayout = async () => {
            try {
                const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const cmsRes = await window.fetch(cmsUrl('product-page'));
                if (cmsRes.ok) setGlobalLayout(await cmsRes.json());
            } catch (e) {
                console.error("Failed to load product page layout", e);
            }
        };
        fetchLayout();
    }, []);

    // Per-product overrides win over the global template; blanks fall through.
    const pageLayout = useMemo(() => {
        const g = globalLayout || {};
        const o = product?.pageLayout || {};
        const text = (value, key) => (value ? { [key]: value } : {});
        const flag = (value, key) => (value != null ? { [key]: value } : {});
        return {
            ...g,
            ...flag(o.enableCompare, 'productPageEnableCompare'),
            ...flag(o.enableRelated, 'productPageEnableRelated'),
            ...flag(o.enableFaq, 'productPageEnableFaq'),
            ...flag(o.enableTestimonials, 'productPageEnableTestimonials'),
            ...flag(o.enableRating, 'productPageEnableRating'),
            ...flag(o.enablePriceBreakdown, 'productPageEnablePriceBreakdown'),
            ...flag(o.enableTenureSlider, 'productPageEnableTenureSlider'),
            ...flag(o.enableQuantity, 'productPageEnableQuantity'),
            ...text(o.discountText, 'productPageDiscountText'),
            ...text(o.deliveryText, 'productPageDeliveryText'),
            ...text(o.ctaText, 'productPageCtaText'),
            ...text(o.compareLinkText, 'productPageCompareLinkText'),
            ...text(o.priceBreakdownText, 'productPagePriceBreakdownText'),
            ...text(o.tenureSliderLabel, 'productPageTenureSliderLabel'),
            ...text(o.benefitsHeading, 'productPageBenefitsHeading'),
            ...text(o.testimonialsHeading, 'productPageTestimonialsHeading'),
            ...text(o.faqHeading, 'productPageFaqHeading'),
            ...text(o.relatedHeading, 'productPageRelatedHeading'),
            ...(o.benefits?.length > 0 ? { productPageBenefits: o.benefits } : {}),
        };
    }, [globalLayout, product]);

    // Every label on this page reads through here, so the CMS value always wins
    // and the literal is only the last-resort fallback.
    const cms = (key, fallback) => {
        const value = pageLayout?.[`productPage${key}`];
        return value === undefined || value === null || value === '' ? fallback : value;
    };
    const on = (key) => pageLayout?.[`productPageEnable${key}`] !== false;

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? -1 : index);
    };

    // Tenure plans come from the CMS; discountPercent is applied to base rent.
    const basePrice = product?.rentalPrice || 2560;
    const cmsTenures = pageLayout?.productPageTenures?.length > 0
        ? pageLayout.productPageTenures
        : [
            { label: '1+', months: 1, discountPercent: 0 },
            { label: '3+', months: 3, discountPercent: 10 },
            { label: '6+', months: 6, discountPercent: 20 },
            { label: '9+', months: 9, discountPercent: 25 },
            { label: '12+', months: 12, discountPercent: 30 },
        ];
    const tenures = cmsTenures.map(t => ({
        label: t.label,
        months: Number(t.months) || 1,
        price: Math.round(basePrice * (1 - (Number(t.discountPercent) || 0) / 100)),
    }));

    const currentPlan = tenures.find(t => duration <= t.months) || tenures[tenures.length - 1];
    const tenureDiscount = basePrice > 0 ? Math.max(0, Math.round((1 - currentPlan.price / basePrice) * 100)) : 0;
    const monthWord = (n) => (n === 1 ? cms('MonthLabel', 'Month') : cms('MonthsLabel', 'Months'));

    const handleAddToCart = () => {
        if (!product || isProductOutOfStock(product)) return;

        const item = {
            id: product._id,
            name: product.name,
            image: product.images?.[0] || "/images/placeholder.png",
            price: currentPlan.price,
            monthlyRent: currentPlan.price,
            duration: duration,
            quantity: 1, // Quantity fixed to 1
            refundableAmount: product.securityDeposit ?? 0,
            description: product.description,
            tenures: tenures,
            sourceUrl: `/products/${product._id}`,
        };
        dispatch(addToCart(item));
        router.push('/cart');
    };

    const handleCheckPincode = async () => {
        const pin = pincode.trim();
        if (!/^[1-9][0-9]{5}$/.test(pin)) {
            setPinResult({ serviceable: false, message: cms('PincodeInvalidText', 'Please enter a valid 6-digit pincode.') });
            return;
        }
        try {
            setPinChecking(true);
            setPinResult(null);
            const data = await checkServiceability(pin);
            setPinResult(data);
        } catch (e) {
            setPinResult({ serviceable: false, message: cms('PincodeErrorText', 'Could not check right now. Please try again.') });
        } finally {
            setPinChecking(false);
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center">{cms('LoadingText', 'Loading...')}</div>;
    if (error || !product) return <div className="min-h-screen flex justify-center items-center">{cms('NotFoundText', 'Product not found')}</div>;

    // Derived Data
    const outOfStock = isProductOutOfStock(product);
    const galleryImages = product.images?.length ? product.images : ['/images/placeholder.png'];
    const mainImage = galleryImages[0];

    // Specs fall back to the CMS default list when the product has none.
    const cmsDefaultSpecs = pageLayout?.productPageDefaultSpecs || [];
    const specRows = product.specifications && product.specifications.length > 0
        ? product.specifications
        : [{ label: 'MODEL', value: product.name }, ...cmsDefaultSpecs];

    // Details tabs — labels and per-tab visibility are CMS-driven.
    const tabs = [
        { key: 'details', label: cms('TabDetailsLabel', 'Product Details'), enabled: true },
        { key: 'return', label: cms('TabReturnLabel', 'Return Policy'), enabled: on('TabReturn') },
        { key: 'shipping', label: cms('TabShippingLabel', 'Shipping Policy'), enabled: on('TabShipping') },
        { key: 'review', label: cms('TabReviewLabel', 'Give us a Review'), enabled: on('TabReview') },
    ].filter(t => t.enabled);
    const currentTab = tabs.some(t => t.key === activeTab) ? activeTab : 'details';
    const benefitIcon = (label) => {
        const name = String(label).toLowerCase();
        if (/accessor|package/.test(name)) return Cube;
        if (/repair|maintenance|support/.test(name)) return UserCircle;
        if (/saniti|clean|hygien/.test(name)) return Bank;
        return Sparkle;
    };
    const benefitItems = (product.benefits?.length > 0 ? product.benefits : (pageLayout?.productPageBenefits || [
        'Fully Functional (100% Tested)', 'Original Accessories Included', 'Free Repairs & Maintenance', 'Professionally sanitized'
    ])).map(benefit => benefit.type || benefit);

    return (
        <div className="w-full flex flex-col items-center bg-white font-sans text-[#1D1D1F] tracking-tight antialiased">

            {/* ══════════════════════════════════════════════
                MOBILE LAYOUT — hidden on md+ screens
            ══════════════════════════════════════════════ */}
            <div className="w-full flex flex-col md:hidden bg-white">

                {/* ── Product Header ── */}
                <div className={styles.mobileProductHeader}>

                    {/* Breadcrumb */}
                    <div className={styles.productBreadcrumb}>
                        <Link href="/">Shop all</Link>
                        <span style={{ fontSize: '10px', color: '#999' }}>›</span>
                        <Link href={categoryHref(product.category || 'all')}>{product.category || 'Category'}</Link>
                        <span style={{ fontSize: '10px', color: '#999' }}>›</span>
                        <strong>{product.name?.split(' ').slice(0, 2).join(' ')}</strong>
                    </div>


                    {/* Image Card */}
                    <div className={styles.mobileGallery} style={{ background: '#fff', border: '1px solid #EEE', borderRadius: '16px', aspectRatio: '1 / 1', width: '100%', marginInline: 'auto', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Discount Badge */}
                        {tenureDiscount > 0 && <div style={{ position: 'absolute', top: '13px', left: '14px', background: '#ED2115', borderRadius: '27px', padding: '4px 14px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 3px 2px rgba(120,120,120,0.05), 0px 1px 1px rgba(120,120,120,0.09)' }}>
                            <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '12px', lineHeight: '1.2', color: '#FFF2F1', letterSpacing: '-0.48px', whiteSpace: 'nowrap' }}>
                                {tenureDiscount}% off monthly rent
                            </span>
                        </div>}
                        {/* Action Icons */}
                        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
                            <div style={{ width: '24px', height: '24px', background: '#EEE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Heart size={14} weight="regular" color="#333" />
                            </div>
                            <div style={{ width: '24px', height: '24px', background: '#EEE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ExportIcon size={14} color="#333" />
                            </div>
                        </div>
                        {/* Main Image */}
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <Image
                                src={galleryImages[mobileImageIndex] || mainImage}
                                alt={product.name}
                                fill
                                className="object-contain"
                                priority
                                sizes="300px"
                            />
                        </div>
                    <CarouselControls count={galleryImages.length} current={mobileImageIndex} label="Product images" variant="gallery"
                        onPrevious={() => setMobileImageIndex(index => (index - 1 + galleryImages.length) % galleryImages.length)}
                        onNext={() => setMobileImageIndex(index => (index + 1) % galleryImages.length)}
                        onSelect={setMobileImageIndex}
                    />
                    </div>

                    {/* Product Pricing Card */}
                    <div className={styles.mobilePricingCard}>

                        {/* Title + rating */}
                        <div style={{ padding: '10px', borderBottom: '1px solid #E2E2E2', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <h1 className={styles.mobileProductTitle}>
                                {product.name}
                            </h1>
                            {outOfStock && <div className={styles.stockNotice} role="status">
                                <strong>Out of stock</strong>
                                <span>Currently unavailable to rent.</span>
                                <Link href={categoryHref(product.category || 'all')}>Browse similar products</Link>
                            </div>}
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                {/* Stars */}
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', background: '#FFF3D3', border: '1px solid #FFE485', borderRadius: '8px', padding: '4px 6px' }}>
                                    <div style={{ display: 'flex', gap: '2px' }}>
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <StarIcon key={s} style={{ width: '16px', height: '16px', color: s <= Math.round(product.rating || 4.5) ? '#FF920A' : '#e5e7eb' }} />
                                        ))}
                                    </div>
                                    <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 500, fontSize: '11px', color: '#333', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
                                        {product.rating || '4.5'} ({product.numReviews || 12})
                                    </span>
                                </div>
                                {/* Delivery */}
                                {!outOfStock && <div style={{ display: 'flex', gap: '4px', alignItems: 'center', background: '#00B505', borderRadius: '8px', padding: '4px 6px' }}>
                                    <BsTruck size={14} color="white" />
                                    <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 500, fontSize: '12px', color: '#fff', letterSpacing: '-0.48px', whiteSpace: 'nowrap' }}>
                                        {product.deliveryTime || '2-4 days'}
                                    </span>
                                </div>}
                            </div>
                        </div>

                        {/* Compare rental terms in a bottom sheet on narrow screens. */}
                        {on('Compare') && <button type="button" className={styles.mobileTermButton} onClick={() => setIsCompareOpen(true)}>
                            <span className={styles.mobileTermPrompt}><span>{cms('TenureSliderLabel', 'Pick your rental term')}</span><small>Compare monthly prices</small></span>
                            <strong><span className={styles.mobileTermValue}>{duration} {monthWord(duration)} <FaChevronDown size={11} aria-hidden="true" /></span><span className={styles.mobileTermChange}>Change term</span></strong>
                        </button>}

                        {/* Price row */}
                            <div style={{ display: 'flex', minHeight: '52px', borderBottom: '1px solid #E2E2E2' }}>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px', padding: '0 10px' }}>
                                <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '20px', lineHeight: '26px', letterSpacing: '-0.8px', color: '#ed2115' }}>
                                    ₹{currentPlan.price}
                                </span>
                                <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 500, fontSize: '12px', color: '#757575', letterSpacing: '-0.2px' }}>/mo</span>
                                <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 500, fontSize: '12px', color: '#757575', letterSpacing: '-0.2px', marginLeft: '2px' }}>
                                    for {duration} {duration === 1 ? 'month' : 'months'}
                                </span>
                            </div>
                        </div>

                        {on('PriceBreakdown') && <div className={styles.mobileBreakdownRow}>
                            <button type="button" onClick={() => setActiveInfoDrawer('breakdown')}>{cms('PriceBreakdownText', 'Full breakdown')}</button>
                        </div>}

                        {/* View All Benefits */}
                        {on('ViewAllBenefits') && <div className={styles.viewBenefitsRow}>
                            <button type="button" onClick={() => setActiveInfoDrawer('benefits')} className={styles.viewBenefitsButton}>
                                {cms('ViewAllBenefitsText', 'View All Benefits')}
                            </button>
                        </div>}
                    </div>

                    {/* What's included */}
                    {on('Benefits') && <div className={styles.benefitsSection}>
                        <h3 style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '12px', color: '#1F1F1F', letterSpacing: '-0.4px', margin: 0 }}>
                            {cms('BenefitsHeading', "What's included in your plan")}
                        </h3>
                        <div id="mobile-product-benefits" className={styles.benefitGrid}>
                            {benefitItems.map((text, i) => {
                                const Icon = benefitIcon(text);
                                return (
                                    <div key={i} className={styles.benefitCard}>
                                        <Icon size={22} color="#fff" weight="bold" style={{ flexShrink: 0 }} />
                                        <span>{text}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>}

                    {/* Deposit + KYC Cards */}
                    {(on('DepositCard') || on('KycCard')) && <div className={styles.noticeGrid}>
                        {on('DepositCard') && <div className={`${styles.noticeCard} ${styles.depositCard}`}>
                            <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '13px' }}>
                                {cms('DepositLabel', '100% Refundable Deposit')}
                            </span>
                            <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 700, fontSize: '15px', textAlign: 'right' }}>
                                {product.securityDeposit != null ? `₹${Number(product.securityDeposit).toLocaleString('en-IN')}/-` : 'Confirmed at checkout'}
                            </span>
                        </div>}
                        {on('KycCard') && <div className={`${styles.noticeCard} ${styles.kycCard}`}>
                            <p className={styles.kycSentence}>{cms('KycLine1', 'Place Order & complete KYC anytime').trim()} {cms('KycLine2', 'to get your items the next day').trim()}</p>
                            <Image src={cms('KycImage', '/images/product/kyc-delivery.webp')} alt="" width={76} height={76} unoptimized className={styles.kycImage} />
                        </div>}
                    </div>}

                    {/* Book Your Plan CTA */}
                    <button
                        onClick={handleAddToCart}
                        disabled={outOfStock}
                        className={styles.primaryCta}>
                        <span>
                            {outOfStock ? 'Currently unavailable' : cms('CtaTextMobile', 'Book Your Plan')}
                        </span>
                    </button>

                    {/* Cancellation + Tenure Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}>
                                <Truck size={24} weight="regular" />
                            </div>
                            <span style={{ flex: 1, fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '13px', lineHeight: '18px', color: '#333' }}>
                                {cms('CancelCardText', 'What if I cancel or return before 6 months?')}
                            </span>
                            <button type="button" onClick={() => setActiveInfoDrawer('cancel')} className={styles.infoLink}>
                                {cms('CancelCardLinkText', 'View Details')}
                            </button>
                        </div>
                        <div className={styles.infoCard}>
                            <div className={styles.infoIcon}>
                                <CalendarDots size={24} weight="regular" />
                            </div>
                            <span style={{ flex: 1, fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '13px', lineHeight: '18px', color: '#333' }}>
                                {cms('ExtendCardText', 'How do I extend tenure after 6 months?')}
                            </span>
                            <button type="button" onClick={() => setActiveInfoDrawer('extend')} className={styles.infoLink}>{cms('ExtendCardLinkText', 'View Details')}</button>
                        </div>
                    </div>

                    {/* Delivery Check */}
                    <DeliveryCheck
                        id="delivery-pincode-mobile"
                        value={pincode}
                        onChange={(value) => { setPincode(value); setPinResult(null); }}
                        onCheck={handleCheckPincode}
                        checking={pinChecking}
                        result={pinResult}
                        label={cms('DeliveryLabel', 'Check delivery')}
                        placeholder={cms('PincodePlaceholder', 'Enter your pincode')}
                        buttonLabel={cms('PincodeMobileCtaText', 'Check')}
                    />

                    {/* Product Details Tabs */}
                    {on('Tabs') && <div className={styles.detailsPanel}>
                        {/* Tab Buttons */}
                        <div className={styles.detailTabs}>
                            {tabs.map(tab => (
                                <button key={tab.key} type="button" aria-pressed={currentTab === tab.key} onClick={() => setActiveTab(tab.key)} className={`${styles.detailTab} ${currentTab === tab.key ? styles.detailTabActive : ''} ${tab.key === 'review' ? styles.detailTabReview : ''}`}>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        {/* Divider */}
                        <div style={{ height: '1px', background: '#EEE', width: '100%' }} />
                        {/* Spec Rows */}
                        {currentTab === 'details' && (
                            <div className={styles.specGrid}>
                                {specRows.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span className={styles.specLabel}>{item.label}</span>
                                        <span className={styles.specValue}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {currentTab === 'return' && (
                            <p className={styles.policyText}>
                                {product.returnPolicy || cms('DefaultReturnPolicy', 'Standard return policy applies. Please contact support for details.')}
                            </p>
                        )}
                        {currentTab === 'shipping' && (
                            <p className={styles.policyText}>
                                {product.shippingPolicy || cms('DefaultShippingPolicy', 'Standard shipping policy applies. Contact support for delivery details.')}
                            </p>
                        )}
                        {currentTab === 'review' && <ProductReviewForm productId={product._id} cms={cms} />}
                    </div>}
                </div>

                {on('Testimonials') && (
                    <Testimonials
                        sectionId="customer-reviews-mobile"
                        titleOverride={cms('TestimonialsHeading', null)}
                        subtitleOverride={cms('TestimonialsSubheading', null)}
                    />
                )}

                {/* ── Best Rented Products (Mobile) ── */}
                {on('Related') && (
                    <BestRentedProducts
                        customProducts={product.pageLayout?.relatedProducts?.length > 0 ? product.pageLayout.relatedProducts : null}
                        titleOverride={cms('RelatedHeading', null)}
                        productIdsOverride={pageLayout?.productPageGlobalRelatedIds || null}
                    />
                )}

                {on('RentVsBuy') && <SimpleRentComparison onChooseTerm={on('Compare') ? () => setIsCompareOpen(true) : undefined} />}

                {/* ── FAQ (Mobile) ── */}
                {on('Faq') && (
                    product.faqs && product.faqs.length > 0 ? (
                        <FaqSection cmsData={{ faqItems: product.faqs, faqTitle: cms('FaqHeading', 'Product FAQs'), faqSubtitle: cms('FaqSubheading', 'Specific questions about this product.') }} limit={5} />
                    ) : (
                        <FaqSection limit={5} />
                    )
                )}
            </div>
            {/* ── END MOBILE ── */}

            {/* ══════════════════════════════════════════════
                DESKTOP LAYOUT — hidden on mobile
            ══════════════════════════════════════════════ */}
            <div className="hidden md:flex w-full flex-col items-center">
                <div
                    style={{
                        maxWidth: '1440px',
                        width: '100%',
                        paddingTop: '40px',
                        paddingBottom: '40px',
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                        background: 'hsla(0, 0%, 97%, 1)',
                        opacity: 1,
                        boxSizing: 'border-box'
                    }}
                >
                    {/* Breadcrumb */}
                    {on('Breadcrumb') && (
                        <div className="w-full max-w-[1264px] mx-auto px-4 sm:px-6 lg:px-8 text-[14px] font-medium text-[#586A84]">
                            <div className="flex items-center gap-2">
                                <Link href={cms('BreadcrumbHomeLink', '/')} className="hover:text-black transition-colors">{cms('BreadcrumbHomeLabel', 'Shop all')}</Link>
                                <span className="text-gray-300 text-[16px] leading-none mb-0.5">›</span>
                                <Link href={categoryHref(product.category || 'all')} className="hover:text-black transition-colors">{product.category || 'Category'}</Link>
                                {product.subcategory?.name && (
                                    <>
                                        <span className="text-gray-300 text-[16px] leading-none mb-0.5">›</span>
                                        <span className="text-[#1D1D1F] font-bold truncate max-w-[150px] lg:max-w-[300px]">{product.subcategory.name}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <main className="w-full max-w-[1264px] mx-auto px-4 md:px-8">
                        <div
                            className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_536px] items-start max-w-[560px] lg:max-w-none mx-auto"
                            style={{
                                width: '100%',
                                gap: '16px',
                                opacity: 1
                            }}
                        >

                            {/* Left Column - Images Gallery */}
                            <div
                                className={`flex flex-col ${styles.stickyGallery}`}
                                style={{
                                    width: '100%',
                                    gap: '10px',
                                    opacity: 1
                                }}
                            >

                                {/* Main Image Slider */}
                                <div
                                    className="relative w-full bg-white flex items-center justify-center group overflow-hidden shrink-0"
                                    style={{
                                        width: '100%',
                                        aspectRatio: '1 / 1',
                                        borderRadius: '16px',
                                        border: '1px solid hsla(0, 0%, 93%, 1)',
                                        opacity: 1
                                    }}
                                >
                                    <div
                                        className="absolute z-10 flex flex-col"
                                        style={{
                                            width: '34px',
                                            height: '76px',
                                            gap: '8px',
                                            top: '24px',
                                            right: '12px',
                                            opacity: 1
                                        }}
                                    >
                                        {on('Wishlist') && (
                                            <button className="flex items-center justify-center rounded-full transition-colors border border-transparent hover:border-gray-200"
                                                style={{ width: '34px', height: '34px', background: 'hsla(0, 0%, 93%, 1)', color: 'hsla(0, 0%, 16%, 1)' }}>
                                                <Heart size={20} weight="regular" />
                                            </button>
                                        )}
                                        {on('Share') && (
                                            <button className="flex items-center justify-center rounded-full transition-colors border border-transparent hover:border-gray-200"
                                                style={{ width: '34px', height: '34px', background: 'hsla(0, 0%, 93%, 1)', color: 'hsla(0, 0%, 16%, 1)' }}>
                                                <ExportIcon size={20} />
                                            </button>
                                        )}
                                    </div>

                                    <Swiper
                                        onSwiper={setGallerySwiper}
                                        style={{
                                            width: "100%",
                                            height: "100%"
                                        }}
                                        loop={(product.images?.length || 0) > 1}
                                        spaceBetween={10}
                                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                        modules={[FreeMode, A11y, Thumbs]}
                                        className="main-image-swiper"
                                    >
                                        {(product.images && product.images.length > 0 ? product.images : [mainImage]).map((img, index) => (
                                            <SwiperSlide key={index} className="flex items-center justify-center">
                                                <div
                                                    className="relative flex items-center justify-center overflow-hidden"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        opacity: 1
                                                    }}
                                                >
                                                    <Image
                                                        src={img}
                                                        alt={`${product.name} - ${index}`}
                                                        fill
                                                        className="object-contain"
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                        priority={index === 0}
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}

                                    </Swiper>

                                    <SwiperControls swiper={gallerySwiper} count={product.images?.length || 1} label="Product images" variant="gallery" />
                                </div>

                                {/* Thumbnails Slider */}
                                {on('Thumbnails') && (
                                    <div className="w-full">
                                        <Swiper
                                            onSwiper={setThumbsSwiper}
                                            loop={(product.images?.length || 0) > 1}
                                            spaceBetween={12}
                                            slidesPerView={4}
                                            freeMode={true}
                                            watchSlidesProgress={true}
                                            modules={[FreeMode, A11y, Thumbs]}
                                            className={`thumbs-swiper ${styles.thumbRail}`}
                                            breakpoints={{
                                                320: { slidesPerView: 3, spaceBetween: 10 },
                                                768: { slidesPerView: 4, spaceBetween: 12 }
                                            }}
                                        >
                                            {(product.images && product.images.length > 0 ? product.images : [mainImage]).map((img, i) => (
                                                <SwiperSlide key={i}>
                                                    <div className="w-full aspect-square bg-white border border-[#EDEDED] rounded-xl cursor-pointer transition-all hover:border-gray-400 overflow-hidden relative">
                                                        <Image src={img} alt={`Thumbnail ${i + 1} of ${product.name}`} fill className="object-cover" />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Product Purchase Details */}
                            <div
                                className="flex flex-col w-full max-w-[680px] lg:max-w-[536px] mx-auto lg:mx-0 lg:justify-self-end gap-[12px] lg:gap-[8px]"
                                style={{
                                    opacity: 1,
                                    gridColumnStart: 'auto',
                                    gridRowStart: 'auto'
                                }}
                            >

                                {/* Main White Card (Title, Rating, Slider, Price) */}
                                <div
                                    className="bg-white rounded-[16px] flex flex-col overflow-hidden w-full lg:min-h-[334px]"
                                    style={{
                                        height: 'auto',
                                        border: '1px solid var(--color-grey-grey-100, hsla(0, 0%, 93%, 1))',
                                        background: 'var(--color-grey-white, hsla(0, 0%, 100%, 1))',
                                        opacity: 1
                                    }}
                                >
                                    {/* Header Section (Title & Ratings) */}
                                    <div
                                        className="flex flex-col"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            borderBottom: '1px solid hsla(0, 0%, 93%, 1)',
                                            paddingTop: '20px',
                                            paddingRight: '20px',
                                            paddingBottom: '12px',
                                            paddingLeft: '20px',
                                            gap: '10px',
                                            opacity: 1
                                        }}
                                    >
                                        {/* Title */}
                                        <h1 className="text-[21px] font-semibold text-[#292929] leading-[28px] tracking-[-0.8px] pr-4">
                                            {product.name}
                                        </h1>
                                        {outOfStock && <div className={styles.stockNotice} role="status">
                                            <strong>Out of stock</strong>
                                            <span>Currently unavailable to rent.</span>
                                            <Link href={categoryHref(product.category || 'all')}>Browse similar products</Link>
                                        </div>}

                                        {/* Rating & Stock */}
                                        <div
                                            className="flex items-center"
                                            style={{
                                                maxWidth: '227px',
                                                height: '24px',
                                                gap: '10px',
                                                opacity: 1
                                            }}
                                        >
                                            {/* Star Rating — always visible */}
                                            <div
                                                className="flex items-center"
                                                style={{
                                                    width: '140px',
                                                    height: '24px',
                                                    borderRadius: '8px',
                                                    padding: '4px 6px 4px 6px',
                                                    gap: '4px',
                                                    opacity: 1,
                                                    background: 'hsla(44, 100%, 91%, 1)',
                                                    border: '1px solid hsla(47, 100%, 76%, 1)'
                                                }}
                                            >
                                                <div className="flex gap-[2px]">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <StarIcon
                                                            key={s}
                                                            style={{
                                                                width: '13.21px',
                                                                height: '12.65px',
                                                                color: 'var(--color-orange-orange-500, hsla(33, 100%, 52%, 1))',
                                                                opacity: s <= Math.round(product.rating || 4.5) ? 1 : 0.3
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-[12px] font-medium text-[#333333]">{product.rating || "4.5"} ({product.numReviews || 12})</span>
                                            </div>
                                            {/* Delivery Badge — always visible */}
                                            {!outOfStock && <div className="bg-[#00b505] text-white text-[12px] font-medium px-2 py-0.5 rounded-[8px] flex items-center justify-center gap-1.5 h-full whitespace-nowrap">
                                                <BsTruck size={13} className="stroke-[0.5]" />
                                                <span className="mt-[1px]">{product.deliveryTime || cms('DeliveryText', '2-4 days')}</span>
                                            </div>}
                                        </div>
                                    </div>

                                    {/* Interactive Slider Section — always visible */}
                                    <div
                                        className={`${styles.tenurePanel} flex flex-col`}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                gap: '12px',
                                                background: 'hsla(0, 0%, 100%, 1)',
                                                opacity: 1
                                            }}
                                        >
                                            {/* Rental Period Selection */}
                                            <div
                                                className="flex items-center"
                                                style={{
                                                    width: '100%',
                                                    height: '20px',
                                                    justifyContent: 'space-between',
                                                    opacity: 1
                                                }}
                                            >
                                                <h3
                                                    style={{
                                                        width: '216px',
                                                        height: '20px',
                                                        fontFamily: '"Mona Sans", sans-serif',
                                                        fontWeight: 500,
                                                        fontSize: 'var(--font-size-2, 14px)',
                                                        lineHeight: 'var(--font-line-height-2, 20px)',
                                                        letterSpacing: 'var(--font-letter-spacing-7, normal)',
                                                        color: 'var(--color-grey-grey-800, hsla(0, 0%, 12%, 1))',
                                                        opacity: 1,
                                                        margin: 0,
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            textDecoration: 'underline',
                                                            textDecorationStyle: 'solid',
                                                            textUnderlineOffset: '10%',
                                                            textDecorationThickness: '8%',
                                                            textDecorationSkipInk: 'auto'
                                                        }}
                                                    >
                                                        {cms('TenureSliderLabel', 'Select your minimum rental period')}
                                                    </span>
                                                </h3>
                                                <span className="text-[16px] font-semibold text-[#1f1f1f] tracking-[-0.4px]">{`${duration} ${monthWord(duration)}`}</span>
                                            </div>

                                            {/* Tenure Slider */}
                                            <div
                                                className={`${styles.tenureScale} relative flex flex-col`}
                                                style={{
                                                    width: '100%',
                                                    height: '37.73px',
                                                    gap: '11px',
                                                    opacity: 1
                                                }}
                                            >
                                                {(() => {
                                                    // Steps come straight from the CMS tenure list.
                                                    const stepCount = tenures.length;
                                                    const lastIdx = Math.max(stepCount - 1, 1);
                                                    const matchIdx = tenures.findIndex(t => duration <= t.months);
                                                    const currentStep = (matchIdx === -1 ? stepCount - 1 : matchIdx) + 1;
                                                    const activePct = ((currentStep - 1) / lastIdx) * 100;
                                                    const labels = tenures.map(t => t.label);

                                                    return (
                                                        <>
                                                            {/* Track — Figma node I23805:12116;23337:14508;23337:14400.
                                                        Solid orange bar with a 1.2px border; the radii far exceed
                                                        the 3.726px height, so both ends render as full pill caps. */}
                                                            <div className="relative w-full flex items-center" style={{ height: '6.126px' }}>
                                                                <div
                                                                    className="absolute w-full"
                                                                    style={{
                                                                        // Figma gives the bar a 3.726px box plus a 1.2px stroke.
                                                                        // Read as an outside stroke that totals 6.126px; as a CSS
                                                                        // border it sat inside the box under border-box and added
                                                                        // nothing, so the height carries the full value instead.
                                                                        height: '6.126px',
                                                                        boxSizing: 'border-box',
                                                                        background: '#e6e6e6',
                                                                        borderRadius: '31.846px 38.85px 31.846px 31.846px'
                                                                    }}
                                                                />
                                                                <div className="absolute" style={{ width: `${activePct}%`, height: '6.126px', background: '#e26e00', borderRadius: '31px' }} />

                                                                {/* Thumb — Figma 16px ring over a 10px white centre (3px ring). */}
                                                                <div
                                                                    className="absolute rounded-full bg-white transition-all duration-300 z-10"
                                                                    style={{
                                                                        width: '16px',
                                                                        height: '16px',
                                                                        border: '3px solid var(--color-orange-600, #e26e00)',
                                                                        left: `calc(${activePct}% - 8px)`
                                                                    }}
                                                                />

                                                                <input
                                                                    aria-label="Minimum rental period"
                                                                    type="range"
                                                                    min="1"
                                                                    max={stepCount}
                                                                    step="1"
                                                                    value={currentStep}
                                                                    onChange={(e) => {
                                                                        const step = parseInt(e.target.value);
                                                                        setDuration(tenures[step - 1]?.months || 1);
                                                                    }}
                                                                    className="absolute w-full opacity-0 cursor-pointer z-20"
                                                                    style={{ height: '24px', top: '-9px' }}
                                                                />
                                                            </div>

                                                            {/* Labels and Ticks */}
                                                            <div className="relative w-full" style={{ height: '20px' }}>
                                                                {labels.map((label, i) => {
                                                                    const pct = (i / lastIdx) * 100;
                                                                    return (
                                                                        <div
                                                                            key={i}
                                                                            className="absolute flex flex-col items-center pointer-events-none"
                                                                            style={{
                                                                                left: `calc(${pct}%)`,
                                                                                transform: 'translateX(-50%)',
                                                                                top: '0px'
                                                                            }}
                                                                        >
                                                                            {/* Tick + label per Figma: 8.424px rule, 12px/1.2
                                                                        Regular at -0.48px tracking in grey-700, and no
                                                                        gap between the rule and its label. */}
                                                                            <div style={{ width: '1px', height: '8.424px', background: 'hsla(0, 0%, 75%, 1)' }} />
                                                                            <span
                                                                                style={{
                                                                                    fontFamily: '"Mona Sans", sans-serif',
                                                                                    fontSize: '12px',
                                                                                    fontWeight: 400,
                                                                                    color: '#333333',
                                                                                    lineHeight: 1.2,
                                                                                    letterSpacing: '-0.48px'
                                                                                }}
                                                                            >
                                                                                {label}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </div>

                                            {/* Links */}
                                            <div className={styles.tenureActions}>
                                                {on('PriceBreakdown') ? (
                                                    <button type="button" onClick={() => setActiveInfoDrawer('breakdown')} className={`${styles.tenureAction} ${styles.tenureBreakdown}`}>
                                                        {cms('PriceBreakdownText', 'Price breakdown')}
                                                    </button>
                                                ) : <span />}
                                                {on('Compare') && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsCompareOpen(true)}
                                                        className={`${styles.tenureAction} ${styles.tenureCompare}`}
                                                    >
                                                        {cms('CompareLinkText', 'Compare rental periods')}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                    {/* Price & Quantity Footer Card */}
                                    <div
                                        className="flex flex-col"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            opacity: 1,
                                            borderTopLeftRadius: '0px',
                                            borderTopRightRadius: '0px',
                                            borderBottomRightRadius: '6px',
                                            borderBottomLeftRadius: '6px',
                                            borderTop: '1px solid hsla(0, 0%, 93%, 1)'
                                        }}
                                    >
                                        {/* Price and Quantity Row */}
                                        <div
                                            className="flex justify-between items-center"
                                            style={{
                                                width: '100%',
                                                height: '55px',
                                                opacity: 1
                                            }}
                                        >
                                            <div
                                                className="flex items-center"
                                                style={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                    height: '55px',
                                                    paddingRight: '12px',
                                                    paddingLeft: '12px',
                                                    gap: '12px',
                                                    opacity: 1,
                                                    borderRight: '1px solid hsla(0, 0%, 93%, 1)'
                                                }}
                                            >
                                                {/* Mobile: simplified price */}
                                                <div className="flex lg:hidden items-baseline gap-1 flex-wrap">
                                                    <span style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 600, fontSize: '22px', lineHeight: 1, letterSpacing: '-0.8px', color: 'hsla(3, 86%, 51%, 1)' }}>
                                                        ₹{currentPlan.price * quantity}
                                                    </span>
                                                    <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400, fontSize: '13px', color: 'hsla(0, 0%, 46%, 1)', whiteSpace: 'nowrap' }}>
                                                        {cms('MobilePriceSuffix', '/mo for')} {duration} {monthWord(duration).toLowerCase()}
                                                    </span>
                                                </div>

                                                {/* Desktop: price + MRP + discount — single inline row (matches Figma) */}
                                                <div className="hidden lg:flex items-center gap-[20px]">
                                                    <div className="flex items-center gap-1">
                                                        <span style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 600, fontSize: '27px', lineHeight: 1, letterSpacing: '-0.8px', color: '#ed2115' }}>
                                                            ₹{currentPlan.price * quantity}
                                                        </span>
                                                        <span style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400, fontSize: '16px', lineHeight: 1, letterSpacing: '-0.04em', color: '#757575' }}>
                                                            {cms('PerMonthLabel', '/month')}
                                                        </span>
                                                    </div>
                                                    {tenureDiscount > 0 && <div className="flex items-center gap-[4px]">
                                                        <span className="text-[16px] font-medium line-through shrink-0" style={{ color: '#757575' }}>
                                                            ₹{basePrice * quantity}
                                                        </span>
                                                        <span className="text-[12px] font-normal flex items-center justify-center whitespace-nowrap shrink-0"
                                                            style={{ height: '22px', borderRadius: '27px', padding: '4px 10px', background: '#ed2115', color: '#fff2f1' }}>
                                                            {tenureDiscount}% off monthly rent
                                                        </span>
                                                    </div>}
                                                </div>
                                            </div>

                                            {on('Quantity') && (
                                                <div
                                                    className="flex items-center justify-end"
                                                    style={{
                                                        flexShrink: 0,
                                                        height: '55px',
                                                        paddingRight: '12px',
                                                        paddingLeft: '12px',
                                                        gap: '12px',
                                                        opacity: 1
                                                    }}
                                                >
                                                    <span className="hidden lg:inline text-[14px] text-[#333333] font-medium">{cms('QuantityLabel', 'Quantity')}</span>
                                                    <div className="w-[38px] h-[34px] bg-gray-50 border border-gray-200 rounded-[8px] flex items-center justify-center shadow-xs">
                                                        <span className="text-[14px] font-semibold text-[#333333]">1</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* View All Benefits Row */}
                                        {on('ViewAllBenefits') && (
                                            <div
                                                className="flex items-center justify-center w-full py-[4px]"
                                                style={{ borderTop: '1px solid hsla(0, 0%, 93%, 1)' }}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveInfoDrawer('benefits')}
                                                    className={styles.viewBenefitsButton}
                                                >
                                                    {cms('ViewAllBenefitsText', 'View All Benefits')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* What's included in your plan Section */}
                                {on('Benefits') && (
                                    <div
                                        className="flex flex-col"
                                        style={{
                                            width: '100%',
                                            gap: '4px'
                                        }}
                                    >
                                        <div style={{ height: '16px', display: 'flex', alignItems: 'center' }}>
                                            <h4
                                                className="px-1"
                                                style={{
                                                    fontFamily: '"Mona Sans", sans-serif',
                                                    fontWeight: 600,
                                                    fontSize: '12px',
                                                    lineHeight: '16px',
                                                    letterSpacing: '-0.4px',
                                                    color: '#1f1f1f',
                                                    opacity: 1
                                                }}
                                            >
                                                {cms('BenefitsHeading', 'What’s included in your plan')}
                                            </h4>
                                        </div>

                                        <div id="desktop-product-benefits" className={styles.benefitGrid}>
                                            {benefitItems.map((benefitText, idx) => {
                                                const Icon = benefitIcon(benefitText);
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={styles.benefitCard}
                                                    >
                                                        <div className="shrink-0 flex items-center justify-center"><Icon size={22} color="#fff" weight="bold" /></div>
                                                        <span>
                                                            {benefitText}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                    </div>
                                )}

                                {/* Deposit & KYC Information Row */}
                                {(on('DepositCard') || on('KycCard')) && (
                                    <div
                                        className={styles.noticeGrid}
                                        style={{ width: '100%' }}
                                    >
                                        {/* Refundable Deposit Card */}
                                        {on('DepositCard') && (
                                            <div
                                                className={`${styles.noticeCard} ${styles.depositCard} w-full flex items-center justify-between`}
                                                style={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                }}
                                            >
                                                <span style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 600, fontSize: '13px', lineHeight: '18px' }}>
                                                    {cms('DepositLabel', '100% Refundable Deposit')}
                                                </span>
                                                <span style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 700, fontSize: '16px', lineHeight: '23px', textAlign: 'right' }}>
                                                    {product.securityDeposit != null ? `₹${Number(product.securityDeposit).toLocaleString('en-IN')}/-` : 'Confirmed at checkout'}
                                                </span>
                                            </div>
                                        )}

                                        {/* KYC & Delivery Card */}
                                        {on('KycCard') && (
                                            <div
                                                className={`${styles.noticeCard} ${styles.kycCard} w-full flex items-center justify-between overflow-hidden`}
                                                style={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                }}
                                            >
                                                <p className={styles.kycSentence}>{cms('KycLine1', 'Place Order & complete KYC anytime').trim()} {cms('KycLine2', 'to get your items the next day').trim()}</p>
                                                <Image src={cms('KycImage', '/images/product/kyc-delivery.webp')} alt="" width={76} height={76} unoptimized className={styles.kycImage} />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Primary CTA */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={outOfStock}
                                    className={styles.primaryCta}
                                >
                                    <span style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 600, fontSize: '16px', letterSpacing: '-0.4px', color: '#333333' }}>
                                        <span className="lg:hidden">{outOfStock ? 'Currently unavailable' : cms('CtaTextMobile', 'Book Your Plan')}</span>
                                        <span className="hidden lg:inline">{outOfStock ? 'Currently unavailable' : cms('CtaText', 'Rent Now')}</span>
                                    </span>
                                </button>

                                {/* High-Fidelity Info Row */}
                                {on('InfoCards') && (
                                    <div className="flex flex-col lg:flex-row gap-[10px] lg:items-center w-full">
                                        {/* Cancel/Return Card */}
                                        <div
                                            className={`${styles.infoCard} w-full flex items-center`}
                                            style={{
                                                flex: 1,
                                                minWidth: 0,
                                            }}
                                        >
                                            <div className="flex items-center w-full gap-[10px]">
                                                <div className={styles.infoIcon}>
                                                    <Truck size={24} weight="regular" />
                                                </div>
                                                <span style={{ flex: 1, fontFamily: '"Mona Sans", sans-serif', fontWeight: 600, fontSize: '13px', lineHeight: '18px', color: '#333' }}>
                                                    {cms('CancelCardText', 'What if I cancel or return before 6 months?')}
                                                </span>
                                                <button type="button" onClick={() => setActiveInfoDrawer('cancel')} className={styles.infoLink}>
                                                    {cms('CancelCardLinkText', 'View Details')}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Tenure Expansion Card */}
                                        <div
                                            className={`${styles.infoCard} w-full flex items-center`}
                                            style={{
                                                flex: 1,
                                                minWidth: 0,
                                            }}
                                        >
                                            <div className="flex items-center w-full gap-[10px]">
                                                <div className={styles.infoIcon}>
                                                    <CalendarDots size={24} weight="regular" />
                                                </div>
                                                <span style={{ flex: 1, fontFamily: '"Mona Sans", sans-serif', fontWeight: 600, fontSize: '13px', lineHeight: '18px', color: '#333' }}>
                                                    {cms('ExtendCardText', 'How do I extend tenure after 6 months?')}
                                                </span>
                                                <button type="button" onClick={() => setActiveInfoDrawer('extend')} className={styles.infoLink}>
                                                    {cms('ExtendCardLinkText', 'View Details')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Delivery Details */}
                                {on('PincodeCheck') && (
                                    <DeliveryCheck
                                        id="delivery-pincode-desktop"
                                        value={pincode}
                                        onChange={(value) => { setPincode(value); setPinResult(null); }}
                                        onCheck={handleCheckPincode}
                                        checking={pinChecking}
                                        result={pinResult}
                                        label={cms('DeliveryLabel', 'Check delivery')}
                                        placeholder={cms('PincodePlaceholder', 'Enter your pincode')}
                                        buttonLabel={cms('PincodeMobileCtaText', 'Check')}
                                    />
                                )}
                            </div>
                        </div>

                        {/* High-Fidelity Details Tabs Section */}
                        {on('Tabs') && (
                            <div className={styles.detailsPanel}>
                                {/* Tabs Header */}
                                <div className={styles.detailTabs}>
                                    {tabs.map(({ key, label }) => {
                                        const isActive = currentTab === key;
                                        const isReview = key === 'review';
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                aria-pressed={isActive}
                                                onClick={() => setActiveTab(key)}
                                                className={`${styles.detailTab} ${isActive ? styles.detailTabActive : ''} ${isReview ? styles.detailTabReview : ''}`}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Divider */}
                                <div style={{ width: '100%', height: '1px', background: 'hsla(0, 0%, 95%, 1)' }} />

                                {/* Content Area */}
                                <div className="flex-1 overflow-hidden" style={{ width: '100%' }}>
                                    {currentTab === 'details' && (
                                        <>
                                            <div className={styles.specGrid}>
                                                {specRows.map((item, idx) => (
                                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                        <h4 style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 700, fontSize: '12px', lineHeight: '16px', letterSpacing: '0.05em', color: '#000', textTransform: 'uppercase' }}>
                                                            {item.label}
                                                        </h4>
                                                        <p style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '1.5', letterSpacing: '-0.01em', color: 'hsla(0, 0%, 12%, 1)' }}>
                                                            {item.value}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                        </>
                                    )}

                                    {currentTab === 'return' && (
                                        <div className="pt-4" style={{ fontFamily: '"Mona Sans", sans-serif', fontSize: '15px', color: '#4B4B4B', lineHeight: '1.6' }}>
                                            {product.returnPolicy || cms('DefaultReturnPolicy', 'Standard return policy applies. Please contact support for details.')}
                                        </div>
                                    )}

                                    {currentTab === 'shipping' && (
                                        <div className="pt-4" style={{ fontFamily: '"Mona Sans", sans-serif', fontSize: '15px', color: '#4B4B4B', lineHeight: '1.6' }}>
                                            {product.shippingPolicy || cms('DefaultShippingPolicy', 'Standard shipping policy applies. Delivery usually takes 2-5 business days.')}
                                        </div>
                                    )}

                                    {currentTab === 'review' && <ProductReviewForm productId={product._id} cms={cms} />}
                                </div>
                            </div>
                        )}
                    </main>
                </div>

                {on('Testimonials') && (
                    <div className="w-full">
                        <Testimonials
                            titleOverride={cms('TestimonialsHeading', null)}
                            subtitleOverride={cms('TestimonialsSubheading', null)}
                        />
                    </div>
                )}

                {on('Related') && (
                    <BestRentedProducts
                        customProducts={product.pageLayout?.relatedProducts?.length > 0 ? product.pageLayout.relatedProducts : null}
                        titleOverride={cms('RelatedHeading', null)}
                        productIdsOverride={pageLayout?.productPageGlobalRelatedIds || null}
                    />
                )}

                {on('RentVsBuy') && <SimpleRentComparison onChooseTerm={on('Compare') ? () => setIsCompareOpen(true) : undefined} />}

                {on('Faq') && (
                    product.faqs && product.faqs.length > 0 ? (
                        <FaqSection cmsData={{
                            faqItems: product.faqs,
                            faqTitle: cms('FaqHeading', 'Product FAQs'),
                            faqSubtitle: cms('FaqSubheading', 'Specific questions about this product.'),
                        }} />
                    ) : (
                        <FaqSection limit={5} />
                    )
                )}

            </div>{/* ── END DESKTOP ── */}

            <CompareTenures
                isOpen={isCompareOpen}
                onClose={() => setIsCompareOpen(false)}
                selectedTenure={duration}
                onSelect={setDuration}
                tenures={tenures}
            />
            <ProductDetailDrawer isOpen={activeInfoDrawer === 'benefits'} onClose={() => setActiveInfoDrawer(null)} title="Included in your plan" description="The benefits and amounts for this rental, all in one place.">
                <ul className={styles.benefitDrawerList}>
                    {benefitItems.map((item, index) => {
                        const Icon = benefitIcon(item);
                        return <li key={`${item}-${index}`}><span className={styles.benefitDrawerIcon}><Icon size={21} weight="regular" aria-hidden="true" /></span><span>{item}</span><CheckCircle size={19} weight="fill" className={styles.benefitDrawerCheck} aria-hidden="true" /></li>;
                    })}
                </ul>
                <div className={styles.benefitDrawerSummary}>
                    <div><span>Monthly rent for {duration} {duration === 1 ? 'month' : 'months'}</span><strong>₹{currentPlan.price.toLocaleString('en-IN')}</strong></div>
                    <div><span>Refundable deposit</span><strong>{product.securityDeposit != null ? `₹${Number(product.securityDeposit).toLocaleString('en-IN')}` : 'Confirmed at checkout'}</strong></div>
                </div>
                <button type="button" className={`${styles.primaryCta} ${styles.benefitDrawerCta}`} disabled={outOfStock} onClick={() => { setActiveInfoDrawer(null); handleAddToCart(); }}>{outOfStock ? 'Currently unavailable' : 'Book your plan'} {!outOfStock && <ArrowRight size={19} aria-hidden="true" />}</button>
            </ProductDetailDrawer>
            <ProductDetailDrawer isOpen={activeInfoDrawer === 'breakdown'} onClose={() => setActiveInfoDrawer(null)} title="Rental price breakdown">
                <p className="mb-6 text-[#545454]">Your monthly rent for the selected minimum rental period.</p>
                <dl className="space-y-4 rounded-2xl border border-[#e2e2e2] p-5">
                    <div className="flex justify-between gap-4"><dt>Monthly rent</dt><dd className="font-semibold text-[#141414]">₹{currentPlan.price.toLocaleString('en-IN')}</dd></div>
                    <div className="flex justify-between gap-4"><dt>Minimum rental period</dt><dd className="font-semibold text-[#141414]">{duration} {duration === 1 ? 'month' : 'months'}</dd></div>
                    <div className="flex justify-between gap-4 border-t border-[#e2e2e2] pt-4"><dt>Rent over this period</dt><dd className="font-semibold text-[#141414]">₹{(currentPlan.price * duration).toLocaleString('en-IN')}</dd></div>
                    <div className="flex justify-between gap-4"><dt>Refundable deposit</dt><dd className="font-semibold text-[#141414]">{product.securityDeposit != null ? `₹${Number(product.securityDeposit).toLocaleString('en-IN')}` : 'Confirmed at checkout'}</dd></div>
                </dl>
                <p className="mt-5 text-sm text-[#545454]">Taxes and any other charges are confirmed at checkout.</p>
            </ProductDetailDrawer>
            <ProductDetailDrawer isOpen={activeInfoDrawer === 'cancel'} onClose={() => setActiveInfoDrawer(null)} title="Cancellation & Returns" icon={Truck} description="Review the terms that apply before changing your rental.">
                <h3 className="text-lg font-semibold text-[#333]">1. Cancellation before delivery</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#555]">Contact our support team if you need to cancel before your product is delivered. They can confirm the charges, if any, for your order.</p>
                <h3 className="mt-6 text-lg font-semibold text-[#333]">2. Return policy</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#555]">{product.returnPolicy || cms('DefaultReturnPolicy', 'Review the return policy or contact support for the terms that apply to this rental.')}</p>
                <Link href="/return-policy" className="mt-5 inline-flex min-h-11 items-center font-semibold text-[#141414] underline underline-offset-4">Read full return policy</Link>
            </ProductDetailDrawer>
            <ProductDetailDrawer isOpen={activeInfoDrawer === 'extend'} onClose={() => setActiveInfoDrawer(null)} title="Extend your rental" icon={CalendarDots} description="Choose what happens when your current term ends.">
                <h3 className="text-lg font-semibold text-[#333]">1. Request an extension</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#555]">{cms('ExtendCardBody', 'Contact support before your current rental period ends to discuss available terms and pricing.')}</p>
                <h3 className="mt-6 text-lg font-semibold text-[#333]">2. Confirm your new term</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#555]">Our team will confirm the available tenure and monthly rent for your product before the extension starts.</p>
                <Link href={cms('ExtendCardLink', '/contact') === '#' ? '/contact' : cms('ExtendCardLink', '/contact')} className="mt-5 inline-flex min-h-11 items-center font-semibold text-[#141414] underline underline-offset-4">Contact support</Link>
            </ProductDetailDrawer>
        </div>
    );
}
