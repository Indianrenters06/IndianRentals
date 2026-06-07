'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function WishlistPage() {
    return (
        <div className="bg-white min-h-[500px] flex flex-col items-center justify-center text-center px-4 py-10">
            {/* Illustration */}
            <div className="relative w-[300px] max-w-full aspect-[350/328] mb-4">
                <Image
                    src="/empty-state-courier.png"
                    alt="Nothing here yet"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            <h2 className="text-[25px] font-semibold text-black tracking-tight mb-1">
                No active orders!
            </h2>

            <p className="text-[12px] font-semibold text-gray-500 max-w-[300px] mb-4">
                You don&apos;t have any active orders yet. Explore the products to get started!
            </p>

            <Link
                href="/"
                className="bg-[#FFCF46] hover:brightness-105 text-[#1f1f1f] font-medium text-[12px] py-1.5 px-5 rounded-full transition-all"
            >
                Explore Products
            </Link>
        </div>
    );
}
