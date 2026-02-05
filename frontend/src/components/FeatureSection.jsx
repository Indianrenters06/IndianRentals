"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowRight, FaLaptop } from 'react-icons/fa';

const FeatureSection = () => {
    return (
        <section className="py-12 md:py-24 bg-[#F5FAFF] overflow-hidden relative">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0">

                    {/* Left Content - Title & CTA */}
                    <div className="w-full lg:w-[30%] flex flex-col items-start space-y-8 z-10 pl-4">
                        <div className="space-y-5">
                            <h2 className="text-6xl md:text-5xl lg:text-5xl">
                                <span className="font-normal bg-gradient-to-r 
from-[#1D334C] 
via-[#374E71] 
to-[#4E6F90] 
bg-clip-text 
text-transparent tracking-normal">Macbook Air</span>
                            </h2>
                            <p className="text-lg text-gray-900  max-w-xs font-light">
                                Skip the setup hassle. Get high-performance workstations pre-configured with Ollama for instant AI development. Run large language models locally.
                            </p>
                        </div>

                        <div>
                            <Link href="/product/macbook-air" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-medium rounded-full transition-all shadow-sm hover:shadow-md text-base">
                                Rent Now
                                <FaArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    {/* Center Image & "Air" Text */}
                    <div className="w-full lg:w-[60%] relative flex flex-col items-center justify-center h-[500px] md:h-[600px]">
                        {/* Background Air Text - Massive Watermark */}
                        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full items-center justify-center pointer-events-none select-none z-0">
                            <span className="text-[12rem] md:text-[22rem] font-bold text-[#E6F0FF] leading-none tracking-widest opacity-100">
                                Air
                            </span>
                        </div>

                        {/* Floating Laptop */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1.1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="relative z-10 w-full flex justify-center"
                        >
                            <div className="relative w-[80%] aspect-[16/10] flex items-center justify-center">
                                <Image
                                    src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961205/indian-rentals/gfjrzgp5llzcjap30wkt.png"
                                    alt="MacBook Air"
                                    fill
                                    className="object-center drop-shadow-2xl"
                                    priority
                                />
                            </div>
                        </motion.div>

                        <h3 className="text-2xl md:text-4xl font-semibold text-center z-20 text-[#1d1d1f] mt-8 tracking-tight">
                            <span className="bg-gradient-to-r from-[#0071E3] via-[#9F55FF] to-[#FF5555] bg-clip-text text-transparent">Built for Apple Intelligence.</span>
                        </h3>
                    </div>

                    {/* Right Stats */}
                    <div className="w-full lg:w-[20%] flex flex-row lg:flex-col justify-between lg:justify-center  lg:space-y-16 pl-6 pt-8 lg:pt-0">
                        {/* Stat 1 */}
                        <div className="flex flex-col items-start">
                            <p className="text-sm font-medium text-gray-500 mb-1">Up to</p>
                            <h4 className="font-semibold text-5xl lg:text-6xl bg-gradient-to-r 
from-[#1D334C] 
via-[#374E71] 
to-[#4E6F90] 
bg-clip-text 
text-transparent tracking-tighter leading-none">23x</h4>
                            <p className="text-xs font-medium text-gray-500 mt-2 leading-tight max-w-[100px]">faster than fast Intel-based MacBook Air</p>
                        </div>
                        {/* Stat 2 */}
                        <div className="flex flex-col items-start">
                            <p className="text-sm font-medium text-gray-500 mb-1">Up to</p>
                            <h4 className="font-semibold text-5xl lg:text-6xl bg-gradient-to-r 
from-[#1D334C] 
via-[#374E71] 
to-[#4E6F90] 
bg-clip-text 
text-transparent tracking-tighter leading-none">2x</h4>
                            <p className="text-xs font-medium text-gray-500 mt-2 leading-tight max-w-[100px]">faster than MacBook Air (M1)</p>
                        </div>
                        {/* Stat 3 */}
                        <div className="flex flex-col items-start">
                            <p className="text-sm font-medium text-gray-500 mb-1">Up to</p>
                            <h4 className="font-semibold text-5xl lg:text-6xl bg-gradient-to-r 
from-[#1D334C] 
via-[#374E71] 
to-[#4E6F90] 
bg-clip-text 
text-transparent tracking-tighter leading-none">18 hr</h4>
                            <p className="text-xs font-medium text-gray-500 mt-2 leading-tight max-w-[100px]">battery life</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
