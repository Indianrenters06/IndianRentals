"use client";
import createCategoryPage from '../../../../components/CategoryPageTemplate';

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic';

export default createCategoryPage({
    productNamePrefix: "iPhone",
    productDescription: "6.1-inch Super Retina XDR display, A16 Bionic chip",
    basePrice: 4500,
    image: "https://images.unsplash.com/photo-1592286927505-2fd0d113e4e7?q=80&w=800&auto=format&fit=crop",
    title: "iPhone Products"
});
