"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaRegHeart, FaStar, FaBolt, FaTruck, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
        <section className="py-8 md:py-12 bg-white">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-6 md:mb-12">
                    <h2 className="text-4xl font-semibold font-manrope text-gray-900 tracking-tight">
                        {cmsConfig.title}
                    </h2>
                    <Link
                        href="/products"
                        className="hidden md:inline-flex items-center justify-center px-6 py-2 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-full transition-all duration-300 shadow-sm"
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
                                className="block h-full relative"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col hover:-translate-y-1 md:w-[285px] md:h-[391px] mx-auto overflow-hidden"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[254/220] rounded-xl bg-gray-50/50 overflow-hidden mb-4 group-hover:bg-gray-100/50 transition-colors flex items-center justify-center">

                                        {/* Badges */}
                                        <div className="absolute top-2 left-2 z-10 flex gap-1">
                                            <span className="bg-[#FF3B30] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                                                -20% off
                                            </span>
                                            {product.isNew && (
                                                <span className="bg-[#34C759] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                                                    New
                                                </span>
                                            )}
                                        </div>

                                        {/* Favorite Button */}
                                        <button className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center bg-white border border-gray-100 text-[#1D1D1F] rounded-full shadow-sm hover:text-[#FF3B30] transition-all">
                                            <FaRegHeart size={16} />
                                        </button>

                                        {/* Image Container with precise specs */}
                                        <div className="relative w-full h-[286px] overflow-hidden">
                                            {/* Precise Image Link/Wrapper */}
                                            <Link
                                                href={`/products/${product.id}`}
                                                className="absolute z-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
                                                style={{
                                                    width: '255.59px',
                                                    height: '196.42px',
                                                    top: '43.29px',
                                                    left: '15.71px'
                                                }}
                                            >
                                                {product.image && product.image !== "/images/placeholder.png" ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain mix-blend-multiply"
                                                    />
                                                ) : (
                                                    <div className="text-center text-gray-300">
                                                        <FaBolt className="mx-auto mb-2 text-4xl opacity-20" />
                                                        <span className="text-sm font-medium opacity-50">{product.category}</span>
                                                    </div>
                                                )}
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col gap-[8px] pt-[8px] pr-[12px] pb-[12px] pl-[12px] h-[105px] w-full relative">
                                        <h3 className="text-[16px] font-semibold font-manrope text-[#1D1D1F] leading-[24px] tracking-tight line-clamp-1 transition-colors duration-300 group-hover:text-[#FF3B30]">
                                            {product.name}
                                        </h3>

                                        {/* Row: Rating + Delivery */}
                                        <div className="flex items-center justify-between transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-1">
                                            <div className="flex items-center gap-0.5">
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} size={14} className={i < 4 ? "text-[#FF9F0A]" : "text-[#FF9F0A] opacity-50"} />
                                                    ))}
                                                </div>
                                                <span className="text-[11px] font-semibold text-[#86868B] ml-1">
                                                    {product.rating}({product.reviews})
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-[#86868B]">
                                                <FaTruck size={14} />
                                                <span className="text-[11px]">2-4 days</span>
                                                <FaInfoCircle size={10} className="opacity-50" />
                                            </div>
                                        </div>

                                        {/* Price / Buttons Container */}
                                        <div className="relative mt-auto h-[32px]">
                                            {/* Price Section */}
                                            <div className="flex items-baseline gap-1.5 flex-wrap transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2">
                                                <span className="text-[12px] text-[#86868B] font-medium">from</span>
                                                <span className="text-[16px] text-[#86868B] line-through font-medium opacity-50">₹{product.originalPrice}</span>
                                                <span className="text-[22px] font-bold text-[#FF3B30] leading-none">₹{product.rentPrice}</span>
                                                <span className="text-[13px] text-[#86868B] font-medium">/month</span>
                                            </div>

                                            {/* Hover Action Buttons */}
                                            <div className="absolute inset-0 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out z-20">
                                                <button 
                                                    className="flex-1 bg-white border border-gray-200 text-[#4A4A4A] py-1.5 rounded-xl text-[12px] font-semibold hover:bg-gray-50 transition-colors shadow-sm"
                                                    onClick={(e) => handleQuickView(e, product.id)}
                                                >
                                                    Quick View
                                                </button>
                                                <button 
                                                    className={`flex-1 ${addedStatus[product.id] ? 'bg-green-500' : 'bg-[#FF3B30]'} text-white py-1.5 rounded-xl text-[12px] font-semibold transition-all hover:bg-[#e0352b] hover:shadow-lg active:scale-95`}
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                >
                                                    {addedStatus[product.id] ? 'Added!' : 'Add to Cart'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )
                    })}
                </div>

                {/* Mobile View All Button */}
                <div className="mt-6 flex justify-center md:hidden">
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center px-8 py-2.5 bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold rounded-full transition-all duration-300 shadow-sm"
                    >
                        View All
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BestRentedProducts;
