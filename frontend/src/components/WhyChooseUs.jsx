import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { API } from '@/services/apiConfig';

const WhyChooseUs = () => {
    const [cms, setCms] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkRes = () => setIsDesktop(window.innerWidth >= 768);
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
            className="py-12 md:py-16 overflow-hidden"
            style={{ 
                background: isDesktop ? 'var(--color-orange-orange-50, hsla(44, 100%, 96%, 1))' : '#FFFDF7',
                borderBottom: isDesktop ? '1px solid var(--color-grey-grey-200, hsla(0, 0%, 89%, 1))' : 'none'
            }}
        >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
                <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">

                    {/* Text Content - always first on mobile */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-4xl font-semibold font-manrope text-gray-900">
                                {title}
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-lg">
                                {subtitle}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 md:gap-8 pt-2">
                            {stats.map((s, i) => (
                                <div key={i} className="space-y-1">
                                    <h3 
                                        className="font-manrope text-2xl font-bold"
                                        style={{ 
                                            fontSize: isDesktop ? '48px' : undefined, 
                                            fontWeight: isDesktop ? '500' : undefined, 
                                            lineHeight: isDesktop ? '58px' : undefined,
                                            color: isDesktop ? 'hsla(0, 0%, 13%, 1)' : '#111827',
                                            marginLeft: isDesktop ? '4px' : '0',
                                            opacity: 1
                                        }}
                                    >
                                        {s.value}
                                    </h3>
                                    <p 
                                        className="font-manrope text-xs font-medium text-gray-500"
                                        style={{ 
                                            fontSize: isDesktop ? '13.5px' : undefined, 
                                            fontWeight: isDesktop ? '500' : undefined, 
                                            lineHeight: isDesktop ? '18px' : undefined,
                                            letterSpacing: isDesktop ? '-0.01em' : undefined
                                        }}
                                    >
                                        {s.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image Content */}
                    <div className="relative md:justify-self-end w-full max-w-[508px] aspect-508/336 mt-6 md:mt-0">
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
