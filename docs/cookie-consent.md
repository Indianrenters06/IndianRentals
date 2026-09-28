# Cookie consent and website analytics

The root `ConsentProvider` serves the banner and settings dialog on every storefront route. The footer's **Cookie settings** control reopens preferences; checkout/account layouts also expose it. Closing the dialog discards draft changes.

## What is collected

| Data | Permission | Storage | Retention |
| --- | --- | --- | --- |
| Essential=true, analytics=true/false, policy version, choice date, random receipt reference | Explicit save/accept/reject; needed to remember that choice | Browser localStorage; backend `CookieConsent` stores a SHA-256 hash of the reference | 180 days from the choice |
| Public page category, coarse viewport category (mobile/tablet/desktop), event date, random event ID for deduplication | Optional analytics accepted, with an unexpired server receipt | Backend `SitePageView` | 90 days |

There are no analytics requests before a choice. Rejecting sends only the necessary consent record. The page-view collection does not persist names, phone numbers, email addresses, form values, account IDs, raw URLs, query/search strings, referrers, IPs, browser user agents, or consent/visitor references. It cannot reconstruct a person's browsing history. The browser reference is not an account identity. It is not used for advertising.

Page categories: home, catalogue, product, category, locations, services, blog, contact, about, careers, rental process, FAQ. Account, login, registration, checkout/cart, confirmation, preview/demo and unrecognized routes are excluded. Only visible pages are counted. These are page views, **not unique people, sessions, leads, or purchases**.

Version 2 requires a fresh choice from browsers holding version 1 because collection has expanded. Invalid, expired, old-version, and missing preferences fail closed. Cross-tab changes synchronize. Expiry is checked on long-lived tabs and when they become visible. Storage-unavailable choices apply only in memory.

## Backend and admin

- `POST /api/privacy/consent` validates and saves the latest choice. Delayed older choices cannot replace a later withdrawal. Same-time rejection wins. Repeated identical choices are safe.
- `POST /api/privacy/page-view` requires an accepted, unexpired receipt. Unknown fields are discarded. Arbitrary page/device values are rejected. Event IDs prevent duplicate inserts on retries.
- Both writes are rate limited. Responses use `Cache-Control: no-store`. A disconnected database returns 503, never fake success.
- `GET /api/privacy/report?days=7|30|90` requires authenticated admin/staff access with the `reports` permission.
- Admin: **Reports → Website & Consent**, `/dashboard/reports/website`. Includes total views, page/device breakdowns, daily counts in India time, and each browser reference's latest consent choice made within the period. The latter is not an acceptance rate or unique-person count. Failed requests display an error, not zero analytics.
- MongoDB TTL indexes remove expired records asynchronously. Reports exclude out-of-range records even before TTL cleanup.
- Express access logging skips `/api/privacy/*` to avoid adding IP/referrer/user-agent data to these records. Infrastructure/proxy logging is separately configured by the hosting provider.

## Enabling real collection

Use the existing Express backend and MongoDB database. No Google Analytics account is required for this report.

1. Configure backend `MONGO_URI` with the existing database and existing auth/CORS settings. Never put database credentials in a public/frontend variable.
2. Deploy/start the updated backend. `/api/health` must return `db: "connected"`. Verify the consent and page-view TTL/unique indexes exist in MongoDB (normal Mongoose model initialization creates them when auto-indexing is enabled).
3. Set `NEXT_PUBLIC_API_URL` for **both frontend and admin** to that backend's public origin, then rebuild/deploy both apps. The backend must allow those app origins via its CORS configuration.
4. Accept optional analytics in the storefront, visit a public page, then open the admin report. Reject optional analytics and navigate again: no additional optional views should be recorded.

**The local `npm run preview` sample API at port 5001 is intentionally read-only and cannot collect records.** Failed preference synchronization does not affect the visitor's saved browser choice, but optional page collection stays off until the real backend acknowledges it. It retries on a subsequent eligible page visit, return to the tab, reload, or reconnection. There is no offline queue of browsing history.

Withdrawing consent immediately stops new browser analytics work and aborts pending optional requests. The preference update is sent to the backend; failed updates retry on reload/reconnection. Already received anonymous page counts are retained until their normal expiry. Clearing all browser storage removes the reference used for the server receipt; that receipt expires automatically.

## Optional Google Analytics integration

`NEXT_PUBLIC_GA_ID` remains optional and is **not configured in the inspected local environment**. No GA script is loaded until analytics is accepted, and none loads with an empty ID. Withdrawal sets the GA disable flag, updates consent to denied, and expires GA cookies without touching session/cart cookies. Withdrawal while the script downloads prevents initialization. Advertising consent, Google signals and ad personalization remain disabled. This integration is separate from the first-party report and has its own GA property settings/retention. The consent popup discloses it if used. Future trackers must obey the visitor's choice.

## Verification

Run from the main application directory:

```sh
node --test frontend/tests/consent.test.mjs frontend/tests/siteAnalytics.test.mjs backend/tests/privacy.test.js
```

Tests cover no collection before choice, rejection-only records, opt-in views, private-route exclusion, payload minimization, failed persistence, expiry, withdrawal races, duplicate events, outdated receipt updates, endpoint validation, retention indexes, database outages, and report authorization. HTTP tests use in-memory model doubles; they do not prove a deployed MongoDB connection.

## Implementation review — 28 September 2026

- 15 focused Node tests passed. Storefront and admin production builds passed; targeted ESLint checks passed.
- Browser: updated explanation displayed, acceptance saved and reopened as enabled, withdrawal saved and stayed disabled after reload. At 390px the settings dialog fits without horizontal overflow (358px wide, approximately 585px high). The temporary viewport override was reset.
- Impeccable audit: accessibility 3/4 (native dialog, labelled switch and table headers; admin browser screen-reader audit not performed), performance 3/4 (no new libraries, bounded requests; production profiling pending), responsive 3/4 (mobile popup verified, responsive admin grids; authenticated report browser check pending), theming 3/4 (existing Mona Sans/brand colors and admin light/dark conventions), integrity 3/4 (real endpoints and explicit failure states; deployment not verified). Total 15/20, code-level review only.
- Detector findings reviewed as false positives: existing Sign Out buttons at admin layout lines 541/549 combine neutral base colors with red *hover* text/background; the scanner merges states. Their styles are unchanged. Mona Sans in the consent CSS is the explicitly mandated brand font, so the generic overused-font warning is inapplicable. No detector suppressions were added.
- Remaining release dependency: connect/deploy the updated backend against MongoDB and verify a real record in the authenticated admin report. Local preview is read-only. The configured production health endpoint timed out during inspection.
