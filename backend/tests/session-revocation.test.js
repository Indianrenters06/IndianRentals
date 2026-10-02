const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { loadSource, invoke } = require('./helpers');

process.env.JWT_SECRET = 'synthetic-local-session-test-secret-not-a-production-credential';
const id = '000000000000000000000001';
const base = () => ({ _id: id, name: 'Synthetic', email: 'synthetic@example.test', phone: '9000000000',
    role: 'admin', authProvider: 'local', isActive: true, isBlocked: false,
    password: '$2b$10$syntheticExistingHash', emailOtp: '123456', otpPurpose: 'admin_reset',
    otpExpires: new Date(Date.now() + 60000) });

// Replace only MongoDB's external collection I/O. The real Mongoose schema,
// validation, password hook and update construction still run.
function fixture(t, initial = {}) {
    const stored = { ...base(), ...initial };
    const writes = [];
    let fail = false;
    const matches = (row, filter) => Object.entries(filter).every(([key, value]) => {
        if (key === '$or') return value.some(part => matches(row, part));
        if (value && typeof value === 'object' && '$exists' in value) return (row[key] !== undefined) === value.$exists;
        if (value instanceof Date) return +row[key] === +value;
        return String(row[key]) === String(value);
    });
    const update = async (filter, changes) => {
        if (fail) throw new Error('Synthetic database unavailable');
        writes.push({ filter, changes });
        if (!matches(stored, filter)) return { acknowledged: true, matchedCount: 0, modifiedCount: 0 };
        Object.assign(stored, changes.$set);
        for (const key of Object.keys(changes.$unset || {})) delete stored[key];
        for (const [key, amount] of Object.entries(changes.$inc || {})) stored[key] = (stored[key] || 0) + amount;
        return { acknowledged: true, matchedCount: 1, modifiedCount: 1 };
    };
    const original = User.collection.updateOne;
    User.collection.updateOne = update;
    t.after(() => { User.collection.updateOne = original; });
    const query = () => ({ select() { return this; }, then(resolve) { resolve(User.hydrate(stored)); } });
    const Model = { findOne: query, findById: query, updateOne: update };
    const controller = loadSource('controllers/authController.js', { '../models/User': Model });
    const auth = loadSource('middleware/authMiddleware.js', { '../models/User': Model });
    const response = () => ({ statusCode: 200, cookies: [], status(n) { this.statusCode = n; return this; },
        setHeader() {}, cookie(...args) { this.cookies.push(args); }, json(value) { this.body = value; return this; } });
    const issue = () => { const res = response(); return generateToken(res, User.hydrate(stored)); };
    const protect = async (token, transport = 'bearer') => {
        const req = { cookies: transport === 'cookie' ? { jwt: token } : {},
            headers: transport === 'bearer' ? { authorization: `Bearer ${token}` } : {} };
        const res = response();
        let error, allowed = false;
        await auth.protect(req, res, err => { error = err; allowed = !err; });
        return { req, res, error, allowed };
    };
    const logout = async req => {
        const res = response(); let error;
        await controller.logoutUser(req, res, err => { error = err; });
        return { res, error };
    };
    return { stored, writes, issue, protect, logout, controller, Model, fail: () => { fail = true; } };
}

test('S13: every central JWT carries the current persisted session version', t => {
    const f = fixture(t, { sessionVersion: 3 });
    const token = jwt.verify(f.issue(), process.env.JWT_SECRET);
    assert.equal(token.sessionVersion, 3);
    assert.equal(token.exp - token.iat, 30 * 24 * 60 * 60);
    assert.equal(User.hydrate(base()).sessionVersion, undefined);
    assert.equal(new User(base()).sessionVersion, 0);
});

for (const transport of ['bearer', 'cookie']) {
    test(`S13: logout invalidates a captured ${transport} JWT before acknowledging success`, async t => {
        const f = fixture(t);
        const copied = f.issue();
        const before = await f.protect(copied, transport);
        assert.equal(before.allowed, true);
        const ended = await f.logout(before.req);
        assert.equal(ended.res.statusCode, 200);
        assert.equal(ended.res.cookies.length, 1);
        assert.equal(f.stored.sessionVersion, 1);
        assert.equal((await f.protect(copied, transport)).res.statusCode, 401);
        assert.equal((await f.protect(f.issue(), transport)).allowed, true);
    });
}

test('S13: legacy JWTs work only at version zero; future, malformed and omitted claims fail after revocation', async t => {
    const f = fixture(t);
    const legacy = jwt.sign({ id }, process.env.JWT_SECRET);
    assert.equal((await f.protect(legacy)).allowed, true);
    f.stored.sessionVersion = 1;
    for (const claim of [undefined, 0, 2, -1, 1.5, '1', null]) {
        const token = jwt.sign({ id, ...(claim === undefined ? {} : { sessionVersion: claim }) }, process.env.JWT_SECRET);
        assert.equal((await f.protect(token)).res.statusCode, 401, String(claim));
    }
    assert.equal((await f.protect(f.issue())).allowed, true);
});

