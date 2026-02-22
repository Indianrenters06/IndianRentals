'use client';
import { useSearchParams } from 'next/navigation';
import SubcategoryProductsPage from '../../../../components/SubcategoryProductsPage';

export default function OfficeSubcategoryPage({ params }) {
    const searchParams = useSearchParams();
    const subId = searchParams.get('subId');
    const subSlug = params.sub;

    const displayName = subSlug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    return (
        <SubcategoryProductsPage
            subcategoryId={subId}
            subcategoryName={displayName}
            parentName="Office Equipment"
            parentHref="/category/office-equipment"
        />
    );
}
