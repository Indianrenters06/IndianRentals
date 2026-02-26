"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const WhyChooseUs = () => {
    return (
        <section className="py-10 md:py-20 bg-[#FFFDF7] overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">

                    {/* Text Content - always first on mobile */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-4xl font-semibold font-manrope text-gray-900">
                                Why Choose Us?
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-lg">
                                Join thousands who've switched to the flexible, affordable way to access high-end tech. IndianRenters delivers AI-ready workstations, laptops, and IT gear with zero ownership hassle and instant support.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 md:gap-8 pt-2">
                            <div className="space-y-1">
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">90k+</h3>
                                <p className="text-xs md:text-sm font-medium text-gray-500">Devices in Stock</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">30k+</h3>
                                <p className="text-xs md:text-sm font-medium text-gray-500">Happy Customers</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">401+</h3>
                                <p className="text-xs md:text-sm font-medium text-gray-500">Cities Covered</p>
                            </div>
                        </div>
                    </div>

                    {/* Image Content - below text on mobile, right side on desktop */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                            <Image
                                src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961565/indian-rentals/anmpufdlxxxblkxqxpds.jpg"
                                alt="Why Choose Us"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
