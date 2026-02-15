"use client";
import nextDynamic from 'next/dynamic';

const CategoryPageTemplate = nextDynamic(() => import('../../../../components/CategoryPageTemplate'), {
    ssr: false,
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>
});

export const dynamic = 'force-dynamic';

export default function MacBookProPage() {
    return (
        <CategoryPageTemplate 
            productNamePrefix="MacBook Pro"
            productDescription="M2 Pro or M2 Max chip for next-level performance."
            basePrice={8000}
            image="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop"
            title="MacBook Pro Products"
        />
    );
}