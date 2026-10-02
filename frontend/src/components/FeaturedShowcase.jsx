"use client";
import { fetchCmsPage } from '@/lib/cmsPreview';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Pause, Play } from '@phosphor-icons/react';
import carouselStyles from './FeaturedCarousel.module.css';
import CarouselArrow from './CarouselArrow';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/features/cartSlice';
import { ProductCard } from './BestRentedProducts';
import { productsForShowcaseSlide } from './showcaseProducts';
import { resolveCmsHref } from '@/lib/cmsLinks';
import { API } from '@/services/apiConfig';
import { loadShowcaseCatalogue } from '@/lib/showcaseCatalogue.mjs';

const DEFAULT_CATEGORY_IMAGES = {
    apple: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1776108199/f6540bc8c3d4a91dfd954f6fe1cf8d3803b81b4a_3_optlwp.png",
    gaming: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80",
    smart: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80",
};

const getSlideImage = (s) => {
    if (s?.image && typeof s.image === 'string' && s.image.trim() !== '') {
        return s.image;
    }
    const t = `${s?.title || ''} ${s?.subtitle || ''}`.toLowerCase();
    if (t.includes('apple') || t.includes('mac')) return DEFAULT_CATEGORY_IMAGES.apple;
    if (t.includes('gaming') || t.includes('rog') || t.includes('legion') || t.includes('alienware') || t.includes('omen')) return DEFAULT_CATEGORY_IMAGES.gaming;
    if (t.includes('smart') || t.includes('tablet') || t.includes('watch') || t.includes('device') || t.includes('phone')) return DEFAULT_CATEGORY_IMAGES.smart;
    return '';
};

const FALLBACK_BANNERS = [
    {
        title: "Apple Products",
        subtitle: "MacBooks | iPads | iPhones | Mac Studio | Mac Mini",
        image: DEFAULT_CATEGORY_IMAGES.apple,
        href: "/category/apple",
        bg: "linear-gradient(135deg, #1f1435 0%, #3b2069 45%, #6a3ea1 80%, #9055d4 100%)",
        category: "MacBook"
    },
    {
        title: "Gaming Laptops",
        subtitle: "ASUS ROG | Lenovo Legion | MSI | HP Omen",
        image: DEFAULT_CATEGORY_IMAGES.gaming,
        href: "/products",
        bg: "linear-gradient(135deg, #070d18 0%, #0d2238 45%, #133c5e 80%, #1c5f8a 100%)",
        category: "Gaming"
    },
    {
        title: "Smart Devices",
        subtitle: "Tablets | Smartwatches | Earbuds | Accessories",
        image: DEFAULT_CATEGORY_IMAGES.smart,
        href: "/products",
        bg: "linear-gradient(135deg, #0b1a14 0%, #153326 45%, #1f523c 80%, #2b7756 100%)",
        category: "SmartPhone"
    }
];

