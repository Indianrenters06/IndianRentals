'use client';
import React from 'react';
import Link from 'next/link';

export const CATEGORY_PILLS = [
    { label: 'Apple Products', slug: 'apple' },
    { label: 'IT Products', slug: 'it-products' },
    { label: 'AV Products', slug: 'av-products' },
    { label: 'Office Equipment', slug: 'office-equipment' },
    { label: 'DSLR Cameras', slug: 'dslr' },
];

/**
 * CategoryNavBar
 *
 * The grey breadcrumb + category-pill bar that sits at the top of every
 * category and subcategory page.
 *
 * Props:
 *  - parentSlug   (string)  Slug of the top-level category, e.g. "apple". Highlights its pill.
 *  - parentLabel  (string)  Display name of the top-level category, e.g. "Apple Products".
 *  - currentLabel (string)  Optional final crumb (the subcategory). Omit on category pages.
 */
export default function CategoryNavBar({ parentSlug, parentLabel, currentLabel }) {
    const parentName = parentLabel || CATEGORY_PILLS.find((p) => p.slug === parentSlug)?.label || parentSlug;

    return (
        <>
            {/* ── Mobile: pills-only in 3+2 grid (hidden on lg+) ── */}
            <div className="block lg:hidden" style={{ width: '100%', background: 'hsla(0, 0%, 96%, 1)', padding: '10px 14px', borderBottom: '1px solid hsla(0, 0%, 93%, 1)', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                    {CATEGORY_PILLS.map((cat) => {
                        const isActive = parentSlug === cat.slug;
                        return (
                            <Link
                                key={cat.slug}
                                href={`/category/${cat.slug}`}
                                style={{
                                    flex: '0 0 calc((100% - 16px) / 3)',
                                    height: '34px',
                                    borderRadius: '68px',
                                    border: isActive ? '1px solid hsla(44, 100%, 64%, 1)' : '1px solid hsla(0, 0%, 89%, 1)',
                                    background: isActive ? 'hsla(43, 100%, 95%, 1)' : 'hsla(0, 0%, 100%, 1)',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.15s',
                                    boxSizing: 'border-box',
                                    overflow: 'hidden',
                                }}
                            >
                                <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '11px', lineHeight: '16px', letterSpacing: '-0.01em', color: 'hsla(0, 0%, 0%, 1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 6px' }}>
                                    {cat.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* ── Desktop: breadcrumb + pills in one row (hidden below lg) ── */}
            <div className="hidden lg:block">
                <div style={{ width: '100%', background: 'hsla(0, 0%, 96%, 1)', height: '62px' }}>
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
                        }}
                    >
                        {/* Breadcrumb */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 500, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-black transition-colors">
                                Homepage
                            </Link>
                            <span style={{ color: '#9CA3AF' }}>›</span>
                            <Link href="/categories" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-black transition-colors">
                                All Categories
                            </Link>
                            {parentSlug && (
                                <>
                                    <span style={{ color: '#9CA3AF' }}>›</span>
                                    {currentLabel ? (
                                        <Link href={`/category/${parentSlug}`} style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-black transition-colors">
                                            {parentName}
                                        </Link>
                                    ) : (
                                        <span style={{ color: '#1D1D1F', fontWeight: 600 }}>{parentName}</span>
                                    )}
                                </>
                            )}
                            {currentLabel && (
                                <>
                                    <span style={{ color: '#9CA3AF' }}>›</span>
                                    <span style={{ color: '#1D1D1F', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>
                                        {currentLabel}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Category filter pills */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                height: '62px',
                                paddingTop: '12px',
                                paddingBottom: '12px',
                                borderBottom: '1px solid hsla(0, 0%, 93%, 1)',
                                flexShrink: 0,
                                boxSizing: 'border-box',
                            }}
                        >
                            {CATEGORY_PILLS.map((cat) => {
                                const isActive = parentSlug === cat.slug;
                                return (
                                    <Link
                                        key={cat.slug}
                                        href={`/category/${cat.slug}`}
                                        style={{
                                            height: '38px',
                                            padding: '8px 16px',
                                            borderRadius: '68px',
                                            border: isActive ? '1px solid hsla(44, 100%, 64%, 1)' : '1px solid hsla(0, 0%, 89%, 1)',
                                            background: isActive ? 'hsla(43, 100%, 95%, 1)' : 'hsla(0, 0%, 100%, 1)',
                                            textDecoration: 'none',
                                            whiteSpace: 'nowrap',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.15s',
                                            boxSizing: 'border-box',
                                        }}
                                    >
                                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '14px', lineHeight: '20px', letterSpacing: '-0.01em', color: 'hsla(0, 0%, 0%, 1)' }}>
                                            {cat.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
