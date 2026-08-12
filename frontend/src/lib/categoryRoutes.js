/**
 * Canonical category → URL slug resolution.
 *
 * Most parent categories in the DB have no `slug` field, and a few that do
 * don't match the route folders that already exist under /app/category
 * (e.g. "Apple Products" lives at /category/apple, not /category/apple-products).
 * Every place that builds a category URL must go through `categorySlug` so the
 * links stay consistent — and so new categories added from admin resolve to the
 * generic /category/[slug] route instead of 404ing.
 */

// DB category name (lowercased) → existing route folder
const ROUTE_ALIASES = {
    'apple': 'apple',
    'apple products': 'apple',
    'it products': 'it-products',
    'av products': 'av-products',
    'office equipment': 'office-equipment',
    'dslr': 'dslr',
    'dslr cameras': 'dslr',
};

export const slugify = (value) =>
    String(value || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

/** Resolve the URL slug for a parent category object (or a plain name). */
export const categorySlug = (category) => {
    if (!category) return '';
    const name = typeof category === 'string' ? category : category.name;
    const alias = ROUTE_ALIASES[String(name || '').toLowerCase().trim()];
    if (alias) return alias;
    return (typeof category === 'object' && category.slug) || slugify(name);
};

/** Resolve the URL slug for a subcategory (these do usually carry a slug). */
export const subcategorySlug = (sub) => {
    if (!sub) return '';
    return sub.slug || slugify(sub.name);
};

/** Link to a parent category page. */
export const categoryHref = (category) => `/category/${categorySlug(category)}`;

/** Link to a subcategory listing, carrying the ObjectId so products can be filtered. */
export const subcategoryHref = (parent, sub) => {
    const base = `/category/${categorySlug(parent)}/${subcategorySlug(sub)}`;
    return sub?._id ? `${base}?subId=${sub._id}` : base;
};

/** True when `slug` from the URL refers to this parent category. */
export const matchesCategorySlug = (category, slug) => {
    if (!category || !slug) return false;
    const target = String(slug).toLowerCase();
    return (
        categorySlug(category) === target ||
        String(category.slug || '').toLowerCase() === target ||
        slugify(category.name) === target
    );
};
