import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaRegHeart, FaStar, FaHeart } from 'react-icons/fa';
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
        >
            <motion.div
                animate={isHovered ? "hover" : "initial"}
                initial="initial"
                className="bg-white flex flex-col overflow-hidden relative mx-auto w-full"
                style={{ 
                    height: isDesktop ? '387px' : '260px',
                    width: isDesktop ? '285px' : '173px',
                    border: "1px solid hsla(0, 0%, 89%, 1)",
                    borderRadius: "16px",
                    boxShadow: "0px 1px 2px 0px hsla(0, 0%, 0%, 0.05)",
                    willChange: "transform, height",
                    cursor: "pointer",
                    backgroundColor: "hsla(0, 0%, 100%, 1)"
                }}
                variants={{
                    initial: { 
                        height: isDesktop ? 387 : 260,
                    },
                    hover: { 
                        height: isDesktop ? 440 : 330,
                        transition: { duration: 0.3, ease: [0.45, 1.45, 0.8, 1] }
                    }
                }}
                onClick={() => router.push(`/products/${product.id}`)}
            >
                {/* Image Section — full-bleed top */}
                <div
                    className="relative bg-white group-hover:bg-[#F9F9F9] transition-colors duration-500 flex items-center justify-center overflow-hidden shrink-0 h-[146px] md:h-[282px]"
                    style={{ 
                        borderWidth: "0px 1px 1px 1px",
                        borderStyle: "solid",
                        borderColor: "hsla(0, 0%, 93%, 1)",
                        borderRadius: "16px",
                        boxShadow: "0px 4px 8px 0px hsla(0, 0%, 87%, 0.1), 0px 15px 15px 0px hsla(0, 0%, 87%, 0.09), 0px 33px 20px 0px hsla(0, 0%, 87%, 0.05), 0px 59px 23px 0px hsla(0, 0%, 87%, 0.01), 0px 91px 26px 0px hsla(0, 0%, 87%, 0)"
                    }}
                >
                    <div className="absolute top-2 left-2 z-20 flex gap-1">
                        <span className="bg-[#FF3B30] text-white text-[9px] md:text-[11px] font-bold px-1.5 py-[2px] rounded-sm shadow-sm leading-none">
                            -20% off
                        </span>
                    </div>
                    
                    <button
                        className="absolute z-20 flex items-center justify-center rounded-full shadow-sm hover:scale-110 transition-all duration-300"
                        style={{
                            width: "33px",
                            height: "33px",
                            top: "10.5px",
                            right: "12.5px",
                            backgroundColor: "hsla(0, 0%, 93%, 1)",
                            border: "0.2px solid hsla(0, 0%, 80%, 1)"
                        }}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                        <FaRegHeart size={18} color="hsla(0, 0%, 0%, 1)" />
                    </button>
                    
                    <div className="relative w-full h-full p-4">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                    </div>
                </div>

                {/* Text Section */}
                <div
                    className="flex flex-col relative overflow-hidden font-manrope"
                    style={{ 
                        width: '100%',
                        height: 'auto',
                        padding: isDesktop ? '8px 12px 12px 12px' : '6px 10px 8px 10px',
                        gap: isDesktop ? '4px' : '2px'
                    }}
                >
                    <h3
                        className="font-manrope line-clamp-1"
                        style={{
                            fontSize: isDesktop ? '18px' : '14px',
                            fontWeight: 600,
                            lineHeight: '25px',
                            color: "hsla(0, 0%, 16%, 1)",
                            letterSpacing: "-0.4px"
                        }}
                    >
                        {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <div className="flex text-[#FF9F0A]">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <FaStar key={s} size={12} className={s <= Math.round(product.rating || 4) ? "" : "opacity-20"} />
                                ))}
                            </div>
                            <span className="text-[11px] md:text-[14px] font-bold text-[#8E8E93] ml-1">
                                {product.rating || "4.5"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#8E8E93]">
                            <span className="text-[13px] font-semibold">2-4 days</span>
                        </div>
                    </div>

                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-[12px] font-medium text-black">from</span>
                        <span className="text-[20px] font-semibold text-gray-400 line-through">₹{product.originalPrice}</span>
                        <span className="text-[20px] font-semibold text-[#FF3B30]">₹{product.rentPrice}</span>
                        <span className="text-[12px] font-medium text-black">/month</span>
                    </div>

                    {/* Rent Now Button Entrance */}
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
