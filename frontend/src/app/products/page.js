"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
import { API } from "@/services/apiConfig";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDuration, setSelectedDuration] = useState("3 months");
    const [selectedSort, setSelectedSort] = useState("Most Popular");
    const [cmsConfig, setCmsConfig] = useState({ title: "Most Rented Products" });
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        const fetchCMSAndProducts = async () => {
            try {
                // Fetch CMS
                const cmsRes = await fetch(`${API}/api/cms/homepage`).catch(() => null);
                let targetIds = [];
                let finalTitle = "Most Rented Products";
                if (cmsRes && cmsRes.ok) {
                    const cmsData = await cmsRes.json();
                    targetIds = cmsData.bestRentedProductIds || [];
                    if (cmsData.bestRentedTitle) finalTitle = cmsData.bestRentedTitle;
                }
                setCmsConfig({ title: finalTitle });

                // Fetch Products
                let fetchedProducts = [];
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
                        isNew: p.condition === 'New' || p.isNew,
                        rating: p.rating || 4.5,
                        reviewCount: p.numReviews || 12,
                    };
                });

                // For demo presentation parity with the Figma screenshot context (3x3 grid = 9 cards), 
                // duplicate products if we don't naturally have enough
                let items = [...mappedProducts];
                if (items.length > 0 && items.length < 9) {
                    while (items.length < 9) {
                        items = [...items, ...mappedProducts];
                    }
                }

                setProducts(items.slice(0, 9));
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch products", error);
                setLoading(false);
            }
        };
        fetchCMSAndProducts();
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
        }
        return results;
    }, [products, selectedDuration, selectedSort]);

    return (
        <div className="w-full bg-white min-h-screen">
            {/* Outer Container */}
            <div style={{ width: '100%', background: 'transparent' }}>
                {/* Inner Container */}
                <div
                    className="mx-auto w-full flex flex-col px-4 md:px-8"
                    style={{
                        maxWidth: '1200px',
                        paddingTop: '40px',
                        paddingBottom: '40px',
                        gap: '30px',
                        opacity: 1,
                        background: 'hsla(0, 0%, 100%, 1)',
                    }}
                >
                    <div className="flex flex-col max-w-[900px]">
                        <h1
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: 600,
                                letterSpacing: '-0.01em',
                                color: 'hsla(0, 0%, 12%, 1)',
                                fontSize: '44px',
                                lineHeight: '58px',
                            }}
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
                            Lorem ipsum dolor sit amet consectetur. Vel libero cras laoreet ut dignissim eget. Scelerisque mauris pharetra tristique cras sit malesuada. Egestas pulvinar interdum sapien et. Consequat neque at donec turpis leo. Quis at.
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
                            />
                        </div>

                        {/* Products Grid */}
                        <div className="flex-1 w-full min-w-0">
                            {loading ? (
                                <div className="w-full flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
                                </div>
                            ) : (
                                <div className={`grid gap-[30px] ${isMobile ? 'grid-cols-2 gap-[8px]' : 'grid-cols-2 lg:grid-cols-3'}`}>
                                    {processedProducts.map((product, idx) => (
                                        <ProductCard key={`${product.id}-${idx}`} product={product} mobile={isMobile} />
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
