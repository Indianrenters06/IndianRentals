"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import { FaLaptop, FaCamera, FaDesktop, FaTabletAlt, FaMobileAlt, FaArrowRight } from 'react-icons/fa';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const categories = [
    { id: 1, name: "MacBook", icon: <FaLaptop size={40} />, color: "bg-gray-100" },
    { id: 2, name: "DSLR", icon: <FaCamera size={40} />, color: "bg-gray-100" },
    { id: 3, name: "All in One", icon: <FaDesktop size={40} />, color: "bg-gray-100" },
    { id: 4, name: "iPad", icon: <FaTabletAlt size={40} />, color: "bg-gray-100" },
    { id: 5, name: "SmartPhone", icon: <FaMobileAlt size={40} />, color: "bg-gray-100" },
    { id: 6, name: "Desktop", icon: <FaDesktop size={40} />, color: "bg-gray-100" }, // Using generic desktop icon
    { id: 7, name: "Gaming", icon: <FaLaptop size={40} />, color: "bg-gray-100" },
];

const RentByCategory = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Rent by Category</h2>
                    <Link
                        href="/categories"
                        className="hidden md:inline-flex items-center gap-2 px-6 py-2 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-full transition-colors"
                    >
                        Explore
                        <FaArrowRight size={14} />
                    </Link>
                </div>

                <div className="relative">
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
                        className="py-4 !overflow-visible"
                    >
                        {categories.map((cat) => (
                            <SwiperSlide key={cat.id}>
                                <div className="group flex flex-col items-center p-6 bg-white border border-gray-100 rounded-[2rem] hover:shadow-lg transition-all duration-300 cursor-pointer h-full aspect-[4/5] justify-between">
                                    <div className={`w-full flex-1 flex items-center justify-center ${cat.color} rounded-2xl mb-4 group-hover:scale-105 transition-transform duration-300`}>
                                        <div className="text-gray-700 group-hover:text-indigo-600 transition-colors">
                                            {cat.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors text-center">
                                        {cat.name}
                                    </h3>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Mobile Explore Button */}
                    <div className="mt-8 text-center md:hidden">
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
