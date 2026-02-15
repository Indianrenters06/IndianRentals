"use client";
import createCategoryPage from '../../../../components/CategoryPageTemplate';

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic';

export default createCategoryPage({
    productNamePrefix: "MacBook Air",
    productDescription: "13.6-inch Liquid Retina display, M2 chip, 8GB RAM",
    basePrice: 5500,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    title: "MacBook Air Products"
});
