"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Star, Lightning, Truck, Info, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { motion } from "framer-motion";

import { API } from "@/services/apiConfig";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";

const ProductCard = ({ product, index, isDesktop, handleAddToCart }) => {
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();

    return (
        <div
            className="relative group h-full flex-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onClick={() => router.push(`/products/${product.id}`)}
        >
            <motion.div
                animate={isHovered ? "hover" : "initial"}
                initial="initial"
                className="bg-white flex flex-col overflow-hidden relative mx-auto w-full rounded-[16px]"
                style={{
                    height: isDesktop ? '387px' : '256px',
                    width: isDesktop ? '285px' : '170px',
                    border: "1px solid hsla(0, 0%, 89%, 1)",
                    boxShadow: "0px 1px 2px 0px hsla(0, 0%, 0%, 0.05)",
                    willChange: "transform, height",
                    cursor: "pointer",
                    backgroundColor: "hsla(0, 0%, 100%, 1)",
                    borderRadius: isDesktop ? "16px" : "8px",
                    opacity: 1
                }}
                variants={{
                    initial: { height: isDesktop ? 387 : 256, y: 0, boxShadow: "0px 2px 4px 0px hsla(0, 0%, 0%, 0.04)" },
                    hover: {
                        height: isDesktop ? 440 : 330,
                        y: isDesktop ? -10 : -8,
                        boxShadow: "0px 25px 50px -12px hsla(0, 0%, 0%, 0.15)",
                        transition: { duration: 0.3, ease: [0.45, 1.45, 0.8, 1] }
                    }
                }}
            >
                {/* Image Section */}
                <div
                    className="relative bg-white group-hover:bg-[#F9F9F9] transition-colors duration-500 flex items-center justify-center overflow-hidden shrink-0 h-[184px] md:h-[282px]"
                    style={{
                        width: isDesktop ? '285px' : '170px',
                        borderRadius: isDesktop ? "16px" : "8px",
                        borderWidth: "0px 1px 1px 1px",
                        borderStyle: "solid",
                        borderColor: "hsla(0, 0%, 93%, 1)",
                        backgroundColor: "hsla(0, 0%, 100%, 1)",
                        opacity: 1,
                        boxShadow: "0px 4px 8px 0px hsla(0, 0%, 87%, 0.1), 0px 15px 15px 0px hsla(0, 0%, 87%, 0.09), 0px 33px 20px 0px hsla(0, 0%, 87%, 0.05), 0px 59px 23px 0px hsla(0, 0%, 87%, 0.01), 0px 91px 26px 0px hsla(0, 0%, 87%, 0)"
                    }}
                >
                    <div
                        className="absolute z-20 flex items-center"
                        style={{
                            top: "19.57px",
                            left: "13.49px",
                            gap: "4px",
                            width: "92px",
                            height: "28px"
                        }}
                    >
                        <span className="text-white text-[10px] font-bold px-2 py-[4px] rounded-[6px] shadow-sm leading-none flex items-center justify-center"
                            style={{
                                width: "64px",
                                height: "28px",
                                background: "hsla(3, 100%, 56%, 1)"
                            }}
                        >
                            -20% off
                        </span>
                        {product.isNew && (
                            <span
                                className="text-white text-[10px] font-bold shadow-sm leading-none flex items-center justify-center h-full translate-x-1.5"
                                style={{
                                    width: "34px",
                                    height: "22px",
                                    paddingTop: "4px",
                                    paddingRight: "5px",
                                    paddingBottom: "4px",
                                    paddingLeft: "5px",
                                    borderRadius: "6px",
                                    backgroundColor: "hsla(122, 100%, 35%, 1)",
                                    boxShadow: "0px 0px 1px 0px hsla(0, 0%, 47%, 0.1), 0px 1px 1px 0px hsla(0, 0%, 47%, 0.09), 0px 3px 2px 0px hsla(0, 0%, 47%, 0.05), 0px 5px 2px 0px hsla(0, 0%, 47%, 0.01), 0px 9px 2px 0px hsla(0, 0%, 47%, 0)"
                                }}
                            >
                                New
                            </span>
                        )}
                    </div>

                    <button
                        className="absolute z-20 flex items-center justify-center rounded-full shadow-sm hover:scale-110 transition-all duration-300"
                        style={{
                            width: "33px",
                            height: "33px",
                            top: "10.57px",
                            right: "12.51px",
                            backgroundColor: "hsla(0, 0%, 93%, 1)",
                            border: "0.2px solid hsla(0, 0%, 80%, 1)",
                            borderRadius: "100%"
                        }}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                        <Heart size={18} color="#000000" weight="regular" />
                    </button>

                    <div className="relative w-full h-full p-4 flex items-center justify-center">
                        <motion.img
                            variants={{ initial: { scale: 1 }, hover: { scale: 1.05 } }}
                            src={product.image}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-700 ease-out"
                        />
                    </div>
                </div>

                {/* Text Section */}
                <div
                    className="flex flex-col relative font-manrope bg-white"
                    style={{
                        width: isDesktop ? '285px' : '100%',
                        height: isDesktop ? (isHovered ? '158px' : '105px') : '72px',
                        paddingTop: isDesktop ? '8px' : '4px',
                        paddingRight: isDesktop ? '12px' : '8px',
                        paddingBottom: isDesktop ? '12px' : '8px',
                        paddingLeft: isDesktop ? '12px' : '8px',
                        gap: isDesktop ? '8px' : '4px',
                        opacity: 1,
                        transition: 'height 0.3s ease'
                    }}
                >
                    <h3
                        className="font-manrope line-clamp-1 group-hover:text-[#FF3B30] transition-colors duration-300 shrink-0"
                        style={{
                            width: isDesktop ? "261px" : "100%",
                            height: isDesktop ? "25px" : "22px",
                            fontSize: isDesktop ? "18px" : "15px",
                            fontWeight: 600,
                            lineHeight: isDesktop ? "25px" : "22px",
                            letterSpacing: isDesktop ? "-0.4px" : "normal",
                            color: "hsla(0, 0%, 16%, 1)"
                        }}
                    >
                        {product.name}
                    </h3>

                    <div
                        className="flex items-center justify-between shrink-0"
                        style={{
                            width: isDesktop ? "261px" : "154px",
                            height: "16px"
                        }}
                    >
                        <div className="flex items-center gap-1">
                            <div className="flex text-[#FF9500]">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={isDesktop ? 14 : 12} weight="fill" className={s <= Math.round(product.rating || 4) ? "" : "opacity-20"} />
                                ))}
                            </div>
                            <span
                                className="ml-1"
                                style={{
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontSize: "11px",
                                    fontWeight: 500,
                                    color: "hsla(0, 0%, 33%, 1)",
                                    letterSpacing: "-0.01em"
                                }}
                            >
                                {product.rating || "4.5"} ({product.reviews || 12})
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5" style={{ color: "hsla(0, 0%, 46%, 1)" }}>
                            <Truck size={isDesktop ? 16 : 14} weight="regular" />
                            <span
                                className="font-manrope"
                                style={{
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    lineHeight: "120%",
                                    letterSpacing: "-0.04em"
                                }}
                            >
                                2-4 days
                            </span>
                            <Info size={12} weight="regular" className="ml-0.5 opacity-80 hidden md:block" />
                        </div>
                    </div>

                    <div
                        className="flex items-center shrink-0"
                        style={{
                            width: isDesktop ? "209px" : "100%",
                            height: isDesktop ? "28px" : "auto",
                            gap: isDesktop ? "3px" : "6px",
                            opacity: 1,
                            marginTop: "-4px"
                        }}
                    >
                        <span
                            className="lowercase"
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontSize: "11px",
                                fontWeight: 500,
                                color: "hsla(0, 0%, 0%, 1)",
                                letterSpacing: "-0.01em"
                            }}
                        >
                            from
                        </span>
                        {product.originalPrice && (
                            <span
                                className="line-through decoration-[1.5px]"
                                style={{
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontSize: isDesktop ? "16px" : "13px",
                                    fontWeight: 600,
                                    color: "hsla(0, 0%, 46%, 1)",
                                    letterSpacing: "-0.04em"
                                }}
                            >
                                ₹{product.originalPrice}
                            </span>
                        )}
                        <span
                            className="font-bold tracking-tight ml-1 leading-none"
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontSize: isDesktop ? "26px" : "20px",
                                fontWeight: 600,
                                color: "hsla(3, 100%, 56%, 1)",
                                letterSpacing: "-0.04em"
                            }}
                        >
                            ₹{product.rentPrice}
                        </span>
                        <span
                            className="lowercase"
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontSize: "11px",
                                fontWeight: 500,
                                color: "hsla(0, 0%, 24%, 1)",
                                letterSpacing: "-0.01em",
                                marginLeft: "2px"
                            }}
                        >
                            /month
                        </span>
                    </div>

                    {/* Rent Now Button Entrance */}
                    <div
                        className="relative w-full z-30 overflow-hidden flex items-center transition-all duration-300 ease-out"
                        style={{
                            height: isHovered ? (isDesktop ? '50px' : '44px') : '0px',
                            opacity: isHovered ? 1 : 0,
                            paddingTop: isHovered ? '8px' : '0px'
                        }}
                    >
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(e, product); }}
                            className="w-full h-full rounded-full bg-[#FFCF46] text-[#1D1D1F] font-bold text-[14px] shadow-sm transform transition-all duration-300 ease-out active:scale-95 hover:brightness-105"
                            style={{ transform: isHovered ? 'translateY(0)' : 'translateY(15px)' }}
                        >
                            Rent Now
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Scrollbar } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';

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
                setProducts(mappedProducts);
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

    // Use a unique selector suffix based on section type
    const sectionSuffix = type === 'bestRented' ? 'best' : 'launch';

    return (
        <section
            className="py-12 md:py-16"
            style={{
                minHeight: '449px',
                background: '#FFFFFF'
            }}
        >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
                <div className="flex flex-col mb-6 md:mb-10 max-w-[350px] md:max-w-none w-full mx-auto md:mx-0">
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

                <div className="hidden md:block relative">
                    <Swiper
                        modules={[Navigation, Autoplay, Scrollbar]}
                        spaceBetween={24}
                        slidesPerView={'auto'}
                        navigation={{
                            nextEl: `.swiper-next-${sectionSuffix}`,
                            prevEl: `.swiper-prev-${sectionSuffix}`,
                        }}
                        scrollbar={{
                            el: `.swiper-scrollbar-${sectionSuffix}`,
                            draggable: true,
                            hide: false,
                        }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        className="!pb-0 !overflow-visible"
                    >
                        {products.map((product, index) => (
                            <SwiperSlide key={product.id || index} style={{ width: '285px' }}>
                                <ProductCard
                                    product={product}
                                    index={index}
                                    isDesktop={isDesktop}
                                    handleAddToCart={handleAddToCart}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Progress Bar & Navigation Arrows */}
                    <div className="flex items-center gap-6 mt-10">
                        <div
                            className={`swiper-scrollbar-${sectionSuffix} flex-1`}
                            style={{ height: '2px', position: 'relative' }}
                        />
                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                className={`swiper-prev-${sectionSuffix} w-[34px] h-[34px] rounded-[69px] flex items-center justify-center hover:opacity-80 transition-all`}
                                style={{ background: 'var(--color-grey-grey-100, hsla(0, 0%, 93%, 1))', opacity: 1 }}
                                aria-label="Previous"
                            >
                                <CaretLeft size={18} weight="regular" className="text-gray-800" />
                            </button>
                            <button
                                className={`swiper-next-${sectionSuffix} w-[34px] h-[34px] rounded-[69px] flex items-center justify-center hover:opacity-80 transition-all`}
                                style={{ background: 'var(--color-grey-grey-100, hsla(0, 0%, 93%, 1))', opacity: 1 }}
                                aria-label="Next"
                            >
                                <CaretRight size={18} weight="regular" className="text-gray-800" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile View: static grid */}
                <div className="md:hidden grid grid-cols-2 gap-[10px]">
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

                <div className="mt-8 flex justify-center md:hidden">
                    <Link
                        href="/products"
                        className="bg-[#FBC02D] px-5 py-2 rounded-full text-[12px] font-bold text-[#1D1D1F] whitespace-nowrap shadow-sm"
                    >
                        View All Products
                    </Link>
                </div>
            </div>

            <style>{`
                .swiper-scrollbar-${sectionSuffix} {
                    background: hsla(0, 0%, 93%, 1) !important;
                    border-radius: 0 !important;
                    height: 2px !important;
                    overflow: hidden;
                    position: relative;
                }
                .swiper-scrollbar-${sectionSuffix} .swiper-scrollbar-drag {
                    background: #1A1A1A !important;
                    border-radius: 0 !important;
                    height: 100% !important;
                }
                .swiper-prev-${sectionSuffix}.swiper-button-disabled,
                .swiper-next-${sectionSuffix}.swiper-button-disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                    pointer-events: none;
                }
            `}</style>
        </section>
    );
};

export default BestRentedProducts;
