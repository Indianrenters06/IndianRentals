"use client";
import React from "react";
import Link from "next/link";
import { FaHeart, FaStar, FaBolt } from "react-icons/fa";
import { motion } from "framer-motion";

import { getProducts } from "../services/productService";
import { useState, useEffect } from "react";

const BestRentedProducts = () => {
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
                    reviews: p.numReviews || 0,
                    originalPrice: Math.round((p.rentalPrice || 0) * 1.5), // Mock original price
                    rentPrice: p.rentalPrice,
                    discount: p.condition === 'New' ? "NEW" : "HOT",
                    isNew: p.condition === 'New',
                }));
                setProducts(mappedProducts);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <section className="">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex items-center justify-between  sm:mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        Best Rented Products
                    </h2>
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center px-6 py-2 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-full transition-all duration-300 shadow-sm"
                    >
                        View All
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {products.slice(0, 4).map((product, index) => (
                        <div
                            key={product.id}
                            className="block h-full relative"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 flex flex-col h-full"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-square rounded-2xl bg-gray-100 overflow-hidden mb-4 group-hover:bg-gray-50 transition-colors">

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className="bg-[#FF4757] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                            -20% off
                                        </span>
                                    </div>

                                    {/* Favorite Button */}
                                    <button className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900 rounded-full shadow-sm transition-all">
                                        <FaHeart size={16} className="text-gray-900" />
                                    </button>

                                    {/* Image */}
                                    <Link href={product.name.includes("MacBook") || product.name.includes("iPhone") ? "/products/macbook-pro-14-m4" : "/products"} className="w-full h-full flex items-center justify-center relative p-6">
                                        {product.image && product.image !== "/images/placeholder.png" ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="text-center text-gray-300">
                                                <FaBolt className="mx-auto mb-2 text-4xl opacity-20" />
                                                <span className="text-sm font-medium opacity-50">{product.category}</span>
                                            </div>
                                        )}
                                    </Link>

                                    {/* Overlay Button */}
                                    <div className="absolute inset-x-4 bottom-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <Link
                                            href="/categories"
                                            className="block w-full py-3 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-colors text-center"
                                        >
                                            Rent Now
                                        </Link>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-col flex-grow space-y-2">
                                    <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2">
                                        {product.name}
                                    </h3>

                                    <p className="text-xs text-gray-900 line-clamp-2 leading-relaxed">
                                        {product.category} - High performance gear for professionals.
                                    </p>

                                    <div className=" pt-1">
                                        <p className="text-sm text-gray-900 font-medium flex items-center gap-2">
                                            <span className="text-gray-500 font-normal">from</span>
                                            <span className="line-through text-gray-400">₹{product.originalPrice}</span>
                                            <span className="text-[#FF4757] font-bold">₹{product.rentPrice}</span>
                                            <span className="text-gray-500 font-normal">/month</span>
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BestRentedProducts;
