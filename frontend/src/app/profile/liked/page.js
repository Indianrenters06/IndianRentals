'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { selectWishlistItems } from '@/redux/features/wishlistSlice';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
    const items = useSelector(selectWishlistItems);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    if (!items || items.length === 0) {
        return (
            <div className="bg-white min-h-[500px] flex flex-col items-center justify-center text-center px-4 py-10 md:py-12">
                {/* Breadcrumb */}
                <nav className="w-full max-w-[1200px] mx-auto px-4 md:px-8 mb-6 flex items-center gap-1 flex-wrap">
                    <Link href="/" className="text-[14px] font-medium text-[#586A84] hover:text-black transition-colors whitespace-nowrap" style={{ fontFamily: "'Mona Sans', sans-serif" }}>Shop all</Link>
                    <ChevronRightIcon className="w-[12px] h-[12px] text-[#586A84] shrink-0" strokeWidth={2.5} />
                    <span className="text-[14px] font-semibold text-[#1D1D1F]" style={{ fontFamily: "'Mona Sans', sans-serif" }}>My Wishlist</span>
                </nav>
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
                    className="btn-primary text-[12px] md:text-[16px] py-1.5 md:py-2 px-5"
                >
                    Explore Products
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white w-full">
            {/* Breadcrumb */}
            <nav className="w-full max-w-[1200px] mx-auto px-1 md:px-2 pt-4 pb-0 flex items-center gap-1 flex-wrap">
                <Link href="/" className="text-[14px] font-medium text-[#586A84] hover:text-black transition-colors whitespace-nowrap" style={{ fontFamily: "'Mona Sans', sans-serif" }}>Shop all</Link>
                <ChevronRightIcon className="w-[12px] h-[12px] text-[#586A84] shrink-0" strokeWidth={2.5} />
                <span className="text-[14px] font-semibold text-[#1D1D1F]" style={{ fontFamily: "'Mona Sans', sans-serif" }}>My Wishlist</span>
            </nav>

            <div className="px-1 md:px-2 py-2 md:py-4">
            <h1
                className="text-[24px] md:text-[36px] font-semibold text-black tracking-tight mb-5 md:mb-6"
                style={{ fontFamily: "'Mona Sans', sans-serif" }}
            >
                My Wishlist <span className="text-[#757575] font-medium">({items.length})</span>
            </h1>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(auto-fill, 285px)',
                    columnGap: isMobile ? '8px' : '20px',
                    rowGap: isMobile ? '8px' : '32px',
                    justifyContent: 'start',
                }}
            >
                {items.map((p) => (
                    <ProductCard key={p.id} product={p} mobile={isMobile} />
                ))}
            </div>
            </div>
        </div>
    );
}
