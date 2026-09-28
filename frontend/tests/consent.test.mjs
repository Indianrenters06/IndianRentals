import test from 'node:test';
import assert from 'node:assert/strict';
import { CONSENT_LIFETIME, createConsent, parseConsent, createAnalyticsController } from '../src/lib/consent.mjs';

const now = 1800000000000;
test('saved acceptance and rejection retain their explicit choice', () => {
  for (const allowed of [true, false]) {
    const choice = createConsent(allowed, now);
    assert.deepEqual(parseConsent(JSON.stringify(choice), now + 100), choice);
  }
});
test('malformed, expired, future, and outdated preferences fail closed', () => {
  for (const value of [null, 'broken', '{}', JSON.stringify({...createConsent(true, now), version: 0}), JSON.stringify({...createConsent(true, now), analytics: 'true'}), JSON.stringify(createConsent(true, now + 1)), JSON.stringify(createConsent(true, now - CONSENT_LIFETIME))]) {
    assert.equal(parseConsent(value, now), null);
  }
});
function fixture(id = 'G-TEST') {
  const scripts = [], deletions = [];
  const win = { location: { pathname: '/', hostname: 'www.example.com' } };
  const doc = {
    head: { appendChild: script => scripts.push(script) },
    createElement: () => ({ dataset: {}, remove() {} }),
    get cookie() { return '_ga=123; _ga_TEST=456; rental_cart=keep; session=keep'; },
    set cookie(value) { deletions.push(value); },
  };
  return { controller: createAnalyticsController(id, win, doc), win, scripts, deletions };
}
test('no optional script or analytics queue before acceptance', () => {
  const {controller, scripts, win} = fixture();
  controller.setAllowed(false);
  assert.equal(scripts.length, 0);
  assert.equal(win.dataLayer, undefined);
  assert.equal(win['ga-disable-G-TEST'], true);
});
test('acceptance loads once; withdrawal stops analytics and preserves essential cookies', () => {
  const {controller, scripts, win, deletions} = fixture();
  controller.setAllowed(true);
  controller.setAllowed(true);
  assert.equal(scripts.length, 1);
  scripts[0].onload();
  assert.equal(win['ga-disable-G-TEST'], false);
  assert.equal(win.dataLayer.filter(command => command[0] === 'config').length, 1);
  controller.setAllowed(false);
  assert.equal(win['ga-disable-G-TEST'], true);
  assert.equal(win.dataLayer.at(-1)[2].analytics_storage, 'denied');
  assert.ok(deletions.some(value => value.startsWith('_ga=')));
  assert.ok(deletions.every(value => !value.includes('rental_cart') && !value.includes('session')));
  controller.setAllowed(true);
  assert.equal(scripts.length, 1);
  assert.equal(win.dataLayer.at(-1)[2].analytics_storage, 'granted');
});
test('withdrawal during script download prevents initialization', () => {
  const {controller, scripts, win} = fixture();
  controller.setAllowed(true);
  controller.setAllowed(false);
  scripts[0].onload();
  assert.equal(win.dataLayer, undefined);
  assert.equal(win['ga-disable-G-TEST'], true);
  controller.setAllowed(true);
  assert.equal(win.dataLayer.filter(command => command[0] === 'config').length, 1);
});
test('missing analytics configuration never creates third party requests', () => {
  const {controller, scripts, win} = fixture('');
  controller.setAllowed(true);
  assert.equal(scripts.length, 0);
  assert.equal(win.dataLayer, undefined);
});
