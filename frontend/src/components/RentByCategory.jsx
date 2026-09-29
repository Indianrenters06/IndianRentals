"use client";
import { cmsUrl } from '@/lib/cmsPreview';
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';
import { Laptop, Camera, Desktop, DeviceTablet, DeviceMobile } from '@phosphor-icons/react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { SwiperControls } from './CarouselControls';
import styles from './RentByCategory.module.css';
import { getCategories } from '../services/categoryService';

// Import Swiper styles
import 'swiper/css';

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
                const cmsRes = await fetch(cmsUrl('homepage'));
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

    const catCardW = viewType === 'tablet' ? 165 : 183;
    const catGap = viewType === 'tablet' ? 15 : 20;
    const [catSwiper, setCatSwiper] = useState(null);

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

    return (
        <section
            className={`${styles.section} py-6 md:pt-12 md:pb-0 relative overflow-hidden`}
        >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-0 md:border-b-[0.7px] md:border-[#E2E2E2] md:pb-24">
                {/* Figma gap is 32px header→cards; the Swiper below adds 12px of its own
                    top padding (!py-3), so the margin carries only the remaining 20px. */}
                <div className="flex items-center justify-between mb-4 md:mb-5">
                    <h2
                        className="text-[24px] md:text-[36px] leading-[32px] md:leading-[45px]"
                        style={{
                            fontFamily: '"Mona Sans", sans-serif',
                            fontWeight: 600,
                            letterSpacing: '-0.8px',
                            color: 'hsla(0, 0%, 20%, 1)',
                            margin: 0
                        }}
                    >
                        {cmsConfig.title}
                    </h2>
                    <Link
                        href="/categories"
                        className="btn-primary hidden md:inline-flex text-[14px] lg:text-[16px] lg:leading-[23px] lg:tracking-[-0.4px] lg:h-[35px]"
                    >
                        Explore
                    </Link>
                </div>

                {/* Mobile Grid View */}
                <div className={`${viewType === 'mobile' ? 'grid' : 'hidden'} grid-cols-4 gap-[10px]`}>
                    {displayCategories.slice(0, 7).map((cat, index) => (
                        <Link key={cat._id || index} href={getCategoryRoute(cat)} className="flex flex-col items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] rounded-xl">
                            <div className="w-full max-w-[80px] aspect-[80/78] rounded-[10px] bg-white border border-gray-100 flex items-center justify-center overflow-hidden relative shadow-sm">
                                {cat.image ? (
                                    <Image
                                        src={cat.image}
                                        alt={cat.name}
                                        fill
                                        className="object-cover"
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
                    <Link href="/categories" className="flex flex-col items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] rounded-xl">
                        <div className={styles.viewAllTile}>
                            <span className={styles.viewAllLabel}>View All</span>
                            <span className={styles.viewAllIcon} aria-hidden="true">
                                <ChevronRightIcon />
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Tablet/Desktop Swiper */}
                <div className={`${viewType === 'mobile' ? 'hidden' : 'block'} relative`}>
                    <div className="overflow-hidden">
                                <Swiper
                                    modules={[A11y]}
                                    spaceBetween={catGap}
                                    slidesPerView={'auto'}
                                    slidesPerGroup={1}
                                    onSwiper={setCatSwiper}
                                    className="!py-3"
                                >
                                    {displayCategories.map((cat, index) => (
                                        <SwiperSlide key={cat._id || index} style={{ width: `${catCardW}px` }}>
                                            <Link href={getCategoryRoute(cat)} className="group flex flex-col items-center cursor-pointer">
                                                <div
                                                    className="cat-card flex items-center justify-center mb-[7px] relative bg-white border-2 border-[#eee] rounded-xl overflow-hidden"
                                                    style={{
                                                        width: viewType === 'tablet' ? '165px' : '183px',
                                                        height: viewType === 'tablet' ? '158px' : '173px',
                                                    }}
                                                >
                                                    {cat.image ? (
                                                        <Image
                                                            src={cat.image}
                                                            alt={cat.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="text-gray-400 group-hover:text-orange-300 transition-colors">
                                                            {getIconForCategory(cat.name)}
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Figma Typography/text-xl/Semi Bold: Mona Sans 600,
                                            21/28, -0.8px tracking, grey-600. */}
                                                <h3
                                                    className="text-center transition-colors"
                                                    style={{
                                                        fontFamily: '"Mona Sans", sans-serif',
                                                        fontWeight: 600,
                                                        fontSize: viewType === 'tablet' ? '18px' : '21px',
                                                        lineHeight: viewType === 'tablet' ? '24px' : '28px',
                                                        letterSpacing: '-0.8px',
                                                        color: '#545454'
                                                    }}
                                                >
                                                    {cat.name}
                                                </h3>
                                            </Link>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                    </div>

                    <SwiperControls swiper={catSwiper} count={displayCategories.length} label="Categories" />
                </div>
            </div>

            <style>{`
                /* Category card — flat (Figma) shadow + hover lift */
                .cat-card {
                    box-shadow:
                        0px 58px 16px 0px rgba(222,222,222,0),
                        0px 37px 15px 0px rgba(222,222,222,0.01),
                        0px 21px 13px 0px rgba(222,222,222,0.04),
                        0px 9px 9px 0px rgba(222,222,222,0.07),
                        0px 2px 5px 0px rgba(222,222,222,0.08);
                    transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
                    will-change: transform;
                }
                .group:hover .cat-card {
                    transform: scale(1.02);
                }
            `}</style>
        </section>
    );
};

export default RentByCategory;
