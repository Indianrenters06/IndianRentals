import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [added, setAdded] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => {
        const checkRes = () => setIsMobile(window.innerWidth < 1024);
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
                    borderRadius: isMobile ? "8px" : "16px",
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
                        borderRadius: isMobile ? "8px" : "16px",
                        borderWidth: "0px 1px 1px 1px",
                        borderStyle: "solid",
                        borderColor: "hsla(0, 0%, 93%, 1)",
                        backgroundColor: "hsla(0, 0%, 100%, 1)",
                        opacity: 1,
                        boxShadow: "0px 4px 8px 0px hsla(0, 0%, 87%, 0.1), 0px 15px 15px 0px hsla(0, 0%, 87%, 0.09), 0px 33px 20px 0px hsla(0, 0%, 87%, 0.05), 0px 59px 23px 0px hsla(0, 0%, 87%, 0.01), 0px 91px 26px 0px hsla(0, 0%, 87%, 0)"
                    }}
                >
                    {/* Badges — top-left */}
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
                            {product.discount || "-20% off"}
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

                    {/* Heart Button — top-right */}
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
                        <div style={{ width: '20.6px', height: '17.6px', display: 'flex', alignItems: 'center', justifyItems: 'center', marginTop: '1px' }}>
                            <FaHeart size={18} color="hsla(0, 0%, 0%, 1)" />
                        </div>
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
                    className="flex flex-col font-manrope bg-white shrink-0"
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
                        className="font-manrope line-clamp-1 group-hover:text-[#FF3B30] transition-colors duration-300 shrink-0"
                        style={{
                            width: isMobile ? "154px" : "261px",
                            height: isMobile ? "auto" : "25px",
                            fontSize: isMobile ? "15px" : "18px",
                            fontWeight: 600,
                            lineHeight: isMobile ? "normal" : "25px",
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
                            {!isMobile ? (
                                <div className="flex text-[#FF9F0A]">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <FaStar key={s} size={12} className={s <= Math.round(product.rating || 4) ? "" : "opacity-20"} />
                                    ))}
                                </div>
                            ) : (
                                <FaStar size={10} className="text-[#FF9F0A]" />
                            )}
                            <span className="text-[12px] font-medium text-[#1D1D1F] ml-0.5">
                                {product.rating || "4.5"} <span className="text-[#86868B]">({product.numReviews || product.reviewCount || 12})</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-1 text-[#86868B]">
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 110-4m14 4a2 2 0 104 0m-4 0a2 2 0 110-4" />
                            </svg>
                            <span className="text-[11px] font-medium">2-4 days</span>
                            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="opacity-40 hidden md:block">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
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
                        <span className="text-[10px] md:text-[11px] font-semibold text-[#1D1D1F]">from</span>
                        {product.originalPrice && (
                            <span className="text-[12px] md:text-[17px] font-bold text-[#8E8E93] line-through">₹{product.originalPrice}</span>
                        )}
                        <span className="text-[16px] md:text-[22px] font-bold text-[#FF3B30] leading-none">₹{product.rentPrice}</span>
                        <span className="text-[10px] md:text-[11px] font-semibold text-[#1D1D1F]">/mo</span>
                    </div>

                    {/* Rent Now Button Entrance */}
                    <div 
                        className="relative w-full z-30 overflow-hidden flex items-center transition-all duration-300 ease-out"
                        style={{
                            height: isHovered ? (isMobile ? '44px' : '50px') : '0px',
                            opacity: isHovered ? 1 : 0,
                            paddingTop: isHovered ? '8px' : '0px'
                        }}
                    >
                        <button 
                            onClick={handleAddToCart}
                            className="w-full h-full rounded-full bg-[#FFCF46] text-[#1D1D1F] font-bold text-[14px] shadow-sm transform transition-all duration-300 ease-out active:scale-95 hover:brightness-105"
                            style={{ transform: isHovered ? 'translateY(0)' : 'translateY(15px)' }}
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

