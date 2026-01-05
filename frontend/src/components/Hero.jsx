"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

// Note: You can replace this placeholder image path with the actual image provided by the user later.
const Hero = () => {
    return (
        <section className="pt-4 pb-4 md:pt-6 md:pb-6 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative bg-[#0A99FF] text-white shadow-2xl">
                {/* Background Decoration - Optional gradient or pattern */}
                <div className="absolute inset-0 bg-linear-to-r from-cyan-400 to-blue-500 opacity-90"></div>

                <div className="relative z-10 px-6 py-10 md:px-12 md:py-14">
                    <div className="grid md:grid-cols-2 gap-12 items-center">

                        {/* Text Content */}
                        <div className="space-y-6 text-center md:text-left">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-4xl md:text-6xl font-bold leading-tight"
                            >
                                The Tech That Powers <br className="hidden md:block" />
                                Your Ambition. On Demand.
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-lg md:text-xl text-blue-50 max-w-xl mx-auto md:mx-0"
                            >
                                Get the latest MacBooks, Workstations, Cameras, and more. Delivered to your door with flexible monthly plans. Upgrade your toolkit, not your expenses.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <Link href="/store" className="inline-flex items-center gap-2 bg-[#FFC107] text-black px-8 py-3.5 rounded-full font-bold text-lg hover:bg-[#FFD54F] transition-all transform hover:scale-105 shadow-lg">
                                    Rent Now
                                    <FaArrowRight size={16} />
                                </Link>
                            </motion.div>

                            {/* Carousel Indicators Placeholder - If needed */}
                            <div className="flex items-center justify-center md:justify-start gap-2 pt-8">
                                <button className="w-3 h-3 rounded-full bg-white opacity-100"></button>
                                <button className="w-3 h-3 rounded-full bg-white opacity-50 hover:opacity-100 transition-opacity"></button>
                                <button className="w-3 h-3 rounded-full bg-white opacity-50 hover:opacity-100 transition-opacity"></button>
                            </div>
                        </div>

                        {/* Image Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="relative"
                        >
                            {/* Placeholder for the Laptop Image */}
                            <div className="relative w-full aspect-4/3 md:aspect-square flex items-center justify-center">
                                {/* We will replace this with an actual Image component once we have the asset */}
                                <div className="w-[80%] h-[80%] bg-white/10 backdrop-blur-xs rounded-2xl border border-white/20 flex items-center justify-center text-white/50 text-2xl font-bold shadow-2xl skew-x-1 skew-y-1 transform hover:rotate-1 transition-transform duration-500">
                                    Laptop Image Placeholder
                                </div>

                                {/* Floating effect decoration */}
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
