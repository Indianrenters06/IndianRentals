# P1 and P2 change records — 1 October 2026

These records describe the local patch against audit HEAD `72d334557f8756a52c374c253ae83cef639d7380`. The user requested P1/P2 continuation while real database/Cashfree Phase 3 gates were unavailable; that overrides the original sequencing, not the verification requirements. No production credentials, customer mutations, identity downloads, payments or authenticated deployed admin writes were used as evidence. No commit/push or deployment was performed.

“Locally verified” means source, synthetic handler/model tests, builds or stated localhost browser/HTTP checks. It does not certify actual provider configuration, production data, HTTPS session behavior or deployed revision. P0/S5/F1–F3 records remain in [P0_REMEDIATION.md](P0_REMEDIATION.md) and [PAYMENT_FOUNDATION.md](PAYMENT_FOUNDATION.md).

## S6 — Blocked and inactive accounts

### BEFORE

- **ID/priority:** S6, P1.
- **Files:** `middleware/authMiddleware.js`, `controllers/authController.js`, `utils/generateToken.js`; new `utils/accountAccess.js` and `tests/account-state.test.js`.
- **Root cause:** persisted `isBlocked`/`isActive` state was not enforced consistently by protected requests or session issuance.
- **Fix:** one account eligibility check on each protected request and centrally before token issuance; login, admin login, OTP/recovery and existing Google account paths enforce eligibility before side effects.
- **Risks considered:** expired versus disabled sessions, every sign-in variant, missing legacy `isActive`, accidental denial of active staff/customer workflows and concurrent state changes.
- **Planned tests:** blocked/inactive sign-in variants and protected middleware; active positive paths; issuer refuses callers that omit their own check.

### AFTER

- **Files changed:** The BEFORE-listed implementation files; new account access helper.
- **Tests added/passed:** `tests/account-state.test.js` added; existing auth tests updated; all pass locally.
- **Original behavior check:** The previously accepted blocked/inactive fixture now fails the real protected/session checks.

Account-state regressions cover the actual paths with controlled dependencies; active cases remain available. Missing `isActive` on legacy accounts is accepted unless explicitly false. Blocked/inactive persisted accounts cannot use an existing token on protected routes. **This is access enforcement, not token revocation:** unblocking can make a still-valid token usable again. Logout/password reset session revocation remains S13.

## S7 — Private KYC and consistent verification state

### BEFORE

- **ID/priority:** S7, P1.
- **Files:** `models/KYCAsset.js`, `services/kycAssets.js`, `controllers/{kyc,admin,user}Controller.js`, `utils/userResponse.js`, admin KYC page/viewer, storefront `KYCExperience.jsx`, KYC/customer-target tests.
- **Root cause:** default public provider delivery and returned URLs conflated HTTPS with authorization. KYC/User status could change in separate writes; reviewer approval was not tied to the reviewed revision.
- **Fix:** authenticated raw assets, random server IDs, owner/field-bound database receipts and reference-only DTOs. Transactions synchronize User/KYC status; identity changes reset approval. Approval requires the current `updatedAt`. Staff use authenticated attachment bytes; the legacy viewer delegates to that workflow. Old URL submission fails closed.
- **Risks considered:** customer/field substitution, privileged targets, stale approval, arbitrary document labels, spoofed MIME, oversized streams, partial uploads, private orphans, legacy approved records and notification delivery. Approval email no longer invents a rental-limit entitlement.
- **Planned tests:** upload metadata and signatures; owned receipts; DTO suppression; permissions; stale approval; state reset; fresh uploads remove old public references while retaining other private assets.

### AFTER

- **Files changed:** The BEFORE-listed model/service/controllers and admin/storefront workflow files.
- **Tests added/passed:** `tests/kyc-private.test.js` added and related KYC/customer tests updated; all pass locally.
- **Original behavior check:** New synthetic uploads request authenticated raw storage and return only an owned reference. Legacy public URLs are suppressed/refused, not provider-migrated.

