"use client";
import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaArrowLeft } from 'react-icons/fa';
import { ArrowLeft } from '@phosphor-icons/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/services/productService';
import { getSubcategoriesByParentName } from '@/services/categoryService';
import { FiPackage } from 'react-icons/fi';
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
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const itemsPerPage = 10;

    const [selectedDuration, setSelectedDuration] = useState("3 months");
    const [selectedSort, setSelectedSort] = useState("Most Popular");
    const [isMobile, setIsMobile] = useState(true);

    const activeCatSlug = getActiveSlug(title);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

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

    useEffect(() => {
        if (!isClient || !activeCatSlug) return;
        const fetchSubs = async () => {
            try {
                // Find the parent name from pills, default to capitalizing slug
                const parentNav = CATEGORY_PILLS.find(p => p.slug === activeCatSlug);
                const parentNameStr = parentNav ? parentNav.label : activeCatSlug;

                // Usually the DB stores subcategories associated with the explicit category name (e.g. 'Apple Products')
                // Depending on the DB state, it might just be 'Apple'. Try 'Apple Products' or 'Apple'.
                const parentSearch = parentNameStr === 'Apple' ? 'Apple Products' : (parentNameStr.includes('Products') ? parentNameStr : `${parentNameStr} Products`);
                const subs = await getSubcategoriesByParentName(parentSearch) || [];

                // We fallback to a hardcoded list if DB is empty to match the main category page UI
                if (subs.length === 0 && activeCatSlug === 'apple') {
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
                    ].map(f => ({ ...f, href: `/category/${activeCatSlug}/${f.slug}` })));
                } else {
                    setSubcategories(subs.map(s => ({
                        _id: s._id,
                        name: s.name,
                        image: s.image || null,
                        slug: s.slug || s.name.toLowerCase().replace(/\s+/g, '-'),
                        href: `/category/${activeCatSlug}/${s.slug || s.name.toLowerCase().replace(/\s+/g, '-')}?subId=${s._id}`,
                    })));
                }
            } catch (err) {
                console.error('Error fetching subcategories:', err);
            }
        };
        fetchSubs();
    }, [isClient, activeCatSlug]);

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

            {/* ── Mobile: pills-only in 3+2 grid (hidden on lg+) ── */}
            <div className="block lg:hidden" style={{ width: '100%', background: 'hsla(0, 0%, 96%, 1)', padding: '10px 14px', borderBottom: '1px solid hsla(0, 0%, 93%, 1)', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                    {CATEGORY_PILLS.map((cat) => {
                        const isActive = activeCatSlug === cat.slug;
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

            {/* ── Desktop: Figma Nav Bar — breadcrumb + pills in one row (hidden below lg) ── */}
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
            </div>

            {/* Subcategory Slider Block */}
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
                            id="subcat-slider-template"
                            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full"
                            style={{
                                height: '147px',
                                gap: '16px',
                                msOverflowStyle: 'none',
                                scrollbarWidth: 'none',
                            }}
                        >
                            <style dangerouslySetInnerHTML={{
                                __html: `
                                #subcat-slider-template::-webkit-scrollbar { display: none; }
                            `}} />
                            {subcategories.map((sub) => {
                                const isSubActive = title === sub.name;
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
                                                    <Image
                                                        src={sub.image}
                                                        alt={sub.name}
                                                        fill
                                                        className="object-contain"
                                                        sizes="100px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <FiPackage size={24} className="text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p
                                            style={{
                                                fontFamily: "'Mona Sans', sans-serif",
                                                fontWeight: 600,
                                                fontSize: '12px',
                                                lineHeight: '20px',
                                                letterSpacing: '-0.01em',
                                                color: '#1D1D1F',
                                            }}
                                            className="text-center transition-colors duration-300 w-full truncate"
                                        >
                                            {sub.name}
                                        </p>
                                    </Link>
                                );
                            })}
                        </div>

                        {subcategories.length > 7 && (
                            <button
                                onClick={() => {
                                    const slider = document.getElementById('subcat-slider-template');
                                    if (slider) slider.scrollBy({ left: 300, behavior: 'smooth' });
                                }}
                                className="absolute right-0 top-[50%] translate-y-[-50%] flex items-center justify-center transition-all z-10 hidden md:flex hover:brightness-95 active:scale-95"
                                style={{
                                    width: '26px',
                                    height: '40px',
                                    borderRadius: '9px',
                                    background: 'hsla(0, 0%, 93%, 1)',
                                    boxShadow: '0px 0px 1px 0px hsla(0, 0%, 58%, 0.31), 0px 0px 1px 0px hsla(0, 0%, 58%, 0.18), 0px 0px 1px 0px hsla(0, 0%, 58%, 0.05), 0px 0px 1px 0px hsla(0, 0%, 58%, 0.01)',
                                }}
                            >
                                <ChevronRightIcon className="w-4 h-4 text-gray-600" strokeWidth={2} />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Page body */}
            <div
                className="mx-auto flex flex-col max-w-[1200px] w-full px-4 md:px-8"
                style={{
                    paddingTop: '40px',
                    paddingBottom: '40px',
                    gap: '30px',
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
                        {title}
                    </h1>
                </div>

                {/* Desktop title */}
                <h1
                    className="hidden lg:block"
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
                    {title}
                </h1>

                <div className="flex w-full relative" style={{ gap: '30px' }}>
                    <div className="hidden lg:block">
                        <Sidebar
                            selectedDuration={selectedDuration}
                            setSelectedDuration={setSelectedDuration}
                            selectedSort={selectedSort}
                            setSelectedSort={setSelectedSort}
                        />
                    </div>
                    <div className="flex-1 mt-0" style={{ minWidth: 0 }}>

                    <div className={`grid ${isMobile ? 'grid-cols-2 gap-[8px]' : 'grid-cols-2 lg:grid-cols-3 gap-[30px]'}`}>
                        {processedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
                            <ProductCard key={product.id} product={product} mobile={isMobile} />
                        ))}
                    </div>
                    {processedProducts.length > itemsPerPage && (
                        <div className="flex justify-center items-center gap-2 mt-10">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"><FaChevronDown className="rotate-90" size={14} /></button>
                            {Array.from({ length: Math.ceil(processedProducts.length / itemsPerPage) }).map((_, i) => (
                                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1 ? "bg-black text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}>{i + 1}</button>
                            ))}
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(processedProducts.length / itemsPerPage)))} disabled={currentPage === Math.ceil(processedProducts.length / itemsPerPage)} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"><FaChevronDown className="-rotate-90" size={14} /></button>
                        </div>
                    )}
                </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPageTemplate;
