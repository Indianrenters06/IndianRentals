'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { selectWishlistItems } from '@/redux/features/wishlistSlice';
import ProductCard from '@/components/ProductCard';
import { profileTitleClassName } from '../profileTitle';

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
            <div className="flex min-h-[540px] flex-col items-center bg-white pb-16 text-center sm:min-h-[560px]">
                <h1 className={`w-full text-left ${profileTitleClassName}`}>My Wishlist</h1>
                <div className="relative mb-4 aspect-square w-[min(100%,350px)]">
                    <Image
                        src="/empty-wishlist-line-art.png"
                        alt="A hand tapping the heart on a laptop to save it to an empty wishlist"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                <h2 className="mb-1 text-[25px] font-semibold leading-tight tracking-tight text-[#141414] md:text-[36px]">No saved products yet</h2>

                <p className="mb-4 max-w-[330px] text-[14px] leading-5 text-[#545454] md:max-w-[540px] md:text-[16px] md:leading-6">
                    Select the heart on a product to keep it here for later.
                </p>

                <Link
                    href="/"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#ffcf46] px-6 text-[14px] font-semibold text-[#141414] transition-colors hover:bg-[#f3bf35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] md:text-[16px]"
                >
                    Explore Products
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white w-full">
            <div>
            <h1 className={`${profileTitleClassName} mb-5 md:mb-6`}>
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
