// Explicit, read-only visual preview. Normal dev/start still use the configured backend.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const root = fileURLToPath(new URL('../', import.meta.url));
const children = new Set();
let stopping = false;
function stop(code = 0) {
    if (stopping) return;
    stopping = true;
    for (const child of children) child.kill('SIGTERM');
    process.exitCode = code;
}
function launch(command, args, env = process.env) {
    const child = spawn(command, args, { cwd: root, env, stdio: 'inherit' });
    children.add(child);
    child.on('error', error => { console.error(error.message); stop(1); });
    child.on('exit', code => { children.delete(child); if (!stopping) stop(code || 0); });
    return child;
}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
async function probe() {
    try {
        const response = await fetch('http://127.0.0.1:5001/api/settings', { signal: AbortSignal.timeout(1000) });
        await response.arrayBuffer();
        return response.ok && response.headers.get('x-preview-data') === 'sample-read-only';
    } catch { return false; }
}
if (!(await probe())) {
    launch('python3', ['-u', 'scripts/preview-api.py']);
    let ready = false;
    for (let attempt = 0; attempt < 30 && !stopping; attempt++) {
        if (await probe()) { ready = true; break; }
        await delay(100);
    }
    if (!ready) { console.error('Preview API could not start on port 5001. Check for a port conflict.'); stop(1); }
}
if (!stopping) {
    console.log('Read-only preview: sample catalogue; account, checkout and admin writes require the real backend.');
    launch(process.execPath, ['node_modules/next/dist/bin/next', 'dev', ...process.argv.slice(2)], {
        ...process.env, NEXT_PUBLIC_API_URL: 'http://127.0.0.1:5001',
    });
}
