"use client";
import createCategoryPage from '../../../../components/CategoryPageTemplate';

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic';

export default createCategoryPage({
    productNamePrefix: "Mac Mini",
    productDescription: "M2 Pro chip, 16GB Unified Memory, 512GB SSD",
    basePrice: 5999,
    image: "/mac-mini-new.jpg",
    title: "Mac Mini Products"
});
