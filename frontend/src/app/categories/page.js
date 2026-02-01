"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getCategories } from "../../services/categoryService";

// Initial static structure to MATCH THE DESIGN EXACTLY
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
    // We will merge backend data into this structure
    const [categories, setCategories] = useState(initialCategories.map(c => ({ ...c, image: c.defaultImage })));

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const backendCategories = await getCategories();

                // Merge logic: If backend has a category with a matching name (approx), use its image
                const merged = initialCategories.map(staticCat => {
                    const found = backendCategories.find(bc =>
                        bc.name.toLowerCase().includes(staticCat.title.toLowerCase().split(' ')[0]) || // Match 'Apple' in 'Apple Products'
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
                // Fallback to static images if fetch fails
                setCategories(initialCategories.map(c => ({ ...c, image: c.defaultImage })));
            }
        };

        fetchCategories();
    }, []);

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
                                            {category.image ? (
                                                <Image
                                                    src={category.image}
                                                    alt={category.title}
                                                    fill
                                                    className="object-contain"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                    <span className="text-sm">No Image</span>
                                                </div>
                                            )}
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
