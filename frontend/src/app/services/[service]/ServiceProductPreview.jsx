'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react';
import RentalProductCard from '@/components/RentalProductCard';
import { getProducts } from '@/services/productService';

export default function ServiceProductPreview({ category, keyword, categoryHref, categoryLabel, fallbackImage }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        async function loadProducts() {
            try {
                const response = await getProducts({ ...(category ? { category } : {}), ...(keyword ? { keyword } : {}), limit: 4 });
                if (active) setProducts(Array.isArray(response) ? response.slice(0, 4) : (response.products || []).slice(0, 4));
            } catch {
                if (active) setProducts([]);
            } finally {
                if (active) setLoading(false);
            }
        }
        loadProducts();
        return () => { active = false; };
    }, [category, keyword]);

    if (loading) {
        return (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4 xl:gap-6" aria-label="Loading available equipment">
                {[0, 1, 2, 3].map((item) => (
                    <div key={item} className="aspect-[3/4] animate-pulse rounded-[20px] bg-[#f6f6f6] motion-reduce:animate-none" />
                ))}
            </div>
        );
    }

    if (!products.length) {
        return (
            <div className="flex flex-col gap-5 rounded-[22px] border border-[#e5e5e5] bg-[#f6f6f6] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                <p className="max-w-xl text-[16px] leading-6 text-[#545454]">
                    Browse the current catalogue to check available equipment and rental details.
                </p>
                <Link href={categoryHref} className="inline-flex min-h-12 shrink-0 items-center gap-2 self-start rounded-full bg-[#141414] px-5 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#333333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] sm:self-auto">
                    {categoryLabel}<ArrowUpRight size={18} weight="bold" aria-hidden="true" />
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4 xl:gap-6">
            {products.map((product) => (
                <RentalProductCard
                    key={product._id}
                    fallbackImage={fallbackImage}
                    product={{
                        id: product._id,
                        name: product.name,
                        category: product.category,
                        image: product.images?.[0] || fallbackImage,
                        rating: product.rating ?? 0,
                        reviews: product.numReviews ?? 0,
                        originalPrice: product.originalRentalPrice || null,
                        rentPrice: product.rentalPrice,
                        discount: product.pageLayout?.discountText || product.discount || '',
                        deliveryTime: product.deliveryTime || '2-4 days',
                        isNew: product.condition === 'New',
                    }}
                />
            ))}
        </div>
    );
}
