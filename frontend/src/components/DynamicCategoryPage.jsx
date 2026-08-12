'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { FiPackage } from 'react-icons/fi';
import { ArrowRight, ArrowLeft } from '@phosphor-icons/react';
import { getSubcategoriesByParentName } from '../services/categoryService';
import CategoryNavBar from './CategoryNavBar';

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
        <div className="bg-white font-sans">

            {/* ── Breadcrumb + category pills ── */}
            <CategoryNavBar parentSlug={categorySlug} parentLabel={displayTitle} />

            <main
                style={{
                    maxWidth: '1440px',
                    width: '100%',
                    minHeight: '600px',
                    margin: '0 auto',
                    paddingTop: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'hsla(0, 0%, 100%, 1)',
                    boxSizing: 'border-box',
                    opacity: 1
                }}
            >
                {/* Inner Container */}
                <div
                    className="px-4 lg:px-8"
                    style={{
                        maxWidth: '1200px',
                        width: '100%',
                        paddingTop: '40px',
                        paddingBottom: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '30px',
                        boxSizing: 'border-box'
                    }}
                >
                    {/* Mobile: back arrow + title */}
                    <div className="flex lg:hidden items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            style={{ flexShrink: 0, width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <ArrowLeft size={32} color="#1f2937" />
                        </button>
                        <h1 style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '24px', lineHeight: '1.2', letterSpacing: '-0.01em', color: 'hsla(0, 0%, 12%, 1)', margin: 0 }}>
                            {displayTitle}
                        </h1>
                    </div>

                    {/* Desktop title */}
                    <h1 className="hidden lg:block" style={{
                        fontFamily: "'Mona Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: "47px",
                        lineHeight: "58px",
                        letterSpacing: "-1.5px",
                        color: "hsla(0, 0%, 12%, 1)",
                        margin: 0,
                        height: '58px',
                        width: '1200px'
                    }}>
                        {displayTitle}
                    </h1>

                    {/* Loading skeleton */}
                    {loading && (
                        <div
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                            style={{ gap: '24px' }}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                <div
                                    key={n}
                                    className="animate-pulse flex flex-col"
                                    style={{ height: '208px', gap: '7px' }}
                                >
                                    <div
                                        className="w-full bg-gray-50 border border-gray-100 rounded-[8px]"
                                        style={{ height: '173px' }}
                                    />
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mt-1" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Subcategory grid */}
                    {!loading && filtered.length > 0 && (
                        <>
                            <div
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6"
                                style={{ width: '100%' }}
                            >
                                {filtered.map((sub) => (
                                    <Link
                                        key={sub.href}
                                        href={sub.href}
                                        className="group flex flex-col outline-none h-[187px] lg:h-[208px]"
                                        style={{
                                            boxSizing: 'border-box',
                                            gap: '7px',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        <div
                                            className="rounded-lg flex items-center justify-center overflow-hidden group-hover:border-gray-300 transition-all duration-300 h-[160px] lg:h-[173px]"
                                            style={{
                                                width: '100%',
                                                boxSizing: 'border-box',
                                                background: 'hsla(0, 0%, 100%, 1)',
                                                border: '1px solid hsla(0, 0%, 93%, 1)',
                                                boxShadow: '0px 1px 3px 0px hsla(0,0%,87%,0.08), 0px 6px 6px 0px hsla(0,0%,87%,0.07), 0px 13px 8px 0px hsla(0,0%,87%,0.04), 0px 23px 9px 0px hsla(0,0%,87%,0.01), 0px 36px 10px 0px hsla(0,0%,87%,0)',
                                                padding: '8px',
                                            }}
                                        >
                                            <div className="w-full h-full relative transform group-hover:scale-105 transition-transform duration-500">
                                                {sub.image ? (
                                                    <Image
                                                        src={sub.image}
                                                        alt={sub.name}
                                                        fill
                                                        className="object-contain"
                                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <FiPackage size={32} className="text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p
                                            style={{
                                                fontFamily: "'Mona Sans', sans-serif",
                                                fontWeight: 600,
                                                color: '#333333',
                                            }}
                                            className="text-center transition-colors duration-300 w-full truncate text-[14px] leading-[20px] tracking-[-0.01em] lg:text-[21px] lg:leading-[28px] lg:tracking-[-0.8px]"
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
                </div>
            </main>
        </div>
    );
}