Synthetic KYC and authorization regressions pass. Downloads set attachment, private/no-store and nosniff headers. State changes are transaction-based; mail failure does not undo them. Legacy references produce migration markers and cannot be downloaded through the new endpoint. **Old public provider/CDN files were not migrated, deleted or tested; they may remain publicly reachable.** Actual provider privacy remains a gate. The disposable local Mongo replica set verified KYC state synchronization, stale/simultaneous approval rejection and rollback after a failed second write; deployed database behavior remains unverified. See [KYC_PRIVATE_STORAGE.md](KYC_PRIVATE_STORAGE.md). Format signatures are not antivirus/content-disarm verification; retention and quotas need operator policy.

## S8 — KYC arbitrary URL retrieval

### BEFORE

- **ID/priority:** S8, P1.
- **Files:** `services/kycAssets.js`, `controllers/kycController.js`, legacy user/admin KYC delegation, `tests/kyc-private.test.js`.
- **Root cause:** customers could persist arbitrary document URLs and staff download could fetch those destinations without trusted-host or redirect restrictions.
- **Fix:** accept only receipt IDs owned by the target customer and field. Fetch only a short-lived signed URL generated from verified server metadata, using exact Cloudinary HTTPS API hosts, no credentials/ports/redirects, timeout and streamed byte/signature checks. Signed URLs stay server-side.
- **Risks considered:** loopback/private destinations, redirects, forged provider metadata, resource-type confusion, download amplification and legacy fallback pressure.
- **Planned tests:** URL/foreign-reference rejection before writes; legacy stored URL returns 409 with zero outbound requests; trusted generated synthetic download succeeds and redirect policy remains `error`.

### AFTER

- **Files changed:** The BEFORE-listed service and KYC controller/delegation paths.
- **Tests added/passed:** `tests/kyc-private.test.js` URL/foreign reference/no-outbound regressions added; all pass locally.
- **Original behavior check:** The original arbitrary loopback URL fixture is rejected; no outbound request occurs.

The original arbitrary URL path is rejected in actual-handler fixtures without any network attempt. There is no permissive legacy fallback. Synthetic trusted bytes succeed. Provider-account correctness is unverified; it must be established without reinstating stored-URL retrieval.

## S9 — JSON-LD script embedding

### BEFORE

- **ID/priority:** S9, P1.
- **Files:** `frontend/src/lib/serializeJsonLd.mjs`, `frontend/src/app/products/[id]/layout.js`, `frontend/tests/json-ld.test.mjs`.
- **Root cause:** `JSON.stringify` alone does not stop HTML from interpreting a closing script tag inside catalogue data.
- **Fix:** serialize JSON with HTML-significant characters and Unicode line separators escaped before embedding in the script element.
- **Risks considered:** preserving real JSON values, malformed structured data and future template callers bypassing the serializer.
- **Planned tests:** synthetic closing-script payload, special-character round trip and PDP serializer wiring.

### AFTER

- **Files changed:** The serializer and PDP layout listed BEFORE.
- **Tests added/passed:** `frontend/tests/json-ld.test.mjs` added; all serializer/template cases pass.
- **Original behavior check:** The closing-script fixture no longer creates a literal terminating script sequence; no stored payload was used.

All serializer regressions pass; JSON values round-trip while a payload cannot emit a literal closing script sequence. No payload was stored or executed. Rental schema suitability and external rich-result eligibility are not established by this escaping fix.

## F4 — False newsletter success

### BEFORE

- **ID/priority:** F4, P1.
- **Files:** `frontend/src/app/blog/[slug]/page.js`, `frontend/tests/json-ld.test.mjs`.
- **Root cause:** a local state change claimed subscription success without persistence or delivery.
- **Fix:** remove the unsupported subscription form and local acknowledgment.
- **Risks considered:** misleading success, accidental claim that removing a form creates a newsletter backend.
- **Planned tests:** absence of the local-only subscription action/acknowledgment; storefront build.

### AFTER

- **Files changed:** The blog post page listed BEFORE.
- **Tests added/passed:** Removed-action regression in `frontend/tests/json-ld.test.mjs` passes.
- **Original behavior check:** The former local-only subscription success action is absent.

The unsupported action is removed and its regression passes. No newsletter workflow or provider integration is claimed.

## S11 — Owned origins and cookie write policy

### BEFORE

