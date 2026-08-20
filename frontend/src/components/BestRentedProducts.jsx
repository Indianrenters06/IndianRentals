"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useWholeCardTrack } from "@/hooks/useWholeCardTrack";
import { Heart, Star, Lightning, Truck, Info } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon } from "@heroicons/react/24/outline";

import { API } from "@/services/apiConfig";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import { toggleWishlist, selectIsWishlisted } from "@/redux/features/wishlistSlice";

const MobileProductCard = ({ product, handleAddToCart }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isHovered, setIsHovered] = useState(false);
    const isWishlisted = useSelector(selectIsWishlisted(product?.id));

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleWishlist(product));
    };

    return (
        <div
            onClick={() => router.push(`/products/${product.id}`)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(prev => !prev)}
            style={{
                width: '100%',
                maxWidth: '170px',
                height: '256px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                background: '#FFFFFF',
                border: '1px solid #E2E2E2',
                boxShadow: isHovered ? '0px 8px 16px rgba(0, 0, 0, 0.1)' : '0px 1px 2px rgba(0, 0, 0, 0.05)',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                boxSizing: 'border-box',
                margin: '0 auto',
                position: 'relative',
                transition: 'box-shadow 0.3s ease'
            }}
        >
            {/* Frame 5 — Image Container */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '184px',
                    background: '#FFFFFF',
                    borderWidth: '0px 1px 1px 1px',
                    borderStyle: 'solid',
                    borderColor: '#EEEEEE',
                    boxShadow: '0px 59px 23px rgba(222, 222, 222, 0.01), 0px 33px 20px rgba(222, 222, 222, 0.05), 0px 15px 15px rgba(222, 222, 222, 0.09), 0px 4px 8px rgba(222, 222, 222, 0.1)',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                    flexShrink: 0,
                    overflow: 'hidden',
                    zIndex: 2
                }}
            >
                {/* Badges - 20% off */}
                <div
                    style={{
                        position: 'absolute',
                        width: '39px',
                        height: '18px',
                        left: '10px',
                        top: '10px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '2px 6px',
                        gap: '10px',
                        background: '#ED2115',
                        boxShadow: '0px 5px 2px rgba(120, 120, 120, 0.01), 0px 3px 2px rgba(120, 120, 120, 0.05), 0px 1px 1px rgba(120, 120, 120, 0.09), 0px 0px 1px rgba(120, 120, 120, 0.1)',
                        borderRadius: '27px',
                        zIndex: 10
                    }}
                >
                    <span
                        style={{
                            width: '27px',
                            height: '14px',
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: '8px',
                            lineHeight: '14px',
                            letterSpacing: '-0.4px',
                            color: '#FFF2F1',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {product.discount || '20% off'}
                    </span>
                </div>

                {/* Product Image */}
                <div
                    style={{
                        position: 'absolute',
                        top: '24px',
                        bottom: '36px',
                        left: '8px',
                        right: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                            transition: 'transform 0.4s ease'
                        }}
                    />
                </div>

                {/* Rent Now Golden Yellow Pill Button — Slides up into view inside image box on hover/tap */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (handleAddToCart) {
                            handleAddToCart(e, product);
                        } else {
                            router.push(`/products/${product.id}`);
                        }
                    }}
                    style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '50%',
                        transform: isHovered ? 'translate(-50%, 0)' : 'translate(-50%, 45px)',
                        opacity: isHovered ? 1 : 0,
                        pointerEvents: isHovered ? 'auto' : 'none',
                        transition: 'transform 0.3s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.25s ease',
                        width: '155px',
                        maxWidth: 'calc(100% - 14px)',
                        height: '30px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '4px 20px',
                        gap: '2px',
                        background: '#FFCF46',
                        border: 'none',
                        borderRadius: '28px',
                        fontFamily: "'Mona Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: '12px',
                        lineHeight: '18px',
                        letterSpacing: '-0.4px',
                        color: '#141414',
                        cursor: 'pointer',
                        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.12)',
                        zIndex: 10
                    }}
                    className="active:scale-95 hover:bg-[#ffc72e]"
                >
                    Rent Now
                </button>
            </div>

            {/* Frame 86 — Text Details Container */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '4px 8px 8px',
                    gap: '4px',
                    width: '100%',
                    height: '72px',
                    boxSizing: 'border-box'
                }}
            >
                {/* Product Name */}
                <h3
                    style={{
                        width: '100%',
                        height: '16px',
                        fontFamily: "'Mona Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: '10px',
                        lineHeight: '16px',
                        letterSpacing: '-0.4px',
                        color: '#333333',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {product.name}
                </h3>

                {/* Frame 678 — Reviews & Delivery */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0px',
                        gap: '4px',
                        width: '100%',
                        height: '16px'
                    }}
                >
                    {/* Reviews */}
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 0, gap: '4px' }}>
                        <Star size={12} weight="fill" color="#FF920A" />
                        <span
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: 500,
                                fontSize: '8px',
                                lineHeight: '14px',
                                letterSpacing: '-0.4px',
                                color: '#545454'
                            }}
                        >
                            {product.rating || '4.5'} ({product.reviews || product.reviewCount || 12})
                        </span>
                    </div>

                    {/* Delivery */}
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 0, gap: '2px' }}>
                        <Truck size={10} weight="regular" color="#AFAFAF" />
                        <span
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: 500,
                                fontSize: '8px',
                                lineHeight: '14px',
                                letterSpacing: '-0.4px',
                                color: '#AFAFAF'
                            }}
                        >
                            2-4 days
                        </span>
                        <Info size={10} color="#10B981" style={{ opacity: 0.7 }} />
                    </div>
                </div>

                {/* Frame 85 — Price Row */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '0px',
                        gap: '3px',
                        width: '100%',
                        height: '20px'
                    }}
                >
                    <span
                        style={{
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 500,
                            fontSize: '8px',
                            lineHeight: '14px',
                            letterSpacing: '-0.4px',
                            color: '#545454'
                        }}
                    >
                        from
                    </span>
                    {product.originalPrice && (
                        <span
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: 600,
                                fontSize: '10px',
                                lineHeight: '16px',
                                letterSpacing: '-0.4px',
                                textDecorationLine: 'line-through',
                                color: '#757575'
                            }}
                        >
                            ₹{product.originalPrice}
                        </span>
                    )}
                    <span
                        style={{
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: '14px',
                            lineHeight: '20px',
                            letterSpacing: '-0.8px',
                            color: '#FF2C20'
                        }}
                    >
                        ₹{product.rentPrice}
                    </span>
                    <span
                        style={{
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 500,
                            fontSize: '8px',
                            lineHeight: '14px',
                            letterSpacing: '-0.4px',
                            color: '#757575'
                        }}
                    >
                        /month
                    </span>
                </div>
            </div>
        </div>
    );
};

