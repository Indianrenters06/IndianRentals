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
        return (
            <div
                ref={cardRef}
                style={{
                    width: '100%', cursor: 'pointer', borderRadius: '16px',
                    overflow: 'hidden', background: 'white', display: 'flex',
                    flexDirection: 'column', border: '1px solid hsla(0, 0%, 89%, 1)',
                    boxShadow: '0px 1px 2px 0px hsla(0, 0%, 0%, 0.05)',
                }}
            >
                {/* Image area — tap to reveal Rent Now */}
                <div
                    style={{ position: 'relative', width: '100%', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderBottom: '1px solid hsla(0,0%,93%,1)' }}
                    onClick={() => setIsTapped(prev => !prev)}
                >
                    {/* Discount badge */}
                    <div style={{ position: 'absolute', zIndex: 20, top: '10px', left: '10px' }}>
                        <span style={{
                            minWidth: '52px', height: '22px', borderRadius: '27px', padding: '3px 9px',
                            background: 'hsla(3, 86%, 51%, 1)', color: 'hsla(4,100%,97%,1)',
                            fontFamily: "'Mona Sans', sans-serif", fontWeight: 600, fontSize: '10px',
                            letterSpacing: '0.02em', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {product.discount || '20% off'}
                        </span>
                    </div>

                    {/* Product image */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain mix-blend-multiply"
                                sizes="(max-width: 768px) 50vw, 285px"
                            />
                        </div>
                    </div>

                    {/* Rent Now overlay — slides up on tap */}
                    <div
                        style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            padding: '6px 8px 8px',
                            background: 'linear-gradient(to top, rgba(255,255,255,0.92) 60%, transparent 100%)',
                            transform: isTapped ? 'translateY(0)' : 'translateY(100%)',
                            transition: 'transform 0.25s cubic-bezier(0.33, 1, 0.68, 1)',
                            zIndex: 30,
                        }}
                    >
                        <button
                            onClick={(e) => { e.stopPropagation(); handleAddToCart(e); setIsTapped(false); }}
                            style={{
                                width: '100%', height: '34px', borderRadius: '100px',
                                background: 'hsla(44,100%,64%,1)', border: '1px solid rgba(0,0,0,0.07)',
                                fontFamily: "'Mona Sans', sans-serif", fontWeight: 500, fontSize: '12px',
                                color: 'hsla(0, 0%, 12%, 1)', cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                            }}
                        >
                            {added ? 'Added!' : 'Rent Now'}
                        </button>
                    </div>
                </div>

                {/* Text area — tap to navigate */}
                <div
                    onClick={() => router.push(`/products/${product.id}`)}
                    style={{ display: 'flex', flexDirection: 'column', background: 'white', padding: '8px 8px 10px', gap: '5px' }}
                >
                    <h3
                        className="line-clamp-1"
                        style={{ fontSize: '14px', fontWeight: 600, lineHeight: '20px', letterSpacing: '-0.3px', color: 'hsla(0,0%,16%,1)', fontFamily: "'Mona Sans', sans-serif", margin: 0 }}
                    >
                        {product.name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Star size={12} weight="fill" style={{ color: '#FF9500', flexShrink: 0 }} />
                            <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: '11px', fontWeight: 500, color: 'hsla(0,0%,33%,1)', letterSpacing: '-0.01em' }}>
                                {product.rating || '4.5'} ({product.reviewCount || 12})
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'hsla(0,0%,65%,1)' }}>
                            <Truck size={12} weight="regular" />
                            <span style={{ fontSize: '11px', fontWeight: 400, letterSpacing: '-0.04em' }}>2-4 days</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', overflow: 'hidden', gap: '2px', flexWrap: 'nowrap' }}>
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: '10px', fontWeight: 500, color: 'hsla(0,0%,0%,1)', letterSpacing: '-0.01em', flexShrink: 0 }}>from</span>
                        {product.originalPrice && (
                            <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: '11px', fontWeight: 600, color: 'hsla(0,0%,46%,1)', letterSpacing: '-0.04em', flexShrink: 0, textDecoration: 'line-through' }}>
                                ₹{product.originalPrice}
                            </span>
                        )}
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: '17px', fontWeight: 700, color: 'hsla(3,100%,56%,1)', letterSpacing: '-0.04em', flexShrink: 0 }}>
                            ₹{product.rentPrice}
                        </span>
                        <span style={{ fontFamily: "'Mona Sans', sans-serif", fontSize: '10px', fontWeight: 500, color: 'hsla(0,0%,24%,1)', flexShrink: 0 }}>/month</span>
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