- **ID/priority:** S11, P2.
- **Files:** `backend/index.js`, `utils/httpPolicy.js`, `frontend/src/app/backend/[...path]/route.js`, `tests/p2-hardening.test.js`.
- **Root cause:** credentialed CORS accepted broad deployment hostname patterns; cookie-authenticated mutations lacked an explicit request-origin contract.
- **Fix:** exact validated configured HTTP(S) origins. Production gets no automatic localhost allowance. Unsafe browser requests from other origins are rejected; JWT-cookie mutations need an allowed Origin. Explicit bearer calls can omit Origin. The storefront proxy forwards Origin instead of discarding it.
- **Risks considered:** legitimate deployment hosts, local development, proxy provenance, non-browser bearer clients, SameSite assumptions and provider webhook delivery.
- **Planned tests:** exact allowed/unowned origins, production localhost denial, cookie origin denial/acceptance and bearer/webhook exceptions.

### AFTER

- **Files changed:** The policy helper, backend entry point and storefront proxy listed BEFORE.
- **Tests added/passed:** Origin/cookie cases in `tests/p2-hardening.test.js` pass; independent proxy-origin route checks pass.
- **Original behavior check:** Unowned credentialed origins and cookie writes without a trusted origin are refused by the local policy.

Local policy tests pass. Existing owned deployments must be configured explicitly through `FRONTEND_URL`, `ADMIN_URL`, optional second/local origins and `EXTRA_ORIGINS`; invalid URLs fail configuration. Cookie protection is a deliberate origin policy, not a synchronizer-token CSRF implementation. Real proxy/HTTPS/cookie behavior and distributed limit configuration remain unverified. Public webhook delivery still requires signature verification.

## S12 — Public Settings DTO

### BEFORE

- **ID/priority:** S12, P2.
- **Files:** `utils/publicSettings.js`, `controllers/settingsController.js`, `tests/p2-hardening.test.js`.
- **Root cause:** a public full-model response could disclose `paymentGatewaySecret` if populated and future nested fields.
- **Fix:** explicit top-level/nested public allowlists. Missing settings use unsaved defaults; public GET does not create a database record. Checkout pricing/provider configuration are not exposed by this DTO.
- **Risks considered:** navbar/footer/theme compatibility, future secrets, empty installed settings and mistaking a DTO for credential storage remediation.
- **Planned tests:** populated current/future secret fields and nested secret values are omitted, expected display fields retained.

### AFTER

- **Files changed:** Public Settings helper and controller listed BEFORE.
- **Tests added/passed:** Current/future/nested secret exclusion in `tests/p2-hardening.test.js` passes.
- **Original behavior check:** A populated synthetic secret does not appear in the public response.

DTO regressions pass. Existing private administrative configuration remains private; real Cashfree credentials remain environment-only in its integration. No assertion is made that the previously inspected empty field leaked a live secret. Actual stored secret inventory/access and deployment environment ownership remain operator checks.

## S13 — Server-side session revocation; transport risk retained

### BEFORE

- **ID/priority:** S13, P2.
- **Files:** User model, token issuer, protected middleware, authentication/logout/recovery controllers/routes; storefront auth service/navbar/profile; admin dashboard; shared logout helpers and regression suites.
- **Root cause:** copied bearer/cookie JWTs remained valid after browser logout or password changes. JavaScript-readable storage and 30-day expiry increased exposure.
- **Fix:** persisted account-wide session version in every issued token and protected request; conditional acknowledged logout increment; atomic password-save increment; one-use recovery predicate. Both clients revoke first and clear browser state only after confirmed success or a cookie-only already-invalid 401; a bearer 401 first retries without Authorization. Network/database failure remains visible and retryable.
- **Risks considered:** legacy version-zero tokens, stale hydrated defaults, concurrent password changes/reset/logout, revoking replacement sessions, lost increments, partial logout and backend/client release mismatch.
- **Planned tests:** real model/controller/JWT/middleware regressions, actual disposable Mongo concurrency/replay and client acknowledgement/failure contracts.

### AFTER

