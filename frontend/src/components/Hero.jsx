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

    const GAP = 24;
    const SIDE_WIDTH = 931;
    const CLONES_AT_START = 2;

    const [mainWidth, setMainWidth] = useState(1200);

    useEffect(() => {
        const updateWidth = () => {
            if (window.innerWidth < 1440) {
                setMainWidth(Math.min(1200, window.innerWidth * 0.90));
            } else {
                setMainWidth(1200);
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
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

    return (
        <section className="bg-white pt-2 md:pt-6 pb-4 md:pb-10 w-full overflow-x-clip">
            {/* Mobile View */}
            <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory px-4 gap-3 no-scrollbar" style={{ height: "369px" }}>
                {slides.map((s, i) => (
                    <div key={i} className="snap-center shrink-0 rounded-lg relative h-full flex flex-col p-4 overflow-hidden"
                        style={{ width: "216px", background: s.bgGradient || s.bgColor }}>
                        <div className="absolute top-0 left-0 w-full h-[220px]">
                            <Image src={s.image || FALLBACK_SLIDES[0].image} alt={s.title} fill unoptimized className="object-contain drop-shadow-gray-50" />
                        </div>
                        <div className="mt-auto relative z-10" style={{ color: s.textColor || "#fff" }}>
                            <h1 className="text-sm font-bold leading-tight mb-1">{s.title}</h1>
                            <p className="text-[10px] opacity-90 mb-2">{s.subtitle}</p>
                            <Button href={s.ctaLink || "/store"} className="h-6 rounded-full bg-[#fbc02d] text-black text-[8px] px-3 font-bold">
                                {(s.ctaText || "Rent Now").replace(/ [^\w\s]+.*$| [→➔➜]|^.*[→➔➜]$| \-\>/g, "").trim()}
                            </Button>
                        </div>
                        {s.slideLink && <Link href={s.slideLink} className="absolute inset-0 z-20" />}
                    </div>
                ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex flex-col items-center w-full relative group" style={{ minHeight: "530px", paddingTop: "0px" }}>
                <div className="relative w-full h-[510px] flex items-center justify-center overflow-visible">
                    <div
                        onTransitionEnd={handleTransitionEnd}
                        className={`flex h-[500px] absolute left-1/2 items-center ${isTransitioning ? 'transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]' : 'transition-none'}`}
                        style={{
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
                                />
                            );
                        })}
                    </div>

                    {/* Navigation */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none z-30 max-w-[1280px] mx-auto px-4 flex items-center justify-between">
                        <button
                            onClick={prev}
                            className="pointer-events-auto w-14 h-14 bg-white/95 backdrop-blur-md shadow-2xl rounded-full flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <CaretLeft size={24} weight="regular" className="text-gray-800" />
                        </button>
                        <button
                            onClick={next}
                            className="pointer-events-auto w-14 h-14 bg-white/95 backdrop-blur-md shadow-2xl rounded-full flex items-center justify-center hover:bg-white hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <CaretRight size={24} weight="regular" className="text-gray-800" />
                        </button>
                    </div>

                    <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center items-center gap-3">
                        {slides.map((_, i) => (
                            <button key={i} onClick={() => isTransitioning && setCurrentIndex(i + CLONES_AT_START)}
                                className={`rounded-full transition-all duration-300 ${i === activeSlideIndex ? "w-10 h-2 bg-white shadow-md" : "w-2 h-2 bg-white/40 hover:bg-white/60"}`} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const SlideItem = ({ slide, isActive, width }) => {
    const content = (
        <div className="w-full h-full px-16 grid grid-cols-2 gap-12 items-center">
            <div className={`space-y-6 transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0 scale-100 blur-0' : 'opacity-30 -translate-y-4 scale-95 origin-left blur-[1px]'}`} style={{ color: slide.textColor || "#fff" }}>
                <h1 className="text-[48px] leading-[1.1] font-bold tracking-tight">{slide.title}</h1>
                <p className="text-[18px] opacity-90 font-medium leading-relaxed max-w-md">{slide.subtitle}</p>
                <div className="pt-2">
                    <Button href={slide.ctaLink || "/store"} variant="yellow" size="md" className="w-auto! rounded-full! px-10 py-4 font-bold inline-flex shadow-lg hover:scale-105 transition-transform">
                        {(slide.ctaText || "Rent Now").replace(/ [^\w\s]+.*$| [→➔➜]|^.*[→➔➜]$| \-\>/g, "").trim()}
                    </Button>
                </div>
            </div>
            <div className={`relative h-[420px] w-full transition-all duration-700 ${isActive ? 'opacity-100 scale-105 rotate-0 blur-0' : 'opacity-30 scale-90 -rotate-3 blur-[1px]'}`}>
                <Image src={slide.image || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png"} alt={slide.title} fill unoptimized className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)]" />
            </div>
        </div>
    );

    const containerStyle = {
        width: width,
        minWidth: width,
        height: '500px',
        background: slide.bgGradient || slide.bgColor,
        opacity: isActive ? 1 : 0.85,
        boxShadow: isActive ? '0 30px 60px -12px rgba(0,0,0,0.3)' : '0 10px 20px -5px rgba(0,0,0,0.1)',
        zIndex: isActive ? 20 : 10
    };

    if (slide.slideLink) {
        return (
            <Link
                href={slide.slideLink}
                className="shrink-0 relative rounded-[32px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer"
                style={containerStyle}
            >
                {content}
            </Link>
        );
    }

    return (
        <div
            className="shrink-0 relative rounded-[32px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={containerStyle}
        >
            {content}
        </div>
    );
};

export default Hero;
