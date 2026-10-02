const test = require('node:test');
const assert = require('node:assert/strict');
const { loadSource, invoke } = require('./helpers');

function fixture(state = {}) {
    let sessions = 0, saves = 0, mail = 0;
    const user = { _id: 'synthetic', role: 'staff', name: 'Synthetic', email: 'synthetic@example.test',
        password: 'synthetic', isActive: true, isBlocked: false, emailOtp: '123456', phoneOtp: '654321',
        otpPurpose: 'login', otpExpires: new Date(Date.now() + 60000), ...state,
        matchPassword: async () => true, save: async () => { saves++; } };
    const query = () => ({ select() { return this; }, then(resolve) { resolve(user); } });
    const Model = { findOne: query, findById: query, updateOne: async () => {} };
    process.env.GOOGLE_CLIENT_ID = 'synthetic-client';
    const controller = loadSource('controllers/authController.js', {
        'google-auth-library': { OAuth2Client: class { async getTokenInfo() { return { aud: 'synthetic-client', expiry_date: Date.now() + 60000 }; } } },
        '../models/User': Model, '../utils/generateToken': () => { sessions++; return 'synthetic-session'; },
        '../utils/sendEmail': async () => { mail++; }, '../utils/sendSMS': async () => { mail++; },
        '../utils/sendTemplatedEmail': { sendTemplatedEmail: async () => { mail++; return true; } },
    }, { fetch: async () => ({ ok: true, json: async () => ({ email: user.email, name: user.name, sub: 'synthetic-google', email_verified: true }) }) });
    return { user, controller, Model, counts: () => ({ sessions, saves, mail }) };
}

const requests = {
    adminLogin: { email: 'synthetic@example.test', password: 'Synthetic!9' },
    loginUser: { email: 'synthetic@example.test', password: 'Synthetic!9' },
    sendLoginOtp: { identifier: 'synthetic@example.test' },
    verifyLoginOtp: { identifier: 'synthetic@example.test', otp: '123456' },
    verifyOtp: { userId: 'synthetic', emailOtp: '123456', phoneOtp: '654321' },
    adminForgotPassword: { email: 'synthetic@example.test' },
    adminResetPassword: { email: 'synthetic@example.test', otp: '123456', newPassword: 'Synthetic!9' },
    googleLogin: { access_token: 'synthetic-not-a-real-token' },
};
for (const state of [{ isBlocked: true }, { isActive: false }]) {
    for (const [action, body] of Object.entries(requests)) {
        test(`S6: ${action} rejects ${Object.keys(state)[0]} before session/recovery side effects`, async () => {
            const f = fixture({ ...state, ...(action === 'adminResetPassword' ? { otpPurpose: 'admin_reset' } : {}) });
            const result = await invoke(f.controller[action], { body });
            assert.equal(result.statusCode, 403);
            assert.deepEqual(f.counts(), { sessions: 0, saves: 0, mail: 0 });
        });
    }
    test(`S6: protected requests recheck persisted ${Object.keys(state)[0]} despite valid JWT`, async () => {
        const f = fixture(state);
        const auth = loadSource('middleware/authMiddleware.js', { '../models/User': f.Model, jsonwebtoken: { verify: () => ({ id: 'synthetic' }) } });
        let next = false;
        const res = { statusCode: 200, status(n) { this.statusCode = n; return this; } };
        let error;
        await auth.protect({ cookies: {}, headers: { authorization: 'Bearer synthetic' } }, res, err => { error = err; next = !err; });
        assert.equal(next, false); assert.equal(res.statusCode, 403); assert.ok(error);
    });
}
test('S6: active admin and OTP sessions remain available', async () => {
    const f = fixture();
    assert.equal((await invoke(f.controller.adminLogin, { body: requests.adminLogin })).statusCode, 200);
    assert.equal((await invoke(f.controller.verifyLoginOtp, { body: requests.verifyLoginOtp })).statusCode, 200);
    assert.equal(f.counts().sessions, 2);
});
test('S6: token issuer refuses disabled accounts even if a caller omits its check', () => {
    let signed = false;
    const issue = loadSource('utils/generateToken.js', { jsonwebtoken: { sign: () => { signed = true; return 'synthetic'; } } });
    const res = { status() { return this; }, cookie() {} };
    for (const user of [{ _id: 'synthetic', isBlocked: true }, { _id: 'synthetic', isActive: false }]) assert.throws(() => issue(res, user));
    assert.equal(signed, false);
});
