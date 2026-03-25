"use client";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect } from "react";
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
        subtitle: "Get the latest MacBooks, Workstations, Cameras, and more.",
        image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png",
        bgColor: "#00BAFF",
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
    const [active,      setActive]      = useState(0);
    const [slides,      setSlides]      = useState(FALLBACK_SLIDES);
    const [heroVisible, setHeroVisible] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const r   = await fetch(`${API}/api/cms/homepage`, { cache: "no-store" });
                if (!r.ok) return;
                const cms = await r.json();
                if (cms.heroEnabled === false) { setHeroVisible(false); return; }
                if (cms.heroSlides?.length)     setSlides(cms.heroSlides);
            } catch (e) { /* keep fallback */ }
        })();
    }, []);

    const prev = () => setActive(i => (i - 1 + slides.length) % slides.length);
    const next = () => setActive(i => (i + 1) % slides.length);

    if (!heroVisible) return null;

    return (
        <section className="bg-white py-4 md:py-8">

            {/* ── Mobile ────────────────────────────────────────────── */}
            <div className="md:hidden px-4">
                <div className="relative overflow-hidden rounded-2xl h-[420px]">
                    <div
                        className="flex h-full transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${active * 100}%)` }}
                    >
                        {slides.map((s, i) => (
                            <div key={i} className="min-w-full h-full">
                                <div className="p-8 h-full flex flex-col justify-between"
                                     style={{ backgroundColor: s.bgColor }}>
                                    <div className="space-y-4" style={{ color: s.textColor || "#fff" }}>
                                        <h1 className="text-3xl font-bold leading-tight">{s.title}</h1>
                                        <p className="text-sm opacity-90">{s.subtitle}</p>
                                        <Button href={s.ctaLink || "/store"} variant="yellow" size="sm"
                                                className="!w-auto !rounded-full !font-bold">
                                            {s.ctaText || "Rent Now"}
                                        </Button>
                                    </div>
                                    <div className="relative h-[200px] w-full">
                                        <Image src={s.image || FALLBACK_SLIDES[0].image} alt="" fill
                                               className="object-contain object-bottom" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {slides.map((_, i) => (
                            <button key={i} onClick={() => setActive(i)}
                                    className={`rounded-full h-2 transition-all ${i === active ? "w-8 bg-white" : "w-2 bg-white/50"}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Desktop: single centered 1200 × 500 slide ─────────────
                  Same max-w-[1200px] mx-auto as the navbar —
                  makes the slide edges align perfectly with nav content.
            ──────────────────────────────────────────────────────────── */}
            <div className="hidden md:block">
                {/* The slide wrapper matches navbar container */}
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
                    <div className="relative overflow-hidden rounded-3xl" style={{ height: 500 }}>

                        {/* Slide track — slides wider-than-container, shifted by active index */}
                        <div
                            className="flex h-full transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${active * 100}%)` }}
                        >
                            {slides.map((slide, index) => (
                                <div
                                    key={index}
                                    className="min-w-full h-full relative"
                                    style={{ backgroundColor: slide.bgColor }}
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
                                                className="!w-auto !rounded-full px-8 font-bold"
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
                                                className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.2)]"
                                                priority={index === active}
                                            />
                                        </div>
                                    </div>

                                    {/* Dot indicators bottom-left */}
                                    <div className="absolute bottom-7 left-14 flex items-center gap-3">
                                        {slides.map((_, i) => (
                                            <button key={i} onClick={() => setActive(i)}
                                                    className={`rounded-full h-[6px] transition-all duration-300 ${
                                                        i === active ? "w-9 bg-white" : "w-[6px] bg-white/40"
                                                    }`} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Left arrow */}
                        <button onClick={prev} aria-label="Previous slide"
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-10
                                           w-9 h-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-md
                                           flex items-center justify-center
                                           hover:bg-white transition-colors group">
                            <FaChevronLeft className="text-gray-700 group-hover:text-gray-900" size={16} />
                        </button>

                        {/* Right arrow */}
                        <button onClick={next} aria-label="Next slide"
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-10
                                           w-9 h-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-md
                                           flex items-center justify-center
                                           hover:bg-white transition-colors group">
                            <FaChevronRight className="text-gray-700 group-hover:text-gray-900" size={16} />
                        </button>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default Hero;
