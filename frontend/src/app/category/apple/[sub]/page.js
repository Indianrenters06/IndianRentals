'use client';
import { useSearchParams } from 'next/navigation';
import SubcategoryProductsPage from '../../../../components/SubcategoryProductsPage';
import React from 'react';

export default function AppleSubcategoryPage({ params }) {
    const searchParams = useSearchParams();
    const subId = searchParams.get('subId'); // ObjectId passed from category page link
    const unwrappedParams = React.use(params);
    const subSlug = unwrappedParams.sub;

    // Convert slug to a readable display name
    const displayName = subSlug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    return (
        <SubcategoryProductsPage
            subcategoryId={subId}
            subcategoryName={displayName}
            parentName="Apple"
            parentHref="/category/apple"
        />
    );
}
