"use client";
import React from "react";
import Link from "next/link";
import { FaHeart, FaStar, FaBolt } from "react-icons/fa";
import { motion } from "framer-motion";

const products = [
    {
        id: 1,
        name: "MacBook Pro 16\" (M3 Max)",
        category: "Laptops",
        image: "/images/macbook.png", // Placeholder path
        rating: 4.9,
        reviews: 128,
        originalPrice: 8999,
        rentPrice: 4499,
        discount: "20% OFF",
        isNew: true,
    },
    {
        id: 2,
        name: "Sony Alpha 7 IV",
        category: "Cameras",
        image: "/images/camera.png", // Placeholder path
        rating: 4.8,
        reviews: 85,
        originalPrice: 5999,
        rentPrice: 2999,
        discount: "15% OFF",
        isNew: false,
    },
    {
        id: 3,
        name: "PlayStation 5 Pro",
        category: "Gaming",
        image: "/images/ps5.png", // Placeholder path
        rating: 5.0,
        reviews: 210,
        originalPrice: 2999,
        rentPrice: 1499,
        discount: "Popular",
        isNew: false,
    },
    {
        id: 4,
        name: "iPhone 15 Pro Max",
        category: "Mobiles",
        image: "/images/iphone.png", // Placeholder path
        rating: 4.9,
        reviews: 156,
        originalPrice: 6999,
        rentPrice: 3499,
        discount: "Hot",
        isNew: true,
    },
];

const BestRentedProducts = () => {
    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
                            Best Rented <span className="text-[#0A99FF]">Products</span>
                        </h2>
                        <p className="text-lg text-gray-500">
                            Explore our most popular gear, trusted by thousands of creators and professionals.
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="hidden md:inline-flex items-center justify-center px-8 py-3 bg-white border-2 border-gray-200 text-gray-900 font-bold rounded-full hover:border-[#0A99FF] hover:text-[#0A99FF] transition-all duration-300"
                    >
                        View All Products
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-square rounded-2xl bg-gray-100 overflow-hidden mb-4 group-hover:bg-gray-50 transition-colors">

                                {/* Badges */}
                                <div className="absolute top-3 left-3 z-10 flex gap-2">
                                    {product.discount && (
                                        <span className="bg-[#FF4757] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                            {product.discount}
                                        </span>
                                    )}
                                    {product.isNew && (
                                        <span className="bg-[#2ED573] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                            NEW
                                        </span>
                                    )}
                                </div>

                                {/* Favorite Button */}
                                <button className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-400 hover:text-red-500 rounded-full shadow-sm transition-all transform hover:scale-110">
                                    <FaHeart size={16} />
                                </button>

                                {/* Image Placeholder (Replace with actual Image component) */}
                                <div className="w-full h-full flex items-center justify-center text-gray-300 group-hover:scale-105 transition-transform duration-500">
                                    {/* Assuming we might not have images yet, using a styled placeholder */}
                                    <div className="text-center p-6">
                                        <FaBolt className="mx-auto mb-2 text-4xl opacity-20" />
                                        <span className="text-sm font-medium opacity-50">{product.category}</span>
                                    </div>
                                </div>

                                {/* Overlay Button */}
                                <div className="absolute inset-x-4 bottom-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <button className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-colors">
                                        Quick Rent
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-grow">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{product.category}</span>
                                    <div className="flex items-center gap-1 text-[#FFC107] text-xs font-bold">
                                        <FaStar />
                                        <span>{product.rating}</span>
                                        <span className="text-gray-300 font-normal">({product.reviews})</span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-1 leading-snug group-hover:text-[#0A99FF] transition-colors line-clamp-2">
                                    {product.name}
                                </h3>

                                <div className="mt-auto pt-4 flex items-end justify-between border-t border-gray-50">
                                    <div>
                                        <p className="text-xs text-gray-400 line-through font-medium">₹{product.originalPrice}/mo</p>
                                        <p className="text-xl font-black text-gray-900">
                                            ₹{product.rentPrice}
                                            <span className="text-xs text-gray-500 font-medium ml-1">/mo</span>
                                        </p>
                                    </div>
                                    <button className="p-2 rounded-full border border-gray-100 text-gray-400 group-hover:border-[#0A99FF] group-hover:text-[#0A99FF] transition-all">
                                        <FaBolt />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center px-8 py-3 bg-white border border-gray-200 text-gray-900 font-bold rounded-full shadow-sm"
                    >
                        View All Products
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BestRentedProducts;
