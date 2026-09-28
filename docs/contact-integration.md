# Contact page promotion

## Routes

- `/contact`: promoted design, generated hero first, then “Let’s get you set up.”
- `/contact-demo`: original contact design preserved, explicitly labelled as a backup, excluded from search indexing. Its original preview form never sends a real request and now says so.
- `/dashboard/cms/contact`: live page editor.
- `/dashboard/cms/contact/messages`: rental/support inbox, with type/status filters, pagination and status updates. Both are in the CMS sidebar.

## Content

The `contact` CMS document stores the new design in `contactContent`. Legacy fields (`bannerImage`, `bannerTitle`, `contactTitle`, etc.) remain intact for the original design. No destructive migration or seed overwrite is needed. Existing documents receive complete defaults on read; the first editor save stores the new content.

Editable content includes hero image/alt/title/visibility/background, introduction, contact desk phone/email/hours, form headings/buttons/confirmation copy, equipment choices, directory headings, all eight cities' addresses/types/phones/directions/images, help copy/links, and metadata. Standard form labels are application UI. Chennai and Kolkata remain service cities, not physical branches.

Defaults: `backend/config/contact-defaults.json`; the storefront fallback is `frontend/src/config/contact-defaults.json`. Tests ensure they stay equal. Branch contacts came from the existing canonical location configuration. Live CMS edits override the fallback. The server-rendered page uses uncached CMS reads, so refresh displays saved content.

Set `NEXT_PUBLIC_STOREFRONT_URL` on the admin if the storefront uses a different deployment URL; this resolves packaged `/images/...` previews. Uploaded images retain their absolute URL.

## Requests

`POST /api/contact/enquiries` validates intent, name, phone, email, configured city, privacy consent and equipment choice. Support requires a message and accepts an optional order reference. Rental requires equipment and accepts an optional message. Irrelevant fields and client-supplied status are discarded. Requests persist to the MongoDB `ContactEnquiry` collection before success is returned. A unique submission ID makes retries of an uncertain response idempotent. The frontend preserves the form on failure and disables duplicate submission while pending.

`GET /api/contact/enquiries` and `PATCH /api/contact/enquiries/:id` require an authenticated admin or staff member with the `cms` permission. Responses use `Cache-Control: no-store`. Statuses: new, in_progress, resolved. Public submission is limited to 10 requests per IP per 15 minutes. No emails/SMS are sent automatically; the admin inbox is the delivery destination.

## Running the integration

The existing `npm run preview` frontend command uses a **read-only sample API on port 5001**. It deliberately cannot save CMS content or enquiries. It is suitable for visual/toggle/error-state checks only.

For real submissions, run the updated Express backend with a working `MONGO_URI` and `JWT_SECRET`, and point **both** Next apps' `NEXT_PUBLIC_API_URL` at that backend. Restart dev servers after changing public environment variables; rebuild for deployment. Port 5000 is occupied by macOS Control Center on this workstation; use an available backend `PORT` (for example 5002). Backend CORS already permits the local frontend/admin ports 3000/3001. Configure production origins through the existing deployment environment.

No database credentials were available in this workspace during implementation. No production database or external notifications were modified.

## Verification

- `node --test backend/tests/contact.test.js backend/tests/cms-banner.test.js`: 8 passing tests. Covers CMS preservation/round-trip, validation and unsafe links, distinct intent payloads, persistence-before-success, retries, inbox authorization/status updates and storage errors. HTTP tests use actual Express/auth/Mongoose validation with mocked persistence; they do not claim a live MongoDB run.
- Frontend and admin production builds passed.
- Targeted lint passed.
- Browser checks: hero first, preserved introduction, both form modes, retained input, failed-submission recovery, original backup route, desktop/mobile geometry.
