"use client";
import createCategoryPage from '../../../../components/CategoryPageTemplate';

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic';

export default createCategoryPage({
    productNamePrefix: "Mac Studio",
    productDescription: "M2 Max chip, 32GB Unified Memory, 512GB SSD",
    basePrice: 12000,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop",
    title: "Mac Studio Products"
});
