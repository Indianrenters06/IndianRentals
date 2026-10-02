const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { credentialTypes, scanWorkingTree } = require('../scripts/scan_credentials');

const root = path.resolve(__dirname, '../..');
test('S4: legacy token artifact and unsafe administrator bootstrap are removed', () => {
    assert.equal(fs.existsSync(path.join(root, 'backend/token.txt')), false);
    assert.equal(fs.existsSync(path.join(root, 'backend/scripts/get_admin_token.js')), false);
});

test('S4: scanner detects synthetic credentials and reports types without values', () => {
    const jwt = [Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64url'),
        Buffer.from(JSON.stringify({ id: 'synthetic' })).toString('base64url'), 's'.repeat(32)].join('.');
    assert.deepEqual(credentialTypes(jwt), ['JWT']);
    assert.deepEqual(credentialTypes(['-----BEGIN ', 'PRIVATE KEY-----'].join('')), ['private key']);
    assert.deepEqual(credentialTypes('ghp_' + 'a'.repeat(36)), ['GitHub token']);
    assert.deepEqual(credentialTypes('ordinary text'), []);
    assert.deepEqual(scanWorkingTree(root), []);
});

test('S4: token artifacts are ignored even if generated locally again', () => {
    assert.equal(execFileSync('git', ['check-ignore', '--no-index', 'backend/token.txt'], { cwd: root, encoding: 'utf8' }).trim(), 'backend/token.txt');
});
