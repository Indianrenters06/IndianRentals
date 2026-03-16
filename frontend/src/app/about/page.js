'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PiGauge, PiSmiley } from 'react-icons/pi';
import BestRentedProducts from '../../components/BestRentedProducts';
import FaqSection from '../../components/FaqSection';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
            <div className="max-w-[1200px] mx-auto  sm:px-16 lg:px-3 mt-8 mb-16">
                <div className="w-[1200px] h-[500px] relative bg-gray-200 overflow-hidden rounded-3xl opacity-100">
                    <Image
                        src={cmsBanner.image || "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770800853/91c997360fd8d0ad44588aaaed2a31db6de1b8db_dck9cz.jpg"}
                        alt="About Us Banner"
                        fill
                        className="object-cover object-center"
                    />
                    {/* Overlay Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-white text-4xl md:text-6xl font-semibold drop-shadow-lg">
                            {cmsBanner.title || "About Us"}
                        </h1>
                    </div>
                </div>
            </div>

            {/* 2. Our Story Section */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-3 mb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[57px] items-center h-[625px] opacity-100">
                    {/* Left Content */}
                    <div className="w-[562px] h-[429px] flex flex-col gap-[27px] opacity-100">
                        <h2 className="w-[492px] h-[58px] text-4xl md:text-5xl font-medium leading-tight font-manrope text-gray-900 opacity-100">Our Story</h2>

                        <div className="w-[587px] h-[344px] text-gray-900 font-manrope font-normal flex flex-col opacity-100">
                            <p className="w-[596px] h-[178px] leading-tight  opacity-100">
                                From a small computer training room in 1992 to India&apos;s go-to rental partner, this
                                journey has been about making access smarter than ownership. The promise stays
                                simple: rent anything needed, when it&apos;s needed, anywhere it&apos;s needed—without
                                friction.
                            </p>
                            <p className="w-[596px] h-[178px] leading-tight opacity-100 -mt-20">
                                Today, a 100+ product catalog powers startups, enterprises, and events across
                                major cities, backed by fast delivery, clean gear, and dependable support. The
                                focus is outcomes setups that just work, terms that fit, and service that shows up.
                            </p>
                        </div>

                        {/* Stats with Icons */}
                        <div className="flex flex-wrap gap-8 md:gap-12 -mt-25">
                            {/* Stat 1 */}
                            <div className="flex flex-col">
                                <div className="w-[76px] h-[76px] bg-[#FF8A00] rounded-xl flex items-center justify-center text-white mb-3 shadow-sm">
                                    <PiGauge size={50} weight="bold" />
                                </div>
                                <h3 className="text-3xl font-bold font-manrope text-gray-900">4.8/5.0</h3>
                                <p className="text-sm font-medium text-gray-500 font-manrope mt-1">Customer Satisfaction Rate</p>
                            </div>

                            {/* Stat 2 */}
                            <div className="flex flex-col">
                                <div className="w-[76px] h-[76px] bg-[#FF8A00] rounded-xl flex items-center justify-center text-white mb-3 shadow-sm">
                                    <PiSmiley size={50} weight="bold" />
                                </div>
                                <h3 className="text-3xl font-bold font-manrope text-gray-900">10,000+</h3>
                                <p className="text-sm font-medium text-gray-500 font-manrope mt-1">Happy Clients</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative w-[581px] h-[625px] rounded-3xl overflow-hidden bg-gray-100 shadow-sm opacity-100">
                        {/* Placeholder for Story Image */}
                        <Image
                            src="https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770800851/d271e76a95431ea60b52889370f378908ea28e43_qiucu1.jpg"
                            alt="Our Story"
                            fill
                            className="object-cover object-center"
                        />
                    </div>
                </div>
            </div>

            {/* 3. Vision/Mission Section */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-3 mb-24">
                <div className="bg-[#FDE68A] rounded-4xl w-[1200px] min-h-[280px] pt-8 pb-12 pl-8 pr-8 flex flex-row gap-[96px] items-start relative overflow-visible opacity-100">
                    {/* Left Side: Buttons */}
                    <div className="flex gap-4 w-[350px] shrink-0 opacity-100">
                        <button
                            onClick={() => setActiveTab('vision')}
                            className={`h-[42px] px-6 rounded-full font-normal font-manrope text-xl transition-transform hover:scale-105 text-center whitespace-nowrap ${activeTab === 'vision'
                                ? 'bg-[#333] text-white shadow-md'
                                : 'border border-gray-800 text-gray-800 hover:bg-black/5'
                                }`}
                        >
                            Our Vision
                        </button>
                        <button
                            onClick={() => setActiveTab('mission')}
                            className={`h-[42px] px-6 rounded-full font-normal font-manrope text-xl transition-transform hover:scale-105 text-center whitespace-nowrap ${activeTab === 'mission'
                                ? 'bg-[#333] text-white shadow-md'
                                : 'border border-gray-800 text-gray-800 hover:bg-black/5'
                                }`}
                        >
                            Our Mission
                        </button>
                    </div>

                    {/* Right Side: Content List */}
                    <div className="flex-1 h-[250px] flex flex-col justify-between opacity-100">
                        {activeTab === 'vision' ? (
                            <>
                                {/* Vision Content */}
                                <div className="flex flex-row items-start border-b border-black/10 pb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 font-manrope w-[200px] shrink-0">Rent Anything</h3>
                                    <p className="text-gray-800 font-manrope leading-relaxed text-md">
                                        Laptops, Macs, mobiles, AV, cameras, medical and more—if it&apos;s not listed, it&apos;s sourced on request.
                                    </p>
                                </div>

                                <div className="flex flex-row items-start border-b border-black/10 pb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 font-manrope w-[200px] shrink-0">Rent Anytime</h3>
                                    <p className="text-gray-800 font-manrope leading-relaxed text-md">
                                        Tenures that fit the job: 1, 3, 6, or 12 months, with easy extensions and mid-term upgrades.
                                    </p>
                                </div>

                                <div className="flex flex-row items-start">
                                    <h3 className="text-lg font-semibold text-gray-900 font-manrope w-[200px] shrink-0">Rent Anywhere</h3>
                                    <p className="text-gray-800 font-manrope leading-relaxed text-md">
                                        Rapid delivery and support across major Indian cities through a reliable partner network.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Mission Content */}
                                <div className="flex flex-row items-start border-b border-black/10 pb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 font-manrope w-[200px] shrink-0">Awesome Service</h3>
                                    <p className="text-gray-800 font-manrope leading-relaxed text-md ml-8">
                                        Laptops, Macs, mobiles, AV, cameras, medical and more—if it&apos;s not listed, it&apos;s sourced on request.
                                    </p>
                                </div>

                                <div className="flex flex-row items-start border-b border-black/10 pb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 font-manrope w-[200px] shrink-0">Awesome Quality</h3>
                                    <p className="text-gray-800 font-manrope leading-relaxed text-md ml-8">
                                        Tenures that fit the job: 1, 3, 6, or 12 months, with easy extensions and mid-term upgrades.
                                    </p>
                                </div>

                                <div className="flex flex-row items-start">
                                    <h3 className="text-lg font-semibold text-gray-900 font-manrope w-[200px] shrink-0">Always Happy Customer</h3>
                                    <p className="text-gray-800 font-manrope leading-relaxed text-md ml-8">
                                        Rapid delivery and support across major Indian cities through a reliable partner network.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* 4. Why Choose Us Section */}
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-50 items-center">
                    {/* Left Content (Text + Stats) */}
                    <div className="lg:order-1"> {/* Wait, screenshot has text on LEFT? Yes. */}
                        <h2 className="w-[540px] h-[45px] text-[40px] font-semibold mb-6 font-poppins text-gray-800 leading-tight tracking-tight opacity-100">Why Choose Us?</h2>
                        <p className="w-[540px] h-[68px] text-base font-normal mb-5 leading-tight text-gray-800 tracking-wide opacity-100 font-poppins">
                            Join thousands who&apos;ve switched to the flexible, affordable way to access
                            high-end tech. IndianRenters delivers AI-ready workstations, laptops, and IT
                            gear with zero ownership hassle and instant support.
                        </p>

                        {/* Stats Row */}
                        <div className="w-[540px] h-[79px] grid grid-cols-3 gap-[96px] pt-4 border-t border-gray-300 opacity-100">
                            <div className="w-[111px] h-[79px] opacity-100">
                                <h3 className="w-[106px] h-[58px] text-[48px] font-medium font-manrope text-gray-700 mb-1 ml-1 opacity-100">90k+</h3>
                                <p className="text-sm text-gray-500 font-manrope">Devices in Stock</p>
                            </div>
                            <div className="w-[123px] h-[79px] opacity-100">
                                <h3 className="w-[103px] h-[58px] text-[48px] font-medium font-manrope text-gray-700 mb-1 opacity-100">30k+</h3>
                                <p className="text-sm text-gray-500 font-manrope">Happy Customers</p> {/* Using 30k from screenshot */}
                            </div>
                            <div className="w-[102px] h-[79px] opacity-100">
                                <h3 className="w-[100px] h-[58px] text-[48px] font-medium font-manrope text-gray-700 mb-1 opacity-100">401+</h3>
                                <p className="text-sm text-gray-500 font-manrope">Cities Covered</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative w-[508px] h-[336px] rounded-3xl overflow-hidden bg-gray-100 shadow-sm lg:order-2 opacity-100">
                        {/* Placeholder for Why Us Image */}
                        <Image
                            src="https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770800855/fe78b663b8ebf91f8e21a43e75ce3b0ac6a6b6b9_lvbsuv.png"
                            alt="Why Choose Us"
                            fill
                            className="object-cover object-center"
                        />
                    </div>
                </div>
            </div>

            {/* 5. FAQ Section */}
            <FaqSection />

            {/* 6. Best Rented Products Section */}
            <BestRentedProducts />
        </div>
    );
}
