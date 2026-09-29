"use client";
import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { getProducts } from '@/services/productService';
import { getSubcategoriesByParentName } from '@/services/categoryService';
import Sidebar from './Sidebar';
import ProductCard from './ProductCard';
import CategoryNavBar, { CATEGORY_PILLS } from './CategoryNavBar';
import CategoryFilters from './CategoryFilters';
import SubcategoryStrip from './SubcategoryStrip';
import styles from './CategoryLayout.module.css';

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

const CategoryPageTemplate =({ productNamePrefix, productDescription, basePrice, image, title }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const itemsPerPage = 10;

    const [selectedDuration, setSelectedDuration] = useState("3 months");
    const [selectedSort, setSelectedSort] = useState("Most Popular");
    const [dealsOnly, setDealsOnly] = useState(false);
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
                            rating: p.rating,
                            reviews: p.numReviews ?? p.reviewCount ?? 0,
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

        if (dealsOnly) results = results.filter(p => Boolean(p.discount));

        if (selectedSort === "Price (high to low)") {
            results.sort((a, b) => b.rentPrice - a.rentPrice);
        } else if (selectedSort === "Price (low to high)") {
            results.sort((a, b) => a.rentPrice - b.rentPrice);
        } else if (selectedSort === "New Arrivals") {
            results.sort((a, b) => (b.isNew === a.isNew) ? 0 : b.isNew ? 1 : -1);
        }

        return results;
    }, [products, selectedDuration, selectedSort, dealsOnly]);

    if (!isClient) return <div className="min-h-screen bg-white" />;

    return (
        <div className="min-h-screen bg-white">

            {/* ── Breadcrumb + category pills ── */}
            <CategoryNavBar
                parentSlug={activeCatSlug}
                parentLabel={CATEGORY_PILLS.find((p) => p.slug === activeCatSlug)?.label}
                currentLabel={title}
            />

            <SubcategoryStrip id="subcat-slider-template" subcategories={subcategories} activeName={title} />

            <div className={styles.listingBody}>
                <h1 className={styles.listingTitle}>{title}</h1>

                <div className="flex w-full relative" style={{ gap: '30px' }}>
                    <div className="hidden lg:block">
                        <Sidebar
                            selectedDuration={selectedDuration}
                            setSelectedDuration={setSelectedDuration}
                            selectedSort={selectedSort}
                            setSelectedSort={setSelectedSort}
                            dealsOnly={dealsOnly}
                            setDealsOnly={setDealsOnly}
                        />
                    </div>
                    <div className={styles.listingContent}>
                        <CategoryFilters count={processedProducts.length}
                            selectedDuration={selectedDuration} setSelectedDuration={setSelectedDuration}
                            selectedSort={selectedSort} setSelectedSort={setSelectedSort}
                            dealsOnly={dealsOnly} setDealsOnly={setDealsOnly} />

                    <div className={styles.productGrid}>
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
