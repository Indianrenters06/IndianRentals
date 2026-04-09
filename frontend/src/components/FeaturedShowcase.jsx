import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretLeft, CaretRight, Heart, Star, Truck, Info } from '@phosphor-icons/react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/features/cartSlice';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const FALLBACK_BANNERS = [
    {
        title: "Apple Products",
        subtitle: "MacBooks | iPads | iPhones | Mac Studio | Mac Mini",
        image: "/images/banner-apple.png",
        href: "/products",
        bg: "linear-gradient(to bottom, #8E2DE2, #4A00E0)",
        category: "MacBook"
    },
    {
        title: "Smart Devices",
        subtitle: "Everything you need for your smart home.",
        image: "/images/banner-smart.png",
        href: "/products",
        bg: "linear-gradient(to bottom, #2D6A4F, #1B4332)",
        category: "SmartPhone"
    }
];

// ─── Banner Carousel ──────────────────────────────────────────────────────────
const BannerCarousel = ({ banners, current, setCurrent, height = "387px" }) => {
    const [direction, setDirection] = useState(1);

    const go = useCallback((dir) => {
        setDirection(dir);
        setCurrent(prev => (prev + dir + banners.length) % banners.length);
    }, [banners.length, setCurrent]);

    useEffect(() => {
        const t = setInterval(() => go(1), 8000);
        return () => clearInterval(t);
    }, [go]);

    const slide = banners[current];

    return (
        <div
            className="relative overflow-hidden shadow-xl"
            style={{
                height,
                width: "100%",
                borderRadius: "30px",
                maxWidth: "100%"
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
                    className="absolute inset-0 flex flex-col items-center justify-end pb-8"
                    style={{ background: slide.bg || "#F5F5F7" }}
                >
                    <div className="absolute inset-x-0 top-0 h-[65%] flex items-center justify-center p-8">
                        <div className="w-full h-full bg-white/20 rounded-2xl backdrop-blur-xl flex items-center justify-center border border-white/10">
                            <span className="text-white/50 text-sm">Product Visual</span>
                        </div>
                    </div>

                    <div className="relative z-10 text-center px-6">
                        <div className="flex items-center justify-center gap-4 mb-1">
                            <button
                                onClick={() => go(-1)}
                                className="flex items-center justify-center rounded-full hover:scale-110 transition-all duration-200"
                                style={{
                                    width: "24px",
                                    height: "24px",
                                    backgroundColor: "hsla(0, 0%, 96%, 1)",
                                    padding: "2.25px",
                                    flexShrink: 0
                                }}
                            >
                                <CaretLeft size={19.5} weight="bold" color="#1D1D1F" />
                            </button>
                            <h3 className="text-white text-[24px] font-bold tracking-tight" style={{ fontFamily: "'Mona Sans', sans-serif" }}>
                                {slide.title}
                            </h3>
                            <button
                                onClick={() => go(1)}
                                className="flex items-center justify-center rounded-full hover:scale-110 transition-all duration-200"
                                style={{
                                    width: "24px",
                                    height: "24px",
                                    backgroundColor: "hsla(0, 0%, 96%, 1)",
                                    padding: "2.25px",
                                    flexShrink: 0
                                }}
                            >
                                <CaretRight size={19.5} weight="bold" color="#1D1D1F" />
                            </button>
                        </div>
                        <p className="text-white/80 text-[14px] font-medium opacity-80 leading-tight mb-4">
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

    return (
        <div
            className="relative group h-full flex-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onClick={() => router.push(`/products/${product.id}`)}
        >
            <motion.div
                animate={isHovered ? "hover" : "initial"}
                initial="initial"
                className="bg-white flex flex-col overflow-hidden relative mx-auto w-full rounded-[16px]"
                style={{
                    height: isDesktop ? '387px' : '256px',
                    width: isDesktop ? '285px' : '170px',
                    border: "1px solid hsla(0, 0%, 89%, 1)",
                    willChange: "transform, height",
                    cursor: "pointer",
                    backgroundColor: "hsla(0, 0%, 100%, 1)",
                    borderRadius: isDesktop ? "16px" : "8px",
                    opacity: 1
                }}
                variants={{
                    initial: {
                        height: isDesktop ? 387 : 256,
                        y: 0,
                        scale: 1,
                        boxShadow: "0px 1px 2px 0px hsla(0, 0%, 0%, 0.05)"
                    },
                    hover: {
                        height: isDesktop ? 440 : 330,
                        y: -12,
                        scale: 1.01,
                        boxShadow: "0px 10px 20px -4px hsla(0, 0%, 0%, 0.08)",
                        transition: { duration: 0.35, ease: [0.33, 1, 0.68, 1] }
                    }
                }}
            >
                {/* Image Section */}
                <div
                    className="relative bg-white group-hover:bg-[#F9F9F9] transition-colors duration-500 flex items-center justify-center overflow-hidden shrink-0 h-[184px] md:h-[282px]"
                    style={{
                        width: isDesktop ? '285px' : '170px',
                        borderRadius: isDesktop ? "16px" : "8px",
                        borderWidth: "0px 1px 1px 1px",
                        borderStyle: "solid",
                        borderColor: "hsla(0, 0%, 93%, 1)",
                        backgroundColor: "hsla(0, 0%, 100%, 1)",
                        opacity: 1,
                        boxShadow: "0px 4px 8px 0px hsla(0, 0%, 87%, 0.1), 0px 15px 15px 0px hsla(0, 0%, 87%, 0.09), 0px 33px 20px 0px hsla(0, 0%, 87%, 0.05), 0px 59px 23px 0px hsla(0, 0%, 87%, 0.01), 0px 91px 26px 0px hsla(0, 0%, 87%, 0)"
                    }}
                >
                    <div
                        className="absolute z-20 flex items-center"
                        style={{
                            top: isDesktop ? "14.57px" : "12.57px",
                            left: isDesktop ? "14.49px" : "13.49px",
                            gap: "4px",
                            width: isDesktop ? "114px" : "92px",
                            height: isDesktop ? "24px" : "28px"
                        }}
                    >
                        <span className="text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0"
                            style={{
                                width: isDesktop ? "auto" : "65px",
                                height: isDesktop ? "100%" : "24px",
                                background: "hsla(3, 86%, 51%, 1)",
                                fontFamily: "'Mona Sans', sans-serif",
                                fontSize: "10px",
                                fontWeight: 600,
                                letterSpacing: "-0.01em",
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                borderRadius: "27px",
                                boxShadow: "0px 0px 1px 0px hsla(0, 0%, 47%, 0.1), 0px 1px 1px 0px hsla(0, 0%, 47%, 0.09), 0px 3px 2px 0px hsla(0, 0%, 47%, 0.05), 0px 5px 2px 0px hsla(0, 0%, 47%, 0.01), 0px 9px 2px 0px hsla(0, 0%, 47%, 0)"
                            }}
                        >
                            -20% off
                        </span>
                        {(isDesktop || product.isNew) && (
                            <span
                                className="text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0"
                                style={{
                                    width: isDesktop ? "auto" : "45px",
                                    height: isDesktop ? "100%" : "24px",
                                    paddingLeft: isDesktop ? "10px" : "0",
                                    paddingRight: isDesktop ? "10px" : "0",
                                    backgroundColor: "hsla(122, 100%, 35%, 1)",
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontSize: "10px",
                                    fontWeight: 600,
                                    letterSpacing: "-0.01em",
                                    borderRadius: "27px",
                                    boxShadow: "0px 0px 1px 0px hsla(0, 0%, 47%, 0.1), 0px 1px 1px 0px hsla(0, 0%, 47%, 0.09), 0px 3px 2px 0px hsla(0, 0%, 47%, 0.05), 0px 5px 2px 0px hsla(0, 0%, 47%, 0.01), 0px 9px 2px 0px hsla(0, 0%, 47%, 0)"
                                }}
                            >
                                New
                            </span>
                        )}
                    </div>

                    <button
                        className="absolute z-20 flex items-center justify-center rounded-full shadow-sm hover:scale-110 transition-all duration-300"
                        style={{
                            width: "24px",
                            height: "24px",
                            top: "10.57px",
                            right: "12.51px",
                            backgroundColor: "hsla(0, 0%, 96%, 1)",
                            border: "0.2px solid hsla(0, 0%, 80%, 1)",
                            borderRadius: "100%",
                            padding: "2.25px"
                        }}
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
                        height: isDesktop ? (isHovered ? '158px' : '105px') : '72px',
                        paddingTop: isDesktop ? '8px' : '4px',
                        paddingRight: isDesktop ? '12px' : '8px',
                        paddingBottom: isDesktop ? '12px' : '8px',
                        paddingLeft: isDesktop ? '12px' : '8px',
                        gap: isDesktop ? '8px' : '4px',
                        opacity: 1,
                        transition: 'height 0.3s ease'
                    }}
                >
                    <h3
                        className="font-manrope line-clamp-1 group-hover:text-[#FF3B30] transition-colors duration-300 shrink-0"
                        style={{
                            width: isDesktop ? "261px" : "100%",
                            height: isDesktop ? "25px" : "22px",
                            fontSize: isDesktop ? "18px" : "15px",
                            fontWeight: 600,
                            lineHeight: isDesktop ? "25px" : "22px",
                            letterSpacing: isDesktop ? "-0.4px" : "normal",
                            color: "hsla(0, 0%, 16%, 1)"
                        }}
                    >
                        {product.name}
                    </h3>

                    <div
                        className="flex items-center justify-between shrink-0"
                        style={{
                            width: isDesktop ? "261px" : "154px",
                            height: "16px"
                        }}
                    >
                        <div className="flex items-center gap-1">
                            <div className="flex text-[#FF9500]">
                                {isDesktop ? (
                                    [1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} size={14} weight="fill" className={s <= Math.round(product.rating || 4) ? "" : "opacity-20"} />
                                    ))
                                ) : (
                                    <Star size={12} weight="fill" />
                                )}
                            </div>
                            <span
                                className="ml-1"
                                style={{
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontSize: "11px",
                                    fontWeight: 500,
                                    color: "hsla(0, 0%, 33%, 1)",
                                    letterSpacing: "-0.01em"
                                }}
                            >
                                {product.rating || "4.5"} ({product.reviews || 12})
                            </span>
                        </div>
                        <div
                            className="flex items-center flex-nowrap shrink-0"
                            style={{
                                color: "hsla(0, 0%, 46%, 1)",
                                gap: isDesktop ? "6px" : "2px",
                                width: isDesktop ? "auto" : "57px",
                                height: isDesktop ? "auto" : "14px"
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={isDesktop ? 1.5 : 0.63} stroke={isDesktop ? "currentColor" : "hsla(0, 0%, 69%, 1)"} className={isDesktop ? "w-[16px] h-[16px]" : "w-[8.11px] h-[6.25px] mt-[2.19px] ml-[0.94px]"}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                            <span
                                className="whitespace-nowrap"
                                style={{
                                    fontFamily: isDesktop ? "'Manrope', sans-serif" : "'Mona Sans', sans-serif",
                                    fontSize: isDesktop ? "12px" : "10px",
                                    fontWeight: 500,
                                    lineHeight: isDesktop ? "120%" : "14px",
                                    letterSpacing: isDesktop ? "-0.04em" : "-0.01em",
                                    color: isDesktop ? "hsla(0, 0%, 46%, 1)" : "hsla(0, 0%, 69%, 1)",
                                    display: "inline-block",
                                    width: isDesktop ? "auto" : "31px",
                                    height: isDesktop ? "auto" : "14px"
                                }}
                            >
                                2-4 days
                            </span>

                        </div>
                    </div>

                    <div
                        className="flex items-center shrink-0"
                        style={{
                            width: isDesktop ? "209px" : "145px",
                            height: isDesktop ? "28px" : "20px",
                            gap: isDesktop ? "3px" : "3px",
                            opacity: 1,
                            marginTop: "-4px"
                        }}
                    >
                        <span
                            className="lowercase"
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontSize: isDesktop ? "11px" : "10px",
                                fontWeight: 500,
                                color: "hsla(0, 0%, 33%, 1)",
                                letterSpacing: "-0.01em",
                                display: "inline-block",
                                width: isDesktop ? "auto" : "25px",
                                height: isDesktop ? "auto" : "14px",
                                lineHeight: isDesktop ? "normal" : "14px"
                            }}
                        >
                            from
                        </span>
                        {product.originalPrice && (
                            <span
                                className="line-through decoration-[1.5px]"
                                style={{
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontSize: isDesktop ? "16px" : "12px",
                                    fontWeight: 600,
                                    color: "hsla(0, 0%, 46%, 1)",
                                    letterSpacing: "-0.04em",
                                    display: "inline-block",
                                    width: isDesktop ? "auto" : "45px",
                                    height: isDesktop ? "auto" : "16px",
                                    lineHeight: isDesktop ? "normal" : "16px"
                                }}
                            >
                                ₹{product.originalPrice}
                            </span>
                        )}
                        <span
                            className="font-bold tracking-tight ml-1"
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontSize: isDesktop ? "26px" : "16px",
                                fontWeight: 600,
                                color: "hsla(3, 100%, 56%, 1)",
                                letterSpacing: isDesktop ? "-0.04em" : "-0.06em",
                                lineHeight: isDesktop ? "normal" : "20px"
                            }}
                        >
                            ₹{product.rentPrice}
                        </span>
                        <span
                            className="lowercase"
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontSize: isDesktop ? "11px" : "10px",
                                fontWeight: 500,
                                color: "hsla(0, 0%, 46%, 1)",
                                letterSpacing: "-0.01em",
                                display: "inline-block",
                                width: isDesktop ? "auto" : "46px",
                                height: isDesktop ? "auto" : "14px",
                                lineHeight: isDesktop ? "normal" : "14px",
                                marginLeft: "2px"
                            }}
                        >
                            /month
                        </span>
                    </div>

                    <div
                        className="relative w-full z-30 overflow-hidden flex items-center transition-all duration-300 ease-out"
                        style={{
                            height: isHovered ? (isDesktop ? '50px' : '44px') : '0px',
                            opacity: isHovered ? 1 : 0,
                            paddingTop: isHovered ? '8px' : '0px'
                        }}
                    >
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(e, product); }}
                            className="w-full h-full rounded-full bg-[#FFCF46] text-[#1D1D1F] font-bold text-[14px] shadow-sm transform transition-all duration-300 ease-out active:scale-95 hover:brightness-105"
                            style={{ transform: isHovered ? 'translateY(0)' : 'translateY(15px)' }}
                        >
                            Rent Now
                        </button>
                    </div>
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
                    <div className="w-full lg:flex-1 shrink-0">
                        <BannerCarousel
                            banners={cms.banners}
                            current={currentBanner}
                            setCurrent={setCurrentBanner}
                            height="387px"
                        />
                    </div>

                </div>

            </div>
        </section>
    );
};
export default FeaturedShowcase;