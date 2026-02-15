"use client";
import createCategoryPage from '../../../../components/CategoryPageTemplate';

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic';

export default createCategoryPage({
    productNamePrefix: "Pro Display XDR",
    productDescription: "32-inch Retina 6K display, 1600 nits peak brightness",
    basePrice: 25000,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
    title: "Pro Display XDR Products"
});
