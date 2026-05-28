"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { getCategories } from "../../services/categoryService";

const defaultCMS = {
    categoriesPageTitle: "All Categories",
    categoriesPageSubtitle: "Lorem ipsum dolor sit amet consectetur. Vel libero cras laoreet ut dignissim eget. Scelerisque mauris pharetra tristique cras sit malesuada. Egestas pulvinar interdum sapien et. Consequat neque at donec turpis leo. Quis at.",
    categoriesGrid: [
        { id: 1, title: "Apple Products", image: "/macbook-pro-new.jpg", href: "/category/apple" },
        { id: 2, title: "IT Products", image: "/it-products-new.jpg", href: "/category/it-products" },
        { id: 3, title: "AV Products", image: "/it-products-new.jpg", href: "/category/av-products" },
        { id: 4, title: "Office Equipment", image: "/office-equipment-new.jpg", href: "/category/office-equipment" },
        { id: 5, title: "DSLR Cameras", image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769967871/indian-rentals/ea5ryxbvie8spmdb9slz.jpg", href: "/category/dslr" }
    ]
};

const CategoriesPage = () => {
    const [cmsData, setCmsData] = useState(defaultCMS);
    const [realCategories, setRealCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

                const res = await fetch(`${API}/api/cms/categories-page`);
                if (res.ok) {
                    const data = await res.json();
                    setCmsData(prev => ({
                        categoriesPageTitle: data.categoriesPageTitle || prev.categoriesPageTitle,
                        categoriesPageSubtitle: data.categoriesPageSubtitle || prev.categoriesPageSubtitle,
                        categoriesGrid: data.categoriesGrid && data.categoriesGrid.length > 0 ? data.categoriesGrid : prev.categoriesGrid,
                    }));
                }

                const cats = await getCategories();
                if (cats && Array.isArray(cats)) {
                    setRealCategories(cats);
                }
            } catch (error) {
                console.error("Failed to fetch data for categories page", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const SLUG_TO_ROUTE = {
        'apple': '/category/apple',
        'apple-products': '/category/apple',
        'dslr': '/category/dslr',
        'dslr-cameras': '/category/dslr',
        'it-products': '/category/it-products',
        'av-products': '/category/av-products',
        'office-equipment': '/category/office-equipment',
    };

    const getCategoryRoute = (cat) => {
        const slug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-');
        return SLUG_TO_ROUTE[slug] || `/category/${slug}`;
    };

    const nameToRoute = {};
    realCategories.forEach(cat => {
        nameToRoute[cat.name] = getCategoryRoute(cat);
    });

    const gridItems = (() => {
        if (cmsData.categoriesGrid && cmsData.categoriesGrid.length > 0) {
            return cmsData.categoriesGrid.map(item => ({
                ...item,
                href: nameToRoute[item.title] || item.href,
            }));
        }
        if (realCategories.length > 0) {
            return realCategories.map(cat => ({
                id: cat._id,
                title: cat.name,
                image: cat.image,
                href: getCategoryRoute(cat)
            }));
        }
        return defaultCMS.categoriesGrid;
    })();

    return (
        <div className="min-h-screen bg-white w-full">
            <main className="max-w-[1200px] w-full mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-16 md:pb-20">

                {/* Header Section */}
                <div className="flex flex-col gap-3 w-full mb-6 md:mb-8">

                    {/* Breadcrumb — desktop only */}
                    <div className="hidden md:flex items-center gap-[8px] h-[16px] text-[12px] font-medium text-[#64748B]">
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 400, fontSize: "12px", lineHeight: "16px", color: "hsla(0, 0%, 33%, 1)" }}>
                            Homepage
                        </span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-[#1E293B] font-bold">All Categories</span>
                    </div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[32px] md:text-[44px]"
                        style={{
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 600,
                            lineHeight: "1.25",
                            letterSpacing: "-0.01em",
                            color: "hsla(0, 0%, 12%, 1)",
                        }}
                    >
                        {cmsData.categoriesPageTitle}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 400,
                            fontSize: "14px",
                            lineHeight: "1.6",
                            color: "hsla(0, 0%, 46%, 1)",
                        }}
                    >
                        {cmsData.categoriesPageSubtitle}
                    </motion.p>
                </div>

                {/* Category Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-[24px] w-full">
                    {gridItems.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 + 0.1 }}
                        >
                            <Link href={category.href} className="group block h-full">
                                <div
                                    className="flex flex-col overflow-hidden transition-all duration-300 h-[220px] md:h-[276px]"
                                    style={{
                                        width: "100%",
                                        borderRadius: "12px",
                                        border: "1px solid hsla(0, 0%, 89%, 1)",
                                        backgroundColor: "hsla(0, 0%, 100%, 1)",
                                        boxShadow: "0px 1px 3px 0px hsla(0, 0%, 87%, 0.08), 0px 6px 6px 0px hsla(0, 0%, 87%, 0.07), 0px 13px 8px 0px hsla(0, 0%, 87%, 0.04), 0px 23px 9px 0px hsla(0, 0%, 87%, 0.01), 0px 36px 10px 0px hsla(0, 0%, 87%, 0)"
                                    }}
                                >
                                    {/* Image Container */}
                                    <div className="relative w-full flex-1 flex items-center justify-center p-3 md:p-6 bg-[hsla(0,0%,97%,1)] md:bg-transparent">
                                        <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500">
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
                                        className="flex items-center shrink-0 w-full group-hover:bg-gray-50 transition-colors justify-center md:justify-between"
                                        style={{ height: "52px", padding: "12px 14px" }}
                                    >
                                        <h3 className="font-semibold text-[14px] md:text-[17px] tracking-tight text-[#1E293B] group-hover:text-black transition-colors text-center md:text-left leading-snug">
                                            {category.title}
                                        </h3>
                                        <ArrowRight
                                            weight="regular"
                                            className="text-[#000000] flex-shrink-0 hidden md:block"
                                            style={{ width: "24px", height: "24px", opacity: 1 }}
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
