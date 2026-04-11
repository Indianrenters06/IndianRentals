"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { getCategories } from "../../services/categoryService";

// Initial static structure — matches the design
const initialCategories = [
    {
        id: 1,
        title: "Apple Products",
        defaultImage: "/macbook-pro-new.jpg",
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
        defaultImage: "/it-products-new.jpg",
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
            <main className="max-w-[1200px] w-full mx-auto px-4 md:px-8 pt-[40px] pb-[40px] flex flex-col gap-[30px]">

                {/* Header Section */}
                <div className="flex flex-col gap-[12px] w-full max-w-[1200px]">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-[8px] w-full max-w-[1200px] h-[16px] text-[12px] font-medium text-[#64748B]">
                        <span style={{
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 400,
                            fontSize: "12px",
                            lineHeight: "16px",
                            textAlign: "center",
                            color: "hsla(0, 0%, 33%, 1)",
                            width: "61px",
                            height: "16px",
                            display: "inline-block"
                        }}>Homepage</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-[#1E293B] font-bold">All Categories</span>
                    </div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: "44px",
                            lineHeight: "58px",
                            letterSpacing: "-0.01em",
                            color: "hsla(0, 0%, 12%, 1)",
                            width: "100%",
                            maxWidth: "1200px"
                        }}
                    >
                        All Categories
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 400,
                            fontSize: "14px",
                            lineHeight: "1.5",
                            color: "hsla(0, 0%, 46%, 1)",
                            width: "100%",
                            maxWidth: "1200px"
                        }}
                    >
                        Lorem ipsum dolor sit amet consectetur. Vel libero cras laoreet ut dignissim eget. Scelerisque mauris pharetra tristique cras sit malesuada. Egestas pulvinar interdum sapien et. Consequat neque at donec turpis leo. Quis at.
                    </motion.p>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-[24px] w-full max-w-[1200px]">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 + 0.1 }}
                        >
                            <Link href={category.href} className="group block h-full">
                                {/* Card Wrapper */}
                                <div
                                    className="flex flex-col group overflow-hidden transition-all duration-300"
                                    style={{
                                        width: "100%",
                                        height: "276px",
                                        borderRadius: "12px",
                                        border: "1px solid hsla(0, 0%, 89%, 1)",
                                        backgroundColor: "hsla(0, 0%, 100%, 1)",
                                        boxShadow: "0px 1px 3px 0px hsla(0, 0%, 87%, 0.08), 0px 6px 6px 0px hsla(0, 0%, 87%, 0.07), 0px 13px 8px 0px hsla(0, 0%, 87%, 0.04), 0px 23px 9px 0px hsla(0, 0%, 87%, 0.01), 0px 36px 10px 0px hsla(0, 0%, 87%, 0)"
                                    }}
                                >
                                    {/* Image Container */}
                                    <div className="relative w-full flex-1 flex items-center justify-center p-6">
                                        <div className="relative w-full h-[180px] transform group-hover:scale-105 transition-transform duration-500">
                                            {category.image ? (
                                                <Image
                                                    src={category.image}
                                                    alt={category.title}
                                                    fill
                                                    unoptimized
                                                    className="object-contain"
                                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <span className="text-xs">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer Label */}
                                    <div
                                        className="flex items-center shrink-0 w-full group-hover:bg-gray-50 transition-colors"
                                        style={{
                                            width: "100%",
                                            maxWidth: "384px",
                                            height: "52px",
                                            justifyContent: "space-between",
                                            padding: "12px 18px"
                                        }}
                                    >
                                        <h3 className="font-semibold text-[17px] tracking-tight text-[#1E293B] group-hover:text-black transition-colors">
                                            {category.title}
                                        </h3>
                                        <ArrowRight
                                            weight="regular"
                                            className="text-[#000000] flex-shrink-0"
                                            style={{
                                                width: "24px",
                                                height: "24px",
                                                opacity: 1,
                                            }}
                                        />
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