test('S13: failed logout retains the cookie and refuses a success acknowledgement', async t => {
    const f = fixture(t);
    const current = await f.protect(f.issue());
    f.fail();
    const result = await f.logout(current.req);
    assert.equal(result.res.statusCode, 503);
    assert.equal(result.res.cookies.length, 0);
    assert.equal(result.res.body, undefined);
    assert.ok(result.error);
    assert.equal(f.stored.sessionVersion, undefined);
});

test('S13: concurrent logout retries do not revoke a newly issued replacement session', async t => {
    const f = fixture(t);
    const a = await f.protect(f.issue());
    const b = await f.protect(f.issue());
    assert.equal((await f.logout(a.req)).res.statusCode, 200);
    const replacement = f.issue();
    assert.equal((await f.logout(b.req)).res.statusCode, 401);
    assert.equal(f.stored.sessionVersion, 1);
    assert.equal((await f.protect(replacement)).allowed, true);
});

test('S13: actual reset handler saves password hash and revocation atomically, then rejects copied JWTs', async t => {
    const f = fixture(t, { sessionVersion: 4 });
    const copied = f.issue();
    const result = await invoke(f.controller.adminResetPassword,
        { body: { email: f.stored.email, otp: '123456', newPassword: 'NewSynthetic!9' } });
    assert.equal(result.statusCode, 200);
    assert.equal(f.stored.sessionVersion, 5);
    assert.equal(await bcrypt.compare('NewSynthetic!9', f.stored.password), true);
    const write = f.writes[0];
    assert.equal(write.changes.$inc.sessionVersion, 1);
    assert.equal(write.filter.emailOtp, '123456');
    assert.equal(write.filter.otpPurpose, 'admin_reset');
    assert.equal(f.stored.emailOtp, undefined);
    assert.equal((await f.protect(copied)).res.statusCode, 401);
    assert.equal((await f.protect(f.issue())).allowed, true);
});

test('S13: two simultaneous resets can consume a recovery code only once', async t => {
    const f = fixture(t);
    const body = { email: f.stored.email, otp: '123456', newPassword: 'NewSynthetic!9' };
    const results = await Promise.all([invoke(f.controller.adminResetPassword, { body }), invoke(f.controller.adminResetPassword, { body })]);
    assert.deepEqual(results.map(result => result.statusCode).sort(), [200, 409]);
    assert.equal(f.stored.sessionVersion, 1);
});

test('S13: invalid password/reset save never consumes OTP or increments the version', async t => {
    const f = fixture(t);
    const result = await invoke(f.controller.adminResetPassword,
        { body: { email: f.stored.email, otp: '123456', newPassword: 'weak' } });
    assert.ok(result.error);
    assert.equal(f.writes.length, 0);
    assert.equal(f.stored.emailOtp, '123456');
    assert.equal(f.stored.sessionVersion, undefined);
});

test('S13: actual admin password edit revokes sessions through the shared model hook', async t => {
    const f = fixture(t, { sessionVersion: 2 });
    const copied = f.issue();
    const admin = loadSource('controllers/adminController.js', { '../models/User': f.Model });
    const result = await invoke(admin.updateTeamMember,
        { user: { role: 'super_admin' }, params: { id }, body: { password: 'ChangedSynthetic!9' } });
    assert.equal(result.statusCode, 200);
    assert.equal(f.stored.sessionVersion, 3);
    assert.equal((await f.protect(copied)).res.statusCode, 401);
});

test('S13: stale unrelated saves cannot reset a concurrent logout version to zero', async t => {
    const f = fixture(t);
    const stale = User.hydrate(f.stored);
    const current = await f.protect(f.issue());
    await f.logout(current.req);
    stale.name = 'Updated synthetic';
    await stale.save();
    assert.equal(f.stored.sessionVersion, 1);
    assert.equal(f.writes[1].changes.$set.sessionVersion, undefined);
});

test('S13: simultaneous password changes preserve both atomic revocation increments', async t => {
    const f = fixture(t);
    const a = User.hydrate(f.stored), b = User.hydrate(f.stored);
    a.password = 'ChangedSynthetic!9'; b.password = 'AnotherSynthetic!9';
    await Promise.all([a.save(), b.save()]);
    assert.equal(f.stored.sessionVersion, 2);
    assert.equal(f.writes.every(write => write.changes.$inc.sessionVersion === 1), true);
});


test('S13: reset database failures never acknowledge success or consume credentials', async t => {
    const f = fixture(t, { sessionVersion: 7 });
    const copied = f.issue();
    f.fail();
    const result = await invoke(f.controller.adminResetPassword,
        { body: { email: f.stored.email, otp: '123456', newPassword: 'NewSynthetic!9' } });
    assert.ok(result.error);
    assert.equal(result.body, undefined);
    assert.equal(f.stored.sessionVersion, 7);
    assert.equal(f.stored.emailOtp, '123456');
    assert.equal((await f.protect(copied)).allowed, true);
});

test('S13: corrupt persisted versions fail closed for access and token issuance', async t => {
    const f = fixture(t, { sessionVersion: 0 });
    const copied = f.issue();
    f.stored.sessionVersion = -1;
    assert.equal((await f.protect(copied)).res.statusCode, 401);
    assert.throws(() => f.issue(), /Invalid session version/);
});
