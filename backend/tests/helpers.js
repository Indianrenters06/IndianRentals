const fs = require('node:fs');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const path = require('node:path');

// Run the actual CommonJS source with only external effects replaced.
// No database, mail provider or production API is contacted by these fixtures.
function loadSource(relativePath, overrides = {}, globals = {}) {
    const filename = path.resolve(__dirname, '..', relativePath);
    const nativeRequire = createRequire(filename);
    const module = { exports: {} };
    const context = { module, exports: module.exports, Buffer, console, process, URL, fetch, AbortSignal,
        ...globals,
        require: (name) => Object.hasOwn(overrides, name) ? overrides[name] : nativeRequire(name) };
    vm.runInNewContext(fs.readFileSync(filename, 'utf8'), context, { filename });
    return module.exports;
}

async function invoke(handler, request = {}) {
    const response = { statusCode: 200, body: undefined,
        status(code) { this.statusCode = code; return this; },
        setHeader() {},
        json(body) { this.body = JSON.parse(JSON.stringify(body)); return this; } };
    let error;
    await handler(request, response, (err) => { error = err; });
    return { ...response, error };
}

async function serveRouter(t, router, prefix) {
    const express = require('express');
    const app = express();
    app.use(express.json({ verify(req, res, bytes) { req.rawBody = bytes; } }));
    app.use(prefix, router);
    app.use((err, req, res, next) => res.status(res.statusCode >= 400 ? res.statusCode : 500).json({ message: err.message }));
    const server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    t.after(() => new Promise(resolve => server.close(resolve)));
    return (path, options) => fetch(`http://127.0.0.1:${server.address().port}${prefix}${path}`, options);
}

module.exports = { loadSource, invoke, serveRouter };
