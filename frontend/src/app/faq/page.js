'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import FaqSection from '../../components/FaqSection';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function FaqPage() {
    const [cms, setCms] = useState(null);
    useEffect(() => {
        window.fetch(`${API}/api/cms/faq?t=${Date.now()}`)
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d) setCms(d); })
            .catch(() => {});
    }, []);

    const bannerImage = cms?.bannerImage || 'https://res.cloudinary.com/dgkckcdk8/image/upload/v1776716131/e92cf0b55a28cc573a6ad7b73d746dd47431bb2e_1_jlph2i.png';
    const bannerTitle = cms?.bannerTitle || 'FAQs';

    return (
        <div className="font-sans text-gray-800">
            <section className="w-full max-w-[1440px] mx-auto mt-5 md:mt-8 mb-8 md:mb-16">
                <div className="max-w-[1200px] mx-auto px-5 md:px-8">
                    <div className="w-full h-[197px] md:h-[400px] relative bg-gray-200 overflow-hidden rounded-xl md:rounded-3xl">
                        <Image src={bannerImage} alt={bannerTitle} fill className="object-cover object-center" />
                        <div className="absolute inset-0 bg-black/20 md:bg-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h1 className="text-white text-base md:text-7xl font-semibold drop-shadow-lg font-sans">{bannerTitle}</h1>
                        </div>
                    </div>
                </div>
            </section>
            <FaqSection cmsData={cms} limit={17} />
        </div>
    );
}
