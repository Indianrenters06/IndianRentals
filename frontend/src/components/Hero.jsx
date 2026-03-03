"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const FALLBACK_SLIDES = [
    {
        title: "The Tech That Powers Your Ambition. On Demand.",
        subtitle: "Get the latest MacBooks, Workstations, Cameras, and more. Delivered to your door with flexible monthly plans. Upgrade your toolkit, not your expenses.",
        image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png",
        bgColor: "#00A8FF",
        ctaText: "Rent Now",
        ctaLink: "/store",
    },
    {
        title: "Work Seamlessly From Anywhere.",
        subtitle: "Rent enterprise-grade laptops and accessories without upfront capital. Zero maintenance cost.",
        image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png",
        bgColor: "#0077CC",
        ctaText: "Explore Laptops",
        ctaLink: "/store",
    },
];

const Hero = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [slides, setSlides] = useState(FALLBACK_SLIDES);
    const [heroVisible, setHeroVisible] = useState(true);

    useEffect(() => {
        const loadCMS = async () => {
            try {
                const r = await fetch(`${API}/api/cms/homepage`);
                if (!r.ok) return;
                const cms = await r.json();

                if (cms.heroEnabled === false) {
                    setHeroVisible(false);
                    return;
                }

                if (cms.heroSlides && cms.heroSlides.length > 0) {
                    setSlides(cms.heroSlides);
                } else if (cms.heroTitle) {
                    // Fallback for legacy single-hero
                    setSlides([{
                        title: cms.heroTitle,
                        subtitle: cms.heroSubtitle,
                        image: cms.heroImage,
                        bgColor: cms.heroBgColor || "#00A8FF",
                        ctaText: "Rent Now",
                        ctaLink: "/store"
                    }]);
                }
            } catch (err) {
                console.error("Failed to fetch hero CMS data", err);
            }
        };
        loadCMS();
    }, []);

    const prev = () => setActiveSlide(i => (i - 1 + slides.length) % slides.length);
    const next = () => setActiveSlide(i => (i + 1) % slides.length);

    if (!heroVisible) return null;

    const slide = slides[activeSlide];

    return (
        <section className="bg-white py-4 md:py-6">
            <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-6 relative">

                {/* ── Mobile: horizontal carousel ── */}
                <div className="md:hidden relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                    >
                        {slides.map((s, index) => (
                            <div key={index} className="min-w-full">
                                <div
                                    className="relative rounded-2xl overflow-hidden"
                                    style={{ backgroundColor: s.bgColor }}
                                >
                                    {/* Text */}
                                    <div className="px-5 pt-5 pb-0 space-y-3 text-white relative z-10">
                                        <h1 className="text-xl font-bold leading-snug">{s.title}</h1>
                                        <p className="text-xs leading-relaxed text-white/90">{s.subtitle}</p>
                                        <Link
                                            href={s.ctaLink || "/store"}
                                            className="inline-flex items-center gap-2 bg-[#FFC107] text-gray-900 px-5 py-2 rounded-full font-bold text-sm hover:bg-[#FFD54F] transition-all shadow-md"
                                        >
                                            {s.ctaText || "Rent Now"} <FaArrowRight size={11} />
                                        </Link>
                                    </div>
                                    {/* Hero image */}
                                    <div className="relative w-full h-[160px] mt-2">
                                        <Image
                                            src={s.image}
                                            alt="Hero Visual"
                                            fill
                                            className="object-contain object-bottom drop-shadow-2xl"
                                            priority={index === 0}
                                            sizes="100vw"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dot indicators */}
                    <div className="flex items-center justify-center gap-2 mt-3">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveSlide(i)}
                                className={`rounded-full transition-all duration-300 ${i === activeSlide ? 'w-5 h-2 bg-gray-800' : 'w-2 h-2 bg-gray-300'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* ── Desktop layout ── */}
                <div className="hidden md:block relative">
                    <div
                        className="absolute inset-0 rounded-3xl md:rounded-[2.5rem] transition-colors duration-700"
                        style={{ backgroundColor: slide.bgColor }}
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-transparent to-white/10 rounded-3xl md:rounded-[2.5rem]" />

                    {/* Prev arrow */}
                    <button
                        onClick={prev}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all"
                    >
                        <FaChevronLeft size={20} />
                    </button>
                    {/* Next arrow */}
                    <button
                        onClick={next}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all"
                    >
                        <FaChevronRight size={20} />
                    </button>

                    <div className="relative z-10 px-6 py-8 md:px-12 md:py-12 h-full flex items-center justify-center">
                        <div className="grid md:grid-cols-2 gap-4 lg:gap-12 items-center w-full max-w-6xl mx-auto">

                            {/* Text Content */}
                            <div className="space-y-6 text-center md:text-left text-white relative z-20 w-full">
                                <motion.div
                                    key={`title-${activeSlide}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="font-bold tracking-tight text-white"
                                >
                                    <h1 className="text-3xl md:text-4xl lg:text-[44px] leading-[1.2] font-bold">
                                        {slide.title}
                                    </h1>
                                </motion.div>

                                <motion.div
                                    key={`sub-${activeSlide}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="text-sm md:text-[15px] leading-snug text-white/90 font-medium"
                                >
                                    <p>{slide.subtitle}</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="pt-2"
                                >
                                    <Link
                                        href={slide.ctaLink || "/store"}
                                        className="inline-flex items-center gap-2 bg-[#FFC107] text-gray-900 px-7 py-3 rounded-full font-bold text-[15px] hover:bg-[#FFD54F] transition-all transform hover:scale-105 shadow-lg"
                                    >
                                        {slide.ctaText || "Rent Now"} <FaArrowRight size={13} className="ml-1" />
                                    </Link>
                                </motion.div>

                                {/* Slide indicators */}
                                <div className="flex items-center justify-center md:justify-start gap-3 pt-4">
                                    {slides.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveSlide(i)}
                                            className={`rounded-full transition-all duration-300 ${i === activeSlide ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Image Content */}
                            <motion.div
                                key={`img-${activeSlide}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="relative flex justify-center md:justify-end items-center"
                            >
                                <div className="relative w-full max-w-[600px] aspect-16/10">
                                    <Image
                                        src={slide.image}
                                        alt="Hero Visual"
                                        fill
                                        className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                                        priority
                                        sizes="(max-width: 768px) 100vw, 600px"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Hero;
