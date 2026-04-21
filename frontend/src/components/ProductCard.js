import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/features/cartSlice';
import { Heart, Star, Truck } from '@phosphor-icons/react';
import { HeartIcon } from '@heroicons/react/24/outline';
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

    const CARD_W = isMobile ? 170 : 285;
    const CARD_H = isMobile ? 250 : 387;
    const HOVER_H = isMobile ? 250 : 446;  // exact bounding necessary to render full 12px bottom padding + gap
    const LIFT = isMobile ? 0 : 12;   // lifts upward

    return (
        /*
         * Outer shell: FIXED size — grid/Swiper only sees this.
         * overflow:visible so the card can grow beyond it without layout impact.
         * The card overflows visually (up from lift, down from growth) but the
         * shell's reserved space never changes → nothing below moves.
         */
        <div
            style={{
                width: `${CARD_W}px`,
                height: `${CARD_H}px`,
                position: 'relative',
                flexShrink: 0,
                cursor: 'pointer',
                overflow: 'visible',    // ← lets card overflow without layout shift
                zIndex: isHovered ? 50 : 1, // Elevates card above siblings on hover
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onClick={() => router.push(`/products/${product.id}`)}
        >
            {/* Card: lifts UP + grows DOWN to reveal Rent Now */}
            <motion.div
                animate={isHovered ? 'hover' : 'initial'}
                initial="initial"
                className="absolute left-0 right-0 bg-white flex flex-col overflow-hidden rounded-[20px]"
                style={{
                    top: 0,
                    border: '1px solid hsla(0, 0%, 89%, 1)',
                    borderRadius: '20px',
                    willChange: 'height, transform, box-shadow',
                }}
                variants={{
                    initial: {
                        height: CARD_H,
                        y: 0,
                        boxShadow: '0px 1px 2px 0px hsla(0, 0%, 0%, 0.05)',
                    },
                    hover: {
                        height: HOVER_H,           // grows to show Rent Now
                        y: -LIFT,                  // lifts up
                        boxShadow: '0px 16px 32px -8px hsla(0, 0%, 0%, 0.14)',
                        transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
                    },
                }}
            >
                {/* ── Image area ── */}
                <div
                    className="relative flex items-center justify-center overflow-hidden flex-shrink-0"
                    style={{
                        width: `${CARD_W}px`,
                        height: isMobile ? 184 : 282,
                        borderRadius: '20px',
                        backgroundColor: isHovered ? 'hsla(0,0%,98%,1)' : 'hsla(0,0%,100%,1)',
                        transition: 'background-color 0.4s',
                        borderBottom: '1px solid hsla(0,0%,93%,1)',
                    }}
                >
                    {/* Badges */}
                    <div className="absolute z-20 flex items-center" style={{ top: isMobile ? '12px' : '14px', left: isMobile ? '13px' : '14px', gap: '4px' }}>
                        <span style={{ minWidth: '45px', height: '24px', borderRadius: '27px', padding: '4px 10px', background: 'hsla(3, 86%, 51%, 1)', color: 'hsla(4,100%,97%,1)', fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '10px', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {product.discount || '−20% off'}
                        </span>
                        {(product.isNew || product.condition === 'New') && (
                            <span style={{ width: '45px', height: '24px', borderRadius: '27px', padding: '4px 10px', backgroundColor: 'hsla(122,100%,35%,1)', color: '#fff', fontWeight: 600, fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                New
                            </span>
                        )}
                    </div>

                    {/* Heart */}
                    <button
                        className="absolute z-20 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-300"
                        style={{ width: '36px', height: '36px', top: '11px', right: '12px', backgroundColor: 'hsla(0,0%,96%,1)', border: '0.2px solid hsla(0,0%,80%,1)', borderRadius: '100%', padding: '4px' }}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                        <HeartIcon className="w-[32px] h-[32px] text-black" strokeWidth={1} />
                    </button>

                    {/* Product image */}
                    <div style={{ width: isMobile ? 140 : 240, height: isMobile ? 140 : 220, position: 'relative', transform: isHovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.5s ease' }}>
                        <Image src={product.image} alt={product.name} fill className="object-contain mix-blend-multiply" />
                    </div>
                </div>

                {/* ── Text area ── */}
                <div
                    className="flex flex-col font-sans bg-white"
                    style={{ padding: isMobile ? '4px 8px 8px' : '8px 12px 12px', gap: isMobile ? '4px' : '8px' }}
                >
                    <h3
                        className="line-clamp-1"
                        style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 600, lineHeight: isMobile ? '23px' : '25px', letterSpacing: '-0.4px', color: 'hsla(0,0%,16%,1)' }}
                    >
                        {product.name}
                    </h3>

                    <div className="flex items-center justify-between" style={{ height: '16px' }}>
                        <div className="flex items-center gap-1">
                            <div className="flex text-[#FF9500]">
                                {isMobile
                                    ? <Star size={12} weight="fill" />
                                    : [1, 2, 3, 4, 5].map(s => <Star key={s} size={14} weight="fill" className={s <= Math.round(product.rating || 4) ? '' : 'opacity-20'} />)
                                }
                            </div>
                            <span style={{ fontFamily: "'Mona Sans',sans-serif", fontSize: '11px', fontWeight: 500, color: 'hsla(0,0%,33%,1)', letterSpacing: '-0.01em', marginLeft: '4px' }}>
                                {product.rating || '4.5'} ({product.reviewCount || 12})
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5" style={{ color: 'hsla(0,0%,65%,1)' }}>
                            <Truck size={isMobile ? 14 : 16} weight="regular" />
                            <span style={{ fontSize: '12px', fontWeight: 400, letterSpacing: '-0.04em' }}>2-4 days</span>
                        </div>
                    </div>

                    <div className="flex items-center" style={{ gap: isMobile ? '8px' : '3px', marginTop: '-4px' }}>
                        <span style={{ fontFamily: "'Mona Sans',sans-serif", fontSize: '11px', fontWeight: 500, color: 'hsla(0,0%,0%,1)', letterSpacing: '-0.01em' }}>from</span>
                        {product.originalPrice && (
                            <span className="line-through decoration-[1.5px]" style={{ fontFamily: "'Mona Sans',sans-serif", fontSize: isMobile ? '13px' : '16px', fontWeight: 600, color: 'hsla(0,0%,46%,1)', letterSpacing: '-0.04em' }}>
                                ₹{product.originalPrice}
                            </span>
                        )}
                        <span style={{ fontFamily: "'Mona Sans',sans-serif", fontSize: isMobile ? '20px' : '26px', fontWeight: 600, color: 'hsla(3,100%,56%,1)', letterSpacing: '-0.04em', marginLeft: '4px' }}>
                            ₹{product.rentPrice}
                        </span>
                        <span style={{ fontFamily: "'Mona Sans',sans-serif", fontSize: '11px', fontWeight: 500, color: 'hsla(0,0%,24%,1)', letterSpacing: '-0.01em', marginLeft: '2px' }}>/month</span>
                    </div>

                    {/* Rent Now — slides in as card grows downward */}
                    {!isMobile && (
                        <div
                            style={{
                                overflow: 'hidden',
                                height: isHovered ? '43px' : '0px',
                                opacity: isHovered ? 1 : 0,
                                transition: 'height 0.28s ease, opacity 0.2s ease',
                                display: 'flex',
                                alignItems: 'flex-end',
                            }}
                        >
                            <button
                                onClick={handleAddToCart}
                                className="w-full active:scale-95 transition-transform"
                                style={{
                                    height: '38px',
                                    borderRadius: '100px',
                                    background: 'hsla(44,100%,64%,1)',
                                    border: '1px solid rgba(0,0,0,0.07)',
                                    fontFamily: "'Mona Sans',sans-serif",
                                    fontWeight: 500,
                                    fontSize: '14px',
                                    color: 'hsla(0, 0%, 12%, 1)',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    flexShrink: 0,
                                }}
                            >
                                {added ? 'Added!' : 'Rent Now'}
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ProductCard;
