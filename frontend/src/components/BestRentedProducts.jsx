"use client";
import React from "react";
import Link from "next/link";
import { FaHeart, FaStar, FaBolt } from "react-icons/fa";
import { motion } from "framer-motion";

import { getProducts } from "../services/productService";
import { useState, useEffect } from "react";

const BestRentedProducts = ({ title = "Best Rented Products" }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { products: apiProducts } = await getProducts();
                // Map API data to component structure
                const mappedProducts = (apiProducts || []).slice(0, 4).map(p => ({
                    id: p._id,
                    name: p.name,
                    category: p.category,
                    image: (p.images && p.images.length > 0) ? p.images[0] : "/images/placeholder.png",
                    rating: p.rating || 4.5,
                    reviews: p.numReviews || 12,
                    originalPrice: Math.round((p.rentalPrice || 0) * 1.5),
                    rentPrice: p.rentalPrice,
                    discount: p.condition === 'New' ? "NEW" : "HOT",
                    isNew: p.condition === 'New',
                    tags: ["Quality tested", "Deep Cleaned"],
                    statusTags: ["Like New", "In Stock"],
                }));

                setProducts(mappedProducts);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <section className="py-8 md:py-12 bg-white">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6 md:mb-12">
                    <h2 className="text-4xl font-semibold font-manrope text-gray-900 tracking-tight">
                        {title}
                    </h2>
                    <Link
                        href="/products"
                        className="hidden md:inline-flex items-center justify-center px-6 py-2 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-full transition-all duration-300 shadow-sm"
                    >
                        View All
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                    {products.map((product, index) => {
                        return (
                            <div
                                key={product.id}
                                className="block h-full relative"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group bg-white rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col hover:-translate-y-1"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-square rounded-xl md:rounded-2xl bg-gray-50 overflow-hidden mb-3 md:mb-4 group-hover:bg-gray-100 transition-colors">

                                        {/* Badges */}
                                        <div className="absolute top-2 left-2 z-10">
                                            <span className="bg-[#FF4757] text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                                                -20% off
                                            </span>
                                        </div>

                                        {/* Favorite Button */}
                                        <button className="absolute top-2 right-2 z-10 p-1.5 md:p-2 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900 rounded-full shadow-sm transition-all">
                                            <FaHeart size={12} className="text-gray-900 md:text-base" />
                                        </button>

                                        {/* Image */}
                                        <Link href={`/products/${product.id}`} className="w-full h-full flex items-center justify-center relative p-4 md:p-6">
                                            {product.image && product.image !== "/images/placeholder.png" ? (
                                                <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="text-center text-gray-300">
                                                    <FaBolt className="mx-auto mb-2 text-2xl md:text-4xl opacity-20" />
                                                    <span className="text-[10px] md:text-sm font-medium opacity-50">{product.category}</span>
                                                </div>
                                            )}
                                        </Link>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col flex-grow space-y-1.5 md:space-y-2">
                                        <h3 className="text-xs md:text-lg font-bold text-gray-900 leading-snug line-clamp-2">
                                            {product.name}
                                        </h3>

                                        {/* Star Rating */}
                                        <div className="flex items-center gap-1">
                                            <FaStar size={12} className="text-[#FFC107]" />
                                            <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
                                            <span className="text-[10px] text-gray-400">({product.reviews})</span>
                                        </div>

                                        {/* Price */}
                                        <div className="flex flex-wrap items-baseline gap-1">
                                            <span className="text-[10px] text-gray-500">from</span>
                                            <span className="text-[10px] text-gray-400 line-through">₹{product.originalPrice}</span>
                                            <span className="text-xs md:text-sm font-bold text-[#FF4757]">₹{product.rentPrice}</span>
                                            <span className="text-[10px] text-gray-500">/month</span>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {product.tags && product.tags.map(tag => (
                                                <span key={tag} className="text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full border border-gray-200 text-gray-500 font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                            {product.statusTags && product.statusTags.map(tag => (
                                                <span key={tag} className="text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full border border-gray-200 text-gray-500 font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )
                    })}
                </div>

                {/* Mobile View All Button */}
                <div className="mt-6 flex justify-center md:hidden">
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center px-8 py-2.5 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-full transition-all duration-300 shadow-sm"
                    >
                        View All
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BestRentedProducts;
