const test = require('node:test');
const assert = require('node:assert/strict');
const { loadSource, invoke, serveRouter } = require('./helpers');
function reviewedController(source, overrides) {
    const supplied = { ...overrides, mongoose: { ...require('mongoose'), connection: { transaction: fn => fn({ synthetic: true }) } },
        '../services/kycAssets': { ...require('../services/kycAssets'), validateDocuments: async () => ({}) } };
    if (source === 'adminController') supplied['./kycController'] = loadSource('controllers/kycController.js', supplied);
    return loadSource(`controllers/${source}.js`, supplied);
}

function fixture(role) {
    const target = { _id: 'target', role, email: 'original@example.test', phone: '9000000000', kyc: {},
        async save() { mutations++; return this; }, async deleteOne() { mutations++; } };
    let mutations = 0;
    const query = (value) => ({ select() { return this; }, sort() { return this; },
        then(resolve, reject) { return Promise.resolve(value).then(resolve, reject); } });
    const User = {
        findById: () => query(target),
        findByIdAndUpdate: (id, update) => { mutations++; Object.assign(target, update.$set); return query(target); },
        findByIdAndDelete: async () => { mutations++; },
        findOneAndUpdate(filter, update) {
            if (filter.role !== target.role) return query(null);
            mutations++; Object.assign(target, update.$set); return query(target);
        },
        findOneAndDelete: async filter => { if (filter.role !== target.role) return null; mutations++; return target; },
        find(filter) { return query(filter.role === target.role ? [target] : []); },
    };
    const overrides = { '../models/User': User };
    // The policy module does not exist on the vulnerable baseline.
    try { overrides['../utils/customerAccess'] = loadSource('utils/customerAccess.js', overrides); }
    catch (err) { if (err.code !== 'ENOENT') throw err; }
    return { target, User, overrides, mutations: () => mutations,
        modern: loadSource('controllers/adminController.js', overrides),
        legacy: loadSource('controllers/userController.js', overrides) };
}

test('S2: status/orders routes reject privileged targets, including when actor is full admin', async (t) => {
    const f = fixture('super_admin');
    const middleware = require('../middleware/authMiddleware');
    let actor = { role: 'staff', adminPermissions: ['users', 'orders'] };
    const router = loadSource('routes/adminRoutes.js', { ...f.overrides,
        '../controllers/adminController': f.modern,
        '../middleware/authMiddleware': { ...middleware, protect(req, res, next) { req.user = actor; next(); } },
    });
    const request = await serveRouter(t, router, '/api/admin');
    for (const role of ['staff', 'admin']) {
        actor = { ...actor, role };
        const response = await request('/users/target/status', { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'block' }) });
        assert.equal(response.status, 403);
        assert.equal((await request('/users/target/orders')).status, 403);
    }
    assert.equal(f.mutations(), 0);
    assert.equal(f.target.isBlocked, undefined);
});

for (const variant of ['modern', 'legacy']) {
    test(`S2: ${variant} refuses a target promoted concurrently with an edit`, async () => {
        const f = fixture('customer');
        f.User.findOneAndUpdate = (filter) => {
            assert.equal(filter.role, 'customer');
            f.target.role = 'admin';
            return { select() { return this; }, then(resolve) { resolve(null); } };
        };
        const result = await invoke(f[variant].updateUser, { user: { role: 'admin' }, params: { id: 'target' }, body: { email: 'attacker@example.test' } });
        assert.equal(result.statusCode, 409);
        assert.equal(f.mutations(), 0);
    });
}

