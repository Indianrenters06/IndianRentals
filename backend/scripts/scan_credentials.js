const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const rules = [
    ['JWT', /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{16,}\b/],
    ['private key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
    ['AWS access key', /\bAKIA[A-Z0-9]{16}\b/],
    ['GitHub token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/],
];

function credentialTypes(contents) {
    return rules.filter(([, pattern]) => pattern.test(contents)).map(([type]) => type);
}

function scanWorkingTree(root) {
    const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, maxBuffer: 16 * 1024 * 1024 }).toString().split('\0').filter(Boolean);
    const findings = [];
    for (const filename of new Set(files)) {
        const absolute = path.join(root, filename);
        if (!fs.existsSync(absolute) || !fs.lstatSync(absolute).isFile()) continue;
        if (/(?:^|\/)(?:tokens?\.txt|\.credentials[^/]*)$|\.token$/.test(filename)) {
            findings.push({ file: filename, type: 'authentication artifact' });
        }
        const data = fs.readFileSync(absolute);
        if (data.includes(0)) continue;
        for (const type of credentialTypes(data.toString('utf8'))) findings.push({ file: filename, type });
    }
    return findings;
}

if (require.main === module) {
    const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
    const findings = scanWorkingTree(root);
    // Metadata only. Never emit credential contents or surrounding source lines.
    for (const finding of findings) console.error(`${finding.file}: ${finding.type}`);
    console.log(`Credential scan: ${findings.length} finding(s)`);
    process.exitCode = findings.length ? 1 : 0;
}

module.exports = { credentialTypes, scanWorkingTree };
