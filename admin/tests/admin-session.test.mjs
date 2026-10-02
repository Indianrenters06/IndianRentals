import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyAdminSession } from '../src/lib/adminSession.mjs';

test('dashboard accepts only a server-validated active administration role', async () => {
  for (const role of ['admin', 'super_admin', 'staff', 'operations_manager', 'sales_executive', 'finance_executive']) {
    const info = await verifyAdminSession('https://example.test', 'synthetic', {
      fetcher: async (url, options) => {
        assert.equal(url, 'https://example.test/api/users/profile');
        assert.equal(options.headers.Authorization, 'Bearer synthetic');
        assert.equal(options.cache, 'no-store');
        return { ok: true, json: async () => ({ role, adminPermissions: ['kyc'] }) };
      },
    });
    assert.equal(info.role, role);
  }
});

test('customer, disabled, blocked, and expired sessions cannot open dashboard', async () => {
  for (const profile of [{ role: 'customer' }, { role: 'admin', isBlocked: true }, { role: 'staff', isActive: false }, {}]) {
    await assert.rejects(verifyAdminSession('https://example.test', 'synthetic', {
      fetcher: async () => ({ ok: true, json: async () => profile }),
    }), { code: 'UNAUTHORIZED' });
  }
  for (const status of [401, 403]) {
    await assert.rejects(verifyAdminSession('https://example.test', 'synthetic', {
      fetcher: async () => ({ status, ok: false }),
    }), { code: 'UNAUTHORIZED' });
  }
});

test('network or server failure is retryable and grants no access', async () => {
  await assert.rejects(verifyAdminSession('https://example.test', 'synthetic', {
    fetcher: async () => ({ status: 503, ok: false }),
  }), /unavailable/);
  await assert.rejects(verifyAdminSession('https://example.test', 'synthetic', {
    fetcher: async () => { throw new Error('connection'); },
  }), /connection/);
});
