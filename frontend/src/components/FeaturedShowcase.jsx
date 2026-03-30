"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegHeart, FaStar, FaTruck, FaInfoCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { API } from "@/services/apiConfig";

// ─── Fallback banner slides ───────────────────────────────────────────────────
const FALLBACK_BANNERS = [
    {
        title: "Apple Products",
        subtitle: "MacBooks | iPads | iPhones | Mac Studio | Mac Mini",
        image: "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1773311179/f5d05a49c7a9e513697df5b39fc826c8e9635182_bau9ky.png",
        bg: "linear-gradient(135deg, #2a1a5e 0%, #4c3099 40%, #7c5cbf 70%, #b08ad4 100%)",
        href: "/categories/apple",
    },
    {
        title: "Gaming Laptops",
        subtitle: "ASUS ROG | Lenovo Legion | MSI | HP Omen",
        image: "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1773311180/c853e25515c331bf8956b228e04cd4b22e0b91d3_d7oqzx.png",
        bg: "linear-gradient(135deg, #0a1628 0%, #1a3a5c 40%, #1e5f8c 70%, #2a9fd6 100%)",
        href: "/categories/gaming",
    },
    {
        title: "Smart Devices",
        subtitle: "Tablets | Smartwatches | Earbuds | Accessories",
        image: "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1773311190/7376ef09ee50f329f3115a2bdec517818465c5a3_fzsfya.png",
        bg: "linear-gradient(135deg, #1a2e1a 0%, #1e5c3a 40%, #25874f 70%, #3ac47d 100%)",
        href: "/categories/smart-devices",
    },
];

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";

// ─── Single Product Card ──────────────────────────────────────────────────────
const ShowcaseProductCard = ({ product, index, isDesktop, handleAddToCart }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative group h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
        >
            <motion.div
                animate={isHovered ? "hover" : "initial"}
                initial="initial"
                className="bg-white rounded-[24px] flex flex-col overflow-hidden relative mx-auto w-[173px] md:w-[285px]"
                style={{ 
                    height: isDesktop ? '350px' : '260px',
                    border: "1px solid hsla(0, 0%, 89%, 1)",
                    boxShadow: "0px 1px 2px 0px hsla(0, 0%, 0%, 0.05)",
                    willChange: "transform, height"
                }}
                variants={{
                    initial: { 
                        height: isDesktop ? 350 : 260,
                        boxShadow: "0px 1px 2px 0px hsla(0, 0%, 0%, 0.05)"
                    },
                    hover: { 
                        height: isDesktop ? 405 : 330,
                        boxShadow: "0px 12px 40px rgba(0,0,0,0.12)",
                        transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] }
                    }
                }}
            >
                {/* Image Section — full-bleed top */}
                <div
                    className="relative bg-[#F9F9F9] flex items-center justify-center overflow-hidden shrink-0 h-[146px] md:h-[240px] rounded-t-2xl"
                    style={{ 
                        borderWidth: '0px 1px 1px 1px',
                        borderStyle: 'solid',
                        borderColor: 'hsla(0, 0%, 93%, 1)',
                        boxShadow: '0px 4px 8px 0px hsla(0, 0%, 87%, 0.1)'
                    }}
                >
                    {/* Badges */}
                    <div className="absolute top-2 left-2 z-20 flex gap-1">
                        <span className="bg-[#FF3B30] text-white text-[9px] md:text-[11px] font-bold px-1.5 py-[2px] rounded-[4px] shadow-sm leading-none">
                            -20% off
                        </span>
                    </div>
                    
                    {/* Heart */}
                    <button
                        className="absolute top-2 right-2 z-20 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-white border border-gray-200 text-gray-400 rounded-full shadow-sm hover:text-[#FF3B30] hover:scale-110 transition-all duration-300"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                        <FaRegHeart size={isDesktop ? 14 : 12} />
                    </button>

                    {/* Product Image */}
                    <Link 
                        href={`/products/${product.id}`} 
                        className="flex items-center justify-center w-full h-full p-4"
                        onClick={(e) => {
                            if (!isDesktop && !isHovered) {
                                e.preventDefault();
                                setIsHovered(true);
                            }
                        }}
                    >
                        <motion.img
                            variants={{
                                initial: { scale: 1 },
                                hover: { scale: 1.05 }
                            }}
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                        />
                    </Link>
                </div>
                {/* Text Section */}
                <div
                    className="flex flex-col relative overflow-hidden font-manrope"
                    style={{ 
                        width: isDesktop ? '285px' : '173px',
                        height: 'auto',
                        padding: isDesktop ? '8px 12px 12px 12px' : '6px 10px 8px 10px',
                        gap: isDesktop ? '4px' : '2px'
                    }}
                >
                    <Link 
                        href={`/products/${product.id}`}
                        onClick={(e) => {
                            if (!isDesktop && !isHovered) {
                                e.preventDefault();
                                setIsHovered(true);
                            }
                        }}
                    >
                        <h3 className="text-[#1D1D1F] line-clamp-1 text-[14px] md:text-[18px] font-bold leading-tight">
                            {product.name}
                        </h3>
                    </Link>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <div className="flex text-[#FF9F0A]">
                                {isDesktop ? (
                                    [1, 2, 3, 4, 5].map((s) => (
                                        <FaStar key={s} size={12} className={s <= Math.round(product.rating || 4) ? "" : "opacity-20"} />
                                    ))
                                ) : (
                                    <FaStar size={10} />
                                )}
                            </div>
                            <span className="text-[11px] md:text-[14px] font-bold text-[#8E8E93] ml-1">
                                {product.rating || "4.5"}({product.reviews || 12})
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#8E8E93]">
                            <FaTruck size={14} />
                            <span className="text-[13px] font-semibold">2-4 days</span>
                            <FaInfoCircle size={10} className="ml-0.5 opacity-40" />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-baseline flex-nowrap gap-1">
                            <span className="text-[10px] md:text-[13px] text-[#8E8E93] font-medium whitespace-nowrap leading-none">from</span>
                            {product.originalPrice && (
                                <span className="text-[13px] md:text-[15px] text-[#8E8E93] line-through font-bold whitespace-nowrap leading-none">₹{product.originalPrice}</span>
                            )}
                            <span className="text-[17px] md:text-[24px] font-extrabold text-[#FF3B30] leading-none whitespace-nowrap">₹{product.rentPrice}</span>
                            <span className="text-[10px] md:text-[13px] text-[#8E8E93] font-medium whitespace-nowrap leading-none">/month</span>
                        </div>
                    </div>

                    <motion.div 
                        variants={{
                            initial: { opacity: 0, height: 0 },
                            hover: { 
                                opacity: 1, 
                                height: 60, 
                                transition: { 
                                    height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                                    opacity: { duration: 0.3 }
                                }
                            }
                        }}
                        className="relative w-full z-30 overflow-hidden flex items-center pt-2 pb-1"
                    >
                        <motion.button 
                            variants={{
                                initial: { y: 60 },
                                hover: { 
                                    y: 0,
                                    transition: { type: "spring", stiffness: 300, damping: 25, delay: 0.1 }
                                }
                            }}
                            onClick={(e) => handleAddToCart(e, product)}
                            className="w-full h-[50px] rounded-full bg-[#fbc02d] text-[#1D1D1F] font-bold text-[14px] md:text-[16px] shadow-md active:scale-95 transition-all hover:brightness-105"
                        >
                            Rent Now
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

