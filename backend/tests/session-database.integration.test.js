const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { loadSource, invoke } = require('./helpers');

// Strict local opt-in, unique disposable database, no production MONGO_URI.
test('Database: captured sessions and recovery races obey persisted revocation', {
    skip: !process.env.TEST_MONGO_URI, timeout: 60000,
}, async t => {
    assert.match(process.env.TEST_MONGO_URI,
        /^mongodb:\/\/(?:127\.0\.0\.1|localhost):\d+\/ir_security_remediation_test(?:\?.*)?$/,
        'Use a local replica set and the dedicated ir_security_remediation_test database');
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.TEST_MONGO_URI, {
        dbName: `ir_security_remediation_test_${crypto.randomUUID().replaceAll('-', '')}`,
        serverSelectionTimeoutMS: 5000,
    });
    t.after(async () => { await mongoose.connection.dropDatabase(); await mongoose.disconnect(); });
    process.env.JWT_SECRET = 'synthetic-local-database-session-secret-not-production';
    const User = require('../models/User');
    const generateToken = require('../utils/generateToken');
    const { protect } = require('../middleware/authMiddleware');
    const controller = loadSource('controllers/authController.js', {
        '../utils/sendEmail': async () => {}, '../utils/sendSMS': async () => {},
        '../utils/sendTemplatedEmail': { sendTemplatedEmail: async () => true },
    });
    await User.createIndexes();
    const response = () => ({ statusCode: 200, cookies: [],
        status(code) { this.statusCode = code; return this; },
        setHeader() {}, cookie(...args) { this.cookies.push(args); },
        json(body) { this.body = body; return this; } });
    let sequence = 0;
    const create = extra => User.create({ name: 'Synthetic session integration',
        email: `session-${++sequence}@example.test`, phone: '9000000000',
        password: 'SyntheticInitial!9', role: 'admin', isActive: true, isBlocked: false, ...extra });
    const issue = user => generateToken(response(), user);
    const authenticate = async (token, transport = 'bearer') => {
        const req = { cookies: transport === 'cookie' ? { jwt: token } : {},
            headers: transport === 'bearer' ? { authorization: `Bearer ${token}` } : {} };
        const res = response(); let error, allowed = false;
        await protect(req, res, err => { error = err; allowed = !err; });
        return { req, res, error, allowed };
    };
    const logout = async req => {
        const res = response(); let error;
        await controller.logoutUser(req, res, err => { error = err; });
        return { res, error };
    };
    await t.test('logout denies captured cookie/bearer JWTs; stale retry preserves replacement', async () => {
        const user = await create(), copied = issue(user);
        const before = await authenticate(copied), secondBefore = await authenticate(copied, 'cookie');
        assert.equal(before.allowed, true);
        const ended = await logout(before.req);
        assert.equal(ended.res.statusCode, 200); assert.equal(ended.error, undefined);
        assert.equal((await authenticate(copied)).res.statusCode, 401);
        assert.equal((await authenticate(copied, 'cookie')).res.statusCode, 401);
        const fresh = await User.findById(user._id);
        assert.equal(fresh.sessionVersion, 1);
        const replacement = issue(fresh);
        assert.equal((await logout(secondBefore.req)).res.statusCode, 401);
        assert.equal((await authenticate(replacement)).allowed, true);
    });
    await t.test('legacy hydration cannot overwrite logout and legacy JWT cannot survive it', async () => {
        const user = await create();
        await User.collection.updateOne({ _id: user._id }, { $unset: { sessionVersion: '' } });
        const stale = await User.findById(user._id);
        assert.equal(stale.sessionVersion, undefined);
        const legacy = jwt.sign({ id: String(user._id) }, process.env.JWT_SECRET);
        const active = await authenticate(legacy);
        assert.equal(active.allowed, true);
        assert.equal((await logout(active.req)).res.statusCode, 200);
        stale.name = 'Synthetic unrelated edit'; await stale.save();
        assert.equal((await User.findById(user._id)).sessionVersion, 1);
        assert.equal((await authenticate(legacy)).res.statusCode, 401);
    });
    await t.test('simultaneous password changes persist both atomic revocation increments', async () => {
        const user = await create(), copied = issue(user);
        const a = await User.findById(user._id).select('+password');
        const b = await User.findById(user._id).select('+password');
        a.password = 'SyntheticChangeA!9'; b.password = 'SyntheticChangeB!9';
        await Promise.all([a.save(), b.save()]);
        const persisted = await User.findById(user._id).select('+password');
        assert.equal(persisted.sessionVersion, 2);
        assert.equal(await bcrypt.compare('SyntheticChangeA!9', persisted.password) ||
            await bcrypt.compare('SyntheticChangeB!9', persisted.password), true);
        assert.equal((await authenticate(copied)).res.statusCode, 401);
        assert.equal((await authenticate(issue(persisted))).allowed, true);
    });
    await t.test('stale password save preserves a completed logout increment', async () => {
        const user = await create(), copied = issue(user);
        const stale = await User.findById(user._id).select('+password');
        const active = await authenticate(copied);
        assert.equal((await logout(active.req)).res.statusCode, 200);
        stale.password = 'SyntheticChangeAfter!9'; await stale.save();
        assert.equal((await User.findById(user._id)).sessionVersion, 2);
        assert.equal((await authenticate(copied)).res.statusCode, 401);
    });
    await t.test('actual recovery handler consumes a code only once during concurrent resets', async () => {
        const user = await create({ emailOtp: '123456', otpPurpose: 'admin_reset',
            otpExpires: new Date(Date.now() + 600000) });
        const copied = issue(user);
        const body = { email: user.email, otp: '123456', newPassword: 'SyntheticReset!9' };
        const results = await Promise.all([invoke(controller.adminResetPassword, { body }), invoke(controller.adminResetPassword, { body })]);
        assert.deepEqual(results.map(result => result.statusCode).sort(), [200, 409]);
        const persisted = await User.findById(user._id).select('+password +emailOtp +otpPurpose +otpExpires');
        assert.equal(persisted.sessionVersion, 1);
        assert.equal(persisted.emailOtp, undefined); assert.equal(persisted.otpPurpose, undefined); assert.equal(persisted.otpExpires, undefined);
        assert.equal(await bcrypt.compare(body.newPassword, persisted.password), true);
        assert.equal((await authenticate(copied)).res.statusCode, 401);
        assert.equal((await authenticate(issue(persisted))).allowed, true);
    });
});