const ProductCard = ({ product, index, isDesktop, handleAddToCart }) => {
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const isWishlisted = useSelector(selectIsWishlisted(product.id));

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleWishlist(product));
    };

    // Figma lays out 4 cards of 285 + 3 gaps of 20 across a flush 1200 frame. The
    // container here is 1200 *minus* px-6, so the cards shrink to keep 4 per view.
    const CARD_W = 273;
    const CARD_H = 387;
    const HOVER_H = 446;
    const LIFT = 12;

    return (
        <div
            style={{ width: `${CARD_W}px`, height: `${CARD_H}px`, position: 'relative', flexShrink: 0, cursor: 'pointer', overflow: 'visible', zIndex: isHovered ? 50 : 1 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => router.push(`/products/${product.id}`)}
        >
            <motion.div
                animate={isHovered ? "hover" : "initial"}
                initial="initial"
                className="absolute left-0 right-0 bg-white flex flex-col overflow-hidden"
                style={{ top: 0, border: "1px solid hsla(0, 0%, 89%, 1)", borderRadius: "20px", backgroundColor: "hsla(0, 0%, 100%, 1)", willChange: "height, transform, box-shadow" }}
                variants={{
                    initial: { height: CARD_H, y: 0, boxShadow: "0px 1px 2px 0px hsla(0, 0%, 0%, 0.05)" },
                    hover: { height: HOVER_H, y: -LIFT, boxShadow: "0px 16px 32px -8px hsla(0, 0%, 0%, 0.14)", transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] } }
                }}
            >
                {/* Image Section */}
                <div className="relative bg-white flex items-center justify-center overflow-hidden shrink-0"
                    style={{ width: '100%', height: 282, borderRadius: "20px", borderBottom: "1px solid hsla(0, 0%, 93%, 1)", backgroundColor: isHovered ? "hsla(0,0%,98%,1)" : "hsla(0, 0%, 100%, 1)", transition: "background-color 0.4s" }}
                >
                    <div className="absolute z-20 flex items-center" style={{ top: "14.57px", left: "14.49px", gap: "4px" }}>
                        <span className="rounded-full flex items-center justify-center shrink-0"
                            style={{ background: "#ed2115", color: "#fff2f1", fontFamily: "'Mona Sans', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "-0.4px", lineHeight: "16px", padding: "4px 10px", borderRadius: "27px", boxShadow: "0px 3px 1px rgba(120,120,120,0.05), 0px 1px 0.5px rgba(120,120,120,0.09), 0px 0px 0.5px rgba(120,120,120,0.1)" }}>
                            -20% off
                        </span>
                        {product.isNew && (
                            <span className="rounded-full flex items-center justify-center shrink-0"
                                style={{ backgroundColor: "#00b505", color: "#e8ffe4", fontFamily: "'Mona Sans', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "-0.4px", lineHeight: "16px", padding: "4px 10px", borderRadius: "27px", boxShadow: "0px 3px 1px rgba(120,120,120,0.05), 0px 1px 0.5px rgba(120,120,120,0.09), 0px 0px 0.5px rgba(120,120,120,0.1)" }}>
                                New
                            </span>
                        )}
                    </div>
                    <button className="absolute z-20 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-300"
                        style={{ width: "33px", height: "33px", top: "10.57px", right: "12.51px", backgroundColor: "#F6F6F6", border: "1px solid #EEEEEE", borderRadius: "100%" }}
                        onClick={handleToggleWishlist}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                        aria-pressed={isWishlisted}>
                        <Heart size={21} weight={isWishlisted ? "fill" : "regular"} color={isWishlisted ? "#ED2115" : "#000000"} />
                    </button>
                    {/* Fixed inset frame: every product image gets the same box and the same
                        breathing room, whatever aspect ratio was uploaded. */}
                    <div className="absolute inset-0 flex items-center justify-center" style={{ padding: '26px 10px 10px' }}>
                        <motion.img variants={{ initial: { scale: 1 }, hover: { scale: 1.05 } }} src={product.image} alt={product.name} className="max-w-full max-h-full object-contain object-center transition-transform duration-700 ease-out" />
                    </div>
                </div>
                {/* Text Section */}
                <div className="flex flex-col relative font-manrope bg-white" style={{ width: '100%', padding: '8px 12px 12px', gap: '8px' }}>
                    <h3 className="font-manrope line-clamp-1 shrink-0" style={{ fontSize: "18px", fontWeight: 600, lineHeight: "25px", letterSpacing: "-0.4px", color: "hsla(0, 0%, 16%, 1)" }}>{product.name}</h3>
                    <div className="flex items-center justify-between shrink-0" style={{ height: "16px" }}>
                        <div className="flex items-center gap-1">
                            <div className="flex text-[#FF9500]">{[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} weight="fill" className={s <= Math.round(product.rating || 4) ? "" : "opacity-20"} />)}</div>
                            <span className="ml-1" style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: "11px", fontWeight: 500, color: "hsla(0, 0%, 33%, 1)", letterSpacing: "-0.01em" }}>{product.rating || "4.5"} ({product.reviews || 12})</span>
                        </div>
                        <div className="flex items-center gap-1.5" style={{ color: "hsla(0, 0%, 65%, 1)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[16px] h-[16px]"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                            <span style={{ fontSize: "12px", fontWeight: 400, letterSpacing: "-0.04em" }}>2-4 days</span>
                        </div>
                    </div>
                    <div className="flex items-center shrink-0" style={{ gap: "3px" }}>
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: "12px", fontWeight: 500, color: "#000", letterSpacing: "-0.4px" }}>from</span>
                        {product.originalPrice && (<span className="line-through decoration-[1.5px]" style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: "16px", fontWeight: 600, color: "hsla(0, 0%, 46%, 1)", letterSpacing: "-0.4px" }}>₹{product.originalPrice}</span>)}
                        <span className="font-bold ml-1" style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: "21px", fontWeight: 600, color: "#ff2c20", letterSpacing: "-0.8px" }}>₹{product.rentPrice}</span>
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: "12px", fontWeight: 500, color: "hsla(0, 0%, 46%, 1)", letterSpacing: "-0.4px", marginLeft: "2px" }}>/month</span>
                    </div>
                    <div style={{ overflow: 'hidden', height: isHovered ? '43px' : '0px', opacity: isHovered ? 1 : 0, marginTop: isHovered ? 0 : '-8px', transition: 'height 0.28s ease, opacity 0.2s ease, margin-top 0.28s ease', display: 'flex', alignItems: 'flex-end' }}>
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(e, product); }} className="btn-primary w-full text-[14px] active:scale-95" style={{ height: '38px', borderRadius: '100px', flexShrink: 0, fontFamily: "'Mona Sans', sans-serif", fontWeight: 500, color: 'hsla(0, 0%, 12%, 1)' }}>Rent Now</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};


