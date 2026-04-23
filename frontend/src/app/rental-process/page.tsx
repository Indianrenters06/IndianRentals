'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Testimonials from '@/components/Testimonials';
import WhyChooseUs from '@/components/WhyChooseUs';
import RentalProcess from '@/components/RentalProcess';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function RentalProcessPage() {
    const [cms, setCms] = useState<{ bannerImage?: string; bannerTitle?: string } | null>(null);
    useEffect(() => {
        fetch(`${API}/api/cms/rental-process`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d) setCms(d); })
            .catch(() => {});
    }, []);

    const bannerImage = cms?.bannerImage || 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1776714078/9f8d4d5a95b5ff564196928771ca74a7229121d9_1_ru5asw.png';
    const bannerTitle = cms?.bannerTitle || 'Rental Process';

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
            <RentalProcess />

            {/* 3. Features Section (1440px Outer Wrapper) */}
            <section
                className="w-full relative mx-auto"
                style={{
                    maxWidth: '1440px',
                    height: '568px',
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
                        height: '372px',
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
                            Features
                        </h2>
                        <p className="text-gray-600 font-sans text-[16px] leading-[1.5]">
                            Rent with confidence. Every product comes with transparent pricing, flexible terms, and reliable support—so you focus on your work, not equipment hassles.
                        </p>
                    </div>

                    <div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                        style={{
                            width: '100%',
                            maxWidth: '1200px',
                            height: '236px',
                            opacity: 1,
                            margin: '0 auto'
                        }}
                    >
                        <div 
                            className="flex flex-col items-center justify-center text-center"
                            style={{
                                width: '300px',
                                height: '236px',
                                padding: '10px 45px',
                                gap: '10px',
                                borderStyle: 'solid',
                                borderColor: 'hsla(0, 0%, 89%, 1)',
                                borderWidth: '1px 0px 1px 1px',
                                borderTopLeftRadius: '8px',
                                borderBottomLeftRadius: '8px',
                                borderTopRightRadius: '0px',
                                borderBottomRightRadius: '0px',
                                opacity: 1
                            }}
                        >
                            <div 
                                className="flex flex-col items-center justify-center"
                                style={{
                                    width: '210px',
                                    height: '186px',
                                    gap: '9px'
                                }}
                            >
                                <div className="w-[120px] h-[120px] relative">
                                    <img 
                                        src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1776714078/64e2ed1925a146151a5bfc674829bb2b3e685b49_4_zpulqn.png" 
                                        alt="Quick Support"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 font-sans">Quick Support</h3>
                                <p className="text-gray-500 text-sm font-sans">Get expert help fast</p>
                            </div>
                        </div>

                        <div 
                            className="flex flex-col items-center justify-center text-center"
                            style={{
                                width: '300px',
                                height: '236px',
                                padding: '10px 45px',
                                borderStyle: 'solid',
                                borderColor: 'hsla(0, 0%, 89%, 1)',
                                borderWidth: '1px 0px 1px 1px',
                                borderRadius: '0px',
                                opacity: 1
                            }}
                        >
                            <div 
                                className="flex flex-col items-center justify-center"
                                style={{
                                    width: '210px',
                                    height: '186px',
                                    gap: '9px'
                                }}
                            >
                                <div className="w-[120px] h-[120px] relative">
                                    <img 
                                        src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1776714078/53e0a0d956bf3d54d0997d047297f346d4908850_bhrpr9.png" 
                                        alt="Rental Flexibility"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 font-sans">Rental Flexibility</h3>
                                <p className="text-gray-500 text-sm font-sans">Choose your rental plan</p>
                            </div>
                        </div>

                        <div 
                            className="flex flex-col items-center justify-center text-center"
                            style={{
                                width: '300px',
                                height: '236px',
                                padding: '10px 45px',
                                borderStyle: 'solid',
                                borderColor: 'hsla(0, 0%, 89%, 1)',
                                borderWidth: '1px 0px 1px 1px',
                                borderRadius: '0px',
                                opacity: 1
                            }}
                        >
                            <div 
                                className="flex flex-col items-center justify-center"
                                style={{
                                    width: '210px',
                                    height: '186px',
                                    gap: '9px'
                                }}
                            >
                                <div className="w-[120px] h-[120px] relative">
                                    <img 
                                        src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1776714078/260aac3296a9280da7a16f16198d38259c3bae80_kpopdw.png"
                                        alt="Fast Delivery"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 font-sans">Fast Delivery</h3>
                                <p className="text-gray-500 text-sm font-sans">We deliver quickly across India within 48-72 hour</p>
                            </div>
                        </div>

                        <div 
                            className="flex flex-col items-center justify-center text-center"
                            style={{
                                width: '300px',
                                height: '236px',
                                padding: '10px 45px',
                                borderStyle: 'solid',
                                borderColor: 'hsla(0, 0%, 89%, 1)',
                                borderWidth: '1px 1px 1px 1px',
                                borderTopRightRadius: '8px',
                                borderBottomRightRadius: '8px',
                                borderTopLeftRadius: '0px',
                                borderBottomLeftRadius: '0px',
                                opacity: 1
                            }}
                        >
                            <div 
                                className="flex flex-col items-center justify-center"
                                style={{
                                    width: '210px',
                                    height: '186px',
                                    gap: '9px'
                                }}
                            >
                                <div className="w-[120px] h-[120px] relative">
                                    <img 
                                        src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1776714078/5a60bd00913e9a476e28e7fd1494a1dbaf0d6961_ffiy6e.png"
                                        alt="No Hidden Charges"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 font-sans">No Hidden Charges</h3>
                                <p className="text-gray-500 text-sm font-sans">One transparent invoice</p>
                            </div>
                        </div>
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
                overridePadding="80px 0px"
                overrideHeight="888px"
            />
        </div>
    );
}
