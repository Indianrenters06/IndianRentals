import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretLeft, CaretRight, Heart, Star, Truck, Info } from '@phosphor-icons/react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/features/cartSlice';
import { useRouter } from 'next/navigation';

import { API } from '@/services/apiConfig';

const FALLBACK_BANNERS = [
    {
        title: "Apple Products",
        subtitle: "MacBooks | iPads | iPhones | Mac Studio | Mac Mini",
        image: "https://res.cloudinary.com/dpu9ikeqe/image/upload/v1775219840/f6540bc8c3d4a91dfd954f6fe1cf8d3803b81b4a_1_bosgoq.png",
        href: "/products",
        bg: "linear-gradient(to bottom, #8E2DE2, #4A00E0)",
        category: "MacBook"
    },
    {
        title: "Smart Devices",
        subtitle: "Everything you need for your smart home.",
        image: "/images/banner-smart.png",
        href: "/products",
        bg: "linear-gradient(to bottom, #2D6A4F, #1B4332)",
        category: "SmartPhone"
    }
];

// ─── Banner Carousel ──────────────────────────────────────────────────────────
const BannerCarousel = ({ banners, current, setCurrent, height = "387px" }) => {
    const [direction, setDirection] = useState(1);

    const go = useCallback((dir) => {
        setDirection(dir);
        setCurrent(prev => (prev + dir + banners.length) % banners.length);
    }, [banners.length, setCurrent]);

    useEffect(() => {
        const t = setInterval(() => go(1), 5000);
        return () => clearInterval(t);
    }, [go]);

    const slide = banners[current];

    return (
        <div
            className="relative overflow-hidden shadow-xl rounded-2xl"
            style={{
                height,
                width: "100%",
                maxWidth: "100%",
                background: "#000"
            }}
        >
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={current}
                    custom={direction}
                    variants={{
                        enter: (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
                        center: { x: 0, opacity: 1 },
                        exit: (d) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="absolute inset-0 flex flex-col items-center justify-end"
                >
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            unoptimized
                            className="object-cover"
                        />
                        {/* Gradient Overlay */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: "linear-gradient(180.66deg, rgba(0, 0, 0, 0) 52.71%, rgba(0, 0, 0, 0.8) 86.37%)"
                            }}
                        />
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 text-center w-full" style={{ padding: "20px 24px" }}>
                        <div className="flex items-center justify-center gap-4 mb-1">
                            <button onClick={() => go(-1)} className="w-[30px] h-[30px] rounded-full bg-white shadow-sm flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors"><CaretLeft size={16} weight="bold" /></button>
                            <h3
                                className="text-white leading-tight"
                                style={{
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontSize: "32px",
                                    fontWeight: 600,
                                    height: "35px",
                                    letterSpacing: "-0.04em",
                                    lineHeight: "35px"
                                }}
                            >
                                {slide.title}
                            </h3>
                            <button onClick={() => go(1)} className="w-[30px] h-[30px] rounded-full bg-white shadow-sm flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors"><CaretRight size={16} weight="bold" /></button>
                        </div>
                        <p
                            className="text-white/90 leading-tight mb-4 mx-auto"
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontSize: "16px",
                                fontWeight: 400,
                                height: "28px",
                                maxWidth: "526px",
                                textAlign: "center",
                                letterSpacing: "-0.01em"
                            }}
                        >
                            {slide.subtitle}
                        </p>

                        <div className="flex justify-center gap-2">
                            {banners.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                                    className={`transition-all duration-300 rounded-full h-2 ${i === current ? "w-10 bg-white" : "w-1.5 bg-white/40"}`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// ─── Product Card Component ──────────────────────────────────────────────────
const ShowcaseProductCard = ({ product, index, viewType = 'desktop', handleAddToCart }) => {
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();
    const isDesktop = viewType === 'desktop';
    const isTablet = viewType === 'tablet';

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
                className="bg-white flex flex-col overflow-hidden relative mx-auto w-full"
                style={{
                    height: isDesktop ? '387px' : (isTablet ? '387px' : '256px'),
                    width: isDesktop ? '285px' : (isTablet ? '223px' : '170px'),
                    border: isTablet ? '0.84px solid hsla(0, 0%, 89%, 1)' : '1px solid hsla(0, 0%, 89%, 1)',
                    boxShadow: isTablet ? '0px 0.84px 1.68px 0px hsla(0, 0%, 0%, 0.05)' : '0px 1px 2px 0px hsla(0, 0%, 0%, 0.05)',
                    willChange: "transform, height",
                    cursor: "pointer",
                    backgroundColor: "hsla(0, 0%, 100%, 1)",
                    borderRadius: isDesktop ? '20px' : (isTablet ? '17px' : '8px'),
                    opacity: 1
                }}
                variants={{
                    initial: { height: isDesktop ? 387 : (isTablet ? 387 : 256), y: 0, boxShadow: "0px 2px 4px 0px hsla(0, 0%, 0%, 0.04)" },
                    hover: {
                        height: isDesktop ? 440 : (isTablet ? 440 : 330),
                        y: isDesktop ? -10 : -8,
                        boxShadow: "0px 25px 50px -12px hsla(0, 0%, 0%, 0.15)",
                        transition: { duration: 0.3, ease: [0.45, 1.45, 0.8, 1] }
                    }
                }}
            >
                {/* Image Section */}
                <div
                    className="relative bg-white group-hover:bg-[#F9F9F9] transition-colors duration-500 flex items-center justify-center overflow-hidden shrink-0"
                    style={{
                        width: isDesktop ? '285px' : (isTablet ? '223px' : '170px'),
                        height: isDesktop ? '282px' : (isTablet ? '302px' : '184px'),
                        borderRadius: isDesktop ? '20px' : (isTablet ? '17px' : '8px'),
                        borderWidth: isTablet ? '0px 0.84px 0.84px 0.84px' : '0px 1px 1px 1px',
                        borderStyle: "solid",
                        borderColor: "hsla(0, 0%, 93%, 1)",
                        backgroundColor: "hsla(0, 0%, 100%, 1)",
                        opacity: 1,
                        boxShadow: isTablet
                            ? "0px 3.35px 6.71px 0px hsla(0, 0%, 87%, 0.1), 0px 12.58px 12.58px 0px hsla(0, 0%, 87%, 0.09), 0px 27.67px 16.77px 0px hsla(0, 0%, 87%, 0.05), 0px 49.48px 19.29px 0px hsla(0, 0%, 87%, 0.01), 0px 76.31px 21.8px 0px hsla(0, 0%, 87%, 0)"
                            : "0px 4px 8px 0px hsla(0, 0%, 87%, 0.1), 0px 15px 15px 0px hsla(0, 0%, 87%, 0.09), 0px 33px 20px 0px hsla(0, 0%, 87%, 0.05), 0px 59px 23px 0px hsla(0, 0%, 87%, 0.01), 0px 91px 26px 0px hsla(0, 0%, 87%, 0)"
                    }}
                >
                    <div
                        className="absolute z-20 flex items-center"
                        style={{
                            top: "20px",
                            left: "20px",
                            gap: "6px"
                        }}
                    >
                        <span className="text-[10.5px] leading-none flex items-center justify-center whitespace-nowrap"
                            style={{
                                height: "24px",
                                opacity: 1,
                                borderRadius: "27px",
                                paddingTop: "4px",
                                paddingRight: "10px",
                                paddingBottom: "4px",
                                paddingLeft: "10px",
                                background: "hsla(3, 86%, 51%, 1)",
                                boxShadow: "0px 0px 1px 0px hsla(0, 0%, 47%, 0.1), 0px 1px 1px 0px hsla(0, 0%, 47%, 0.09), 0px 3px 2px 0px hsla(0, 0%, 47%, 0.05), 0px 5px 2px 0px hsla(0, 0%, 47%, 0.01), 0px 9px 2px 0px hsla(0, 0%, 47%, 0)",
                                color: "hsla(4, 100%, 97%, 1)",
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: 600,
                                letterSpacing: "0.02em"
                            }}
                        >
                            -20% off
                        </span>
                        {product.isNew && (
                            <span
                                className="text-white text-[10px] font-bold shadow-sm leading-none flex items-center justify-center translate-x-1.5"
                                style={{
                                    width: "45px",
                                    height: "24px",
                                    paddingTop: "4px",
                                    paddingRight: "10px",
                                    paddingBottom: "4px",
                                    paddingLeft: "10px",
                                    borderRadius: "27px",
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
                            right: "16.51px",
                            backgroundColor: "hsla(0, 0%, 93%, 1)",
                            border: "0.2px solid hsla(0, 0%, 80%, 1)",
                            borderRadius: "9999px"
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
                    className="flex flex-col relative font-sans bg-white"
                    style={{
                        width: isDesktop ? '285px' : (isTablet ? '223px' : '100%'),
                        height: isDesktop ? (isHovered ? '158px' : '105px') : (isTablet ? (isHovered ? '130px' : '85px') : '72px'),
                        paddingTop: isDesktop ? '8px' : (isTablet ? '6.71px' : '4px'),
                        paddingRight: isDesktop ? '12px' : (isTablet ? '10.06px' : '8px'),
                        paddingBottom: isDesktop ? '12px' : (isTablet ? '10.06px' : '8px'),
                        paddingLeft: isDesktop ? '12px' : (isTablet ? '10.06px' : '8px'),
                        gap: isDesktop ? '8px' : (isTablet ? '6.71px' : '4px'),
                        opacity: 1,
                        transition: 'height 0.3s ease'
                    }}
                >
                    <h3
                        className="font-sans line-clamp-1 group-hover:text-[#FF3B30] transition-colors duration-300 shrink-0"
                        style={{
                            width: isDesktop ? "261px" : "100%",
                            height: isDesktop ? "25px" : "20px",
                            fontSize: isDesktop ? "18px" : (isTablet ? "14px" : "15px"),
                            fontWeight: 600,
                            lineHeight: isDesktop ? "25px" : "20px",
                            letterSpacing: isDesktop ? "-0.4px" : (isTablet ? "-0.3px" : "normal"),
                            color: "hsla(0, 0%, 16%, 1)"
                        }}
                    >
                        {product.name}
                    </h3>

                    <div
                        className="flex items-center justify-between shrink-0"
                        style={{
                            width: isDesktop ? "261px" : (isTablet ? "203px" : "154px"),
                            height: "16px"
                        }}
                    >
                        <div className="flex items-center gap-1">
                            <div className="flex text-[#FF9500]">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={isDesktop ? 14 : (isTablet ? 13 : 12)} weight="fill" className={s <= Math.round(product.rating || 4) ? "" : "opacity-20"} />
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
                                className="font-sans"
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
                            gap: isDesktop ? "3px" : (isTablet ? "4px" : "6px"),
                            opacity: 1,
                            marginTop: "-2px"
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
                                    fontSize: isDesktop ? "16px" : (isTablet ? "14px" : "13px"),
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
                                fontSize: isDesktop ? "26px" : (isTablet ? "22px" : "20px"),
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

// ─── Main Component ───────────────────────────────────────────────────────────
const FeaturedShowcase = () => {
    const dispatch = useDispatch();
    const [cms, setCms] = useState({ enabled: true, banners: FALLBACK_BANNERS });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentBanner, setCurrentBanner] = useState(0);
    const [fetchingProducts, setFetchingProducts] = useState(false);
    const [viewType, setViewType] = useState('mobile');

    useEffect(() => {
        const checkRes = () => {
            const w = window.innerWidth;
            if (w >= 1024) setViewType('desktop');
            else if (w >= 768) setViewType('tablet');
            else setViewType('mobile');
        };
        checkRes();
        window.addEventListener('resize', checkRes);
        return () => window.removeEventListener('resize', checkRes);
    }, []);

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
        }));
    };

    // Sync products when banner changes
    useEffect(() => {
        if (!cms?.banners || !cms.banners[currentBanner]) return;

        const activeCategory = cms.banners[currentBanner]?.category;

        const safeFetch = async (url) => {
            try {
                const res = await fetch(url);
                if (!res.ok) return { products: [] };
                return await res.json();
            } catch {
                return { products: [] };
            }
        };

        const loadProducts = async () => {
            setFetchingProducts(true);
            try {
                // 1. Try fetching products filtered by category
                const url = activeCategory
                    ? `${API}/api/products?category=${encodeURIComponent(activeCategory)}&limit=2`
                    : `${API}/api/products?limit=2`;

                let data = await safeFetch(url);

                // 2. Fallback: If no products found for category, fetch general products
                if ((!data.products || data.products.length === 0) && activeCategory) {
                    data = await safeFetch(`${API}/api/products?limit=2`);
                }

                if (data.products && data.products.length > 0) {
                    setProducts(data.products.map(p => ({
                        id: p._id,
                        name: p.name,
                        image: p.images?.[0] || "/images/placeholder.png",
                        rating: p.rating || 4.5,
                        reviews: p.numReviews || 12,
                        originalPrice: p.rentalPrice ? Math.round(p.rentalPrice * 1.5) : 8999,
                        rentPrice: p.rentalPrice || 5000,
                    })));
                }
            } finally {
                setFetchingProducts(false);
                setLoading(false);
            }
        };

        loadProducts();
    }, [currentBanner, cms.banners]);

    if (loading) return null;

    return (
        <section className="bg-white py-12 md:py-16">
            <div className={viewType === 'tablet' ? "w-full mx-auto px-[30px]" : "max-w-[1224px] mx-auto px-4 sm:px-6"}>
                <div
                    className="flex items-stretch justify-center"
                    style={{
                        flexDirection: viewType === 'mobile' ? 'column' : 'row',
                        gap: viewType === 'desktop' ? "24px" : (viewType === 'tablet' ? "35px" : "20px"),
                        width: viewType === 'tablet' ? '708px' : 'auto',
                        height: viewType === 'tablet' ? '387px' : 'auto',
                        margin: viewType === 'tablet' ? '0 auto' : undefined
                    }}
                >
                    {/* Left: Product Card — 1 on tablet, 2 on desktop */}
                    <div
                        className="flex flex-col md:flex-row items-stretch gap-4 md:gap-[18px] transition-all duration-500"
                        style={{
                            width: viewType === 'desktop' ? "588px" : (viewType === 'tablet' ? '223px' : '100%'),
                            height: viewType === 'tablet' ? '387px' : 'auto',
                            flexShrink: 0,
                            opacity: fetchingProducts ? 0.6 : 1,
                            transform: fetchingProducts ? 'translateX(-10px)' : 'translateX(0)',
                            filter: fetchingProducts ? 'blur(1px)' : 'none'
                        }}
                    >
                        {products[0] ? (
                            <ShowcaseProductCard product={products[0]} viewType={viewType} handleAddToCart={handleAddToCart} />
                        ) : (
                            <div className="w-[285px] h-[387px] bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-300 italic text-sm">No products found</div>
                        )}

                        {/* Only show 2nd card on desktop */}
                        {viewType === 'desktop' && products[1] && (
                            <ShowcaseProductCard product={products[1]} viewType={viewType} handleAddToCart={handleAddToCart} />
                        )}
                    </div>

                    {/* Right: Banner Carousel */}
                    <div
                        style={{
                            width: viewType === 'tablet' ? '450px' : (viewType === 'desktop' ? '540px' : '100%'),
                            height: viewType === 'tablet' ? '387px' : 'auto',
                            flexShrink: 0
                        }}
                    >
                        <BannerCarousel
                            banners={cms.banners}
                            current={currentBanner}
                            setCurrent={setCurrentBanner}
                            height="387px"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedShowcase;
