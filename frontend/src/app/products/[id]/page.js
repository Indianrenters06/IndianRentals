"use client";
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
import RentVsBuy from '../../../components/RentVsBuy';
import FaqSection from '../../../components/FaqSection';
import Testimonials from '../../../components/Testimonials';
import CompareTenures from '../../../components/CompareTenures';
import CancellationSidebar from '../../../components/CancellationSidebar';

import { Heart, Export as ExportIcon, Sparkle, Package, Truck, CalendarDots, UserCircle, Bank, MapPin } from '@phosphor-icons/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
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
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    const [isCancellationOpen, setIsCancellationOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

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
                const cmsRes = await window.fetch(`${API}/api/cms/product-page`);
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
    const monthWord = (n) => (n === 1 ? cms('MonthLabel', 'Month') : cms('MonthsLabel', 'Months'));

    const handleAddToCart = () => {
        if (!product) return;

        const item = {
            id: product._id,
            name: product.name,
            image: product.images?.[0] || "/images/placeholder.png",
            price: currentPlan.price,
            monthlyRent: currentPlan.price,
            duration: duration,
            quantity: quantity,
            refundableAmount: product.securityDeposit || 10000,
            description: product.description,
            tenures: tenures
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
    const mainImage = product.images && product.images.length > 0 ? product.images[0] : "/images/placeholder.png";

    // Specs fall back to the CMS default list when the product has none.
    const cmsDefaultSpecs = pageLayout?.productPageDefaultSpecs?.length > 0
        ? pageLayout.productPageDefaultSpecs
        : [
            { label: 'DISPLAY', value: '16.2 inches (3024 x 1964)' },
            { label: 'GRAPHICS', value: 'Apple Integrated 16-core GPU' },
            { label: 'DIMENSIONS', value: '35.57 x 35.57 x 1.68 cm * 2.14 kg' },
            { label: 'OPERATING SYSTEM', value: 'Mac OS' },
            { label: 'MEMORY', value: '24GB' },
            { label: 'PROCESSOR', value: 'Apple M4 Pro' },
            { label: 'STORAGE', value: '512GB SSD' },
            { label: 'KEYBOARD LANGUAGE', value: 'English (Qwerty)' }
        ];
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

    return (
        <div className="w-full flex flex-col items-center bg-white font-sans text-[#1D1D1F] tracking-tight antialiased">

            {/* ══════════════════════════════════════════════
                MOBILE LAYOUT — hidden on md+ screens
            ══════════════════════════════════════════════ */}
            <div className="w-full flex flex-col md:hidden bg-white">

                {/* ── Promo Banner ── */}
                <div style={{ background: '#FFCF46', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4px 20px' }}>
                    <p style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 700, fontSize: '12px', lineHeight: '16px', letterSpacing: '-0.4px', color: '#333', whiteSpace: 'nowrap' }}>
                        🖤 SAVE Extra 5% up to ₹100 on UPI Orders 🖤
                    </p>
                </div>

                {/* ── Product Header ── */}
                <div style={{ background: '#F6F6F6', display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', width: '100%', boxSizing: 'border-box' }}>

                    {/* Breadcrumb */}
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Link href="/" style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: '8px', color: '#000', textDecoration: 'none' }}>Shop all</Link>
                        <span style={{ fontSize: '10px', color: '#999' }}>›</span>
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: '8px', color: '#000' }}>{product.category || 'Category'}</span>
                        <span style={{ fontSize: '10px', color: '#999' }}>›</span>
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '8px', color: '#000' }}>{product.name?.split(' ').slice(0, 2).join(' ')}</span>
                    </div>


                    {/* Image Card */}
                    <div style={{ background: '#fff', border: '1px solid #EEE', borderRadius: '16px', height: '300px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Discount Badge */}
                        <div style={{ position: 'absolute', top: '13px', left: '14px', background: '#ED2115', borderRadius: '27px', padding: '4px 14px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 3px 2px rgba(120,120,120,0.05), 0px 1px 1px rgba(120,120,120,0.09)' }}>
                            <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '12px', lineHeight: '1.2', color: '#FFF2F1', letterSpacing: '-0.48px', whiteSpace: 'nowrap' }}>
                                {product.mrp ? `${Math.round(((product.mrp - (product.rentalPrice || 0)) / product.mrp) * 100)}% off` : cms('DiscountText', '20% off')}
                            </span>
                        </div>
                        {/* Action Icons */}
                        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
                            <div style={{ width: '24px', height: '24px', background: '#EEE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Heart size={14} weight="regular" color="#333" />
                            </div>
                            <div style={{ width: '24px', height: '24px', background: '#EEE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ExportIcon size={14} color="#333" />
                            </div>
                        </div>
                        {/* Right Chevron Arrow Button — aligned in column with action icons at right: 10px */}
                        <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
                            <button
                                style={{ width: '24px', height: '24px', background: '#EEE', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                aria-label="Next image"
                            >
                                <ChevronRightIcon className="w-[14px] h-[14px] text-[#1F1F1F]" strokeWidth={2.5} />
                            </button>
                        </div>
                        {/* Main Image */}
                        <div style={{ position: 'relative', width: '268px', height: '206px' }}>
                            <Image
                                src={product.images?.[0] || '/images/placeholder.png'}
                                alt={product.name}
                                fill
                                className="object-contain"
                                priority
                                sizes="300px"
                            />
                        </div>
                        {/* Dot indicator */}
                        <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '8px', border: '1.2px solid #333' }} />
                            <div style={{ width: '4px', height: '4px', borderRadius: '8px', background: '#333' }} />
                            <div style={{ width: '4px', height: '4px', borderRadius: '8px', background: '#333' }} />
                            <div style={{ width: '4px', height: '4px', borderRadius: '8px', background: '#333' }} />
                        </div>
                    </div>

                    {/* Product Pricing Card */}
                    <div style={{ background: '#fff', border: '1px solid #E2E2E2', borderRadius: '12px', overflow: 'hidden', width: '100%' }}>

                        {/* Title + rating */}
                        <div style={{ padding: '10px', borderBottom: '1px solid #E2E2E2', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <h1 style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '14px', lineHeight: '20px', letterSpacing: '-0.8px', color: '#292929', margin: 0 }}>
                                {product.name}
                            </h1>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                {/* Stars */}
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', background: '#FFF3D3', border: '1px solid #FFE485', borderRadius: '8px', padding: '4px 6px' }}>
                                    <div style={{ display: 'flex', gap: '2px' }}>
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <StarIcon key={s} style={{ width: '16px', height: '16px', color: s <= Math.round(product.rating || 4.5) ? '#FF920A' : '#e5e7eb' }} />
                                        ))}
                                    </div>
                                    <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 500, fontSize: '8px', color: '#333', letterSpacing: '-0.4px', whiteSpace: 'nowrap' }}>
                                        {product.rating || '4.5'} ({product.numReviews || 12})
                                    </span>
                                </div>
                                {/* Delivery */}
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', background: '#00B505', borderRadius: '8px', padding: '4px 6px' }}>
                                    <BsTruck size={14} color="white" />
                                    <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 500, fontSize: '12px', color: '#fff', letterSpacing: '-0.48px', whiteSpace: 'nowrap' }}>
                                        {product.deliveryTime || '2-4 days'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Price + Month selector */}
                        <div style={{ display: 'flex', height: '45px', borderBottom: '1px solid #E2E2E2' }}>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px', padding: '0 10px' }}>
                                <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '20px', lineHeight: '26px', letterSpacing: '-0.8px', color: '#E11D48' }}>
                                    ₹{currentPlan.price}
                                </span>
                                <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 500, fontSize: '10px', color: '#757575', letterSpacing: '-0.4px' }}>/mo</span>
                                <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 500, fontSize: '10px', color: '#757575', letterSpacing: '-0.4px', marginLeft: '2px' }}>
                                    for {duration} {duration === 1 ? 'month' : 'months'}
                                </span>
                            </div>
                            <div style={{ borderLeft: '1px solid #E2E2E2', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 10px', gap: '8px' }}>
                                <button onClick={() => setDuration(Math.max(1, duration - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '15px', height: '15px' }}>
                                    <FaMinus size={9} />
                                </button>
                                <div style={{ border: '1px solid #AFAFAF', borderRadius: '8px', padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '10px', color: '#333', letterSpacing: '-0.4px' }}>{duration}</span>
                                </div>
                                <button onClick={() => setDuration(duration + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '15px', height: '15px' }}>
                                    <FaPlus size={9} />
                                </button>
                            </div>
                        </div>

                        {/* View All Benefits */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '19px' }}>
                            <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 700, fontSize: '12px', color: '#333', textDecoration: 'underline', letterSpacing: '-0.4px', cursor: 'pointer' }}>
                                View All Benefits
                            </span>
                        </div>
                    </div>

                    {/* What's included */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <h3 style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '12px', color: '#1F1F1F', letterSpacing: '-0.4px', margin: 0 }}>
                            {cms('BenefitsHeading', "What's included in your plan")}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            {(product.benefits?.length > 0 ? product.benefits : (pageLayout?.productPageBenefits || [
                                'Fully Functional (100% Tested)', 'Original Accessories Included', 'Free Repairs & Maintenance', 'Professionally sanitized'
                            ])).map((b, i) => {
                                const text = b.type || b;
                                const Icon = [Sparkle, Package, UserCircle, Bank][i % 4];
                                return (
                                    <div key={i} style={{ background: 'linear-gradient(89.72deg,#0689FF 1.19%,#0075FF 100.13%)', border: '1px solid #B5E9FF', borderRadius: '12px', padding: '8px', display: 'flex', alignItems: 'center', gap: '13px' }}>
                                        <Icon size={20} color="white" weight="bold" style={{ flexShrink: 0 }} />
                                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '12px', lineHeight: '16px', color: '#fff', letterSpacing: '-0.4px' }}>{text}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Deposit + KYC Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ background: '#D6F1FF', border: '1px solid #B5E9FF', borderRadius: '12px', padding: '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '32px' }}>
                            <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 500, fontSize: '10px', color: '#0859C5', letterSpacing: '-0.4px' }}>
                                {cms('DepositLabel', '100% Refundable Deposit')}
                            </span>
                            <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '12px', color: '#0859C5', letterSpacing: '-0.4px', whiteSpace: 'nowrap' }}>
                                ₹{product.securityDeposit ? `${product.securityDeposit.toLocaleString('en-IN')}/-` : '20,000/-'}
                            </span>
                        </div>
                        <div style={{ background: '#F3E8FF', border: '1px solid #E9D5FF', borderRadius: '12px', padding: '8px', overflow: 'hidden', position: 'relative', minHeight: '49px', display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 700, fontSize: '14px', lineHeight: '20px', color: '#333', letterSpacing: '-0.4px' }}>
                                    {cms('KycLine1', 'Place Order & complete KYC anytime ')}
                                </span>
                                <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 400, fontSize: '10px', lineHeight: '16px', color: '#333', letterSpacing: '-0.4px' }}>
                                    {cms('KycLine2', 'to get your items the next day')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Book Your Plan CTA */}
                    <button
                        onClick={handleAddToCart}
                        style={{ background: '#FFCF46', borderRadius: '9999px', border: 'none', height: '30px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 500, fontSize: '12px', color: '#1F1F1F', letterSpacing: '-0.4px' }}>
                            {cms('CtaTextMobile', 'Book Your Plan')}
                        </span>
                    </button>

                    {/* Cancellation + Tenure Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                        <div style={{ background: '#FFFAEC', border: '1px solid #E26E00', borderRadius: '16px', padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', background: '#FFF3D3', borderRadius: '33px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Truck size={18} color="#E26E00" />
                            </div>
                            <span style={{ flex: 1, fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '10px', lineHeight: '16px', color: '#E26E00', letterSpacing: '-0.4px' }}>
                                {cms('CancelCardText', 'What if I cancel or return before 6 months?')}
                            </span>
                            <button onClick={() => setIsCancellationOpen(true)} style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '8px', color: '#ED2115', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                View Details
                            </button>
                        </div>
                        <div style={{ background: '#FFFAEC', border: '1px solid #E26E00', borderRadius: '16px', padding: '6px 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', background: '#FFF3D3', borderRadius: '33px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <CalendarDots size={20} color="#E26E00" />
                            </div>
                            <span style={{ flex: 1, fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '10px', lineHeight: '16px', color: '#E26E00', letterSpacing: '-0.4px' }}>
                                {cms('ExtendCardText', 'How do I extend tenure after 6 months?')}
                            </span>
                            <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '8px', color: '#ED2115', textDecoration: 'underline', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                View Details
                            </span>
                        </div>
                    </div>

                    {/* Delivery Check */}
                    <div style={{ background: '#fff', border: '1px solid #E2E2E2', borderRadius: '16px', padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '28px', height: '28px', background: '#CBFFC5', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <MapPin weight="fill" size={18} color="hsla(120, 100%, 35%, 1)" />
                        </div>
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '8px', color: '#1F1F1F', letterSpacing: '-0.4px', whiteSpace: 'nowrap' }}>Delivery</span>
                        <div style={{ flex: 1, border: '1px solid #CBCBCB', borderRadius: '8px', padding: '8px 12px', minWidth: 0 }}>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={pincode}
                                onChange={(e) => { setPincode(e.target.value.replace(/\D/g, '').slice(0, 6)); setPinResult(null); }}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleCheckPincode(); }}
                                placeholder={cms('PincodePlaceholder', 'Check availability in your state')}
                                style={{ border: 'none', outline: 'none', fontSize: '8px', fontFamily: "'Mona Sans', sans-serif", fontWeight: 500, color: '#AFAFAF', width: '100%', background: 'transparent', letterSpacing: '-0.4px' }}
                            />
                        </div>
                    </div>
                    {pinResult && (
                        <div style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '11px', color: pinResult.serviceable ? 'green' : '#ED2115', paddingLeft: '4px' }}>
                            {pinResult.serviceable ? '✓' : '✕'} {pinResult.message}
                        </div>
                    )}

                    {/* Product Details Tabs */}
                    <div style={{ background: '#fff', border: '1px solid #E2E2E2', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Tab Buttons */}
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', overflowX: 'auto' }}>
                            {[
                                { key: 'details', label: 'Product Details', active: activeTab === 'details' },
                                { key: 'return', label: 'Return Policy', active: activeTab === 'return' },
                                { key: 'shipping', label: 'Shipping Policy', active: activeTab === 'shipping' },
                            ].map(tab => (
                                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ background: tab.active ? '#333' : 'transparent', color: tab.active ? '#fff' : '#333', border: `${tab.active ? 0 : 0.565}px solid #E2E2E2`, borderRadius: '33px', padding: '4px 12px', fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '10px', letterSpacing: '-0.4px', cursor: 'pointer', whiteSpace: 'nowrap', lineHeight: '16px', flexShrink: 0 }}>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        {/* Divider */}
                        <div style={{ height: '1px', background: '#EEE', width: '100%' }} />
                        {/* Spec Rows */}
                        {activeTab === 'details' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {specRows.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '8px', color: '#333', letterSpacing: '-0.4px', textTransform: 'uppercase' }}>{item.label}</span>
                                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 400, fontSize: '8px', color: '#545454', letterSpacing: '-0.4px' }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === 'return' && (
                            <p style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: '12px', color: '#545454', lineHeight: '1.6' }}>
                                {product.returnPolicy || 'Standard return policy applies. Please contact support for details.'}
                            </p>
                        )}
                        {activeTab === 'shipping' && (
                            <p style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: '12px', color: '#545454', lineHeight: '1.6' }}>
                                {product.shippingPolicy || 'Standard shipping. Delivery usually takes 2-4 business days.'}
                            </p>
                        )}
                    </div>
                </div>

                {/* ── Best Rented Products (Mobile) ── */}
                {on('Related') && (
                    <BestRentedProducts
                        customProducts={product.pageLayout?.relatedProducts?.length > 0 ? product.pageLayout.relatedProducts : null}
                        titleOverride={cms('RelatedHeading', null)}
                        productIdsOverride={pageLayout?.productPageGlobalRelatedIds || null}
                    />
                )}

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
                        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-[14px] font-medium text-[#586A84]">
                            <div className="flex items-center gap-2">
                                <Link href={cms('BreadcrumbHomeLink', '/')} className="hover:text-black transition-colors">{cms('BreadcrumbHomeLabel', 'Shop all')}</Link>
                                <span className="text-gray-300 text-[16px] leading-none mb-0.5">›</span>
                                <Link href={`/category/${product.category?.toLowerCase() || 'all'}`} className="hover:text-black transition-colors">{product.category || 'Category'}</Link>
                                {product.subcategory?.name && (
                                    <>
                                        <span className="text-gray-300 text-[16px] leading-none mb-0.5">›</span>
                                        <span className="text-[#1D1D1F] font-bold truncate max-w-[150px] lg:max-w-[300px]">{product.subcategory.name}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <main className="w-full max-w-[1200px] mx-auto px-4 md:px-8">
                        <div
                            className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_536px] items-start"
                            style={{
                                width: '100%',
                                minHeight: '809.73px',
                                gap: '16px',
                                opacity: 1
                            }}
                        >

                            {/* Left Column - Images Gallery */}
                            <div
                                className="flex flex-col"
                                style={{
                                    width: '100%',
                                    gap: '10px',
                                    opacity: 1
                                }}
                            >

                                {/* Main Image Slider */}
                                <div
                                    className="relative w-full bg-white flex items-center justify-center p-4 lg:p-6 group overflow-hidden shrink-0"
                                    style={{
                                        width: '100%',
                                        height: 'clamp(300px, 90vw, 643.64px)',
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
                                        navigation={{
                                            nextEl: '.swiper-button-next-custom',
                                            prevEl: '.swiper-button-prev-custom',
                                        }}
                                        style={{
                                            width: "100%",
                                            height: "100%"
                                        }}
                                        loop={true}
                                        spaceBetween={10}
                                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                        modules={[FreeMode, Navigation, Thumbs]}
                                        className="main-image-swiper"
                                    >
                                        {(product.images && product.images.length > 0 ? product.images : [mainImage, mainImage, mainImage, mainImage]).map((img, index) => (
                                            <SwiperSlide key={index} className="flex items-center justify-center">
                                                <div
                                                    className="relative flex items-center justify-center object-contain mix-blend-darken brightness-[1.08] contrast-[1.04] group-hover:scale-105 transition-transform duration-700 ease-out"
                                                    style={{
                                                        width: '100%',
                                                        maxWidth: '516px',
                                                        height: '397px',
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

                                    {/* Custom Heroicon Caret Navigation — design shows a single right caret, vertically centered */}
                                    <div
                                        className="swiper-button-next-custom absolute z-10 cursor-pointer flex items-center justify-center hover:opacity-80 transition-opacity"
                                        style={{
                                            width: '34px',
                                            height: '34px',
                                            borderRadius: '69px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            right: '12px',
                                            background: 'hsla(0, 0%, 93%, 1)',
                                            boxShadow: '0px 0px 1px 0px hsla(0, 0%, 52%, 0.1), 0px 1px 1px 0px hsla(0, 0%, 52%, 0.09), 0px 3px 2px 0px hsla(0, 0%, 52%, 0.05), 0px 5px 2px 0px hsla(0, 0%, 52%, 0.01), 0px 8px 2px 0px hsla(0, 0%, 52%, 0)'
                                        }}
                                    >
                                        <ChevronRightIcon className="w-[18px] h-[18px] text-gray-800" strokeWidth={2.5} />
                                    </div>
                                    {/* Hidden prev control kept for swiper loop navigation via swipe */}
                                    <div className="swiper-button-prev-custom hidden" />
                                </div>

                                {/* Thumbnails Slider */}
                                {on('Thumbnails') && (
                                    <div className="w-full h-[80px] md:h-[110px]">
                                        <Swiper
                                            onSwiper={setThumbsSwiper}
                                            loop={true}
                                            spaceBetween={12}
                                            slidesPerView={4}
                                            freeMode={true}
                                            watchSlidesProgress={true}
                                            modules={[FreeMode, Navigation, Thumbs]}
                                            className="thumbs-swiper h-full"
                                            breakpoints={{
                                                320: { slidesPerView: 3, spaceBetween: 10 },
                                                768: { slidesPerView: 4, spaceBetween: 12 }
                                            }}
                                        >
                                            {(product.images && product.images.length > 0 ? product.images : [mainImage, mainImage, mainImage, mainImage]).map((img, i) => (
                                                <SwiperSlide key={i}>
                                                    <div className="w-full h-full bg-white border border-[#EDEDED] rounded-xl p-2 flex items-center justify-center cursor-pointer transition-all hover:border-gray-400 overflow-hidden relative">
                                                        <Image src={img} alt={`Thumb ${i}`} fill className="object-contain mix-blend-darken brightness-[1.08] contrast-[1.04]" />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Product Purchase Details */}
                            <div
                                className="flex flex-col w-full lg:justify-self-end gap-[12px] lg:gap-[8px]"
                                style={{
                                    maxWidth: '536.36px',
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
                                            {on('Rating') && (
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
                                            )}
                                            {on('DeliveryBadge') && (
                                                <div className="bg-[#00b505] text-white text-[12px] font-medium px-2 py-0.5 rounded-[8px] flex items-center justify-center gap-1.5 h-full whitespace-nowrap">
                                                    <BsTruck size={13} className="stroke-[0.5]" />
                                                    <span className="mt-[1px]">{product.deliveryTime || cms('DeliveryText', '2-4 days')}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Interactive Slider Section — desktop only */}
                                    {on('TenureSlider') && (
                                        <div
                                            className="hidden lg:flex flex-col"
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                padding: '16px 12px',
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
                                                className="relative flex flex-col"
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
                                                                        background: 'var(--color-orange-600, #e26e00)',
                                                                        borderRadius: '31.846px 38.85px 31.846px 31.846px'
                                                                    }}
                                                                />

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
                                            <div className="flex justify-between items-center">
                                                {on('PriceBreakdown') ? (
                                                    <Link
                                                        href={cms('PriceBreakdownLink', '#')}
                                                        style={{
                                                            width: '89px',
                                                            height: '16px',
                                                            fontFamily: '"Mona Sans", sans-serif',
                                                            fontWeight: 500,
                                                            fontSize: 'var(--font-size-1, 12px)',
                                                            lineHeight: 'var(--font-line-height-1, 16px)',
                                                            letterSpacing: 'var(--font-letter-spacing-8, normal)',
                                                            color: 'var(--color-orange-orange-600, hsla(29, 100%, 50%, 1))',
                                                            textDecoration: 'underline',
                                                            textDecorationStyle: 'solid',
                                                            textUnderlineOffset: '8.5%',
                                                            textDecorationThickness: '11%',
                                                            opacity: 1,
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {cms('PriceBreakdownText', 'price breakdown')}
                                                    </Link>
                                                ) : <span />}
                                                {on('Compare') && (
                                                    <button
                                                        onClick={() => setIsCompareOpen(true)}
                                                        style={{
                                                            fontSize: 'var(--font-size-1, 12px)',
                                                            lineHeight: 'var(--font-line-height-1, 16px)',
                                                            letterSpacing: 'var(--font-letter-spacing-8, normal)',
                                                            color: 'var(--color-orange-orange-600, hsla(29, 100%, 50%, 1))',
                                                            textDecoration: 'underline',
                                                            textDecorationStyle: 'solid',
                                                            textUnderlineOffset: '8.5%',
                                                            textDecorationThickness: '11%',
                                                            opacity: 1,
                                                            whiteSpace: 'nowrap',
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            padding: 0
                                                        }}
                                                    >
                                                        {cms('CompareLinkText', 'compare all tenures')}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

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
                                                    <div className="flex items-center gap-[4px]">
                                                        <span className="text-[16px] font-medium line-through shrink-0" style={{ color: '#757575' }}>
                                                            ₹{product.mrp ? product.mrp * quantity : Math.round(currentPlan.price * 1.5) * quantity}
                                                        </span>
                                                        <span className="text-[12px] font-normal flex items-center justify-center whitespace-nowrap shrink-0"
                                                            style={{ height: '22px', borderRadius: '27px', padding: '4px 10px', background: '#ed2115', color: '#fff2f1' }}>
                                                            {product.mrp
                                                                ? `${Math.round(((product.mrp - currentPlan.price) / product.mrp) * 100)}% off`
                                                                : cms('DiscountText', '20% off')
                                                            }
                                                        </span>
                                                    </div>
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
                                                    <div className="flex items-center gap-4">
                                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-black transition-colors">
                                                            <FaMinus size={11} />
                                                        </button>
                                                        <div className="w-[38px] h-[34px] bg-white border border-gray-100 rounded-[8px] flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                                                            <span className="text-[14px] font-semibold text-[#333333]">{quantity}</span>
                                                        </div>
                                                        <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-black transition-colors">
                                                            <FaPlus size={10} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* View All Benefits Row */}
                                        {on('ViewAllBenefits') && (
                                            <div
                                                className="flex items-center justify-center w-full grow"
                                                style={{ borderTop: '1px solid hsla(0, 0%, 93%, 1)' }}
                                            >
                                                <button
                                                    className="hover:opacity-80 transition-opacity"
                                                    style={{
                                                        fontFamily: '"Mona Sans", sans-serif',
                                                        fontWeight: 700,
                                                        fontSize: '11px',
                                                        lineHeight: '16px',
                                                        color: 'hsla(29, 100%, 44%, 1)',
                                                        textDecoration: 'underline',
                                                        textDecorationStyle: 'solid',
                                                        textUnderlineOffset: '6%',
                                                        background: 'none',
                                                        border: 'none',
                                                        padding: 0,
                                                        cursor: 'pointer'
                                                    }}
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

                                        {/* Mobile: 2×2 grid */}
                                        <div className="grid grid-cols-2 gap-[8px] lg:hidden">
                                            {(product.benefits && product.benefits.length > 0 ? product.benefits : (pageLayout?.productPageBenefits || [
                                                "Fully Functional (100% Tested)", "Free Repairs & Maintenance", "Original Accessories Included", "Professionally sanitized"
                                            ])).map((benefit, idx) => {
                                                const benefitText = benefit.type || benefit;
                                                const Icon = [Sparkle, UserCircle, Package, Bank][idx % 4];
                                                return (
                                                    <div
                                                        key={idx}
                                                        className="rounded-xl flex items-center gap-[10px]"
                                                        style={{
                                                            padding: '12px',
                                                            background: 'linear-gradient(89.92deg, #0689FF -1.19%, #0075FF 100.13%)',
                                                            border: '1px solid hsla(198, 100%, 85%, 1)',
                                                            minHeight: '64px'
                                                        }}
                                                    >
                                                        <div className="shrink-0 text-white flex items-center justify-center"><Icon size={22} weight="bold" /></div>
                                                        <span style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 600, fontSize: '13px', lineHeight: '18px', color: 'white', wordBreak: 'break-word' }}>
                                                            {benefitText}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Desktop: horizontal scroll */}
                                        <div className="hidden lg:flex gap-[4px] w-full overflow-x-auto hide-scrollbar items-center" style={{ height: '48px' }}>
                                            {(product.benefits && product.benefits.length > 0 ? product.benefits : (pageLayout?.productPageBenefits || [
                                                "Fully Functional", "Accessories Included", "Free Repairs & Maintenance", "Professionally sanitized"
                                            ])).map((benefit, idx) => {
                                                const benefitText = benefit.type || benefit;
                                                const Icon = [Sparkle, Package, UserCircle, Bank][idx % 4];
                                                return (
                                                    <div
                                                        key={idx}
                                                        className="rounded-lg flex items-center shrink-0"
                                                        style={{
                                                            width: '131.09px',
                                                            height: '48px',
                                                            padding: '8px',
                                                            gap: '10px',
                                                            background: 'linear-gradient(89.92deg, #0689FF -1.19%, #0075FF 100.13%)',
                                                            border: '1px solid hsla(198, 100%, 85%, 1)'
                                                        }}
                                                    >
                                                        <div className="shrink-0 text-white flex items-center justify-center"><Icon size={20} weight="bold" /></div>
                                                        <span style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 600, fontSize: '12px', lineHeight: '16px', color: 'white', whiteSpace: 'normal', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', wordBreak: 'break-word', width: '87px' }}>
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
                                        className="flex flex-col lg:flex-row gap-[6px] lg:items-center"
                                        style={{ width: '100%' }}
                                    >
                                        {/* Refundable Deposit Card */}
                                        {on('DepositCard') && (
                                            <div
                                                className="w-full rounded-[12px] flex items-center justify-between px-[12px] py-[14px] lg:py-[2px] lg:px-[8px] lg:h-[56px]"
                                                style={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                    background: 'hsla(200, 100%, 92%, 1)',
                                                    border: '1px solid hsla(198, 100%, 85%, 1)'
                                                }}
                                            >
                                                <span style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 600, fontSize: '12px', lineHeight: '16px', letterSpacing: '-0.4px', color: '#0859c5' }}>
                                                    {cms('DepositLabel', '100% Refundable Deposit')}
                                                </span>
                                                <span style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 600, fontSize: '16px', lineHeight: '23px', letterSpacing: '-0.4px', color: '#0859c5', whiteSpace: 'nowrap' }}>
                                                    ₹{product.securityDeposit ? `${product.securityDeposit.toLocaleString('en-IN')}/-` : '20,000/-'}
                                                </span>
                                            </div>
                                        )}

                                        {/* KYC & Delivery Card */}
                                        {on('KycCard') && (
                                            <div
                                                className="w-full flex items-center justify-between overflow-hidden rounded-[12px] lg:h-[56px]"
                                                style={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                    background: 'var(--color-purple-purple-100, hsla(269, 100%, 95%, 1))',
                                                    border: '1px solid hsla(272, 72%, 47%, 0.3)',
                                                    paddingLeft: '12px',
                                                    paddingTop: '12px',
                                                    paddingBottom: '12px',
                                                    paddingRight: '0px',
                                                }}
                                            >
                                                <div className="flex flex-col justify-center" style={{ flex: 1, minWidth: 0 }}>
                                                    <span style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 600, fontSize: '12px', lineHeight: '16px', letterSpacing: '-0.4px', color: '#7e22ce' }}>
                                                        {cms('KycLine1', 'Place Order & complete KYC anytime')}
                                                    </span>
                                                    <span style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 500, fontSize: '12px', lineHeight: '16px', letterSpacing: '-0.4px', color: '#7e22ce' }}>
                                                        {cms('KycLine2', 'to get your items the next day')}
                                                    </span>
                                                </div>
                                                {cms('KycImage', '') && (
                                                    <div style={{ width: '64px', alignSelf: 'stretch', background: 'hsla(0, 0%, 89%, 1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                                                        <img src={cms('KycImage', '')} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Primary CTA */}
                                <button
                                    onClick={handleAddToCart}
                                    className="btn-primary w-full gap-[2px]"
                                    style={{ height: '45px' }}
                                >
                                    <span style={{
                                        fontFamily: '"Mona Sans", sans-serif',
                                        fontWeight: 600,
                                        fontSize: '16px',
                                        letterSpacing: '-0.4px',
                                        color: '#333333'
                                    }}>
                                        <span className="lg:hidden">{cms('CtaTextMobile', 'Book Your Plan')}</span>
                                        <span className="hidden lg:inline">{cms('CtaText', 'Rent Now')}</span>
                                    </span>
                                </button>

                                {/* High-Fidelity Info Row */}
                                {on('InfoCards') && (
                                    <div className="flex flex-col lg:flex-row gap-[10px] lg:items-center w-full">
                                        {/* Cancel/Return Card */}
                                        <div
                                            className="w-full flex items-center"
                                            style={{
                                                flex: 1,
                                                minWidth: 0,
                                                padding: '12px 8px',
                                                borderRadius: '16px',
                                                background: 'hsla(44, 100%, 96%, 1)',
                                                border: '1px solid hsla(47, 100%, 76%, 1)',
                                            }}
                                        >
                                            <div className="flex items-center w-full gap-[10px]">
                                                <div className="rounded-full flex items-center justify-center shrink-0"
                                                    style={{ width: '28px', height: '28px', background: 'hsla(44, 100%, 91%, 1)' }}>
                                                    <Truck size={20} color="hsla(29, 100%, 44%, 1)" />
                                                </div>
                                                <span style={{ flex: 1, fontFamily: '"Mona Sans", sans-serif', fontWeight: 600, fontSize: '12px', lineHeight: '16px', color: '#e26e00' }}>
                                                    {cms('CancelCardText', 'What if I cancel or return before 6 months?')}
                                                </span>
                                                <button onClick={() => setIsCancellationOpen(true)}
                                                    style={{ fontFamily: '"Mona Sans", sans-serif', fontSize: '12px', fontWeight: 600, color: 'hsla(3, 86%, 51%, 1)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0, whiteSpace: 'nowrap', flexShrink: 0 }}>
                                                    {cms('CancelCardLinkText', 'View Details')}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Tenure Expansion Card */}
                                        <div
                                            className="w-full flex items-center"
                                            style={{
                                                flex: 1,
                                                minWidth: 0,
                                                padding: '12px 8px',
                                                borderRadius: '16px',
                                                background: 'hsla(44, 100%, 96%, 1)',
                                                border: '1px solid hsla(47, 100%, 76%, 1)',
                                            }}
                                        >
                                            <div className="flex items-center w-full gap-[10px]">
                                                <div className="rounded-full flex items-center justify-center shrink-0"
                                                    style={{ width: '28px', height: '28px', background: 'hsla(44, 100%, 91%, 1)' }}>
                                                    <CalendarDots size={20} color="hsla(29, 100%, 44%, 1)" />
                                                </div>
                                                <span style={{ flex: 1, fontFamily: '"Mona Sans", sans-serif', fontWeight: 600, fontSize: '12px', lineHeight: '16px', color: '#e26e00' }}>
                                                    {cms('ExtendCardText', 'How do I extend tenure after 6 months?')}
                                                </span>
                                                <Link href={cms('ExtendCardLink', '#')}
                                                    style={{ fontFamily: '"Mona Sans", sans-serif', fontSize: '12px', fontWeight: 600, color: 'hsla(3, 86%, 51%, 1)', textDecoration: 'underline', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                                    {cms('ExtendCardLinkText', 'View Details')}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Delivery Details */}
                                {on('PincodeCheck') && (
                                    <div className="w-full flex flex-col gap-[6px]">
                                        <div
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '10px',
                                                borderRadius: '16px',
                                                background: 'hsla(0, 0%, 100%, 1)',
                                                border: '1px solid hsla(0, 0%, 89%, 1)',
                                                gap: '8px'
                                            }}
                                        >
                                            <div className="rounded-full flex items-center justify-center shrink-0"
                                                style={{ width: '28px', height: '28px', background: 'hsla(120, 100%, 95%, 1)' }}>
                                                <MapPin weight="fill" size={18} color="hsla(120, 100%, 35%, 1)" />
                                            </div>
                                            <span style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 600, fontSize: '12px', color: '#545454', whiteSpace: 'nowrap' }}>
                                                {cms('DeliveryLabel', 'Delivery')}
                                            </span>
                                            <div className="flex items-center px-3" style={{ border: '1px solid #cbcbcb', borderRadius: '8px', flex: 1, height: '39px' }}>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={6}
                                                    value={pincode}
                                                    onChange={(e) => {
                                                        setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                                                        setPinResult(null);
                                                    }}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') handleCheckPincode(); }}
                                                    placeholder={cms('PincodePlaceholder', 'Enter your pincode')}
                                                    style={{ border: 'none', outline: 'none', fontSize: '12px', letterSpacing: '-0.4px', fontFamily: '"Mona Sans", sans-serif', fontWeight: 500, width: '100%', background: 'transparent', color: '#1D1D1F' }}
                                                />
                                            </div>
                                            <button
                                                onClick={handleCheckPincode}
                                                disabled={pinChecking}
                                                className="hidden lg:flex flex-col items-start justify-center"
                                                style={{ width: '125px', fontFamily: '"Mona Sans", sans-serif', fontWeight: 700, fontSize: '12px', lineHeight: '16px', letterSpacing: '-0.4px', color: '#757575', background: 'none', border: 'none', cursor: pinChecking ? 'wait' : 'pointer', padding: 0, flexShrink: 0 }}>
                                                {pinChecking ? (
                                                    <span>{cms('PincodeCheckingText', 'Checking…')}</span>
                                                ) : (
                                                    <>
                                                        <span>{cms('PincodeCtaLine1', 'Check availability')}</span>
                                                        <span>{cms('PincodeCtaLine2', 'in your state')}</span>
                                                    </>
                                                )}
                                            </button>
                                            {/* Mobile check button */}
                                            <button
                                                onClick={handleCheckPincode}
                                                disabled={pinChecking}
                                                className="lg:hidden shrink-0"
                                                style={{ height: '38px', padding: '0 14px', borderRadius: '10px', fontFamily: '"Mona Sans", sans-serif', fontWeight: 700, fontSize: '12px', color: '#1D1D1F', background: 'hsla(44, 100%, 64%, 1)', border: 'none', cursor: pinChecking ? 'wait' : 'pointer', whiteSpace: 'nowrap' }}>
                                                {pinChecking ? '…' : cms('PincodeMobileCtaText', 'Check')}
                                            </button>
                                        </div>

                                        {pinResult && (
                                            <div
                                                className="flex items-center gap-[6px] px-[8px]"
                                                style={{
                                                    fontFamily: '"Mona Sans", sans-serif',
                                                    fontWeight: 600,
                                                    fontSize: '12.5px',
                                                    lineHeight: '16px',
                                                    color: pinResult.serviceable ? 'hsla(122, 100%, 30%, 1)' : 'hsla(3, 86%, 51%, 1)'
                                                }}
                                            >
                                                <span>{pinResult.serviceable ? '✓' : '✕'}</span>
                                                <span>{pinResult.message}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* High-Fidelity Details Tabs Section */}
                        {on('Tabs') && (
                            <div
                                className="px-[10px] lg:px-[20px]"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    minHeight: '200px',
                                    marginTop: '24px',
                                    background: 'hsla(0, 0%, 100%, 1)',
                                    border: '1px solid var(--color-grey-grey-200, hsla(0, 0%, 89%, 1))',
                                    borderRadius: '24px',
                                    paddingTop: '16px',
                                    paddingBottom: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px',
                                    opacity: 1,
                                    boxSizing: 'border-box'
                                }}
                            >
                                {/* Tabs Header */}
                                <div className="flex items-center gap-[8px] w-full overflow-x-auto no-scrollbar">
                                    {tabs.map(({ key, label }) => {
                                        const isActive = currentTab === key;
                                        const isReview = key === 'review';
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => setActiveTab(key)}
                                                style={{
                                                    flex: '0 0 auto',
                                                    height: '44px',
                                                    padding: '10px 22px',
                                                    borderRadius: '59px',
                                                    fontFamily: '"Mona Sans", sans-serif',
                                                    fontWeight: 600,
                                                    fontSize: '15px',
                                                    lineHeight: '1',
                                                    letterSpacing: '-0.01em',
                                                    whiteSpace: 'nowrap',
                                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    background: isReview ? 'hsla(44, 100%, 64%, 1)' : (isActive ? 'hsla(0, 0%, 20%, 1)' : 'hsla(0, 0%, 100%, 1)'),
                                                    color: isReview ? '#1D1D1F' : (isActive ? 'white' : '#1D1D1F'),
                                                    border: isReview ? 'none' : (isActive ? 'none' : '1px solid hsla(0, 0%, 89%, 1)'),
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
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
                                            {/* Mobile: single column list */}
                                            <div className="flex flex-col gap-[20px] pt-4 lg:hidden">
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

                                            {/* Desktop: horizontal-scroll column grid */}
                                            <div
                                                className="hidden lg:grid gap-y-8 gap-x-12 pt-4 overflow-x-auto overflow-y-hidden pr-2 no-scrollbar pb-4"
                                                style={{
                                                    gridTemplateRows: 'repeat(4, auto)',
                                                    gridAutoFlow: 'column',
                                                    gridAutoColumns: 'minmax(250px, 1fr)'
                                                }}
                                            >
                                                {specRows.map((item, idx) => (
                                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                        <h4 style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 600, fontSize: '13px', lineHeight: '18px', letterSpacing: '0.02em', color: '#000', textTransform: 'uppercase' }}>
                                                            {item.label}
                                                        </h4>
                                                        <p style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '1.4', letterSpacing: '-0.01em', color: 'hsla(0, 0%, 12%, 1)' }}>
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

                                    {currentTab === 'review' && (
                                        <div className="pt-4 flex flex-col gap-4 max-w-[560px]">
                                            {reviewSubmitted ? (
                                                <div style={{ fontFamily: '"Mona Sans", sans-serif', fontSize: '15px', color: 'hsla(122, 100%, 30%, 1)', fontWeight: 600 }}>
                                                    {cms('ReviewThanksText', 'Thanks for your review!')} 🎉
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex flex-col gap-1">
                                                        <span style={{ fontFamily: '"Mona Sans", sans-serif', fontWeight: 600, fontSize: '15px', color: '#1D1D1F' }}>
                                                            {cms('ReviewPrompt', 'How was your experience?')}
                                                        </span>
                                                        <div className="flex items-center gap-1">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <button
                                                                    key={s}
                                                                    type="button"
                                                                    onClick={() => setReviewRating(s)}
                                                                    className="transition-transform hover:scale-110"
                                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, lineHeight: 0 }}
                                                                    aria-label={`${s} star${s > 1 ? 's' : ''}`}
                                                                >
                                                                    <StarIcon style={{ width: 26, height: 26, color: s <= reviewRating ? 'hsla(33, 100%, 52%, 1)' : 'hsla(0, 0%, 85%, 1)' }} />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <textarea
                                                        value={reviewText}
                                                        onChange={(e) => setReviewText(e.target.value)}
                                                        placeholder={cms('ReviewPlaceholder', "Tell others what you liked (or didn't)…")}
                                                        rows={4}
                                                        style={{ width: '100%', border: '1px solid hsla(0, 0%, 89%, 1)', borderRadius: '12px', padding: '12px', fontFamily: '"Mona Sans", sans-serif', fontSize: '14px', color: '#1D1D1F', outline: 'none', resize: 'vertical' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        disabled={reviewRating === 0}
                                                        onClick={() => setReviewSubmitted(true)}
                                                        style={{
                                                            alignSelf: 'flex-start',
                                                            padding: '10px 24px',
                                                            borderRadius: '9999px',
                                                            background: reviewRating === 0 ? 'hsla(44, 100%, 80%, 1)' : 'hsla(44, 100%, 64%, 1)',
                                                            color: '#1D1D1F',
                                                            fontFamily: '"Mona Sans", sans-serif',
                                                            fontWeight: 700,
                                                            fontSize: '14px',
                                                            border: 'none',
                                                            cursor: reviewRating === 0 ? 'not-allowed' : 'pointer'
                                                        }}
                                                    >
                                                        {cms('ReviewSubmitText', 'Submit Review')}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </main>
                </div>

                {on('Testimonials') && (
                    <div className="hidden lg:block">
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

                {on('RentVsBuy') && <RentVsBuy />}

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

                {/* Side Drawers */}
                <CompareTenures
                    isOpen={isCompareOpen}
                    onClose={() => setIsCompareOpen(false)}
                    selectedTenure={duration}
                    onSelect={(val) => {
                        setDuration(val);
                    }}
                    tenures={tenures}
                />

                <CancellationSidebar
                    isOpen={isCancellationOpen}
                    onClose={() => setIsCancellationOpen(false)}
                />
            </div>{/* ── END DESKTOP ── */}
        </div>
    );
}
