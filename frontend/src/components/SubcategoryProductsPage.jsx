"use client";
import React, { useState, useEffect } from 'react';
import { FiPackage } from 'react-icons/fi';
import { getProductsBySubcategory, getProducts } from '../services/productService';
import ProductCard from './ProductCard';
import Sidebar from './Sidebar';
import CategoryNavBar from './CategoryNavBar';
import CategoryFilters from './CategoryFilters';
import SubcategoryStrip from './SubcategoryStrip';
import styles from './CategoryLayout.module.css';

export default function SubcategoryProductsPage({ subcategoryId, subcategoryName, parentName, parentHref }) {
    // "/category/it-products" → "it-products"
    const parentSlug = (parentHref || '').split('/').filter(Boolean).pop() || '';
    const [products, setProducts] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState("3 months");
    const [selectedSort, setSelectedSort] = useState("Most Popular");
    const [dealsOnly, setDealsOnly] = useState(false);
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                let data;
                if (subcategoryId) {
                    data = await getProductsBySubcategory(subcategoryId);
                } else {
                    data = await getProducts({ category: parentName });
                }
                const list = Array.isArray(data) ? data : (data.products || []);
                setProducts(list);
            } catch (err) {
                console.error('Failed to load products:', err);
                setError('Failed to load products. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        const fetchSubcategories = async () => {
            try {
                const { getSubcategoriesByParentName } = await import('../services/categoryService');

                const namesToTry = [
                    parentName,
                    parentName?.replace(/\s*Products?\s*/i, '').trim(),
                    `${parentName} Products`,
                ].filter(Boolean);

                let subs = [];
                for (const name of namesToTry) {
                    subs = await getSubcategoriesByParentName(name) || [];
                    if (subs.length > 0) break;
                }

                if (subs.length === 0 && parentName?.toLowerCase() === 'apple') {
                    setSubcategories([
                        { name: "MacBook Pro", slug: "macbook-pro", image: "/macbook-pro-new.jpg" },
                        { name: "iPhone", slug: "iphone", image: "/macbook-pro-new.jpg" },
                        { name: "MacBook Air", slug: "macbook-air", image: "/macbook-pro-new.jpg" },
                        { name: "iPad", slug: "ipad", image: "/ipad-new.jpg" },
                        { name: "Apple Studio Display", slug: "studio-display", image: "/apple-xdr-display-new.jpg" },
                        { name: "Apple XDR Display", slug: "xdr-display", image: "/apple-xdr-display-new.jpg" },
                        { name: "Mac Pro", slug: "mac-pro", image: "/mac-pro-new.jpg" },
                        { name: "iMac", slug: "imac", image: "/apple-xdr-display-new.jpg" },
                        { name: "Mac Studio", slug: "mac-studio", image: "/mac-studio-new.jpg" },
                        { name: "Mac Mini", slug: "mac-mini", image: "/mac-mini-new.jpg" },
                    ].map(f => ({ ...f, href: `/category/${parentSlug || 'apple'}/${f.slug}` })));
                } else {
                    const activeCatSlug = parentSlug || parentName?.toLowerCase().replace(/\s+/g, '-') || 'all';
                    setSubcategories(subs.map(s => ({
                        _id: s._id,
                        name: s.name,
                        image: s.image || null,
                        slug: s.slug || s.name.toLowerCase().replace(/\s+/g, '-'),
                        href: `/category/${activeCatSlug}/${s.slug || s.name.toLowerCase().replace(/\s+/g, '-')}?subId=${s._id}`,
                    })));
                }
            } catch (err) {
                console.error('Failed to load sibling subcategories:', err);
            }
        };

        fetchProducts();
        fetchSubcategories();
    }, [subcategoryId, parentName, parentSlug]);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const getDurationMultiplier = (duration) => {
        switch (duration) {
            case "1 month": return 1.2;
            case "3 months": return 1.0;
            case "6 months": return 0.85;
            case "9 months": return 0.75;
            case "18 months": return 0.65;
            case "24 months": return 0.55;
            default: return 1.0;
        }
    };

    const processedProducts = React.useMemo(() => {
        let results = products.map(p => {
            const baseOrigin = Math.round((p.rentalPrice || 8999) * 1.5);
            const baseRent = p.rentalPrice || 0;
            return {
                id: p._id,
                name: p.name,
                description: p.description,
                baseOriginalPrice: baseOrigin,
                baseRentPrice: baseRent,
                originalPrice: baseOrigin,
                rentPrice: baseRent,
                discount: "-20% off",
                image: (p.images && p.images.length > 0) ? p.images[0] : "/images/placeholder.png",
                isNew: p.condition === 'New',
                rating: p.rating,
                reviews: p.numReviews ?? p.reviewCount ?? 0,
                rentalPrice: p.rentalPrice
            };
        });

        const multiplier = getDurationMultiplier(selectedDuration);
        results = results.map(p => ({
            ...p,
            selectedDurationStr: selectedDuration,
            rentPrice: Math.round(p.baseRentPrice * multiplier),
            originalPrice: Math.round(p.baseOriginalPrice * multiplier)
        }));

        if (dealsOnly) results = results.filter(p => Boolean(p.discount));

        if (selectedSort === "Price (low to high)") {
            results.sort((a, b) => a.rentPrice - b.rentPrice);
        } else if (selectedSort === "Price (high to low)") {
            results.sort((a, b) => b.rentPrice - a.rentPrice);
        } else if (selectedSort === "New Arrivals") {
            results.reverse();
        }

        return results;
    }, [products, selectedDuration, selectedSort, dealsOnly]);

    return (
        <div className="min-h-screen bg-white">

            {/* ── Breadcrumb + category pills ── */}
            <CategoryNavBar
                parentSlug={parentSlug}
                parentLabel={parentName}
                currentLabel={subcategoryName}
            />

            <SubcategoryStrip id="subcat-slider-dynamic" subcategories={subcategories} activeName={subcategoryName} />

            <div className={styles.listingBody}>
                <h1 className={styles.listingTitle}>{subcategoryName}</h1>

                <div style={{ display: 'flex', width: '100%', gap: '20px' }}>
                    {!isMobile && (
                        <Sidebar
                            selectedDuration={selectedDuration}
                            setSelectedDuration={setSelectedDuration}
                            selectedSort={selectedSort}
                            setSelectedSort={setSelectedSort}
                            dealsOnly={dealsOnly}
                            setDealsOnly={setDealsOnly}
                        />
                    )}

                    <div className={styles.listingContent}>
                        <CategoryFilters count={processedProducts.length}
                            selectedDuration={selectedDuration} setSelectedDuration={setSelectedDuration}
                            selectedSort={selectedSort} setSelectedSort={setSelectedSort}
                            dealsOnly={dealsOnly} setDealsOnly={setDealsOnly} />
                        {/* Loading skeleton */}
                        {loading && (
                            <div className={styles.productGrid}>
                                {[1, 2, 3, 4, 5, 6].map((n) => (
                                    <div key={n} style={{ animation: 'pulse 2s infinite' }}>
                                        <div style={{ background: '#f3f4f6', borderRadius: '16px', aspectRatio: '1/1', marginBottom: '8px' }} />
                                        <div style={{ height: '16px', background: '#f3f4f6', borderRadius: '4px', width: '75%', margin: '0 auto' }} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Error */}
                        {!loading && error && (
                            <div style={{ textAlign: 'center', padding: '64px 0' }}>
                                <p style={{ color: '#6b7280', fontSize: '14px' }}>{error}</p>
                                <button onClick={() => window.location.reload()} style={{ marginTop: '16px', padding: '8px 16px', background: '#111827', color: 'white', borderRadius: '8px', fontSize: '14px', border: 'none', cursor: 'pointer' }}>Retry</button>
                            </div>
                        )}

                        {/* Empty */}
                        {!loading && !error && processedProducts.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '80px 0' }}>
                                <FiPackage size={48} style={{ margin: '0 auto 16px', color: '#d1d5db', display: 'block' }} />
                                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#374151' }}>No products available</h2>
                            </div>
                        )}

                        {/* Products grid */}
                        {!loading && !error && processedProducts.length > 0 && (
                            <>
                                {!isMobile && (
                                    <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '24px', fontFamily: "'Mona Sans', sans-serif", textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        {processedProducts.length} PRODUCTS FOUND
                                    </p>
                                )}

                                <div className={styles.productGrid}>
                                    {processedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} mobile={isMobile} />
                                    ))}
                                </div>


                            </>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
