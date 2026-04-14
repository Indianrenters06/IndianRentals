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

export default function iMacPage() {
    return (
        <CategoryPageTemplate 
            productNamePrefix="iMac"
            productDescription="The all-in-one desktop with a 24-inch 4.5K Retina display."
            basePrice={9000}
            image="https://images.unsplash.com/photo-1527443224154-c4a3942dca76?q=80&w=800&auto=format&fit=crop"
            title="iMac"
        />
    );
}