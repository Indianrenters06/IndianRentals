'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiPackage } from 'react-icons/fi';
import CategoryPlaceholderIcon from './CategoryPlaceholderIcon';
import { getSubcategoriesByParentName } from '../services/categoryService';
import CategoryNavBar from './CategoryNavBar';
import styles from './CategoryLayout.module.css';

const EMPTY_ITEMS = [];

function CategoryTileImage({ image, name, slug }) {
    const [failedImage, setFailedImage] = useState(null);
    const hasImage = Boolean(image) && failedImage !== image;

    return (
        <div className={`${styles.categoryImage} ${hasImage ? '' : styles.categoryImagePlaceholder}`}>
            {hasImage ? (
                <Image src={image} alt="" fill
                    className={styles.categoryPhoto}
                    onError={() => setFailedImage(image)}
                    sizes="(max-width: 767px) calc((100vw - 64px) / 2), (max-width: 1023px) calc((100vw - 108px) / 3), 208px" />
            ) : (
                <div className={styles.imageFallback} aria-hidden="true">
                    <CategoryPlaceholderIcon name={name} slug={slug} className={styles.imageFallbackIcon} />
                    <span className={styles.imageFallbackLabel}>Image unavailable</span>
                </div>
            )}
        </div>
    );
}

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
 *  - fallbackItems  (array)   Static fallback subcategories if DB returns nothing
 *                             [{name, image, slug}]  slug = URL segment after /category/<categorySlug>/
 */
export default function DynamicCategoryPage({
    categoryName,
    displayTitle,
    categorySlug,
    fallbackItems = EMPTY_ITEMS,
}) {
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const fetchSubs = async () => {
            try {
                setLoading(true);
                const subs = await getSubcategoriesByParentName(categoryName);
                if (cancelled) return;
                if (subs && subs.length > 0) {
                    // Map DB subcategories to display format
                    setSubcategories(subs.map((s) => ({
                        _id: s._id,
                        name: s.name,
                        image: s.image || null,
                        slug: s.slug || s.name.toLowerCase().replace(/\s+/g, '-'),
                        href: `/category/${categorySlug}/${s.slug || s.name.toLowerCase().replace(/\s+/g, '-')}?subId=${s._id}`,
                    })));
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
                }
            } catch (err) {
                if (cancelled) return;
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
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchSubs();
        return () => { cancelled = true; };
    }, [categoryName, categorySlug, fallbackItems]);

    return (
        <div className="bg-white font-sans">
            <CategoryNavBar parentSlug={categorySlug} parentLabel={displayTitle} />
            <main className={styles.categoryBody}>
                <h1 className={styles.categoryTitle}>{displayTitle}</h1>
                {loading ? (
                    <div className={styles.categoryGrid} aria-label="Loading categories" aria-busy="true">
                        {Array.from({ length: fallbackItems.length || 6 }, (_, n) => (
                            <div key={n} className="animate-pulse">
                                <div className={styles.categoryImage} />
                                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mt-2" />
                            </div>
                        ))}
                    </div>
                ) : subcategories.length > 0 ? (
                    <div className={styles.categoryGrid}>
                        {subcategories.map((sub) => (
                            <Link key={sub.href} href={sub.href} className={styles.categoryTile}>
                                <CategoryTileImage image={sub.image} name={sub.name} slug={sub.slug} />
                                <span className={styles.categoryName}>{sub.name}</span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <FiPackage size={48} className="mx-auto text-gray-300 mb-4" aria-hidden="true" />
                        <h2 className="text-lg font-semibold text-gray-700">No subcategories found</h2>
                        <Link href="/categories" className="btn-secondary mt-4">Browse categories</Link>
                    </div>
                )}
            </main>
        </div>
    );
}
