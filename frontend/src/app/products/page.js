"use client";
import { cmsUrl } from '@/lib/cmsPreview';
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Sidebar from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
import { API } from "@/services/apiConfig";
import { availableFirst } from "@/lib/productAvailability";

export const dynamic = "force-dynamic";

function ProductsPageContent() {
    const searchParams = useSearchParams();
    const keyword = (searchParams.get("keyword") || "").trim();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDuration, setSelectedDuration] = useState("3 months");
    const [selectedSort, setSelectedSort] = useState("Most Popular");
    const [dealsOnly, setDealsOnly] = useState(false);
    const [cmsConfig, setCmsConfig] = useState({ title: "Most Rented Products" });

    useEffect(() => {
        const fetchCMSAndProducts = async () => {
            setLoading(true);
            try {
                // Fetch Products
                let fetchedProducts = [];

                if (keyword) {
                    // Search mode: query the API by keyword, ignore the best-rented CMS list
                    setCmsConfig({ title: `Search results for "${keyword}"` });
                    const searchRes = await fetch(`${API}/api/products?keyword=${encodeURIComponent(keyword)}&limit=50`).catch(() => null);
                    if (searchRes && searchRes.ok) {
                        const searchData = await searchRes.json();
                        fetchedProducts = searchData.products || [];
                    }
                } else {
                    // Default mode: show the CMS-configured "Most Rented Products"
                    const cmsRes = await fetch(cmsUrl('homepage')).catch(() => null);
                    let targetIds = [];
                    let finalTitle = "Most Rented Products";
                    if (cmsRes && cmsRes.ok) {
                        const cmsData = await cmsRes.json();
                        targetIds = cmsData.bestRentedProductIds || [];
                        if (cmsData.bestRentedTitle) finalTitle = cmsData.bestRentedTitle;
                    }
                    setCmsConfig({ title: finalTitle });

                    if (targetIds.length > 0) {
                        const prodPromises = targetIds.map(id => fetch(`${API}/api/products/${id}`).then(r => r.ok ? r.json() : null));
                        const responses = await Promise.all(prodPromises);
                        fetchedProducts = responses.filter(p => p !== null);
                    } else {
                        const fallBackRes = await fetch(`${API}/api/products?limit=20`).catch(() => null);
                        if (fallBackRes && fallBackRes.ok) {
                            const fallbackData = await fallBackRes.json();
                            fetchedProducts = fallbackData.products || [];
                        }
                    }
                }

                const mappedProducts = fetchedProducts.map(p => {
                    const baseOrigin = Math.round((p.rentalPrice || 5000) * 1.5);
                    const baseRent = p.rentalPrice || 5000;
                    return {
                        id: p._id || p.id,
                        name: p.name,
                        description: p.description,
                        baseOriginalPrice: baseOrigin,
                        baseRentPrice: baseRent,
                        originalPrice: baseOrigin,
                        rentPrice: baseRent,
                        discount: "-20% off",
                        image: (p.images && p.images.length > 0) ? p.images[0] : (p.image || "/images/placeholder.png"),
                        stock: p.stock,
                        isNew: p.condition === 'New' || p.isNew,
                        rating: p.rating || 4.5,
                        reviewCount: p.numReviews || 12,
                    };
                });

                let items = [...mappedProducts];
                if (keyword) {
                    // Search mode: show all real matches, no duplication or capping
                    setProducts(items);
                } else {
                    // Default mode: for demo presentation parity with the Figma screenshot
                    // context (3x3 grid = 9 cards), duplicate products if we don't have enough
                    if (items.length > 0 && items.length < 9) {
                        while (items.length < 9) {
                            items = [...items, ...mappedProducts];
                        }
                    }
                    setProducts(availableFirst(items).slice(0, 9));
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch products", error);
                setLoading(false);
            }
        };
        fetchCMSAndProducts();
    }, [keyword]);

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
            results.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
        }
        return availableFirst(results);
    }, [products, selectedDuration, selectedSort, dealsOnly]);

    return (
        <div className="w-full bg-white min-h-screen">
            <div className="w-full bg-[#f6f6f6]">
                <nav aria-label="Breadcrumb" className="mx-auto flex min-h-12 w-full max-w-[1200px] items-center gap-2 px-4 text-xs leading-4 tracking-[-0.025em] md:px-8 lg:min-h-[62px]">
                    <Link href="/" className="shrink-0 text-[#545454] transition-colors hover:text-[#141414] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]">Homepage</Link>
                    <ChevronRightIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-[#777]" />
                    <span aria-current="page" className="min-w-0 truncate font-semibold text-[#1f1f1f]">{cmsConfig.title}</span>
                </nav>
            </div>
            {/* Outer Container */}
            <div style={{ width: '100%', background: 'transparent' }}>
                {/* Inner Container */}
                <div
                    className="mx-auto w-full flex flex-col px-4 md:px-8"
                    style={{
                        maxWidth: '1200px',
                        paddingTop: '24px',
                        paddingBottom: '40px',
                        gap: '30px',
                        opacity: 1,
                        background: 'hsla(0, 0%, 100%, 1)',
                    }}
                >
                    <div className="flex flex-col gap-2 max-w-[900px]">
                        <h1
                            className="text-balance text-[30px] font-semibold leading-[1.15] tracking-[-0.035em] text-[#1f1f1f] sm:text-[36px] md:text-[40px] lg:text-[44px]"
                        >
                            {cmsConfig.title}
                        </h1>
                        <p
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontSize: '14px',
                                lineHeight: '24px',
                                color: 'hsla(0, 0%, 46%, 1)',
                            }}
                        >
                            {keyword ? 'Browse the products that match your search.' : 'Explore rental products and compare the options that fit your plans.'}
                        </p>
                    </div>

                    <div className="flex w-full gap-[30px] items-start relative">
                        {/* Sidebar */}
                        <div className="hidden lg:block shrink-0">
                            <Sidebar
                                selectedDuration={selectedDuration}
                                setSelectedDuration={setSelectedDuration}
                                selectedSort={selectedSort}
                                setSelectedSort={setSelectedSort}
                                dealsOnly={dealsOnly}
                                setDealsOnly={setDealsOnly}
                            />
                        </div>

                        {/* Products Grid */}
                        <div className="flex-1 w-full min-w-0">
                            {loading ? (
                                <div className="w-full flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
                                </div>
                            ) : processedProducts.length === 0 ? (
                                <div className="w-full flex flex-col items-center justify-center h-64 text-center">
                                    <p className="text-lg font-semibold text-gray-800">No products found</p>
                                    <p className="text-sm text-gray-500 mt-1">Try a different search term.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-x-3 gap-y-4 md:gap-x-4 md:gap-y-5 lg:grid-cols-3 lg:gap-[30px]">
                                    {processedProducts.map((product, idx) => (
                                        <ProductCard key={`${product.id}-${idx}`} product={product} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="w-full flex items-center justify-center h-screen bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
            </div>
        }>
            <ProductsPageContent />
        </Suspense>
    );
}
