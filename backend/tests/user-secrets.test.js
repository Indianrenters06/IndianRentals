const test = require('node:test');
const assert = require('node:assert/strict');
const User = require('../models/User');
const { loadSource, invoke } = require('./helpers');

const secrets = { password: 'synthetic-password', emailOtp: '123456', phoneOtp: '654321', otpExpires: new Date(Date.now() + 60000), otpAttempts: 1,
    otpPurpose: 'login', recoveryToken: 'synthetic-recovery', resetToken: 'synthetic-reset', futureSecret: 'never-public' };
function assertNoSecrets(body) {
    for (const key of Object.keys(secrets)) assert.equal(JSON.stringify(body).includes(`"${key}"`), false, key);
}

test('S3: model serialization allowlists even explicitly selected secrets', () => {
    const user = new User({ name: 'Synthetic', email: 'synthetic@example.test', ...secrets });
    assertNoSecrets(user.toJSON());
    assertNoSecrets(user.toObject());
    for (const field of ['emailOtp', 'phoneOtp', 'otpExpires', 'otpAttempts', 'otpPurpose']) {
        assert.equal(User.schema.path(field).options.select, false, field);
    }
});

for (const variant of ['adminController', 'userController']) {
    test(`S3: ${variant} read/update DTOs exclude verification and unknown future fields`, async () => {
        const target = { _id: 'target', name: 'Synthetic', role: 'customer', email: 'synthetic@example.test', ...secrets,
            addresses: [{ addressLine: 'Synthetic Road', resetToken: 'nested-secret' }], kyc: { status: 'pending', resetToken: 'nested-secret' } };
        const query = value => ({ select() { return this; }, sort() { return this; }, then(resolve) { resolve(value); } });
        const Model = { findById: () => query(target), find: () => query([target]), findOneAndUpdate: () => query(target) };
        const overrides = { '../models/User': Model };
        overrides['../utils/customerAccess'] = loadSource('utils/customerAccess.js', overrides);
        const controller = loadSource(`controllers/${variant}.js`, overrides);
        const req = { user: { role: 'admin' }, params: { id: 'target' }, body: { name: 'Updated' } };
        for (const action of ['getAllUsers', 'getUserById', 'updateUser', ...(variant === 'adminController' ? ['getTeamMembers'] : ['getUserProfile'])]) {
            const result = await invoke(controller[action], req);
            assert.equal(result.statusCode, 200, action);
            assertNoSecrets(result.body);
        }
    });
}

function authFixture(purpose = 'login') {
    const stored = { _id: 'synthetic', name: 'Synthetic', email: 'synthetic@example.test', role: 'admin', ...secrets, otpPurpose: purpose,
        async save() { Object.assign(stored, this); return this; } };
    let selected = '';
    const query = () => ({ select(fields) { selected = fields; return this; }, then(resolve) {
        const user = Object.fromEntries(Object.entries(stored).filter(([key]) => !Object.hasOwn(secrets, key) || selected.includes(`+${key}`)));
        resolve(user);
    } });
    const controller = loadSource('controllers/authController.js', {
        '../models/User': { findOne: query, findById: query },
        '../utils/generateToken': () => 'synthetic-session',
        '../utils/sendTemplatedEmail': { sendTemplatedEmail: async () => true },
    });
    return { controller, stored };
}

test('S3: login verification intentionally selects OTPs and returns a safe session DTO', async () => {
    const { controller } = authFixture();
    const result = await invoke(controller.verifyLoginOtp, { body: { identifier: 'synthetic@example.test', otp: '123456' } });
    assert.equal(result.statusCode, 200);
    assert.equal(result.body.token, 'synthetic-session');
    assertNoSecrets(result.body);
});

test('S3: admin reset intentionally selects OTP fields without returning them', async () => {
    const { controller } = authFixture('admin_reset');
    const result = await invoke(controller.adminResetPassword, { body: { email: 'synthetic@example.test', otp: '123456', newPassword: 'NewSynthetic!9' } });
    assert.equal(result.statusCode, 200);
    assertNoSecrets(result.body);
});

test('S3: admin recovery code cannot be exchanged as a login OTP', async () => {
    const { controller } = authFixture('admin_reset');
    const result = await invoke(controller.verifyLoginOtp, { body: { identifier: 'synthetic@example.test', otp: '123456' } });
    assert.equal(result.statusCode, 400);
    assert.equal(result.body, undefined);
});

test('S3: two-channel signup and phone login still verify deliberately selected fields', async () => {
    const signup = authFixture('signup');
    const verified = await invoke(signup.controller.verifyOtp, { body: { userId: 'synthetic', emailOtp: '123456', phoneOtp: '654321' } });
    assert.equal(verified.statusCode, 200);
    assertNoSecrets(verified.body);
    const phone = authFixture('login');
    const result = await invoke(phone.controller.verifyLoginOtp, { body: { identifier: '9000000000', otp: '654321' } });
    assert.equal(result.statusCode, 200);
    assertNoSecrets(result.body);
});

test('S3: wrong, expired, empty and consumed OTPs cannot issue sessions', async () => {
    const f = authFixture();
    for (let i = 0; i < 4; i++) {
        const result = await invoke(f.controller.verifyLoginOtp, { body: { identifier: 'synthetic@example.test', otp: '000000' } });
        assert.equal(result.statusCode, i === 3 ? 429 : 400);
    }
    assert.equal(f.stored.emailOtp, undefined);
    assert.equal((await invoke(f.controller.verifyLoginOtp, { body: { identifier: 'synthetic@example.test', otp: '' } })).statusCode, 400);
    const expired = authFixture();
    expired.stored.otpExpires = new Date(0);
    assert.equal((await invoke(expired.controller.verifyLoginOtp, { body: { identifier: 'synthetic@example.test', otp: '123456' } })).statusCode, 400);
    const valid = authFixture();
    assert.equal((await invoke(valid.controller.verifyLoginOtp, { body: { identifier: 'synthetic@example.test', otp: '123456' } })).statusCode, 200);
    assert.equal((await invoke(valid.controller.verifyLoginOtp, { body: { identifier: 'synthetic@example.test', otp: '123456' } })).statusCode, 400);
});
