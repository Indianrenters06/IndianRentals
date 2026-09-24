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

    // Desktop follows Figma "Frame 562" (24181:29742): 32px top/bottom, a 1200×500
    // slide (radius 24) with the previous/next slides peeking 20px away on each side,
    // 26×40 grey arrow tabs sitting 36px outside the slide, dots bottom-left.
    return (
        <section className="w-full mx-auto py-3 md:py-6 lg:py-8 px-4 lg:px-0 max-w-[1240px] lg:max-w-none lg:overflow-hidden">
            <div className="relative w-full lg:max-w-[1200px] lg:mx-auto h-[200px] xs:h-[240px] sm:h-[340px] md:h-[440px] lg:h-[500px] rounded-[16px] sm:rounded-[24px] overflow-hidden lg:overflow-visible group shadow-md lg:shadow-none">
                <Swiper
                    modules={[Navigation, Autoplay, Pagination]}
                    slidesPerView={1}
                    spaceBetween={0}
                    breakpoints={{
                        1024: { slidesPerView: 'auto', spaceBetween: 20, centeredSlides: true },
                    }}
                    loop={slides.length > 2}
                    rewind={slides.length === 2}
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
                    className="w-full h-full rounded-[16px] sm:rounded-[24px] overflow-hidden lg:!overflow-visible lg:rounded-none"
                >
                    {slides.map((slide, idx) => {
                        const bannerImg = slide.bgImage || slide.image;
                        const targetHref = slide.ctaLink || slide.slideLink || slide.link || "/products";
                        const hasText = Boolean(slide.title && slide.subtitle);

                        return (
                            <SwiperSlide key={idx} className="w-full h-full relative overflow-hidden select-none lg:!w-[1200px] lg:rounded-[24px]">
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
                                        // Desktop: Figma "Frame 54" — 599px block at (81, 115), 17px gaps,
                                        // no scrim (the artwork carries the contrast).
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent lg:bg-none flex flex-col justify-center lg:justify-start px-6 sm:px-12 md:px-16 lg:pl-[81px] lg:pr-0 lg:pt-[115px] text-white max-w-[620px] lg:max-w-[680px] space-y-2 sm:space-y-3 lg:space-y-0 lg:gap-[17px]">
                                            <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-[47px] lg:leading-[58px] font-bold lg:font-semibold tracking-tight lg:tracking-[-1.5px] drop-shadow-md lg:drop-shadow-none lg:max-w-[599px]" style={{ fontFamily: "'Mona Sans', sans-serif" }}>
                                                {slide.title}
                                            </h1>
                                            <p className="text-xs sm:text-sm md:text-base lg:text-[18px] lg:leading-[25px] font-medium lg:font-semibold text-white/90 lg:text-white lg:tracking-[-0.8px] drop-shadow lg:drop-shadow-none line-clamp-2 sm:line-clamp-3 lg:max-w-[599px]">
                                                {slide.subtitle}
                                            </p>
                                            {slide.ctaText && (
                                                <div className="pt-2 lg:pt-0">
                                                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 sm:px-6 sm:py-2.5 lg:h-[35px] lg:px-5 lg:py-[6px] rounded-full bg-[#FFCF46] text-[#1F1F1F] lg:text-[#333333] font-bold lg:font-medium text-xs sm:text-sm lg:text-[16px] lg:leading-[23px] lg:tracking-[-0.4px] shadow-md lg:shadow-none hover:bg-[#ffc62b] transition-all">
                                                        {slide.ctaText.replace(/ [^\w\s]+.*$| [→➔➜]|^.*[→➔➜]$| \->/g, "").trim()}
                                                        <span className="lg:hidden">&rarr;</span>
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
                            className="absolute left-2 sm:left-4 lg:left-[-36px] top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 lg:w-[26px] lg:h-[40px] rounded-full lg:rounded-[9px] bg-black/35 hover:bg-black/65 lg:bg-[#EEEEEE] lg:hover:bg-[#E2E2E2] backdrop-blur-md lg:backdrop-blur-none border border-white/20 lg:border-0 text-white flex items-center justify-center hover:scale-110 lg:hover:scale-100 active:scale-95 transition-all duration-200 shadow-lg lg:shadow-none cursor-pointer opacity-80 lg:opacity-100 group-hover:opacity-100"
                        >
                            <ChevronLeftIcon strokeWidth={2.5} className="w-4 h-4 sm:w-5 sm:h-5 text-white lg:hidden" />
                            <img src="/icons/chevron-left.svg" alt="" width={24} height={24} className="hidden lg:block" />
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            aria-label="Next slide"
                            className="absolute right-2 sm:right-4 lg:right-[-36px] top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 lg:w-[26px] lg:h-[40px] rounded-full lg:rounded-[9px] bg-black/35 hover:bg-black/65 lg:bg-[#EEEEEE] lg:hover:bg-[#E2E2E2] backdrop-blur-md lg:backdrop-blur-none border border-white/20 lg:border-0 text-white flex items-center justify-center hover:scale-110 lg:hover:scale-100 active:scale-95 transition-all duration-200 shadow-lg lg:shadow-none cursor-pointer opacity-80 lg:opacity-100 group-hover:opacity-100"
                        >
                            <ChevronRightIcon strokeWidth={2.5} className="w-4 h-4 sm:w-5 sm:h-5 text-white lg:hidden" />
                            <img src="/icons/chevron-right.svg" alt="" width={24} height={24} className="hidden lg:block" />
                        </button>
                    </>
                )}

                {slides.length > 1 && (
                    // Desktop: Figma "dot-indicator" at (76, 460) — 4px white dots, 8px apart,
                    // the current slide as a 6px white ring.
                    <div className="absolute bottom-3 sm:bottom-5 lg:bottom-auto lg:top-[460px] left-1/2 lg:left-[76px] -translate-x-1/2 lg:translate-x-0 z-20 flex items-center gap-1.5 sm:gap-2 lg:gap-2 lg:h-5 lg:w-[60px] lg:justify-center">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                aria-label={`Go to slide ${i + 1}`}
                                onClick={() => swiperRef.current?.slideToLoop(i)}
                                className={`transition-all duration-300 rounded-full cursor-pointer ${
                                    i === (activeIndex % slides.length)
                                        ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-white shadow-md lg:w-1.5 lg:h-1.5 lg:bg-transparent lg:border-[1.2px] lg:border-white lg:shadow-none"
                                        : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80 lg:w-1 lg:h-1 lg:bg-white"
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
