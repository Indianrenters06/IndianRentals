// Bounded pagination matches the API's public catalogue page-size limit.
export async function loadCatalogue(api, { signal, headers, administrative = false, fetcher = fetch } = {}) {
  const products = new Map();
  const route = administrative ? '/api/admin/products' : '/api/products';
  for (let page = 1; page <= 100; page += 1) {
    const response = await fetcher(`${api}${route}?limit=100&${administrative ? 'page' : 'pageNumber'}=${page}`, {
      signal, headers, cache: 'no-store',
    });
    if (!response.ok) throw new Error('Unable to load the product catalogue');
    const data = await response.json();
    if (!Array.isArray(data.products) || data.products.length > 100
      || !Number.isInteger(data.pages) || data.pages < 0 || data.pages > 100) {
      throw new Error('Invalid catalogue pagination');
    }
    for (const product of data.products) products.set(product._id, product);
    if (page >= data.pages) return [...products.values()];
  }
  throw new Error('Catalogue exceeds the supported page count');
}
