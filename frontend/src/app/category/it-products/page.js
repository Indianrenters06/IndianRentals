"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { TbDeviceLaptop, TbDeviceDesktop, TbServer, TbPrinter, TbDeviceImac } from 'react-icons/tb';
import { MdOutlineStoreMallDirectory } from 'react-icons/md';
import { BiServer } from 'react-icons/bi';
import { getCategories } from '../../../services/categoryService';

const initialItProducts = [
    { name: "Laptop", image: "/placeholder.jpg", href: "/category/it-products/laptop" },
    { name: "Computer", image: "/placeholder.jpg", href: "/category/it-products/computer" },
    { name: "Server", image: "/placeholder.jpg", href: "/category/it-products/server" },
    { name: "Workstation", image: "/placeholder.jpg", href: "/category/it-products/workstation" },
    { name: "Storage", image: "/placeholder.jpg", href: "/category/it-products/storage" },
    { name: "Monitor / TFT", image: "/placeholder.jpg", href: "/category/it-products/monitor" },
    { name: "UPS", image: "/placeholder.jpg", href: "/category/it-products/ups" },
    { name: "Printer & Scanner", image: "/placeholder.jpg", href: "/category/it-products/printer" },
    { name: "All In One", image: "/placeholder.jpg", href: "/category/it-products/all-in-one" },
    { name: "Computer Accessories", image: "/placeholder.jpg", href: "/category/it-products/accessories" },
];

const filterChips = [
    { label: "Laptop", Icon: TbDeviceLaptop },
    { label: "Computer", Icon: TbDeviceDesktop },
    { label: "Server", Icon: BiServer },
    { label: "Monitor", Icon: TbDeviceImac },
    { label: "Printer", Icon: TbPrinter },
    { label: "All In One", Icon: TbDeviceImac },
    { label: "Storage", Icon: TbServer },
    { label: "Accessories", Icon: MdOutlineStoreMallDirectory },
];

const ITProductsPage = () => {
    const router = useRouter();
    const [products, setProducts] = useState(initialItProducts);
    const [activeFilter, setActiveFilter] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const categories = await getCategories();
                const merged = initialItProducts.map(p => {
                    const cat = categories.find(c => c.name === p.name);
                    if (cat && cat.image) return { ...p, image: cat.image };
                    return p;
                });
                setProducts(merged);
            } catch (err) { console.error("Error fetching categories:", err); }
        };
        fetchImages();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <main className="px-4 pt-5 pb-10 max-w-7xl mx-auto sm:px-6 lg:px-8">

                {/* Filter Grid — 4 columns with outlined device icons */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                    {filterChips.map((chip) => (
                        <button
                            key={chip.label}
                            onClick={() => setActiveFilter(activeFilter === chip.label ? null : chip.label)}
                            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all duration-200 ${activeFilter === chip.label
                                    ? 'border-gray-700 bg-gray-50 shadow-sm'
                                    : 'border-gray-200 bg-white hover:border-gray-400'
                                }`}
                        >
                            <chip.Icon size={38} strokeWidth={1.2} className="text-gray-900" />
                            <span className="text-[10px] font-medium text-gray-700 text-center leading-tight">{chip.label}</span>
                        </button>
                    ))}
                </div>

                {/* Back + Title */}
                <div className="flex items-center gap-3 mb-5">
                    <button onClick={() => router.back()} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <FaArrowLeft size={18} className="text-gray-800" />
                    </button>
                    <h1 className="text-xl md:text-3xl font-bold text-gray-900">IT Products</h1>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {products.map((product) => (
                        <Link key={product.name} href={product.href} className="group block">
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden aspect-4/3 relative group-hover:shadow-md transition-shadow duration-200">
                                <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-300">
                                    {product.image && product.image !== "/placeholder.jpg" ? (
                                        <Image src={product.image} alt={product.name} fill className="object-contain p-3" sizes="(max-width: 640px) 50vw, 33vw" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-xs text-gray-400 text-center px-2">{product.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="mt-2 text-xs md:text-sm font-medium text-gray-800 text-center leading-snug">{product.name}</p>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ITProductsPage;
