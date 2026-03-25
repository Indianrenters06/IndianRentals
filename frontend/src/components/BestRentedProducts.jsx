"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaRegHeart, FaStar, FaBolt, FaTruck, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";

import { API } from "@/services/apiConfig";

// Optional: you can still use the service, but since we need multiple products by ID we'll implement it manually or use a simple fetch call.
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";

const BestRentedProducts = ({ type = "bestRented", defaultTitle = "Curated Products" }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [addedStatus, setAddedStatus] = useState({});
    const [cmsConfig, setCmsConfig] = useState({
        enabled: true,
        title: defaultTitle,
        productIds: []
    });
    const [loading, setLoading] = useState(true);
    
    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.rentPrice,
            monthlyRent: product.rentPrice,
            quantity: 1,
            duration: 1,
            refundableAmount: 0,
            description: product.name
        }));
        setAddedStatus(prev => ({ ...prev, [product.id]: true }));
        setTimeout(() => setAddedStatus(prev => ({ ...prev, [product.id]: false })), 2000);
    };

    const handleQuickView = (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/products/${productId}`);
    };

    useEffect(() => {
        const fetchCMSAndProducts = async () => {
            try {
                // 1. Fetch CMS configs
                const cmsRes = await fetch(`${API}/api/cms/homepage`);
                let isEnabled = true;
                let finalTitle = defaultTitle;
                let targetIds = [];

                if (cmsRes.ok) {
                    const cmsData = await cmsRes.json();
                    if (type === "bestRented") {
                        isEnabled = cmsData.bestRentedEnabled !== false;
                        finalTitle = cmsData.bestRentedTitle || "Best Rented Products";
                        targetIds = cmsData.bestRentedProductIds || [];
                    } else if (type === "newLaunches") {
                        isEnabled = cmsData.newLaunchEnabled !== false;
                        finalTitle = cmsData.newLaunchTitle || "New Launches This Week";
                        targetIds = cmsData.newLaunchProductIds || [];
                    }
                }

                setCmsConfig({ enabled: isEnabled, title: finalTitle, productIds: targetIds });

                if (!isEnabled) {
                    setLoading(false);
                    return;
                }

                // 2. Fetch products
                let fetchedProducts = [];
                if (targetIds.length > 0) {
                    // Fetch specific products concurrently
                    const prodPromises = targetIds.map(id => fetch(`${API}/api/products/${id}`).then(r => r.ok ? r.json() : null));
                    const responses = await Promise.all(prodPromises);
                    fetchedProducts = responses.filter(p => p !== null);
                } else {
                    // Fallback to recent generic products
                    const fallBackRes = await fetch(`${API}/api/products?limit=4`);
                    if (fallBackRes.ok) {
                        const fallbackData = await fallBackRes.json();
                        fetchedProducts = fallbackData.products || [];
                    }
                }

                // 3. Map to UI
                const mappedProducts = fetchedProducts.map(p => ({
                    id: p._id,
                    name: p.name,
                    category: p.category,
                    image: (p.images && p.images.length > 0) ? p.images[0] : "/images/placeholder.png",
                    rating: p.rating || 4.5,
                    reviews: p.numReviews || 12,
                    originalPrice: Math.round((p.rentalPrice || 0) * 1.5),
                    rentPrice: p.rentalPrice,
                    discount: p.condition === 'New' ? "NEW" : "HOT",
                    isNew: p.condition === 'New',
                    tags: ["Quality tested", "Deep Cleaned"],
                    statusTags: ["Like New", "In Stock"],
                }));
                // Only take first 4 to avoid layout breaking
                setProducts(mappedProducts.slice(0, 4));
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch products or cms", error);
                setLoading(false);
            }
        };
        fetchCMSAndProducts();
    }, [type, defaultTitle]);

    if (loading) return <div className="h-48 w-full bg-slate-50 animate-pulse my-4" />;
    if (!cmsConfig.enabled) return null;

    return (
        <section className="py-12 md:py-16 bg-white">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-6 md:mb-12">
                    <h2 className="text-4xl font-semibold font-manrope text-gray-900 tracking-tight">
                        {cmsConfig.title}
                    </h2>
                    <Link
                        href="/products"
                        className="hidden md:inline-flex btn-yellow-primary !h-auto !py-2 !px-6 !rounded-full shadow-sm"
                    >
                        View All
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                    {products.map((product, index) => {
                        return (
                            <div
                                key={product.id || index}
                                className="relative"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group bg-white rounded-2xl flex flex-col overflow-hidden relative transition-all duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] hover:-translate-y-1 md:w-[285px] md:h-[391px] mx-auto"
                                    style={{ border: "1px solid hsla(0, 0%, 89%, 1)" }}
                                >
                                    {/* Image Section — full-bleed top */}
                                    <div
                                        className="relative rounded-2xl bg-[#F7F7F7] group-hover:bg-[#F0F0F0] transition-colors duration-500 flex items-center justify-center overflow-hidden flex-shrink-0"
                                        style={{ width: "285px", height: "282px", borderRight: "1px solid hsla(0, 0%, 89%, 1)", borderBottom: "1px solid hsla(0, 0%, 89%, 1)", borderLeft: "1px solid hsla(0, 0%, 89%, 1)" }}
                                    >
                                        {/* Badges */}
                                        <div className="absolute top-3 left-3 z-20 flex gap-1.5">
                                            <span className="bg-[#FF3B30] text-white text-[11px] font-bold px-2 py-[3px] rounded-[4px] shadow-sm leading-none">
                                                -20% off
                                            </span>
                                            {product.isNew && (
                                                <span className="bg-[#34C759] text-white text-[11px] font-bold px-2 py-[3px] rounded-[4px] shadow-sm leading-none">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        {/* Heart */}
                                        <button
                                            className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-gray-400 rounded-full shadow-sm hover:text-[#FF3B30] hover:scale-110 transition-all duration-300"
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                        >
                                            <FaRegHeart size={14} />
                                        </button>
                                        {/* Product Image */}
                                        <Link href={`/products/${product.id}`} className="flex items-center justify-center w-full h-full">
                                            <div className="w-[240px] h-[220px] relative transition-transform duration-700 ease-out group-hover:scale-105">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain mix-blend-multiply"
                                                />
                                            </div>
                                        </Link>
                                    </div>

                                    {/* Text Section */}
                                    <Link
                                        href={`/products/${product.id}`}
                                        className="flex flex-col"
                                        style={{ width: "285px", height: "105px", gap: "8px", paddingTop: "8px", paddingRight: "12px", paddingBottom: "12px", paddingLeft: "12px" }}
                                    >
                                        <h3
                                            className="font-manrope text-[#1D1D1F] line-clamp-1 group-hover:text-[#FF3B30] transition-colors duration-300"
                                            style={{ fontSize: "16px", fontWeight: 600, lineHeight: "23px", letterSpacing: "-0.4px" }}
                                        >
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center justify-between transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-1">
                                            <div className="flex items-center gap-0.5">
                                                <div className="flex text-[#FF9F0A]">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <FaStar key={s} size={12} className={s <= Math.round(product.rating || 4) ? "" : "opacity-20"} />
                                                    ))}
                                                </div>
                                                <span className="text-[12px] font-semibold text-[#86868B] ml-1">
                                                    {product.rating || "4.5"}({product.reviews || 0})
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[#86868B]">
                                                <FaTruck size={12} />
                                                <span className="text-[11px] font-medium">2-4 days</span>
                                                <FaInfoCircle size={9} className="opacity-40" />
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <div className="flex items-baseline gap-1.5 transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-2">
                                                <span className="text-[12px] text-[#86868B] font-medium">from</span>
                                                <span className="text-[14px] text-[#86868B] line-through font-medium opacity-60">₹{product.originalPrice}</span>
                                                <span className="text-[20px] font-extrabold text-[#FF3B30] leading-none">₹{product.rentPrice}</span>
                                                <span className="text-[12px] text-[#86868B] font-medium">/month</span>
                                            </div>
                                            <div className="absolute inset-x-0 bottom-0 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out z-30">
                                                <button
                                                    className="flex-1 bg-white border border-gray-200 text-[#4A4A4A] rounded-[10px] text-[12px] font-bold hover:bg-gray-50 transition-colors shadow-sm h-[34px] active:scale-95"
                                                    onClick={(e) => handleQuickView(e, product.id)}
                                                >
                                                    Quick View
                                                </button>
                                                <button
                                                    className={`flex-1 ${addedStatus[product.id] ? 'bg-green-500 text-white' : 'bg-[#FFCF46] text-black'} rounded-[10px] text-[12px] font-bold transition-all hover:shadow-lg active:scale-95 h-[34px]`}
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                >
                                                    {addedStatus[product.id] ? 'Added!' : 'Add to Cart'}
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            </div>
                        )
                    })}
                </div>

                {/* Mobile View All Button */}
                <div className="mt-6 flex justify-center md:hidden">
                    <Link
                        href="/products"
                        className="btn-yellow-primary !h-auto !py-2.5 !px-8 !rounded-full shadow-sm"
                    >
                        View All
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BestRentedProducts;
