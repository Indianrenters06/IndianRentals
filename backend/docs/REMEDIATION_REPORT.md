# Controlled remediation report — 1 October 2026

Scope: local follow-up prepared for main-branch integration: P0 authorization/credential remediation, S5 payment foundation, remaining P1 security and selected P2 security, storefront, SEO, admin and quality fixes. The user explicitly requested P1/P2 continuation while the real MongoDB/Cashfree Phase 3 gate was unavailable. This changes implementation sequencing; it does not waive provider/database/release gates. This is an uncommitted reviewable patch, not launch certification.

## 1. Baseline

- Branch: `hemant-changes`; audit/current HEAD: `72d334557f8756a52c374c253ae83cef639d7380`.
- Initial tree matched the audited revision and was clean. Remediation changes were made in this run; no pre-existing user edits were discarded.
- Primary specification: `.gstack/launch-audit-2026-10-01/LAUNCH_READINESS_REPORT.md` and the user's remediation instructions. Original evidence and architecture evidence were reviewed; source and regression tests remained the authority.
- Agents handled storefront, SEO, admin quality, independent review and documentation with separate ownership. Integration review corrected private editor data loss, pagination mismatch, account-state paths, stale KYC approval, legacy replacement, Mongoose pipeline mode and proxy-origin propagation.
- No reset, force push, history rewrite, production credential rotation, real identity download, live payment, real-customer mutation, fabricated production admin, authenticated deployed CRUD, deployment, commit or push was performed. No project dependencies were added; a verified temporary MongoDB binary supported isolated tests.
- Public deployed catalogue/CMS reads supported local UI/metadata checks. An isolated browser selected Reject optional to uncover the mobile sign-in control; the consent component may attempt an anonymous preference receipt request. No authenticated business records were written. Localhost is not proof that writes target a local database; development admin configuration still points at the existing deployed API.

## 2. P0 status

| ID | Previous status | New status | Test evidence |
| --- | --- | --- | --- |
| S1 | Client request could mark own/foreign rental paid; foreign order reads | Local code fixed: customer settlement route removed; owner/order-module read policy | Original own/foreign paid request now 404 without paid mutation; unauthorized reads denied; client paid fields ignored |
| S2 | Customer-management permission could alter privileged account contacts | Local code fixed: actor and customer-only target checks across modern/legacy customer and linked KYC paths; conditional target-role mutations | Privileged-role denial, actor permission denial, concurrent promotion denial, authorized customer positive tests |
| S3 | OTP/recovery material leaked in general user responses | Local code fixed: nested response allowlists, default secret exclusion, intentional verification queries and OTP purpose binding | DTO/model tests exclude current/future secret fields; valid/invalid/expired/replayed/purpose-mismatched verification cases |
| S4 | Tracked authentication artifact and unsafe bootstrap generator | Current artifact/generator removed; ignore/scanner/incident plan added. External incident closure remains pending | Removal/ignore/scanner fixtures pass; working-tree scan has zero findings; old material remains in Git history |

The P0 checkpoint was delivered before payment implementation: [P0_REMEDIATION.md](P0_REMEDIATION.md), 78 backend tests and 122 syntax checks at that point. Independent review identified an omitted linked KYC target check; it was fixed and verified before proceeding. Final review finds no remaining material P0 code blocker in the reviewed scope. This does not certify the deployed service or revoke historical sessions.

Follow [CREDENTIAL_INCIDENT.md](CREDENTIAL_INCIDENT.md) for issuer assessment, session revocation/key rotation implications and separately approved history cleanup. No credential contents are included here. Merge/release sequencing and rollback cautions are collected in [MERGE_HANDOFF.md](MERGE_HANDOFF.md).

## 3. Payment architecture

### S5 change record

**Before:** rental creation accepted client unit prices, taxes, delivery, discounts and total. The provider charged stored client-controlled money. A forged quote could underpay. Original exploit was reproduced by the new server-quote regression before the fix.

**Affected files:** rental/payment controllers and routes, Rental/Settings models, checkout and confirmation pages, Cashfree configuration/SDK; new quote, settlement and storage-readiness helpers.

**Fix:** selections-only checkout, authoritative integer-paise calculation from server records, reviewed quote hash, immutable order snapshot, owner-scoped checkout idempotency, transactionally consumed coupon usage, fixed provider order ID, stable provider request key, independent captured-payment reconciliation and atomic paid transition. Only the server verifies success; redirects and customer/provider callback fields are not payment authority.

