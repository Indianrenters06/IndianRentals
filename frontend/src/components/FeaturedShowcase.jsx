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
        href: "/categories/apple",
        bg: "linear-gradient(135deg, #1f1435 0%, #3b2069 45%, #6a3ea1 80%, #9055d4 100%)",
        category: "MacBook"
    },
    {
        title: "Gaming Laptops",
        subtitle: "ASUS ROG | Lenovo Legion | MSI | HP Omen",
        image: DEFAULT_CATEGORY_IMAGES.gaming,
        href: "/categories/gaming",
        bg: "linear-gradient(135deg, #070d18 0%, #0d2238 45%, #133c5e 80%, #1c5f8a 100%)",
        category: "Gaming"
    },
    {
        title: "Smart Devices",
        subtitle: "Tablets | Smartwatches | Earbuds | Accessories",
        image: DEFAULT_CATEGORY_IMAGES.smart,
        href: "/categories/smart-devices",
        bg: "linear-gradient(135deg, #0b1a14 0%, #153326 45%, #1f523c 80%, #2b7756 100%)",
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
const BannerCarousel = ({ banners = [], current, setCurrent, isDesktop }) => {
    const [direction, setDirection] = useState(1);
    const router = useRouter();

    const go = useCallback((dir, event) => {
        if (event) { event.preventDefault(); event.stopPropagation(); }
        if (!banners.length) return;
        setDirection(dir);
        setCurrent(prev => (prev + dir + banners.length) % banners.length);
    }, [banners.length, setCurrent]);

    useEffect(() => {
        if (!banners.length) return;
        const t = setInterval(() => go(1), 8000);
        return () => clearInterval(t);
    }, [go, banners.length]);

    if (!banners.length) return null;

    const slide = banners[current] || banners[0];
    const displayImage = getSlideImage(slide);

    return (
        <div
            className={`relative overflow-hidden w-full select-none ${isDesktop ? '' : 'shadow-xl'}`}
            style={{
                height: '387px',
                borderRadius: '20px'
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
                    style={{ background: slide.bg || "linear-gradient(135deg, #111827 0%, #1f2937 100%)" }}
                    onClick={() => router.push(slide.href || "/products")}
                >
                    {/* Full-bleed banner imagery */}
                    {displayImage && (
                        <motion.img
                            key={displayImage}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.55, ease: "easeOut" }}
                            src={displayImage}
                            alt={slide.title || "Featured Banner"}
                            className="absolute inset-0 w-full h-full object-cover object-center z-0"
                            style={{ pointerEvents: 'none' }}
                        />
                    )}

                    {/* Gradient overlay for readability */}
                    <div
                        className="absolute inset-0 z-10 pointer-events-none"
                        style={{
                            background: isDesktop
                                ? 'linear-gradient(180.44deg, rgba(0, 0, 0, 0) 52.71%, rgba(0, 0, 0, 0.8) 86.37%)'
                                : 'linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.45) 45%, rgba(0, 0, 0, 0.88) 100%)'
                        }}
                    />

                    {/* Floating Side Navigation Arrows */}
                    {!isDesktop && <div className="absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-4 pointer-events-none">
                        <button
                            type="button"
                            onClick={(e) => go(-1, e)}
                            aria-label="Previous slide"
                            className="pointer-events-auto flex items-center justify-center rounded-full bg-black/35 hover:bg-black/65 backdrop-blur-md border border-white/20 text-white hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg"
                            style={{ width: "36px", height: "36px" }}
                        >
                            <ChevronLeftIcon strokeWidth={2.5} className="w-5 h-5 text-white" />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => go(1, e)}
                            aria-label="Next slide"
                            className="pointer-events-auto flex items-center justify-center rounded-full bg-black/35 hover:bg-black/65 backdrop-blur-md border border-white/20 text-white hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg"
                            style={{ width: "36px", height: "36px" }}
                        >
                            <ChevronRightIcon strokeWidth={2.5} className="w-5 h-5 text-white" />
                        </button>
                    </div>}

                    {/* Desktop — Figma: 31/30px padding, title row (24px circle arrows, 12px gap,
                        27/35 semibold white), 21/28 #CBCBCB subtitle, 10px to 4px dots + 6px ring */}
                    {isDesktop && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-end gap-[10px] px-[31px] py-[30px] text-center">
                            <div className="flex flex-col items-center gap-2 w-full">
                                <div className="flex items-center gap-3">
                                    <button type="button" onClick={(e) => go(-1, e)} aria-label="Previous slide" className="shrink-0 cursor-pointer">
                                        <img src="/icons/circle-chevron-left.svg" alt="" width={24} height={24} />
                                    </button>
                                    <h3 className="m-0 text-white font-semibold text-[27px] leading-[35px] tracking-[-0.8px] whitespace-nowrap" style={{ fontFamily: "'Mona Sans', sans-serif" }}>
                                        {slide.title}
                                    </h3>
                                    <button type="button" onClick={(e) => go(1, e)} aria-label="Next slide" className="shrink-0 cursor-pointer">
                                        <img src="/icons/circle-chevron-right.svg" alt="" width={24} height={24} />
                                    </button>
                                </div>
                                <p className="m-0 text-[#CBCBCB] font-normal text-[21px] leading-[28px] tracking-[-0.8px]" style={{ fontFamily: "'Mona Sans', sans-serif" }}>
                                    {slide.subtitle}
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-2 h-5 w-[60px]">
                                {banners.map((_, i) => (
                                    <button
                                        key={i}
                                        aria-label={`Go to slide ${i + 1}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setDirection(i > current ? 1 : -1);
                                            setCurrent(i);
                                        }}
                                        className={`rounded-full ${i === current ? 'w-1.5 h-1.5 border-[1.2px] border-white' : 'w-1 h-1 bg-white'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Banner Content: positioned cleanly in lower half */}
                    {!isDesktop && <div
                        className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center text-center pb-6 px-6 sm:px-8 pointer-events-none"
                        style={{ gap: '8px' }}
                    >
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-sm">
                            Featured Collection
                        </span>

                        <h3
                            className="text-white text-[24px] sm:text-[28px] font-bold tracking-tight text-center leading-tight drop-shadow-md"
                            style={{ fontFamily: "'Mona Sans', sans-serif" }}
                        >
                            {slide.title}
                        </h3>

                        <p className="text-white/90 text-[13px] sm:text-[14px] font-medium leading-normal max-w-[90%] text-center drop-shadow">
                            {slide.subtitle}
                        </p>

                        {/* CTA Explore Button */}
                        <div className="pt-1 pointer-events-auto">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(slide.href || "/products");
                                }}
                                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-white text-gray-900 text-xs font-bold shadow-md hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-200"
                            >
                                Explore Category &rarr;
                            </button>
                        </div>

                        {/* Dots Indicator */}
                        <div className="flex justify-center items-center gap-1.5 pt-2 pointer-events-auto">
                            {banners.map((_, i) => (
                                <button
                                    key={i}
                                    aria-label={`Go to slide ${i + 1}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setDirection(i > current ? 1 : -1);
                                        setCurrent(i);
                                    }}
                                    className={`transition-all duration-300 rounded-full h-1.5 ${i === current ? "w-6 bg-white shadow-sm" : "w-1.5 bg-white/40 hover:bg-white/75"}`}
                                />
                            ))}
                        </div>
                    </div>}
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

    const CARD_W = 281; // Figma PRODUCT CARD v2 in this section
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
                        <span className="rounded-full flex items-center justify-center shrink-0"
                            style={{ background: "#ED2115", color: "#FFF2F1", fontFamily: "'Mona Sans', sans-serif", fontSize: "12px", lineHeight: "16px", letterSpacing: "-0.4px", fontWeight: 600, padding: "4px 10px", borderRadius: "27px" }}>
                            -20% off
                        </span>
                        {product.isNew && (
                            <span className="rounded-full flex items-center justify-center shrink-0"
                                style={{ backgroundColor: "#00B505", color: "#E8FFE4", fontFamily: "'Mona Sans', sans-serif", fontSize: "12px", lineHeight: "16px", letterSpacing: "-0.4px", fontWeight: 600, padding: "4px 10px", borderRadius: "27px" }}>
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
                        width: '100%',
                        padding: '8px 12px 12px',
                        gap: '8px',
                    }}
                >
                    <h3 className="line-clamp-1 shrink-0"
                        style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: "18px", fontWeight: 600, lineHeight: "25px", letterSpacing: "-0.8px", color: isHovered ? 'hsla(3, 100%, 56%, 1)' : "#292929", transition: 'color 0.3s' }}>
                        {product.name}
                    </h3>

                    <div className="flex items-center justify-between shrink-0" style={{ height: "16px" }}>
                        <div className="flex items-center justify-between" style={{ width: "128px" }}>
                            <div className="flex items-center" style={{ gap: "2px" }}>
                                {[1, 2, 3, 4, 5].map(s => <img key={s} src="/icons/product-star.svg" alt="" width={16} height={16} className={s <= Math.round(product.rating || 4) ? "" : "opacity-20"} />)}
                            </div>
                            <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: "12px", lineHeight: "16px", fontWeight: 500, color: "#545454", letterSpacing: "-0.4px" }}>
                                {product.rating || "4.5"} ({product.reviews || 12})
                            </span>
                        </div>
                        <div className="flex items-center" style={{ gap: "4px" }}>
                            <img src="/icons/delivery-truck.svg" alt="" width={16} height={16} />
                            <span className="font-manrope" style={{ fontSize: "12px", lineHeight: 1.2, fontWeight: 500, letterSpacing: "-0.48px", color: "#AFAFAF" }}>2-4 days</span>
                        </div>
                    </div>

                    <div className="flex items-center shrink-0" style={{ gap: "3px" }}>
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: "12px", lineHeight: "16px", fontWeight: 500, color: "#000000", letterSpacing: "-0.4px" }}>from</span>
                        {product.originalPrice && (
                            <span className="line-through" style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: "16px", lineHeight: "23px", fontWeight: 600, color: "#757575", letterSpacing: "-0.4px" }}>₹{product.originalPrice}</span>
                        )}
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: "21px", lineHeight: "28px", fontWeight: 600, color: "#FF2C20", letterSpacing: "-0.8px" }}>₹{product.rentPrice}</span>
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: "12px", lineHeight: "16px", fontWeight: 500, color: "#757575", letterSpacing: "-0.4px" }}>/month</span>
                    </div>

                    {/* Rent Now — slides in as card grows downward */}
                    <div style={{ overflow: 'hidden', height: isHovered ? '40px' : '0px', opacity: isHovered ? 1 : 0, transition: 'height 0.28s ease, opacity 0.2s ease', display: 'flex', alignItems: 'flex-end' }}>
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(e, product); }}
                            className="mx-auto flex items-center justify-center bg-transparent text-[#141414] hover:bg-[#141414] hover:text-white transition-colors active:scale-95"
                            style={{ width: '244px', maxWidth: '100%', height: '35px', borderRadius: '28px', border: '1px solid #141414', flexShrink: 0, fontFamily: "'Mona Sans', sans-serif", fontSize: '16px', lineHeight: '23px', fontWeight: 500, letterSpacing: '-0.4px' }}
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
            sourceUrl: `/products/${product.id}`
        }));
    };

    // Load products — pinned IDs take priority, then fall back to general products
    useEffect(() => {
        if (!cms) return;

        let isCancelled = false;

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
                    let res = await fetch(`${API}/api/products?limit=6`).catch(() => ({ ok: false }));
                    let data = res.ok ? await res.json() : { products: [] };
                    const fallbackList = data.products || [];
                    const needed = 2 - fetchedProducts.length;
                    const existingIds = new Set(fetchedProducts.map(p => p._id));
                    const extra = fallbackList.filter(p => !existingIds.has(p._id)).slice(0, needed);
                    fetchedProducts = [...fetchedProducts, ...extra];
                }

                if (!isCancelled) {
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
                }
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
    }, [cms?.enabled, JSON.stringify(pinnedProductIds)]);

    // Still fetching CMS or products
    if (!cms || loading) return null;

    // Hidden by admin toggle
    if (!cms.enabled) return null;

    return (
        <section className={`bg-white ${isDesktop ? 'py-24' : 'py-6'} overflow-hidden`}>

            <div className={`max-w-[1200px] mx-auto ${isDesktop ? 'px-4 sm:px-6 xl:px-0' : 'px-0'}`}>

                <div
                    className="flex flex-col lg:flex-row items-stretch"
                    style={{ gap: isDesktop ? "30px" : "20px" }}
                >

                    {/* Left */}
                    <div className="flex flex-col md:flex-row items-stretch gap-6 lg:gap-5 transition-all duration-500">
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
                            isDesktop={isDesktop}
                        />
                    </div>

                </div>

            </div>
        </section>
    );
};
export default FeaturedShowcase;