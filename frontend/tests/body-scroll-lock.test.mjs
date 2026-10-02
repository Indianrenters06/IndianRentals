import test from 'node:test';
import assert from 'node:assert/strict';
import { lockBodyScroll } from '../src/lib/bodyScrollLock.mjs';

test('overlapping menu/dialog locks preserve scroll state until the final owner closes', () => {
    for (const reverse of [false, true]) {
        const body = { style: { overflow: 'auto' } };
        const menu = lockBodyScroll(body);
        const dialog = lockBodyScroll(body);
        const first = reverse ? dialog : menu, last = reverse ? menu : dialog;
        first(); first();
        assert.equal(body.style.overflow, 'hidden');
        last();
        assert.equal(body.style.overflow, 'auto');
        const next = lockBodyScroll(body);
        assert.equal(body.style.overflow, 'hidden');
        next();
        assert.equal(body.style.overflow, 'auto');
    }
});