**Risks considered:** price changes after review, last-use coupon replay, simultaneous checkout creation, transaction retries, missing unique indexes, duplicate/late/out-of-order callbacks, cancellation races, uncertain SMTP delivery, legacy unpaid orders, changed deposit collection and provider API contract differences. Tests now cover actual disposable local MongoDB concurrency as well as controlled provider responses; deployed MongoDB and real provider behavior still require Phase 3 verification.

**After:** forged client money no longer sets order or provider amount in local tests. Changed quotes require review. Twelve concurrent mocked callbacks settle and claim a receipt once; persistence failures request retry. Real raw-byte HTTP signature tests reject a changed body. Late/cancelled payment requires manual refund review and cannot progress fulfilment.

F1 maintenance and F2 false-success acknowledgments are corrected as payment work. F3 uses a conditional atomic settlement transition and actual-index readiness guard. No automatic inventory/accounting/fulfilment side effect was introduced, so callback duplication cannot repeat those actions in this patch.

See [PAYMENT_FOUNDATION.md](PAYMENT_FOUNDATION.md) for states, pricing policy, additive schema/index requirements, coupon behavior, stock limitations, receipt recovery and the sandbox runbook.

## 4. Cashfree sandbox status

**No actual Cashfree transaction, hosted checkout or provider callback delivery was performed.** Provider fixtures remain controlled doubles. Actual database integration now passed against disposable loopback MongoDB 8.0.15; it is database evidence, not gateway validation.

The follow-up downloaded the official MongoDB 8.0.15 binary to temporary storage, checked its SHA-256 and started a loopback-only disposable replica set. Integration suites created and cleaned unique synthetic databases without using `MONGO_URI` or production customer data. Cashfree/private provider configuration and hosted delivery remain absent. See [LOCAL_DATABASE_VERIFICATION.md](LOCAL_DATABASE_VERIFICATION.md).

The existing Cashfree integration and API version `2023-08-01` were retained. Server and client both enforce sandbox; production mode requests fail closed. Current provider documentation was checked; actual version-specific merchant behavior is still unverified.

### Payment sandbox readiness

Checked means implemented and covered by local regression tests, **not provider-certified**:

- [x] Server-authoritative pricing.
- [x] Order ownership.
- [x] Provider order/customer reconciliation.
- [x] Amount reconciliation.
- [x] Currency reconciliation.
- [x] Exact-body signature validation.
- [x] Atomic settlement/idempotency implementation and mocked concurrent regressions.
- [x] Retry behavior, including last-use coupon and simultaneous checkout replay.
- [x] Failure/cancellation behavior and manual-review guard.
- [x] Customer money tampering rejected.
- [x] Cashfree secrets remain server-only; no secret values were added or printed.
- [x] Actual disposable local MongoDB replica-set transaction/index/concurrency verification; deployed database remains a gate.
- [ ] Successful hosted Cashfree sandbox checkout.
- [ ] Successful real signed sandbox webhook and dashboard retry verification.

**LIVE PAYMENT ACTIVATION RECOMMENDED: NO.**

## 5. P1 status

| ID / flow | New status | Evidence and limits |
| --- | --- | --- |
| S5 authoritative pricing/payment reconciliation | Locally fixed; deployed database/provider gate pending | Actual local replica-set checkout/coupon/settlement concurrency passes; no hosted sandbox charge |
| S6 blocked/inactive accounts | Locally fixed | Central request/session checks; blocked/inactive sign-in variants and positive active cases pass. Session-version revocation is now added under S13; transport exposure remains |
| S7 private KYC/state consistency | New local contract fixed; legacy/provider gate pending | Authenticated raw assets, owner/field receipts, private DTO/download, transactional state and stale-approval guard. Old public assets were not migrated/deleted |
| S8 arbitrary KYC URL retrieval | Locally fixed | URL/foreign references rejected before writes; old URL download rejected with zero outbound requests; trusted signed server fetch is bounded |
| S9 JSON-LD escaping | Locally fixed | Closing-script payload regression and JSON round trip pass; PDP uses serializer |
| S10 unsafe bootstrap | Removed with S4 | Current generator removed; actual account/history assessment and incident closure pending |
| F1 maintenance blocking callbacks | Locally fixed with payment work | Only exact webhook POST bypasses maintenance; signature required |
| F2 acknowledged processing failures | Locally fixed with payment work | Failure responses permit retries; receipt intent/manual recovery documented |
| F4 misleading newsletter success | Locally fixed by removal | Unsupported subscription form/local acknowledgment removed; no newsletter backend claimed |
| F7 commercial/fulfilment/refund flow | Unverified end to end | Synthetic authenticated staging/provider matrix required; recurring charges/refund automation not supplied |
| Admin/CMS/forms deployment persistence | Still unverified | No real sign-in, authenticated deployed save/publish/testimonial approval or customer writes used to certify persistence |

