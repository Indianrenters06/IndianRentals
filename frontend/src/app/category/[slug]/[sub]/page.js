'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import SubcategoryProductsPage from '../../../../components/SubcategoryProductsPage';
import { getCategories } from '../../../../services/categoryService';
import { matchesCategorySlug, subcategorySlug } from '../../../../lib/categoryRoutes';

export const dynamic = 'force-dynamic';

/**
 * Generic subcategory listing for any category that doesn't have its own folder.
 */
export default function GenericSubcategoryPage({ params }) {
    const searchParams = useSearchParams();
    const { slug, sub } = React.use(params);
    const subIdFromUrl = searchParams.get('subId');

    const [resolved, setResolved] = React.useState(null);

    React.useEffect(() => {
        let cancelled = false;
        getCategories()
            .then((cats) => {
                if (cancelled) return;
                const parent = (Array.isArray(cats) ? cats : []).find((c) => matchesCategorySlug(c, slug));
                const match = (parent?.subcategories || []).find((s) => subcategorySlug(s) === sub);
                if (parent) setResolved({ parentName: parent.name, subId: match?._id, subName: match?.name });
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, [slug, sub]);

    // Title from the URL until the DB answers, so the page renders immediately.
    const fallbackName = sub
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    return (
        <SubcategoryProductsPage
            subcategoryId={subIdFromUrl || resolved?.subId}
            subcategoryName={resolved?.subName || fallbackName}
            parentName={resolved?.parentName || fallbackName}
            parentHref={`/category/${slug}`}
        />
    );
}
