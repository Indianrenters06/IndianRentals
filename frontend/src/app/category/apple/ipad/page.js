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

export default function iPadPage() {
    return (
        <CategoryPageTemplate 
            productNamePrefix="iPad"
            productDescription="10.9-inch Liquid Retina display, A14 Bionic chip"
            basePrice={3500}
            image="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop"
            title="iPad Products"
        />
    );
}