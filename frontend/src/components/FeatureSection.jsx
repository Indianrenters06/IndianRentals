"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight, FaLaptop } from 'react-icons/fa';

const FeatureSection = () => {
    return (
        <section className="py-24 bg-[#F5FAFF] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">

                    {/* Left Content */}
                    <div className="w-full lg:w-1/3 flex flex-col items-start space-y-8 z-10">
                        <div className="space-y-6">
                            <h2 className="text-5xl md:text-7xl font-semibold tracking-tight text-gray-900 leading-tight">
                                MacBook Air
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed max-w-sm">
                                Skip the setup hassle. Get high-performance workstations pre-configured with Ollama for instant AI development. Run large language models locally.
                            </p>
                        </div>

                        <div>
                            <Link href="/product/macbook-air" className="inline-flex items-center gap-2 px-8 py-4 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-full transition-all shadow-md hover:shadow-lg text-lg">
                                Rent Now
                                <FaArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Center Image */}
                    <div className="w-full lg:w-1/2 relative flex flex-col items-center justify-center -my-8">
                        {/* Background Air Text Effect - Simulated */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center opacity-5 pointer-events-none select-none">
                            <span className="text-[20rem] font-bold text-blue-900 leading-none">Air</span>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative z-10 w-full flex justify-center mb-8"
                        >
                            {/* Placeholder for MacBook Air Image - using icon for now but styled large */}
                            <div className="relative w-[120%] -ml-[10%] aspect-[16/10] flex items-center justify-center">
                                {/* This represents the floating laptop image */}
                                <FaLaptop className="text-gray-800 drop-shadow-2xl w-full h-full opacity-90" />
                            </div>
                        </motion.div>

                        <h3 className="text-2xl md:text-3xl font-semibold text-center z-20">
                            Built for <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-red-500 bg-clip-text text-transparent">Apple Intelligence.</span>
                        </h3>
                    </div>

                    {/* Right Stats */}
                    <div className="w-full lg:w-1/6 flex flex-row lg:flex-col justify-between lg:justify-center gap-8 lg:gap-16 pt-8 lg:pt-0 lg:pl-8">
                        {/* Stat 1 */}
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-400 mb-1">Up to</p>
                            <h4 className="font-bold text-5xl md:text-6xl text-[#0071E3] tracking-tighter">23x</h4>
                            <p className="text-xs text-gray-500 max-w-[120px] leading-tight mt-2">faster than the fastest Intel-based MacBook Air</p>
                        </div>
                        {/* Stat 2 */}
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-400 mb-1">Up to</p>
                            <h4 className="font-bold text-5xl md:text-6xl text-[#0071E3] tracking-tighter">2x</h4>
                            <p className="text-xs text-gray-500 max-w-[120px] leading-tight mt-2">faster than MacBook Air (M1)</p>
                        </div>
                        {/* Stat 3 */}
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-400 mb-1">Up to</p>
                            <h4 className="font-bold text-5xl md:text-6xl text-[#1E8E3E] tracking-tighter">18 hr</h4>
                            <p className="text-xs text-gray-500 max-w-[120px] leading-tight mt-2">battery life</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
