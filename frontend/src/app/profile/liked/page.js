'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function WishlistPage() {
    return (
        <div className="bg-white min-h-[500px] flex flex-col items-center justify-center text-center px-4 py-10 md:py-12">
            {/* Illustration */}
            <div className="relative w-[300px] md:w-[516px] max-w-full aspect-[350/328] md:aspect-[516/328] mb-4">
                <Image
                    src="/empty-state-courier.png"
                    alt="Your wish list is empty"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            <h2 className="text-[25px] md:text-[36px] font-semibold text-black tracking-tight mb-1 leading-tight">
                Your wish list is wishless...
            </h2>

            <p className="text-[12px] md:text-[16px] font-semibold text-[#757575] max-w-[300px] md:max-w-none mb-4">
                Click on the heart in the corner of any product to save them here.
            </p>

            <Link
                href="/"
                className="bg-[#FFCF46] hover:brightness-105 text-[#1f1f1f] font-medium text-[12px] md:text-[16px] py-1.5 md:py-2 px-5 rounded-full transition-all"
            >
                Explore Products
            </Link>
        </div>
    );
}