import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Scrollbar } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

// Card + gap are fixed by the design, so the track is snapped to a whole number of
// them instead of resizing cards.
const SLIDE_W = 273;
const SLIDE_GAP = 20;

// titleOverride / productIdsOverride let a host page (e.g. the product page) drive
// this section from its own CMS document instead of the homepage's.
const BestRentedProducts =({ type = "bestRented", defaultTitle = "Curated Products", customProducts = null, titleOverride = null, productIdsOverride = null }) => {
    const [isDesktop, setIsDesktop] = useState(false);
    const [trackBoundsRef, trackWidth, perView] = useWholeCardTrack(SLIDE_W, SLIDE_GAP);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const checkRes = () => setIsDesktop(window.innerWidth >= 1024);
        checkRes();
        window.addEventListener('resize', checkRes);
        return () => window.removeEventListener('resize', checkRes);
    }, []);
    const [products, setProducts] = useState([]);
    const [addedStatus, setAddedStatus] = useState({});
    const [cmsConfig, setCmsConfig] = useState({
        enabled: true,
        title: defaultTitle,
        productIds: []
    });
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const fetchCMSAndProducts = async () => {
            try {
                const cmsRes = await fetch(`${API}/api/cms/homepage`);
                let isEnabled = true;
                let finalTitle = defaultTitle;
                let targetIds = [];

                if (cmsRes.ok) {
                    const cmsData = await cmsRes.json();
                    if (type === "bestRented") {
                        isEnabled = cmsData.bestRentedEnabled !== false;
                        finalTitle = cmsData.bestRentedTitle || "Best Rented Products";
                        targetIds = cmsData.bestRentedProductIds || [];
                    } else if (type === "newLaunches") {
                        isEnabled = cmsData.newLaunchEnabled !== false;
                        finalTitle = cmsData.newLaunchTitle || "New Launches This Week";
                        targetIds = cmsData.newLaunchProductIds || [];
                    }
                }

                if (titleOverride) finalTitle = titleOverride;
                if (productIdsOverride && productIdsOverride.length > 0) targetIds = productIdsOverride;

                setCmsConfig({ enabled: isEnabled, title: finalTitle, productIds: targetIds });

                if (!isEnabled) {
                    setLoading(false);
                    return;
                }

                if (customProducts && customProducts.length > 0) {
                    const mappedProducts = customProducts.map(p => ({
                        id: p._id,
                        name: p.name,
                        category: p.category,
                        image: (p.images && p.images.length > 0) ? p.images[0] : "/images/placeholder.png",
                        rating: p.rating || 4.5,
                        reviews: p.numReviews || 12,
                        originalPrice: Math.round((p.rentalPrice || 0) * 1.5),
                        rentPrice: p.rentalPrice,
                        discount: p.discount || "20% off",
                        isNew: p.condition === 'New',
                        tags: ["Quality tested", "Deep Cleaned"],
                        statusTags: ["Like New", "In Stock"],
                    }));
                    setProducts(mappedProducts);
                    setLoading(false);
                    return;
                }

                let fetchedProducts = [];
                if (targetIds.length > 0) {
                    const prodPromises = targetIds.map(id => fetch(`${API}/api/products/${id}`).then(r => r.ok ? r.json() : null));
                    const responses = await Promise.all(prodPromises);
                    fetchedProducts = responses.filter(p => p !== null);
                } else {
                    const fallBackRes = await fetch(`${API}/api/products?limit=4`);
                    if (fallBackRes.ok) {
                        const fallbackData = await fallBackRes.json();
                        fetchedProducts = fallbackData.products || [];
                    }
                }

                const mappedProducts = fetchedProducts.map(p => ({
                    id: p._id,
                    name: p.name,
                    category: p.category,
                    image: (p.images && p.images.length > 0) ? p.images[0] : "/images/placeholder.png",
                    rating: p.rating || 4.5,
                    reviews: p.numReviews || 12,
                    originalPrice: Math.round((p.rentalPrice || 0) * 1.5),
                    rentPrice: p.rentalPrice,
                    discount: p.discount || "20% off",
                    isNew: p.condition === 'New',
                    tags: ["Quality tested", "Deep Cleaned"],
                    statusTags: ["Like New", "In Stock"],
                }));
                setProducts(mappedProducts);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch products or cms", error);
                setLoading(false);
            }
        };
        fetchCMSAndProducts();
    }, [type, defaultTitle, titleOverride, productIdsOverride]);

    if (loading) return <div className="h-48 w-full bg-slate-50 animate-pulse my-4" />;
    if (!cmsConfig.enabled) return null;

    // Use a unique selector suffix based on section type
    const sectionSuffix = type === 'bestRented' ? 'best' : 'launch';

    return (
        <section
            className="w-full overflow-visible bg-white py-10 lg:py-24"
        >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
                <div className="flex flex-col mb-[40px] max-w-[350px] md:max-w-none w-full mx-auto md:mx-0">
                    <div className="flex items-center justify-between">
                        <h2 className="font-manrope tracking-tight whitespace-nowrap text-[24px] md:text-[36px] font-semibold text-[#333] leading-tight md:leading-[48px]">
                            {cmsConfig.title}
                        </h2>
                        <Link
                            href="/products"
                            className="btn-primary hidden md:inline-flex gap-[2px] text-[14px]"
                        >
                            View All
                        </Link>
                    </div>
                </div>

                <div className="hidden md:block relative" ref={trackBoundsRef}>
                  <div style={{ width: trackWidth ? `${trackWidth}px` : '100%', margin: '0 auto' }}>
                    <Swiper
                        modules={[Navigation, Autoplay, Scrollbar]}
                        spaceBetween={SLIDE_GAP}
                        slidesPerView={'auto'}
                        // Explicit step, not slidesPerGroupAuto — every advance moves a
                        // whole page of cards, so the transform stays on a card boundary.
                        slidesPerGroup={perView}
                        // Needs a spare page to clone for a seamless wrap; under that
                        // Swiper silently falls back to stopping at the ends.
                        loop={products.length >= perView * 2}
                        navigation={{
                            nextEl: `.swiper-next-${sectionSuffix}`,
                            prevEl: `.swiper-prev-${sectionSuffix}`,
                        }}
                        scrollbar={{
                            el: `.swiper-scrollbar-${sectionSuffix}`,
                            draggable: true,
                            hide: false,
                        }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        className="!pt-6 !pb-[65px] -mt-6 -mb-[65px] !overflow-x-clip !overflow-y-visible"
                    >
                        {products.map((product, index) => (
                            <SwiperSlide key={product.id || index} style={{ width: `${SLIDE_W}px` }}>
                                <ProductCard
                                    product={product}
                                    index={index}
                                    isDesktop={isDesktop}
                                    handleAddToCart={handleAddToCart}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                  </div>

                    {/* Progress Bar & Navigation Arrows */}
                    <div className="flex items-center gap-6 mt-10">
                        <div
                            className={`swiper-scrollbar-${sectionSuffix} flex-1`}
                            style={{ height: '3.5px', position: 'relative' }}
                        />
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                className={`swiper-prev-${sectionSuffix} group w-[34px] h-[34px] rounded-[69px] flex items-center justify-center bg-[#eee] hover:bg-[hsla(0,0%,85%,1)] transition-all`}
                                style={{ boxShadow: '0px 8px 2px 0px rgba(133,133,133,0), 0px 5px 2px 0px rgba(133,133,133,0.01), 0px 3px 2px 0px rgba(133,133,133,0.05), 0px 1px 1px 0px rgba(133,133,133,0.09), 0px 0px 1px 0px rgba(133,133,133,0.1)' }}
                                aria-label="Previous"
                            >
                                <ChevronLeftIcon strokeWidth={2} className="w-6 h-6 text-[#1F1F1F] transition-colors duration-200" />
                            </button>
                            <button
                                className={`swiper-next-${sectionSuffix} group w-[34px] h-[34px] rounded-[69px] flex items-center justify-center bg-[#eee] hover:bg-[hsla(0,0%,85%,1)] transition-all`}
                                style={{ boxShadow: '0px 8px 2px 0px rgba(133,133,133,0), 0px 5px 2px 0px rgba(133,133,133,0.01), 0px 3px 2px 0px rgba(133,133,133,0.05), 0px 1px 1px 0px rgba(133,133,133,0.09), 0px 0px 1px 0px rgba(133,133,133,0.1)' }}
                                aria-label="Next"
                            >
                                <ChevronRightIcon strokeWidth={2} className="w-6 h-6 text-[#1F1F1F] transition-colors duration-200" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile View: horizontal swiper, 2 cards visible */}
                <div className="md:hidden">
                    <Swiper
                        modules={[Scrollbar]}
                        slidesPerView={2}
                        spaceBetween={12}
                        scrollbar={{ el: `.swiper-scrollbar-mob-${sectionSuffix}`, draggable: true, hide: false }}
                        className="!pb-[36px]"
                    >
                        {products.map((product, index) => (
                            <SwiperSlide key={product.id || index}>
                                <MobileProductCard product={product} handleAddToCart={handleAddToCart} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className={`swiper-scrollbar-mob-${sectionSuffix} w-full`} style={{ height: '3px' }} />
                </div>

                <div className="mt-6 flex justify-center md:hidden">
                    <Link href="/products" className="btn-primary text-[14px] px-8">
                        View All
                    </Link>
                </div>
            </div>

            <style>{`
                .swiper-scrollbar-mob-${sectionSuffix} {
                    background: hsla(0, 0%, 20%, 0.12) !important;
                    border-radius: 0 !important;
                    height: 3px !important;
                    overflow: hidden;
                    position: relative;
                }
                .swiper-scrollbar-mob-${sectionSuffix} .swiper-scrollbar-drag {
                    background: hsla(0, 0%, 20%, 1) !important;
                    border-radius: 0 !important;
                    height: 100% !important;
                }
                .swiper-scrollbar-${sectionSuffix} {
                    background: hsla(0, 0%, 20%, 0.12) !important;
                    border-radius: 0 !important;
                    height: 3.5px !important;
                    overflow: hidden;
                    position: relative;
                }
                .swiper-scrollbar-${sectionSuffix} .swiper-scrollbar-drag {
                    background: hsla(0, 0%, 20%, 1) !important;
                    border-radius: 0 !important;
                    height: 100% !important;
                }
                .swiper-prev-${sectionSuffix}.swiper-button-disabled,
                .swiper-next-${sectionSuffix}.swiper-button-disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                    pointer-events: none;
                }
            `}</style>
        </section>
    );
};

export default BestRentedProducts;