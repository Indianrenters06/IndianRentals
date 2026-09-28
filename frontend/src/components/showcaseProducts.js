const ALIASES = {
    apple: ['apple', 'macbook', 'ipad', 'iphone', 'mac studio', 'mac mini'],
    gaming: ['gaming', 'rog', 'legion', 'alienware', 'omen', 'msi'],
    smart: ['smart', 'tablet', 'watch', 'earbud', 'phone'],
};

const normalized = (value) => String(value || '').toLowerCase().trim();

export function productsForShowcaseSlide(slide, slideIndex, products, legacyProductIds = []) {
    const byId = new Map(products.map(product => [String(product._id), product]));
    const selected = slide?.productIds?.length
        ? slide.productIds
        : slideIndex === 0 ? legacyProductIds : [];

    if (selected.length) {
        return selected.map(id => byId.get(String(id))).filter(Boolean).slice(0, 2);
    }

    const category = normalized(slide?.category);
    const slideText = normalized(`${slide?.title || ''} ${slide?.href || ''}`);
    const group = Object.keys(ALIASES).find(key => category.includes(key) || slideText.includes(key));
    const terms = group ? ALIASES[group] : category ? [category] : [];

    // Empty or unrecognised banners require an explicit product selection in admin.
    if (!terms.length) return [];

    return products.filter(product => {
        const searchable = normalized(`${product.name} ${product.category} ${product.brand || ''} ${product.subcategory?.name || ''}`);
        return terms.some(term => searchable.includes(term));
    }).slice(0, 2);
}