Per-finding BEFORE/AFTER records, files, root causes, fixes, risks and tests: [P1_P2_REMEDIATION.md](P1_P2_REMEDIATION.md). The private-storage and legacy migration runbook is [KYC_PRIVATE_STORAGE.md](KYC_PRIVATE_STORAGE.md). API/environment ownership and tracked public build inputs are documented in [ENVIRONMENT_CONFIGURATION.md](ENVIRONMENT_CONFIGURATION.md).

KYC changes are not an assertion that existing Cloudinary/CDN links are inaccessible. Suppressing legacy URLs and refusing application downloads protects the new application path; old public/derived assets require provider-side migration/deletion/invalidation evidence. Actual local KYC transactions and rollback pass; deployed database, private provider denial and mail delivery remain unverified.

## 6. Remaining P2/P3 and implemented P2 work

### Security and data contracts

| ID | Local result | Remaining limit |
| --- | --- | --- |
| S11 | Exact owned CORS origins, unsafe-origin rejection, deliberate JWT-cookie write policy; proxy preserves Origin | Configure actual storefront/admin origins; verify HTTPS/proxy behavior and distributed limits |
| S12 | Public Settings top-level/nested allowlist; missing defaults cause no public GET write | Privileged stored-secret inventory and deployed configuration remain operator checks |
| S13 | Account-wide persisted session-version revocation implemented; clients revoke before clearing state, including cookie-only retry after stale bearer denial | Actual local Mongo replay/concurrency and client failure contracts pass. JS/localStorage exposure and 30-day lifetime remain; HttpOnly-only transport migration is deferred |
| S14 | Query/header/referrer/identity omitted from access logs; preview issuance private/no-store/no-referrer; preview excluded from shared cache | Query tokens remain in browser URLs/history and possibly independent edge logs; retention/access unverified |
| S15 | **Enforcing request-nonce CSP** on both apps; framework/JSON-LD/provider/theme nonce wiring | HTTP/browser hydration and parser-inserted untrusted-script denial pass. Dynamic private/no-store HTML, inline styles and strict-dynamic trust delegation are explicit tradeoffs; actual provider/CDN compatibility and report collection pending |
| S16 | Reviewed OTP/provider/auth/mail/SMS diagnostics made generic; production error output sanitized | Historical logs, production exports/access/retention and every future log path not certified |
| S17 | Literal bounded search, positive integer pagination, public projection/active filtering, bounded selected IDs; private paginated full editor records | Shared limits/proxy configuration, explain plans and deployed API contract remain gates |
| S18 | Intended Google client audience/expiry, verified email/subject and conflicting-link checks; disabled account enforcement | Real OAuth/client-origin/provider failure flow unverified |
| F3 | Atomic settlement/idempotency covered in S5 | Actual local unique-index/transaction/concurrency passes; deployed persistence/provider delivery remains unverified |
| F5 | 1–5 integer rating, trimmed text at most 2,000 chars, model bounds, customer-only rate limits and conditional atomic duplicate append | Actual local pipeline concurrency passes; deployed data repair unverified; verified-rental eligibility not added |
| F6 | Reject missing/inactive/invalid selected IDs at homepage publish; batched public reads and bounded complete admin pickers | Existing deployed stale IDs not edited; later deletion can stale a published selection |

### Storefront, links, SEO and read performance

