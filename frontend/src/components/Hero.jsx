"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

// Note: You can replace this placeholder image path with the actual image provided by the user later.
const Hero = () => {
    return (
        <section className="bg-white py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1400px] mx-auto relative">
                {/* Dynamic Background Shape */}
                <div className="absolute inset-0 bg-[#00A8FF] rounded-[2.5rem]"></div>

                {/* Background Pattern/Gradient (Subtle) */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 rounded-[2.5rem]"></div>

                <div className="relative z-10 px-6 py-8 md:px-12 md:py-12 h-full flex items-center justify-center">
                    <div className="grid md:grid-cols-2 gap-4 lg:gap-12 items-center w-full max-w-6xl mx-auto">

                        {/* Text Content */}
                        <div className="space-y-6 text-center md:text-left text-white relative z-20 w-full">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="font-bold tracking-tight"
                            >
                                {/* Adjusted size: 54px -> 44px for a cleaner fit */}
                                <h1 className="text-[26px] md:text-4xl lg:text-[44px] leading-[1.2] font-bold whitespace-nowrap">
                                    The Tech That Powers
                                </h1>
                                <h1 className="text-[26px] md:text-4xl lg:text-[44px] leading-[1.2] font-bold whitespace-nowrap">
                                    Your Ambition. On Demand.
                                </h1>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-sm md:text-[15px] leading-snug opacity-90 font-normal space-y-[2px]"
                            >
                                <p className="whitespace-nowrap">Get the latest MacBooks, Workstations, Cameras, and more.</p>
                                <p className="whitespace-nowrap">Delivered to your door with flexible monthly plans.</p>
                                <p className="whitespace-nowrap">Upgrade your toolkit, not your expenses.</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="pt-2"
                            >
                                <Link href="/store" className="inline-flex items-center gap-2 bg-[#FFC107] text-gray-900 px-7 py-3 rounded-full font-bold text-[15px] hover:bg-[#FFD54F] transition-all transform hover:scale-105 shadow-lg">
                                    Rent Now
                                    <FaArrowRight size={13} className="ml-1" />
                                </Link>
                            </motion.div>

                            {/* Indicators */}
                            <div className="flex items-center justify-center md:justify-start gap-3 pt-4">
                                <button className="w-2 h-2 rounded-full bg-white/40 hover:bg-white transition-colors"></button>
                                <button className="w-2 h-2 rounded-full bg-white transition-colors"></button>
                                <button className="w-2 h-2 rounded-full bg-white/40 hover:bg-white transition-colors"></button>
                            </div>
                        </div>

                        {/* Image Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="relative flex justify-center md:justify-end items-center"
                        >
                            {/* Empty container for the laptop image */}
                            <div className="relative w-full max-w-lg">
                                {/* Invisible spacer */}
                                <div className="aspect-16/10 w-full"></div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
