'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PiGauge, PiSmiley } from 'react-icons/pi';
import BestRentedProducts from '../../components/BestRentedProducts';
import FaqSection from '../../components/FaqSection';

import { API } from '@/services/apiConfig';

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState('vision');
    const [cmsBanner, setCmsBanner] = useState({ image: null, title: null });

    useEffect(() => {
        fetch(`${API}/api/cms/about`)
            .then(r => r.ok ? r.json() : null)
            .then(d => {
                if (d) setCmsBanner({ image: d.bannerImage || null, title: d.bannerTitle || null });
            })
            .catch(() => { });
    }, []);

    return (
        <div className="text-gray-800 pb-20">
            {/* 1. Header Image/Banner */}
            <section className="w-full max-w-[1440px] mx-auto mt-8 mb-16">
                <div 
                    className="max-w-[1200px] mx-auto px-4 md:px-8"
                >
                    <div className="w-full h-[500px] relative bg-gray-200 overflow-hidden rounded-3xl">
                    <Image
                        src={cmsBanner.image || "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770800853/91c997360fd8d0ad44588aaaed2a31db6de1b8db_dck9cz.jpg"}
                        alt="About Us Banner"
                        fill
                        className="object-cover object-center"
                    />
                    {/* Overlay Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-white text-4xl md:text-6xl font-semibold drop-shadow-lg font-sans">
                            {cmsBanner.title || "About Us"}
                        </h1>
                    </div>
                </div>
            </div>
        </section>

            {/* 2. Our Story Section */}
            <section className="w-full max-w-[1440px] mx-auto mb-24">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-[57px] items-center">
                    {/* Left Content */}
                    <div className="flex flex-col gap-[27px] opacity-100">
                        <h2 className="text-4xl md:text-5xl font-semibold leading-tight font-sans text-gray-900">Our Story</h2>

                        <div className="text-gray-900 font-sans font-normal flex flex-col gap-6">
                            <p className="leading-relaxed opacity-100 text-[16px]">
                                From a small computer training room in 1992 to India&apos;s go-to rental partner, this
                                journey has been about making access smarter than ownership. The promise stays
                                simple: rent anything needed, when it&apos;s needed, anywhere it&apos;s needed—without
                                friction.
                            </p>
                            <p className="leading-relaxed opacity-100 text-[16px]">
                                Today, a 100+ product catalog powers startups, enterprises, and events across
                                major cities, backed by fast delivery, clean gear, and dependable support. The
                                focus is outcomes setups that just work, terms that fit, and service that shows up.
                            </p>
                        </div>

                        {/* Stats with Icons */}
                        <div className="flex flex-wrap gap-8 md:gap-12 mt-4">
                            {/* Stat 1 */}
                            <div className="flex flex-col">
                                <div className="w-[76px] h-[76px] bg-[#FF8A00] rounded-xl flex items-center justify-center text-white mb-3 shadow-sm">
                                    <PiGauge size={50} weight="bold" />
                                </div>
                                <h3 className="text-3xl font-bold font-sans text-gray-900">4.8/5.0</h3>
                                <p className="text-sm font-medium text-gray-500 font-sans mt-1">Customer Satisfaction</p>
                            </div>

                            {/* Stat 2 */}
                            <div className="flex flex-col">
                                <div className="w-[76px] h-[76px] bg-[#FF8A00] rounded-xl flex items-center justify-center text-white mb-3 shadow-sm">
                                    <PiSmiley size={50} weight="bold" />
                                </div>
                                <h3 className="text-3xl font-bold font-sans text-gray-900">10,000+</h3>
                                <p className="text-sm font-medium text-gray-500 font-sans mt-1">Happy Clients</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative w-full aspect-[581/625] max-h-[625px] rounded-3xl overflow-hidden bg-gray-100 shadow-sm">
                        <Image
                            src="https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770800851/d271e76a95431ea60b52889370f378908ea28e43_qiucu1.jpg"
                            alt="Our Story"
                            fill
                            className="object-cover object-center"
                        />
                    </div>
                </div>
            </section>
            {/* 3. Vision/Mission Section */}
            <section className="w-full max-w-[1440px] mx-auto mb-24">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                    <div className="w-full bg-[#FDE68A] rounded-3xl pt-10 pb-14 px-10 flex flex-col lg:flex-row gap-12 items-start opacity-100 transition-all">
                    {/* Left Side: Buttons */}
                    <div className="flex gap-4 w-full lg:w-[350px] shrink-0">
                        <button
                            onClick={() => setActiveTab('vision')}
                            className={`h-[45px] px-8 rounded-full font-medium font-sans text-lg transition-all hover:scale-[1.02] active:scale-95 ${activeTab === 'vision'
                                ? 'bg-black text-white shadow-lg'
                                : 'border-2 border-black/10 text-gray-800 hover:bg-black/5'
                                }`}
                        >
                            Our Vision
                        </button>
                        <button
                            onClick={() => setActiveTab('mission')}
                            className={`h-[45px] px-8 rounded-full font-medium font-sans text-lg transition-all hover:scale-[1.02] active:scale-95 ${activeTab === 'mission'
                                ? 'bg-black text-white shadow-lg'
                                : 'border-2 border-black/10 text-gray-800 hover:bg-black/5'
                                }`}
                        >
                            Our Mission
                        </button>
                    </div>

                    {/* Right Side: Content List */}
                    <div className="flex-1 flex flex-col gap-8 opacity-100">
                        {activeTab === 'vision' ? (
                            <>
                                <div className="flex flex-col md:flex-row items-start gap-4 border-b border-black/10 pb-6">
                                    <h3 className="text-[20px] font-bold text-gray-900 font-sans md:w-[220px] shrink-0">Rent Anything</h3>
                                    <p className="text-gray-800 font-sans leading-relaxed text-[15px]">
                                        Laptops, Macs, mobiles, AV, cameras, medical and more—if it&apos;s not listed, it&apos;s sourced on request.
                                    </p>
                                </div>
                                <div className="flex flex-col md:flex-row items-start gap-4 border-b border-black/10 pb-6">
                                    <h3 className="text-[20px] font-bold text-gray-900 font-sans md:w-[220px] shrink-0">Rent Anytime</h3>
                                    <p className="text-gray-800 font-sans leading-relaxed text-[15px]">
                                        Tenures that fit the job: 1, 3, 6, or 12 months, with easy extensions and mid-term upgrades.
                                    </p>
                                </div>
                                <div className="flex flex-col md:flex-row items-start gap-4">
                                    <h3 className="text-[20px] font-bold text-gray-900 font-sans md:w-[220px] shrink-0">Rent Anywhere</h3>
                                    <p className="text-gray-800 font-sans leading-relaxed text-[15px]">
                                        Rapid delivery and support across major Indian cities through a reliable partner network.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col md:flex-row items-start gap-4 border-b border-black/10 pb-6">
                                    <h3 className="text-[20px] font-bold text-gray-900 font-sans md:w-[220px] shrink-0">Awesome Service</h3>
                                    <p className="text-gray-800 font-sans leading-relaxed text-[15px]">
                                        Laptops, Macs, mobiles, AV, cameras, medical and more—if it&apos;s not listed, it&apos;s sourced on request.
                                    </p>
                                </div>
                                <div className="flex flex-col md:flex-row items-start gap-4 border-b border-black/10 pb-6">
                                    <h3 className="text-[20px] font-bold text-gray-900 font-sans md:w-[220px] shrink-0">Awesome Quality</h3>
                                    <p className="text-gray-800 font-sans leading-relaxed text-[15px]">
                                        Tenures that fit the job: 1, 3, 6, or 12 months, with easy extensions and mid-term upgrades.
                                    </p>
                                </div>
                                <div className="flex flex-col md:flex-row items-start gap-4">
                                    <h3 className="text-[20px] font-bold text-gray-900 font-sans md:w-[220px] shrink-0">Happy Customers</h3>
                                    <p className="text-gray-800 font-sans leading-relaxed text-[15px]">
                                        Rapid delivery and support across major Indian cities through a reliable partner network.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>

            {/* 4. Why Choose Us Section */}
            <section className="w-full max-w-[1440px] mx-auto mb-24">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content (Text + Stats) */}
                    <div>
                        <h2 className="text-[40px] font-semibold mb-6 font-sans text-gray-900 leading-tight tracking-tight">Why Choose Us?</h2>
                        <p className="text-[16px] font-normal mb-8 leading-relaxed text-gray-600 font-sans">
                            Join thousands who&apos;ve switched to the flexible, affordable way to access
                            high-end tech. IndianRenters delivers AI-ready workstations, laptops, and IT
                            gear with zero ownership hassle and instant support.
                        </p>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                            <div>
                                <h3 className="text-[32px] md:text-[40px] font-bold font-sans text-gray-900 mb-1">90k+</h3>
                                <p className="text-sm font-medium text-gray-500 font-sans">Devices in Stock</p>
                            </div>
                            <div>
                                <h3 className="text-[32px] md:text-[40px] font-bold font-sans text-gray-900 mb-1">30k+</h3>
                                <p className="text-sm font-medium text-gray-500 font-sans">Happy Customers</p>
                            </div>
                            <div>
                                <h3 className="text-[32px] md:text-[40px] font-bold font-sans text-gray-900 mb-1">401+</h3>
                                <p className="text-sm font-medium text-gray-500 font-sans">Cities Covered</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative w-full aspect-[508/336] rounded-3xl overflow-hidden bg-gray-100 shadow-sm">
                        <Image
                            src="https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770800855/fe78b663b8ebf91f8e21a43e75ce3b0ac6a6b6b9_lvbsuv.png"
                            alt="Why Choose Us"
                            fill
                            className="object-cover object-center"
                        />
                    </div>
                </div>
            </section>

            {/* 5. FAQ Section */}
            <FaqSection />

            {/* 6. Best Rented Products Section */}
            <BestRentedProducts />
        </div>
    );
}
