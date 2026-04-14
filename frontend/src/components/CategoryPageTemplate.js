"use client";
import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProducts } from '@/services/productService';
import Sidebar from './Sidebar';
import ProductCard from './ProductCard';

// Derive which category pill to highlight based on the page title
const TITLE_KEYWORDS = [
    { keywords: ['apple', 'macbook', 'iphone', 'ipad', 'imac', 'mac'], slug: 'apple' },
    { keywords: ['it product', 'laptop', 'desktop', 'monitor', 'keyboard', 'mouse', 'server'], slug: 'it-products' },
    { keywords: ['av product', 'projector', 'speaker', 'display', 'television', 'tv', 'audio'], slug: 'av-products' },
    { keywords: ['office', 'printer', 'scanner', 'copier', 'shredder', 'telephone'], slug: 'office-equipment' },
    { keywords: ['dslr', 'camera', 'lens', 'mirrorless', 'gopro', 'drone'], slug: 'dslr' },
];

function getActiveSlug(title = '') {
    const lower = title.toLowerCase();
    for (const group of TITLE_KEYWORDS) {
        if (group.keywords.some((kw) => lower.includes(kw))) return group.slug;
    }
    return '';
}

const CATEGORY_PILLS = [
    { label: 'Apple Products', slug: 'apple' },
    { label: 'IT Products', slug: 'it-products' },
    { label: 'AV Products', slug: 'av-products' },
    { label: 'Office Equipment', slug: 'office-equipment' },
    { label: 'DSLR Cameras', slug: 'dslr' },
];

const CategoryPageTemplate = ({ productNamePrefix, productDescription, basePrice, image, title }) => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const itemsPerPage = 10;

    const [selectedDuration, setSelectedDuration] = useState("3 months");
    const [selectedSort, setSelectedSort] = useState("Most Popular");

    const activeCatSlug = getActiveSlug(title);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;
        const fetchAndFilterProducts = async () => {
            try {
                setLoading(true);
                const { products: fetchedProducts } = await getProducts({ keyword: productNamePrefix });

                if (fetchedProducts && fetchedProducts.length > 0) {
                    const mappedProducts = fetchedProducts.map(p => {
                        const baseOrigin = Math.round((p.rentalPrice || basePrice) * 1.5);
                        const baseRent = p.rentalPrice || basePrice;
                        return {
                            id: p._id,
                            name: p.name,
                            description: p.description || productDescription,
                            baseOriginalPrice: baseOrigin,
                            baseRentPrice: baseRent,
                            originalPrice: baseOrigin,
                            rentPrice: baseRent,
                            discount: "20% off",
                            image: (p.images && p.images.length > 0) ? p.images[0] : image,
                            isNew: p.condition === 'New',
                        };
                    });
                    setProducts(mappedProducts);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                console.error("Failed to fetch products for category", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAndFilterProducts();
    }, [isClient, productNamePrefix, productDescription, basePrice, image]);

    if (!isClient && typeof window === 'undefined') {
        return <div className="min-h-screen bg-white" />;
    }

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
        let results = [...products];
        const multiplier = getDurationMultiplier(selectedDuration);

        results = results.map(p => ({
            ...p,
            rentPrice: Math.round(p.baseRentPrice * multiplier),
            originalPrice: Math.round(p.baseOriginalPrice * multiplier),
            selectedDurationStr: selectedDuration
        }));

        if (selectedSort === "Price (high to low)") {
            results.sort((a, b) => b.rentPrice - a.rentPrice);
        } else if (selectedSort === "Price (low to high)") {
            results.sort((a, b) => a.rentPrice - b.rentPrice);
        } else if (selectedSort === "New Arrivals") {
            results.sort((a, b) => (b.isNew === a.isNew) ? 0 : b.isNew ? 1 : -1);
        }

        return results;
    }, [products, selectedDuration, selectedSort]);

    return (
        <div className="min-h-screen bg-white">

            {/* ── Figma Nav Bar: full-width grey-50, 62px, breadcrumb + category pills ── */}
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
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#64748B',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                    }}>
                        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-black transition-colors">
                            Homepage
                        </Link>
                        <span style={{ color: '#9CA3AF' }}>›</span>
                        <Link href="/categories" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-black transition-colors">
                            All Categories
                        </Link>
                        <span style={{ color: '#9CA3AF' }}>›</span>
                        {activeCatSlug && (
                            <>
                                <Link
                                    href={`/category/${activeCatSlug}`}
                                    style={{ color: 'inherit', textDecoration: 'none' }}
                                    className="hover:text-black transition-colors"
                                >
                                    {CATEGORY_PILLS.find(p => p.slug === activeCatSlug)?.label || activeCatSlug}
                                </Link>
                                <span style={{ color: '#9CA3AF' }}>›</span>
                            </>
                        )}
                        <span style={{ color: '#1D1D1F', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>
                            {title}
                        </span>
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
                            const isActive = activeCatSlug === cat.slug;
                            return (
                                <Link
                                    key={cat.slug}
                                    href={`/category/${cat.slug}`}
                                    style={{
                                        height: '38px',
                                        padding: '8px 16px',
                                        borderRadius: '68px',
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
                                        transition: 'all 0.15s',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    <span style={{
                                        fontFamily: "'Mona Sans', sans-serif",
                                        fontWeight: 600,
                                        fontSize: '14px',
                                        lineHeight: '20px',
                                        letterSpacing: '-0.01em',
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

            {/* Page body */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><FaArrowLeft size={24} className="text-gray-900" /></button>
                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                </div>
                <div className="flex gap-8">
                    <Sidebar
                        selectedDuration={selectedDuration}
                        setSelectedDuration={setSelectedDuration}
                        selectedSort={selectedSort}
                        setSelectedSort={setSelectedSort}
                    />
                    <main className="flex-1">
                        <div className="flex items-center justify-end mb-6"><span className="text-sm text-gray-500">{processedProducts.length} products</span></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {processedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        {processedProducts.length > itemsPerPage && (
                            <div className="flex justify-center items-center gap-2">
                                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"><FaChevronDown className="rotate-90" size={14} /></button>
                                {Array.from({ length: Math.ceil(processedProducts.length / itemsPerPage) }).map((_, i) => (
                                    <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1 ? "bg-black text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}>{i + 1}</button>
                                ))}
                                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(processedProducts.length / itemsPerPage)))} disabled={currentPage === Math.ceil(processedProducts.length / itemsPerPage)} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"><FaChevronDown className="-rotate-90" size={14} /></button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CategoryPageTemplate;
