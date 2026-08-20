"use client";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";
import Button from "./common/Button";
import Link from "next/link";
import { API } from "@/services/apiConfig";

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
    const [currentIndex, setCurrentIndex] = useState(2);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [heroVisible, setHeroVisible] = useState(true);

    const GAP = 20;
    const SIDE_WIDTH = 931;
    const CLONES_AT_START = 2;

    const [mainWidth, setMainWidth] = useState(1200);
    const [viewType, setViewType] = useState('mobile');

    useEffect(() => {
        const updateView = () => {
            const w = window.innerWidth;
            if (w >= 1024) setViewType('desktop');
            else if (w >= 768) setViewType('tablet');
            else setViewType('mobile');

            if (w < 1440) {
                setMainWidth(Math.min(1200, w * 0.90));
            } else {
                setMainWidth(1200);
            }
        };
        updateView();
        window.addEventListener('resize', updateView);
        return () => window.removeEventListener('resize', updateView);
    }, []);

    const displaySlides = [...slides.slice(-CLONES_AT_START), ...slides, ...slides.slice(0, CLONES_AT_START)];

    useEffect(() => {
        if (!heroVisible || window.innerWidth < 768) return;
        const timer = setInterval(() => { next(); }, 5000);
        return () => clearInterval(timer);
    }, [heroVisible, slides.length]);

    useEffect(() => {
        (async () => {
            try {
                const r = await fetch(`${API}/api/cms/homepage`, { cache: "no-store" });
                if (!r.ok) return;
                const cms = await r.json();
                if (cms.heroEnabled === false) { setHeroVisible(false); return; }
                if (cms.heroSlides?.length >= 2) setSlides(cms.heroSlides);
            } catch (e) { }
        })();
    }, []);

    const handleTransitionEnd = () => {
        if (currentIndex <= 1) {
            setIsTransitioning(false);
            setCurrentIndex(currentIndex + slides.length);
        } else if (currentIndex >= slides.length + 2) {
            setIsTransitioning(false);
            setCurrentIndex(currentIndex - slides.length);
        }
    };

    useEffect(() => {
        if (!isTransitioning) {
            const timeout = setTimeout(() => setIsTransitioning(true), 20);
            return () => clearTimeout(timeout);
        }
    }, [isTransitioning]);

    const prev = () => { if (!isTransitioning) return; setCurrentIndex(prev => prev - 1); };
    const next = () => { if (!isTransitioning) return; setCurrentIndex(prev => prev + 1); };

    const activeSlideIndex = (currentIndex - CLONES_AT_START + slides.length) % slides.length;

    if (!heroVisible) return null;

    const translateX = -(currentIndex * (SIDE_WIDTH + GAP) + mainWidth / 2);

    // Tablet slide height: 380 - 24 (pt) - 24 (pb) = 332px
    const slideHeight = viewType === 'tablet' ? 332 : 500;
    const trackHeight = viewType === 'tablet' ? 332 : 510;

    return (
        <section className="w-full mx-auto gap-[10px] overflow-x-clip md:pt-8 md:pb-8 md:px-4" style={{ background: 'var(--color-grey-grey-50, hsla(0, 0%, 96%, 1))' }}>
            {/* ── Mobile Hero ────────────────────────────────────────── */}
            <div className="block md:hidden w-full" style={{ background: '#FFFFFF' }}>
                {/* Frame 562 — scroll container */}
                <div
                    className="flex overflow-x-auto snap-x snap-mandatory"
                    style={{
                        padding: '12px 20px',
                        gap: '10px',
                        height: '369px',
                        width: '100%',
                        boxSizing: 'border-box',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }}
                    onScroll={(e) => {
                        const el = e.currentTarget;
                        const cardW = 216 + 10;
                        const idx = Math.round(el.scrollLeft / cardW);
                        setCurrentIndex(idx);
                    }}
                >
                    {slides.map((s, i) => (
                        <Link
                            href={s.slideLink || s.ctaLink || '/products'}
                            key={i}
                            className="snap-center shrink-0 relative overflow-hidden"
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
                            {/* Glow ellipse */}
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

                            {/* Product image — top, 221×221, left:-6px top:0 */}
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
                                    alt={s.title}
                                    fill
                                    unoptimized
                                    className="object-contain object-center"
                                />
                            </div>

                            {/* Reflection fade */}
                            <div style={{
                                position: 'absolute',
                                width: '221px',
                                height: '137px',
                                left: '-1px',
                                top: '115px',
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0) 100%)',
                                filter: 'blur(3.7px)',
                                zIndex: 2,
                                pointerEvents: 'none'
                            }} />

                            {/* Text block — bottom */}
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
                                    color: '#FFFFFF',
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
                                    color: '#FFFFFF',
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
                                    width: '58px',
                                    height: '14.53px',
                                    background: '#FFCF46',
                                    borderRadius: '17.41px',
                                    marginTop: '2px'
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
                        </Link>
                    ))}
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
                        <div
                            key={i}
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: i === (currentIndex % slides.length) ? '#545454' : '#CBCBCB',
                                transition: 'background 0.3s'
                            }}
                        />
                    ))}
                </div>
            </div>


            {/* Tablet / Desktop View — identical layout, just scaled on tablet */}
            <div
                className={`${viewType === 'mobile' ? 'hidden' : 'flex'} flex-col items-center w-full relative group`}
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
                    <div
                        onTransitionEnd={handleTransitionEnd}
                        className={`flex absolute left-1/2 items-center ${isTransitioning ? 'transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]' : 'transition-none'}`}
                        style={{
                            height: `${slideHeight}px`,
                            transform: `translateX(${translateX}px)`,
                            gap: `${GAP}px`
                        }}
                    >
                        {displaySlides.map((s, idx) => {
                            const isCurrent = idx === currentIndex;
                            return (
                                <SlideItem
                                    key={idx}
                                    slide={s}
                                    width={isCurrent ? `${mainWidth}px` : `${SIDE_WIDTH}px`}
                                    isActive={isCurrent}
                                    viewType={viewType}
                                    slideHeight={slideHeight}
                                />
                            );
                        })}
                    </div>

                    {/* Navigation Arrows */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 flex items-center justify-between"
                        style={{ width: `${mainWidth + GAP + 60}px` }}
                    >
                        <button
                            onClick={prev}
                            style={{ boxShadow: '0px 8px 2px 0px rgba(133,133,133,0), 0px 5px 2px 0px rgba(133,133,133,0.01), 0px 3px 2px 0px rgba(133,133,133,0.05), 0px 1px 1px 0px rgba(133,133,133,0.09), 0px 0px 1px 0px rgba(133,133,133,0.1)' }}
                            className="pointer-events-auto w-[26px] h-[40px] rounded-[9px] flex items-center justify-center bg-[hsla(0,0%,93%,1)] hover:bg-[hsla(0,0%,85%,1)] active:scale-95 transition-all opacity-100 group/btn"
                        >
                            <ChevronLeftIcon strokeWidth={2.5} className="w-5 h-5 text-gray-800 group-hover/btn:text-gray-900 transition-colors" />
                        </button>
                        <button
                            onClick={next}
                            style={{ boxShadow: '0px 8px 2px 0px rgba(133,133,133,0), 0px 5px 2px 0px rgba(133,133,133,0.01), 0px 3px 2px 0px rgba(133,133,133,0.05), 0px 1px 1px 0px rgba(133,133,133,0.09), 0px 0px 1px 0px rgba(133,133,133,0.1)' }}
                            className="pointer-events-auto w-[26px] h-[40px] rounded-[9px] flex items-center justify-center bg-[hsla(0,0%,93%,1)] hover:bg-[hsla(0,0%,85%,1)] active:scale-95 transition-all opacity-100 group/btn"
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
                                    onClick={() => isTransitioning && setCurrentIndex(i + CLONES_AT_START)}
                                    className={`transition-all duration-300 rounded-full ${i === activeSlideIndex
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

    const heroImg = slide.image || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png";

    /* ── Desktop: absolute layout matching Figma (slide 1200×500) ──────────
       Text  : x=81  y=115 w=599        → left 6.75%  top 23%   w 49.9%
       Glow  : x=942 y=294 343×343      → left 78.5%  top 58.8% w 28.58%
       Image : x=628 y=-13 542×542      → left 52.33% top -2.6% w 45.17% h 108.4%
    ─────────────────────────────────────────────────────────────────────── */
    const desktopContent = (
        <div className="w-full h-full relative overflow-hidden">
            {/* Left: Text */}
            <div
                className={`absolute transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0 blur-0' : 'opacity-30 -translate-y-4 blur-[1px]'}`}
                style={{ left: '6.75%', top: '23%', width: '49.9%', color: slide.textColor || '#fff', display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
                <h1 style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: '47px', fontWeight: 600, lineHeight: '58px', letterSpacing: '-1.5px', maxWidth: '594px' }}>
                    {slide.title}
                </h1>
                <p style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: '18px', fontWeight: 600, lineHeight: '25px', letterSpacing: '-0.8px', maxWidth: '599px' }}>
                    {slide.subtitle}
                </p>
                <div>
                    <div
                        className="btn-primary inline-flex shadow-lg"
                        style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 500, color: '#333333', fontSize: '16px', lineHeight: '23px' }}
                    >
                        {(slide.ctaText || "Rent Now").replace(/ [^\w\s]+.*$| [→➔➜]|^.*[→➔➜]$| \->/g, "").trim()}
                    </div>
                </div>
            </div>

            {/* Glow ellipse behind the laptop — Figma: 343×343 @ left 942, top 294 */}
            <div
                className="absolute rounded-full pointer-events-none"
                style={{ left: '78.5%', top: '58.8%', width: '28.58%', aspectRatio: '1 / 1', background: '#BAE6FD', filter: 'blur(97px)', opacity: 0.75, zIndex: 0 }}
            />

            {/* Reflection — Figma: 542×336.04 @ left 630, top 270. Flipped copy of the
                image, clipped so only the mirrored base shows, faded out downward. */}
            <div
                className={`absolute pointer-events-none overflow-hidden transition-all duration-700 ${isActive ? 'opacity-100 blur-0' : 'opacity-30 blur-[1px]'}`}
                style={{ left: '52.5%', top: '54%', width: '45.17%', height: '67.2%', zIndex: 1, opacity: 0.59, filter: 'blur(3px)', WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0) 100%)', maskImage: 'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0) 100%)' }}
            >
                {/* Full-height flipped copy anchored to the top; the parent clips it, so
                    what stays visible is the bottom of the original image. */}
                <div className="absolute left-0 top-0 w-full" style={{ height: '161.3%', transform: 'scaleY(-1)' }}>
                    <Image src={heroImg} alt="" fill unoptimized aria-hidden="true" className="object-contain object-center" />
                </div>
            </div>

            {/* Right: laptop — Figma: 542×542 @ left 628, top -13 */}
            <div
                className={`absolute transition-all duration-700 ${isActive ? 'opacity-100 scale-100 blur-0' : 'opacity-30 scale-90 blur-[1px]'}`}
                style={{ left: '52.33%', top: '-2.6%', width: '45.17%', height: '108.4%', zIndex: 2 }}
            >
                <Image src={heroImg} alt={slide.title} fill unoptimized className="object-contain object-center drop-shadow-[0_25px_25px_rgba(0,0,0,0.25)]" />
            </div>
        </div>
    );

    const content = (
        <div className="w-full h-full px-16 grid grid-cols-[1.2fr_0.8fr] gap-4 items-center">
            {/* Left: Text */}
            <div
                className={`transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0 scale-100 blur-0' : 'opacity-30 -translate-y-4 scale-95 origin-left blur-[1px]'}`}
                style={{ color: slide.textColor || "#fff", display: 'flex', flexDirection: 'column', gap: isTablet ? '8px' : '16px' }}
            >
                <h1
                    className="tracking-tight"
                    style={{
                        width: viewType === 'desktop' ? '594px' : '100%',
                        maxWidth: viewType === 'desktop' ? '594px' : (isTablet ? '420px' : '480px'),
                        fontFamily: "'Mona Sans', sans-serif",
                        fontSize: viewType === 'desktop' ? "47px" : (isTablet ? "32px" : "36px"),
                        fontWeight: 600,
                        lineHeight: viewType === 'desktop' ? "58px" : (isTablet ? "38px" : "42px"),
                        letterSpacing: viewType === 'desktop' ? "-1.5px" : "-0.01em",
                    }}
                >
                    {slide.title}
                </h1>
                <p
                    className="leading-relaxed"
                    style={{
                        fontFamily: "'Mona Sans', sans-serif",
                        fontSize: viewType === 'desktop' ? "18px" : (isTablet ? "12px" : "14px"),
                        fontWeight: viewType === 'desktop' ? 600 : 400,
                        maxWidth: viewType === 'desktop' ? "599px" : (isTablet ? "380px" : "520px"),
                        lineHeight: viewType === 'desktop' ? "25px" : (isTablet ? "18px" : "22px"),
                        letterSpacing: viewType === 'desktop' ? "-0.8px" : "-0.01em",
                    }}
                >
                    {slide.subtitle}
                </p>
                <div>
                    <div
                        className={`btn-primary inline-flex shadow-lg ${isTablet ? 'px-8 py-2' : 'px-10 py-3'}`}
                        style={{
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 500,
                            color: "#333333",
                            fontSize: viewType === 'desktop' ? "16px" : "14px",
                            lineHeight: "23px"
                        }}
                    >
                        {(slide.ctaText || "Rent Now").replace(/ [^\w\s]+.*$| [→➔➜]|^.*[→➔➜]$| \->/g, "").trim()}
                    </div>
                </div>
            </div>

            {/* Right: Image with mirrored reflection (Figma) */}
            <div
                className={`relative w-full flex flex-col items-center justify-end transition-all duration-700 ${isActive ? 'opacity-100 scale-105 blur-0' : 'opacity-30 scale-90 blur-[1px]'}`}
                style={{ height: isTablet ? '280px' : '440px' }}
            >
                {/* Glow ellipse behind the image */}
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

                {/* Main image */}
                <div className="relative w-full" style={{ height: isTablet ? '74%' : '76%', zIndex: 1 }}>
                    <Image
                        src={slide.image || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png"}
                        alt={slide.title}
                        fill
                        unoptimized
                        className="object-contain object-bottom drop-shadow-[0_25px_25px_rgba(0,0,0,0.25)]"
                    />
                </div>

                {/* Reflection: flipped, faded, blurred copy */}
                <div
                    className="relative w-full pointer-events-none"
                    style={{
                        height: isTablet ? '26%' : '24%',
                        transform: 'scaleY(-1)',
                        opacity: 0.59,
                        filter: 'blur(3px)',
                        WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0) 75%)',
                        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0) 75%)',
                        zIndex: 1,
                    }}
                >
                    <Image
                        src={slide.image || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png"}
                        alt=""
                        fill
                        unoptimized
                        aria-hidden="true"
                        className="object-contain object-bottom"
                    />
                </div>
            </div>
        </div>
    );

    const containerStyle = {
        width: width,
        minWidth: width,
        height: `${slideHeight}px`,
        background: slide.bgGradient || slide.bgColor,
        opacity: isActive ? 1 : 0.85,
        boxShadow: isActive ? '0 12px 24px -6px rgba(0,0,0,0.12)' : '0 4px 8px -2px rgba(0,0,0,0.06)',
        zIndex: isActive ? 20 : 10
    };

    return (
        <Link
            href={slide.slideLink || slide.ctaLink || "/store"}
            className="shrink-0 relative rounded-[24px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer block"
            style={containerStyle}
        >
            {viewType === 'desktop' ? desktopContent : content}
        </Link>
    );
};

export default Hero;
