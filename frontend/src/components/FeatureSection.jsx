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
        <section className="bg-white overflow-hidden relative pb-6 md:py-16">
            <div className="w-full max-w-[1200px] mx-auto px-0 md:px-4 sm:px-6">

                {/* Inner radial gradient container */}
                <div 
                    className="md:rounded-[1.8rem] relative px-5 py-6 md:p-12 lg:p-14 lg:pb-20 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-[10px] lg:gap-6 overflow-hidden"
                    style={{ background: 'radial-gradient(181.93% 64.7% at 50% 72.89%, #FFFFFF 0%, #D6F1FF 100%)' }}
                >

                    {/* Left content (Order 1) */}
                    <div className="lg:w-[32%] w-full z-10 relative order-1 text-left flex flex-col gap-3">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="font-manrope text-[32px] md:text-5xl lg:text-[52px] font-semibold tracking-tight text-[#1a2b4c] leading-[1.1]"
                        >
                            {cms.featureSectionTitle || "MacBook Air"}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="font-manrope text-[#757575] text-[13px] md:text-[15px] font-medium leading-[1.4] tracking-normal max-w-[320px]"
                        >
                            {cms.featureSectionSubtitle}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex"
                        >
                            <Link
                                href={cms.featureSectionCtaLink || "/store"}
                                className="inline-flex items-center justify-center gap-[1.45px] md:gap-1.5 bg-[#ffc53d] text-[#1a2b4c] px-[14.47px] py-[4.34px] md:px-6 md:py-2.5 rounded-[20.47px] md:rounded-full border-b-[0.72px] md:border-b-0 border-[#dca72f] font-medium transition-all hover:bg-[#ffb50f] hover:scale-105 shadow-sm text-[10px] md:text-sm w-[80.44px] h-[22.68px] md:w-auto md:h-auto whitespace-nowrap"
                            >
                                {cms.featureSectionCtaText || "Rent Now"}
                                <FaArrowRight size={8} className="md:w-3 md:h-3" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Center Content (Laptop + Air) (Order 2) */}
                    <div className="lg:w-[48%] w-full flex items-center justify-center relative z-0 order-2 mt-2 lg:mt-0 lg:-translate-x-10">
                        {/* Air watermark inside center */}
                        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-[45%] pointer-events-none select-none z-0 line-clamp-1 opacity-80">
                            <span className="text-[250px] md:text-[350px] lg:text-[450px] font-bold text-[#bce0ff] tracking-tighter leading-none mix-blend-multiply">
                                Air
                            </span>
                        </div>
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative w-[265px] h-[139px] lg:w-full lg:h-auto lg:aspect-16/10 max-w-[600px] flex items-center justify-center drop-shadow-2xl z-10"
                        >
                            <Image
                                src={cms.featureSectionImage || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961205/indian-rentals/gfjrzgp5llzcjap30wkt.png"}
                                alt={cms.featureSectionTitle || "Laptop"}
                                fill
                                className="object-contain hover:scale-100 transition-transform duration-500 scale-105"
                                priority
                                sizes="(max-width: 768px) 100vw, 600px"
                            />
                        </motion.div>
                    </div>

                    {/* Right Content (Stats) (Order 3) */}
                    <div className="lg:w-[16%] w-full flex flex-row lg:flex-col items-start gap-4 lg:gap-10 z-10 order-3 pt-3 lg:mt-0">
                        {stats.map((stat, idx) => {
                            const isGreen = idx === 2; // third column must be dark green overall
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + (idx * 0.1) }}
                                    className="flex-1 lg:flex-none"
                                >
                                    <p className={`font-manrope text-[11px] md:text-[13px] font-semibold mb-0 whitespace-nowrap tracking-tight ${isGreen ? 'text-[#2d5d36]' : 'text-[#64748b]'}`}>
                                        {stat.label}
                                    </p>
                                    <h4 className={`font-manrope text-[28px] md:text-[38px] lg:text-[42px] font-semibold tracking-tighter leading-none my-1 lg:mb-2 ${isGreen ? 'text-[#2d5d36]' : 'text-[#1a2b4c]'}`}>
                                        {stat.value}
                                    </h4>
                                    <p className={`font-manrope text-[11px] md:text-[12px] font-medium leading-[1.3] lg:max-w-[140px] ${isGreen ? 'text-[#2d5d36]' : 'text-[#64748b]'}`}>
                                        {stat.sublabel}
                                    </p>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* "Built for Apple Intelligence" (Order 4) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="w-full text-center relative z-10 order-4 pt-4 lg:absolute lg:bottom-12 lg:left-1/2 lg:-translate-x-1/2 pointer-events-none"
                    >
                        <h3 className="font-manrope text-lg md:text-xl font-bold tracking-tight">
                            <span className="text-[#3b82f6]">Built for </span>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 pb-1">
                                Apple Intelligence.
                            </span>
                        </h3>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
