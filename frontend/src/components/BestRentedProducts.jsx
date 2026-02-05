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
                const mappedProducts = (apiProducts || []).slice(0, 3).map(p => ({
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

                // Insert Promo Card at index 1
                const productsWithPromo = [
                    mappedProducts[0],
                    { isPromo: true, id: 'promo-apple' },
                    ...mappedProducts.slice(1)
                ].filter(Boolean);

                setProducts(productsWithPromo);
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <section className="py-8 md:py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        Best Rented Products
                    </h2>
                    <Link
                        href="/products"
                        className="hidden md:inline-flex items-center justify-center px-6 py-2 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-full transition-all duration-300 shadow-sm"
                    >
                        View All
                    </Link>
                    <Link
                        href="/products"
                        className="md:hidden text-sm font-bold text-blue-600"
                    >
                        View All
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {products.map((product, index) => {
                        if (product.isPromo) {
                            return (
                                <div key={product.id} className="block h-full relative group cursor-pointer">
                                    <div className="h-full w-full rounded-2xl md:rounded-3xl overflow-hidden relative shadow-sm hover:shadow-xl transition-all duration-300">
                                        {/* Background Gradient */}
                                        <div className="absolute inset-0 bg-linear-to-br from-[#4facfe] to-[#00f2fe] opacity-90"></div>
                                        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60"></div>

                                        {/* Image */}
                                        <img
                                            src="https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png"
                                            alt="Apple Products"
                                            className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                                        />

                                        {/* Content Overlay */}
                                        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end text-center">
                                            <div className="mb-2">
                                                <div className="flex justify-center items-center gap-4 text-white mb-1">
                                                    <span>&lt;</span>
                                                    <h3 className="text-lg md:text-2xl font-bold">Apple Products</h3>
                                                    <span>&gt;</span>
                                                </div>
                                                <p className="text-white/90 text-xs md:text-sm font-medium">
                                                    MacBooks | iPads | iPhones | Mac Studio | Mac Mini
                                                </p>
                                            </div>

                                            {/* Dots */}
                                            <div className="flex justify-center gap-1.5 mt-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

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
                                                -20%
                                            </span>
                                        </div>

                                        {/* Favorite Button */}
                                        <button className="absolute top-2 right-2 z-10 p-1.5 md:p-2 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900 rounded-full shadow-sm transition-all">
                                            <FaHeart size={12} className="text-gray-900 md:text-base" />
                                        </button>

                                        {/* Image */}
                                        <Link href={product.name.includes("MacBook") || product.name.includes("iPhone") ? "/products/macbook-pro-14-m4" : "/products"} className="w-full h-full flex items-center justify-center relative p-4 md:p-6">
                                            {product.image && product.image !== "/images/placeholder.png" ? (
                                                <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="text-center text-gray-300">
                                                    <FaBolt className="mx-auto mb-2 text-2xl md:text-4xl opacity-20" />
                                                    <span className="text-[10px] md:text-sm font-medium opacity-50">{product.category}</span>
                                                </div>
                                            )}
                                        </Link>

                                        {/* Overlay Button - Desktop Only or simplified on mobile */}
                                        {/* <div className="hidden md:block absolute inset-x-4 bottom-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <Link
                                            href="/categories"
                                            className="block w-full py-2 bg-gray-900 text-white font-bold rounded-lg lg:rounded-xl shadow-lg hover:bg-black transition-colors text-center text-sm"
                                        >
                                            Rent Now
                                        </Link>
                                    </div> */}
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col flex-grow space-y-1 md:space-y-2">
                                        <h3 className="text-sm md:text-lg font-bold text-gray-900 leading-snug line-clamp-2 min-h-[2.5rem] md:min-h-0">
                                            {product.name}
                                        </h3>

                                        <p className="hidden md:block text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                            {product.category} - High performance gear.
                                        </p>

                                        <div className="pt-1 mt-auto">
                                            <p className="text-xs md:text-sm text-gray-900 font-medium flex flex-wrap items-baseline gap-1.5 md:gap-2">
                                                <span className="text-xs text-[#FF4757] font-bold text-sm md:text-base">₹{product.rentPrice}</span>
                                                <span className="text-[10px] md:text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                                                <span className="text-[10px] md:text-xs text-gray-500 font-normal">/mo</span>
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default BestRentedProducts;
