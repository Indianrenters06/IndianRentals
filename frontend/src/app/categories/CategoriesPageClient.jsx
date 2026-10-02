"use client";
import { API as API } from '@/services/apiConfig';
import { cmsUrl } from '@/lib/cmsPreview';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { getCategories } from "../../services/categoryService";

const defaultCMS = {
    categoriesPageTitle: "All Categories",
    categoriesPageSubtitle: "Need equipment for work or an event? Browse laptops and MacBooks, projectors and AV gear, office equipment, and DSLR cameras for rent. Choose a category to see what's available.",
    categoriesGrid: [
        { id: 1, title: "Apple Products", image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769946716/indian-rentals/fj8ptqbhppbstdd0hs4i.png", href: "/category/apple" },
        { id: 2, title: "IT Products", image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1778099153/indian-rentals/tqniq6juxhhf1j3svppm.png", href: "/category/it-products" },
        { id: 3, title: "AV Products", image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769967671/indian-rentals/ecmi4pwvqgqs0owaw4xi.jpg", href: "/category/av-products" },
        { id: 4, title: "Office Equipment", image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1769967742/indian-rentals/bg4ktprnuvw0jf33m6wv.jpg", href: "/category/office-equipment" },
        { id: 5, title: "DSLR Cameras", image: "https://res.cloudinary.com/dgkckcdk8/image/upload/v1789664661/indian-rentals/bwbf0rroyukoaqfcddla.png", href: "/category/dslr" }
    ]
};

const CategoriesPage = () => {
    const [cmsData, setCmsData] = useState(defaultCMS);
    const [realCategories, setRealCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const res = await fetch(cmsUrl('categories-page'));
                if (res.ok) {
                    const data = await res.json();
                    setCmsData(prev => ({
                        categoriesPageTitle: data.categoriesPageTitle || prev.categoriesPageTitle,
                        categoriesPageSubtitle: data.categoriesPageSubtitle && !/^lorem ipsum\b/i.test(data.categoriesPageSubtitle.trim())
                            ? data.categoriesPageSubtitle
                            : prev.categoriesPageSubtitle,
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

    const isCloudinaryOrValid = (img) => {
        if (!img || typeof img !== 'string') return false;
        if (img.startsWith('/macbook') || img.startsWith('/it-products') || img.startsWith('/office-equipment')) return false;
        return img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/');
    };

    const gridItems = (() => {
        if (cmsData.categoriesGrid && cmsData.categoriesGrid.length > 0) {
            return cmsData.categoriesGrid.map((item, idx) => {
                const titleNorm = item.title?.toLowerCase().trim();
                const matchedCat = realCategories.find(c => {
                    const cName = c.name?.toLowerCase().trim();
                    const cSlug = (c.slug || '').toLowerCase().trim();
                    return cName === titleNorm || titleNorm.includes(cName) || cName.includes(titleNorm) || cSlug === titleNorm;
                });

                let finalImage = isCloudinaryOrValid(item.image) ? item.image : (matchedCat?.image || null);
                let finalHref = item.href || (matchedCat ? getCategoryRoute(matchedCat) : nameToRoute[item.title] || '/products');

                return {
                    id: item._id || item.id || idx,
                    title: item.title,
                    image: finalImage,
                    href: finalHref,
                };
            });
        }

        if (realCategories.length > 0) {
            return realCategories.map(cat => ({
                id: cat._id,
                title: cat.name,
                image: isCloudinaryOrValid(cat.image) ? cat.image : null,
                href: getCategoryRoute(cat)
            }));
        }

        return defaultCMS.categoriesGrid;
    })();

    return (
        <div className="min-h-screen bg-white w-full">
            <div className="w-full bg-[#f6f6f6]">
                <nav aria-label="Breadcrumb" className="mx-auto flex min-h-12 w-full max-w-[1200px] items-center gap-2 px-4 text-xs leading-4 tracking-[-0.025em] md:px-8 lg:min-h-[62px]">
                    <Link href="/" className="shrink-0 text-[#545454] transition-colors hover:text-[#141414] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]">Homepage</Link>
                    <ChevronRightIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-[#777]" />
                    <span aria-current="page" className="min-w-0 truncate font-semibold text-[#1f1f1f]">All Categories</span>
                </nav>
            </div>
            <main className="max-w-[1200px] w-full mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-16 md:pb-20">

                {/* Header Section */}
                <div className="flex flex-col gap-3 w-full mb-6 md:mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-balance text-[30px] font-semibold leading-[1.15] tracking-[-0.035em] text-[#1f1f1f] sm:text-[36px] md:text-[40px] lg:text-[44px]"
                        style={{
                            fontFamily: "'Mona Sans', sans-serif",
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
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-[24px] w-full">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div
                                key={n}
                                className="flex flex-col h-[220px] md:h-[276px] rounded-[12px] border border-slate-100 dark:border-slate-800 bg-slate-50/70 animate-pulse overflow-hidden p-6"
                            >
                                <div className="flex-1 w-full bg-slate-200/70 rounded-lg mb-4" />
                                <div className="h-4 bg-slate-200/90 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : (
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
                                        <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden">
                                            <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500">
                                                {category.image ? (
                                                    <Image
                                                        src={category.image}
                                                        alt={category.title}
                                                        fill
                                                        unoptimized
                                                        className="object-cover"
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
                )}
            </main>
        </div>
    );
};

export default CategoriesPage;
