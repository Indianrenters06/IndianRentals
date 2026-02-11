'use client';

import React from 'react';
import Image from 'next/image';
import { PiGauge, PiSmiley } from 'react-icons/pi';
import BestRentedProducts from '../../components/BestRentedProducts';
import FaqSection from '../../components/FaqSection';

export default function AboutPage() {
    return (
        <div className="font-sans text-gray-800 pb-20">
            {/* 1. Header Image/Banner */}
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16">
                <div className="w-full h-[300px] md:h-[400px] relative bg-gray-200 overflow-hidden rounded-3xl">
                    {/* Placeholder for Banner Image */}
                    <Image
                        src="https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770800853/91c997360fd8d0ad44588aaaed2a31db6de1b8db_dck9cz.jpg"
                        alt="About Us Banner"
                        fill
                        className="object-cover object-center"
                    />
                    {/* Overlay Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-white text-4xl md:text-6xl font-semibold drop-shadow-lg">About Us</h1>
                    </div>
                </div>
            </div>

            {/* 2. Our Story Section */}
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-manrope text-gray-900">Our Story</h2>

                        <div className="text-gray-600 mb-8 leading-relaxed font-manrope space-y-6">
                            <p>
                                From a small computer training room in 1992 to India's go-to rental partner, this
                                journey has been about making access smarter than ownership. The promise stays
                                simple: rent anything needed, when it's needed, anywhere it's needed—without
                                friction.
                            </p>
                            <p>
                                Today, a 100+ product catalog powers startups, enterprises, and events across
                                major cities, backed by fast delivery, clean gear, and dependable support. The
                                focus is outcomes setups that just work, terms that fit, and service that shows up.
                            </p>
                        </div>

                        {/* Stats with Icons */}
                        <div className="flex flex-wrap gap-8 md:gap-12 mt-8">
                            {/* Stat 1 */}
                            <div className="flex flex-col">
                                <div className="w-14 h-14 bg-[#FF8A00] rounded-xl flex items-center justify-center text-white mb-3 shadow-sm">
                                    <PiGauge size={28} weight="bold" />
                                </div>
                                <h3 className="text-3xl font-bold font-manrope text-gray-900">4.8/5.0</h3>
                                <p className="text-sm font-medium text-gray-500 font-manrope mt-1">Customer Satisfaction Rate</p>
                            </div>

                            {/* Stat 2 */}
                            <div className="flex flex-col">
                                <div className="w-14 h-14 bg-[#FF8A00] rounded-xl flex items-center justify-center text-white mb-3 shadow-sm">
                                    <PiSmiley size={28} weight="bold" />
                                </div>
                                <h3 className="text-3xl font-bold font-manrope text-gray-900">10,000+</h3>
                                <p className="text-sm font-medium text-gray-500 font-manrope mt-1">Happy Clients</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden bg-gray-100 shadow-sm">
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
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="bg-[#FDE68A] rounded-[30px] p-8 md:p-16 flex flex-col lg:flex-row gap-12 lg:gap-24 relative overflow-hidden">
                    {/* Decorative blurred circle/gradient could be added here if needed, keeping it simple for now */}

                    {/* Left Side: Buttons */}
                    <div className="flex gap-4 lg:flex-col lg:w-48 flex-shrink-0">
                        <button className="px-6 py-3 rounded-full bg-[#333] text-white font-medium font-manrope text-sm transition-transform hover:scale-105 shadow-md text-center">
                            Our Vision
                        </button>
                        <button className="px-6 py-3 rounded-full border border-gray-800 text-gray-800 font-medium font-manrope text-sm hover:bg-black/5 transition-colors text-center">
                            Our Mission
                        </button>
                    </div>

                    {/* Right Side: Content List */}
                    <div className="flex-1 space-y-10">
                        {/* Item 1 */}
                        <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-12 border-b border-black/10 pb-8 last:border-0 last:pb-0">
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 font-manrope min-w-[180px]">Rent Anything</h3>
                            <p className="text-gray-800 font-manrope leading-relaxed text-sm md:text-base">
                                Laptops, Macs, mobiles, AV, cameras, medical and more—if it's not
                                listed, it's sourced on request.
                            </p>
                        </div>

                        {/* Item 2 */}
                        <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-12 border-b border-black/10 pb-8 last:border-0 last:pb-0">
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 font-manrope min-w-[180px]">Rent Anytime</h3>
                            <p className="text-gray-800 font-manrope leading-relaxed text-sm md:text-base">
                                Tenures that fit the job: 1, 3, 6, or 12 months, with easy extensions and
                                mid-term upgrades.
                            </p>
                        </div>

                        {/* Item 3 */}
                        <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-12 border-b border-black/10 pb-8 last:border-0 last:pb-0">
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 font-manrope min-w-[180px]">Rent Anywhere</h3>
                            <p className="text-gray-800 font-manrope leading-relaxed text-sm md:text-base">
                                Rapid delivery and support across major Indian cities through a reliable
                                partner network.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Why Choose Us Section */}
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content (Text + Stats) */}
                    <div className="lg:order-1"> {/* Wait, screenshot has text on LEFT? Yes. */}
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-manrope text-gray-900">Why Choose Us?</h2>
                        <p className="text-gray-600 mb-10 leading-relaxed font-manrope max-w-lg">
                            Join thousands who've switched to the flexible, affordable way to access
                            high-end tech. IndianRenters delivers AI-ready workstations, laptops, and IT
                            gear with zero ownership hassle and instant support.
                        </p>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                            <div>
                                <h3 className="text-3xl md:text-4xl font-bold font-manrope text-gray-800 mb-1">90k+</h3>
                                <p className="text-sm text-gray-500 font-manrope">Devices in Stock</p>
                            </div>
                            <div>
                                <h3 className="text-3xl md:text-4xl font-bold font-manrope text-gray-800 mb-1">30k+</h3>
                                <p className="text-sm text-gray-500 font-manrope">Happy Customers</p> {/* Using 30k from screenshot */}
                            </div>
                            <div>
                                <h3 className="text-3xl md:text-4xl font-bold font-manrope text-gray-800 mb-1">401+</h3>
                                <p className="text-sm text-gray-500 font-manrope">Cities Covered</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-gray-100 shadow-sm lg:order-2">
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
