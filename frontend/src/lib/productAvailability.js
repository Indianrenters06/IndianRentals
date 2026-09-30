export function isProductOutOfStock(product) {
    if (product?.stock === null || product?.stock === undefined || product?.stock === '') return false;
    const stock = Number(product.stock);
    return Number.isFinite(stock) && stock <= 0;
}

export function availableFirst(products) {
    return [...products].sort((a, b) => Number(isProductOutOfStock(a)) - Number(isProductOutOfStock(b)));
}
