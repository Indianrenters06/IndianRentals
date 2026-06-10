"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { FiPackage } from 'react-icons/fi';
import { ChevronRightIcon, ArrowsUpDownIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getProductsBySubcategory, getProducts } from '../services/productService';
import ProductCard from './ProductCard';
import Sidebar from './Sidebar';

export default function SubcategoryProductsPage({ subcategoryId, subcategoryName, parentName, parentHref }) {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState("3 months");
    const [selectedSort, setSelectedSort] = useState("Most Popular");
    const [showSortModal, setShowSortModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
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
                    ].map(f => ({ ...f, href: `/category/${parentName.toLowerCase().replace(/\s+/g, '-')}/${f.slug}` })));
                } else {
                    const activeCatSlug = parentName?.toLowerCase().replace(/\s+/g, '-') || 'all';
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
    }, [subcategoryId, parentName]);

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
                discount: "20% off",
                image: (p.images && p.images.length > 0) ? p.images[0] : "/images/placeholder.png",
                isNew: p.condition === 'New',
                rentalPrice: p.rentalPrice
            };
        });

        const multiplier = getDurationMultiplier(selectedDuration);
        results = results.map(p => ({
            ...p,
            rentPrice: Math.round(p.baseRentPrice * multiplier),
            originalPrice: Math.round(p.baseOriginalPrice * multiplier)
        }));

        if (selectedSort === "Price (low to high)") {
            results.sort((a, b) => a.rentPrice - b.rentPrice);
        } else if (selectedSort === "Price (high to low)") {
            results.sort((a, b) => b.rentPrice - a.rentPrice);
        } else if (selectedSort === "New Arrivals") {
            results.reverse();
        }

        return results;
    }, [products, selectedDuration, selectedSort]);

    return (
        <div className="min-h-screen bg-white">

            {/* ── Mobile Header ── */}
            {isMobile && (
                <div style={{ padding: '24px 16px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            onClick={() => router.back()}
                            style={{ flexShrink: 0, width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <FaArrowLeft size={16} style={{ color: '#1f2937' }} />
                        </button>
                        <h1 style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: '26px', fontWeight: 600, letterSpacing: '-0.01em', color: 'hsla(0, 0%, 12%, 1)', lineHeight: '1.2', margin: 0 }}>
                            {subcategoryName}
                        </h1>
                    </div>
                </div>
            )}

            {/* ── Desktop Breadcrumbs ── */}
            {!isMobile && (
                <div style={{ padding: '16px 32px', maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button onClick={() => router.back()} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: '50%' }}>
                            <FaArrowLeft size={18} style={{ color: '#1f2937' }} />
                        </button>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
                            {' › '}
                            <Link href={parentHref || '#'} style={{ textDecoration: 'none', color: 'inherit' }}>{parentName}</Link>
                            {' › '}
                            <span style={{ color: '#1f2937' }}>{subcategoryName}</span>
                        </p>
                    </div>
                </div>
            )}

            {/* ── Subcategory Slider — desktop only ── */}
            {!isMobile && subcategories.length > 0 && (
                <div style={{ background: 'white', position: 'relative', zIndex: 10 }}>
                    <div
                        style={{ position: 'relative', margin: '0 auto', display: 'flex', alignItems: 'center', maxWidth: '1200px', width: '100%', padding: '20px 32px 0', height: '167px', gap: '24px', boxSizing: 'border-box' }}
                    >
                        <div
                            id="subcat-slider-dynamic"
                            style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollBehavior: 'smooth', width: '100%', height: '147px', gap: '16px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                        >
                            <style dangerouslySetInnerHTML={{ __html: `#subcat-slider-dynamic::-webkit-scrollbar { display: none; }` }} />
                            {subcategories.map((sub) => {
                                const isSubActive = subcategoryName === sub.name;
                                return (
                                    <Link
                                        key={sub.href}
                                        href={sub.href}
                                        className="group"
                                        style={{ display: 'flex', flexDirection: 'column', outline: 'none', flexShrink: 0, scrollSnapAlign: 'start', height: '147.09px', width: '157.71px', boxSizing: 'border-box', gap: '7px', textDecoration: 'none' }}
                                    >
                                        <div
                                            style={{
                                                height: '120.09px', width: '100%', boxSizing: 'border-box',
                                                border: isSubActive ? '2px solid hsla(47, 100%, 76%, 1)' : '2px solid hsla(0, 0%, 93%, 1)',
                                                backgroundColor: isSubActive ? 'hsla(43,100%,95%,1)' : 'hsla(0, 0%, 100%, 1)',
                                                boxShadow: '0px 1px 3px 0px hsla(0, 0%, 87%, 0.08), 0px 6px 6px 0px hsla(0, 0%, 87%, 0.07)',
                                                borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', transition: 'all 0.3s',
                                            }}
                                        >
                                            <div style={{ width: '100px', height: '100px', position: 'relative' }}>
                                                {sub.image ? (
                                                    <Image src={sub.image} alt={sub.name} fill className="object-contain" sizes="100px" />
                                                ) : (
                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <FiPackage size={24} style={{ color: '#d1d5db' }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '12px', lineHeight: '20px', letterSpacing: '-0.01em', color: '#1D1D1F', textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                                            {sub.name}
                                        </p>
                                    </Link>
                                );
                            })}
                        </div>
                        {subcategories.length > 7 && (
                            <button
                                onClick={() => {
                                    const slider = document.getElementById('subcat-slider-dynamic');
                                    if (slider) slider.scrollBy({ left: 300, behavior: 'smooth' });
                                }}
                                style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: '26px', height: '40px', borderRadius: '9px', background: 'hsla(0, 0%, 93%, 1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
                            >
                                <ChevronRightIcon style={{ width: '16px', height: '16px', color: '#4b5563' }} strokeWidth={2} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* ── Mobile Sort / Filter Bar ── */}
            {isMobile && (
                <div style={{ borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex' }}>
                        <button
                            onClick={() => setShowSortModal(true)}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 0', color: '#6b7280', fontSize: '14px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <ArrowsUpDownIcon style={{ width: '16px', height: '16px' }} />
                            Sort By
                        </button>
                        <div style={{ width: '1px', background: '#e5e7eb', margin: '8px 0' }} />
                        <button
                            onClick={() => setShowFilterModal(true)}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 0', color: '#6b7280', fontSize: '14px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <FunnelIcon style={{ width: '16px', height: '16px' }} />
                            Filter
                        </button>
                    </div>
                </div>
            )}

            {/* ── Main Content Area ── */}
            <div
                style={{
                    maxWidth: '1200px', width: '100%', margin: '0 auto',
                    padding: isMobile ? '16px 12px 40px' : '40px 32px 40px',
                    display: 'flex', flexDirection: 'column', gap: '30px',
                    minHeight: isMobile ? 'auto' : '2091px',
                    boxSizing: 'border-box',
                }}
            >
                {/* Desktop title */}
                {!isMobile && (
                    <h1
                        style={{
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: '36px',
                            lineHeight: '45px',
                            letterSpacing: '-0.8px',
                            color: 'hsla(0, 0%, 12%, 1)',
                            maxWidth: '589px',
                            margin: 0,
                        }}
                    >
                        {subcategoryName}
                    </h1>
                )}

                <div style={{ display: 'flex', width: '100%', gap: '20px' }}>
                    {!isMobile && (
                        <Sidebar
                            selectedDuration={selectedDuration}
                            setSelectedDuration={setSelectedDuration}
                            selectedSort={selectedSort}
                            setSelectedSort={setSelectedSort}
                        />
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Loading skeleton */}
                        {loading && (
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))', gap: isMobile ? '8px' : '24px' }}>
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

                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))', columnGap: isMobile ? '8px' : '20px', rowGap: isMobile ? '8px' : '32px' }}>
                                    {processedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} mobile={isMobile} />
                                    ))}
                                </div>

                                {isMobile && (
                                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '16px', textAlign: 'right' }}>
                                        {processedProducts.length} products
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Mobile Sort Bottom Sheet ── */}
            {showSortModal && isMobile && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowSortModal(false)} />
                    <div className="relative w-full bg-white rounded-t-2xl px-5 pt-5 pb-10 shadow-2xl">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-semibold" style={{ fontFamily: "'Mona Sans', sans-serif" }}>Sort By</h2>
                            <button onClick={() => setShowSortModal(false)} className="p-1 rounded-full hover:bg-gray-100">
                                <XMarkIcon className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        {["Most Popular", "Price (low to high)", "Price (high to low)", "New Arrivals"].map(option => (
                            <button
                                key={option}
                                onClick={() => { setSelectedSort(option); setShowSortModal(false); }}
                                className="w-full flex items-center gap-3 py-3.5 border-b border-gray-100 last:border-0"
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedSort === option ? 'border-black' : 'border-gray-300'}`}>
                                    {selectedSort === option && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                                </div>
                                <span className={`text-sm ${selectedSort === option ? 'font-semibold text-black' : 'text-gray-700'}`}>
                                    {option}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Mobile Filter Bottom Sheet ── */}
            {showFilterModal && isMobile && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilterModal(false)} />
                    <div className="relative w-full bg-white rounded-t-2xl px-5 pt-5 pb-10 shadow-2xl">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-semibold" style={{ fontFamily: "'Mona Sans', sans-serif" }}>Filter</h2>
                            <button onClick={() => setShowFilterModal(false)} className="p-1 rounded-full hover:bg-gray-100">
                                <XMarkIcon className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <h3 className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-3">Rent For</h3>
                        <div className="grid grid-cols-3 gap-2 mb-6">
                            {["1 month", "3 months", "6 months", "9 months", "18 months", "24 months"].map(duration => (
                                <button
                                    key={duration}
                                    onClick={() => setSelectedDuration(duration)}
                                    className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                                        selectedDuration === duration
                                            ? 'border-black text-black bg-gray-50'
                                            : 'border-gray-300 text-gray-600'
                                    }`}
                                >
                                    {duration}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowFilterModal(false)}
                            className="w-full py-3 rounded-full text-sm font-semibold text-gray-900"
                            style={{ background: 'hsla(44,100%,64%,1)' }}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
