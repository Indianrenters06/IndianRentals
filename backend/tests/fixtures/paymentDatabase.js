// Synthetic data for the disposable, opt-in local database test only.
const user = { name: 'Synthetic Customer', email: 'synthetic@example.test', phone: '9000000000',
    password: 'LocalTestOnly2026!', role: 'customer' };
const product = { name: 'Synthetic laptop', description: 'Synthetic test only', category: 'IT Products',
    rentalPrice: 1000, securityDeposit: 2000, stock: 10, isActive: true, images: ['/test.webp'], city: 'Delhi', state: 'Delhi' };
module.exports = { user, product };
