import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative, sep } from 'node:path';
import { availableAdminNavigation, plannedAdminRoutes } from '../src/lib/adminNavigation.mjs';

test('every actual Coming Soon page is excluded from working navigation', () => {
  const app = fileURLToPath(new URL('../src/app/', import.meta.url));
  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const filename = join(directory, entry.name);
      if (entry.isDirectory()) visit(filename);
      else if (entry.name === 'page.js' && /import ComingSoon/.test(readFileSync(filename, 'utf8'))) {
        const route = `/${relative(app, directory).split(sep).join('/')}`;
        assert.ok(plannedAdminRoutes.has(route), `Unimplemented route must be hidden: ${route}`);
        assert.equal(availableAdminNavigation([{ path: route }], () => true).length, 0);
      }
    }
  }
  visit(app);
});

test('available payments, orders and settings remain reachable while planned operations are absent', () => {
  const items = [
    { path: '/dashboard/orders', permission: 'orders' },
    { path: '/dashboard/payments', permission: 'payments', submenu: [{ path: '/dashboard/payments' }, { path: '/dashboard/payments/refunds' }, { path: '/dashboard/payments/subscriptions' }] },
    { path: '/dashboard/settings', permission: 'settings', submenu: [{ path: '/dashboard/settings/general' }, { path: '/dashboard/settings/team' }, { path: '/dashboard/settings/payment-gateway' }] },
  ];
  const result = availableAdminNavigation(items, () => true);
  assert.deepEqual(result.map(item => item.path), ['/dashboard/orders', '/dashboard/payments', '/dashboard/settings']);
  assert.deepEqual(result[1].submenu.map(item => item.path), ['/dashboard/payments']);
  assert.deepEqual(result[2].submenu.map(item => item.path), ['/dashboard/settings/general', '/dashboard/settings/team']);
  assert.equal(items[1].submenu.length, 3);
});

test('staff section permissions remain required after planned tools are removed', () => {
  const result = availableAdminNavigation([
    { path: '/dashboard' },
    { path: '/dashboard/payments', permission: 'payments' },
    { path: '/dashboard/settings', permission: 'settings' },
  ], permission => permission === 'payments');
  assert.deepEqual(result.map(item => item.path), ['/dashboard', '/dashboard/payments']);
});

test('implemented successful and failed gateway projections are available under payments access', () => {
  const items = [{ path: '/dashboard/payments', permission: 'payments', submenu: [
    { path: '/dashboard/payments/successful' }, { path: '/dashboard/payments/failed' }, { path: '/dashboard/payments/refunds' },
  ] }];
  assert.deepEqual(availableAdminNavigation(items, permission => permission === 'payments')[0].submenu.map(item => item.path), [
    '/dashboard/payments/successful', '/dashboard/payments/failed',
  ]);
  assert.equal(availableAdminNavigation(items, () => false).length, 0);
});
