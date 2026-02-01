"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getCategories } from '../../../services/categoryService';

// Data for Top Navigation Bar (Categories)
const topCategories = [
    { name: "Desktop", icon: "https://img.icons8.com/ios/100/imac.png" },
    { name: "MacBook", icon: "https://img.icons8.com/ios/100/macbook.png" },
    { name: "All In One", icon: "https://img.icons8.com/ios/100/monitor.png" },
    { name: "Tablet", icon: "https://img.icons8.com/ios/100/ipad.png" },
    { name: "Mac Studio", icon: "https://img.icons8.com/ios/100/mac-mini.png" },
    { name: "iPad", icon: "https://img.icons8.com/ios/100/ipad-pro.png" },
    { name: "Laptop", icon: "https://img.icons8.com/ios/100/laptop.png" },
    { name: "DSLR Camera", icon: "https://img.icons8.com/ios/100/camera.png" },
];

// Data for Apple Products Grid
const initialAppleProducts = [
    {
        name: "MacBook Pro",
        image: "/macbook-pro-new.jpg",
        href: "/category/apple/macbook-pro"
    },
    {
        name: "iPhone",
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop",
        href: "/category/apple/iphone"
    },
    {
        name: "Mac Mini",
        image: "/mac-mini-new.jpg",
        href: "/category/apple/mac-mini"
    },
    {
        name: "Mac Studio",
        image: "/mac-studio-new.jpg",
        href: "/category/apple/mac-studio"
    },
    {
        name: "MacBook Air",
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop",
        href: "/category/apple/macbook-air"
    },
    {
        name: "Apple Studio Display",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
        href: "/category/apple/studio-display"
    },
    {
        name: "Apple XDR Display",
        image: "/apple-xdr-display-new.jpg",
        href: "/category/apple/xdr-display"
    },
    {
        name: "Mac Pro",
        image: "/mac-pro-new.jpg",
        href: "/category/apple/mac-pro"
    },
    {
        name: "iMac",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop",
        href: "/category/apple/imac"
    },
    {
        name: "iPad",
        image: "/ipad-new.jpg",
        href: "/category/apple/ipad"
    },
];

const AppleCategoryPage = () => {
    const router = useRouter();
    const [products, setProducts] = useState(initialAppleProducts);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const categories = await getCategories();
                const merged = initialAppleProducts.map(p => {
                    const cat = categories.find(c => c.name === p.name);
                    if (cat && cat.image) {
                        return { ...p, image: cat.image };
                    }
                    return p;
                });
                setProducts(merged);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchImages();
    }, []);

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Top Navigation Scroll */}
            <div className="border-b border-gray-100 bg-white sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-8 overflow-x-auto py-6 no-scrollbar">
                        {topCategories.map((cat, index) => (
                            <Link key={index} href="/category/all" className="flex flex-col items-center min-w-[80px] group cursor-pointer">
                                <div className="w-16 h-12 mb-3 relative flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                                    <img src={cat.icon} alt={cat.name} className="h-full object-contain" />
                                </div>
                                <span className="text-xs font-medium text-gray-600 group-hover:text-black whitespace-nowrap">
                                    {cat.name}
                                </span>
                            </Link>
                        ))}
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-400">
                            <FaChevronRight size={12} />
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Link & Title */}
                <div className="flex items-center gap-4 mb-10">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-800 hover:text-gray-600 transition-colors"
                    >
                        <FaArrowLeft size={28} />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Apple Products</h1>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="group"
                        >
                            <Link href={product.href} className="block">
                                <div className="bg-[#F5F5F7] rounded-2xl aspect-square mb-3 transition-transform duration-300 group-hover:scale-[1.02] overflow-hidden relative">
                                    <div className="relative w-full h-full">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                <span>No Image</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <h3 className="text-center text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {product.name}
                                </h3>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AppleCategoryPage;