// ─── Mobile Featured Card ───────────────────────────────────────────────────
const MobileFeaturedCard = ({ banner }) => {
    const router = useRouter();
    return (
        <div
            onClick={() => router.push(resolveCmsHref(banner?.href))}
            style={{
                width: '100%',
                background: 'radial-gradient(181.93% 64.7% at 50% 72.89%, #FFFFFF 0%, #D6F1FF 100%)',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                padding: '24px 20px 20px',
                position: 'relative',
                borderRadius: '0px',
                overflow: 'hidden',
                cursor: 'pointer'
            }}
        >
            {/* Air Watermark Text */}
            <div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '240px',
                    left: '50%',
                    top: '140px',
                    transform: 'translateX(-50%)',
                    fontFamily: "'Mona Sans', sans-serif",
                    fontStyle: 'normal',
                    fontWeight: 800,
                    fontSize: '180px',
                    lineHeight: '200px',
                    textAlign: 'center',
                    letterSpacing: '-2px',
                    background: 'linear-gradient(180deg, #60ADFD 0%, #007DFF 122.92%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    opacity: 0.2,
                    pointerEvents: 'none',
                    zIndex: 0
                }}
            >
                Air
            </div>

            {/* Top Text Section */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '8px',
                    width: '100%',
                    zIndex: 1,
                    position: 'relative'
                }}
            >
                <h2
                    style={{
                        fontFamily: "'Mona Sans', sans-serif",
                        fontStyle: 'normal',
                        fontWeight: 600,
                        fontSize: '25px',
                        lineHeight: '31px',
                        letterSpacing: '-0.8px',
                        background: 'linear-gradient(90deg, #0F2239 0%, #517396 87.77%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0
                    }}
                >
                    {banner?.title || "MacBook Air"}
                </h2>
                <p
                    style={{
                        fontFamily: "'Mona Sans', sans-serif",
                        fontStyle: 'normal',
                        fontWeight: 500,
                        fontSize: '12px',
                        lineHeight: '18px',
                        letterSpacing: '-0.4px',
                        color: '#757575',
                        margin: 0
                    }}
                >
                    {banner?.subtitle || "Skip the setup hassle. Get high-performance workstations pre-configured with Ollama for instant AI development. Run large language models locally."}
                </p>

                {/* Yellow Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(resolveCmsHref(banner?.href));
                    }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4.34px 14.47px',
                        height: '22.68px',
                        background: '#FFCF46',
                        borderRadius: '20.47px',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: "'Mona Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: '8.68px',
                        lineHeight: '13px',
                        letterSpacing: '-0.289px',
                        color: '#1F1F1F',
                        marginTop: '4px'
                    }}
                >
                    Rent Now
                </button>
            </div>

            {/* Product Image */}
            <div style={{ zIndex: 2, position: 'relative', display: 'flex', justifyContent: 'center', margin: '16px 0 20px' }}>
                <img
                    src={banner?.image || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1776108199/f6540bc8c3d4a91dfd954f6fe1cf8d3803b81b4a_3_optlwp.png"}
                    alt="MacBook Air"
                    style={{ width: '265px', height: '139.12px', objectFit: 'contain' }}
                />
            </div>

            {/* Stats Row */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '16px',
                    width: '100%',
                    zIndex: 3,
                    position: 'relative'
                }}
            >
                {/* Stat 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', width: '122px' }}>
                    <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '10px', lineHeight: '16px', letterSpacing: '-0.4px', color: '#757575' }}>Up to</span>
                    <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '20px', lineHeight: '26px', letterSpacing: '-0.8px', background: 'linear-gradient(90deg, #0F2239 0%, #517396 87.77%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>23x</span>
                    <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '10px', lineHeight: '16px', letterSpacing: '-0.4px', color: '#757575' }}>faster than the fastest Intel-based MacBook Air</span>
                </div>

                {/* Stat 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', width: '107px' }}>
                    <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '10px', lineHeight: '16px', letterSpacing: '-0.4px', color: '#757575' }}>Up to</span>
                    <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '20px', lineHeight: '26px', letterSpacing: '-0.8px', background: 'linear-gradient(90deg, #0F2239 0%, #517396 87.77%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>2x</span>
                    <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '10px', lineHeight: '16px', letterSpacing: '-0.4px', color: '#757575' }}>faster than MacBook Air(M1)</span>
                </div>

                {/* Stat 3 */}
                <div style={{ display: 'flex', flexDirection: 'column', width: '48px' }}>
                    <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '10px', lineHeight: '16px', letterSpacing: '-0.4px', background: 'linear-gradient(90deg, #0F3914 0%, #51966A 87.77%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Up to</span>
                    <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '20px', lineHeight: '26px', letterSpacing: '-0.8px', background: 'linear-gradient(90deg, #0F3914 0%, #51966A 87.77%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>18 hr</span>
                    <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '10px', lineHeight: '16px', letterSpacing: '-0.4px', background: 'linear-gradient(90deg, #0F3914 0%, #51966A 87.77%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>battery life</span>
                </div>
            </div>

            {/* Tagline Centered */}
            <div
                style={{
                    fontFamily: "'Mona Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: '12px',
                    lineHeight: '18px',
                    letterSpacing: '-0.4px',
                    background: 'linear-gradient(90deg, #3583F0 0%, #BC58E3 47.12%, #E05821 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginTop: '20px',
                    textAlign: 'center',
                    width: '100%',
                    zIndex: 3,
                    position: 'relative'
                }}
            >
                Built for Apple Intelligence.
            </div>
        </div>
    );
};