- Follow-up PDP checks fit widths at 320/390/768/1024/1440; axe reports zero violations at 320/1440 with manual-review limits retained. Tenure/benefits/sign-in entry, keyboard containment, Escape, focus restoration and scroll locking pass. Shared lock ownership covers overlapping overlays. Clipped testimonial links reveal their content on focus; absent ratings no longer invent reviews. See [LOCAL_UI_CHECKS.md](LOCAL_UI_CHECKS.md).
- Populated About/PDP rails fit document widths at 390/768/1024/1440. Gallery thumbnails/share/wishlist use named native controls; cart links report item count. Homepage/login/PDP each have one main landmark; login/mobile product headings and a stable homepage h1 were checked.
- Contextual product price/status/retry/helper colors and carousel targets were adjusted. Hosted checkout owns real payment-method choice; decorative payment SVGs are hidden from assistive technology. This is a targeted repair, not full WCAG certification.
- Unavailable B2B/placeholder or unsafe social/WhatsApp actions are omitted until verified configuration exists. Shipping/ticket/review aliases resolve to the appropriate canonical destinations; no branch/contact ownership was guessed.
- Public homepage CMS consumers share in-flight, single-page published GET requests with a short success cache and bounded timeout; queries/hash, Authorization, preview/draft/profile/private requests are not reused. Preview failure does not substitute published fallback content. Selected products are fetched in batches of at most 40 in CMS order. Showcase collections now use targeted category/keyword queries rather than assuming relevant items are in the first 100 catalogue records: limit 20 per category/keyword page, at most two keyword pages per alias, at most 32 queries and a 10-second overall deadline. Missing explicit selections never substitute unrelated products. Excessive/poorly matched configuration or more than 40 irrelevant keyword matches can still yield an honest empty collection.
- Public list projection omits full reviews/descriptions/specifications. Authorized admin editing loads complete private records so changing a CTA/product cannot erase FAQs/specifications through projected list data.
- The unchanged four-illustration trust sprite is delivered as a 432×432 WebP, **15,808 bytes**, replacing the 1,291,537-byte plain PNG delivery; the original source remains.
- Shared server API resolution rejects relative server URLs and distinguishes absence from upstream failure. Public metadata/canonicals/OG/Twitter fallbacks are aligned; dedicated product SEO fields and per-post/Apple child metadata are used. Private account/checkout/preview routes have noindex. Robots excludes private paths per crawler group; sitemap collects bounded public catalogue pages, published posts and canonical static policies. Invalid/missing products return real HTTP 404. `/share-image` returns a 1200×630 PNG.

### Admin, quality and local login connection

The admin dashboard grants no authority from localStorage role claims. It validates the persisted active administrative account before rendering protected children; expired/customer/disabled sessions redirect, and network/server failures offer retry without granting access. Anonymous navigation to the production-local dashboard returned the sign-in screen without the protected shell. No real sign-in success is asserted.

The earlier localhost “Failed to fetch” root cause was a separate login/recovery fallback to port 5000, occupied by macOS Control Center/AirTunes returning 403 without CORS. Login/recovery now use shared `API_BASE_URL`; ignored `admin/.env.local` selects the existing public deployed API origin consistently. Its OPTIONS preflight returned 204; a synthetic intercepted login selected the intended endpoint. No credentials/account/backend permissions were changed. This fixes the observed connection routing, not proof of the user's actual credential validity.

All 17 existing ComingSoon route destinations are excluded from advertised navigation; this removes 12 previously advertised links (six payment/payout, five notification and one gateway-settings link). Direct URLs retain the truthful ComingSoon screen. No refund/subscription implementation is implied.

Admin lint errors were repaired without disabling rules. Backend `npm test` now runs the existing suites, and the backend CI job starts a disposable version-pinned Mongo replica set for the integration suites; backend syntax, frontend/admin test/lint/build and dependency-audit jobs are wired into the existing CI matrix. The GitHub workflow itself was not dispatched or certified from local commands.

### Work still requiring separate evidence or scope decisions

- Deployed database indexes/transactions/migrations, private storage denial/legacy migration, sandbox payment/webhook/retry delivery, OAuth and test-recipient mail/SMS. Actual disposable local database checks are now complete.
- Authenticated staging product/customer/order/inventory/coupon/team/report/CMS/SEO settings, draft→preview→publish→storefront→rollback, testimonials and page-banner background persistence.
- S13 HttpOnly-only transport/lifetime migration, deployed revocation compatibility; S15 provider/CDN/browser compatibility and reporting; production edge log redaction/retention and shared abuse limits.
- Direct ComingSoon operational refund/subscription/GST/notification/settings routes remain incomplete; advertised navigation is now filtered. Implement these only if included in the agreed launch scope. Careers uncertain-network-retry application deduplication is locally fixed: a stable client reference and normalized payload hash return the same persisted receipt; a changed payload with the same key returns 409. A real exact unique sparse submission-ID index is required before lookup/write, otherwise 503. The API advertises version 1; the updated UI disables submission against older APIs. Reload/keyless legacy requests do not retain a client reference, and deployed index/concurrency behavior remains unverified. The actual local unique-index test now passes.
- Full screen-reader/zoom/real-device and additional page accessibility coverage; cold-mobile and field Core Web Vitals; measured bundle/font work and remaining delivered image variants. Targeted PDP reflow, axe, keyboard dialogs and long testimonial focus checks are recorded separately. No fabricated Lighthouse score.
- Verified external social/B2B/contact configuration, Search Console/public social preview cache, actual serving revision/HTTPS/HSTS/domain redirects, backups/restore, CDN purge/cache and privacy deletion operations.
- Further fixture/snapshot/dependency cleanup requires evidence that each item is unused. The confirmed JPEG extension mismatch is corrected with a permanent compatibility redirect. No indiscriminate dependency deletion or broad cleanup was mixed in.

