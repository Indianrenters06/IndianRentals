"use client";
import createCategoryPage from '../../../../components/CategoryPageTemplate';

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic';

export default createCategoryPage({
    productNamePrefix: "Studio Display",
    productDescription: "27-inch 5K Retina display, 600 nits brightness",
    basePrice: 7500,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
    title: "Studio Display Products"
});
