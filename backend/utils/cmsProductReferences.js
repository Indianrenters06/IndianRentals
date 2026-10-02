const Product = require('../models/Product');
const FIELDS = ['bestRentedProductIds', 'newLaunchProductIds', 'featuredShowcaseProductIds'];
async function validateProductReferences(content) {
    const ids = [];
    for (const field of FIELDS) {
        const values = content[field] || [];
        if (!Array.isArray(values) || values.length > 40 || values.some(id => typeof id !== 'string' || !/^[a-f\d]{24}$/i.test(id))) {
            const error = new Error(`Invalid product selections in ${field}`); error.statusCode = 400; throw error;
        }
        ids.push(...values);
    }
    const unique = [...new Set(ids)];
    if (!unique.length) return;
    const available = await Product.find({ _id: { $in: unique }, isActive: { $ne: false } }).select('_id');
    const found = new Set(available.map(product => String(product._id)));
    if (unique.some(id => !found.has(id))) { const error = new Error('Replace missing or unpublished selected products before publishing'); error.statusCode = 409; throw error; }
}
module.exports = { validateProductReferences };
