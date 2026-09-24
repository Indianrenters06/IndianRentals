"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const FeatureSection = () => {
    const [isDesktop, setIsDesktop] = useState(false);
    const [cms, setCms] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkRes = () => setIsDesktop(window.innerWidth >= 1024);
        checkRes();
        window.addEventListener('resize', checkRes);
        return () => window.removeEventListener('resize', checkRes);
    }, []);

    useEffect(() => {
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
        <section className="w-full bg-white overflow-hidden text-black py-0">
            <div className={`w-full max-w-[1200px] mx-auto ${isDesktop ? 'px-4 sm:px-6 xl:px-0' : 'px-0'}`}>
                {/* Inner radial gradient container */}
                <div
                    className="w-full relative flex flex-col lg:flex-row items-center justify-between overflow-hidden"
                    style={{
                        background: 'radial-gradient(181.93% 64.7% at 50% 72.89%, #FFFFFF 0%, #D6F1FF 100%)',
                        width: '100%',
                        maxWidth: isDesktop ? '1200px' : '100%',
                        height: isDesktop ? '400px' : 'auto',
                        opacity: 1,
                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderRadius: isDesktop ? '30px' : '0px',
                        paddingTop: isDesktop ? '48px' : '24px',
                        paddingBottom: isDesktop ? '48px' : '24px',
                        paddingLeft: isDesktop ? '30px' : '24px',
                        paddingRight: isDesktop ? '30px' : '24px',
                        gap: isDesktop ? '0' : '10px'
                    }}
                >

                    {/* Left content (Order 1) */}
                    <div
                        className="lg:w-[32%] w-full z-10 relative order-1 text-left flex flex-col"
                        style={{
                            width: isDesktop ? '278px' : '100%',
                            height: isDesktop ? 'auto' : 'auto',
                            gap: isDesktop ? '24px' : '4px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: isDesktop ? 'flex-start' : 'center'
                        }}
                    >
                        <div
                            className="flex flex-col"
                            style={{
                                width: isDesktop ? '278px' : '100%',
                                height: 'auto',
                                gap: isDesktop ? '9px' : '4px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                style={{
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontWeight: isDesktop ? 500 : 600,
                                    fontSize: isDesktop ? '47px' : '25px',
                                    lineHeight: isDesktop ? '60px' : '31px',
                                    letterSpacing: isDesktop ? '-1.5px' : '-0.8px',
                                    background: 'linear-gradient(90deg, #0F2239 0%, #517396 87.77%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    whiteSpace: isDesktop ? 'nowrap' : 'normal',
                                    marginBottom: isDesktop ? '16px' : '8px',
                                    margin: 0
                                }}
                            >
                                {cms.featureSectionTitle || "MacBook Air"}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                style={{
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontWeight: isDesktop ? 400 : 500,
                                    fontSize: isDesktop ? '16px' : '12px',
                                    lineHeight: isDesktop ? '23px' : '18px',
                                    letterSpacing: '-0.4px',
                                    color: isDesktop ? '#0E305D' : '#757575',
                                    maxWidth: '100%',
                                    margin: 0,
                                    marginBottom: isDesktop ? '0' : '8px'
                                }}
                            >
                                {cms.featureSectionSubtitle || "Skip the setup hassle. Get high-performance workstations pre-configured with Ollama for instant AI development. Run large language models locally."}
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
                                href={cms.featureSectionCtaLink || "/products"}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontWeight: 500,
                                    fontSize: isDesktop ? '16px' : '8.68px',
                                    lineHeight: isDesktop ? '23px' : '13px',
                                    letterSpacing: isDesktop ? '-0.4px' : '-0.289px',
                                    color: '#1F1F1F',
                                    background: isDesktop ? undefined : '#FFCF46',
                                    borderRadius: isDesktop ? '32px' : '20.47px',
                                    padding: isDesktop ? '6px 20px' : '4.34px 14.47px',
                                    height: isDesktop ? '35px' : '22.68px',
                                    textDecoration: 'none',
                                    ...(isDesktop ? {} : {})
                                }}
                                className={isDesktop ? 'btn-primary' : ''}
                            >
                                {cms.featureSectionCtaText || "Rent Now"}
                            </Link>
                        </motion.div>
                    </div>

                    {/* Center Content (Laptop + Air) (Order 2) */}
                    <div className="lg:w-[48%] w-full flex items-center justify-center relative lg:static z-0 order-2 mt-4 lg:mt-0">
                        {/* Air watermark inside center */}
                        <div
                            className="absolute left-1/2 pointer-events-none select-none z-0"
                            style={{
                                transform: isDesktop ? 'translateX(-50%)' : 'translate(-50%, -50%)',
                                opacity: isDesktop ? 0.2 : 0.18,
                                width: isDesktop ? '429px' : '100%',
                                height: isDesktop ? '219px' : 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                left: isDesktop ? '633.5px' : undefined,
                                top: isDesktop ? '72px' : '40%'
                            }}
                        >
                            <span
                                className="font-extrabold select-none whitespace-nowrap"
                                style={{
                                    fontFamily: "'Mona Sans', sans-serif",
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
                            className="relative lg:absolute lg:left-[431px] lg:top-[77px] w-[240px] h-[126px] lg:w-[429px] lg:h-[268px] max-w-[600px] flex items-center justify-center drop-shadow-2xl lg:drop-shadow-none z-10"
                        >
                            <Image
                                src={cms.featureSectionImage || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961205/indian-rentals/gfjrzgp5llzcjap30wkt.png"}
                                alt={cms.featureSectionTitle || "Laptop"}
                                fill
                                className={isDesktop ? "object-contain" : "object-contain scale-110 translate-y-1"}
                                priority
                                sizes="(max-width: 768px) 100vw, 429px"
                            />
                        </motion.div>
                    </div>

                    {/* Right Content (Stats) (Order 3) */}
                    <div
                        className="w-full flex-row lg:flex-col items-center justify-between lg:items-start z-10 order-3 lg:mt-0 flex"
                        style={{
                            width: isDesktop ? '142px' : '358px',
                            height: isDesktop ? 'auto' : '113px',
                            gap: isDesktop ? '29px' : '10px',
                            minHeight: isDesktop ? 'auto' : '113px',
                            paddingTop: isDesktop ? '0' : '0px',
                            justifyContent: isDesktop ? 'center' : 'space-between',
                            margin: isDesktop ? '0' : '0 auto',
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
                                        width: isDesktop ? ['142px', '107px', '97px'][idx] : 'auto',
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
                                            width: 'auto',
                                            height: 'auto',
                                            gap: 0,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'flex-start'
                                        }}
                                    >
                                        <p
                                            style={{
                                                fontFamily: "'Mona Sans', sans-serif",
                                                fontSize: isDesktop ? '14px' : '10px',
                                                fontWeight: 600,
                                                lineHeight: isDesktop ? '20px' : '16px',
                                                letterSpacing: '-0.4px',
                                                color: isThird ? 'transparent' : (isDesktop ? '#757575' : '#757575'),
                                                background: isThird ? 'linear-gradient(90deg, #0F3914 0%, #51966A 87.77%)' : 'none',
                                                WebkitBackgroundClip: isThird ? 'text' : 'none',
                                                WebkitTextFillColor: isThird ? 'transparent' : 'inherit',
                                                marginBottom: 0,
                                            }}
                                        >
                                            {stat.label}
                                        </p>
                                        <h4
                                            style={{
                                                fontFamily: "'Mona Sans', sans-serif",
                                                fontSize: isDesktop ? '27px' : '20px',
                                                fontWeight: isDesktop ? 500 : 600,
                                                lineHeight: isDesktop ? '25px' : '26px',
                                                letterSpacing: isDesktop ? '-1.5px' : '-0.8px',
                                                margin: 0,
                                                background: isThird
                                                    ? 'linear-gradient(90deg, #0F3914 0%, #51966A 87.77%)'
                                                    : 'linear-gradient(90deg, #0F2239 0%, #517396 87.77%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}
                                        >
                                            {stat.value}
                                        </h4>
                                    </div>
                                    <p
                                        style={{
                                            fontFamily: "'Mona Sans', sans-serif",
                                            fontSize: isDesktop ? '14px' : '10px',
                                            fontWeight: isDesktop && isThird ? 500 : 600,
                                            lineHeight: isDesktop ? '20px' : '16px',
                                            letterSpacing: '-0.4px',
                                            color: isThird ? 'transparent' : '#757575',
                                            background: isThird ? 'linear-gradient(90deg, #0F3914 0%, #51966A 87.77%)' : 'none',
                                            WebkitBackgroundClip: isThird ? 'text' : 'none',
                                            WebkitTextFillColor: isThird ? 'transparent' : 'inherit',
                                            marginTop: isDesktop ? '2px' : 0,
                                            overflow: 'hidden'
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
                        className={isDesktop ? "absolute left-[520px] top-[335.5px] z-10 pointer-events-none whitespace-nowrap" : "w-full text-center relative z-20 order-4 mt-auto"}
                    >
                        <h3
                            className={isDesktop ? 'font-manrope' : ''}
                            style={{
                                fontFamily: isDesktop ? undefined : "'Mona Sans', sans-serif",
                                fontWeight: isDesktop ? 600 : 800,
                                fontSize: isDesktop ? '24px' : '12px',
                                lineHeight: isDesktop ? '48px' : '18px',
                                letterSpacing: isDesktop ? '-1.5px' : '-0.4px',
                                background: 'linear-gradient(90deg, #3583F0 0%, #BC58E3 47.12%, #E05821 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                paddingBottom: isDesktop ? 0 : '8px',
                                margin: 0
                            }}
                        >
                            Built for Apple Intelligence.
                        </h3>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;