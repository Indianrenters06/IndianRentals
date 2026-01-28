'use client';

import React from 'react';
import Link from 'next/link';
import { PiPackage } from 'react-icons/pi'; // Using an icon as fallback

export default function MostLikedPage() {
    return (
        <div className="bg-white min-h-[600px] rounded-2xl p-8 flex flex-col items-center justify-center text-center relative border border-dashed border-gray-200">
            {/* Illustration Placeholder */}
            <div className="mb-6 relative w-48 h-48 bg-orange-50 rounded-full flex items-center justify-center">
                <PiPackage size={80} className="text-orange-400" />
            </div>

            <h2 className="text-3xl font-medium text-gray-900 mb-3">No active orders!</h2>

            <p className="text-gray-500 mb-8 max-w-md">
                You don't have any active orders yet. Explore the products to get started!
            </p>

            <Link href="/" className="bg-[#facc15] hover:bg-[#fde047] text-gray-900 font-bold py-3 px-8 rounded-full transition-colors inline-flex items-center gap-2">
                Explore Products
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
        </div>
    );
}