- **Files changed:** the listed backend and browser session paths plus session-version/logout helpers.
- **Tests added/passed:** 14 backend session regressions; six reported actual local Mongo integration tests; both browser helper suites pass. The combined counts are in the main report.
- **Original behavior check:** copied bearer/cookie tokens are denied after acknowledged logout or password change; simultaneous recovery consumes the code once and returns one 200/one 409.

Logout ends all current account sessions. Legacy tokens remain version zero until a revocation event, expiry or account disablement. The actual local database checks confirm atomic increments and replay denial; deployed topology and write concern remain unverified. **Browser-readable bearer storage and 30-day lifetime remain explicit risks.** A coordinated HttpOnly-only transport migration is separate work. Backend and clients must release together; reverting the backend to code that ignores session versions would reopen replay access. See [LOCAL_SESSION_REVOCATION.md](LOCAL_SESSION_REVOCATION.md).

## S14 — Preview/log exposure

### BEFORE

- **ID/priority:** S14, P2.
- **Files:** `utils/httpPolicy.js`, `backend/index.js`, `controllers/cmsController.js`, `tests/p2-hardening.test.js`, public-content helpers/tests.
- **Root cause:** combined access logs recorded full URLs containing short-lived page-specific preview credentials.
- **Fix:** log method, sanitized path, status and elapsed time only; omit query/referrer/identity/header data. Preview token issuance is private/no-store with no-referrer. Shared public CMS request caching excludes preview queries and credentialed/private requests.
- **Risks considered:** incident observability, tokens in browser history/third-party edge logs and accidental caching of drafts/private responses.
- **Planned tests:** logs exclude token/query/header values; preview bypasses shared public cache; published consumers get independent response streams.

### AFTER

- **Files changed:** Policy logger/backend entry point, preview issuance and public-content helper listed BEFORE.
- **Tests added/passed:** Redaction and preview cache-isolation regressions pass.
- **Original behavior check:** A synthetic preview query/header value is absent from the new access-log output; browser-query transport is retained.

Local log and cache-isolation regressions pass. **Preview tokens still travel in query parameters** and can enter browser history or an independently configured proxy log. No log store was purged and no production retention/access policy was verified. A future transport change and edge-log review are still required.

## S15 — Enforced request-nonce CSP

### BEFORE

- **ID/priority:** S15, P2.
- **Files:** both Next configurations, request proxies, root layouts/providers and CSP helpers/tests; server-rendered structured data.
- **Root cause:** report-only CSP did not block untrusted scripts, and framework/structured-data/theme/provider scripts lacked a consistent nonce.
- **Fix:** enforcing policy with fresh unpredictable request nonce, untrusted incoming nonce replacement and matching Next/JSON-LD/provider/theme nonces. Production script policy permits neither unsafe inline fallback nor unsafe eval. Exact configured connection/frame/image origins replace broad allowances.
- **Risks considered:** HTML cache replay, dynamic rendering cost, trusted descendant loading under strict-dynamic, existing inline styles and actual third-party compatibility.
- **Planned tests:** both policy suites/builds, production HTTP nonce/cache probes, hydration and browser denial of parser-inserted unnonced script.

### AFTER

- **Files changed:** the listed policy/proxy/layout/provider files.
- **Tests added/passed:** eight CSP regressions; isolated production builds; HTTP unique/matching nonce checks and anonymous interactive hydration checks. A browser fixture using the production policy blocks parser-inserted unnonced inline script.
- **Original behavior check:** production-local HTML now carries enforcing CSP; an initial untrusted inline script is denied.

HTML is dynamic and private/no-store to prevent nonce replay; full HTML edge caching is sacrificed. Styles still allow inline declarations, and strict-dynamic delegates trust to descendants of nonced scripts. No reporting collector is installed. Actual OAuth, analytics and Cashfree compatibility, configured CMS assets and deployment cache behavior remain staging gates. See [LOCAL_CSP.md](LOCAL_CSP.md).

## S16 — Sensitive diagnostic logging

### BEFORE

