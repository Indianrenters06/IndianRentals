'use client';
import { useSearchParams } from 'next/navigation';
import SubcategoryProductsPage from '../../../../components/SubcategoryProductsPage';
import React from 'react';

export default function DSLRSubcategoryPage({ params }) {
    const searchParams = useSearchParams();
    const subId = searchParams.get('subId');
    const unwrappedParams = React.use(params);
    const subSlug = unwrappedParams.sub;

    const displayName = subSlug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    return (
        <SubcategoryProductsPage
            subcategoryId={subId}
            subcategoryName={displayName}
            parentName="DSLR"
            parentHref="/category/dslr"
        />
    );
}
