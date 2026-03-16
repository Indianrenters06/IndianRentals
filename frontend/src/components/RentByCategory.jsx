"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';
import { FaLaptop, FaCamera, FaDesktop, FaTabletAlt, FaMobileAlt, FaArrowRight } from 'react-icons/fa';
import { getCategories } from '../services/categoryService';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
    const [displayCategories, setDisplayCategories] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [cmsConfig, setCmsConfig] = React.useState({
        enabled: true,
        title: "Rent by Category"
    });

    const getCategoryRoute = (cat) => {
        const lowerName = cat.name.toLowerCase();
        for (const [key, route] of Object.entries(CATEGORY_ROUTES)) {
            if (lowerName.includes(key)) return route;
        }
        return `/category/${cat.slug || cat._id}`;
    };

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();

                // Define the specific order requested
                const targetOrder = ["MacBook", "DSLR", "All In One", "iPad", "SmartPhone", "Desktop"];

                // 1. Strict Match
                let sortedCategories = targetOrder.map(name => {
                    const found = data.find(c => c.name.toLowerCase() === name.toLowerCase());
                    if (found) {
                        // Override name with the target name for consistent casing/manrope look
                        return { ...found, name };
                    }
                    return null;
                }).filter(item => item !== null);

                // 2. Loose Match (if strict match yields nothing)
                if (sortedCategories.length === 0 && data.length > 0) {
                    sortedCategories = targetOrder.map(name => {
                        const found = data.find(c => c.name.toLowerCase().includes(name.toLowerCase()));
                        if (found) {
                            return { ...found, name };
                        }
                        return null;
                    }).filter(item => item !== null);
                }
                // ... (rest of search logic)
                // Deduplicate based on ID
                sortedCategories = Array.from(new Map(sortedCategories.map(item => [item._id, item])).values());

                // Clean up dummy images and provide high-quality local fallbacks
                const MACBOOK_IMAGE = "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1769200258/WhatsApp_Image_2026-01-23_at_23.58._j7jcoq.jpg";

                sortedCategories = sortedCategories.map(cat => {
                    const lowerName = cat.name.toLowerCase();
                    const hasDatabaseImage = cat.image && cat.image.length > 5 && !cat.image.includes('unsplash') && !cat.image.includes('placeholder');

                    // If it's a MacBook, we ALWAYS want to use the preferred image provided by the user
                    if (lowerName.includes('macbook')) {
                        return { ...cat, image: MACBOOK_IMAGE };
                    }

                    // If NO valid image from DB for other categories, use our high-quality local assets as backup
                    if (!hasDatabaseImage) {
                        if (lowerName.includes('ipad')) return { ...cat, image: '/ipad-new.jpg' };
                        if (lowerName.includes('desktop')) return { ...cat, image: '/mac-pro-new.jpg' };
                        if (lowerName.includes('all in one')) return { ...cat, image: '/it-products-new.jpg' };
                        if (lowerName.includes('dslr') || lowerName.includes('camera')) return { ...cat, image: '/office-equipment-new.jpg' };
                    }

                    return cat;
                });

                setDisplayCategories(sortedCategories);

                // Fetch CMS Config for the section title/visibility
                const cmsRes = await fetch(`${API}/api/cms/homepage`, { cache: 'no-store' });
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
        if (lowerName.includes('macbook')) return <FaLaptop size={40} />;
        if (lowerName.includes('dslr') || lowerName.includes('camera')) return <FaCamera size={40} />;
        if (lowerName.includes('all in one')) return <FaDesktop size={40} />;
        if (lowerName.includes('ipad')) return <FaTabletAlt size={40} />;
        if (lowerName.includes('smartphone') || lowerName.includes('phone')) return <FaMobileAlt size={40} />;
        if (lowerName.includes('desktop')) return <FaDesktop size={40} />;
        return <FaLaptop size={40} />;
    };

    if (loading) return null;
    if (!cmsConfig.enabled) return null;

    // On mobile: show up to 7 categories + 1 "View All" tile in a unified 4-column grid
    const mobileCats = displayCategories.slice(0, 7);

    return (
        <section className="py-8 md:py-20 bg-white">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6 md:mb-12">
                    <h2 className="text-4xl font-semibold font-manrope text-gray-900 tracking-tight">{cmsConfig.title}</h2>
                    <Link
                        href="/categories"
                        className="hidden md:inline-flex items-center gap-2 px-6 py-2 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-full transition-colors"
                    >
                        Explore
                        <FaArrowRight size={8} />
                    </Link>
                </div>

                {/* Mobile Grid: updated to match requested card style */}
                <div className="md:hidden grid grid-cols-4 gap-3">
                    {mobileCats.map((cat, index) => (
                        <Link key={cat._id || index} href={getCategoryRoute(cat)} className="flex flex-col items-center">
                            <div className="w-full aspect-square rounded-lg bg-white border border-gray-100 flex items-center justify-center overflow-hidden relative shadow-sm">
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
                            <span className="text-[10px] font-semibold font-manrope text-gray-600 text-center mt-2 leading-tight">{cat.name}</span>
                        </Link>
                    ))}

                    {/* View All Tile — same size as category tiles */}
                    <Link href="/categories" className="flex flex-col items-center">
                        <div className="w-full aspect-square rounded-lg bg-white border border-[#FFC107]/30 flex flex-col items-center justify-center gap-1.5 shadow-sm">
                            <span className="text-[11px] font-semibold font-manrope text-gray-600 leading-tight">View All</span>
                            <div className="w-7 h-7 rounded-full bg-[#FFC107] flex items-center justify-center">
                                <FaArrowRight size={10} className="text-gray-900" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Desktop Swiper */}
                <div className="hidden md:block relative">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={'auto'}
                        navigation
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        className="py-4"
                    >
                        {displayCategories.map((cat, index) => (
                            <SwiperSlide key={cat._id || index} style={{ width: '177.33px' }}>
                                <Link href={getCategoryRoute(cat)} className="group flex flex-col items-center cursor-pointer">
                                    <div className="w-[177.33px] h-[173px] flex items-center justify-center mb-4 relative bg-white border border-gray-200 rounded-xl group-hover:border-[#FFC107]/20 group-hover:shadow-lg transition-all duration-300 overflow-hidden shadow-md">
                                        {cat.image ? (
                                            <Image
                                                src={cat.image}
                                                alt={cat.name}
                                                fill
                                                className="object-contain mix-blend-multiply brightness-[1.05] contrast-[1.05] group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="text-gray-400 group-hover:text-[#FFC107] transition-colors">
                                                {getIconForCategory(cat.name)}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-[15px] font-semibold font-manrope text-gray-600 text-center group-hover:text-gray-700 transition-colors">
                                        {cat.name}
                                    </h3>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Mobile Explore Button */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/categories"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold font-manrope rounded-full transition-colors"
                        >
                            Explore Categories
                            <FaArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RentByCategory;
