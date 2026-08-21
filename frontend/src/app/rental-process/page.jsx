'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Testimonials from '@/components/Testimonials';
import WhyChooseUs from '@/components/WhyChooseUs';
import RentalProcess from '@/components/RentalProcess';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function RentalProcessPage() {
    const [cms, setCms] = useState(null);
    useEffect(() => {
        fetch(`${API}/api/cms/rental-process`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d) setCms(d); })
            .catch(() => {});
    }, []);

    const bannerImage = cms?.bannerImage || 'https://res.cloudinary.com/dpu9ikeqe/image/upload/v1787305860/9f8d4d5a95b5ff564196928771ca74a7229121d9_jmb6yw.png';
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
        <div className="font-sans text-gray-800 bg-white">
            {/* 1. Hero Header Banner */}
            <div className="w-full max-w-[1200px] mx-auto px-5 md:px-8 pt-5 md:pt-7">
                <div className="relative overflow-hidden flex items-center justify-center w-full mx-auto rounded-2xl md:rounded-[32px] h-[197px] md:h-[400px]">
                    <Image
                        src={bannerImage}
                        alt={bannerTitle}
                        fill
                        className="object-cover object-center opacity-80"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <h1 className="relative z-10 text-white drop-shadow-md font-semibold text-[16px] md:text-5xl text-center tracking-[-0.8px]">
                        {bannerTitle}
                    </h1>
                </div>
            </div>

            {/* 2. How It Works Section */}
            <RentalProcess cmsData={cms} />

            {/* 3. Why Choose Us Section */}
            <WhyChooseUs />

            {/* 4. Features Section */}
            <section className="w-full bg-white py-12">
                <div className="max-w-[1200px] mx-auto px-5 md:px-8 flex flex-col items-center gap-8">
                    {/* Header */}
                    <div className="text-center max-w-2xl mx-auto flex flex-col gap-1 md:gap-3">
                        <h2 className="font-semibold text-[#333333] tracking-[-0.8px] text-[25px] md:text-[36px] leading-[31px] md:leading-[48px]">
                            {featuresTitle}
                        </h2>
                        <p className="text-[#545454] font-medium text-[12px] md:text-[16px] leading-[18px] md:leading-6 tracking-[-0.4px]">
                            {featuresSubtitle}
                        </p>
                    </div>

                    {/* Features Grid: 2x2 on Mobile, 4x1 on Desktop */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 w-full">
                        {displayFeatures.map((f, i) => {
                            const isTop = i < 2;
                            const isLeft = i % 2 === 0;
                            return (
                                <div
                                    key={i}
                                    className={`border-[#e2e2e2] border-solid flex flex-col items-center justify-center p-3 md:p-6 h-[180px] md:h-[236px] text-center
                                        ${isTop ? 'border-t' : ''} ${isLeft ? 'border-l' : 'border-r'}
                                        ${isTop && isLeft ? 'rounded-tl-xl border-r border-b lg:rounded-r-none' : ''}
                                        ${isTop && !isLeft ? 'rounded-tr-xl border-b lg:rounded-l-none' : ''}
                                        ${!isTop && isLeft ? 'rounded-bl-xl border-r border-b lg:rounded-r-none' : ''}
                                        ${!isTop && !isLeft ? 'rounded-br-xl border-b lg:rounded-l-none' : ''}
                                    `}
                                >
                                    <div className="flex flex-col items-center justify-center gap-2 md:gap-3">
                                        <div className="w-[80px] h-[80px] md:w-[110px] md:h-[110px] relative">
                                            <img
                                                src={f.image || "https://res.cloudinary.com/dgkckcdk8/image/upload/v1776714078/64e2ed1925a146151a5bfc674829bb2b3e685b49_4_zpulqn.png"}
                                                alt={f.title}
                                                className="w-full h-full object-contain pointer-events-none"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h3 className="font-semibold text-[#333333] text-[14px] md:text-xl tracking-[-0.8px]">{f.title}</h3>
                                            <p className="text-[#757575] text-[10px] md:text-sm font-normal tracking-[-0.4px]">{f.description}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 5. Testimonials Section */}
            <Testimonials />
        </div>
    );
}

