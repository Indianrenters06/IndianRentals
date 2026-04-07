import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/features/cartSlice';
import { Heart, Star, Truck, Info } from '@phosphor-icons/react';
import Image from 'next/image';

const ProductCard = ({ product }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [added, setAdded] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => {
        const checkRes = () => setIsMobile(window.innerWidth < 768);
        checkRes();
        window.addEventListener('resize', checkRes);
        return () => window.removeEventListener('resize', checkRes);
    }, []);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.rentPrice,
            monthlyRent: product.rentPrice,
            quantity: 1,
            duration: parseInt(product.selectedDurationStr) || 1,
            refundableAmount: 0,
            description: product.description
        }));
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/products/${product.id}`);
    };

    return (
        /* Card shell: fixed width, animated height */
        <div
            className="group block relative mx-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            style={{ width: isMobile ? "170px" : "285px" }}
        >
            <motion.div
                animate={isHovered ? "hover" : "initial"}
                initial="initial"
                className="bg-white flex flex-col overflow-hidden relative w-full"
                style={{
                    border: "1px solid hsla(0, 0%, 89%, 1)",
                    borderRadius: isMobile ? "8px" : "20px",
                    backgroundColor: "hsla(0, 0%, 100%, 1)",
                    boxShadow: "0px 1px 2px 0px hsla(0, 0%, 0%, 0.05)",
                    cursor: "pointer",
                    willChange: "transform, height"
                }}
                variants={{
                    initial: { height: isMobile ? 256 : 387 },
                    hover: {
                        height: isMobile ? 330 : 440,
                        transition: { duration: 0.3, ease: [0.45, 1.45, 0.8, 1] }
                    }
                }}
                onClick={() => router.push(`/products/${product.id}`)}
            >
                <div
                    className="relative bg-white group-hover:bg-[#F9F9F9] transition-colors duration-500 flex items-center justify-center overflow-hidden flex-shrink-0"
                    style={{
                        width: isMobile ? "170px" : "285px",
                        height: isMobile ? "184px" : "282px",
                        borderRadius: isMobile ? "8px" : "20px",
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
                            {product.discount || "-20% off"}
                        </span>
                        {product.isNew && (
                            <span
                                className="text-white text-[10px] font-bold shadow-sm leading-none flex items-center justify-center h-full translate-x-1.5"
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

                    {/* Heart Button — top-right */}
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

                    <div
                        className="flex items-center justify-center w-full h-full"
                    >
                        <div
                            className="relative transition-transform duration-700 ease-out group-hover:scale-105"
                            style={{
                                width: isMobile ? "150px" : "240px",
                                height: isMobile ? "140px" : "220px"
                            }}
                        >
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain mix-blend-multiply"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Text Section ──────────────────────────────────────── */}
                <div
                    className="flex flex-col font-sans bg-white shrink-0"
                    style={{
                        width: isMobile ? "170px" : "285px",
                        height: isMobile ? (isHovered ? '146px' : '72px') : (isHovered ? '158px' : '105px'),
                        gap: isMobile ? "4px" : "8px",
                        paddingTop: isMobile ? "4px" : "8px",
                        paddingRight: isMobile ? "8px" : "12px",
                        paddingBottom: isMobile ? "8px" : "12px",
                        paddingLeft: isMobile ? "8px" : "12px",
                        transition: 'height 0.3s ease'
                    }}
                >
                    {/* Product Name */}
                    <h3
                        className="line-clamp-1 group-hover:text-[#FF3B30] transition-colors duration-300 shrink-0 font-sans"
                        style={{
                            width: isMobile ? "154px" : "261px",
                            height: isMobile ? "22px" : "25px",
                            fontSize: isMobile ? "15px" : "18px",
                            fontWeight: 600,
                            lineHeight: isMobile ? "22px" : "25px",
                            letterSpacing: isMobile ? "normal" : "-0.4px",
                            color: "hsla(0, 0%, 16%, 1)"
                        }}
                    >
                        {product.name}
                    </h3>

                    {/* Rating + Delivery */}
                    <div
                        className="flex items-center justify-between shrink-0"
                        style={{ width: isMobile ? "154px" : "261px", height: "16px" }}
                    >
                        <div className="flex items-center gap-1">
                            <div className="flex text-[#FF9500]">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={isMobile ? 12 : 14} weight="fill" className={s <= Math.round(product.rating || 4) ? "" : "opacity-20"} />
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
                                {product.rating || "4.5"} ({product.reviewCount || 12})
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5" style={{ color: "hsla(0, 0%, 46%, 1)" }}>
                            <Truck size={isMobile ? 14 : 16} weight="regular" />
                            <span
                                className="'Mona Sans', sans-serif"
                                style={{
                                    fontSize: "12px",
                                    fontWeight: 500,
                                    lineHeight: "120%",
                                    letterSpacing: "-0.04em"
                                }}
                            >
                                2-4 days
                            </span>
                            <Info size={12} weight="regular" className="opacity-80" />
                        </div>
                    </div>

                    {/* Price row */}
                    <div
                        className="flex items-center shrink-0"
                        style={{
                            width: isMobile ? "154px" : "209px",
                            height: isMobile ? "24px" : "28px",
                            gap: isMobile ? "6px" : "3px",
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
                                    fontSize: isMobile ? "13px" : "16px",
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
                                fontSize: isMobile ? "20px" : "26px",
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
                        className="relative w-full z-30 overflow-hidden flex items-center justify-center transition-all duration-300 ease-out"
                        style={{
                            height: isHovered ? '43px' : '0px',
                            opacity: isHovered ? 1 : 0,
                            paddingTop: isHovered ? '8px' : '0px'
                        }}
                    >
                        <button
                            onClick={handleAddToCart}
                            className="inline-flex items-center justify-center gap-0.5 rounded-full border-b border-black/5 bg-[hsla(44,100%,64%,1)] text-[#1D1D1F] font-medium text-sm py-[6px] px-5 opacity-100 shadow-sm active:scale-95 hover:border-b-2 hover:rounded-4xl hover:bg-[hsla(42,100%,55%,1)] transition-all duration-300 ease-out"
                            style={{
                                width: isMobile ? '100%' : '111px',
                                height: '35px',
                                transform: isHovered ? 'translateY(0)' : 'translateY(15px)'
                            }}
                        >
                            {added ? 'Added!' : 'Rent Now'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProductCard;

