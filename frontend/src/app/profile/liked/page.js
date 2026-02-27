'use client';

import React from 'react';
import Link from 'next/link';
import { PiHeart, PiHeartStraight } from 'react-icons/pi';

export default function WishlistPage() {
    return (
        <div className="bg-white min-h-[600px] rounded-2xl p-8 flex flex-col items-center justify-center text-center relative border border-dashed border-gray-200">
            {/* Illustration */}
            <div className="mb-6 relative w-48 h-48 bg-rose-50 rounded-full flex items-center justify-center">
                <PiHeartStraight size={80} className="text-rose-300" />
            </div>

            <h2 className="text-3xl font-medium text-gray-900 mb-3">Your Wishlist is Empty</h2>

            <p className="text-gray-500 mb-8 max-w-md">
                You haven't saved any products yet. Browse our catalogue and tap the heart icon to save items you love!
            </p>

            <Link
                href="/"
                className="bg-[#facc15] hover:bg-[#fde047] text-gray-900 font-bold py-3 px-8 rounded-full transition-colors inline-flex items-center gap-2"
            >
                <PiHeart size={18} />
                Explore Products
            </Link>
        </div>
    );
}
