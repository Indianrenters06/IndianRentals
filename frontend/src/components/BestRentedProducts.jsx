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
    const [isDesktop, setIsDesktop] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const checkRes = () => setIsDesktop(window.innerWidth >= 1024);
        checkRes();
        window.addEventListener('resize', checkRes);
        return () => window.removeEventListener('resize', checkRes);
    }, []);
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
        <section 
            className="overflow-hidden py-12 md:py-16"
            style={{ 
                minHeight: '449px',
                background: type === 'newLaunches' 
                    ? 'linear-gradient(180deg, #FFFFFF 0%, #EDF9FF 100%)' 
                    : '#FFFFFF'
            }}
        >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

                {/* Header */}
                <div 
                    className="flex flex-col mb-6 md:mb-12 max-w-[350px] md:max-w-none w-full mx-auto md:mx-0"
                    style={{ 
                        height: 'auto', 
                        minHeight: '31px' 
                    }}
                >

                    <div className="flex items-center justify-between">
                    <h2 
                        className="font-manrope tracking-tight whitespace-nowrap"
                        style={{ 
                            width: 'var(--title-width, 289px)', 
                            height: '31px',
                            fontSize: 'var(--title-size, 24px)', 
                            lineHeight: '31px',
                            fontWeight: 600,
                            color: 'hsla(0, 0%, 20%, 1)',
                            letterSpacing: '-0.02em', 
                        }}
                    >
                        {cmsConfig.title}
                        <style jsx>{`
                            h2 { --title-width: 289px; --title-size: 24px; }
                            @media (min-width: 768px) {
                                h2 { --title-width: auto; --title-size: 36px; line-height: 48px; }
                            }
                        `}</style>
                    </h2>
                    <Link
                        href="/products"
                        className="hidden md:inline-flex items-center justify-center gap-[2px] text-gray-900 group hover:brightness-105 transition-all"
                        style={{
                            width: '97px',
                            height: '35px',
                            paddingTop: '6px',
                            paddingBottom: '6px',
                            paddingLeft: '20px',
                            paddingRight: '20px',
                            borderRadius: '9999px',
                            background: 'hsla(44, 100%, 64%, 1)',
                            borderBottom: '1px solid rgba(0,0,0,0.10)',
                            fontFamily: 'Manrope, sans-serif',
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '23px',
                            letterSpacing: '-0.01em',
                        }}
                    >
                        View All
                    </Link>
                </div>
            </div>

                {/* Grid */}
                <div 
                    className="grid grid-cols-2 lg:grid-cols-4 gap-[10px] md:gap-8"
                    style={{ height: 'auto', minHeight: '300px' }}
                >
                    {products.map((product, index) => {
                        return (
                            <div
                                key={product.id || index}
                                className="relative group"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ height: isDesktop ? 410 : 320 }}
                                    className="bg-white rounded-[24px] flex flex-col overflow-hidden relative transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] mx-auto w-[170px] md:w-[285px]"
                                    style={{ 
                                        height: isDesktop ? '350px' : '250px',
                                        border: "1px solid hsla(0, 0%, 89%, 1)",
                                        boxShadow: "0px 1px 2px 0px hsla(0, 0%, 0%, 0.05)"
                                    }}
                                >
                                    {/* Image Section — full-bleed top */}
                                    <div
                                        className="relative group-hover:bg-[#F0F0F0] transition-colors duration-500 flex items-center justify-center overflow-hidden flex-shrink-0 h-[140px] md:h-[240px] rounded-lg md:rounded-t-2xl"
                                        style={{ 
                                            background: 'hsla(0, 0%, 96%, 1)',
                                            borderWidth: '0px 1px 1px 1px',
                                            borderStyle: 'solid',
                                            borderColor: 'hsla(0, 0%, 93%, 1)',
                                            boxShadow: `
                                                0px 4px 8px 0px hsla(0, 0%, 87%, 0.1),
                                                0px 15px 15px 0px hsla(0, 0%, 87%, 0.09),
                                                0px 33px 20px 0px hsla(0, 0%, 87%, 0.05),
                                                0px 59px 23px 0px hsla(0, 0%, 87%, 0.01),
                                                0px 91px 26px 0px hsla(0, 0%, 87%, 0)
                                            `
                                        }}
                                    >
                                        {/* Badges */}
                                        <div className="absolute top-2 left-2 z-20 flex gap-1">
                                            <span className="bg-[#FF3B30] text-white text-[9px] md:text-[11px] font-bold px-1.5 py-[2px] rounded-[4px] shadow-sm leading-none">
                                                -20% off
                                            </span>
                                        </div>
                                        
                                        {/* Product Image */}
                                        <Link href={`/products/${product.id}`} className="flex items-center justify-center w-full h-full p-4">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105"
                                            />
                                        </Link>
                                    </div>
                                    {/* Text Section */}
                                    <div
                                        className="flex flex-col md:flex-1 relative overflow-hidden font-manrope"
                                        style={{ 
                                            width: isDesktop ? '285px' : '170px',
                                            height: 'auto',
                                            padding: isDesktop ? '8px 12px 12px 12px' : '2px 8px 6px 8px',
                                            gap: isDesktop ? '4px' : '1px'
                                        }}
                                    >
                                        <Link href={`/products/${product.id}`}>
                                            <h3
                                                className="text-[#1D1D1F] line-clamp-1 transition-colors duration-300 text-[13px] md:text-[18px] font-bold leading-tight"
                                            >
                                                {product.name}
                                            </h3>
                                        </Link>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <div className="flex text-[#FF9F0A]">
                                                    {isDesktop ? (
                                                        [1, 2, 3, 4, 5].map((s) => (
                                                            <FaStar key={s} size={12} className={s <= Math.round(product.rating || 4) ? "" : "opacity-20"} />
                                                        ))
                                                    ) : (
                                                        <FaStar size={12} />
                                                    )}
                                                </div>
                                                <span className="text-[11px] md:text-[14px] font-bold text-[#8E8E93] ml-1">
                                                    {product.rating || "4.5"}({product.reviews || 12})
                                                </span>
                                            </div>
                                            {isDesktop && (
                                                <div className="flex items-center gap-1.5 text-[#8E8E93]">
                                                    <FaTruck size={14} />
                                                    <span className="text-[11px] md:text-[13px] font-semibold">2-4 days</span>
                                                    <FaInfoCircle size={10} className="ml-0.5 opacity-40" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="flex items-baseline flex-nowrap gap-1">
                                                <span className="text-[10px] md:text-[13px] text-[#8E8E93] font-medium whitespace-nowrap leading-none">from</span>
                                                {product.originalPrice && (
                                                    <span className="text-[13px] md:text-[15px] text-[#8E8E93] line-through font-bold whitespace-nowrap leading-none">₹{product.originalPrice}</span>
                                                )}
                                                <span className="text-[17px] md:text-[24px] font-extrabold text-[#FF3B30] leading-none whitespace-nowrap">₹{product.rentPrice}</span>
                                                <span className="text-[10px] md:text-[13px] text-[#8E8E93] font-medium whitespace-nowrap leading-none">/month</span>
                                            </div>
                                        </div>

                                        {!isDesktop && (
                                            <div className="grid grid-cols-2 gap-1.5 mt-1.5 pb-1">
                                                {(product.tags?.length ? product.tags : ["Quality tested", "Deep Cleaned", "Like New", "In Stock"]).slice(0, 4).map((tag, i) => (
                                                    <span key={i} className="px-1 py-0.5 border border-[#C7C7CC] rounded-full text-[10px] text-[#8E8E93] font-medium text-center bg-transparent">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                            {/* Hover Button Section */}
                                            <div 
                                                className="relative w-full opacity-0 h-0 group-hover:opacity-100 group-hover:h-[50px] transition-all duration-300 z-30 overflow-hidden flex items-center pt-2"
                                            >
                                                <button 
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                    className="w-full h-full rounded-full bg-[#FFCF46] text-[#1D1D1F] font-bold text-[14px] md:text-[16px] shadow-md active:scale-95 transition-all hover:brightness-105"
                                                >
                                                    Rent Now
                                                </button>
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
                        style={{
                            width: '82px',
                            height: '30px',
                            paddingTop: '6px',
                            paddingBottom: '6px',
                            paddingLeft: '20px',
                            paddingRight: '20px',
                            borderRadius: '9999px',
                            background: 'hsla(44, 100%, 64%, 1)',
                            borderBottom: '1px solid rgba(0,0,0,0.10)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#1D1D1F',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        View All
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BestRentedProducts;
