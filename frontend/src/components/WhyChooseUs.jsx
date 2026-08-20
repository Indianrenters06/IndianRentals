"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { API } from '@/services/apiConfig';

const WhyChooseUs = ({ cmsData = null, overrideBg, overridePaddingTop, hideBorder }) => {
    const [cms, setCms] = useState(cmsData || null);
    const [loading, setLoading] = useState(!cmsData);
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
        if (cmsData) {
            setCms(cmsData);
            setLoading(false);
            return;
        }
        fetch(`${API}/api/cms/homepage`)
            .then(res => res.ok ? res.json() : null)
            .then(data => { setCms(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [cmsData]);

    // Handle both Homepage and About page field mappings
    const title = cms?.aboutWhyTitle || cms?.whyChooseUsTitle || "Why Choose Us?";
    const subtitle = cms?.aboutWhyText || cms?.whyChooseUsSubtitle || "Join thousands who've switched to the flexible, affordable way to access high-end tech. IndianRenters delivers AI-ready workstations, laptops, and IT gear with zero ownership hassle and instant support.";
    const image = cms?.aboutWhyImage || cms?.whyChooseUsImage || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961565/indian-rentals/anmpufdlxxxblkxqxpds.jpg";

    const stats = [
        { label: cms?.aboutWhyStat1Label || cms?.statsDevicesLabel || "Devices in Stock", value: cms?.aboutWhyStat1Value || cms?.statsDevices || "90k+" },
        { label: cms?.aboutWhyStat2Label || cms?.statsCustomersLabel || "Happy Customers", value: cms?.aboutWhyStat2Value || cms?.statsCustomers || "30k+" },
        { label: cms?.aboutWhyStat3Label || cms?.statsCitiesLabel || "Cities Covered", value: cms?.aboutWhyStat3Value || cms?.statsCities || "401+" },
    ];

    if (loading) return <div className="h-96 w-full animate-pulse bg-slate-50 rounded-3xl" />;
    if (cms && cms.whyChooseUsEnabled === false) return null;

    // ── Mobile Layout ─────────────────────────────────────────────────────────
    if (viewType === 'mobile') {
        return (
            <section
                style={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '48px 20px',
                    gap: '10px',
                    width: '100%',
                    background: overrideBg || '#FFF1C5',
                    borderBottom: hideBorder ? 'none' : '1px solid #E2E2E2',
                    position: 'relative',
                    overflow: 'hidden',
                    isolation: 'isolate'
                }}
            >
                {/* Frame 670 — Yellow background block */}
                <div
                    style={{
                        position: 'absolute',
                        width: '350px',
                        height: '197px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bottom: '48px',
                        background: '#FFB91B',
                        borderRadius: '32px',
                        zIndex: 0
                    }}
                />

                {/* Frame 299 — Main content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: '0px',
                        gap: '20px',
                        width: '100%',
                        maxWidth: '350px',
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    {/* Text block */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px', width: '100%' }}>
                        <h2
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: 600,
                                fontSize: '25px',
                                lineHeight: '31px',
                                letterSpacing: '-0.8px',
                                color: '#333333',
                                margin: 0
                            }}
                        >
                            {title}
                        </h2>
                        <p
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: 400,
                                fontSize: '12px',
                                lineHeight: '18px',
                                letterSpacing: '-0.4px',
                                color: '#545454',
                                margin: 0,
                                width: '100%'
                            }}
                        >
                            {subtitle}
                        </p>
                    </div>

                    {/* Divider */}
                    <div style={{ width: '100%', height: '1px', background: '#E2E2E2', flexShrink: 0 }} />

                    {/* Stats Row */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            padding: '0px'
                        }}
                    >
                        {stats.map((s, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: i === 1 ? 'center' : 'flex-start',
                                    gap: '4px'
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "'Mona Sans', sans-serif",
                                        fontWeight: 600,
                                        fontSize: '20px',
                                        lineHeight: '26px',
                                        letterSpacing: '-0.8px',
                                        color: '#333333',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {s.value}
                                </span>
                                <span
                                    style={{
                                        fontFamily: "'Mona Sans', sans-serif",
                                        fontWeight: 500,
                                        fontSize: '8px',
                                        lineHeight: '14px',
                                        letterSpacing: '-0.4px',
                                        color: '#757575',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Image */}
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '197px',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            flexShrink: 0
                        }}
                    >
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>
        );
    }

    // ── Desktop / Tablet Layout ───────────────────────────────────────────────
    return (
        <section
            className="overflow-hidden"
            style={{
                paddingTop: overridePaddingTop || '80px',
                paddingBottom: '80px',
                background: overrideBg || '#FFF1C5',
                borderBottom: hideBorder ? 'none' : '1px solid var(--color-grey-grey-200, hsla(0, 0%, 89%, 1))'
            }}
        >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
                <div className={`grid ${viewType === 'desktop' ? 'grid-cols-2' : 'grid-cols-1'} gap-[10px] items-center`}>

                    {/* Text Content */}
                    <div
                        className="flex flex-col"
                        style={{
                            gap: viewType === 'tablet' ? '32px' : '24px',
                            opacity: 1
                        }}
                    >
                        <div className="flex flex-col gap-[10px]">
                            <h2
                                className="font-sans"
                                style={{
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontWeight: 600,
                                    fontSize: '36px',
                                    lineHeight: '48px',
                                    letterSpacing: '-0.02em',
                                    color: 'hsla(0, 0%, 20%, 1)',
                                }}
                            >
                                {title}
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-[15px]">
                                {subtitle}
                            </p>
                        </div>

                        <div style={{ width: '100%', height: '1px', background: 'var(--color-grey-grey-200, hsla(0, 0%, 89%, 1))' }} />

                        <div className="grid grid-cols-3 gap-4 md:gap-8">
                            {stats.map((s, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <h3
                                        className="font-sans text-2xl font-bold"
                                        style={{
                                            fontSize: viewType === 'desktop' ? '27px' : '32px',
                                            fontWeight: viewType === 'desktop' ? '600' : 'bold',
                                            lineHeight: viewType === 'desktop' ? '35px' : '40px',
                                            color: viewType === 'desktop' ? 'hsla(0, 0%, 20%, 1)' : '#111827',
                                            letterSpacing: viewType === 'desktop' ? '-0.8px' : undefined,
                                            opacity: 1
                                        }}
                                    >
                                        {s.value}
                                    </h3>
                                    <p
                                        className="font-sans font-medium text-gray-500"
                                        style={{
                                            fontSize: viewType === 'desktop' ? '14px' : '13px',
                                            fontWeight: '500',
                                            lineHeight: viewType === 'desktop' ? '20px' : '18px',
                                            letterSpacing: viewType === 'desktop' ? '-0.4px' : undefined
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
                        <div
                            className="absolute left-[24px] top-[24px] w-full h-full"
                            style={{ borderRadius: '24px', background: 'hsla(42, 100%, 55%, 1)' }}
                        />
                        <div className="relative z-10 w-full h-full" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                            <Image src={image} alt={title} fill className="object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
