"use client";
import createCategoryPage from '../../../../components/CategoryPageTemplate';

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic';

export default createCategoryPage({
    productNamePrefix: "MacBook Pro",
    productDescription: "14-inch Liquid Retina XDR display, M3 Pro chip",
    basePrice: 8500,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    title: "MacBook Pro Products"
});
