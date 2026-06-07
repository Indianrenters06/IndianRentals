"use client";
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Scrollbar } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';
import { Laptop, Camera, Desktop, DeviceTablet, DeviceMobile, ArrowRight } from '@phosphor-icons/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getCategories } from '../services/categoryService';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/free-mode';

import { API } from '../services/apiConfig';

const CATEGORY_ROUTES = {
    'macbook': '/category/apple',
    'ipad': '/category/apple',
    'smartphone': '/category/apple',
    'iphone': '/category/apple',
    'desktop': '/category/it-products',
    'all in one': '/category/it-products',
    'dslr': '/category/dslr',
    'camera': '/category/dslr'
};

const RentByCategory = () => {
    const [displayCategories, setDisplayCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cmsConfig, setCmsConfig] = useState({
        enabled: true,
        title: "Rent by Category"
    });
    const [viewType, setViewType] = useState('mobile');

    useEffect(() => {
        const checkRes = () => {
            const w = window.innerWidth;
            if (w >= 1024) setViewType('desktop');
            else if (w >= 768) setViewType('tablet');
            else setViewType('mobile');
        };
        checkRes();
        window.addEventListener('resize', checkRes);
        return () => window.removeEventListener('resize', checkRes);
    }, []);

    const getCategoryRoute = (cat) => {
        const lowerName = cat.name.toLowerCase();
        for (const [key, route] of Object.entries(CATEGORY_ROUTES)) {
            if (lowerName.includes(key)) return route;
        }
        return `/category/${cat.slug || cat._id}`;
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const rawData = await getCategories();

                // Preferred subcategory names in display order
                const preferredSubNames = [
                    "MacBook", "DSLR", "All In One", "iPad", "SmartPhone", "Desktop",
                    "iPhone", "MacBook Pro", "Camera"
                ];

                // Pick up to 2 subcategories per parent (preferred names first)
                let selectedCategories = [];
                if (Array.isArray(rawData)) {
                    rawData.forEach(parent => {
                        const subs = parent.subcategories || [];
                        if (subs.length === 0) return;

                        const parentSlug = parent.slug || parent.name.toLowerCase().replace(/\s+/g, '-');

                        // Sort subs by preferred name rank
                        const ranked = [...subs].sort((a, b) => {
                            const aIdx = preferredSubNames.findIndex(n => a.name.toLowerCase().includes(n.toLowerCase()));
                            const bIdx = preferredSubNames.findIndex(n => b.name.toLowerCase().includes(n.toLowerCase()));
                            return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
                        });

                        // Take top 2 from each parent
                        ranked.slice(0, 2).forEach(picked => {
                            const subSlug = picked.slug || picked.name.toLowerCase().replace(/\s+/g, '-');
                            selectedCategories.push({
                                ...picked,
                                calculatedRoute: `/category/${parentSlug}/${subSlug}?subId=${picked._id}`
                            });
                        });
                    });
                }

                // Sort by preferred order, append the rest, limit to 9
                let matched = preferredSubNames.map(name =>
                    selectedCategories.find(c => c.name.toLowerCase().includes(name.toLowerCase())) || null
                ).filter(Boolean);

                const matchedIds = new Set(matched.map(c => c._id));
                const rest = selectedCategories.filter(c => !matchedIds.has(c._id));

                let sortedCategories = Array.from(
                    new Map([...matched, ...rest].map(c => [c._id, c])).values()
                ).slice(0, 9);

                // Use DB image if available, otherwise fall back to local assets
                sortedCategories = sortedCategories.map(cat => {
                    const hasDatabaseImage = cat.image && cat.image.length > 5 && !cat.image.includes('unsplash') && !cat.image.includes('placeholder');
                    if (hasDatabaseImage) return cat;

                    const lowerName = cat.name.toLowerCase();
                    if (lowerName.includes('macbook')) return { ...cat, image: "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1769200258/WhatsApp_Image_2026-01-23_at_23.58._j7jcoq.jpg" };
                    if (lowerName.includes('ipad')) return { ...cat, image: '/ipad-new.jpg' };
                    if (lowerName.includes('iphone')) return { ...cat, image: '/ipad-new.jpg' };
                    if (lowerName.includes('desktop')) return { ...cat, image: '/mac-pro-new.jpg' };
                    if (lowerName.includes('all in one')) return { ...cat, image: '/it-products-new.jpg' };
                    if (lowerName.includes('dslr') || lowerName.includes('camera')) return { ...cat, image: '/office-equipment-new.jpg' };
                    if (lowerName.includes('smartphone') || lowerName.includes('phone')) return { ...cat, image: '/ipad-new.jpg' };
                    return cat;
                });

                setDisplayCategories(sortedCategories);

                // Fetch CMS Config for the section title/visibility
                const cmsRes = await fetch(`${API}/api/cms/homepage`);
                if (cmsRes.ok) {
                    const cmsData = await cmsRes.json();
                    setCmsConfig({
                        enabled: cmsData.categorySectionEnabled !== false,
                        title: cmsData.categorySectionTitle || "Rent by Category"
                    });
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const getIconForCategory = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('macbook')) return <Laptop size={40} weight="fill" />;
        if (lowerName.includes('dslr') || lowerName.includes('camera')) return <Camera size={40} weight="fill" />;
        if (lowerName.includes('all in one') || lowerName.includes('desktop')) return <Desktop size={40} weight="fill" />;
        if (lowerName.includes('ipad') || lowerName.includes('tablet')) return <DeviceTablet size={40} weight="fill" />;
        if (lowerName.includes('smartphone') || lowerName.includes('phone')) return <DeviceMobile size={40} weight="fill" />;
        return <Laptop size={40} weight="fill" />;
    };

    if (loading) return null;
    if (!cmsConfig.enabled) return null;

    // On mobile: show up to 7 categories + 1 "View All" tile in a unified 4-column grid
    const mobileCats = displayCategories.slice(0, 7);

    return (
        <section
            className="py-6 md:pt-12 md:pb-24 relative overflow-hidden"
            style={{
                background: 'var(--color-grey-grey-50, hsla(0, 0%, 96%, 1))'
            }}
        >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between mb-4 md:mb-12">
                    <h2
                        className="text-[24px] md:text-[36px] leading-[32px] md:leading-[45px]"
                        style={{
                            fontFamily: '"Mona Sans", sans-serif',
                            fontWeight: 600,
                            letterSpacing: '-0.02em',
                            color: 'hsla(0, 0%, 20%, 1)',
                            margin: 0
                        }}
                    >
                        {cmsConfig.title}
                    </h2>
                    <Link
                        href="/categories"
                        className="btn-primary hidden md:inline-flex text-[14px]"
                    >
                        Explore
                    </Link>
                </div>

                {/* Mobile Grid View */}
                <div className={`${viewType === 'mobile' ? 'grid' : 'hidden'} grid-cols-4 gap-[10px]`}>
                    {displayCategories.slice(0, 7).map((cat, index) => (
                        <Link key={cat._id || index} href={getCategoryRoute(cat)} className="flex flex-col items-center">
                            <div className="w-[80px] h-[78px] rounded-[10px] bg-white border border-gray-100 flex items-center justify-center overflow-hidden relative shadow-sm">
                                {cat.image ? (
                                    <Image
                                        src={cat.image}
                                        alt={cat.name}
                                        fill
                                        className="object-contain mix-blend-multiply brightness-[1.05] contrast-[1.05]"
                                    />
                                ) : (
                                    <div className="text-gray-400">
                                        {getIconForCategory(cat.name)}
                                    </div>
                                )}
                            </div>
                            <span className="text-[11px] font-semibold font-sans text-[#4b5563] text-center mt-2 leading-tight">{cat.name}</span>
                        </Link>
                    ))}

                    {/* View All Tile */}
                    <Link href="/categories" className="flex flex-col items-center">
                        <div className="w-[80px] h-[78px] rounded-[10px] bg-[#fff3d4] border border-[#fbd38d]/30 flex flex-col items-center justify-center gap-1 shadow-sm">
                            <span className="text-[10px] font-semibold font-sans text-[#d97706] leading-tight">View All</span>
                            <div className="w-6 h-6 rounded-full bg-[#f6ad55] flex items-center justify-center">
                                <ArrowRight size={8} weight="fill" className="text-white" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Tablet/Desktop Swiper */}
                <div className={`${viewType === 'mobile' ? 'hidden' : 'block'} relative`}>
                    <div style={{
                        width: viewType === 'tablet' ? '708px' : '100%',
                        height: viewType === 'tablet' ? '208px' : 'auto',
                        margin: viewType === 'tablet' ? '0 auto' : undefined,
                        overflow: 'hidden'
                    }}>
                        <Swiper
                            modules={[Navigation, Autoplay, Scrollbar]}
                            spaceBetween={viewType === 'tablet' ? 15 : 24}
                            slidesPerView={'auto'}
                            navigation={{
                                nextEl: '.swiper-next-cat',
                                prevEl: '.swiper-prev-cat',
                            }}
                            scrollbar={{
                                el: '.swiper-scrollbar-cat',
                                draggable: true,
                                hide: false,
                            }}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            className="!pb-0"
                        >
                            {displayCategories.map((cat, index) => (
                                <SwiperSlide key={cat._id || index} style={{ width: viewType === 'tablet' ? '165px' : '177px' }}>
                                    <Link href={getCategoryRoute(cat)} className="group flex flex-col items-center cursor-pointer">
                                        <div
                                            className="flex items-center justify-center mb-2 relative bg-white border border-gray-200 rounded-xl group-hover:border-orange-300/20 group-hover:shadow-lg transition-all duration-300 overflow-hidden shadow-md"
                                            style={{
                                                width: viewType === 'tablet' ? '165px' : '177px',
                                                height: viewType === 'tablet' ? '158px' : '173px'
                                            }}
                                        >
                                            {cat.image ? (
                                                <Image
                                                    src={cat.image}
                                                    alt={cat.name}
                                                    fill
                                                    className="object-contain mix-blend-multiply brightness-[1.05] contrast-[1.05]"
                                                />
                                            ) : (
                                                <div className="text-gray-400 group-hover:text-orange-300 transition-colors">
                                                    {getIconForCategory(cat.name)}
                                                </div>
                                            )}
                                        </div>
                                        <h3
                                            className="font-semibold font-sans text-gray-600 text-center group-hover:text-gray-700 transition-colors"
                                            style={{ fontSize: viewType === 'tablet' ? '12px' : '15px' }}
                                        >
                                            {cat.name}
                                        </h3>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Figma: scrollbar row — width 1164, height 34, gap 24px from cards */}
                    <div className="hidden md:flex items-center gap-6 mt-6">
                        {/* Progress scrollbar — Figma: h=0px border=3.5px solid #333 */}
                        <div
                            className="swiper-scrollbar-cat flex-1"
                            style={{ height: '3.5px', position: 'relative' }}
                        />
                        {/* Nav arrows */}
                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                className="swiper-prev-cat group w-[34px] h-[34px] rounded-[69px] flex items-center justify-center bg-[hsla(0,0%,93%,1)] hover:bg-[hsla(0,0%,20%,1)] transition-all"
                                style={{ opacity: 1 }}
                                aria-label="Previous"
                            >
                                <ChevronLeftIcon className="w-[18px] h-[18px] text-gray-800 group-hover:text-white transition-colors duration-200" />
                            </button>
                            <button
                                className="swiper-next-cat group w-[34px] h-[34px] rounded-[69px] flex items-center justify-center bg-[hsla(0,0%,93%,1)] hover:bg-[hsla(0,0%,20%,1)] transition-all"
                                style={{ opacity: 1 }}
                                aria-label="Next"
                            >
                                <ChevronRightIcon className="w-[18px] h-[18px] text-gray-800 group-hover:text-white transition-colors duration-200" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                /* Kill Swiper's default ::after arrow injection on all nav buttons */
                .swiper-prev-cat::after,
                .swiper-next-cat::after,
                .swiper-prev-cat-mobile::after,
                .swiper-next-cat-mobile::after {
                    content: none !important;
                    display: none !important;
                }
                /* Scrollbar track — very subtle light line */
                .swiper-scrollbar-cat,
                .swiper-scrollbar-cat-mobile {
                    background: hsla(0, 0%, 20%, 0.12) !important;
                    border-radius: 0 !important;
                    height: 3.5px !important;
                    overflow: hidden;
                    position: relative;
                }
                /* Scrollbar drag thumb — dark charcoal per Figma */
                .swiper-scrollbar-cat .swiper-scrollbar-drag,
                .swiper-scrollbar-cat-mobile .swiper-scrollbar-drag {
                    background: hsla(0, 0%, 20%, 1) !important;
                    border-radius: 0 !important;
                    cursor: grab;
                    height: 100% !important;
                    top: 0 !important;
                }
                .swiper-scrollbar-cat .swiper-scrollbar-drag:active,
                .swiper-scrollbar-cat-mobile .swiper-scrollbar-drag:active {
                    cursor: grabbing;
                }
                /* Disable arrow when at start/end */
                .swiper-prev-cat.swiper-button-disabled,
                .swiper-next-cat.swiper-button-disabled,
                .swiper-prev-cat-mobile.swiper-button-disabled,
                .swiper-next-cat-mobile.swiper-button-disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                    pointer-events: none;
                }
            `}</style>
        </section>
    );
};

export default RentByCategory;
