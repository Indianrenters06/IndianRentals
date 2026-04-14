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

export default function MacStudioPage() {
    return (
        <CategoryPageTemplate 
            productNamePrefix="Mac Studio"
            productDescription="M2 Max, 32GB Unified Memory, 512GB SSD"
            basePrice={12000}
            image="/mac-studio.jpg"
            title="Mac Studio"
        />
    );
}