// ─── Banner Carousel ──────────────────────────────────────────────────────────
const BannerCarousel = ({ banners, height = "391px" }) => {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);

    const go = useCallback((dir) => {
        setDirection(dir);
        setCurrent(prev => (prev + dir + banners.length) % banners.length);
    }, [banners.length]);

    useEffect(() => {
        const t = setInterval(() => go(1), 4000);
        return () => clearInterval(t);
    }, [go]);

    const slide = banners[current];

    return (
        <div className="relative overflow-hidden rounded-2xl flex-1" style={{ height }}>
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={current}
                    custom={direction}
                    variants={{
                        enter: (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
                        center: { x: 0, opacity: 1 },
                        exit:  (d) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="absolute inset-0 flex flex-col"
                    style={{ background: slide.bg }}
                >
                    <div className="absolute inset-0 z-0">
                        {slide.image && (
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-contain object-bottom opacity-80 scale-110"
                                priority
                            />
                        )}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-[55%]"
                            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)" }}
                        />
                    </div>
                    <div className="relative z-10 mt-auto" style={{ padding: "30px 31px" }}>
                        <div className="absolute top-1/2 -translate-y-1/2 left-5 right-5 flex justify-between pointer-events-none">
                            <button
                                onClick={(e) => { e.stopPropagation(); go(-1); }}
                                className="pointer-events-auto w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/40"
                            >
                                <FaChevronLeft size={12} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); go(1); }}
                                className="pointer-events-auto w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/40"
                            >
                                <FaChevronRight size={12} />
                            </button>
                        </div>
                        <Link href={slide.href || "/products"}>
                            <h3 className="text-white text-[22px] font-bold font-manrope tracking-tight leading-tight mb-1.5 hover:underline">
                                {slide.title}
                            </h3>
                        </Link>
                        <p className="text-white/75 text-[13px] font-medium mb-4">{slide.subtitle}</p>
                        <div className="flex gap-2">
                            {banners.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                                    className={`transition-all duration-300 rounded-full ${i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"}`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const FeaturedShowcase = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [cms, setCms] = useState({ enabled: true, productIds: [], banners: FALLBACK_BANNERS });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addedStatus, setAddedStatus] = useState({});
    const [isDesktop, setIsDesktop] = useState(false);

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
            refundableAmount: 0,
            description: product.name
        }));
        setAddedStatus(prev => ({ ...prev, [product.id]: true }));
        setTimeout(() => setAddedStatus(prev => ({ ...prev, [product.id]: false })), 2000);
    };

    const handleQuickView = (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/products/${productId}`);
    };

    useEffect(() => {
        const load = async () => {
            try {
                const cmsRes = await fetch(`${API}/api/cms/homepage`, { cache: "no-store" });
                let pinnedIds = [];
                let banners = FALLBACK_BANNERS;
                let enabled = true;

                if (cmsRes.ok) {
                    const cmsData = await cmsRes.json();
                    enabled   = cmsData.featuredShowcaseEnabled !== false;
                    pinnedIds = cmsData.featuredShowcaseProductIds || [];
                    if (cmsData.featuredShowcaseBanners?.length > 0) {
                        banners = cmsData.featuredShowcaseBanners.map(b => ({ ...b, image: b.image || "" }));
                    }
                }

                setCms({ enabled, productIds: pinnedIds, banners });
                if (!enabled) { setLoading(false); return; }

                let fetchedProducts = [];
                if (pinnedIds.length > 0) {
                    const results = await Promise.all(
                        pinnedIds.slice(0, 2).map(id =>
                            fetch(`${API}/api/products/${id}`).then(r => r.ok ? r.json() : null)
                        )
                    );
                    fetchedProducts = results.filter(Boolean);
                }

                if (fetchedProducts.length < 2) {
                    const fallbackRes = await fetch(`${API}/api/products?limit=6`);
                    if (fallbackRes.ok) {
                        const data = await fallbackRes.json();
                        const extra = (data.products || []).filter(
                            p => !fetchedProducts.some(fp => fp._id === p._id)
                        );
                        fetchedProducts = [...fetchedProducts, ...extra].slice(0, 2);
                    }
                }

                setProducts(fetchedProducts.map(p => ({
                    id: p._id,
                    name: p.name,
                    category: p.category,
                    image: p.images?.[0] || "/images/placeholder.png",
                    rating: p.rating || 4.5,
                    reviews: p.numReviews || 12,
                    originalPrice: Math.round((p.rentalPrice || 0) * 1.5),
                    rentPrice: p.rentalPrice || 0,
                    isNew: p.condition === "New",
                })));
            } catch (e) {
                console.error("FeaturedShowcase fetch error:", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return (
        <section className="py-8 bg-white">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-[391px] w-full bg-slate-50 animate-pulse rounded-[20px]" />
            </div>
        </section>
    );

    if (!cms.enabled) return null;

    const displayProducts = products.length >= 2 ? products.slice(0, 2) : [
        ...products,
        ...Array(2 - products.length).fill(null).map((_, i) => ({
            id: `placeholder-${i}`,
            name: "Premium Device",
            category: "Electronics",
            image: "/images/placeholder.png",
            rating: 4.5,
            reviews: 12,
            originalPrice: 12999,
            rentPrice: 8999,
            isNew: true,
        }))
    ];

    const activeBanners = cms.banners?.length > 0 ? cms.banners : FALLBACK_BANNERS;

    return (
        <section className="bg-white w-full" style={{ borderTop: "1px solid hsla(0, 0%, 89%, 1)", paddingTop: "96px", paddingBottom: "120px" }}>
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row items-stretch w-full" style={{ minHeight: isDesktop ? "350px" : "auto", gap: "35px" }}>
                    <div className="flex flex-row shrink-0" style={{ gap: "20px" }}>
                        {displayProducts.map((product, idx) => (
                            <ShowcaseProductCard
                                key={product.id || idx}
                                product={product}
                                index={idx}
                                isDesktop={isDesktop}
                                handleAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                    <div className="flex-1" style={{ height: isDesktop ? "350px" : "391px" }}>
                         <BannerCarousel banners={activeBanners} height={isDesktop ? "350px" : "391px"} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedShowcase;
