# S15 — Enforced local Content Security Policy

## Before

**Finding:** S15. Storefront and admin only sent `Content-Security-Policy-Report-Only`; injected scripts were not prevented by that header. The server-rendered structured-data scripts and admin theme bootstrap did not consistently carry a request nonce.

**Files:** `frontend/next.config.mjs`, `admin/next.config.mjs`, both `src/lib/csp.mjs` and `src/proxy.js`; both root layouts, storefront `components/Providers.jsx`, admin `app/providers.js`; server Product, service and location JSON-LD components.

**Local fix:** enforce CSP, generate an unpredictable 18-byte nonce per proxied HTML request, overwrite incoming `x-nonce` and CSP headers, forward the policy to Next so its framework scripts receive the same nonce, and attach the nonce to our structured data, Google OAuth provider and next-themes provider. Production script policies contain no `unsafe-inline` or `unsafe-eval`. Development permits `unsafe-eval` for the Next dev runtime only. Tests exercise both applications.

**Risks / rollback:** nonce HTML must be rendered per request. Both roots explicitly use `force-dynamic`; HTML responses are `private, no-store`. This sacrifices full HTML prerendering/edge caching, while static assets and explicitly cached data/route handlers retain their independent policies. A future CDN must not cache or replay nonce HTML. Reverting to report-only would reopen S15 and must be recorded as such; do not work around provider failures with wildcard script permissions or production `unsafe-eval`.

## After — local evidence

- Eight unit/source-contract tests pass across storefront and admin. They cover production/development separation, malformed nonce rejection, exact-origin configuration, unknown wildcard rejection, provider separation, nonce forwarding and dynamic HTML declarations.
- Both isolated production builds pass. Build logs: `.gstack/remediation-2026-10-01/csp-frontend-build.log` and `csp-admin-build.log`. Active development `.next` directories were untouched.
- Isolated production HTTP checks on ports 3004 and 3005 returned enforcing CSP, no report-only header, no unsafe inline/eval script permission, `private, no-store`, unique nonces on consecutive responses, and replacement of a caller-supplied nonce. All 19 storefront and 23 admin initial script tags carried the response nonce. Evidence: `csp-http-evidence.json` in the same directory.
- GStack browser checks on production login pages verified storefront email-mode interaction and a nonced Google loader, plus admin password visibility interaction and a nonced theme bootstrap. No credentials were entered.
- A disposable localhost HTML fixture served the exact policy obtained from the production storefront. Its nonced bootstrap ran; its parser-inserted unnonced inline script did **not** run and emitted a `script-src-elem` violation. This proves browser enforcement of initial untrusted inline script under that policy, without claiming provider certification.
- A direct CDP-created script / trusted dynamic insertion is **not** a meaningful denial test: `strict-dynamic` deliberately delegates script-loading trust to an already nonced script. The verification does not claim such trusted descendants are blocked. Runtime evidence: `csp-browser-evidence.json`.

## Policy and configuration

- `default-src 'self'`, `object-src 'none'`, restricted `base-uri` and `form-action`, admin `frame-ancestors 'none'`, storefront framing limited to same origin.
- Modern browsers use nonce + `strict-dynamic` to trust framework and SDK descendants. Listed script hosts provide compatibility for browsers without `strict-dynamic`; they do not constrain descendants of trusted nonced scripts in modern browsers. Avoid constructing a trusted loader URL from CMS/user-controlled values.
- Connections, frames and images use exact known origins (including the existing backend, Cloudinary, Google, Cashfree sandbox/payment hosts and known image CDNs). No provider-domain wildcard or scheme-wide `https:` image permission is present.
- Configure additional owned origins via `CSP_CONNECT_ORIGINS`, `CSP_IMG_ORIGINS`, and `CSP_FRAME_ORIGINS` as comma/whitespace-separated absolute HTTPS URLs. The parser normalizes each to its origin, rejects credentials/query/fragment/wildcard/scheme injections, and permits local HTTP for local testing. Same-origin relative API configuration such as `/backend` needs no extra origin. `NEXT_PUBLIC_API_URL` / `API_URL` origin is included explicitly. Review these values before merging deployment configuration.
- `style-src` still permits inline styles because React components, motion and theme styling use them. This is an explicit retained tradeoff, not a claim of a fully nonce-only policy for styles. No automatic report collector or alerting pipeline is introduced.
- Arbitrary previously configured external CMS image hosts are blocked until their verified origin is included explicitly. Known in-repository image sources are permitted. This is preferable to adding a broad CDN wildcard.
- `/images/macbook-pro.png` permanently redirects to the correctly typed `.jpg` asset to preserve older CMS URL references after the existing JPEG bytes were renamed.

## Checks still requiring an environment/operator

Actual Google OAuth login, optional GA delivery after consent, Cashfree hosted checkout/3DS/issuer redirects, externally configured CMS assets, deployment CDN cache behavior, and browser coverage beyond the local Chromium probe must be tested in staging with approved sandbox configuration. They were not exercised with real provider credentials. A provider may require an additional documented exact origin; configure and verify it rather than claim the local policy certifies that integration. Cashfree remains sandbox-only and no real payment was made.
