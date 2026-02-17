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

export default function StudioDisplayPage() {
    return (
        <CategoryPageTemplate 
            productNamePrefix="Studio Display"
            productDescription="27-inch 5K Retina display, 12MP Ultra Wide camera."
            basePrice={5000}
            image="https://images.unsplash.com/photo-1547119957-630f9c475d34?q=80&w=800&auto=format&fit=crop"
            title="Studio Display Products"
        />
    );
}