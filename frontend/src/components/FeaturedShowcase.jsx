"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Truck, Info } from '@phosphor-icons/react';
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/features/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../redux/features/wishlistSlice';
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

// ─── Mobile Featured Card ───────────────────────────────────────────────────
const MobileFeaturedCard = ({ banner }) => {
    const router = useRouter();
    return (
        <div
            onClick={() => router.push(banner?.href || "/products")}
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
                        router.push(banner?.href || "/products");
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
const BannerCarousel = ({ banners, current, setCurrent, height = "387px", productImage, isDesktop }) => {
    const [direction, setDirection] = useState(1);
    const [failedImages, setFailedImages] = useState(new Set());
    const router = useRouter();

    const go = useCallback((dir, event) => {
        if (event) { event.preventDefault(); event.stopPropagation(); }
        setDirection(dir);
        setCurrent(prev => (prev + dir + banners.length) % banners.length);
    }, [banners.length, setCurrent]);

    useEffect(() => {
        const t = setInterval(() => go(1), 8000);
        return () => clearInterval(t);
    }, [go]);

    const slide = banners[current];
    const displayImage = slide.image || productImage;

    if (isDesktop === false) {
        return <MobileFeaturedCard banner={slide} />;
    }

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
                    className="absolute inset-0 cursor-pointer"
                    style={{ background: slide.bg || "#F5F5F7" }}
                    onClick={() => router.push(slide.href || "/products")}
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
                                onClick={(e) => go(-1, e)}
                                className="group flex items-center justify-center rounded-full bg-[hsla(0,0%,96%,1)] hover:bg-[hsla(0,0%,85%,1)] hover:scale-110 transition-all duration-200 shrink-0"
                                style={{ width: "24px", height: "24px", padding: "2.25px" }}
                            >
                                <ChevronLeftIcon strokeWidth={2.5} className="w-[19.5px] h-[19.5px] text-[#1D1D1F] group-hover:text-[#1D1D1F] transition-colors duration-200" />
                            </button>
                            <h3 className="text-white text-[24px] font-bold tracking-tight text-center" style={{ fontFamily: "'Mona Sans', sans-serif" }}>
                                {slide.title}
                            </h3>
                            <button
                                onClick={(e) => go(1, e)}
                                className="group flex items-center justify-center rounded-full bg-[hsla(0,0%,96%,1)] hover:bg-[hsla(0,0%,85%,1)] hover:scale-110 transition-all duration-200 shrink-0"
                                style={{ width: "24px", height: "24px", padding: "2.25px" }}
                            >
                                <ChevronRightIcon strokeWidth={2.5} className="w-[19.5px] h-[19.5px] text-[#1D1D1F] group-hover:text-[#1D1D1F] transition-colors duration-200" />
                            </button>
                        </div>
                        <p className="text-white/80 text-[14px] font-medium leading-tight text-center">
                            {slide.subtitle}
                        </p>
                        <div className="flex justify-center gap-1.5">
                            {banners.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDirection(i > current ? 1 : -1); setCurrent(i); }}
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
    const dispatch = useDispatch();
    const isWishlisted = useSelector(selectIsWishlisted(product.id));

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleWishlist(product));
    };

    if (!isDesktop) {
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
    }

    const CARD_W = 285;
    const CARD_H = 387;
    const HOVER_H = 440;
    const LIFT = 12;

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
                    className="relative bg-white w-full flex items-center justify-center overflow-hidden shrink-0"
                    style={{
                        height: 282,
                        borderRadius: "20px",
                        borderBottom: "1px solid hsla(0, 0%, 93%, 1)",
                        backgroundColor: isHovered ? "hsla(0,0%,98%,1)" : "hsla(0, 0%, 100%, 1)",
                        transition: "background-color 0.4s",
                        boxShadow: "0px 4px 8px 0px hsla(0, 0%, 87%, 0.1)",
                    }}
                >
                    <div className="absolute z-20 flex items-center" style={{ top: "14.57px", left: "14.49px", gap: "4px" }}>
                        <span className="text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0"
                            style={{ height: "24px", background: "hsla(3, 86%, 51%, 1)", fontFamily: "'Mona Sans', sans-serif", fontSize: "10px", fontWeight: 600, paddingLeft: "10px", paddingRight: "10px", borderRadius: "27px" }}>
                            -20% off
                        </span>
                        {product.isNew && (
                            <span className="text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0"
                                style={{ height: "24px", paddingLeft: "10px", paddingRight: "10px", backgroundColor: "hsla(122, 100%, 35%, 1)", fontFamily: "'Mona Sans', sans-serif", fontSize: "10px", fontWeight: 600, borderRadius: "27px" }}>
                                New
                            </span>
                        )}
                    </div>

                    <button
                        className="absolute z-20 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-300"
                        style={{ width: "33px", height: "33px", top: "10.57px", right: "12.51px", backgroundColor: "#F6F6F6", border: "1px solid #EEEEEE", borderRadius: "100%" }}
                        onClick={handleToggleWishlist}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                        aria-pressed={isWishlisted}
                    >
                        <Heart size={21} weight={isWishlisted ? "fill" : "regular"} color={isWishlisted ? "#ED2115" : "#000000"} />
                    </button>

                    <div className="absolute inset-0 overflow-hidden">
                        <motion.img
                            variants={{ initial: { scale: 1 }, hover: { scale: 1.05 } }}
                            src={product.image}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out"
                        />
                    </div>
                </div>

                {/* Text Section */}
                <div
                    className="flex flex-col relative font-manrope bg-white"
                    style={{
                        width: '285px',
                        padding: '8px 12px 12px',
                        gap: '8px',
                    }}
                >
                    <h3 className="font-manrope line-clamp-1 shrink-0"
                        style={{ fontSize: "18px", fontWeight: 600, lineHeight: "25px", letterSpacing: "-0.4px", color: isHovered ? 'hsla(3, 100%, 56%, 1)' : "hsla(0, 0%, 16%, 1)", transition: 'color 0.3s' }}>
                        {product.name}
                    </h3>

                    <div className="flex items-center justify-between shrink-0" style={{ height: "16px" }}>
                        <div className="flex items-center gap-1">
                            <div className="flex text-[#FF9500]">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} weight="fill" className={s <= Math.round(product.rating || 4) ? "" : "opacity-20"} />)}
                            </div>
                            <span className="ml-1" style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: "11px", fontWeight: 500, color: "hsla(0, 0%, 33%, 1)", letterSpacing: "-0.01em" }}>
                                {product.rating || "4.5"} ({product.reviews || 12})
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5" style={{ color: "hsla(0, 0%, 65%, 1)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[16px] h-[16px]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                            <span style={{ fontSize: "12px", fontWeight: 400, letterSpacing: "-0.48px" }}>2-4 days</span>
                        </div>
                    </div>

                    <div className="flex items-center shrink-0" style={{ gap: "3px", marginTop: "-4px" }}>
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: "11px", fontWeight: 500, color: "hsla(0, 0%, 33%, 1)", letterSpacing: "-0.01em" }}>from</span>
                        {product.originalPrice && (
                            <span className="line-through decoration-[1.5px]" style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: "16px", fontWeight: 600, color: "hsla(0, 0%, 46%, 1)", letterSpacing: "-0.4px" }}>₹{product.originalPrice}</span>
                        )}
                        <span className="font-bold tracking-tight ml-1" style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: "26px", fontWeight: 600, color: "hsla(3, 100%, 56%, 1)", letterSpacing: "-0.04em" }}>₹{product.rentPrice}</span>
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: "11px", fontWeight: 500, color: "hsla(0, 0%, 46%, 1)", letterSpacing: "-0.01em", marginLeft: "2px" }}>/month</span>
                    </div>

                    {/* Rent Now — slides in as card grows downward */}
                    <div style={{ overflow: 'hidden', height: isHovered ? '43px' : '0px', opacity: isHovered ? 1 : 0, transition: 'height 0.28s ease, opacity 0.2s ease', display: 'flex', alignItems: 'flex-end' }}>
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(e, product); }}
                            className="btn-primary w-full text-[14px] active:scale-95"
                            style={{ height: '38px', borderRadius: '100px', flexShrink: 0 }}
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
    const [cms, setCms] = useState(null); // null = still loading CMS
    const [pinnedProductIds, setPinnedProductIds] = useState([]);
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
                const res = await fetch(`${API}/api/cms/homepage`);
                if (res.ok) {
                    const d = await res.json();
                    const banners = d.featuredShowcaseBanners?.length
                        ? d.featuredShowcaseBanners
                        : FALLBACK_BANNERS;
                    setCms({
                        enabled: d.featuredShowcaseEnabled !== false,
                        banners,
                    });
                    setPinnedProductIds(d.featuredShowcaseProductIds || []);
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
        }));
    };

    // Load products — pinned IDs take priority, then fall back to category/general
    useEffect(() => {
        if (!cms) return;

        const loadProducts = async () => {
            try {
                let fetchedProducts = [];

                if (pinnedProductIds.length >= 2) {
                    // Fetch the two pinned products by ID
                    const results = await Promise.all(
                        pinnedProductIds.slice(0, 2).map(id =>
                            fetch(`${API}/api/products/${id}`).then(r => r.ok ? r.json() : null).catch(() => null)
                        )
                    );
                    fetchedProducts = results.filter(Boolean);
                }

                if (fetchedProducts.length < 2) {
                    const activeCategory = cms.banners[currentBanner]?.category;
                    let url = activeCategory
                        ? `${API}/api/products?category=${activeCategory}&limit=2`
                        : `${API}/api/products?limit=2`;

                    let res = await fetch(url).catch(() => ({ ok: false }));
                    let data = res.ok ? await res.json() : { products: [] };

                    if (data.products?.length === 0 && activeCategory) {
                        const fallbackRes = await fetch(`${API}/api/products?limit=2`).catch(() => ({ ok: false }));
                        if (fallbackRes.ok) data = await fallbackRes.json();
                    }
                    fetchedProducts = data.products || [];
                }

                setProducts(fetchedProducts.map(p => ({
                    id: p._id,
                    name: p.name,
                    image: p.images?.[0] || "/images/placeholder.png",
                    rating: p.rating || 4.5,
                    reviews: p.numReviews || 12,
                    originalPrice: p.rentalPrice ? Math.round(p.rentalPrice * 1.5) : 8999,
                    rentPrice: p.rentalPrice || 5000,
                    isNew: p.isNew || false,
                })));
            } catch (err) {
                console.error("Showcase fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [currentBanner, cms, pinnedProductIds]);

    // Still fetching CMS or products
    if (!cms || loading) return null;

    // Hidden by admin toggle
    if (!cms.enabled) return null;

    return (
        <section className={`bg-white ${isDesktop ? 'py-24' : 'py-6'} overflow-hidden`}>

            <div className={`max-w-[1200px] mx-auto ${isDesktop ? 'px-4 sm:px-6' : 'px-0'}`}>

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
                            isDesktop={isDesktop}
                        />
                    </div>

                </div>

            </div>
        </section>
    );
};
export default FeaturedShowcase;