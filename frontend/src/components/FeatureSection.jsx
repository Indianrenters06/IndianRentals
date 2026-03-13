"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const FeatureSection = () => {
    const [cms, setCms] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchCMS = async () => {
            try {
                const res = await fetch(`${API}/api/cms/homepage`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setCms(data);
                }
            } catch (err) {
                console.error("Failed to fetch feature section CMS:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCMS();
    }, []);

    if (loading) return <div className="h-96 w-full animate-pulse bg-gray-50 rounded-3xl max-w-[1440px] mx-auto my-12" />;
    if (!cms || cms.featureSectionEnabled === false) return null;

    const stats = cms.featureSectionStats || [];

    return (
        <section className="py-12 md:py-20 bg-white overflow-hidden relative">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Inner solid blue background container */}
                <div className="bg-[#e4effc] rounded-[1.8rem] relative p-8 md:p-12 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-6">

                    {/* Background "Air" watermark */}
                    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
                        <span className="text-[180px] md:text-[280px] lg:text-[400px] font-semibold text-blue-200/25 tracking-tighter leading-none">
                            Air
                        </span>
                    </div>

                    {/* Left content */}
                    <div className="lg:w-[32%] w-full z-10 relative">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl lg:text-[52px] font-normal tracking-tight text-[#1a2b4c] leading-tight mb-5"
                        >
                            {cms.featureSectionTitle || "MacBook Air"}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-[#4a5568] text-[14px] md:text-[15px] leading-relaxed mb-8 max-w-[280px] font-medium"
                        >
                            {cms.featureSectionSubtitle}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <Link
                                href={cms.featureSectionCtaLink || "/store"}
                                className="inline-flex items-center gap-2 bg-[#ffc53d] text-[#1a2b4c] px-6 py-2.5 rounded-full font-medium transition-all hover:bg-[#ffb50f] hover:scale-105 shadow-sm text-sm"
                            >
                                {cms.featureSectionCtaText || "Rent Now"}
                                <FaArrowRight size={12} />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Center Content (Laptop) */}
                    <div className="lg:w-[48%] w-full flex flex-col items-center justify-center relative z-10 mt-6 lg:mt-0 lg:-translate-x-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative w-full max-w-[600px] aspect-[16/10] flex items-center justify-center drop-shadow-2xl"
                        >
                            <Image
                                src={cms.featureSectionImage || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961205/indian-rentals/gfjrzgp5llzcjap30wkt.png"}
                                alt={cms.featureSectionTitle}
                                fill
                                className="object-contain hover:scale-105 transition-transform duration-500 scale-110"
                                priority
                                sizes="(max-width: 768px) 100vw, 600px"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="text-center mt-6 lg:mt-2 relative"
                        >
                            <h3 className="text-lg md:text-xl font-medium tracking-tight">
                                <span className="text-[#3b82f6]">Built for </span>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500">
                                    Apple Intelligence.
                                </span>
                            </h3>
                        </motion.div>
                    </div>

                    {/* Right Content (Stats) */}
                    <div className="lg:w-[16%] w-full flex flex-row lg:flex-col justify-between gap-6 lg:gap-10 z-10 mt-10 lg:mt-0">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + (idx * 0.1) }}
                            >
                                <p className="text-xs text-[#718096] font-medium mb-1">{stat.label}</p>
                                <h4 className="text-3xl md:text-4xl lg:text-[42px] font-normal tracking-tight text-[#1a2b4c] leading-none mb-2">{stat.value}</h4>
                                <p className="text-[11px] text-[#718096] leading-snug">
                                    {stat.sublabel}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
