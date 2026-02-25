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

const RentByCategory = () => {
    const [displayCategories, setDisplayCategories] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();

                // Define the specific order requested
                const targetOrder = ["MacBook", "DSLR", "All in One", "iPad", "SmartPhone", "Desktop"];

                // 1. Strict Match
                let sortedCategories = targetOrder.map(name => {
                    const found = data.find(c => c.name.toLowerCase() === name.toLowerCase());
                    return found ? found : null;
                }).filter(item => item !== null);

                // 2. Loose Match (if strict match yields nothing)
                if (sortedCategories.length === 0 && data.length > 0) {
                    sortedCategories = targetOrder.map(name => {
                        const found = data.find(c => c.name.toLowerCase().includes(name.toLowerCase()));
                        return found ? found : null;
                    }).filter(item => item !== null);
                }

                // 3. Fallback (if still nothing, just show what we have, prioritizing those with images)
                if (sortedCategories.length === 0 && data.length > 0) {
                    sortedCategories = data
                        .filter(c => c.image) // Prefer with images
                        .slice(0, 10);

                    if (sortedCategories.length === 0) {
                        sortedCategories = data.slice(0, 10); // Take anything
                    }
                }

                // Deduplicate based on ID
                sortedCategories = Array.from(new Map(sortedCategories.map(item => [item._id, item])).values());

                setDisplayCategories(sortedCategories);
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

    // On mobile: show up to 7 categories + 1 "View All" tile in a unified 4-column grid
    const mobileCats = displayCategories.slice(0, 7);

    return (
        <section className="py-8 md:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6 md:mb-12">
                    <h2 className="text-4xl font-semibold font-manrope text-gray-900 tracking-tight">Rent by Category</h2>
                    <Link
                        href="/categories"
                        className="hidden md:inline-flex items-center gap-2 px-6 py-2 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-full transition-colors"
                    >
                        Explore
                        <FaArrowRight size={8} />
                    </Link>
                </div>

                {/* Mobile Grid: unified 4-column grid — categories + View All tile (all same size) */}
                <div className="md:hidden grid grid-cols-4 gap-2">
                    {mobileCats.map((cat) => (
                        <Link key={cat._id} href={`/category/${cat.slug || cat._id}`} className="flex flex-col items-center">
                            <div className="w-full aspect-square rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden relative">
                                {cat.image ? (
                                    <Image
                                        src={cat.image}
                                        alt={cat.name}
                                        fill
                                        className="object-contain p-2"
                                    />
                                ) : (
                                    <div className="text-gray-400">
                                        {getIconForCategory(cat.name)}
                                    </div>
                                )}
                            </div>
                            <span className="text-[10px] font-medium text-gray-600 text-center mt-1.5 leading-tight">{cat.name}</span>
                        </Link>
                    ))}

                    {/* View All Tile — same size as category tiles */}
                    <Link href="/categories" className="flex flex-col items-center">
                        <div className="w-full aspect-square rounded-2xl bg-[#FFF3CD] border border-[#FFE082] flex flex-col items-center justify-center gap-1.5">
                            <span className="text-[11px] font-semibold text-gray-700 leading-tight">View All</span>
                            <div className="w-7 h-7 rounded-full bg-[#FFC107] flex items-center justify-center">
                                <FaArrowRight size={10} className="text-gray-900" />
                            </div>
                        </div>
                        <span className="text-[10px] font-medium text-gray-600 text-center mt-1.5 leading-tight opacity-0 select-none">_</span>
                    </Link>
                </div>

                {/* Desktop Swiper */}
                <div className="hidden md:block relative">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={2}
                        navigation
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 3,
                            },
                            768: {
                                slidesPerView: 4,
                            },
                            1024: {
                                slidesPerView: 6,
                            },
                        }}
                        className="py-4 overflow-visible!"
                    >
                        {displayCategories.map((cat) => (
                            <SwiperSlide key={cat._id}>
                                <div className="group flex flex-col items-center p-4 bg-white border border-gray-50 rounded-3xl hover:border-gray-200 transition-all duration-300 cursor-pointer h-full relative">
                                    <div className="w-full aspect-square flex items-center justify-center mb-3 relative">
                                        {cat.image ? (
                                            <div className="relative w-full h-full p-2">
                                                <Image
                                                    src={cat.image}
                                                    alt={cat.name}
                                                    fill
                                                    className="object-contain drop-shadow-sm"
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-gray-400 group-hover:text-indigo-600 transition-colors">
                                                {getIconForCategory(cat.name)}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-900 text-center">
                                        {cat.name}
                                    </h3>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Mobile Explore Button */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/categories"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-full transition-colors"
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
