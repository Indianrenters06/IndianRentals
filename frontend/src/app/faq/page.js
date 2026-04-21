'use client';

import React from 'react';
import Image from 'next/image';
import FaqSection from '../../components/FaqSection';

export default function FaqPage() {
    return (
        <div className="font-sans text-gray-800">
            {/* Header Image/Banner */}
            <section className="w-full max-w-[1440px] mx-auto mt-8 mb-16">
                <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                    <div className="w-full h-[300px] md:h-[400px] relative bg-gray-200 overflow-hidden rounded-3xl">
                        <Image
                            src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1776716131/e92cf0b55a28cc573a6ad7b73d746dd47431bb2e_1_jlph2i.png"
                            alt="FAQs Banner"
                            fill
                            className="object-cover object-center"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h1 className="text-white text-5xl md:text-7xl font-semibold drop-shadow-lg font-sans">FAQs</h1>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reuse the FAQ Section we built */}
            <FaqSection />
        </div>
    );
}
