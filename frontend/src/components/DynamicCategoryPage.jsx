'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { FiPackage } from 'react-icons/fi';
import { getSubcategoriesByParentName } from '../services/categoryService';

/**
 * DynamicCategoryPage
 *
 * Shared component for all top-level category pages (Apple, DSLR, etc.)
 * Fetches live subcategories from the DB and shows them as browsable tiles.
 *
 * Props:
 *  - categoryName   (string)  Exact name as stored in DB, e.g. "Apple"
 *  - displayTitle   (string)  Human-friendly title, e.g. "Apple Products"
 *  - categorySlug   (string)  URL slug, e.g. "apple"
 *  - filterChips    (array)   Static icon chips [{label, Icon}] for quick navigation
 *  - fallbackItems  (array)   Static fallback subcategories if DB returns nothing
 *                             [{name, image, slug}]  slug = URL segment after /category/<categorySlug>/
 */
export default function DynamicCategoryPage({
    categoryName,
    displayTitle,
    categorySlug,
    filterChips = [],
    fallbackItems = [],
}) {
    const router = useRouter();
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState(null);
    const [usedFallback, setUsedFallback] = useState(false);

    useEffect(() => {
        const fetchSubs = async () => {
            try {
                setLoading(true);
                const subs = await getSubcategoriesByParentName(categoryName);
                if (subs && subs.length > 0) {
                    // Map DB subcategories to display format
                    setSubcategories(subs.map((s) => ({
                        _id: s._id,
                        name: s.name,
                        image: s.image || null,
                        slug: s.slug || s.name.toLowerCase().replace(/\s+/g, '-'),
                        href: `/category/${categorySlug}/${s.slug || s.name.toLowerCase().replace(/\s+/g, '-')}?subId=${s._id}`,
                    })));
                    setUsedFallback(false);
                } else {
                    // Use fallback static list when DB has no subcategories seeded yet
                    setSubcategories(
                        fallbackItems.map((f) => ({
                            name: f.name,
                            image: f.image || null,
                            slug: f.slug,
                            href: `/category/${categorySlug}/${f.slug}`,
                        }))
                    );
                    setUsedFallback(true);
                }
            } catch (err) {
                console.error('Error fetching subcategories:', err);
                // Graceful fallback
                setSubcategories(
                    fallbackItems.map((f) => ({
                        name: f.name,
                        image: f.image || null,
                        slug: f.slug,
                        href: `/category/${categorySlug}/${f.slug}`,
                    }))
                );
                setUsedFallback(true);
            } finally {
                setLoading(false);
            }
        };
        fetchSubs();
    }, [categoryName, categorySlug, fallbackItems]);

    // Filter subcategories by active filter chip
    const filtered = activeFilter
        ? subcategories.filter((s) =>
            s.name.toLowerCase().includes(activeFilter.toLowerCase())
        )
        : subcategories;

    return (
        <div className="min-h-screen bg-white font-sans">
            <main className="px-4 pt-5 pb-10 max-w-7xl mx-auto sm:px-6 lg:px-8">

                {/* Filter Grid */}
                {filterChips.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-6">
                        {filterChips.map((chip) => {
                            const isActive = activeFilter === chip.label;
                            return (
                                <button
                                    key={chip.label}
                                    onClick={() => setActiveFilter(isActive ? null : chip.label)}
                                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all duration-200 ${isActive
                                        ? 'border-gray-700 bg-gray-50 shadow-sm'
                                        : 'border-gray-200 bg-white hover:border-gray-400'
                                        }`}
                                >
                                    <chip.Icon size={38} strokeWidth={1.2} className="text-gray-900" />
                                    <span className="text-[10px] font-medium text-gray-700 text-center leading-tight">
                                        {chip.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Back + Title */}
                <div className="flex items-center gap-3 mb-5">
                    <button
                        onClick={() => router.back()}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FaArrowLeft size={18} className="text-gray-800" />
                    </button>
                    <h1 className="text-xl md:text-3xl font-bold text-gray-900">{displayTitle}</h1>
                </div>

                {/* Loading skeleton */}
                {loading && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="animate-pulse">
                                <div className="bg-gray-100 rounded-2xl aspect-4/3 mb-2" />
                                <div className="h-3 bg-gray-100 rounded w-3/4 mx-auto" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Subcategory grid */}
                {!loading && filtered.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {filtered.map((sub) => (
                                <Link key={sub.href} href={sub.href} className="group block" style={{ width: "220.8px" }}>
                                    {/* Image Container */}
                                    <div
                                        className="rounded-lg border border-gray-200 bg-[#F5F5F7] overflow-hidden flex items-center justify-center group-hover:shadow-md group-hover:border-gray-300 transition-all duration-300"
                                        style={{ width: "220.8px", height: "173px" }}
                                    >
                                        <div className="w-full h-full relative transform group-hover:scale-105 transition-transform duration-400">
                                            {sub.image ? (
                                                <Image
                                                    src={sub.image}
                                                    alt={sub.name}
                                                    fill
                                                    className="object-contain p-4 mix-blend-multiply"
                                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FiPackage size={36} className="text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Label */}
                                    <p
                                        className="text-[14px] font-semibold text-[#1D1D1F] text-center leading-snug group-hover:text-[#FF3B30] transition-colors duration-300"
                                        style={{ marginTop: "7px" }}
                                    >
                                        {sub.name}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </>
                )}

                {/* Empty state */}
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-20">
                        <FiPackage size={48} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-lg font-semibold text-gray-700">No subcategories found</h2>
                        <p className="text-sm text-gray-400 mt-1">
                            Add subcategories under &quot;{categoryName}&quot; from the admin panel.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
