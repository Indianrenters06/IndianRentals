"use client";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { API } from "@/services/apiConfig";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/* ─── Figma Spec ──────────────────────────────────────────────────────────
   outer section : full-width × 564px
   center slide  : 1200px (max) × 500px
   side slides   : 931px wide
   border-radius : rounded-[32px]
   gap           : 32px
─────────────────────────────────────────────────────────────────────────── */

const FALLBACK_SLIDES = [
    {
        title: "The Tech That Powers Your Ambition. On Demand.",
        subtitle: "Get the latest MacBooks, Workstations, Cameras, and more. Delivered to your door with flexible monthly plans. Upgrade your toolkit, not your expenses.",
        image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png",
        bgColor: "#01A6EE",
        bgGradient: "linear-gradient(100.45deg, #01A6EE 10.43%, #38BDF8 92.63%)",
        textColor: "#FFFFFF",
        ctaText: "Rent Now",
        ctaLink: "/store",
    },
    {
        title: "Work Seamlessly From Anywhere.",
        subtitle: "Rent enterprise-grade laptops without upfront capital. Zero maintenance.",
        image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png",
        bgColor: "#FABC2D",
        bgGradient: "linear-gradient(100.45deg, #FABC2D 10.43%, #FDE047 92.63%)",
        textColor: "#FFFFFF",
        ctaText: "Explore Laptops",
        ctaLink: "/store",
    },
    {
        title: "Capture Every Detail with Precision.",
        subtitle: "Rent high-end DSLR cameras and lenses for your next creative project.",
        image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png",
        bgColor: "#0075ff",
        bgGradient: "linear-gradient(100.45deg, #0075ff 10.43%, #38BDF8 92.63%)",
        textColor: "#FFFFFF",
        ctaText: "Rent Cameras",
        ctaLink: "/store",
    },
    {
        title: "Powerful Servers for Scale.",
        subtitle: "High-performance servers and networking gear on a budget.",
        image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png",
        bgColor: "#ff5e62",
        bgGradient: "linear-gradient(100.45deg, #ff5e62 10.43%, #ff9966 92.63%)",
        textColor: "#FFFFFF",
        ctaText: "Get Servers",
        ctaLink: "/store",
    },
];

