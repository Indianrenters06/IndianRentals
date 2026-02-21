"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaChevronRight } from 'react-icons/fa';
import {
    TbDeviceDesktop, TbDeviceLaptop, TbDeviceImac,
    TbDeviceIpad, TbCamera, TbDeviceMobile
} from 'react-icons/tb';
import { BiServer } from 'react-icons/bi';

// Subcategories inside Apple Products — product cards
const subcategories = [
    {
        name: "MacBook Pro",
        image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961205/indian-rentals/gfjrzgp5llzcjap30wkt.png",
        href: "/category/apple/macbook-pro"
    },
    {
        name: "iPhone",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484bce71?w=400&auto=format&fit=crop",
        href: "/category/apple/iphone"
    },
    {
        name: "MacBook Air",
        image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769961205/indian-rentals/gfjrzgp5llzcjap30wkt.png",
        href: "/category/apple/macbook-air"
    },
    {
        name: "iPad",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&auto=format&fit=crop",
        href: "/category/apple/ipad"
    },
    {
        name: "Apple Studio Display",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop",
        href: "/category/apple/studio-display"
    },
    {
        name: "Apple XDR Display",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop",
        href: "/category/apple/xdr-display"
    },
    {
        name: "Mac Pro",
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&auto=format&fit=crop",
        href: "/category/apple/mac-pro"
    },
    {
        name: "iMac",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop",
        href: "/category/apple/imac"
    },
    {
        name: "Mac Studio",
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&auto=format&fit=crop",
        href: "/category/apple/mac-studio"
    },
    {
        name: "Mac Mini",
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&auto=format&fit=crop",
        href: "/category/apple/mac-mini"
    },
];

// Filter grid — 4 columns × 2 rows with line-art device icons
const filterChips = [
    { label: "Desktop", Icon: TbDeviceDesktop, href: "#desktop" },
    { label: "MacBook", Icon: TbDeviceLaptop, href: "#macbook" },
    { label: "All In One", Icon: TbDeviceImac, href: "#all-in-one" },
    { label: "Tablet", Icon: TbDeviceIpad, href: "#tablet" },
    { label: "Mac Studio", Icon: BiServer, href: "#mac-studio" },
    { label: "iPad", Icon: TbDeviceIpad, href: "#ipad" },
    { label: "Laptop", Icon: TbDeviceLaptop, href: "#laptop" },
    { label: "DSLR Camera", Icon: TbCamera, href: "#dslr" },
];

export default function ApplePage() {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState(null);

    return (
        <div className="min-h-screen bg-white">
            <main className="px-4 pt-5 pb-10 max-w-7xl mx-auto sm:px-6 lg:px-8">

                {/* Filter Grid — 4 columns × 2 rows with outlined device icons */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                    {filterChips.map((chip) => {
                        const isActive = activeFilter === chip.label;
                        return (
                            <button
                                key={chip.label}
                                onClick={() => setActiveFilter(isActive ? null : chip.label)}
                                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all duration-200 ${isActive
                                        ? 'border-gray-700 bg-gray-50 shadow-sm'
                                        : 'border-gray-200 bg-white hover:border-gray-400'
                                    }`}
                            >
                                {/* Line-art device icon */}
                                <chip.Icon
                                    size={38}
                                    strokeWidth={1.2}
                                    className="text-gray-900"
                                />
                                <span className="text-[10px] font-medium text-gray-700 text-center leading-tight">
                                    {chip.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Back + Title */}
                <div className="flex items-center gap-3 mb-5">
                    <button
                        onClick={() => router.back()}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FaArrowLeft size={18} className="text-gray-800" />
                    </button>
                    <h1 className="text-xl md:text-3xl font-bold text-gray-900">Apple Products</h1>
                </div>

                {/* 2-column subcategory grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {subcategories.map((sub) => (
                        <Link key={sub.name} href={sub.href} className="group block">
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden aspect-[4/3] relative group-hover:shadow-md transition-shadow duration-200">
                                <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-300">
                                    <Image
                                        src={sub.image}
                                        alt={sub.name}
                                        fill
                                        className="object-contain p-3"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    />
                                </div>
                            </div>
                            <p className="mt-2 text-xs md:text-sm font-medium text-gray-800 text-center leading-snug">
                                {sub.name}
                            </p>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}