## 7. Security regression tests added

| Suite / check | Coverage |
| --- | --- |
| Backend P0 suites | Removed paid mutation/ownership, customer-only privileged targets, OTP purpose and response allowlists, current credential hygiene |
| `server-quote`, `checkout-storage`, `sandbox-config`, `payment-security` | Authoritative paise quotes, review hashes, checkout/coupon replay, required actual-index definitions, sandbox-only mode, raw signatures, reconciliation/retry/cancellation and receipt ambiguity |
| Actual Mongo integration suites | Payment checkout/coupon/settlement concurrency; KYC synchronization/rollback/approval conflict; review/career deduplication; CMS draft/publish/discard; testimonial data CRUD; session replay/password/reset concurrency. Unique synthetic databases cleaned |
| `account-state` | Blocked/inactive protected requests and every covered session path; active positive cases and central issuer |
| `kyc-private` and existing KYC/customer-target suites | Private upload/reference/DTO/download constraints, no arbitrary outbound fetch, actor/target isolation, transactions, changed approval and legacy replacement |
| `p2-hardening` | Exact origins/cookie writes, public settings, log redaction, bounded literal catalogue, review handler/model bounds and atomic predicate, CMS product references, Google identity |
| Frontend `cashfree-sandbox`, `json-ld`, `public-content`, `seo`, `showcase-catalogue` | SDK mode, script-safe JSON, removed fake newsletter, shared public request/private isolation, links, canonical/noindex/robots/sitemap/404, targeted catalogue discovery/bounds/outages |
| Careers route/validator/storage and frontend retry suites | Stable keyed receipt, changed-payload rejection, actual-index readiness, synthetic concurrent conflict/failure and legacy API capability guard; 10 backend careers tests and 2 new frontend cases pass |
| Existing frontend consent/analytics/homepage suites | Consent/failure/retry/private-path contracts and homepage fallback stability retained |
| Admin session/catalogue/navigation suites | Persisted role/status authority, denial/retry behavior, public/private pagination, bounded collection and unavailable-route navigation filtering |
| Session/CSP/client follow-up | Actual session-version replay and concurrency; stale-bearer/cookie-only logout retry; failure retention; enforcing nonce policy/hydration/inline-script denial; overlapping scroll-lock ownership |
| Independent integration review | Actual route-chain synthetic 401/403, private full inactive product read for authorized editors, private caching, related active filtering, preview policy and proxy-origin rejection |

Tests use synthetic identities/bytes. Three integration suites now use real disposable loopback MongoDB collections, indexes and transactions; provider delivery remains mocked or unused. This does not certify production data or persistence topology. No actual customer documents or provider instruments were involved.

## 8. Existing tests and final checks

