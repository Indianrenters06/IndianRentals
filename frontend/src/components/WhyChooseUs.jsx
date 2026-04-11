import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { API } from '@/services/apiConfig';

const WhyChooseUs = () => {
    const [cms, setCms] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewType, setViewType] = useState('mobile');

    useEffect(() => {
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

    useEffect(() => {
        fetch(`${API}/api/cms/homepage`)
            .then(res => res.ok ? res.json() : null)
            .then(data => { setCms(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const title = cms?.whyChooseUsTitle || "Why Choose Us?";
    const subtitle = cms?.whyChooseUsSubtitle || "Join thousands who've switched to the flexible, affordable way to access high-end tech. IndianRenters delivers AI-ready workstations, laptops, and IT gear with zero ownership hassle and instant support.";
    const image = cms?.whyChooseUsImage || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961565/indian-rentals/anmpufdlxxxblkxqxpds.jpg";
    const stats = [
        { label: "Devices in Stock", value: cms?.statsDevices || "90k+" },
        { label: "Happy Customers", value: cms?.statsCustomers || "30k+" },
        { label: "Cities Covered", value: cms?.statsCities || "401+" },
    ];

    if (loading) return <div className="h-96 w-full animate-pulse bg-slate-50 rounded-3xl" />;

    return (
        <section
            className="overflow-hidden"
            style={{
                paddingTop: viewType !== 'mobile' ? '80px' : '48px',
                paddingBottom: viewType !== 'mobile' ? '80px' : '48px',
                background: viewType !== 'mobile' ? 'var(--color-orange-orange-50, hsla(44, 100%, 96%, 1))' : '#FFFDF7',
                borderBottom: viewType !== 'mobile' ? '1px solid var(--color-grey-grey-200, hsla(0, 0%, 89%, 1))' : 'none'
            }}
        >
            <div className={`max-w-[1200px] mx-auto ${viewType === 'tablet' ? 'px-8' : 'px-4 sm:px-6'}`}>
                <div className={`grid ${viewType === 'desktop' ? 'grid-cols-2' : 'grid-cols-1'} gap-[10px] items-center`}>

                    {/* Text Content - always first on mobile */}
                    <div
                        className="flex flex-col"
                        style={{
                            width: viewType === 'mobile' ? '350px' : '100%',
                            height: viewType === 'mobile' ? '189px' : 'auto',
                            gap: viewType === 'mobile' ? '20px' : viewType === 'tablet' ? '32px' : '24px',
                            opacity: 1
                        }}
                    >
                        {/* Title + Description block */}
                        <div
                            className="flex flex-col gap-[10px]"
                            style={viewType === 'mobile' ? { overflow: 'hidden' } : {}}
                        >
                            <h2
                                className={viewType !== 'mobile' ? "text-4xl font-semibold font-sans text-gray-900" : ""}
                                style={viewType === 'mobile' ? {
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontWeight: 500,
                                    fontSize: '36px',
                                    lineHeight: '31px',
                                    letterSpacing: '-0.02em',
                                    color: 'hsla(0, 0%, 20%, 1)',
                                    width: '192px',
                                    height: '31px',
                                    opacity: 1,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden'
                                } : {}}
                            >
                                {title}
                            </h2>
                            <p
                                className={viewType !== 'mobile' ? "text-gray-600 leading-relaxed text-sm md:text-[15px]" : ""}
                                style={viewType === 'mobile' ? {
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontWeight: 400,
                                    fontSize: '12px',
                                    lineHeight: '18px',
                                    letterSpacing: '0.01em',
                                    color: 'hsla(0, 0%, 33%, 1)',
                                    width: '350px',
                                    height: '54px',
                                    opacity: 1,
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical'
                                } : {}}
                            >
                                {subtitle}
                            </p>
                        </div>

                        {viewType === 'mobile' && (
                            <div style={{ width: '350px', height: '1px', background: 'var(--color-grey-grey-200, hsla(0, 0%, 89%, 1))' }} />
                        )}

                        {/* Stats row */}
                        <div
                            className={viewType !== 'mobile' ? "grid grid-cols-3 gap-4 md:gap-8" : "flex"}
                            style={viewType === 'mobile' ? {
                                width: '350px',
                                height: '44px',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                opacity: 1
                            } : {}}
                        >
                            {stats.map((s, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <h3
                                        className={viewType !== 'mobile' ? "font-sans text-2xl font-bold" : ""}
                                        style={viewType === 'mobile' ? {
                                            fontFamily: "'Mona Sans', sans-serif",
                                            fontWeight: 600,
                                            fontSize: '20px',
                                            lineHeight: '26px',
                                            letterSpacing: '-0.02em',
                                            color: 'hsla(0, 0%, 20%, 1)',
                                            width: '86px',
                                            height: '26px',
                                            opacity: 1,
                                            whiteSpace: 'nowrap'
                                        } : {
                                            fontSize: viewType === 'desktop' ? '48px' : '32px',
                                            fontWeight: viewType === 'desktop' ? '500' : 'bold',
                                            lineHeight: viewType === 'desktop' ? '58px' : '40px',
                                            color: viewType === 'desktop' ? 'hsla(0, 0%, 13%, 1)' : '#111827',
                                            marginLeft: viewType === 'desktop' ? '4px' : '0',
                                            opacity: 1
                                        }}
                                    >
                                        {s.value}
                                    </h3>
                                    <p
                                        className={viewType !== 'mobile' ? "font-sans font-medium text-gray-500" : ""}
                                        style={viewType === 'mobile' ? {
                                            fontFamily: "'Mona Sans', sans-serif",
                                            fontWeight: 500,
                                            fontSize: '7px',
                                            lineHeight: '14px',
                                            letterSpacing: '0.02em',
                                            color: 'hsla(0, 0%, 46%, 1)',
                                            width: '86px',
                                            height: '14px',
                                            opacity: 1,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        } : {
                                            fontSize: viewType === 'desktop' ? '13.5px' : '13px',
                                            fontWeight: '500',
                                            lineHeight: '18px',
                                            letterSpacing: viewType === 'desktop' ? '-0.01em' : undefined
                                        }}
                                    >
                                        {s.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image Content */}
                    <div className={`relative ${viewType === 'desktop' ? 'justify-self-end w-full max-w-[508px]' : 'w-[calc(100%-24px)]'} aspect-[508/336] mt-4 md:mt-2`}>
                        {/* The yellow background shape spec */}
                        <div
                            className="absolute left-[24px] top-[24px] w-full h-full"
                            style={{
                                borderRadius: '24px',
                                background: 'hsla(42, 100%, 55%, 1)'
                            }}
                        />
                        {/* The primary image */}
                        <div
                            className="relative z-10 w-full h-full"
                            style={{ borderRadius: '24px', overflow: 'hidden' }}
                        >
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
