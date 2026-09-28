'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories } from '../services/categoryService';
import { categorySlug } from '../lib/categoryRoutes';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import styles from './CategoryLayout.module.css';

// Shown before the API responds, and if it fails. Kept in the order the
// business wants them; anything else from the DB is appended after these.
export const CATEGORY_PILLS = [
    { label: 'Apple Products', slug: 'apple' },
    { label: 'IT Products', slug: 'it-products' },
    { label: 'AV Products', slug: 'av-products' },
    { label: 'Office Equipment', slug: 'office-equipment' },
    { label: 'DSLR Cameras', slug: 'dslr' },
];

const PREFERRED_ORDER = CATEGORY_PILLS.map((p) => p.slug);

/**
 * CategoryNavBar
 *
 * The grey breadcrumb + category-pill bar at the top of every category and
 * subcategory page. Pills are loaded from the DB so every active top-level
 * category shows up, not just the five that were originally hardcoded.
 *
 * Props:
 *  - parentSlug   (string)  Slug of the top-level category, e.g. "apple". Highlights its pill.
 *  - parentLabel  (string)  Display name of the top-level category, e.g. "Apple Products".
 *  - currentLabel (string)  Optional final crumb (the subcategory). Omit on category pages.
 */
export default function CategoryNavBar({ parentSlug, parentLabel, currentLabel }) {
    const [pills, setPills] = useState(CATEGORY_PILLS);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const cats = await getCategories();
                if (cancelled || !Array.isArray(cats) || cats.length === 0) return;

                const live = cats.map((c) => ({ label: c.name, slug: categorySlug(c) }));

                // Known categories first (in the curated order), then everything else.
                const ranked = [...live].sort((a, b) => {
                    const ai = PREFERRED_ORDER.indexOf(a.slug);
                    const bi = PREFERRED_ORDER.indexOf(b.slug);
                    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
                });

                // De-dupe by slug in case two DB rows resolve to the same route.
                setPills(Array.from(new Map(ranked.map((p) => [p.slug, p])).values()));
            } catch {
                // keep the static fallback
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    const parentName =
        parentLabel || pills.find((p) => p.slug === parentSlug)?.label || parentSlug;

    const pillStyle = (isActive, { height, padding, radius }) => ({
        height,
        padding,
        borderRadius: radius,
        border: isActive ? '1px solid hsla(44, 100%, 64%, 1)' : '1px solid hsla(0, 0%, 89%, 1)',
        background: isActive ? 'hsla(43, 100%, 95%, 1)' : 'hsla(0, 0%, 100%, 1)',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
        boxSizing: 'border-box',
    });

    return (
        <>
            <div className={styles.compactNav}>
                <div className={styles.compactNavInner}>
                    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                        <Link href="/">Homepage</Link>
                        <ChevronRightIcon aria-hidden="true" />
                        <Link href="/categories">All Categories</Link>
                        {parentSlug && <>
                            <ChevronRightIcon aria-hidden="true" />
                            {currentLabel
                                ? <Link href={`/category/${parentSlug}`}>{parentName}</Link>
                                : <span aria-current="page">{parentName}</span>}
                        </>}
                        {currentLabel && <>
                            <ChevronRightIcon aria-hidden="true" />
                            <span aria-current="page">{currentLabel}</span>
                        </>}
                    </nav>
                    <nav className={styles.pills} aria-label="Product categories">
                        {pills.map((cat) => (
                            <Link key={cat.slug} href={`/category/${cat.slug}`}
                                aria-current={parentSlug === cat.slug ? 'page' : undefined}
                                className={styles.pill}>
                                {cat.label}
                            </Link>
                        ))}
                    </nav>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 500, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', flexShrink: 1, minWidth: 0 }}>
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

                        {/* Category pills — scroll horizontally once they outgrow the row */}
                        <div
                            id="category-nav-pills"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                height: '62px',
                                paddingTop: '12px',
                                paddingBottom: '12px',
                                borderBottom: '1px solid hsla(0, 0%, 93%, 1)',
                                boxSizing: 'border-box',
                                overflowX: 'auto',
                                msOverflowStyle: 'none',
                                scrollbarWidth: 'none',
                            }}
                        >
                            <style dangerouslySetInnerHTML={{ __html: `#category-nav-pills::-webkit-scrollbar { display: none; }` }} />
                            {pills.map((cat) => (
                                <Link
                                    key={cat.slug}
                                    href={`/category/${cat.slug}`}
                                    style={{
                                        ...pillStyle(parentSlug === cat.slug, { height: '38px', padding: '8px 16px', radius: '68px' }),
                                        flexShrink: 0,
                                    }}
                                >
                                    <span style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '14px', lineHeight: '20px', letterSpacing: '-0.01em', color: 'hsla(0, 0%, 0%, 1)' }}>
                                        {cat.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
