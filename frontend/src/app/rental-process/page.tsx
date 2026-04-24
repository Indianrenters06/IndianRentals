'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TestimonialsBase from '@/components/Testimonials';
import WhyChooseUsBase from '@/components/WhyChooseUs';
import RentalProcess from '@/components/RentalProcess';

// Cast JSX components to accept custom override props in this TSX page
const WhyChooseUs = WhyChooseUsBase as React.ComponentType<{
    cmsData?: any;
    overrideBg?: string;
    overridePaddingTop?: string;
    hideBorder?: boolean;
}>;
const Testimonials = TestimonialsBase as React.ComponentType<{
    cmsData?: any;
    overrideBg?: string;
    overridePadding?: string;
    overrideHeight?: string;
}>;

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function RentalProcessPage() {
    const [cms, setCms] = useState<any>(null);
    useEffect(() => {
        fetch(`${API}/api/cms/rental-process`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d) setCms(d); })
            .catch(() => {});
    }, []);

    const bannerImage = cms?.bannerImage || 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1776714078/9f8d4d5a95b5ff564196928771ca74a7229121d9_1_ru5asw.png';
    const bannerTitle = cms?.bannerTitle || 'Rental Process';
    const featuresTitle = cms?.rentalFeaturesTitle || 'Features';
    const featuresSubtitle = cms?.rentalFeaturesSubtitle || 'Rent with confidence. Every product comes with transparent pricing, flexible terms, and reliable support—so you focus on your work, not equipment hassles.';
    
    const displayFeatures = cms?.rentalFeatures && cms.rentalFeatures.length > 0 ? cms.rentalFeatures : [
        { title: 'Quick Support', description: 'Get expert help fast', image: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1776714078/64e2ed1925a146151a5bfc674829bb2b3e685b49_4_zpulqn.png' },
        { title: 'Rental Flexibility', description: 'Choose your rental plan', image: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1776714078/53e0a0d956bf3d54d0997d047297f346d4908850_bhrpr9.png' },
        { title: 'Fast Delivery', description: 'We deliver quickly across India within 48-72 hour', image: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1776714078/260aac3296a9280da7a16f16198d38259c3bae80_kpopdw.png' },
        { title: 'No Hidden Charges', description: 'One transparent invoice', image: 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1776714078/5a60bd00913e9a476e28e7fd1494a1dbaf0d6961_ffiy6e.png' },
    ];

    return (
        <div className="font-sans text-gray-800">
            {/* 1. Header Hero Banner */}
            <div className="max-w-[1200px] mx-auto px-4 mt-8 mb-16">
                <div className="w-full h-[300px] md:h-[400px] relative bg-gray-900 overflow-hidden rounded-3xl">
                    <Image
                        src={bannerImage}
                        alt={bannerTitle}
                        fill
                        className="object-cover object-center opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-white text-5xl md:text-7xl font-semibold drop-shadow-lg font-sans">{bannerTitle}</h1>
                    </div>
                </div>
            </div>

            {/* 2. Rental Process Steps Section */}
            <RentalProcess cmsData={cms} />

            {/* 3. Features Section (1440px Outer Wrapper) */}
            <section
                className="w-full relative mx-auto"
                style={{
                    maxWidth: '1440px',
                    minHeight: '568px',
                    paddingTop: '98px',
                    paddingBottom: '98px',
                    background: 'hsla(0, 0%, 100%, 1)',
                    opacity: 1
                }}
            >
                <div
                    className="mx-auto flex flex-col justify-center"
                    style={{
                        maxWidth: '1200px',
                        width: '100%',
                        height: 'auto',
                        gap: '32px',
                        paddingLeft: '16px',
                        paddingRight: '16px',
                        opacity: 1
                    }}
                >
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2
                            className="font-sans font-semibold tracking-tight"
                            style={{
                                fontSize: '36px',
                                lineHeight: '48px',
                                color: 'hsla(0, 0%, 20%, 1)',
                                marginBottom: '16px'
                            }}
                        >
                            {featuresTitle}
                        </h2>
                        <p className="text-gray-600 font-sans text-[16px] leading-[1.5]">
                            {featuresSubtitle}
                        </p>
                    </div>

                    <div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0"
                        style={{
                            width: '100%',
                            maxWidth: '1200px',
                            opacity: 1,
                            margin: '0 auto'
                        }}
                    >
                        {displayFeatures.map((f: any, i: number) => (
                            <div 
                                key={i}
                                className="flex flex-col items-center justify-center text-center p-[10px_45px] border-slate-200"
                                style={{
                                    height: '236px',
                                    borderStyle: 'solid',
                                    borderWidth: i === displayFeatures.length - 1 ? '1px' : '1px 0px 1px 1px',
                                    borderTopLeftRadius: i === 0 ? '8px' : '0px',
                                    borderBottomLeftRadius: i === 0 ? '8px' : '0px',
                                    borderTopRightRadius: i === displayFeatures.length - 1 ? '8px' : '0px',
                                    borderBottomRightRadius: i === displayFeatures.length - 1 ? '8px' : '0px',
                                }}
                            >
                                <div className="flex flex-col items-center justify-center gap-[9px]">
                                    <div className="w-[120px] h-[120px] relative">
                                        <img 
                                            src={f.image || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1776714078/64e2ed1925a146151a5bfc674829bb2b3e685b49_4_zpulqn.png"} 
                                            alt={f.title}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 font-sans">{f.title}</h3>
                                    <p className="text-gray-500 text-sm font-sans">{f.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Why Choose Us Section */}
            <WhyChooseUs 
                overrideBg="hsla(0, 0%, 100%, 1)"
                overridePaddingTop="0px"
                hideBorder={true}
            />

            {/* 5. Testimonials Section */}
            <Testimonials 
                overrideBg="hsla(0, 0%, 100%, 1)"
                overridePadding="20px 0px"
                overrideHeight="888px"
            />
        </div>
    );
}