- **ID/priority:** S16, P2.
- **Files:** auth/error handlers, `utils/sendSMS.js`, `utils/sendTemplatedEmail.js`, generic access logger.
- **Root cause:** provider error/response and development OTP diagnostics could include targets or identity material.
- **Fix:** generic provider/auth/mail/SMS failure diagnostics without recipient, OTP, token or provider body; generic production server-error response. Do not include arbitrary requested query URLs in not-found output.
- **Risks considered:** reduced debugging context, accidental secret logging, distinguishing development gating from proven production OTP disclosure.
- **Planned tests/review:** source review of relevant diagnostic paths; access-log redaction fixture; existing auth/mail handler regressions and syntax checks.

### AFTER

- **Files changed:** Reviewed auth/error/mail/SMS diagnostic files listed BEFORE.
- **Tests added/passed:** Existing related auth/security suites pass; access-log fixture passes. No exhaustive log-retention integration suite added.
- **Original behavior check:** The reviewed diagnostic statements no longer print target/OTP/provider response payloads; historical log content is unknown.

Reviewed paths use generic diagnostics; related suites pass. This is not a comprehensive every-future-log guarantee or proof that historical logs are clean. Production log access, exports and retention remain operator actions. Controlled provider correlation IDs can be designed separately without restoring sensitive payloads.

## S17 — Bounded catalogue queries

### BEFORE

- **ID/priority:** S17, P2.
- **Files:** `utils/catalogueQuery.js`, `controllers/productController.js`, `routes/productRoutes.js`, admin private catalogue controller/routes/helper and `tests/p2-hardening.test.js`.
- **Root cause:** caller-controlled regex and inconsistent integer bounds increased expensive-read/response amplification risk; public lists carried unnecessary full records.
- **Fix:** escaped literal search, bounded strings/filters, positive integer page/limit (public limit at most 100), at most 40 selected IDs, public active-only projection and process-local search limiter. Private paginated admin reads retain editor fields and inactive products behind authentication/permissions.
- **Risks considered:** public/admin pagination compatibility, missing records beyond a page, data loss if editors save list projections, related inactive products and multi-instance rate limits.
- **Planned tests:** malformed pagination/filters/regex, valid queries, bounded admin/public page collection and source/handler authorization checks.

### AFTER

- **Files changed:** Catalogue helper/controllers/routes and bounded admin reader listed BEFORE.
- **Tests added/passed:** Query cases in `tests/p2-hardening.test.js` and admin catalogue tests added; all pass.
- **Original behavior check:** Synthetic caller regex is escaped and malformed/unbounded pagination is rejected.

Query and catalogue regressions pass. Search is limited to 120 requests/minute per process policy; real proxy/shared rate stores and database explain/index plans remain unverified. Administrative editing uses complete private records so FAQs/specifications are not erased by public list projection. Bounded published collection reads still need representative large-catalogue/deployment checks.

## S18 — Google identity contract

### BEFORE

- **ID/priority:** S18, P2.
- **Files:** `controllers/authController.js`, Google test fixtures, `tests/p2-hardening.test.js`.
- **Root cause:** explicit verified-email/intended-client-audience checks were absent from account linking.
- **Fix:** require configured Google client ID, verify access-token audience and expiry through the provider library, require verified email and subject from user info, reject conflicting stored Google subject, and enforce account eligibility before linking/session issuance. Google-only users do not receive an invented random password.
- **Risks considered:** configured client mismatch, missing verification claims, conflicting linked identity, disabled accounts and provider failures. The audit did not establish arbitrary-victim token takeover.
- **Planned tests:** valid verified matching identity; wrong audience/expiry/unverified email; conflicting subject; disabled eligibility cases.

### AFTER

- **Files changed:** Auth Google handler and provider fixtures listed BEFORE.
- **Tests added/passed:** Audience/identity/link conflict cases in `tests/p2-hardening.test.js` plus existing auth fixtures pass.
- **Original behavior check:** Wrong-client/unverified/conflicting synthetic identities are refused; no arbitrary-victim exploit was asserted or attempted.

Synthetic provider identity tests pass. Missing client configuration fails closed. **Actual OAuth consent, provider errors and intended deployed client/origins remain unverified.** Tests establish the local contract, not provider success.

## F5 — Product review validation and duplication

### BEFORE

