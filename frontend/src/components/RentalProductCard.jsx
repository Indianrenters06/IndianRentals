"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Info, Star, Truck } from '@phosphor-icons/react';
import { toggleWishlist, selectIsWishlisted } from '@/redux/features/wishlistSlice';
import styles from './RentalProductCard.module.css';

export default function RentalProductCard({ product, handleAddToCart, cardW, fallbackImage }) {
    const dispatch = useDispatch();
    const isWishlisted = useSelector(selectIsWishlisted(product.id));
    const [failedImage, setFailedImage] = useState(null);
    const imageSrc = failedImage === product.image ? fallbackImage : product.image || fallbackImage;
    const rating = Math.max(0, Math.min(5, Number(product.rating) || 0));
    const reviews = product.reviews ?? product.reviewCount ?? 0;
    const hasOriginalPrice = Number(product.originalPrice) > Number(product.rentPrice);
    return (
        <div className={styles.frame} style={cardW ? { width: cardW, maxWidth: '100%' } : undefined}>
            <article className={styles.card}>
                <div className={styles.image}>
                    <Link href={`/products/${product.id}`} aria-label={`View ${product.name}`} className={styles.imageLink}>
                        <Image src={imageSrc} alt={product.name} fill unoptimized className={styles.productImage} onError={() => {
                            if (fallbackImage && imageSrc !== fallbackImage) setFailedImage(product.image);
                        }} />
                    </Link>
                    <div className={styles.badges}>
                        {product.discount && <span>{product.discount}</span>}
                        {(product.isNew || product.condition === 'New') && <span className={styles.new}>New</span>}
                    </div>
                    <button type="button" className={styles.wishlist} aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`} aria-pressed={isWishlisted} onClick={() => dispatch(toggleWishlist(product))}>
                        <span><Heart size={22} weight={isWishlisted ? 'fill' : 'regular'} aria-hidden="true" /></span>
                    </button>
                </div>
                <div className={styles.content}>
                    <h3><Link href={`/products/${product.id}`}>{product.name}</Link></h3>
                    <div className={styles.metadata}>
                        <span className={styles.rating} aria-label={`Rated ${rating} out of 5, ${reviews} reviews`}>
                            <span className={styles.stars} aria-hidden="true">
                                {Array.from({ length: 5 }, (_, index) => <span className={styles.star} key={index}>
                                    <Star size={16} weight="fill" />
                                    <span style={{ width: `${Math.min(1, Math.max(0, rating - index)) * 100}%` }}><Star size={16} weight="fill" /></span>
                                </span>)}
                            </span>
                            <span>{rating} ({reviews})</span>
                        </span>
                        <span className={styles.delivery} title="Estimated delivery time"><Truck size={16} aria-hidden="true" />{product.deliveryTime || '2-4 days'}<Info size={12} className={styles.deliveryInfo} aria-hidden="true" /></span>
                    </div>
                    <div className={styles.price}>
                        <span className={styles.from}>from</span>
                        {hasOriginalPrice && <del>₹{product.originalPrice}</del>}
                        <strong>₹{product.rentPrice}</strong><span>/month</span>
                    </div>
                    <div className={styles.action}><div className={styles.actionInner}>
                        {handleAddToCart
                            ? <button type="button" className={styles.rent} onClick={event => handleAddToCart(event, product)}>Rent Now</button>
                            : <Link href={`/products/${product.id}`} className={styles.rent}>Rent Now</Link>}
                    </div></div>
                </div>
            </article>
        </div>
    );
}
