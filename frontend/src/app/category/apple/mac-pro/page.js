"use client";
import createCategoryPage from '../../../../components/CategoryPageTemplate';

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic';

export default createCategoryPage({
    productNamePrefix: "Mac Pro",
    productDescription: "Intel Xeon W processor, 32GB RAM, Radeon Pro 580X",
    basePrice: 15000,
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=800&auto=format&fit=crop",
    title: "Mac Pro Products"
});
