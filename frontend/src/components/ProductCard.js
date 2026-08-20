"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/features/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../redux/features/wishlistSlice';
import { Star, Truck } from '@phosphor-icons/react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Image from 'next/image';

const ProductCard = ({ product, mobile }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const isWishlisted = useSelector(selectIsWishlisted(product.id));
    const [added, setAdded] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isTapped, setIsTapped] = React.useState(false);
    const cardRef = React.useRef(null);

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleWishlist(product));
    };

    React.useEffect(() => {
        if (!isTapped) return;
        const handleOutside = (e) => {
            if (cardRef.current && !cardRef.current.contains(e.target)) {
                setIsTapped(false);
            }
        };
        document.addEventListener('touchstart', handleOutside);
        document.addEventListener('mousedown', handleOutside);
        return () => {
            document.removeEventListener('touchstart', handleOutside);
            document.removeEventListener('mousedown', handleOutside);
        };
    }, [isTapped]);

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
        router.push(`/products/${product.id}`);
    };

    /* ── MOBILE CARD ── */
    if (mobile) {
        const isHoveredOrTapped = isHovered || isTapped;
        return (
            <div
                ref={cardRef}
                onClick={() => router.push(`/products/${product.id}`)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={() => setIsTapped(prev => !prev)}
                style={{
                    width: '100%',
                    maxWidth: '170px',
                    height: '256px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0px',
                    background: '#FFFFFF',
                    border: '1px solid #E2E2E2',
                    boxShadow: isHoveredOrTapped ? '0px 8px 16px rgba(0, 0, 0, 0.1)' : '0px 1px 2px rgba(0, 0, 0, 0.05)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    margin: '0 auto',
                    position: 'relative',
                    transition: 'box-shadow 0.3s ease'
                }}
            >
                {/* Frame 5 — Image Container */}
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '184px',
                        background: '#FFFFFF',
                        borderWidth: '0px 1px 1px 1px',
                        borderStyle: 'solid',
                        borderColor: '#EEEEEE',
                        boxShadow: '0px 59px 23px rgba(222, 222, 222, 0.01), 0px 33px 20px rgba(222, 222, 222, 0.05), 0px 15px 15px rgba(222, 222, 222, 0.09), 0px 4px 8px rgba(222, 222, 222, 0.1)',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                        flexShrink: 0,
                        overflow: 'hidden',
                        zIndex: 2
                    }}
                >
                    {/* Badges - 20% off */}
                    <div
                        style={{
                            position: 'absolute',
                            width: '39px',
                            height: '18px',
                            left: '10px',
                            top: '10px',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '2px 6px',
                            gap: '10px',
                            background: '#ED2115',
                            boxShadow: '0px 5px 2px rgba(120, 120, 120, 0.01), 0px 3px 2px rgba(120, 120, 120, 0.05), 0px 1px 1px rgba(120, 120, 120, 0.09), 0px 0px 1px rgba(120, 120, 120, 0.1)',
                            borderRadius: '27px',
                            zIndex: 10
                        }}
                    >
                        <span
                            style={{
                                width: '27px',
                                height: '14px',
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: 600,
                                fontSize: '8px',
                                lineHeight: '14px',
                                letterSpacing: '-0.4px',
                                color: '#FFF2F1',
                                whiteSpace: 'nowrap',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {product.discount || '20% off'}
                        </span>
                    </div>

                    {/* Product Image */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '24px',
                            bottom: '36px',
                            left: '8px',
                            right: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain mix-blend-multiply"
                            style={{
                                transform: isHoveredOrTapped ? 'scale(1.05)' : 'scale(1)',
                                transition: 'transform 0.4s ease'
                            }}
                            sizes="170px"
                        />
                    </div>

                    {/* Rent Now Golden Yellow Pill Button — Slides up smoothly into view inside image box on hover/tap */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(e);
                        }}
                        style={{
                            position: 'absolute',
                            bottom: '8px',
                            left: '50%',
                            transform: isHoveredOrTapped ? 'translate(-50%, 0)' : 'translate(-50%, 45px)',
                            opacity: isHoveredOrTapped ? 1 : 0,
                            pointerEvents: isHoveredOrTapped ? 'auto' : 'none',
                            transition: 'transform 0.3s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.25s ease',
                            width: '155px',
                            maxWidth: 'calc(100% - 14px)',
                            height: '30px',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '4px 20px',
                            gap: '2px',
                            background: '#FFCF46',
                            border: 'none',
                            borderRadius: '28px',
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: '12px',
                            lineHeight: '18px',
                            letterSpacing: '-0.4px',
                            color: '#141414',
                            cursor: 'pointer',
                            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.12)',
                            zIndex: 10
                        }}
                        className="active:scale-95 hover:bg-[#ffc72e]"
                    >
                        {added ? 'Added!' : 'Rent Now'}
                    </button>
                </div>

                {/* Frame 86 — Text Details Container */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: '4px 8px 8px',
                        gap: '4px',
                        width: '100%',
                        height: '72px',
                        boxSizing: 'border-box'
                    }}
                >
                    {/* Product Name */}
                    <h3
                        style={{
                            width: '100%',
                            height: '16px',
                            fontFamily: "'Mona Sans', sans-serif",
                            fontWeight: 600,
                            fontSize: '10px',
                            lineHeight: '16px',
                            letterSpacing: '-0.4px',
                            color: '#333333',
                            margin: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {product.name}
                    </h3>

                    {/* Frame 678 — Reviews & Delivery */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0px',
                            gap: '4px',
                            width: '100%',
                            height: '16px'
                        }}
                    >
                        {/* Reviews */}
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 0, gap: '4px' }}>
                            <Star size={12} weight="fill" color="#FF920A" />
                            <span
                                style={{
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontWeight: 500,
                                    fontSize: '8px',
                                    lineHeight: '14px',
                                    letterSpacing: '-0.4px',
                                    color: '#545454'
                                }}
                            >
                                {product.rating || '4.5'} ({product.reviewCount || 12})
                            </span>
                        </div>

                        {/* Delivery */}
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 0, gap: '2px' }}>
                            <Truck size={10} weight="regular" color="#AFAFAF" />
                            <span
                                style={{
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontWeight: 500,
                                    fontSize: '8px',
                                    lineHeight: '14px',
                                    letterSpacing: '-0.4px',
                                    color: '#AFAFAF'
                                }}
                            >
                                2-4 days
                            </span>
                            <Info size={10} color="#10B981" style={{ opacity: 0.7 }} />
                        </div>
                    </div>

                    {/* Frame 85 — Price Row */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: '0px',
                            gap: '3px',
                            width: '100%',
                            height: '20px'
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: 500,
                                fontSize: '8px',
                                lineHeight: '14px',
                                letterSpacing: '-0.4px',
                                color: '#545454'
                            }}
                        >
                            from
                        </span>
                        {product.originalPrice && (
                            <span
                                style={{
                                    fontFamily: "'Mona Sans', sans-serif",
                                    fontWeight: 600,
                                    fontSize: '10px',
                                    lineHeight: '16px',
                                    letterSpacing: '-0.4px',
                                    textDecorationLine: 'line-through',
                                    color: '#757575'
                                }}
                            >
                                ₹{product.originalPrice}
                            </span>
                        )}
                        <span
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: 600,
                                fontSize: '14px',
                                lineHeight: '20px',
                                letterSpacing: '-0.8px',
                                color: '#FF2C20'
                            }}
                        >
                            ₹{product.rentPrice}
                        </span>
                        <span
                            style={{
                                fontFamily: "'Mona Sans', sans-serif",
                                fontWeight: 500,
                                fontSize: '8px',
                                lineHeight: '14px',
                                letterSpacing: '-0.4px',
                                color: '#757575'
                            }}
                        >
                            /month
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    /* ── DESKTOP CARD ── */
    const CARD_W = 285;
    const CARD_H = 387;
    const HOVER_H = 446;
    const LIFT = 12;

    return (
        <div
            style={{
                width: `${CARD_W}px`,
                height: `${CARD_H}px`,
                position: 'relative',
                flexShrink: 0,
                cursor: 'pointer',
                overflow: 'visible',
                zIndex: isHovered ? 50 : 1,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => router.push(`/products/${product.id}`)}
        >
            <motion.div
                animate={isHovered ? 'hover' : 'initial'}
                initial="initial"
                className="absolute left-0 right-0 bg-white flex flex-col overflow-hidden rounded-[20px]"
                style={{ top: 0, border: '1px solid hsla(0, 0%, 89%, 1)', borderRadius: '20px', willChange: 'height, transform, box-shadow' }}
                variants={{
                    initial: { height: CARD_H, y: 0, boxShadow: '0px 1px 2px 0px hsla(0, 0%, 0%, 0.05)' },
                    hover: { height: HOVER_H, y: -LIFT, boxShadow: '0px 16px 32px -8px hsla(0, 0%, 0%, 0.14)', transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] } },
                }}
            >
                {/* Image area */}
                <div
                    className="relative flex items-center justify-center overflow-hidden flex-shrink-0"
                    style={{ width: `${CARD_W}px`, height: 282, borderRadius: '20px', backgroundColor: isHovered ? 'hsla(0,0%,98%,1)' : 'hsla(0,0%,100%,1)', transition: 'background-color 0.4s', borderBottom: '1px solid hsla(0,0%,93%,1)' }}
                >
                    {/* Badges */}
                    <div className="absolute z-20 flex items-center" style={{ top: '14.57px', left: '13.49px', gap: '4px' }}>
                        <span style={{ height: '24px', borderRadius: '27px', padding: '4px 10px', background: '#ED2115', color: '#FFF2F1', fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '12px', lineHeight: '16px', letterSpacing: '-0.4px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {product.discount || '-20% off'}
                        </span>
                        {(product.isNew || product.condition === 'New') && (
                            <span style={{ height: '24px', borderRadius: '27px', padding: '4px 10px', background: '#00B505', color: '#E8FFE4', fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '12px', lineHeight: '16px', letterSpacing: '-0.4px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                New
                            </span>
                        )}
                    </div>

                    {/* Heart */}
                    <button
                        className="absolute z-20 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-300"
                        style={{ width: '33px', height: '33px', top: '10.57px', right: '11.51px', backgroundColor: '#F6F6F6', border: '1px solid #EEEEEE', borderRadius: '100%', padding: '6px' }}
                        onClick={handleToggleWishlist}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                        aria-pressed={isWishlisted}
                    >
                        {isWishlisted
                            ? <HeartIconSolid className="w-5 h-5" style={{ color: '#ED2115' }} />
                            : <HeartIcon className="w-5 h-5 text-black" strokeWidth={1.5} />}
                    </button>

                    {/* Product image */}
                    <div style={{ width: 240, height: 220, position: 'relative', transform: isHovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.5s ease' }}>
                        <Image src={product.image} alt={product.name} fill className="object-contain mix-blend-multiply" sizes="285px" />
                    </div>
                </div>

                {/* Text area */}
                <div className="flex flex-col font-sans bg-white" style={{ padding: '8px 12px 12px', gap: '8px' }}>
                    <h3 className="line-clamp-1" style={{ fontSize: '18px', fontWeight: 600, lineHeight: '25px', letterSpacing: '-0.8px', color: '#292929' }}>
                        {product.name}
                    </h3>

                    <div className="flex items-center justify-between" style={{ height: '16px' }}>
                        <div className="flex items-center justify-between" style={{ width: '128px' }}>
                            <div className="flex items-center gap-[2px] text-[#FF9500]">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} size={16} weight="fill" className={s <= Math.round(product.rating || 4) ? '' : 'opacity-20'} />
                                ))}
                            </div>
                            <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#545454', letterSpacing: '-0.4px' }}>
                                {product.rating || '4.5'} ({product.reviewCount || 12})
                            </span>
                        </div>
                        <div className="flex items-center gap-[4px]" style={{ color: '#afafaf' }}>
                            <Truck size={16} weight="regular" />
                            <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', fontWeight: 500, letterSpacing: '-0.48px' }}>2-4 days</span>
                        </div>
                    </div>

                    <div className="flex items-center" style={{ gap: '3px' }}>
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#000000', letterSpacing: '-0.4px' }}>from</span>
                        {product.originalPrice && (
                            <span className="line-through decoration-[1.5px]" style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#757575', letterSpacing: '-0.4px' }}>
                                ₹{product.originalPrice}
                            </span>
                        )}
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: '21px', fontWeight: 600, lineHeight: '28px', color: '#ff2c20', letterSpacing: '-0.8px' }}>
                            ₹{product.rentPrice}
                        </span>
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#757575', letterSpacing: '-0.4px' }}>/month</span>
                    </div>

                    {/* Rent Now — slides in on hover */}
                    <motion.div
                        animate={{ height: isHovered ? 43 : 0, opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
                        style={{ overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}
                    >
                        <button
                            onClick={handleAddToCart}
                            className="w-full active:scale-95 transition-transform"
                            style={{ height: '38px', borderRadius: '100px', background: 'hsla(44,100%,64%,1)', border: '1px solid rgba(0,0,0,0.07)', fontFamily: "'Mona Sans', sans-serif", fontWeight: 500, fontSize: '14px', color: 'hsla(0, 0%, 12%, 1)', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', flexShrink: 0 }}
                        >
                            {added ? 'Added!' : 'Rent Now'}
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProductCard;
