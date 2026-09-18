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

const Hero = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [heroVisible, setHeroVisible] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef(null);

    useEffect(() => {
        let isCancelled = false;
        (async () => {
            try {
                const r = await fetch(`${API}/api/cms/homepage`, { cache: "no-store" });
                if (!r.ok) {
                    if (!isCancelled) setLoading(false);
                    return;
                }
                const cms = await r.json();
                if (isCancelled) return;
                if (cms.heroEnabled === false) {
                    setHeroVisible(false);
                    setLoading(false);
                    return;
                }
                const validSlides = (cms.heroSlides || []).filter(s => s && (s.bgImage || s.image));
                setSlides(validSlides);
            } catch (e) {
                console.error("Failed to load hero slides:", e);
            } finally {
                if (!isCancelled) setLoading(false);
            }
        })();
        return () => { isCancelled = true; };
    }, []);

    const handlePrev = useCallback(() => {
        if (swiperRef.current) swiperRef.current.slidePrev();
    }, []);

    const handleNext = useCallback(() => {
        if (swiperRef.current) swiperRef.current.slideNext();
    }, []);

    if (!heroVisible) return null;

    if (loading) {
        return (
            <section className="w-full mx-auto py-3 md:py-6 px-4 max-w-[1240px]">
                <div className="w-full h-[200px] xs:h-[240px] sm:h-[340px] md:h-[440px] lg:h-[500px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-[16px] sm:rounded-[24px]" />
            </section>
        );
    }

    if (!slides || slides.length === 0) return null;

    return (
        <section className="w-full mx-auto py-3 md:py-6 px-4 max-w-[1240px]">
            <div className="relative w-full h-[200px] xs:h-[240px] sm:h-[340px] md:h-[440px] lg:h-[500px] rounded-[16px] sm:rounded-[24px] overflow-hidden group shadow-md">
                <Swiper
                    modules={[Navigation, Autoplay, Pagination]}
                    slidesPerView={1}
                    spaceBetween={0}
                    loop={slides.length > 1}
                    speed={600}
                    autoplay={slides.length > 1 ? {
                        delay: 4500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    } : false}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        setActiveIndex(swiper.realIndex);
                    }}
                    onSlideChange={(swiper) => {
                        setActiveIndex(swiper.realIndex);
                    }}
                    className="w-full h-full rounded-[16px] sm:rounded-[24px] overflow-hidden"
                >
                    {slides.map((slide, idx) => {
                        const bannerImg = slide.bgImage || slide.image;
                        const targetHref = slide.ctaLink || slide.slideLink || slide.link || "/products";
                        const hasText = Boolean(slide.title && slide.subtitle);

                        return (
                            <SwiperSlide key={idx} className="w-full h-full relative overflow-hidden select-none">
                                <Link
                                    href={targetHref}
                                    className="block w-full h-full relative overflow-hidden cursor-pointer"
                                >
                                    <Image
                                        src={bannerImg}
                                        alt={slide.title || "Hero Banner"}
                                        fill
                                        unoptimized
                                        priority={idx === 0}
                                        className="object-cover object-center w-full h-full"
                                    />
                                    {hasText && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent flex flex-col justify-center px-6 sm:px-12 md:px-16 text-white max-w-[620px] space-y-2 sm:space-y-3">
                                            <h1 className="text-xl sm:text-3xl md:text-5xl font-bold tracking-tight drop-shadow-md" style={{ fontFamily: "'Mona Sans', sans-serif" }}>
                                                {slide.title}
                                            </h1>
                                            <p className="text-xs sm:text-sm md:text-base font-medium text-white/90 drop-shadow line-clamp-2 sm:line-clamp-3">
                                                {slide.subtitle}
                                            </p>
                                            {slide.ctaText && (
                                                <div className="pt-2">
                                                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-full bg-[#FFCF46] text-[#1F1F1F] font-bold text-xs sm:text-sm shadow-md hover:bg-[#ffc62b] transition-all">
                                                        {slide.ctaText.replace(/ [^\w\s]+.*$| [→➔➜]|^.*[→➔➜]$| \->/g, "").trim()} &rarr;
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Link>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>

                {slides.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={handlePrev}
                            aria-label="Previous slide"
                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/35 hover:bg-black/65 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg cursor-pointer opacity-80 group-hover:opacity-100"
                        >
                            <ChevronLeftIcon strokeWidth={2.5} className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            aria-label="Next slide"
                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/35 hover:bg-black/65 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg cursor-pointer opacity-80 group-hover:opacity-100"
                        >
                            <ChevronRightIcon strokeWidth={2.5} className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </button>
                    </>
                )}

                {slides.length > 1 && (
                    <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                aria-label={`Go to slide ${i + 1}`}
                                onClick={() => swiperRef.current?.slideToLoop(i)}
                                className={`transition-all duration-300 rounded-full cursor-pointer ${
                                    i === (activeIndex % slides.length)
                                        ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-white shadow-md"
                                        : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Hero;
