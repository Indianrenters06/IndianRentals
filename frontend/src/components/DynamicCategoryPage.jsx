'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { FiPackage } from 'react-icons/fi';
import { ArrowRight } from '@phosphor-icons/react';
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

            {/* ── Figma Category Nav Bar: full-width outer, 1200px inner ── */}
            <div
                style={{
                    width: '100%',
                    background: 'hsla(0, 0%, 96%, 1)',
                    height: '62px',
                }}
            >
                {/* Inner container: 1200px, space-between */}
                <div
                    style={{
                        maxWidth: '1200px',
                        width: '100%',
                        height: '62px',
                        margin: '0 auto',
                        padding: '0 32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                        boxSizing: 'border-box',
                        opacity: 1,
                    }}
                >
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748B] whitespace-nowrap">
                        <Link href="/" className="hover:text-black transition-colors">Homepage</Link>
                        <span className="text-gray-400">›</span>
                        <Link href="/categories" className="hover:text-black transition-colors">All Categories</Link>
                        <span className="text-gray-400">›</span>
                        <span className="text-[#1D1D1F] font-semibold">{displayTitle}</span>
                    </div>

                    {/* Category filter pills — Figma: 666×62, gap:8, pt:12 pb:12, border-bottom 1px solid hsla(0,0%,93%,1) */}
                    <div
                        style={{
                            width: '666px',
                            height: '62px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            paddingTop: '12px',
                            paddingBottom: '12px',
                            borderBottom: '1px solid hsla(0, 0%, 93%, 1)',
                            opacity: 1,
                            boxSizing: 'border-box',
                            flexShrink: 0,
                        }}
                    >
                        {[
                            { label: 'Apple Products', slug: 'apple' },
                            { label: 'IT Products', slug: 'it-products' },
                            { label: 'AV Products', slug: 'av-products' },
                            { label: 'Office Equipment', slug: 'office-equipment' },
                            { label: 'DSLR Cameras', slug: 'dslr' },
                        ].map((cat) => {
                            const isActive = categorySlug === cat.slug;
                            return (
                                <Link
                                    key={cat.slug}
                                    href={`/category/${cat.slug}`}
                                    style={{
                                        height: '38px',
                                        padding: '8px 16px',
                                        borderRadius: isActive ? '68px' : '38px',
                                        border: isActive
                                            ? '1px solid hsla(44, 100%, 64%, 1)'
                                            : '1px solid hsla(0, 0%, 89%, 1)',
                                        background: isActive
                                            ? 'hsla(43, 100%, 95%, 1)'
                                            : 'hsla(0, 0%, 100%, 1)',
                                        textDecoration: 'none',
                                        whiteSpace: 'nowrap',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: 1,
                                        transition: 'all 0.15s',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    {/* Figma text: Mona Sans SemiBold 14px / 20px lh / -0.01em ls / center / hsla(0,0%,12%,1) */}
                                    <span style={{
                                        fontFamily: "'Mona Sans', sans-serif",
                                        fontWeight: 600,
                                        fontSize: '14px',
                                        lineHeight: '20px',
                                        letterSpacing: '-0.01em',
                                        textAlign: 'center',
                                        color: 'hsla(0, 0%, 0%, 1)',
                                    }}>
                                        {cat.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            <main 
                style={{
                    maxWidth: '1200px',
                    width: '100%',
                    margin: '0 auto',
                    padding: '40px 32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    minHeight: '662px',
                    boxSizing: 'border-box'
                }}
            >
                {/* Title */}
                <h1 style={{
                    fontFamily: "'Mona Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: "44px",
                    lineHeight: "58px",
                    letterSpacing: "-0.01em",
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
                        style={{ gap: '30px' }}
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                            <div key={n} className="animate-pulse">
                                <div className="bg-gray-100 rounded-lg aspect-[4/3] mb-2" />
                                <div className="h-3 bg-gray-100 rounded w-3/4 mx-auto" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Subcategory grid */}
                {!loading && filtered.length > 0 && (
                    <>
                        <div 
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                            style={{ gap: '30px' }}
                        >
                            {filtered.map((sub) => (
                                <Link key={sub.href} href={sub.href} className="group block">
                                    {/* Image Container — matches Figma: white bg, light border, rounded */}
                                    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden flex items-center justify-center group-hover:shadow-md group-hover:border-gray-300 transition-all duration-300" style={{ height: "140px" }}>
                                        <div className="w-full h-full relative transform group-hover:scale-105 transition-transform duration-500">
                                            {sub.image ? (
                                                <Image
                                                    src={sub.image}
                                                    alt={sub.name}
                                                    fill
                                                    className="object-contain p-3"
                                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FiPackage size={32} className="text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Label — centered, no arrow */}
                                    <p
                                        className="text-[13px] font-semibold text-[#1D1D1F] text-center leading-snug mt-2 group-hover:text-[#FF3B30] transition-colors duration-300"
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