const Hero = () => {
    const [slides, setSlides] = useState(FALLBACK_SLIDES);
    const [heroVisible, setHeroVisible] = useState(true);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

    const desktopSwiperRef = useRef(null);
    const mobileSwiperRef = useRef(null);

    const GAP = 20;
    const [mainWidth, setMainWidth] = useState(1200);
    const [viewType, setViewType] = useState('desktop');

    useEffect(() => {
        const updateView = () => {
            const w = window.innerWidth;
            if (w >= 1024) setViewType('desktop');
            else if (w >= 768) setViewType('tablet');
            else setViewType('mobile');

            if (w < 1440) {
                setMainWidth(Math.min(1200, Math.round(w * 0.90)));
            } else {
                setMainWidth(1200);
            }
        };
        updateView();
        window.addEventListener('resize', updateView);
        return () => window.removeEventListener('resize', updateView);
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const r = await fetch(`${API}/api/cms/homepage`, { cache: "no-store" });
                if (!r.ok) return;
                const cms = await r.json();
                if (cms.heroEnabled === false) { setHeroVisible(false); return; }
                if (cms.heroSlides && cms.heroSlides.length > 0) setSlides(cms.heroSlides);
            } catch (e) { }
        })();
    }, []);

    const slideHeight = viewType === 'tablet' ? 332 : 500;
    const trackHeight = viewType === 'tablet' ? 332 : 510;

    const handlePrev = useCallback(() => {
        if (desktopSwiperRef.current) {
            desktopSwiperRef.current.slidePrev();
        }
    }, []);

    const handleNext = useCallback(() => {
        if (desktopSwiperRef.current) {
            desktopSwiperRef.current.slideNext();
        }
    }, []);

    const handleGoTo = useCallback((index) => {
        if (desktopSwiperRef.current) {
            desktopSwiperRef.current.slideToLoop(index);
        }
    }, []);

    if (!heroVisible) return null;

    return (
        <section className="w-full mx-auto gap-[10px] overflow-x-clip md:pt-8 md:pb-8 md:px-4" style={{ background: 'var(--color-grey-grey-50, hsla(0, 0%, 96%, 1))' }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                .hero-desktop-swiper {
                    overflow: visible !important;
                }
                .hero-desktop-swiper .swiper-wrapper {
                    align-items: center;
                }
                .hero-mobile-swiper {
                    overflow: visible !important;
                }
            `}} />

            {/* ── Mobile Hero ────────────────────────────────────────── */}
            <div className="block md:hidden w-full overflow-hidden" style={{ background: '#FFFFFF' }}>
                <div className="py-3 px-4">
                    <Swiper
                        modules={[Autoplay]}
                        slidesPerView={'auto'}
                        spaceBetween={10}
                        loop={slides.length > 1}
                        loopAdditionalSlides={2}
                        grabCursor={true}
                        speed={500}
                        autoplay={{
                            delay: 4500,
                            disableOnInteraction: false,
                        }}
                        onSwiper={(swiper) => {
                            mobileSwiperRef.current = swiper;
                            setMobileActiveIndex(swiper.realIndex);
                        }}
                        onSlideChange={(swiper) => {
                            setMobileActiveIndex(swiper.realIndex);
                        }}
                        className="w-full hero-mobile-swiper"
                    >
                        {slides.map((s, i) => {
                            const mobileImg = s.bgImage || s.image;
                            const mobileHref = s.ctaLink || s.slideLink || s.link || '/products';
                            const hasMobileText = Boolean(s.title && s.subtitle);

                            return (
                                <SwiperSlide
                                    key={i}
                                    style={{
                                        width: '216px',
                                        minWidth: '216px',
                                        height: '345px',
                                    }}
                                    className="shrink-0"
                                >
                                    <Link
                                        href={mobileHref}
                                        className="relative overflow-hidden block w-full h-full select-none"
                                        style={{
                                            boxSizing: 'border-box',
                                            width: '216px',
                                            minWidth: '216px',
                                            height: '345px',
                                            background: s.bgGradient || s.bgColor || 'linear-gradient(100.45deg, #01A6EE 10.43%, #38BDF8 92.63%)',
                                            borderRadius: '12px',
                                            display: 'block',
                                            flexShrink: 0
                                        }}
                                    >
                                        {/* Cover Background Image if provided */}
                                        {mobileImg && (
                                            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                                                <Image
                                                    src={mobileImg}
                                                    alt={s.title || "Hero banner"}
                                                    fill
                                                    unoptimized
                                                    className="object-cover object-center w-full h-full rounded-[12px]"
                                                />
                                                {hasMobileText && (
                                                    <div className="absolute inset-0 bg-black/40 rounded-[12px]" />
                                                )}
                                            </div>
                                        )}

                                        {/* Glow ellipse for slides without cover image */}
                                        {!mobileImg && (
                                            <div style={{
                                                position: 'absolute',
                                                width: '164px',
                                                height: '164px',
                                                right: '-40px',
                                                top: '40px',
                                                background: '#BAE6FD',
                                                filter: 'blur(97px)',
                                                pointerEvents: 'none',
                                                zIndex: 0
                                            }} />
                                        )}

                                        {/* Product image (foreground) if fallback slide */}
                                        {!mobileImg && s.image && (
                                            <div style={{
                                                position: 'absolute',
                                                width: '221px',
                                                height: '221px',
                                                left: '-6px',
                                                top: '0px',
                                                zIndex: 1,
                                                pointerEvents: 'none'
                                            }}>
                                                <Image
                                                    src={s.image || FALLBACK_SLIDES[0].image}
                                                    alt={s.title || ""}
                                                    fill
                                                    unoptimized
                                                    className="object-contain object-center"
                                                />
                                            </div>
                                        )}

                                        {/* Text block — bottom (only if title and subtitle are present) */}
                                        {hasMobileText && (
                                            <div style={{
                                                position: 'absolute',
                                                left: '13px',
                                                bottom: '16px',
                                                width: '193px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                gap: '4px',
                                                zIndex: 3
                                            }}>
                                                <p style={{
                                                    fontFamily: "'Mona Sans', sans-serif",
                                                    fontWeight: 600,
                                                    fontSize: '12px',
                                                    lineHeight: '18px',
                                                    letterSpacing: '-0.4px',
                                                    color: s.textColor || '#FFFFFF',
                                                    margin: 0,
                                                    width: '152px'
                                                }}>
                                                    {s.title}
                                                </p>
                                                <p style={{
                                                    fontFamily: "'Mona Sans', sans-serif",
                                                    fontWeight: 400,
                                                    fontSize: '8px',
                                                    lineHeight: '14px',
                                                    letterSpacing: '-0.4px',
                                                    color: s.textColor || '#FFFFFF',
                                                    margin: 0,
                                                    width: '193px'
                                                }}>
                                                    {s.subtitle}
                                                </p>

                                                {/* Yellow CTA button */}
                                                <div style={{
                                                    display: 'inline-flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: '2.42px 4.84px 2.42px 7.26px',
                                                    gap: '1.21px',
                                                    width: 'auto',
                                                    minWidth: '58px',
                                                    height: '18px',
                                                    background: '#FFCF46',
                                                    borderRadius: '17.41px',
                                                    marginTop: '4px'
                                                }}>
                                                    <span style={{
                                                        fontFamily: "'Mona Sans', sans-serif",
                                                        fontWeight: 800,
                                                        fontSize: '7.46px',
                                                        lineHeight: '8px',
                                                        letterSpacing: '-0.24px',
                                                        color: '#1F1F1F',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {s.ctaText || 'Rent Now'}
                                                    </span>
                                                    <svg width="9.68" height="9.68" viewBox="0 0 24 24" fill="none" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                                        <line x1="5" y1="12" x2="19" y2="12" />
                                                        <polyline points="12 5 19 12 12 19" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </Link>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>

                {/* Dot indicators */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '16px',
                    gap: '8px',
                    width: '100%'
                }}>
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            aria-label={`Go to slide ${i + 1}`}
                            onClick={() => mobileSwiperRef.current?.slideToLoop(i)}
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: i === mobileActiveIndex ? '#545454' : '#CBCBCB',
                                transition: 'background 0.3s',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Tablet / Desktop View */}
            <div
                className="hidden md:flex flex-col items-center w-full relative group"
                style={{
                    minHeight: viewType === 'tablet' ? '380px' : '530px',
                    paddingTop: viewType === 'tablet' ? '24px' : '0px',
                    paddingBottom: viewType === 'tablet' ? '24px' : '0px',
                    background: viewType === 'tablet'
                        ? 'radial-gradient(181.93% 64.7% at 50% 72.89%, #FFFFFF 0%, #D6F1FF 100%)'
                        : 'transparent'
                }}
            >
                <div
                    className="relative w-full flex items-center justify-center overflow-visible"
                    style={{ height: `${trackHeight}px` }}
                >
                    <Swiper
                        modules={[Navigation, Autoplay, Pagination]}
                        centeredSlides={true}
                        slidesPerView={'auto'}
                        spaceBetween={GAP}
                        loop={slides.length > 1}
                        loopAdditionalSlides={2}
                        slideToClickedSlide={true}
                        grabCursor={true}
                        speed={650}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        onSwiper={(swiper) => {
                            desktopSwiperRef.current = swiper;
                            setActiveSlideIndex(swiper.realIndex);
                        }}
                        onSlideChange={(swiper) => {
                            setActiveSlideIndex(swiper.realIndex);
                        }}
                        className="w-full hero-desktop-swiper !overflow-visible"
                        style={{ height: `${slideHeight}px` }}
                    >
                        {slides.map((s, idx) => (
                            <SwiperSlide
                                key={idx}
                                style={{
                                    width: `${mainWidth}px`,
                                    maxWidth: '90vw',
                                    height: `${slideHeight}px`,
                                }}
                                className="shrink-0 flex items-center justify-center select-none"
                            >
                                {({ isActive }) => (
                                    <SlideItem
                                        slide={s}
                                        width="100%"
                                        isActive={isActive}
                                        viewType={viewType}
                                        slideHeight={slideHeight}
                                    />
                                )}
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Arrows */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 flex items-center justify-between"
                        style={{ width: `${mainWidth + GAP + 60}px` }}
                    >
                        <button
                            type="button"
                            onClick={handlePrev}
                            aria-label="Previous slide"
                            style={{ boxShadow: '0px 8px 2px 0px rgba(133,133,133,0), 0px 5px 2px 0px rgba(133,133,133,0.01), 0px 3px 2px 0px rgba(133,133,133,0.05), 0px 1px 1px 0px rgba(133,133,133,0.09), 0px 0px 1px 0px rgba(133,133,133,0.1)' }}
                            className="pointer-events-auto w-[26px] h-[40px] rounded-[9px] flex items-center justify-center bg-[hsla(0,0%,93%,1)] hover:bg-[hsla(0,0%,85%,1)] active:scale-95 transition-all opacity-100 group/btn cursor-pointer"
                        >
                            <ChevronLeftIcon strokeWidth={2.5} className="w-5 h-5 text-gray-800 group-hover/btn:text-gray-900 transition-colors" />
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            aria-label="Next slide"
                            style={{ boxShadow: '0px 8px 2px 0px rgba(133,133,133,0), 0px 5px 2px 0px rgba(133,133,133,0.01), 0px 3px 2px 0px rgba(133,133,133,0.05), 0px 1px 1px 0px rgba(133,133,133,0.09), 0px 0px 1px 0px rgba(133,133,133,0.1)' }}
                            className="pointer-events-auto w-[26px] h-[40px] rounded-[9px] flex items-center justify-center bg-[hsla(0,0%,93%,1)] hover:bg-[hsla(0,0%,85%,1)] active:scale-95 transition-all opacity-100 group/btn cursor-pointer"
                        >
                            <ChevronRightIcon strokeWidth={2.5} className="w-5 h-5 text-gray-800 group-hover/btn:text-gray-900 transition-colors" />
                        </button>
                    </div>

                    {/* Slide Dots */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex justify-start" style={{ width: `${mainWidth}px` }}>
                        <div className="flex items-center gap-2 pointer-events-auto px-16">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    aria-label={`Go to slide ${i + 1}`}
                                    onClick={() => handleGoTo(i)}
                                    className={`transition-all duration-300 rounded-full cursor-pointer ${i === activeSlideIndex
                                        ? "w-[36px] h-[8px] bg-white shadow-md active:scale-95"
                                        : "w-[8px] h-[8px] bg-white/40 hover:bg-white/60 hover:scale-110 active:scale-90"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const SlideItem = ({ slide, isActive, width, viewType, slideHeight }) => {
    const isTablet = viewType === 'tablet';
    const bgPicture = slide.bgImage || slide.image;
    const isCustomCover = Boolean(bgPicture);
    const heroImg = slide.image || slide.bgImage || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png";
    const targetHref = slide.ctaLink || slide.slideLink || slide.link || "/products";
    const hasTextOverlay = Boolean(slide.title && slide.subtitle);

    const desktopContent = (
        <div className="w-full h-full relative overflow-hidden rounded-[24px]">
            {/* Cover Background Image (Cover-to-Cover) */}
            {isCustomCover && (
                <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden rounded-[24px]">
                    <Image
                        src={bgPicture}
                        alt={slide.title || "Hero Banner"}
                        fill
                        unoptimized
                        className="object-cover object-center w-full h-full"
                        priority={isActive}
                    />
                    {hasTextOverlay && (
                        <div
                            className="absolute inset-0 w-full h-full rounded-[24px]"
                            style={{
                                background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)'
                            }}
                        />
                    )}
                </div>
            )}

            {/* Left: Text - only displayed if both title & subtitle are configured */}
            {hasTextOverlay && (
                <div
                    className={`absolute z-10 transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0 blur-0' : 'opacity-30 -translate-y-4 blur-[1px]'}`}
                    style={{ left: '6.75%', top: '23%', width: '49.9%', color: slide.textColor || '#fff', display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                    <h1 style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: '47px', fontWeight: 600, lineHeight: '58px', letterSpacing: '-1.5px', maxWidth: '594px' }}>
                        {slide.title}
                    </h1>
                    <p style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: '18px', fontWeight: 600, lineHeight: '25px', letterSpacing: '-0.8px', maxWidth: '599px' }}>
                        {slide.subtitle}
                    </p>
                    {slide.ctaText && (
                        <div>
                            <div
                                className="btn-primary inline-flex shadow-lg"
                                style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 500, color: '#333333', fontSize: '16px', lineHeight: '23px' }}
                            >
                                {slide.ctaText.replace(/ [^\w\s]+.*$| [→➔➜]|^.*[→➔➜]$| \->/g, "").trim()}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Fallback styling for slides without custom banner image */}
            {!isCustomCover && (
                <>
                    <div
                        className="absolute rounded-full pointer-events-none"
                        style={{ left: '78.5%', top: '58.8%', width: '28.58%', aspectRatio: '1 / 1', background: '#BAE6FD', filter: 'blur(97px)', opacity: 0.75, zIndex: 0 }}
                    />
                    <div
                        className={`absolute transition-all duration-700 ${isActive ? 'opacity-100 scale-100 blur-0' : 'opacity-30 scale-90 blur-[1px]'}`}
                        style={{ left: '52.33%', top: '-2.6%', width: '45.17%', height: '108.4%', zIndex: 2 }}
                    >
                        <Image src={heroImg} alt={slide.title || ""} fill unoptimized className="object-contain object-center drop-shadow-[0_25px_25px_rgba(0,0,0,0.25)]" />
                    </div>
                </>
            )}
        </div>
    );

    const content = (
        <div className="w-full h-full relative overflow-hidden rounded-[24px]">
            {/* Cover Background Image (Cover-to-Cover) */}
            {isCustomCover && (
                <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden rounded-[24px]">
                    <Image
                        src={bgPicture}
                        alt={slide.title || "Hero Banner"}
                        fill
                        unoptimized
                        className="object-cover object-center w-full h-full"
                        priority={isActive}
                    />
                    {hasTextOverlay && (
                        <div className="absolute inset-0 bg-black/40 rounded-[24px]" />
                    )}
                </div>
            )}

            {/* Text only if title and subtitle are present */}
            {hasTextOverlay && (
                <div className="w-full h-full px-16 grid grid-cols-[1.2fr_0.8fr] gap-4 items-center relative z-10">
                    <div
                        className={`z-10 transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0 scale-100 blur-0' : 'opacity-30 -translate-y-4 scale-95 origin-left blur-[1px]'}`}
                        style={{ color: slide.textColor || "#fff", display: 'flex', flexDirection: 'column', gap: isTablet ? '8px' : '16px' }}
                    >
                        <h1
                            className="tracking-tight"
                            style={{
                                width: '100%',
                                maxWidth: isTablet ? '420px' : '480px',
                                fontFamily: "'Mona Sans', sans-serif",
                                fontSize: isTablet ? "32px" : "36px",
                                lineHeight: isTablet ? "38px" : "42px",
                                letterSpacing: "-0.01em",
                                fontWeight: 600,
                            }}
                        >
                            {slide.title}
                        </h1>
                        <p
                            className="leading-relaxed"
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontSize: isTablet ? "12px" : "14px",
                                fontWeight: 400,
                                maxWidth: isTablet ? "380px" : "520px",
                                lineHeight: isTablet ? "18px" : "22px",
                                letterSpacing: "-0.01em",
                            }}
                        >
                            {slide.subtitle}
                        </p>
                        {slide.ctaText && (
                            <div>
                                <div
                                    className={`btn-primary inline-flex shadow-lg ${isTablet ? 'px-8 py-2' : 'px-10 py-3'}`}
                                    style={{
                                        fontFamily: "'Mona Sans', sans-serif",
                                        fontWeight: 500,
                                        color: "#333333",
                                        fontSize: "14px",
                                        lineHeight: "23px"
                                    }}
                                >
                                    {slide.ctaText.replace(/ [^\w\s]+.*$| [→➔➜]|^.*[→➔➜]$| \->/g, "").trim()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Fallback image if no custom cover */}
            {!isCustomCover && (
                <div
                    className={`relative z-10 w-full flex flex-col items-center justify-end transition-all duration-700 ${isActive ? 'opacity-100 scale-105 blur-0' : 'opacity-30 scale-90 blur-[1px]'}`}
                    style={{ height: isTablet ? '280px' : '440px' }}
                >
                    <div
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            width: isTablet ? '230px' : '343px',
                            height: isTablet ? '230px' : '343px',
                            background: '#BAE6FD',
                            filter: 'blur(97px)',
                            opacity: 0.75,
                            bottom: isTablet ? '10px' : '40px',
                            zIndex: 0,
                        }}
                    />
                    <div className="relative w-full" style={{ height: isTablet ? '74%' : '76%', zIndex: 1 }}>
                        <Image
                            src={heroImg}
                            alt={slide.title || ""}
                            fill
                            unoptimized
                            className="object-contain object-bottom drop-shadow-[0_25px_25px_rgba(0,0,0,0.25)]"
                        />
                    </div>
                </div>
            )}
        </div>
    );

    const containerStyle = {
        width: width,
        minWidth: width,
        height: `${slideHeight}px`,
        background: slide.bgGradient || slide.bgColor || '#00A8FF',
        opacity: isActive ? 1 : 0.85,
        boxShadow: isActive ? '0 12px 24px -6px rgba(0,0,0,0.12)' : '0 4px 8px -2px rgba(0,0,0,0.06)',
        zIndex: isActive ? 20 : 10
    };

    return (
        <Link
            href={targetHref}
            className="shrink-0 relative rounded-[24px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer block"
            style={containerStyle}
        >
            {viewType === 'desktop' ? desktopContent : content}
        </Link>
    );
};

export default Hero;
