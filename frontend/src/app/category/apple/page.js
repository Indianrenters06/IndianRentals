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

export default function ApplePage() {
    return (
        <CategoryPageTemplate 
            productNamePrefix="Apple"
            productDescription="Experience the best of Apple products."
            basePrice={5000}
            image="/apple-logo.jpg"
            title="Apple Products"
        />
    );
}