| Check | Result |
| --- | --- |
| Original backend baseline | 34/34 passed |
| Original frontend baseline | 19/19 passed |
| Final backend `npm test` with local `TEST_MONGO_URI` | **180 passed, 0 failed, 0 skipped** |
| Final frontend `npm test` | **53/53 passed** |
| Final admin `npm test` | **19/19 passed** |
| Backend `npm run check:syntax` | **148 JavaScript files passed** |
| Frontend `npm run lint` | **0 errors, 25 warnings**; image optimization warnings and one existing auth-interceptor Next navigation warning |
| Admin `npm run lint` | **0 errors, 30 warnings**; plain-image optimization warnings |
| Dependency audits | Backend, frontend and admin `npm audit --audit-level=high` each exited 0 with **0 reported vulnerabilities** at the observed lockfile/advisory snapshot |
| Frontend production build | Passed with normal `npm run build` in the final synchronized isolated copy (exit 0) |
| Admin production build | Passed with normal `npm run build` in the final synchronized isolated copy (exit 0) |
| `git diff --check` | Passed; final documentation is also checked for trailing whitespace |
| Working-tree credential scanner | **0 findings**; bounded current-tree scan, not clean-history certification |
| Production-local HTTP | Malformed/missing PDP 404; private noindex; correct sampled public canonicals/OG URLs; share PNG 1200×630; robots private exclusions/sitemap; observed sitemap 107 URLs; enforcing request-nonce CSP; legacy PNG redirects to JPEG |
| Responsive/semantics samples | Prior About/PDP widths and follow-up PDP320/390/768/1024/1440 have no document overflow; axe zero violations at320/1440, manual-review limits; keyboard drawers/sign-in and long-review CSS focus verified |
| Anonymous admin | Sign-in redirect; no protected shell or assumed authority; real credentials not tested |
| Source review | No remaining material local blocker found in reviewed P0/S5 and latest P1/P2 integration scope; operational limits retained |

Evidence is retained in ignored `.gstack/remediation-2026-10-01/` and follow-up `.gstack/local-followup-2026-10-01/`, including `p2-http-checks.json`, `p2-storefront-evidence.json`, lint JSON/logs, isolated build logs and final test logs. The sitemap count describes that observed public snapshot, not a hardcoded catalogue count. Production builds used separate copies/dependency clones and did not overwrite the active development `.next` output. A final hash comparison found zero differences between the built copies and current frontend/admin source, configuration package scripts, public assets and tests (`local-followup-2026-10-01/build-source-check.json`); generated `next-env.d.ts` is excluded because each build regenerates its output path. A read-only careers probe returned HTTP 200 without the new retry capability from the existing API; capability tests verify the updated browser prohibits submission until the matching backend is released.

The final synchronized production builds, test/lint/syntax commands, current-tree scanner and whitespace checks pass with the stated warnings and zero skipped tests in the database-enabled run. Running without the dedicated test URI skips integration and is not equivalent evidence. Local HTTP results do not prove deployment headers, provider callbacks or real account access.

## 9. Files changed

- **Authorization/identity:** auth/admin/user/rental/KYC controllers and routes, User model, `customerAccess`, `orderAccess`, `accountAccess`, `generateToken`, `userResponse`: P0 policies/DTO/OTP, active account enforcement and safe administrative profile authority.
- **Credential incident:** `.gitignore`; removed `backend/token.txt` and unsafe generator; added current-tree scanner and incident/P0 runbooks. Deletion does not revoke historical credentials.
- **Money/payment:** payment/rental controllers, Cashfree config/SDK, Rental/Settings, quote/settlement/storage helpers, maintenance middleware, checkout/confirmation UI: authoritative reviewed money and sandbox-only reconciled idempotency/retry.
- **KYC:** `KYCAsset`, KYC model/service/controllers/upload contracts, private staff blob UI/viewer and storefront migration warning: owner-bound authenticated assets, private DTO/download and transactional review state.
- **HTTP/data hardening:** `httpPolicy`, `publicSettings`, `catalogueQuery`, `cmsProductReferences`, product/settings/CMS controllers and routes, proxy origin forwarding, provider/error diagnostics and both Next configs.
- **Storefront/CMS/read performance:** named navigation/login/gallery actions, product rail styles/contrast/targets, shared published content helpers and timeout/cache isolation, batch/targeted catalogue readers, safe footer destinations and delivered trust WebP.
- **SEO:** server API/metadata/serialization helpers, route layouts and product/blog metadata, private noindex, sitemap/robots/llms and share-image route.
- **Careers retry:** `CareerApplication`, careers route/validation/storage helpers and frontend submission helper/page: durable submission references/hash, actual unique-index gate, receipt confirmation and legacy API capability guard; no mail provider added.
- **Admin/quality:** persisted session validation, full private catalogue/editors, truthful unavailable-route navigation filtering, lint-rule repairs, meaningful package scripts and CI matrix; no dependencies added.
- **Sessions/CSP/accessibility follow-up:** versioned JWT enforcement and acknowledged dual-transport logout, atomic password/reset revocation; enforcing request nonces on both applications; dialog focus/scroll locks, responsive review focus and corrected JPEG redirect.
- **Regression/documentation:** suites in section 7, synthetic and actual disposable database helpers, local session/CSP/database/UI notes and this report.

