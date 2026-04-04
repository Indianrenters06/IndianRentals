"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';

import { API } from '../services/apiConfig';

const FeatureSection = () => {
    const [viewType, setViewType] = React.useState('mobile');
    const [cms, setCms] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const checkRes = () => {
            const w = window.innerWidth;
            if (w >= 1024) setViewType('desktop');
            else if (w >= 768) setViewType('tablet');
            else setViewType('mobile');
        };
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
            <div className={viewType === 'desktop' ? "w-full max-w-[1200px] mx-auto px-4 sm:px-6" : (viewType === 'tablet' ? "w-full mx-auto px-0" : "w-full max-w-[1200px] mx-auto px-0")}>

                <div
                    className="relative overflow-hidden"
                    style={{
                        background: 'radial-gradient(181.93% 64.7% at 50% 72.89%, #FFFFFF 0%, #D6F1FF 100%)',
                        width: viewType === 'mobile' ? '390px' : '100%',
                        height: viewType === 'desktop' ? '339px' : (viewType === 'tablet' ? '380px' : 'auto'),
                        minHeight: viewType === 'mobile' ? '390px' : 'auto',
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: viewType === 'mobile' ? 'center' : 'center',
                        justifyContent: 'space-between',
                        borderRadius: viewType === 'desktop' ? '30px' : '0px',
                        overflow: 'hidden',
                        paddingTop: viewType === 'desktop' ? '25px' : (viewType === 'tablet' ? '24px' : '40px'),
                        paddingBottom: viewType === 'desktop' ? '55px' : (viewType === 'tablet' ? '24px' : '40px'),
                        paddingLeft: viewType === 'desktop' ? '30px' : (viewType === 'tablet' ? '28px' : '20px'),
                        paddingRight: viewType === 'desktop' ? '60px' : (viewType === 'tablet' ? '28px' : '20px'),
                        gap: viewType === 'tablet' ? '10px' : (viewType === 'desktop' ? '0' : '20px')
                    }}
                >

                    {/* Left content */}
                    <div
                        className="z-10 relative flex flex-col"
                        style={{
                            width: viewType === 'desktop' ? 'auto' : (viewType === 'tablet' ? '28%' : '100%'),
                            height: viewType === 'desktop' ? '243px' : 'auto',
                            gap: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            textAlign: 'left'
                        }}
                    >
                        <div className="flex flex-col" style={{ width: 'auto', height: 'auto', gap: '4px', display: 'flex', flexDirection: 'column' }}>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="font-manrope"
                                style={{
                                    width: 'auto',
                                    height: 'auto',
                                    fontWeight: '500',
                                    background: 'linear-gradient(90deg, #0F2239 0%, #517396 87.77%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    color: 'transparent',
                                    letterSpacing: '-0.02em',
                                    lineHeight: '1.1',
                                    whiteSpace: 'nowrap',
                                    fontSize: viewType === 'desktop' ? '42px' : (viewType === 'tablet' ? '32px' : '36px')
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
                                    width: viewType === 'desktop' ? '235px' : (viewType === 'tablet' ? '190px' : 'auto'),
                                    height: viewType === 'desktop' ? '115px' : 'auto',
                                    fontSize: '13px',
                                    fontWeight: '400',
                                    color: 'hsla(214, 74%, 21%, 1)',
                                    lineHeight: '1.5',
                                    maxWidth: viewType === 'desktop' ? '235px' : (viewType === 'tablet' ? '190px' : '500px'),
                                    overflow: 'hidden',
                                    marginTop: '10px',
                                    marginBottom: '0'
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
                            className="flex relative z-30 justify-center lg:justify-start"
                        >
                            <Link
                                href={cms.featureSectionCtaLink || "/store"}
                                className="inline-flex items-center justify-center transition-all hover:bg-[#ffb50f] hover:scale-105 shadow-sm whitespace-nowrap"
                                style={{
                                    width: viewType === 'desktop' ? '130px' : '120px',
                                    height: viewType === 'desktop' ? '35px' : '32px',
                                    padding: viewType === 'desktop' ? '6px 20px' : '0 20px',
                                    background: 'hsla(44, 100%, 64%, 1)',
                                    color: '#1a2b4c',
                                    borderRadius: viewType === 'desktop' ? '32px' : '9999px',
                                    fontSize: viewType === 'desktop' ? '14px' : '13px',
                                    fontWeight: viewType === 'desktop' ? '500' : 'bold',
                                    gap: viewType === 'desktop' ? '2px' : '4px'
                                }}
                            >
                                {cms.featureSectionCtaText || "Rent Now"}
                            </Link>
                        </motion.div>
                    </div>

                    {/* Center: Laptop image + Air watermark */}
                    <div className="flex items-center justify-center relative z-0" style={{ flex: 1, height: '100%' }}>
                        {/* Air watermark inside center */}
                        <div
                            className="absolute left-1/2 pointer-events-none select-none z-0"
                            style={{
                                transform: 'translate(-50%, -50%)',
                                opacity: viewType === 'desktop' ? 0.2 : 0.18,
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
                                    fontSize: viewType === 'desktop' ? '292px' : (viewType === 'tablet' ? '240px' : '180px'),
                                    fontWeight: '500',
                                    lineHeight: viewType === 'desktop' ? '240px' : (viewType === 'tablet' ? '200px' : '160px'),
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
                                className={viewType === 'desktop' ? "object-contain hover:scale-100 transition-transform duration-500 scale-105" : (viewType === 'tablet' ? "object-contain scale-105" : "object-contain scale-110 translate-y-1")}
                                priority
                                sizes="(max-width: 768px) 100vw, 600px"
                            />
                        </motion.div>
                    </div>

                    {/* Right: Stats column */}
                    <div
                        className="flex z-10"
                        style={{
                            width: viewType === 'desktop' ? '142px' : (viewType === 'tablet' ? '110px' : '100%'),
                            height: viewType === 'desktop' ? '339px' : 'auto',
                            flexDirection: 'column',
                            gap: viewType === 'desktop' ? '29px' : '16px',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            opacity: 1
                        }}
                    >
                        {stats.slice(0, 3).map((stat, idx) => {
                            const isThird = idx === 2; // third column (battery life)
                            return (
                                <motion.div
                                    key={idx}
                                    initial={viewType === 'desktop' ? { opacity: 0, x: 20 } : { opacity: 0 }}
                                    whileInView={viewType === 'desktop' ? { opacity: 1, x: 0 } : { opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + (idx * 0.1) }}
                                    className={viewType === 'desktop' ? "lg:flex-none" : "flex flex-col items-start"}
                                    style={{
                                        width: viewType === 'desktop' ? (idx === 0 ? '142px' : '107px') : 'auto',
                                        height: 'auto',
                                        minWidth: viewType === 'desktop' ? 'none' : '120px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 0,
                                        justifyContent: viewType === 'desktop' ? 'flex-start' : 'center',
                                        alignItems: viewType === 'desktop' ? 'flex-start' : 'center'
                                    }}
                                >
                                    <div
                                        className="flex flex-col"
                                        style={{
                                            width: viewType === 'desktop' ? '76px' : 'auto',
                                            height: 'auto',
                                            gap: 0,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'flex-start',
                                            alignItems: viewType === 'desktop' ? 'flex-start' : 'center'
                                        }}
                                    >
                                        <p
                                            className="font-manrope"
                                            style={{
                                                fontSize: viewType === 'desktop' ? '13px' : '9px',
                                                fontWeight: viewType === 'desktop' ? '600' : '500',
                                                width: viewType === 'desktop' ? '51px' : 'auto',
                                                height: 'auto',
                                                color: viewType === 'desktop' ? (isThird ? '#2d5d36' : 'hsla(0, 0%, 46%, 1)') : '#64748b',
                                                lineHeight: viewType === 'desktop' ? '1.2' : 'normal',
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
                                                fontSize: viewType === 'mobile' ? '24px' : '32px',
                                                fontWeight: viewType === 'desktop' ? '500' : 'bold',
                                                width: viewType === 'desktop' ? '76px' : 'auto',
                                                height: 'auto',
                                                display: 'flex',
                                                alignItems: 'center',
                                                margin: 0,
                                                background: viewType === 'desktop' ? (isThird ? 'none' : 'linear-gradient(90deg, #0F2239 0%, #517396 87.77%)') : 'none',
                                                WebkitBackgroundClip: viewType === 'desktop' ? (isThird ? 'none' : 'text') : 'none',
                                                WebkitTextFillColor: viewType === 'desktop' ? (isThird ? 'inherit' : 'transparent') : 'inherit',
                                                color: isThird ? '#2d5d36' : (viewType === 'desktop' ? 'transparent' : '#1a2b4c'),
                                                lineHeight: viewType === 'desktop' ? '1.1' : 'normal',
                                                letterSpacing: viewType === 'desktop' ? '-0.02em' : 'tight'
                                            }}
                                        >
                                            {stat.value}
                                        </h4>
                                    </div>
                                    <p
                                        className="font-manrope"
                                        style={{
                                            fontSize: viewType === 'desktop' ? '12px' : '9px',
                                            fontWeight: viewType === 'desktop' ? '600' : '500',
                                            width: viewType === 'desktop' ? (idx === 0 ? '142px' : '107px') : '90px',
                                            height: 'auto',
                                            color: viewType === 'desktop' ? (isThird ? '#2d5d36' : 'hsla(0, 0%, 46%, 1)') : (isThird ? '#2d5d36' : '#64748b'),
                                            lineHeight: viewType === 'desktop' ? '1.2' : '1.2',
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

                    {/* "Built for Apple Intelligence" — pinned to bottom center on tablet & desktop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="w-full text-center z-10 pointer-events-none"
                        style={{
                            position: (viewType === 'desktop' || viewType === 'tablet') ? 'absolute' : 'relative',
                            bottom: (viewType === 'desktop' || viewType === 'tablet') ? '14px' : 'auto',
                            left: (viewType === 'desktop' || viewType === 'tablet') ? '50%' : 'auto',
                            transform: (viewType === 'desktop' || viewType === 'tablet') ? 'translateX(-50%)' : 'none',
                            marginTop: viewType === 'mobile' ? '24px' : 0
                        }}
                    >
                        <h3 className="font-manrope text-[14px] md:text-xl font-bold tracking-tight pb-2">
                            <span className="text-[#3b82f6]">Built for </span>
                            <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-500 via-pink-500 to-orange-500">
                                Apple Intelligence.
                            </span>
                        </h3>
                    </motion.div>

                    {/* Entire Section Link Overlay */}
                    {cms.featureSectionLink && (
                        <Link 
                            href={cms.featureSectionLink} 
                            className="absolute inset-0 z-20" 
                            aria-label="View Project"
                        />
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