- **ID/priority:** F5, P2.
- **Files:** `utils/catalogueQuery.js`, `models/Product.js`, review controller/routes, `tests/p2-hardening.test.js`.
- **Root cause:** server/model accepted out-of-range ratings/oversized comments; a read-then-save duplicate guard was non-atomic.
- **Fix:** numeric integer rating 1–5, required trimmed text at most 2,000 characters, model validation, customer-only writes and 10 requests/15 minutes per customer. A conditional aggregation update appends once and recomputes aggregate rating/count atomically; Mongoose pipeline mode is explicit.
- **Risks considered:** malformed types, comments as objects, repeated/concurrent requests, mongoose pipeline behavior and inactive/nonexistent products.
- **Planned tests:** invalid values rejected before reads/writes; valid text retained; model bounds and atomic duplicate predicate.

### AFTER

- **Files changed:** Product model, review handler/routes and input helper listed BEFORE.
- **Tests added/passed:** Handler bounds/duplicate predicate and actual synthetic Product model validation pass in `tests/p2-hardening.test.js`.
- **Original behavior check:** Rating 999 and oversized/non-text review fixtures fail server/model validation before mutation.

Validation and handler regressions pass. The actual local Mongo pipeline test now confirms eight concurrent same-customer reviews store one review, return one 201/seven 409 responses and compute the correct count/rating. Deployed indexes/data remain unverified. No historical invalid reviews were altered. **Verified purchase/rental eligibility is not added**; authenticated customer status alone is not evidence that a reviewer rented the item.

## F6 — Published product references

### BEFORE

- **ID/priority:** F6, P2.
- **Files:** `utils/cmsProductReferences.js`, CMS publish controller, homepage product/showcase consumers, admin CMS/catalogue helpers and tests.
- **Root cause:** homepage selections could refer to missing/unpublished items; individual fetch failure dropped cards.
- **Fix:** validate the three homepage selected-ID arrays before publish against current public products, at most 40 per array; reject invalid/missing references. Batch selected reads, keep CMS order, use a real public fallback when the entire selection is absent and paginate administrative pickers.
- **Risks considered:** stale installed selections, changing/deleting products after publish, public API changes not yet deployed and preserving complete private editor records.
- **Planned tests:** valid/invalid references, deleted/inactive rejection, bounded pagination and public CMS/preview cache isolation; populated responsive rails.

### AFTER

- **Files changed:** Publish reference helper/controller, homepage readers and admin pickers listed BEFORE.
- **Tests added/passed:** Missing/inactive publish rejection and bounded picker tests pass; selected/catalogue regressions pass.
- **Original behavior check:** A synthetic missing selected ID blocks publish rather than silently publishing invalid references; installed production IDs were not rewritten.

Publish-validation and picker tests pass; the populated About/PDP rails fit the tested viewports. **Existing deployed stale CMS references were not edited.** A later product deletion/deactivation can make an already-published selection stale; publication checks are not a lifetime referential guarantee. An authorized editor must replace the audited stale IDs on staging/deployment. The deployed API may ignore new selected-ID filters until updated; the client still filters returned IDs.

## Related P2 UI, SEO, quality and read performance

### BEFORE

- **Files/scope:** storefront navigation/login/PDP/product rails, footer destinations and trust sprite; public metadata/server API/sitemap/robots/private layouts; admin session/layout/catalogue/editors/lint fixes; package scripts and `.github/workflows/quality.yml`.
- **Root causes:** unnamed/custom interactive actions, rail overflow/contrast/target issues, invalid or placeholder links, duplicate CMS reads, incorrect private indexing/canonicals/share dimensions/soft product 404s, stale locally trusted admin roles and quality gates omitting tests/lint/syntax.
- **Fix:** native named controls and landmarks, contained rails, contextual color/target adjustments, safely omitted unconfigured destinations, shared published-only requests and batched products, an optimized unchanged trust illustration sprite; centralized server/browser API resolution, canonical metadata/noindex/robots/sitemap and a 1200×630 share image; server-validated admin authority, complete private editing records, rule-preserving lint repairs and meaningful CI scripts.
- **Risks considered:** preview/private cache leakage, silently incomplete catalogues/sitemaps, localStorage role forgery, network failure granting authority, existing editor data loss, image crops and claiming full accessibility/performance from a narrow sample.
- **Planned checks:** frontend/admin unit suites and lint/build; production localhost metadata/status/header/image probes; responsive populated About/PDP widths 390/768/1024/1440; absent-auth admin navigation without real sign-in.

