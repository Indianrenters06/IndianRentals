"use client";
import Image from "next/image";
import { SwiperControls } from "./CarouselControls";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from './Hero.module.css';
import useHomepageContent from '@/hooks/useHomepageContent';
import { heroSlidesFor } from '@/lib/homepageContent.mjs';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, A11y } from 'swiper/modules';

import 'swiper/css';

const Hero = () => {
    const {content:cms,loading} = useHomepageContent();
    const slides = heroSlidesFor(cms);
    const [swiper, setSwiper] = useState(null);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReducedMotion(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    if (cms?.heroEnabled === false) return null;

    if (loading) {
        return (
            <section className={styles.section}>
                <div className={`${styles.viewport} bg-grey-100 animate-pulse rounded-3xl`} />
            </section>
        );
    }

    if (!slides || slides.length === 0) return null;

    return (
        <section className={styles.section} aria-label="Featured rentals">
            <div className={styles.frame}>
            <div className={styles.viewport} onFocusCapture={() => swiper?.autoplay?.stop()}>
                <Swiper
                    modules={[Autoplay, A11y]}
                    slidesPerView="auto"
                    spaceBetween={8}
                    breakpoints={{ 768: { slidesPerView: 1, spaceBetween: 20, centeredSlides: true } }}
                    centeredSlides={false}
                    loop={slides.length > 2}
                    rewind={slides.length === 2}
                    speed={reducedMotion ? 0 : 600}
                    autoplay={slides.length > 1 && !reducedMotion ? {
                        delay: 4500,
                        disableOnInteraction: true,
                        pauseOnMouseEnter: true,
                    } : false}
                    onSwiper={instance => {
                        setSwiper(instance);
                        if (instance.params.loop) instance.loopFix();
                    }}
                    // Overflow previews need neighbors on both sides after a loop jump.
                    onSlideChangeTransitionEnd={instance => {
                        if (instance.params.loop) instance.loopFix();
                    }}
                    className={`w-full h-full ${styles.track}`}
                >
                    {slides.map((slide, idx) => {
                        const bannerImg = slide.bgImage || slide.image;
                        const targetHref = slide.ctaLink || slide.slideLink || slide.link || "/products";
                        const hasText = Boolean(slide.title && slide.subtitle);

                        return (
                            <SwiperSlide key={idx} className={`${styles.slide} h-full relative overflow-hidden select-none`}>
                                <Link
                                    href={targetHref}
                                    className="block w-full h-full relative overflow-hidden cursor-pointer"
                                >
                                    <Image
                                        src={bannerImg}
                                        alt={slide.alt || slide.title || "Hero Banner"}
                                        fill
                                        unoptimized
                                        priority={idx === 0}
                                        sizes="(max-width: 1272px) calc(100vw - 40px), 1200px"
                                        className={slide.mobileImage ? "hidden md:block object-cover object-center" : "object-cover object-center"}
                                    />
                                    {slide.mobileImage && (
                                        <Image
                                            src={slide.mobileImage}
                                            alt={slide.alt || slide.title || "Hero Banner"}
                                            fill
                                            unoptimized
                                            sizes="calc(100vw - 40px)"
                                            className="block md:hidden object-cover object-center"
                                        />
                                    )}
                                    {hasText && (
                                        // Desktop: Figma "Frame 54" — 599px block at (81, 115), 17px gaps,
                                        // no scrim (the artwork carries the contrast).
                                        <div className={styles.copy}>
                                            <h1 className="text-[16px] leading-[20px] md:text-[27px] md:leading-[35px] lg:text-[47px] lg:leading-[58px] font-bold lg:font-semibold tracking-tight lg:tracking-[-1.5px] lg:max-w-[599px]" style={{ fontFamily: "'Mona Sans', sans-serif" }}>
                                                {slide.title}
                                            </h1>
                                            <p className="text-[10px] leading-[14px] md:text-[14px] md:leading-[20px] lg:text-[18px] lg:leading-[25px] font-medium md:font-semibold text-white/95 lg:text-white lg:tracking-[-0.8px] line-clamp-3 lg:max-w-[599px]">
                                                {slide.subtitle}
                                            </p>
                                            {slide.ctaText && (
                                                <div>
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 md:px-5 md:py-[6px] md:h-[35px] rounded-full bg-[#FFCF46] text-[#1F1F1F] lg:text-[#333333] font-bold md:font-medium text-[11px] md:text-[16px] md:leading-[23px] lg:tracking-[-0.4px] hover:bg-[#ffc62b] transition-colors">
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

            </div>
            <SwiperControls swiper={swiper} count={slides.length} label="Hero" variant="hero" autoplay={!reducedMotion} />
            </div>
        </section>
    );
};

export default Hero;
