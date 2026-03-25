"use client";
import React from 'react';
import Image from 'next/image';
import { FaHeart, FaStar } from 'react-icons/fa';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/features/cartSlice';
import Button from './common/Button';

const ProductCard = ({ product }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [added, setAdded] = React.useState(false);

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
            duration: parseInt(product.selectedDurationStr) || 1, // Default 1 month
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
        <div className="bg-fuchsia-50 rounded-[28px] p-3 border border-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 relative flex flex-col h-full group hover:-translate-y-1">
            <div className="absolute top-5 left-5 z-10"><span className="bg-[#FF3B30] text-white text-[10px] font-light px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">{product.discount}</span></div>
            <button className="absolute top-5 right-5 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-[#FF3B30] transition-colors duration-200" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}><FaHeart size={14} /></button>
            <Link href={`/products/${product.id}`} className="contents">
                <div className="relative w-full aspect-7/8 mb-3 flex items-center justify-center rounded-[32px] overflow-hidden cursor-pointer">
                    <div className="absolute inset-0 pointer-events-none" />
                    <Image src={product.image} alt={product.name} fill className="object-contain p-6 pb-6 group-hover:scale-105 transition-transform duration-500 drop-shadow-xl mix-blend-multiply" />
                </div>
                <div className="flex flex-col flex-1 px-1 pb-4 cursor-pointer">
                    <h3 className="text-[17px] font-semibold text-[#1D1D1F] mb-1.5 leading-snug tracking-tight line-clamp-2 transition-all duration-300 group-hover:text-[#FF3B30]">{product.name}</h3>
                    
                    <div className="flex items-center gap-1.5 mb-2.5 transition-all duration-300">
                        <div className="flex text-[#FF9500]">
                            {[1, 2, 3, 4, 5].map(s => (
                                <FaStar key={s} size={13} className={s <= Math.round(product.rating || 4) ? "" : "opacity-30"} />
                            ))}
                        </div>
                        <span className="text-[11px] font-semibold text-gray-500">{product.rating || "4.2"}({product.numReviews || 0})</span>
                    </div>

                    <p className="text-[11px] line-clamp-2 leading-relaxed text-[#86868B] mb-3">{product.description}</p>
                    <div className="mt-auto">
                        {/* Normal Price View */}
                        <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1 transition-all duration-300 mb-4">
                            <span className="text-[13px] text-[#86868B] font-medium">from</span>
                            <span className="text-[13px] text-[#86868B] line-through font-medium">₹{product.originalPrice}</span>
                            <span className="text-[19px] font-bold text-[#FF3B30]">₹{product.rentPrice}</span>
                            <span className="text-[13px] text-[#86868B] font-medium">/month</span>
                        </div>

                        {/* Action Buttons - persistent space at bottom */}
                        <div className="flex gap-2 transition-all duration-500 ease-out z-20">
                            <Button 
                                variant="black"
                                size="md"
                                className="flex-1 !rounded-xl !min-w-0"
                                onClick={handleQuickView}
                            >
                                Quick View
                            </Button>
                            <Button 
                                variant={added ? 'ghost' : 'yellow'}
                                size="md"
                                className={`flex-1 !rounded-xl !min-w-0 ${added ? 'bg-green-500 !text-white' : ''}`}
                                onClick={handleAddToCart}
                            >
                                {added ? 'Added!' : 'Add to Cart'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
