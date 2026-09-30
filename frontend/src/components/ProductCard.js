"use client";

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/features/cartSlice';
import RentalProductCard from './RentalProductCard';
import { isProductOutOfStock } from '@/lib/productAvailability';

// Keep catalogue duration selection and booking navigation with the shared card UI.
export default function ProductCard({ product }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isProductOutOfStock(product)) return;
        dispatch(addToCart({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.rentPrice,
            monthlyRent: product.rentPrice,
            quantity: 1,
            duration: parseInt(product.selectedDurationStr) || 1,
            refundableAmount: 0,
            description: product.description,
            sourceUrl: `/products/${product.id}`
        }));
        router.push(`/products/${product.id}`);
    };

    return <RentalProductCard product={product} handleAddToCart={handleAddToCart} />;
}