### AFTER

Production HTTP evidence verifies malformed/missing product 404s, private noindex, per-page blog/Apple canonical/social URLs, enforcing request-nonce CSP, 1200×630 PNG, robots sitemap/private rules and a 107-URL sitemap at the observed catalogue snapshot. Responsive samples have no document-width overflow; visible PDP buttons are named, cart links report item count, and homepage/login/PDP each have one main landmark. The trust sprite preserves its four illustrations at 15,808 bytes instead of the original 1,291,537-byte PNG. Public-only shared CMS caching does not reuse preview/account requests.

Both production builds and targeted suites pass. Full lint has zero errors; remaining plain-image optimization warnings are recorded in the report. No full WCAG/axe/screen-reader/zoom/cold-mobile/field performance certification is made. No social-contact ownership, authenticated deployed admin CRUD, testimonial publishing or real provider flows were verified. Unavailable B2B/social/WhatsApp actions are omitted until verified configuration exists. Advertised navigation now excludes all 17 ComingSoon route destinations (12 previously visible links removed); direct routes retain truthful placeholders and no refund/subscription implementation is claimed. Careers uncertain-retry deduplication is now locally implemented as described below; actual local database concurrency was subsequently checked with synthetic records only; no deployed candidate mutation was used for evidence.

## Careers application retry safety — P2 audit flow

### BEFORE

- **Affected files:** `models/CareerApplication.js`, `routes/careersRoutes.js`, `utils/careersValidation.js`, new `utils/careersStorage.js`, careers tests; frontend careers page, new submission helper and tests.
- **Root cause:** uncertain responses could lead the browser to submit a second application without a durable shared reference.
- **Fix:** retain a UUID for unchanged details until an acknowledged receipt, store a normalized payload hash, return the existing persisted receipt for same-key/same-details retries, reject changed details under the same key with 409. Require an actual exact unique sparse submission-ID collection index before reads/writes. Advertise retry-safe API capability; updated browser refuses to POST to a legacy API.
- **Risks considered:** simultaneous retry, persistence failure, a changed form/closed job after original receipt, conflicting payload, missing/wrong index scope, old API ignoring keys, false success on malformed acknowledgments and page reload.
- **Tests planned:** identity normalization, model/index contract, actual route with synthetic database doubles, conflict/failure/concurrency, index readiness failures, client retained/reset key and capability denial.

### AFTER

- **Files changed:** the listed model/routes/validation plus storage/client helpers and tests.
- **Tests added/passed:** 10 backend careers tests pass (four added); two new frontend submission tests pass.
- **Original behavior check:** synthetic duplicate and uncertain retries receive one stored application's ID/reference. Conflicting details return 409; missing/wrong actual index returns 503 before lookup/write. Malformed/unconfirmed acknowledgment cannot clear the browser retry key or claim success.

The actual required index is `{ submissionId: 1 }` with `unique: true`, `sparse: true`, no partial predicate and no additional compound key. Its declaration alone is not proof it exists. Deploy through a reviewed additive migration after duplicate/pre-existing data checks; no production index/data migration was run. Release matching frontend/backend revisions: an older Render API does not advertise `applicationSubmissionVersion: 1`, so the updated browser keeps application submission unavailable until compatible service deployment.

This deduplicates keyed unchanged retries, not all repeated applications by email. Page reload loses the in-memory client attempt; old keyless clients get a new server-generated key and cannot deduplicate uncertain retries. Actual local MongoDB unique-index concurrency now passes: six simultaneous unchanged requests return one receipt and persist one record; changed details return 409. Deployed indexes remain unverified. No email provider or notification side effect was introduced, and no candidate data was written to the deployed service.

## Release gate

Use [REMEDIATION_REPORT.md](REMEDIATION_REPORT.md) for final command counts and the remaining operator/deployment gates. **READY FOR STAGING: NO. READY FOR LIVE CASHFREE: NO.** The patch is reviewable local code, not permission to activate live payment or assurance that the deployed application serves it.