The initial security/payment phase preserved homepage/demo/testimonial design. Later authorized P1/P2 work touches shared components, metadata, accessibility and read behavior; it does not claim authenticated deployed design/content publishing.

## 10. Manual actions required from the operator

1. **Close the credential incident privately:** follow [CREDENTIAL_INCIDENT.md](CREDENTIAL_INCIDENT.md). Assess issuer/subject/bootstrap use and abuse; revoke affected sessions and coordinate any required signing-key rotation. Separately coordinate history cleanup. Do not paste values into chat.
2. **Configure an isolated synthetic environment:** ignored backend env/private server configuration with isolated `MONGO_URI`/`JWT_SECRET`, sandbox-only Cashfree credentials/API version, intended Google client ID, private Cloudinary credentials and test-recipient mail/SMS. No production customer database or credentials for tests. Route both browser and server API resolvers there before any writes.
3. **Database gate:** repeat the now-passing disposable local integration suite against a controlled staging replica set using reviewed synthetic isolation, and validate actual deployment topology/write concern. Review additive unique checkout/provider indexes, KYC receipt/state requirements and the exact unique sparse `{ submissionId: 1 }` careers index. Career submissions fail closed without the actual index; release the matching API capability and browser together. Do not blindly synchronize/drop production indexes; prove backups/restore and restricted service access.
4. **KYC privacy gate:** follow [KYC_PRIVATE_STORAGE.md](KYC_PRIVATE_STORAGE.md). Prove unsigned denial and authorized no-store synthetic download, then inventory/migrate or re-upload old assets and invalidate public originals/derived/CDN copies. Define quotas, retention, orphan cleanup and malware policy. New reference DTOs do not repair old CDN exposure.
5. **Payment gate:** configure a reachable controlled HTTPS sandbox webhook and retained API contract; verify raw bytes/headers/capture/fee semantics, hosted success/failure/abandonment, retries/duplicates/concurrency, maintenance, confirmed amount/owner/currency and manual refund review. No live activation.
6. **Origin/session/provider gate:** configure exact owned storefront/admin origins and validate deployed proxy/HTTPS/cookies. Confirm Google client/origins/verified linking and controlled mail/SMS delivery. Release the S13 backend/client revocation contract together; retain the documented bearer/lifetime risk until transport migration. Validate S15 enforcing CSP against providers and nonce-safe HTML/CDN behavior, and plan reporting; inspect independent edge logs.
7. **Business/launch scope:** approve deposit/installment/GST/delivery/coupon usage/stock allocation and receipt-recovery policy. Keep incomplete refund/subscription/GST/notification/settings features outside advertised launch navigation, or finish their contract if required. The filtered direct ComingSoon routes are not completed features. Recurring/refund/reservation/outbox automation is not supplied.
8. **Controlled authenticated staging:** test permission-scoped admin/customer/CMS persistence, complete private product edits, draft/preview/publish/rollback, testimonials/banner settings and complete rental fulfilment. Replace existing stale published IDs through an authorized editor. Verify contacts/social/B2B destinations through configuration.
9. **Deployment/observability gate:** identify serving commit/hosts, validate canonical redirects/HTTPS/HSTS/CDN/cache/private denial, release rollback, legal retention/deletion operations, Search Console/social previews and representative accessibility/cold-mobile performance. Run the updated CI; local commands do not prove hosted workflow success.

## 11. Staging readiness

**READY FOR STAGING: NO.**

Local P0/P1 and selected P2 checks pass, including actual disposable Mongo concurrency, session revocation, enforcing nonce CSP and targeted UI accessibility. Historical credential closure, deployed database/index/migration behavior, Cloudinary private denial and old-asset migration, hosted sandbox checkout/webhook/retry success, OAuth/mail/SMS, business scope, authenticated deployed persistence and serving-environment checks remain required. S13 transport/lifetime risk remains; S15 provider/CDN compatibility is unverified. A controlled test environment is needed for that evidence; this is not approval for public staging.

## 12. Live payment readiness

**READY FOR LIVE CASHFREE: NO.**

All staging gates remain; actual sandbox success is absent and live Cashfree is deliberately disabled in server and client. Do not add live credentials or deploy this as a production payment release. Sandbox success alone will not authorize live activation: incident, identity/privacy, deployment and operations require their own evidence.