// ─── Banner Carousel ──────────────────────────────────────────────────────────
const BannerCarousel = ({ banners = [], current, setCurrent }) => {
    const [direction, setDirection] = useState(1);
    const [paused, setPaused] = useState(false);
    const [hovered, setHovered] = useState(false);
    const reducedMotion = useReducedMotion();
    const go = useCallback((offset) => {
        setDirection(offset);
        setCurrent(previous => (previous + offset + banners.length) % banners.length);
    }, [banners.length, setCurrent]);

    useEffect(() => {
        if (banners.length < 2 || paused || hovered || reducedMotion) return;
        const timer = setInterval(() => go(1), 8000);
        return () => clearInterval(timer);
    }, [go, banners.length, paused, hovered, reducedMotion]);

    if (!banners.length) return null;
    const slide = banners[current] || banners[0];
    const displayImage = getSlideImage(slide);
    return (
        <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div className={carouselStyles.viewport} onFocusCapture={() => setPaused(true)}>
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div key={current} custom={direction}
                        variants={{
                            enter: d => ({ x: d > 0 ? '100%' : '-100%' }),
                            center: { x: 0 },
                            exit: d => ({ x: d > 0 ? '-100%' : '100%' }),
                        }}
                        initial="enter" animate="center" exit="exit"
                        transition={{ duration: reducedMotion ? 0 : 0.4 }}
                        className={carouselStyles.slide}>
                        <Link href={resolveCmsHref(slide.href)} aria-label={`Explore ${slide.title}`} className={carouselStyles.link}>
                            {displayImage && <img src={displayImage} alt="" className={carouselStyles.image} />}

                        </Link>
                    </motion.div>
                </AnimatePresence>
                <div className={carouselStyles.copy}>
                    <div className={carouselStyles.titleRow}>
                        {banners.length > 1 && <CarouselArrow direction="previous" aria-label="Previous collections slide" onClick={() => { setPaused(true); go(-1); }} />}
                        <h3><Link href={resolveCmsHref(slide.href)}>{slide.title}</Link></h3>
                        {banners.length > 1 && <CarouselArrow direction="next" aria-label="Next collections slide" onClick={() => { setPaused(true); go(1); }} />}
                    </div>
                    <p>{slide.subtitle}</p>
                    {banners.length > 1 && <div className={carouselStyles.dots} role="group" aria-label="Collections slides">
                        {banners.map((_, index) => <button key={index} type="button" aria-label={`Go to collections slide ${index + 1}`} aria-current={index === current ? 'true' : undefined} onClick={() => { setPaused(true); setDirection(index > current ? 1 : -1); setCurrent(index); }}><span /></button>)}
                    </div>}
                </div>
                {banners.length > 1 && !reducedMotion && <button type="button" className={carouselStyles.playback} aria-label={`${paused ? 'Play' : 'Pause'} collections slideshow`} onClick={() => setPaused(value => !value)}>{paused ? <Play size={14} weight="fill" aria-hidden="true" /> : <Pause size={14} weight="fill" aria-hidden="true" />}</button>}
            </div>
        </div>
    );
};

