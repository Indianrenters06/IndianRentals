"use client";
import nextDynamic from 'next/dynamic';

const CategoryPageTemplate = nextDynamic(() => import('../../../../components/CategoryPageTemplate'), {
    ssr: false,
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>
});

export const dynamic = 'force-dynamic';

export default function ProDisplayXDRPage() {
    return (
        <CategoryPageTemplate 
            productNamePrefix="Pro Display XDR"
            productDescription="32-inch 6K Retina display, up to 1600 nits brightness."
            basePrice={15000}
            image="/xdr.jpg"
            title="Pro Display XDR Products"
        />
    );
}