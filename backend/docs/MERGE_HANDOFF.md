# Main-branch integration handoff — 1 October 2026

Working branch: `hemant-changes`, base/current commit `72d334557f8756a52c374c253ae83cef639d7380`. Changes remain local and uncommitted. This handoff prepares review and release sequencing; it does not perform a merge or certify launch.

## Local checks completed

- Backend180, storefront53, admin19 tests: **252 passed, zero failures**; database-enabled backend run has zero skips.
- Actual disposable Mongo replica-set checks cover payment/coupon/settlement concurrency, KYC transactions/rollback, review/career deduplication, CMS/testimonial persistence and session replay/reset races.
- Both normal production builds pass in isolated synchronized copies. Backend syntax passes148 files. Lint has zero errors; existing image/navigation warnings remain. All three observed dependency audits and the bounded credential scan pass.
- Enforcing CSP nonce/header/cache/browser checks, responsive PDP320–1440, targeted axe and keyboard dialogs pass with the documented manual-review limits.
- CI now starts a disposable Mongo8.0.15 replica set for backend tests. The hosted workflow has not been run.

## Before deployment after merge

1. Review the complete patch and run the quality workflow on the candidate merge revision. Never include ignored environment files or temporary Mongo/evidence directories.
2. Inventory required additive indexes/schema changes from [PAYMENT_FOUNDATION.md](PAYMENT_FOUNDATION.md), [KYC_PRIVATE_STORAGE.md](KYC_PRIVATE_STORAGE.md) and careers notes. Verify duplicates/backups and transaction support in the deployment environment. Do not run blanket index synchronization or production test fixtures.
3. Release backend and browser clients as one compatible change: careers capability/index gate, receipt-based KYC, server-authoritative quote contract and acknowledged versioned logout depend on the matching API. Older APIs intentionally fail closed; localhost UI can still point at the existing deployed service.
4. Check exact API/origin/provider/CSP configuration and dynamic private/no-store HTML at the hosting/CDN layer. CSP permits known origins; unknown CMS assets may need reviewed explicit origins. Do not edge-cache nonce HTML.
5. Complete controlled staging provider tests and the operator gates listed in [REMEDIATION_REPORT.md](REMEDIATION_REPORT.md), including historical credential closure, private KYC migration/unsigned denial, hosted sandbox checkout/webhooks, OAuth and mail/SMS. Live Cashfree remains disabled.

## Rollback considerations

- Once session-version revocation is relied upon, reverting to a backend that ignores the claim can re-enable old signed tokens. A security rollback requires deliberate session cutoff/key revocation; this patch performs neither operational action.
- Keep additive schema/index changes unless a separately reviewed migration requires otherwise. Restoring unsafe payment/KYC handlers is not a safe recovery plan.
- Restoring report-only CSP reopens script enforcement risk. Nonce HTML must remain private and uncached.
- The old local MacBook `.png` URL redirects permanently to identical `.jpg` bytes to preserve existing references.

No production customer/admin records, provider assets or payments were used for the local database evidence. An isolated browser rejected optional cookies, which may attempt an anonymous preference receipt. Staging and live payment readiness remain **NO** pending external evidence; browser-readable bearer storage/lifetime, legacy public KYC files and unfinished operational features remain explicit limits.
