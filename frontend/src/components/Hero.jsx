"use client";
import Image from "next/image";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
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
        <section className="w-full pt-8 pb-8 px-4 mx-auto gap-[10px] overflow-x-clip" style={{ background: 'var(--color-grey-grey-50, hsla(0, 0%, 96%, 1))' }}>
            {/* ── Mobile (Restored from March 28) ────────────────────── */}
            <div
                className="block md:hidden flex overflow-x-auto snap-x snap-mandatory"
                style={{
                    width: "100%",
                    height: "369px",
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    gap: "10px",
                    backgroundColor: "transparent",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none"
                }}
            >
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .md\\:hidden::-webkit-scrollbar { display: none; }
                `}} />

                {slides.map((s, i) => (
                    <div
                        key={i}
                        className="snap-center shrink-0 rounded-lg relative h-full flex flex-col p-[14px] overflow-hidden z-0"
                        style={{
                            width: "216px",
                            background: s.bgGradient || s.bgColor
                        }}
                    >
                        {/* Image at TOP */}
                        <div
                            className="absolute z-0 pointer-events-none"
                            style={{
                                width: "221px",
                                height: "221px",
                                left: "-6px",
                                top: "0px"
                            }}
                        >
                            <Image
                                src={s.image || FALLBACK_SLIDES[0].image}
                                alt={s.title}
                                fill
                                unoptimized
                                className="object-contain object-center drop-shadow-[0_25px_25px_rgba(0,0,0,0.25)]"
                            />
                        </div>

                        {/* Text at BOTTOM */}
                        <div
                            className="absolute flex flex-col z-10"
                            style={{
                                width: "200px",
                                height: "auto",
                                top: "215px",
                                left: "14px",
                                gap: "2px",
                                color: s.textColor || "#fff"
                            }}
                        >
                            <h1
                                className="font-manrope font-bold"
                                style={{
                                    width: "200px",
                                    fontSize: "14px",
                                    lineHeight: "16px",
                                    letterSpacing: "-0.01em",
                                    color: "hsla(0, 0%, 100%, 1)"
                                }}
                            >
                                {s.title}
                            </h1>
                            <p
                                className="font-manrope font-normal"
                                style={{
                                    width: "193px",
                                    height: "42px",
                                    fontSize: "10px",
                                    lineHeight: "14px",
                                    letterSpacing: "-0.01em",
                                    color: "hsla(0, 0%, 100%, 1)"
                                }}
                            >
                                {s.subtitle}
                            </p>

                            <div className="pt-2">
                                <Button
                                    href={s.ctaLink || "/store"}
                                    className="flex items-center justify-center active:scale-95 transition-transform"
                                    style={{
                                        width: "60.42px",
                                        height: "16.95px",
                                        paddingTop: "3.63px",
                                        paddingBottom: "3.63px",
                                        paddingLeft: "7.26px",
                                        paddingRight: "7.26px",
                                        gap: "1.21px",
                                        borderRadius: "17.41px",
                                        borderBottom: "0.61px solid rgba(0,0,0,0.1)",
                                        background: "hsla(44, 100%, 64%, 1)",
                                        minWidth: "0",
                                        minHeight: "0"
                                    }}
                                >
                                    <span className="text-black font-bold whitespace-nowrap" style={{ fontSize: "7.5px", lineHeight: "1" }}>
                                        {s.ctaText || "Rent Now"}
                                    </span>
                                    <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
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
                            className="pointer-events-auto w-[26px] h-[40px] rounded-[9px] flex items-center justify-center bg-[hsla(0,0%,93%,1)] hover:bg-[hsla(0,0%,20%,1)] active:scale-95 transition-all shadow-sm opacity-100 group/btn"
                        >
                            <CaretLeft size={20} weight="regular" className="text-gray-800 group-hover/btn:text-white transition-colors" />
                        </button>
                        <button
                            onClick={next}
                            className="pointer-events-auto w-[26px] h-[40px] rounded-[9px] flex items-center justify-center bg-[hsla(0,0%,93%,1)] hover:bg-[hsla(0,0%,20%,1)] active:scale-95 transition-all shadow-sm opacity-100 group/btn"
                        >
                            <CaretRight size={20} weight="regular" className="text-gray-800 group-hover/btn:text-white transition-colors" />
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
                        width: viewType === 'desktop' ? '630px' : '100%',
                        maxWidth: viewType === 'desktop' ? '630px' : (isTablet ? '420px' : '480px'),
                        fontFamily: "'Mona Sans', sans-serif",
                        fontSize: viewType === 'desktop' ? "48px" : (isTablet ? "32px" : "36px"),
                        fontWeight: 600,
                        lineHeight: viewType === 'desktop' ? "56px" : (isTablet ? "38px" : "42px"),
                        letterSpacing: "-0.01em",
                    }}
                >
                    {slide.title}
                </h1>
                <p
                    className="opacity-90 leading-relaxed"
                    style={{
                        fontFamily: "'Mona Sans', sans-serif",
                        fontSize: isTablet ? "12px" : "14px",
                        fontWeight: 400,
                        maxWidth: isTablet ? "380px" : "520px",
                        lineHeight: isTablet ? "18px" : "22px",
                    }}
                >
                    {slide.subtitle}
                </p>
                <div>
                    <Button
                        href={slide.ctaLink || "/store"}
                        variant="yellow"
                        size="md"
                        className={`w-auto! rounded-full! font-bold inline-flex shadow-lg hover:scale-105 transition-transform ${isTablet ? 'px-8 py-2' : 'px-10 py-4'}`}
                    >
                        {(slide.ctaText || "Rent Now").replace(/ [^\w\s]+.*$| [→➔➜]|^.*[→➔➜]$| \->/g, "").trim()}
                    </Button>
                </div>
            </div>

            {/* Right: Image */}
            <div
                className={`relative w-full transition-all duration-700 ${isActive ? 'opacity-100 scale-105 rotate-0 blur-0' : 'opacity-30 scale-90 -rotate-3 blur-[1px]'}`}
                style={{ height: isTablet ? '280px' : '420px' }}
            >
                <Image
                    src={slide.image || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png"}
                    alt={slide.title}
                    fill
                    unoptimized
                    className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)]"
                />
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

    if (slide.slideLink) {
        return (
            <Link
                href={slide.slideLink}
                className="shrink-0 relative rounded-[24px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer"
                style={containerStyle}
            >
                {content}
            </Link>
        );
    }

    return (
        <div
            className="shrink-0 relative rounded-[24px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={containerStyle}
        >
            {content}
        </div>
    );
};

export default Hero;