for (const source of ['adminController', 'kycController']) {
    test(`S2: ${source} permits authorized KYC updates for a customer`, async () => {
        const f = fixture('customer');
        let kycWrites = 0;
        const record = { _id: 'kyc', user: 'target', status: 'pending', updatedAt: new Date('2026-10-01T00:00:00.000Z'), documents: { identityProof: 'aaaaaaaaaaaaaaaaaaaaaaaa' },
            async save() { kycWrites++; return this; }, async populate() { return this; } };
        const controller = reviewedController(source, { ...f.overrides,
            '../models/KYC': { findById: async () => record },
            '../utils/sendTemplatedEmail': { sendTemplatedEmail() {} },
        });
        const result = await invoke(controller.updateKYCStatus, { user: { role: 'staff', adminPermissions: ['kyc'] },
            params: { id: 'kyc' }, body: { status: 'approved', expectedUpdatedAt: '2026-10-01T00:00:00.000Z' } });
        assert.equal(result.statusCode, 200);
        assert.equal(f.mutations(), 1);
        assert.equal(kycWrites, 1);
        assert.equal(record.status, 'approved');
    });
    for (const role of ['super_admin', 'admin', 'staff']) {
        test(`S2: ${source} cannot modify KYC linked to ${role}`, async () => {
            const f = fixture(role);
            let kycWrites = 0;
            const record = { _id: 'kyc', user: 'target', status: 'pending', updatedAt: new Date('2026-10-01T00:00:00.000Z'), documents: { identityProof: 'aaaaaaaaaaaaaaaaaaaaaaaa' }, async save() { kycWrites++; return this; } };
            const controller = reviewedController(source, { ...f.overrides, '../models/KYC': { findById: async () => record } });
            const result = await invoke(controller.updateKYCStatus, { user: { role: 'staff', adminPermissions: ['kyc'] }, params: { id: 'kyc' }, body: { status: 'approved', expectedUpdatedAt: '2026-10-01T00:00:00.000Z' } });
            assert.equal(result.statusCode, 403);
            assert.equal(kycWrites, 0);
            assert.equal(f.mutations(), 0);
        });
    }
    test(`S2: ${source} refuses concurrent promotion before KYC synchronization`, async () => {
        const f = fixture('customer');
        let kycWrites = 0;
        f.User.findOneAndUpdate = filter => {
            assert.equal(filter.role, 'customer');
            f.target.role = 'admin';
            return Promise.resolve(null);
        };
        const record = { _id: 'kyc', user: 'target', status: 'pending', updatedAt: new Date('2026-10-01T00:00:00.000Z'), documents: { identityProof: 'aaaaaaaaaaaaaaaaaaaaaaaa' }, async save() { kycWrites++; return this; } };
        const controller = reviewedController(source, { ...f.overrides, '../models/KYC': { findById: async () => record } });
        const result = await invoke(controller.updateKYCStatus, { user: { role: 'staff', adminPermissions: ['kyc'] }, params: { id: 'kyc' }, body: { status: 'approved', expectedUpdatedAt: '2026-10-01T00:00:00.000Z' } });
        assert.equal(result.statusCode, 409);
        assert.equal(kycWrites, 0);
    });
}

for (const role of ['admin', 'super_admin', 'staff', 'operations_manager', 'sales_executive', 'finance_executive']) {
    for (const variant of ['modern', 'legacy']) {
        test(`S2: users staff cannot read/edit/delete ${role} through ${variant} customer API`, async () => {
            const f = fixture(role);
            const req = { user: { _id: 'staff', role: 'staff', adminPermissions: ['users', 'kyc'] }, params: { id: 'target' },
                body: { email: 'attacker@example.test', phone: '9999999999', status: 'approved' } };
            for (const action of ['getUserById', 'updateUser', 'deleteUser', ...(variant === 'legacy' ? ['updateKYCStatus'] : [])]) {
                const result = await invoke(f[variant][action], req);
                assert.equal(result.statusCode, 403, action);
                assert.equal(result.body, undefined, action);
            }
            assert.equal(f.mutations(), 0);
            assert.equal(f.target.email, 'original@example.test');
        });
    }
}

for (const variant of ['modern', 'legacy']) {
    test(`S2: ${variant} customer edits need actor permission and allow an actual customer target`, async () => {
        const f = fixture('customer');
        const req = { params: { id: 'target' }, body: { email: 'next@example.test' },
            user: { role: 'staff', adminPermissions: [] } };
        assert.equal((await invoke(f[variant].updateUser, req)).statusCode, 403);
        assert.equal(f.mutations(), 0);
        req.user.adminPermissions = ['users'];
        assert.equal((await invoke(f[variant].updateUser, req)).statusCode, 200);
        assert.equal(f.target.email, 'next@example.test');
    });
    test(`S2: ${variant} customer list excludes privileged accounts`, async () => {
        const f = fixture('super_admin');
        const result = await invoke(f[variant].getAllUsers, { user: { role: 'staff', adminPermissions: ['users'] } });
        assert.deepEqual(result.body, []);
    });
}
