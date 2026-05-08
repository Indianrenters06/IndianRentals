"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { FiPackage } from 'react-icons/fi';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
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

                // Try different name variants to handle naming mismatches between DB and component props
                // e.g. parentName='Apple' but DB might have 'Apple' or 'Apple Products'
                const namesToTry = [
                    parentName,
                    parentName?.replace(/\s*Products?\s*/i, '').trim(), // strip 'Products' suffix
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
            {/* Breadcrumbs Bar */}
            <div className="px-4 md:px-8 max-w-[1200px] mx-auto py-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <FaArrowLeft size={18} className="text-gray-800" />
                    </button>
                    <p className="text-xs text-gray-500">
                        <Link href="/" className="hover:underline">Home</Link>
                        {' › '}
                        <Link href={parentHref || '#'} className="hover:underline">{parentName}</Link>
                        {' › '}
                        <span className="text-gray-800">{subcategoryName}</span>
                    </p>
                </div>
            </div>

            {/* Subcategory Slider Navigation */}
            {subcategories.length > 0 && (
                <div className="bg-white relative z-10">
                    <div
                        className="relative mx-auto group/subslider flex items-center max-w-[1200px] w-full px-4 md:px-8"
                        style={{
                            height: '167px',
                            paddingTop: '20px',
                            gap: '24px'
                        }}
                    >
                        <div
                            id="subcat-slider-dynamic"
                            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full"
                            style={{
                                height: '147px',
                                gap: '16px',
                                msOverflowStyle: 'none',
                                scrollbarWidth: 'none',
                            }}
                        >
                            <style dangerouslySetInnerHTML={{ __html: `#subcat-slider-dynamic::-webkit-scrollbar { display: none; }` }} />
                            {subcategories.map((sub) => {
                                const isSubActive = subcategoryName === sub.name;
                                return (
                                    <Link
                                        key={sub.href}
                                        href={sub.href}
                                        className="group flex flex-col outline-none shrink-0 snap-start"
                                        style={{
                                            height: '147.09px',
                                            width: '157.71px',
                                            boxSizing: 'border-box',
                                            gap: '7px',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        <div
                                            className="rounded-lg flex items-center justify-center overflow-hidden transition-all duration-300"
                                            style={{
                                                height: '120.09px',
                                                width: '100%',
                                                boxSizing: 'border-box',
                                                border: isSubActive
                                                    ? '2px solid hsla(47, 100%, 76%, 1)'
                                                    : '2px solid hsla(0, 0%, 93%, 1)',
                                                backgroundColor: isSubActive ? 'hsla(43,100%,95%,1)' : 'hsla(0, 0%, 100%, 1)',
                                                boxShadow: '0px 1px 3px 0px hsla(0, 0%, 87%, 0.08), 0px 6px 6px 0px hsla(0, 0%, 87%, 0.07), 0px 13px 8px 0px hsla(0, 0%, 87%, 0.04), 0px 23px 9px 0px hsla(0, 0%, 87%, 0.01), 0px 36px 10px 0px hsla(0, 0%, 87%, 0)',
                                            }}
                                        >
                                            <div className={`w-[100px] h-[100px] relative transform transition-transform duration-500 ${isSubActive ? 'scale-105' : 'group-hover:scale-105'}`}>
                                                {sub.image ? (
                                                    <Image src={sub.image} alt={sub.name} fill className="object-contain" sizes="100px" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <FiPackage size={24} className="text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p style={{ fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '12px', lineHeight: '20px', letterSpacing: '-0.01em', color: '#1D1D1F' }} className="text-center transition-colors duration-300 w-full truncate">
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
                                className="absolute right-0 top-[50%] translate-y-[-50%] flex items-center justify-center group/caret transition-all z-10 hidden md:flex hover:brightness-95 active:scale-95"
                                style={{
                                    width: '26px',
                                    height: '40px',
                                    borderRadius: '9px',
                                    background: 'hsla(0, 0%, 93%, 1)',
                                    boxShadow: '0px 0px 1px 0px hsla(0, 0%, 58%, 0.31), 0px 0px 1px 0px hsla(0, 0%, 58%, 0.18), 0px 0px 1px 0px hsla(0, 0%, 58%, 0.05), 0px 0px 1px 0px hsla(0, 0%, 58%, 0.01)',
                                }}
                            >
                                <ChevronRightIcon className="w-4 h-4 text-gray-600 transition-colors" strokeWidth={2} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div
                className="mx-auto flex flex-col max-w-[1200px] w-full px-4 md:px-8"
                style={{
                    paddingTop: '40px',
                    paddingBottom: '40px',
                    gap: '30px',
                    minHeight: '2091px'
                }}
            >
                <h1
                    style={{
                        fontFamily: "'Mona Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: '44px',
                        lineHeight: '58px',
                        letterSpacing: '-0.01em',
                        color: 'hsla(0, 0%, 12%, 1)',
                        maxWidth: '589px',
                        opacity: 1,
                    }}
                >
                    {subcategoryName}
                </h1>

                <div className="flex w-full" style={{ gap: '30px' }}>
                    <Sidebar
                        selectedDuration={selectedDuration}
                        setSelectedDuration={setSelectedDuration}
                        selectedSort={selectedSort}
                        setSelectedSort={setSelectedSort}
                    />

                <div className="flex-1">
                    {/* Loading */}
                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} className="animate-pulse">
                                    <div className="bg-gray-100 rounded-2xl aspect-4/3 mb-2" />
                                    <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="text-center py-16">
                            <p className="text-gray-500 text-sm">{error}</p>
                            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800">Retry</button>
                        </div>
                    )}

                    {/* Empty or Results */}
                    {!loading && !error && processedProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <FiPackage size={48} className="mx-auto text-gray-300 mb-4" />
                            <h2 className="text-lg font-semibold text-gray-700">No products available</h2>
                        </div>
                    ) : (
                        !loading && !error && (
                            <>
                                <p className="text-xs text-gray-400 mb-6 font-sans uppercase tracking-widest">{processedProducts.length} PRODUCTS FOUND</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[30px]">
                                    {processedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            </>
                        )
                    )}
                </div>
                </div>
            </div>
        </div>
    );
}
