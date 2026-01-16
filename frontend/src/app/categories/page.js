"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
    {
        id: 1,
        title: "Apple Products",
        // iMac, MacBook, iPad cluster
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop",
        href: "/category/apple"
    },
    {
        id: 2,
        title: "IT Products",
        // Desktop/Laptop setup
        image: "/it-products-new.jpg",
        href: "/category/it-products",
        objectFit: "cover"
    },
    {
        id: 3,
        title: "AV Products",
        // Projector/Audio
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
        href: "/category/av-products"
    },
    {
        id: 4,
        title: "Office Equipment",
        // Printer
        image: "/office-equipment-new.jpg",
        href: "/category/office-equipment"
    },
    {
        id: 5,
        title: "DSLR Cameras",
        // Camera kit
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
        href: "/category/dslr"
    }
];

const CategoriesPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold text-gray-900 mb-6"
                    >
                        All Categories
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600 max-w-4xl leading-relaxed"
                    >
                        Lorem ipsum dolor sit amet consectetur. Vel libero cras laoreet ut dignissim eget.
                        Scelerisque mauris pharetra tristique cras sit malesuada. Egestas pulvinar interdum sapien et.
                        Consequat neque at donec turpis leo. Quis at.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                        >
                            <Link href={category.href} className="group block h-full">
                                <div className="bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col p-6">
                                    <div className="relative h-56 w-full flex items-center justify-center mb-4 overflow-hidden rounded-2xl bg-white">
                                        {/* Image Container with hover effect */}
                                        <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500">
                                            <Image
                                                src={category.image}
                                                alt={category.title}
                                                fill
                                                className={`object-${category.objectFit || "contain"}`}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-4 text-center">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#00A8FF] transition-colors">
                                            {category.title}
                                        </h3>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default CategoriesPage;
