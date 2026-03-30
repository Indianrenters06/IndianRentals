"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaRegHeart, FaStar, FaBolt, FaTruck, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";

import { API } from "@/services/apiConfig";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";

const ProductCard = ({ product, index, isDesktop, handleAddToCart }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative group h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
        >
            <motion.div
                animate={isHovered ? "hover" : "initial"}
                initial="initial"
                className="bg-white rounded-[24px] flex flex-col overflow-hidden relative mx-auto w-[173px] md:w-[285px]"
                style={{ 
                    height: isDesktop ? '350px' : '260px',
                    border: "1px solid hsla(0, 0%, 89%, 1)",
                    boxShadow: "0px 1px 2px 0px hsla(0, 0%, 0%, 0.05)",
                    willChange: "transform, height"
                }}
                variants={{
                    initial: { 
                        height: isDesktop ? 350 : 260,
                        boxShadow: "0px 1px 2px 0px hsla(0, 0%, 0%, 0.05)"
                    },
                    hover: { 
                        height: isDesktop ? 405 : 330,
                        boxShadow: "0px 12px 40px rgba(0,0,0,0.12)",
                        transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] }
                    }
                }}
            >
                {/* Image Section — full-bleed top */}
                <div
                    className="relative bg-[#F9F9F9] flex items-center justify-center overflow-hidden flex-shrink-0 h-[146px] md:h-[240px] rounded-t-2xl"
                    style={{ 
                        borderWidth: '0px 1px 1px 1px',
                        borderStyle: 'solid',
                        borderColor: 'hsla(0, 0%, 93%, 1)',
                        boxShadow: '0px 4px 8px 0px hsla(0, 0%, 87%, 0.1)'
                    }}
                >
                    {/* Badges */}
                    <div className="absolute top-2 left-2 z-20 flex gap-1">
                        <span className="bg-[#FF3B30] text-white text-[9px] md:text-[11px] font-bold px-1.5 py-[2px] rounded-[4px] shadow-sm leading-none">
                            -20% off
                        </span>
                    </div>
                    
                    {/* Heart */}
                    <button
                        className="absolute top-2 right-2 z-20 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-white border border-gray-200 text-gray-400 rounded-full shadow-sm hover:text-[#FF3B30] hover:scale-110 transition-all duration-300"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                        <FaRegHeart size={isDesktop ? 14 : 12} />
                    </button>
                    
                    {/* Product Image */}
                    <Link 
                        href={`/products/${product.id}`} 
                        className="flex items-center justify-center w-full h-full p-4"
                        onClick={(e) => {
                            if (!isDesktop && !isHovered) {
                                e.preventDefault();
                                setIsHovered(true);
                            }
                        }}
                    >
                        <motion.img
                            variants={{
                                initial: { scale: 1 },
                                hover: { scale: 1.05 }
                            }}
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                        />
                    </Link>
                </div>
                {/* Text Section — explicitly handles its own entrance */}
                <div
                    className="flex flex-col relative overflow-hidden font-manrope"
                    style={{ 
                        width: isDesktop ? '285px' : '173px',
                        height: 'auto',
                        padding: isDesktop ? '8px 12px 12px 12px' : '6px 10px 8px 10px',
                        gap: isDesktop ? '4px' : '2px'
                    }}
                >
                    <Link 
                        href={`/products/${product.id}`}
                        onClick={(e) => {
                            if (!isDesktop && !isHovered) {
                                e.preventDefault();
                                setIsHovered(true);
                            }
                        }}
                    >
                        <h3
                            className="text-[#1D1D1F] line-clamp-1 text-[14px] md:text-[18px] font-bold leading-tight"
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
                                    <FaStar size={10} />
                                )}
                            </div>
                            <span className="text-[11px] md:text-[14px] font-bold text-[#8E8E93] ml-1">
                                {product.rating || "4.5"}({product.reviews || 12})
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#8E8E93]">
                            <FaTruck size={14} />
                            <span className="text-[13px] font-semibold">2-4 days</span>
                            <FaInfoCircle size={10} className="ml-0.5 opacity-40" />
                        </div>
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



                    <motion.div 
                        variants={{
                            initial: { opacity: 0, height: 0 },
                            hover: { 
                                opacity: 1, 
                                height: 60, 
                                transition: { 
                                    height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                                    opacity: { duration: 0.3 }
                                }
                            }
                        }}
                        className="relative w-full z-30 overflow-hidden flex items-center pt-2 pb-1"
                    >
                        <motion.button 
                            variants={{
                                initial: { y: 60 },
                                hover: { 
                                    y: 0,
                                    transition: { type: "spring", stiffness: 300, damping: 25, delay: 0.1 }
                                }
                            }}
                            onClick={(e) => handleAddToCart(e, product)}
                            className="w-full h-[50px] rounded-full bg-[#fbc02d] text-[#1D1D1F] font-bold text-[14px] md:text-[16px] shadow-md active:scale-95 transition-all hover:brightness-105"
                        >
                            Rent Now
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

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

    useEffect(() => {
        const fetchCMSAndProducts = async () => {
            try {
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

                let fetchedProducts = [];
                if (targetIds.length > 0) {
                    const prodPromises = targetIds.map(id => fetch(`${API}/api/products/${id}`).then(r => r.ok ? r.json() : null));
                    const responses = await Promise.all(prodPromises);
                    fetchedProducts = responses.filter(p => p !== null);
                } else {
                    const fallBackRes = await fetch(`${API}/api/products?limit=4`);
                    if (fallBackRes.ok) {
                        const fallbackData = await fallBackRes.json();
                        fetchedProducts = fallbackData.products || [];
                    }
                }

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
                <div className="flex flex-col mb-6 md:mb-12 max-w-[350px] md:max-w-none w-full mx-auto md:mx-0">
                    <div className="flex items-center justify-between">
                        <h2 className="font-manrope tracking-tight whitespace-nowrap text-[24px] md:text-[36px] font-semibold text-[#333] leading-tight md:leading-[48px]">
                            {cmsConfig.title}
                        </h2>
                        <Link
                            href="/products"
                            className="hidden md:inline-flex items-center justify-center gap-[2px] text-gray-900 group hover:brightness-105 transition-all text-[14px] font-semibold bg-[#FBC02D] px-5 py-2 rounded-full"
                        >
                            View All
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px] md:gap-8 min-h-[300px]">
                    {products.map((product, index) => (
                        <ProductCard 
                            key={product.id || index}
                            product={product}
                            index={index}
                            isDesktop={isDesktop}
                            handleAddToCart={handleAddToCart}
                        />
                    ))}
                </div>

                <div className="mt-6 flex justify-center md:hidden">
                    <Link
                        href="/products"
                        className="bg-[#FBC02D] px-5 py-1.5 rounded-full text-[11px] font-semibold text-[#1D1D1F] whitespace-nowrap"
                    >
                        View All
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BestRentedProducts;
