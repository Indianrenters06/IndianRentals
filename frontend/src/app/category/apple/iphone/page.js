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

export default function iPhonePage() {
    return (
        <CategoryPageTemplate 
            productNamePrefix="iPhone"
            productDescription="Experience the power of iPhone with advanced camera systems."
            basePrice={4000}
            image="/iphone.jpg"
            title="iPhone"
        />
    );
}