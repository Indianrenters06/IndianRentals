'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { House, MagnifyingGlass, ArrowRight, Phone, Laptop, Camera, Desktop, FilmStrip } from '@phosphor-icons/react';

export default function NotFound() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (q) {
            router.push(`/products?keyword=${encodeURIComponent(q)}`);
        }
    };

    const popularCategories = [
        { name: 'Apple Products', href: '/category/apple', icon: <Laptop size={16} /> },
        { name: 'Laptops & IT', href: '/category/it-products', icon: <Desktop size={16} /> },
        { name: 'DSLR & Cameras', href: '/category/dslr', icon: <Camera size={16} /> },
        { name: 'AV Equipment', href: '/category/av-products', icon: <FilmStrip size={16} /> },
    ];

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 font-sans bg-[#FBFBFB]">
            <div className="max-w-2xl w-full text-center space-y-8">
                
                {/* 404 Badge & Graphic */}
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        404 • Page Not Found
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-[-1.5px] text-[#1f1f1f] leading-tight">
                        Lost in the Inventory?
                    </h1>
                    <p className="text-base sm:text-lg text-[#545454] max-w-md mx-auto font-normal">
                        The page you are looking for might have been removed, renamed, or is temporarily unavailable.
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="max-w-md mx-auto relative flex items-center">
                    <input
                        type="text"
                        placeholder="Search for MacBook, Cameras, Laptops..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 pl-11 pr-24 rounded-full bg-white border border-[#E2E2E2] shadow-sm text-sm text-[#1F1F1F] placeholder-[#9A9A9A] focus:outline-none focus:border-[#0859C5] focus:ring-2 focus:ring-[#0859C5]/15 transition-all"
                    />
                    <MagnifyingGlass size={18} className="absolute left-4 text-[#757575] pointer-events-none" />
                    <button
                        type="submit"
                        className="absolute right-1.5 px-4 h-9 rounded-full bg-[#1F1F1F] text-white text-xs font-semibold hover:bg-black transition-colors"
                    >
                        Search
                    </button>
                </form>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-[#FFCF46] text-[#1F1F1F] font-semibold text-sm hover:bg-[#ffc629] active:scale-[0.98] transition-all shadow-sm"
                    >
                        <House size={16} weight="bold" />
                        Back to Home
                    </Link>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-white border border-[#E2E2E2] text-[#333333] font-semibold text-sm hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm"
                    >
                        Browse All Products
                        <ArrowRight size={14} weight="bold" />
                    </Link>
                </div>

                {/* Popular Categories */}
                <div className="pt-6 border-t border-[#EAEAEA]">
                    <p className="text-xs uppercase tracking-wider text-[#757575] font-semibold mb-3">
                        Or explore top rental categories
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {popularCategories.map((cat) => (
                            <Link
                                key={cat.name}
                                href={cat.href}
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E2E2E2] text-xs font-medium text-[#333333] hover:border-[#0859C5] hover:text-[#0859C5] transition-all shadow-xs"
                            >
                                {cat.icon}
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Direct Support */}
                <p className="text-xs text-[#757575]">
                    Need immediate assistance with a rental?{' '}
                    <Link href="/contact" className="text-[#0859C5] font-semibold underline hover:text-[#06408f]">
                        Contact our support team
                    </Link>
                </p>

            </div>
        </div>
    );
}
