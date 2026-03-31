"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

import { API } from '../services/apiConfig';

const FeatureSection = () => {
    const [isDesktop, setIsDesktop] = React.useState(false);
    const [cms, setCms] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const checkRes = () => setIsDesktop(window.innerWidth >= 1024);
        checkRes();
        window.addEventListener('resize', checkRes);
        return () => window.removeEventListener('resize', checkRes);
    }, []);

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

    if (loading) return <div className="h-96 w-full animate-pulse bg-gray-50 md:rounded-3xl max-w-[1200px] mx-auto my-12" />;
    if (!cms || cms.featureSectionEnabled === false) return null;

    const stats = cms.featureSectionStats || [];

    return (
        <section className="bg-white overflow-hidden relative pb-6 md:py-16 text-black">
            <div className={isDesktop ? "w-full max-w-[1200px] mx-auto px-4 sm:px-6" : "w-full max-w-[1200px] mx-auto px-0"}>

                {/* Inner radial gradient container - Optimized for 1200px lane */}
                <div
                    className="relative flex flex-col lg:flex-row items-center lg:items-start justify-between overflow-hidden"
                    style={{
                        background: 'radial-gradient(181.93% 64.7% at 50% 72.89%, #FFFFFF 0%, #D6F1FF 100%)',
                        width: isDesktop ? '100%' : '390px',
                        minHeight: isDesktop ? '339px' : '390px',
                        height: isDesktop ? '339px' : 'auto',
                        margin: isDesktop ? '0 auto' : '0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderRadius: isDesktop ? '30px' : '0px',
                        overflow: 'hidden',
                        paddingTop: isDesktop ? '40px' : '24px',
                        paddingBottom: isDesktop ? '40px' : '24px',
                        paddingLeft: isDesktop ? '30px' : '24px',
                        paddingRight: isDesktop ? '60px' : '24px',
                        gap: isDesktop ? '0' : '10px'
                    }}
                >

                    {/* Left content (Order 1) */}
                    <div
                        className="lg:w-[32%] w-full z-10 relative order-1 text-left flex flex-col"
                        style={{
                            width: isDesktop ? 'auto' : '100%',
                            height: isDesktop ? '243px' : 'auto',
                            gap: isDesktop ? '8px' : '4px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: isDesktop ? 'flex-start' : 'center'
                        }}
                    >
                        <div
                            className="flex flex-col"
                            style={{
                                width: isDesktop ? 'auto' : '100%',
                                height: 'auto',
                                gap: isDesktop ? '0' : '4px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="font-manrope text-[36px] md:text-5xl lg:text-[42px]"
                                style={{
                                    width: 'auto',
                                    height: 'auto',
                                    fontWeight: isDesktop ? '500' : 'bold',
                                    background: isDesktop ? 'linear-gradient(90deg, #0F2239 0%, #517396 87.77%)' : 'none',
                                    WebkitBackgroundClip: isDesktop ? 'text' : 'none',
                                    WebkitTextFillColor: isDesktop ? 'transparent' : 'inherit',
                                    color: isDesktop ? 'transparent' : '#0F2239',
                                    letterSpacing: isDesktop ? '-0.02em' : '-0.01em',
                                    lineHeight: '1.1',
                                    whiteSpace: isDesktop ? 'nowrap' : 'normal'
                                }}
                            >
                                {cms.featureSectionTitle || "MacBook Air"}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="font-manrope"
                                style={{
                                    width: isDesktop ? '235px' : '342px',
                                    height: isDesktop ? '115px' : 'auto',
                                    fontSize: isDesktop ? '14px' : '13px',
                                    fontWeight: isDesktop ? '400' : '500',
                                    color: isDesktop ? 'hsla(214, 74%, 21%, 1)' : '#64748b',
                                    lineHeight: isDesktop ? '1.5' : '18px',
                                    maxWidth: isDesktop ? '235px' : 'none',
                                    overflow: 'hidden',
                                    marginBottom: isDesktop ? '0' : '4px'
                                }}
                            >
                                {cms.featureSectionSubtitle || "Skip the setup hassle. Get high-performance workstations pre-configured with Ollama for instant AI development. Run large language models locally,"}
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex"
                        >
                            <Link
                                href={cms.featureSectionCtaLink || "/store"}
                                className="inline-flex items-center justify-center transition-all hover:bg-[#ffb50f] hover:scale-105 shadow-sm whitespace-nowrap"
                                style={{
                                    width: isDesktop ? '130px' : '90px',
                                    height: isDesktop ? '35px' : '28px',
                                    padding: isDesktop ? '6px 20px' : '0 12px',
                                    background: 'hsla(44, 100%, 64%, 1)',
                                    color: '#1a2b4c',
                                    borderRadius: isDesktop ? '32px' : '9999px',
                                    fontSize: isDesktop ? '14px' : '11px',
                                    fontWeight: isDesktop ? '500' : 'bold',
                                    gap: isDesktop ? '2px' : '4px'
                                }}
                            >
                                {cms.featureSectionCtaText || "Rent Now"}
                            </Link>
                        </motion.div>
                    </div>

                    {/* Center Content (Laptop + Air) (Order 2) */}
                    <div className="lg:w-[48%] w-full flex items-center justify-center relative z-0 order-2 mt-4 lg:mt-0 lg:-translate-x-10">
                        {/* Air watermark inside center */}
                        <div
                            className="absolute left-1/2 pointer-events-none select-none z-0"
                            style={{
                                transform: 'translate(-50%, -50%)',
                                opacity: isDesktop ? 0.2 : 0.18,
                                width: '100%',
                                height: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                top: '40%'
                            }}
                        >
                            <span
                                className="font-extrabold select-none whitespace-nowrap"
                                style={{
                                    fontSize: isDesktop ? '292px' : '180px',
                                    fontWeight: '500',
                                    lineHeight: isDesktop ? '240px' : '160px',
                                    background: 'linear-gradient(180deg, #60ADFD 0%, #007DFF 122.92%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    color: 'transparent'
                                }}
                            >
                                Air
                            </span>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="relative w-[240px] h-[126px] lg:w-full lg:h-auto lg:aspect-16/10 max-w-[600px] flex items-center justify-center drop-shadow-2xl z-10"
                        >
                            <Image
                                src={cms.featureSectionImage || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961205/indian-rentals/gfjrzgp5llzcjap30wkt.png"}
                                alt={cms.featureSectionTitle || "Laptop"}
                                fill
                                className={isDesktop ? "object-contain hover:scale-100 transition-transform duration-500 scale-105" : "object-contain scale-110 translate-y-1"}
                                priority
                                sizes="(max-width: 768px) 100vw, 600px"
                            />
                        </motion.div>
                    </div>

                    {/* Right Content (Stats) (Order 3) */}
                    <div
                        className="w-full flex-row lg:flex-col items-center justify-between lg:items-start z-10 order-3 lg:mt-0 flex"
                        style={{
                            width: isDesktop ? '142px' : '358px',
                            height: isDesktop ? '339px' : '113px',
                            gap: isDesktop ? '29px' : '10px',
                            minHeight: isDesktop ? '339px' : '113px',
                            paddingTop: isDesktop ? '0' : '0px',
                            justifyContent: isDesktop ? 'flex-start' : 'space-between',
                            margin: isDesktop ? '0' : '0 auto',
                            paddingBottom: isDesktop ? '0' : '0px',
                            opacity: 1
                        }}
                    >
                        {stats.slice(0, 3).map((stat, idx) => {
                            const isThird = idx === 2; // third column (battery life)
                            return (
                                <motion.div
                                    key={idx}
                                    initial={isDesktop ? { opacity: 0, x: 20 } : { opacity: 0 }}
                                    whileInView={isDesktop ? { opacity: 1, x: 0 } : { opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + (idx * 0.1) }}
                                    className={isDesktop ? "lg:flex-none" : "flex flex-col items-start"}
                                    style={{
                                        width: isDesktop ? (idx === 0 ? '142px' : '107px') : 'auto',
                                        height: 'auto',
                                        minWidth: isDesktop ? 'none' : '100px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 0,
                                        justifyContent: isDesktop ? 'flex-start' : 'center'
                                    }}
                                >
                                    <div
                                        className="flex flex-col"
                                        style={{
                                            width: isDesktop ? '76px' : 'auto',
                                            height: 'auto',
                                            gap: 0,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'flex-start'
                                        }}
                                    >
                                        <p
                                            className="font-manrope"
                                            style={{
                                                fontSize: isDesktop ? '13px' : '9px',
                                                fontWeight: isDesktop ? '600' : '500',
                                                width: isDesktop ? '51px' : 'auto',
                                                height: 'auto',
                                                color: isDesktop ? (isThird ? '#2d5d36' : 'hsla(0, 0%, 46%, 1)') : '#64748b',
                                                lineHeight: isDesktop ? '1.2' : 'normal',
                                                marginBottom: 0,
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            {stat.label}
                                        </p>
                                        <h4
                                            className="font-manrope"
                                            style={{
                                                fontSize: isDesktop ? '32px' : '24px',
                                                fontWeight: isDesktop ? '500' : 'bold',
                                                width: isDesktop ? '76px' : 'auto',
                                                height: 'auto',
                                                display: 'flex',
                                                alignItems: 'center',
                                                margin: 0,
                                                background: isDesktop ? (isThird ? 'none' : 'linear-gradient(90deg, #0F2239 0%, #517396 87.77%)') : 'none',
                                                WebkitBackgroundClip: isDesktop ? (isThird ? 'none' : 'text') : 'none',
                                                WebkitTextFillColor: isDesktop ? (isThird ? 'inherit' : 'transparent') : 'inherit',
                                                color: isThird ? '#2d5d36' : (isDesktop ? 'transparent' : '#1a2b4c'),
                                                lineHeight: isDesktop ? '1.1' : 'normal',
                                                letterSpacing: isDesktop ? '-0.02em' : 'tight'
                                            }}
                                        >
                                            {stat.value}
                                        </h4>
                                    </div>
                                    <p
                                        className="font-manrope"
                                        style={{
                                            fontSize: isDesktop ? '12px' : '9px',
                                            fontWeight: isDesktop ? '600' : '500',
                                            width: isDesktop ? (idx === 0 ? '142px' : '107px') : '90px',
                                            height: 'auto',
                                            color: isDesktop ? (isThird ? '#2d5d36' : 'hsla(0, 0%, 46%, 1)') : (isThird ? '#2d5d36' : '#64748b'),
                                            lineHeight: isDesktop ? '1.2' : '1.2',
                                            overflow: 'hidden',
                                            marginTop: 0
                                        }}
                                    >
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
                        className={isDesktop ? "w-full text-center relative z-10 order-4 pt-4 lg:absolute lg:bottom-[2px] lg:left-1/2 lg:-translate-x-1/2 pointer-events-none" : "w-full text-center relative z-20 order-4 mt-auto"}
                    >
                        <h3 className="font-manrope text-[14px] md:text-xl font-bold tracking-tight pb-2">
                            <span className="text-[#3b82f6]">Built for </span>
                            <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-500 via-pink-500 to-orange-500">
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
