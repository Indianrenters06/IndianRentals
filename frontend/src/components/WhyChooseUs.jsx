"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const WhyChooseUs = () => {
    return (
        <section className="py-20 bg-[#FFFCF8] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <div className="order-2 md:order-1 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Why Choose Us?
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Join thousands who've switched to the flexible, affordable way to access high-end tech. IndianRenters delivers AI-ready workstations, laptops, and IT gear with zero ownership hassle and instant support.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-8 pt-4">
                            <div className="space-y-1">
                                <h3 className="text-3xl font-bold text-gray-900">90k+</h3>
                                <p className="text-sm font-medium text-gray-500">Devices in Stock</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-bold text-gray-900">30k+</h3>
                                <p className="text-sm font-medium text-gray-500">Happy Customers</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-3xl font-bold text-gray-900">401+</h3>
                                <p className="text-sm font-medium text-gray-500">Cities Covered</p>
                            </div>
                        </div>
                    </div>

                    {/* Image Content */}
                    <div className="order-1 md:order-2 relative">
                        {/* Main Image Placeholder */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                            <Image
                                src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961565/indian-rentals/anmpufdlxxxblkxqxpds.jpg"
                                alt="Why Choose Us"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                        <div className="absolute -z-10 -top-10 -left-10 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
