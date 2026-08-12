'use client';
import React from 'react';
import DynamicCategoryPage from '../../../components/DynamicCategoryPage';
import { getCategories } from '../../../services/categoryService';
import { matchesCategorySlug } from '../../../lib/categoryRoutes';
import { FiPackage } from 'react-icons/fi';

export const dynamic = 'force-dynamic';

/**
 * Generic top-level category page.
 *
 * The five original categories have their own folders (apple, it-products, …)
 * which take precedence over this route. Anything else added from the admin
 * panel lands here instead of 404ing.
 */
export default function GenericCategoryPage({ params }) {
    const { slug } = React.use(params);
    const [category, setCategory] = React.useState(undefined); // undefined = loading, null = not found

    React.useEffect(() => {
        let cancelled = false;
        getCategories()
            .then((cats) => {
                if (cancelled) return;
                const match = (Array.isArray(cats) ? cats : []).find((c) => matchesCategorySlug(c, slug));
                setCategory(match || null);
            })
            .catch(() => { if (!cancelled) setCategory(null); });
        return () => { cancelled = true; };
    }, [slug]);

    if (category === undefined) {
        return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>;
    }

    if (category === null) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
                <FiPackage size={48} className="text-gray-300 mb-4" />
                <h1 className="text-lg font-semibold text-gray-700">Category not found</h1>
                <p className="text-sm text-gray-400 mt-1">
                    Nothing is listed under &quot;{slug}&quot; right now.
                </p>
            </div>
        );
    }

    return (
        <DynamicCategoryPage
            categoryName={category.name}
            displayTitle={category.name}
            categorySlug={slug}
        />
    );
}
