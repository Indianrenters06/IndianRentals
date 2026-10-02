const { readdirSync } = require('node:fs');
const { join } = require('node:path');
const { spawnSync } = require('node:child_process');

const root = join(__dirname, '..');
const excluded = new Set(['node_modules', '.git', '.gstack', 'coverage']);
function javascriptFiles(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        if (excluded.has(entry.name)) return [];
        const path = join(directory, entry.name);
        return entry.isDirectory() ? javascriptFiles(path) : entry.name.endsWith('.js') ? [path] : [];
    });
}
const files = javascriptFiles(root);
for (const file of files) {
    const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
    if (result.status !== 0) process.exit(result.status || 1);
}
console.log(`Syntax checked ${files.length} backend JavaScript files.`);
