import { productsForShowcaseSlide, showcaseSearchTerms, showcaseSelectedIds } from '../components/showcaseProducts.js';

// Fetch only relevant collections. Limits also protect against legacy CMS payloads
// containing excessive banners; an exhausted collection retains its empty state.
export async function loadShowcaseCatalogue(api, banners, legacyProductIds = [], fetcher = fetch) {
    const products = new Map();
    const requests = new Map();
    const deadline = Date.now() + 10000;
    let requestCount = 0;
    const request = async parameters => {
        const query = new URLSearchParams(parameters).toString();
        if (requests.has(query)) return requests.get(query);
        if (requestCount >= 32 || Date.now() >= deadline) return { products: [], pages: 0 };
        requestCount++;
        const pending = (async () => {
            try {
                const response = await fetcher(`${api}/api/products?${query}`, { signal: AbortSignal.timeout(Math.max(1, Math.min(5000, deadline - Date.now()))) });
                if (!response.ok) return { products: [], pages: 0 };
                const data = await response.json();
                const rows = Array.isArray(data.products) ? data.products.filter(product => product?._id && product.isActive !== false) : [];
                return { products: rows.slice(0, Number(parameters.limit)), pages: Number(data.pages) || 1 };
            } catch { return { products: [], pages: 0 }; }
        })();
        requests.set(query, pending);
        return pending;
    };
    const append = rows => rows.forEach(product => products.set(String(product._id), product));
    const selectedIds = [...new Set(banners.flatMap((slide, index) => showcaseSelectedIds(slide, index, legacyProductIds)))]
        .filter(id => typeof id === 'string' && /^[a-f\d]{24}$/i.test(id));
    for (let offset = 0; offset < selectedIds.length && requestCount < 32; offset += 40) {
        const ids = selectedIds.slice(offset, offset + 40);
        const data = await request({ ids: ids.join(','), limit: '40' });
        append(data.products.filter(product => ids.includes(String(product._id))));
    }
    for (const [index, slide] of banners.entries()) {
        // A missing explicit selection must never be replaced by an unrelated item.
        if (showcaseSelectedIds(slide, index, legacyProductIds).length) continue;
        const hasEnough = () => productsForShowcaseSlide(slide, index, [...products.values()], legacyProductIds).length >= 2;
        if (hasEnough()) continue;
        const category = String(slide?.category || '').trim();
        if (category && category.length <= 100 && !category.includes(',')) {
            const data = await request({ category, limit: '20' });
            append(data.products.filter(product => productsForShowcaseSlide(slide, index, [product]).length));
        }
        for (const term of showcaseSearchTerms(slide)) {
            if (hasEnough() || requestCount >= 32) break;
            if (!term || term.length > 100) continue;
            for (let page = 1; page <= 2; page++) {
                const data = await request({ keyword: term, limit: '20', pageNumber: String(page) });
                // Keyword search includes description, but slide matching deliberately
                // uses name/category/brand/subcategory. Keep that exact UI contract.
                append(data.products.filter(product => productsForShowcaseSlide(slide, index, [product]).length));
                if (hasEnough() || page >= data.pages || requestCount >= 32) break;
            }
        }
    }
    return [...products.values()].sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0));
}
