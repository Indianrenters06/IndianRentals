import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaRegHeart, FaStar, FaHeart, FaTruck, FaInfoCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/features/cartSlice';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const FALLBACK_BANNERS = [
    {
        title: "Apple Products",
        subtitle: "MacBooks | iPads | iPhones | Mac Studio | Mac Mini",
        image: "/images/banner-apple.png",
        href: "/products",
        bg: "linear-gradient(to bottom, #8E2DE2, #4A00E0)"
    },
    {
        title: "Smart Devices",
        subtitle: "Everything you need for your smart home.",
        image: "/images/banner-smart.png",
        href: "/products",
        bg: "linear-gradient(to bottom, #2D6A4F, #1B4332)"
    }
];

// ─── Banner Carousel ──────────────────────────────────────────────────────────
const BannerCarousel = ({ banners, height = "387px", width = "560px" }) => {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);

    const go = useCallback((dir) => {
        setDirection(dir);
        setCurrent(prev => (prev + dir + banners.length) % banners.length);
    }, [banners.length]);

    useEffect(() => {
        const t = setInterval(() => go(1), 5000);
        return () => clearInterval(t);
    }, [go]);

    const slide = banners[current];

    return (
        <div 
            className="relative overflow-hidden shadow-xl"
            style={{ 
                height,
                width: "100%",
                borderRadius: "30px",
                maxWidth: "100%"
            }}
        >
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={current}
                    custom={direction}
                    variants={{
                        enter: (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
                        center: { x: 0, opacity: 1 },
                        exit:  (d) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="absolute inset-0 flex flex-col items-center justify-end pb-8"
                    style={{ background: slide.bg || "#F5F5F7" }}
                >
                    {/* Background Image Placeholder */}
                    <div className="absolute inset-x-0 top-0 h-[65%] flex items-center justify-center p-8">
                         <div className="w-full h-full bg-white/20 rounded-2xl backdrop-blur-xl flex items-center justify-center border border-white/10">
                            <span className="text-white/50 text-sm">Product Visual</span>
                         </div>
                    </div>

                    <div className="relative z-10 text-center px-6">
                        <div className="flex items-center justify-center gap-4 mb-1">
                             <button onClick={() => go(-1)} className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white"><FaChevronLeft size={10}/></button>
                             <h3 className="text-white text-[24px] font-bold tracking-tight">
                                {slide.title}
                            </h3>
                             <button onClick={() => go(1)} className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white"><FaChevronRight size={10}/></button>
                        </div>
                        <p className="text-white/80 text-[14px] font-medium opacity-80 leading-tight mb-4">
                            {slide.subtitle}
                        </p>

                        <div className="flex justify-center gap-1.5">
                            {banners.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                                    className={`transition-all duration-300 rounded-full h-1.5 ${i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
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
const ShowcaseProductCard = ({ product, index, isDesktop, handleAddToCart }) => {
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
                    initial: { height: isDesktop ? 387 : 256 },
                    hover: { 
                        height: isDesktop ? 440 : 330,
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
                            height: "22px"
                        }}
                    >
                        <span className="bg-[#FF3B30] text-white text-[10px] font-bold px-2 py-[4px] rounded-[4px] shadow-sm leading-none flex items-center justify-center h-full">
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
                        style={{ width: "28px", height: "28px", top: "8px", right: "8px", backgroundColor: "white", border: "1px solid #E5E5EA" }}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                        <FaRegHeart size={14} color="#8E8E93" />
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
                            height: isDesktop ? "25px" : "auto",
                            fontSize: isDesktop ? "18px" : "15px", 
                            fontWeight: 600, 
                            lineHeight: isDesktop ? "25px" : "normal", 
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
                            {!isDesktop ? (
                                <FaStar size={10} className="text-[#FF9F0A]" />
                            ) : (
                                <div className="flex text-[#FF9F0A]">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <FaStar key={s} size={11} className={s <= Math.round(product.rating || 4) ? "" : "opacity-20"} />
                                    ))}
                                </div>
                            )}
                            <span className="text-[12px] font-medium text-[#1D1D1F] ml-0.5">
                                {product.rating || "4.5"} <span className="text-[#8E8E93]">({product.reviews || 12})</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-[#8E8E93]">
                            <FaTruck size={13} />
                            <span className="text-[12px] font-medium">2-4 days</span>
                            <FaInfoCircle size={10} className="ml-0.5 opacity-40 hidden md:block" />
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
                        <span className="text-[10px] md:text-[11px] font-semibold text-[#1D1D1F]">from</span>
                        {product.originalPrice && (
                            <span className="text-[12px] md:text-[17px] font-bold text-[#8E8E93] line-through">₹{product.originalPrice}</span>
                        )}
                        <span className="text-[16px] md:text-[22px] font-bold text-[#FF3B30]">₹{product.rentPrice}</span>
                        <span className="text-[10px] md:text-[11px] font-semibold text-[#1D1D1F]">/month</span>
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

// ─── Main Component ───────────────────────────────────────────────────────────
const FeaturedShowcase = () => {
    const dispatch = useDispatch();
    const [cms, setCms] = useState({ enabled: true, banners: FALLBACK_BANNERS });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkRes = () => setIsDesktop(window.innerWidth >= 1024);
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

    useEffect(() => {
        const load = async () => {
             try {
                const res = await fetch(`${API}/api/products?limit=2`);
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.products.map(p => ({
                        id: p._id,
                        name: p.name,
                        image: p.images?.[0] || "/images/placeholder.png",
                        rating: p.rating || 4.5,
                        reviews: p.numReviews || 12,
                        originalPrice: 8999,
                        rentPrice: p.rentalPrice || 5000,
                    })));
                }
             } catch (err) {
                 console.error(err);
             } finally {
                 setLoading(false);
             }
        };
        load();
    }, []);

    if (loading) return null;

    return (
        <section className="bg-white py-12 md:py-20">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
                <div 
                    className="flex flex-col lg:flex-row items-stretch"
                    style={{ gap: isDesktop ? "35px" : "20px" }}
                >
                    {/* Left: Product 1 */}
                    {products[0] && (
                        <div className="lg:shrink-0">
                            <ShowcaseProductCard product={products[0]} isDesktop={isDesktop} handleAddToCart={handleAddToCart} />
                        </div>
                    )}
                    
                    {/* Center: Product 2 */}
                    {products[1] && (
                        <div className="lg:shrink-0">
                            <ShowcaseProductCard product={products[1]} isDesktop={isDesktop} handleAddToCart={handleAddToCart} />
                        </div>
                    )}

                    {/* Right: Banner */}
                    <div className="flex-1">
                        <BannerCarousel banners={cms.banners} height="387px" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedShowcase;