const FeaturedShowcase = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [cms, setCms] = useState(null); // null = still loading CMS
    const [legacyProductIds, setLegacyProductIds] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(0);

    useEffect(() => {
        const checkRes = () => setIsDesktop(window.innerWidth >= 1024);
        checkRes();
        window.addEventListener('resize', checkRes);
        return () => window.removeEventListener('resize', checkRes);
    }, []);

    // Fetch CMS settings first
    useEffect(() => {
        const fetchCms = async () => {
            try {
                const res = await fetchCmsPage('homepage');
                if (res.ok) {
                    const d = await res.json();
                    const banners = d.featuredShowcaseBanners?.length
                        ? d.featuredShowcaseBanners
                        : FALLBACK_BANNERS;
                    setCms({
                        enabled: d.featuredShowcaseEnabled !== false,
                        banners,
                    });
                    setLegacyProductIds(d.featuredShowcaseProductIds || []);
                } else {
                    setCms({ enabled: true, banners: FALLBACK_BANNERS });
                }
            } catch {
                setCms({ enabled: true, banners: FALLBACK_BANNERS });
            }
        };
        fetchCms();
    }, []);

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.rentPrice,
            monthlyRent: product.rentPrice,
            quantity: 1,
            duration: 1,
            sourceUrl: `/products/${product.id}`
        }));
        router.push('/checkout/staged?new=1');
    };

    // Load only selected IDs and targeted collections; the active slide selects two cards.
    useEffect(() => {
        if (!cms || cms.enabled === false) return;

        let isCancelled = false;

        const loadProducts = async () => {
            try {
                const catalogue = await loadShowcaseCatalogue(API, cms.banners, legacyProductIds);
                if (!isCancelled) setProducts(catalogue);
            } catch (err) {
                console.error("Showcase fetch error:", err);
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        loadProducts();

        return () => {
            isCancelled = true;
        };
    }, [cms, legacyProductIds]);

    // Still fetching CMS or products
    if (!cms || loading) return null;

    // Hidden by admin toggle
    if (!cms.enabled) return null;

    const activeSlide = cms.banners[currentBanner] || cms.banners[0];
    const activeProducts = productsForShowcaseSlide(activeSlide, currentBanner, products, legacyProductIds)
        .map(product => ({
            id: product._id,
            name: product.name,
            image: product.images?.[0] || "/images/placeholder.png",
            rating: product.rating,
            reviews: product.numReviews,
            originalPrice: product.originalRentalPrice || null,
            rentPrice: product.rentalPrice,
            discount: product.pageLayout?.discountText || product.discount || "",
            deliveryTime: product.deliveryTime || "2-4 days",
            isNew: product.condition === 'New',
        }));

    return (
        <section className={`bg-white ${isDesktop ? 'py-12' : 'py-6'} overflow-visible`}>

            <div className={carouselStyles.container}>

                <div
                    className="flex flex-col lg:flex-row items-stretch"
                    style={{ gap: isDesktop ? "30px" : "20px" }}
                >

                    {/* Left */}
                    <div className="flex flex-col md:flex-row items-stretch gap-6 lg:gap-5 transition-all duration-500">
                        {activeProducts.map(product => (
                            <ProductCard
                                key={`${currentBanner}-${product.id}`}
                                product={product}
                                cardW={281}
                                isDesktop={isDesktop}
                                handleAddToCart={handleAddToCart}
                            />
                        ))}
                        {activeProducts.length === 0 && (
                            <div className="flex h-[387px] w-[582px] max-w-full flex-col items-center justify-center rounded-[20px] border border-[#E2E2E2] bg-[#F6F6F6] px-8 text-center" role="status">
                                <h3 className="text-xl font-semibold text-[#292929]">No products in this collection</h3>
                                <p className="mt-2 text-sm text-[#545454]">Browse the full catalogue while {activeSlide?.title || 'this collection'} is updated.</p>
                                <Link href="/products" className="mt-5 inline-flex min-h-10 items-center justify-center rounded-full bg-[#FFCF46] px-6 text-sm font-semibold text-[#141414]">Browse products</Link>
                            </div>
                        )}
                    </div>

                    {/* Right */}
                    <div className="w-full lg:flex-1 min-w-0 overflow-hidden">
                        <BannerCarousel
                            banners={cms.banners}
                            current={currentBanner}
                            setCurrent={setCurrentBanner}
                            isDesktop={isDesktop}
                        />
                    </div>

                </div>

            </div>
        </section>
    );
};
export default FeaturedShowcase;
