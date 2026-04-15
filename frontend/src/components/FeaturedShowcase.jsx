import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Truck, Info } from '@phosphor-icons/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/features/cartSlice';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const FALLBACK_BANNERS = [
    {
        title: "Apple Products",
        subtitle: "MacBooks | iPads | iPhones | Mac Studio | Mac Mini",
        image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1776108199/f6540bc8c3d4a91dfd954f6fe1cf8d3803b81b4a_3_optlwp.png",
        href: "/products",
        bg: "linear-gradient(180deg, #4A3B9C 0%, #5B4AB5 100%)",
        category: "MacBook"
    },
    {
        title: "Smart Devices",
        subtitle: "Everything you need for your smart home.",
        image: null,
        href: "/products",
        bg: "linear-gradient(to bottom, #2D6A4F, #1B4332)",
        category: "SmartPhone"
    }
];

// ─── Banner Carousel ──────────────────────────────────────────────────────────
const BannerCarousel = ({ banners, current, setCurrent, height = "387px", productImage }) => {
    const [direction, setDirection] = useState(1);
    const [failedImages, setFailedImages] = useState(new Set());

    const go = useCallback((dir) => {
        setDirection(dir);
        setCurrent(prev => (prev + dir + banners.length) % banners.length);
    }, [banners.length, setCurrent]);

    useEffect(() => {
        const t = setInterval(() => go(1), 8000);
        return () => clearInterval(t);
    }, [go]);

    const slide = banners[current];
    const displayImage = slide.image || productImage;

    return (
        <div
            className="relative overflow-hidden shadow-xl w-full"
            style={{
                height: '387px',
                borderRadius: '16px'
            }}
        >
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={current}
                    custom={direction}
                    variants={{
                        enter: (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
                        center: { x: 0, opacity: 1 },
                        exit: (d) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="absolute inset-0"
                    style={{ background: slide.bg || "#F5F5F7" }}
                >
                    {/* Full-bleed image — covers entire banner, no gaps */}
                    {displayImage && (
                        <motion.img
                            key={displayImage}
                            initial={{ opacity: 0, scale: 1.02 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            src={displayImage}
                            alt="Featured"
                            className="absolute inset-0 w-full h-full object-cover object-center z-0"
                            style={{ pointerEvents: 'none', transform: 'scale(0.85)', transformOrigin: 'center center' }}
                        />
                    )}

                    {/* Figma exact gradient overlay */}
                    <div
                        className="absolute inset-0 z-10"
                        style={{
                            background: 'linear-gradient(180.66deg, rgba(0, 0, 0, 0) 52.71%, rgba(0, 0, 0, 0.8) 86.37%)'
                        }}
                    />

                    {/* Content: pinned to bottom with Figma padding */}
                    <div
                        className="absolute inset-0 z-20 flex flex-col justify-end"
                        style={{
                            paddingTop: '30px',
                            paddingRight: '31px',
                            paddingBottom: '30px',
                            paddingLeft: '31px',
                            gap: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end'
                        }}
                    >
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={() => go(-1)}
                                className="group flex items-center justify-center rounded-full bg-[hsla(0,0%,96%,1)] hover:bg-[hsla(0,0%,20%,1)] hover:scale-110 transition-all duration-200 shrink-0"
                                style={{ width: "24px", height: "24px", padding: "2.25px" }}
                            >
                                <ChevronLeftIcon className="w-[19.5px] h-[19.5px] text-[#1D1D1F] group-hover:text-white transition-colors duration-200" />
                            </button>
                            <h3 className="text-white text-[24px] font-bold tracking-tight text-center" style={{ fontFamily: "'Mona Sans', sans-serif" }}>
                                {slide.title}
                            </h3>
                            <button
                                onClick={() => go(1)}
                                className="group flex items-center justify-center rounded-full bg-[hsla(0,0%,96%,1)] hover:bg-[hsla(0,0%,20%,1)] hover:scale-110 transition-all duration-200 shrink-0"
                                style={{ width: "24px", height: "24px", padding: "2.25px" }}
                            >
                                <ChevronRightIcon className="w-[19.5px] h-[19.5px] text-[#1D1D1F] group-hover:text-white transition-colors duration-200" />
                            </button>
                        </div>
                        <p className="text-white/80 text-[14px] font-medium leading-tight text-center">
                            {slide.subtitle}
                        </p>
                        <div className="flex justify-center gap-1.5">
                            {banners.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                                    className={`transition-all duration-300 rounded-full h-1.5 ${i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// ─── Product Card Component ──────────────────────────────────────────────────
const ShowcaseProductCard = ({ product, index, isDesktop, handleAddToCart }) => {
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();

    const CARD_W  = isDesktop ? 285 : 170;
    const CARD_H  = isDesktop ? 387 : 256;
    const HOVER_H = isDesktop ? 440 : 256;
    const LIFT    = isDesktop ? 12  : 0;

    return (
        /*
         * Outer shell: FIXED size in flex container.
         * overflow:visible lets card grow beyond it without layout impact.
         * Card lifts UP (y:-12) AND grows DOWN to reveal Rent Now.
         */
        <div
            style={{
                width: `${CARD_W}px`,
                height: `${CARD_H}px`,
                position: 'relative',
                flexShrink: 0,
                cursor: 'pointer',
                overflow: 'visible',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onClick={() => router.push(`/products/${product.id}`)}
        >
            <motion.div
                animate={isHovered ? "hover" : "initial"}
                initial="initial"
                className="absolute left-0 right-0 bg-white flex flex-col overflow-hidden"
                style={{
                    top: 0,
                    border: "1px solid hsla(0, 0%, 89%, 1)",
                    borderRadius: "20px",
                    backgroundColor: "hsla(0, 0%, 100%, 1)",
                    willChange: "height, transform, box-shadow",
                }}
                variants={{
                    initial: {
                        height: CARD_H,
                        y: 0,
                        boxShadow: "0px 1px 2px 0px hsla(0, 0%, 0%, 0.05)"
                    },
                    hover: {
                        height: HOVER_H,
                        y: -LIFT,
                        boxShadow: "0px 16px 32px -8px hsla(0, 0%, 0%, 0.14)",
                        transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] }
                    }
                }}
            >
                {/* Image Section */}
                <div
                    className="relative bg-white flex items-center justify-center overflow-hidden shrink-0"
                    style={{
                        width: `${CARD_W}px`,
                        height: isDesktop ? 282 : 184,
                        borderRadius: "20px",
                        borderBottom: "1px solid hsla(0, 0%, 93%, 1)",
                        backgroundColor: isHovered ? "hsla(0,0%,98%,1)" : "hsla(0, 0%, 100%, 1)",
                        transition: "background-color 0.4s",
                        boxShadow: "0px 4px 8px 0px hsla(0, 0%, 87%, 0.1)",
                    }}
                >
                    <div className="absolute z-20 flex items-center" style={{ top: isDesktop ? "14.57px" : "12.57px", left: isDesktop ? "14.49px" : "13.49px", gap: "4px" }}>
                        <span className="text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0"
                            style={{ height: "24px", background: "hsla(3, 86%, 51%, 1)", fontFamily: "'Mona Sans', sans-serif", fontSize: "10px", fontWeight: 600, paddingLeft: "10px", paddingRight: "10px", borderRadius: "27px" }}>
                            -20% off
                        </span>
                        {(isDesktop || product.isNew) && (
                            <span className="text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0"
                                style={{ height: "24px", paddingLeft: "10px", paddingRight: "10px", backgroundColor: "hsla(122, 100%, 35%, 1)", fontFamily: "'Mona Sans', sans-serif", fontSize: "10px", fontWeight: 600, borderRadius: "27px" }}>
                                New
                            </span>
                        )}
                    </div>

                    <button
                        className="absolute z-20 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-300"
                        style={{ width: "24px", height: "24px", top: "10.57px", right: "12.51px", backgroundColor: "hsla(0, 0%, 96%, 1)", border: "0.2px solid hsla(0, 0%, 80%, 1)", borderRadius: "100%", padding: "2.25px" }}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                        <Heart size={19.5} color="#000000" weight="thin" />
                    </button>

                    <div className="relative w-full h-full p-4 flex items-center justify-center">
                        <motion.img
                            variants={{ initial: { scale: 1 }, hover: { scale: 1.05 } }}
                            src={product.image}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-700 ease-out"
                        />
                    </div>
                </div>

                {/* Text Section */}
                <div
                    className="flex flex-col relative font-manrope bg-white"
                    style={{
                        width: isDesktop ? '285px' : '100%',
                        padding: isDesktop ? '8px 12px 12px' : '4px 8px 8px',
                        gap: isDesktop ? '8px' : '4px',
                    }}
                >
                    <h3 className="font-manrope line-clamp-1 shrink-0"
                        style={{ fontSize: isDesktop ? "18px" : "15px", fontWeight: 600, lineHeight: isDesktop ? "25px" : "22px", letterSpacing: isDesktop ? "-0.4px" : "normal", color: isHovered ? 'hsla(3, 100%, 56%, 1)' : "hsla(0, 0%, 16%, 1)", transition: 'color 0.3s' }}>
                        {product.name}
                    </h3>

                    <div className="flex items-center justify-between shrink-0" style={{ height: "16px" }}>
                        <div className="flex items-center gap-1">
                            <div className="flex text-[#FF9500]">
                                {isDesktop ? ([1,2,3,4,5].map(s => <Star key={s} size={14} weight="fill" className={s <= Math.round(product.rating || 4) ? "" : "opacity-20"} />)) : (<Star size={12} weight="fill" />)}
                            </div>
                            <span className="ml-1" style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: "11px", fontWeight: 500, color: "hsla(0, 0%, 33%, 1)", letterSpacing: "-0.01em" }}>
                                {product.rating || "4.5"} ({product.reviews || 12})
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5" style={{ color: "hsla(0, 0%, 46%, 1)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[16px] h-[16px]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                            <span style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "-0.04em" }}>2-4 days</span>
                        </div>
                    </div>

                    <div className="flex items-center shrink-0" style={{ gap: "3px", marginTop: "-4px" }}>
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: isDesktop ? "11px" : "10px", fontWeight: 500, color: "hsla(0, 0%, 33%, 1)", letterSpacing: "-0.01em" }}>from</span>
                        {product.originalPrice && (
                            <span className="line-through decoration-[1.5px]" style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: isDesktop ? "16px" : "12px", fontWeight: 600, color: "hsla(0, 0%, 46%, 1)", letterSpacing: "-0.04em" }}>₹{product.originalPrice}</span>
                        )}
                        <span className="font-bold tracking-tight ml-1" style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: isDesktop ? "26px" : "16px", fontWeight: 600, color: "hsla(3, 100%, 56%, 1)", letterSpacing: isDesktop ? "-0.04em" : "-0.06em" }}>₹{product.rentPrice}</span>
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: isDesktop ? "11px" : "10px", fontWeight: 500, color: "hsla(0, 0%, 46%, 1)", letterSpacing: "-0.01em", marginLeft: "2px" }}>/month</span>
                    </div>

                    {/* Rent Now — slides in as card grows downward */}
                    {isDesktop && (
                        <div style={{ overflow: 'hidden', height: isHovered ? '43px' : '0px', opacity: isHovered ? 1 : 0, transition: 'height 0.28s ease, opacity 0.2s ease', display: 'flex', alignItems: 'flex-end' }}>
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(e, product); }}
                                className="btn-primary w-full text-[14px] active:scale-95"
                                style={{ height: '38px', borderRadius: '100px', flexShrink: 0 }}
                            >
                                Rent Now
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const FeaturedShowcase = () => {
    const dispatch = useDispatch();
    const [cms, setCms] = useState({ enabled: true, banners: FALLBACK_BANNERS });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [fetchingProducts, setFetchingProducts] = useState(false);

    useEffect(() => {
        const checkRes = () => setIsDesktop(window.innerWidth >= 1024);
        checkRes();
        window.addEventListener('resize', checkRes);
        return () => window.removeEventListener('resize', checkRes);
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
        }));
    };

    // Sync products when banner changes
    useEffect(() => {
        const activeCategory = cms.banners[currentBanner]?.category;

        const loadProducts = async () => {
            setFetchingProducts(true);
            try {
                // 1. Try fetching products filtered by category
                let url = activeCategory
                    ? `${API}/api/products?category=${activeCategory}&limit=2`
                    : `${API}/api/products?limit=2`;

                let res = await fetch(url).catch(() => ({ ok: false }));
                let data = res.ok ? await res.json() : { products: [] };

                // 2. Fallback: If no products found for category, fetch general 'Best Rented' products
                if (data.products.length === 0 && activeCategory) {
                    const fallbackRes = await fetch(`${API}/api/products?limit=2`).catch(() => ({ ok: false }));
                    if (fallbackRes.ok) {
                        data = await fallbackRes.json();
                    }
                }

                if (data.products) {
                    setProducts(data.products.map(p => ({
                        id: p._id,
                        name: p.name,
                        image: p.images?.[0] || "/images/placeholder.png",
                        rating: p.rating || 4.5,
                        reviews: p.numReviews || 12,
                        originalPrice: p.rentalPrice ? Math.round(p.rentalPrice * 1.5) : 8999,
                        rentPrice: p.rentalPrice || 5000,
                        isNew: p.isNew || false
                    })));
                }
            } catch (err) {
                console.error("Showcase fetch error:", err);
            } finally {
                setFetchingProducts(false);
                setLoading(false);
            }
        };

        loadProducts();
    }, [currentBanner, cms.banners]);

    if (loading) return null;

    return (
        <section className="bg-white py-24 overflow-hidden">

            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

                <div
                    className="flex flex-col lg:flex-row items-stretch"
                    style={{ gap: isDesktop ? "56px" : "20px" }}
                >

                    {/* Left */}
                    <div className="flex flex-col md:flex-row items-stretch gap-6 transition-all duration-500">
                        {products[0] && (
                            <ShowcaseProductCard
                                product={products[0]}
                                isDesktop={isDesktop}
                                handleAddToCart={handleAddToCart}
                            />
                        )}

                        {products[1] && (
                            <ShowcaseProductCard
                                product={products[1]}
                                isDesktop={isDesktop}
                                handleAddToCart={handleAddToCart}
                            />
                        )}
                    </div>

                    {/* Right */}
                    <div className="w-full lg:flex-1 min-w-0 overflow-hidden">
                        <BannerCarousel
                            banners={cms.banners}
                            current={currentBanner}
                            setCurrent={setCurrentBanner}
                            height="387px"
                            productImage={products[0]?.image || products[1]?.image}
                        />
                    </div>

                </div>

            </div>
        </section>
    );
};
export default FeaturedShowcase;