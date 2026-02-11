'use client';

import React from 'react';
import Image from 'next/image';
import FaqSection from '../../components/FaqSection';

export default function FaqPage() {
    return (
        <div className="font-sans text-gray-800 pb-20">
            {/* Header Image/Banner */}
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16">
                <div className="w-full h-[300px] md:h-[400px] relative bg-gray-200 overflow-hidden rounded-3xl">
                    <Image
                        src="https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770802401/e92cf0b55a28cc573a6ad7b73d746dd47431bb2e_dwkml7.png"
                        alt="FAQs Banner"
                        fill
                        className="object-cover object-center brightness-75"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-white text-5xl md:text-7xl font-semibold drop-shadow-lg font-manrope">FAQs</h1>
                    </div>
                </div>
            </div>

            {/* Reuse the FAQ Section we built */}
            <FaqSection />
        </div>
    );
}
