"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getCategories } from "../../services/categoryService";

// Initial static structure — matches the design
const initialCategories = [
    {
        id: 1,
        title: "Apple Products",
        defaultImage: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop",
        href: "/category/apple"
    },
    {
        id: 2,
        title: "IT Products",
        defaultImage: "/it-products-new.jpg",
        href: "/category/it-products"
    },
    {
        id: 3,
        title: "AV Products",
        defaultImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
        href: "/category/av-products"
    },
    {
        id: 4,
        title: "Office Equipment",
        defaultImage: "/office-equipment-new.jpg",
        href: "/category/office-equipment"
    },
    {
        id: 5,
        title: "DSLR Cameras",
        defaultImage: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769967871/indian-rentals/ea5ryxbvie8spmdb9slz.jpg",
        href: "/category/dslr"
    }
];

const CategoriesPage = () => {
    const [categories, setCategories] = useState(
        initialCategories.map(c => ({ ...c, image: c.defaultImage }))
    );

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const backendCategories = await getCategories();

                const merged = initialCategories.map(staticCat => {
                    const found = backendCategories.find(bc =>
                        bc.name.toLowerCase().includes(staticCat.title.toLowerCase().split(' ')[0]) ||
                        (staticCat.title.includes('Camera') && bc.name.includes('Camera'))
                    );
                    if (found && found.image) {
                        return { ...staticCat, image: found.image };
                    }
                    return { ...staticCat, image: staticCat.defaultImage };
                });

                setCategories(merged);
            } catch (error) {
                console.error("Failed to fetch categories", error);
                setCategories(initialCategories.map(c => ({ ...c, image: c.defaultImage })));
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 md:py-16">

                {/* Page Header */}
                <div className="mb-6 md:mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-6"
                    >
                        All Categories
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm md:text-lg text-gray-500 max-w-4xl leading-relaxed"
                    >
                        Browse our complete catalogue of premium rental categories — from Apple laptops and DSLR cameras
                        to IT workstations and AV equipment. Flexible plans from 1 to 24 months with free delivery across India.
                    </motion.p>
                </div>

                {/* Category Grid — 2 cols on mobile, 3 cols on desktop */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 + 0.1 }}
                        >
                            <Link href={category.href} className="group block">
                                {/* Card — image only, no label inside */}
                                <div className="bg-gray-50 rounded-2xl md:rounded-4xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 aspect-4/3 relative flex items-center justify-center">
                                    <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500 p-4 md:p-6">
                                        {category.image ? (
                                            <Image
                                                src={category.image}
                                                alt={category.title}
                                                fill
                                                className="object-contain p-3 md:p-6"
                                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <span className="text-xs">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Category name — below the card */}
                                <p className="mt-2 md:mt-3 text-sm md:text-base font-medium text-gray-800 text-center group-hover:text-gray-600 transition-colors">
                                    {category.title}
                                </p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default CategoriesPage;
