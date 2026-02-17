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

export default function MacMiniPage() {
    return (
        <CategoryPageTemplate 
            productNamePrefix="Mac Mini"
            productDescription="M2 Pro chip, 16GB Unified Memory, 512GB SSD"
            basePrice={5999}
            image="/mac-mini-new.jpg"
            title="Mac Mini Products"
        />
    );
}