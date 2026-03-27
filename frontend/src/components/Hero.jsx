"use client";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import Button from "./common/Button";
import { API } from "@/services/apiConfig";

/* ─── Figma Spec ──────────────────────────────────────────────────────────
   outer section : full-width × 564px
   center slide  : 1200px × 500px  (= navbar max-w-[1200px])
   border-radius : rounded-3xl (24px)
   vertical pad  : (564 - 500) / 2 = 32px
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
        textColor: "#FFFFFF",
        ctaText: "Explore Laptops",
        ctaLink: "/store",
    },
    {
        title: "Capture Every Detail with Precision.",
        subtitle: "Rent high-end DSLR cameras and lenses for your next creative project.",
        image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png",
        bgColor: "#0075ff",
        textColor: "#FFFFFF",
        ctaText: "Rent Cameras",
        ctaLink: "/store",
    },
    {
        title: "Powerful Servers for Scale.",
        subtitle: "High-performance servers and networking gear on a budget.",
        image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png",
        bgColor: "#ff5e62",
        textColor: "#FFFFFF",
        ctaText: "Get Servers",
        ctaLink: "/store",
    },
];

const Hero = () => {
    const [active, setActive] = useState(0);
    const [slides, setSlides] = useState(FALLBACK_SLIDES);
    const [heroVisible, setHeroVisible] = useState(true);

    // Auto-advance desktop version
    useEffect(() => {
        if (!heroVisible || window.innerWidth < 768) return;
        const timer = setInterval(() => {
            setActive(prev => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroVisible, slides.length]);

    useEffect(() => {
        (async () => {
            try {
                const r = await fetch(`${API}/api/cms/homepage`, { cache: "no-store" });
                if (!r.ok) return;
                const cms = await r.json();
                if (cms.heroEnabled === false) { setHeroVisible(false); return; }
                // Only use CMS slides if at least 2 are defined (otherwise keep the 4 fallback slides)
                if (cms.heroSlides?.length >= 2) setSlides(cms.heroSlides);
            } catch (e) { /* keep fallback */ }
        })();
    }, []);

    const prev = () => setActive(i => (i - 1 + slides.length) % slides.length);
    const next = () => setActive(i => (i + 1) % slides.length);
    const desktopRef = useRef(null);

    if (!heroVisible) return null;

    return (
        <section className="bg-white py-4 md:py-8">

            {/* ── Mobile ────────────────────────────────────────────── */}
            <div
                className="md:hidden flex overflow-x-auto snap-x snap-mandatory"
                style={{
                    width: "100%",
                    height: "369px",
                    paddingTop: "12px",
                    paddingBottom: "12px",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    gap: "10px",
                    backgroundColor: "hsla(0, 0%, 100%, 1)",
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
                        {/* Image at TOP - Absolutely positioned to allow exact overlap behind text without pushing it down */}
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

            {/* ── Desktop Carousel (Aligned with Nav, No Peeking) ──────── */}
            <div className="hidden md:block w-full max-w-[1200px] mx-auto px-4 sm:px-6 relative group" style={{ paddingTop: "10px", paddingBottom: "20px" }}>

                <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-sm">
                    {/* Track */}
                    <div
                        className="flex h-full transition-transform duration-500 ease-in-out"
                        style={{
                            transform: `translateX(-${active * 100}%)`
                        }}
                    >
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className="shrink-0 w-full h-full relative"
                                style={{
                                    background: slide.bgGradient || slide.bgColor
                                }}
                            >
                                {/* Two-column layout */}
                                <div className="w-full h-full px-14 grid grid-cols-2 gap-8 items-center">

                                    {/* Left: Text */}
                                    <div className="space-y-6 z-10" style={{ color: slide.textColor || "#fff" }}>
                                        <h1 className="text-[42px] leading-[1.15] font-bold tracking-tight">
                                            {slide.title}
                                        </h1>
                                        <p className="text-base opacity-90 leading-relaxed max-w-sm">
                                            {slide.subtitle}
                                        </p>
                                        <Button
                                            href={slide.ctaLink || "/store"}
                                            variant="yellow"
                                            size="md"
                                            className="w-auto! rounded-full! px-8 font-bold inline-flex"
                                        >
                                            {slide.ctaText || "Rent Now"}
                                        </Button>
                                    </div>

                                    {/* Right: Image */}
                                    <div className="relative h-[400px] w-full">
                                        <Image
                                            src={slide.image || FALLBACK_SLIDES[0].image}
                                            alt={slide.title}
                                            fill
                                            unoptimized
                                            className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.2)]"
                                            priority={index === 0}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Prev arrow */}
                    <button
                        onClick={prev}
                        aria-label="Previous slide"
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-30
                                   w-12 h-12 bg-white/90 backdrop-blur-sm shadow-xl rounded-full
                                   flex items-center justify-center hover:bg-white hover:scale-105 transition-all
                                   opacity-0 group-hover:opacity-100"
                    >
                        <FaChevronLeft className="text-gray-800" size={18} />
                    </button>

                    {/* Next arrow */}
                    <button
                        onClick={next}
                        aria-label="Next slide"
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-30
                                   w-12 h-12 bg-white/90 backdrop-blur-sm shadow-xl rounded-full
                                   flex items-center justify-center hover:bg-white hover:scale-105 transition-all
                                   opacity-0 group-hover:opacity-100"
                    >
                        <FaChevronRight className="text-gray-800" size={18} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-3">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                aria-label={`Go to slide ${i + 1}`}
                                onClick={() => setActive(i)}
                                className={`rounded-full transition-all duration-300 ${i === active ? "w-9 h-[6px] bg-white opacity-100" : "w-[6px] h-[6px] bg-white opacity-50 hover:opacity-80"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
