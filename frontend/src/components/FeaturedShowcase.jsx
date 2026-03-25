"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegHeart, FaStar, FaTruck, FaInfoCircle, FaChevronLeft, FaChevronRight, FaBolt } from "react-icons/fa";

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
import Button from "./common/Button";

// ─── Single Product Card ──────────────────────────────────────────────────────
const ShowcaseProductCard = ({ product, index, onAddToCart, onQuickView, isAdded }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: index * 0.1 }}
        className="group bg-white rounded-2xl flex flex-col overflow-hidden relative transition-all duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] hover:-translate-y-1"
        style={{ width: "281px", height: "391px", flexShrink: 0, border: "1px solid hsla(0, 0%, 89%, 1)" }}
    >
        {/* Image Section — full-bleed top */}
        <div
            className="relative rounded-2xl bg-[#F7F7F7] group-hover:bg-[#F0F0F0] transition-colors duration-500 flex items-center justify-center overflow-hidden shrink-0"
            style={{ width: "281px", height: "282px", borderRight: "1px solid hsla(0, 0%, 89%, 1)", borderBottom: "1px solid hsla(0, 0%, 89%, 1)", borderLeft: "1px solid hsla(0, 0%, 89%, 1)" }}
        >
            {/* Badges */}
            <div className="absolute top-3 left-3 z-20 flex gap-1.5">
                <span className="bg-[#FF3B30] text-white text-[11px] font-bold px-2 py-[3px] rounded-[4px] shadow-sm leading-none">
                    -20% off
                </span>
                {product.isNew && (
                    <span className="bg-[#34C759] text-white text-[11px] font-bold px-2 py-[3px] rounded-[4px] shadow-sm leading-none">
                        New
                    </span>
                )}
            </div>
            {/* Heart */}
            <button
                className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-gray-400 rounded-full shadow-sm hover:text-[#FF3B30] hover:scale-110 transition-all duration-300"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
                <FaRegHeart size={14} />
            </button>
            {/* Product Image */}
            <Link href={`/products/${product.id}`} className="flex items-center justify-center w-full h-full">
                <div className="w-[240px] h-[220px] relative transition-transform duration-700 ease-out group-hover:scale-105">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                    />
                </div>
            </Link>
        </div>

        {/* Text Section */}
        <Link
            href={`/products/${product.id}`}
            className="flex flex-col"
            style={{ width: "281px", height: "105px", gap: "8px", paddingTop: "8px", paddingRight: "12px", paddingBottom: "12px", paddingLeft: "12px" }}
        >
            <h3
                className="font-manrope text-[#1D1D1F] line-clamp-1 group-hover:text-[#FF3B30] transition-colors duration-300"
                style={{ fontSize: "16px", fontWeight: 600, lineHeight: "23px", letterSpacing: "-0.4px" }}
            >
                {product.name}
            </h3>
            <div className="flex items-center justify-between transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-1">
                <div className="flex items-center gap-0.5">
                    <div className="flex text-[#FF9F0A]">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <FaStar key={s} size={12} className={s <= Math.round(product.rating || 4) ? "" : "opacity-20"} />
                        ))}
                    </div>
                    <span className="text-[12px] font-semibold text-[#86868B] ml-1">
                        {product.rating || "4.5"}({product.reviews || 0})
                    </span>
                </div>
                <div className="flex items-center gap-1 text-[#86868B]">
                    <FaTruck size={12} />
                    <span className="text-[11px] font-medium">2-4 days</span>
                    <FaInfoCircle size={9} className="opacity-40" />
                </div>
            </div>
            <div className="relative">
                <div className="flex items-baseline gap-1.5 transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-2">
                    <span className="text-[12px] text-[#86868B] font-medium">from</span>
                    <span className="text-[14px] text-[#86868B] line-through font-medium opacity-60">₹{product.originalPrice}</span>
                    <span className="text-[20px] font-extrabold text-[#FF3B30] leading-none">₹{product.rentPrice}</span>
                    <span className="text-[12px] text-[#86868B] font-medium">/month</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out z-30">
                    <Button
                        variant="black"
                        size="md"
                        className="flex-1 h-[34px]! rounded-[10px]! text-[12px]! min-w-0! font-bold active:scale-95"
                        onClick={(e) => onQuickView(e, product.id)}
                    >
                        Quick View
                    </Button>
                    <Button
                        variant={isAdded ? 'ghost' : 'yellow'}
                        size="md"
                        className={`flex-1 h-[34px]! rounded-[10px]! text-[12px]! min-w-0! font-bold active:scale-95 ${isAdded ? 'bg-green-500 text-white! border-none' : ''}`}
                        onClick={(e) => onAddToCart(e, product)}
                    >
                        {isAdded ? 'Added!' : 'Add to Cart'}
                    </Button>
                </div>
            </div>
        </Link>
    </motion.div>
);


// ─── Banner Carousel ──────────────────────────────────────────────────────────
const BannerCarousel = ({ banners }) => {
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
        <div
            className="relative overflow-hidden rounded-2xl flex-1"
            style={{ height: "391px" }}
        >
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
                    {/* Background image */}
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

                    {/* Content — padded per Figma: 30px top/bottom, 31px left/right */}
                    <div className="relative z-10 mt-auto" style={{ padding: "30px 31px" }}>
                        {/* Nav arrows */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-5 right-5 flex justify-between pointer-events-none">
                            <button
                                onClick={(e) => { e.stopPropagation(); go(-1); }}
                                className="pointer-events-auto w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all"
                            >
                                <FaChevronLeft size={12} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); go(1); }}
                                className="pointer-events-auto w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all"
                            >
                                <FaChevronRight size={12} />
                            </button>
                        </div>

                        <Link href={slide.href || "/products"}>
                            <h3 className="text-white text-[22px] font-bold font-manrope tracking-tight leading-tight mb-1.5 hover:underline">
                                {slide.title}
                            </h3>
                        </Link>
                        <p className="text-white/75 text-[13px] font-medium tracking-tight mb-4">
                            {slide.subtitle}
                        </p>

                        {/* Dots */}
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
    
    // ... useEffect remains the same

    useEffect(() => {
        const load = async () => {
            try {
                // 1. Fetch CMS config
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

                // 2. Fetch pinned products, fallback to generic
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
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-[391px] w-full max-w-[1200px] mx-auto bg-slate-50 animate-pulse rounded-[20px]" />
            </div>
        </section>
    );

    if (!cms.enabled) return null;

    // Pad to exactly 2 product cards
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
        <section
            className="bg-white w-full"
            style={{ borderTop: "1px solid hsla(0, 0%, 89%, 1)", paddingTop: "96px", paddingBottom: "96px" }}
        >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
                {/* Inner row: fills max-w-[1200px] container, height 391px, gap 35px */}
                <div
                    className="flex flex-row items-stretch w-full"
                    style={{ height: "391px", gap: "35px" }}
                >
                    {/* Left: cards group — two cards side by side, gap 20px */}
                    <div
                        className="flex flex-row shrink-0"
                        style={{ gap: "20px" }}
                    >
                        {displayProducts.map((product, idx) => (
                            <ShowcaseProductCard
                                key={product.id || idx}
                                product={product}
                                index={idx}
                                onAddToCart={handleAddToCart}
                                onQuickView={handleQuickView}
                                isAdded={addedStatus[product.id]}
                            />
                        ))}
                    </div>

                    {/* Right: Banner carousel — fills remaining width */}
                    <BannerCarousel banners={activeBanners} />
                </div>
            </div>
        </section>
    );
};

export default FeaturedShowcase;
