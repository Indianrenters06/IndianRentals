"use client";
import nextDynamic from 'next/dynamic';

const CategoryPageTemplate = nextDynamic(
    () => import('@/components/CategoryPageTemplate'),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        ),
    }
);

export const dynamic = 'force-dynamic';

export default function MacBookAirPage() {
    return (
        <CategoryPageTemplate 
            productNamePrefix="MacBook Air"
            productDescription="Supercharged by M2, 13-inch Liquid Retina display."
            basePrice={6000}
            image="https://images.unsplash.com/photo-1611186871348-b1ec696e52c9?q=80&w=800&auto=format&fit=crop"
            title="MacBook Air Products"
        />
    );
}