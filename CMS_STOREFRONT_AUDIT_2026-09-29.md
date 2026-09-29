# Admin CMS and storefront audit

> Historical audit snapshot. The draft workflow, service editor, SEO wiring and navigation changes proposed below have since been implemented in this checkout. See [CMS_WORKFLOW_IMPLEMENTATION.md](./CMS_WORKFLOW_IMPLEMENTATION.md) for current behavior and release checks.

29 September 2026 · Local checkout: `IndianRentals-clean`

## Scope and confidence

I traced the admin editors through their API routes, backend models/controllers, and public storefront consumers. I reviewed the CMS navigation and its editing states against the existing IndianRenters design language (Mona Sans, restrained surfaces, yellow action color). I did not make authenticated changes to the live database. The local admin and storefront are configured to use `https://indianrentals-3ugl.onrender.com`, so a local backend fix only becomes active there after backend deployment. Browser automation refused the local browser session; visual and authenticated end-to-end behavior remains unverified. “Connected” below means the code path exists, not that a live save was observed.

## Connection map

| Admin area | Storefront destination | Data path | Finding |
| --- | --- | --- | --- |
| Homepage | `/` and homepage sections | `/api/cms/homepage`, with catalog product IDs from `/api/products` | Connected in code. Default showcase links pointed to nonexistent routes; fixed for new and legacy values. |
| Global Layout | Shared site header/footer/settings | `/api/settings` | Connected in code; requires authenticated save check. |
| Blog page configuration | `/blog` | `/api/cms/blog` | Title, subtitle and tabs were silently discarded by backend allowlist; fixed locally and tested. |
| Blog posts | `/blog` and `/blog/[slug]` | `/api/blog` | Drafts were publicly readable via the API; public list/detail now expose published posts only, and admin has a protected all-posts endpoint. |
| Main Category | `/categories` | `/api/cms/categories-page` | Connected in code. Existing working tree already contains copy/layout changes; not altered by this audit. |
| Single Product Page | `/products/[id]` | Global `/api/cms/product-page` plus per-product `/api/products/:id` `pageLayout` | Both paths are consumed in code. Save/read fidelity needs a live product sample. |
| Static Pages / policies | Policy routes including `/terms`, `/privacy`, `/shipping` and `/return-policy` | `/api/cms/:page` | Body and banner connected. Meta title/description were saved but not rendered; now wired into 11 policy routes. The “Draft/Live” switch was misleading and has been removed from the Static Pages editor. |
| About, FAQ, Rental Process | `/about`, `/faq`, `/rental-process` | Their corresponding `/api/cms/:page` endpoints | Body/banner fields connected in code. About and Rental Process SEO fields are still saved without driving route metadata. |
| Contact Page and enquiries | `/contact` and admin inbox | `/api/cms/contact` and `/api/contact/enquiries` | Content, SEO metadata and form routes are connected in code. Delivery and inbox state require a live submission check. |
| Careers & Applications | `/careers` and admin applications | `/api/careers` and `/api/careers/applications` | Separate careers API is connected in code. Application delivery requires a live submission check. |
| Six service pages | `/services/[service]` | `serviceData.js` and catalog requests | These pages have no CMS page editor. Copy/layout updates require code changes; this is a product gap, not a broken existing connector. |

## Changes made in this checkout

1. Added Blog landing fields to the CMS update allowlist and a save/read regression test.
2. Made the public Blog API return published posts only, blocked draft details, and added protected `/api/blog/admin/all` for the admin editor. Removed fabricated placeholder articles from the public Blog page; it now shows an honest empty state.
3. Corrected homepage default CTA and showcase links to existing routes. The storefront also translates old saved `/store` and `/categories/...` values, so existing CMS documents keep working without a database edit. Imported the missing mobile showcase router hook.
4. Added `/dashboard/cms` redirect to Homepage so the CMS parent navigation cannot land on a missing route.
5. Removed the false Static Pages publish toggle and status labels. Save now clearly says that it updates the site. A real draft workflow is still to be designed.
6. Connected policy meta title and description fields to server metadata for Terms, Privacy, KYC, Shipping, Return/Refund, Rules, Delivery Charges, Late Fee, Cancellation and Subscription routes. Both refund URL variants use `/return-policy` as canonical.

## Remaining issues, prioritized

### P1 — Publishing workflow is not real for CMS pages

`publishStatus` and `scheduledPublishTime` exist in the CMS model/controller, but storefront CMS consumers do not check them. A draft and the last published version are not stored separately. Until a staged/live content model and authorized preview exist, every save changes the public page. The Static Pages control has been removed to avoid promising a behavior that is absent. Other CMS editors still carry a `publishStatus` default, but do not provide an effective release workflow. Design a staged document, explicit Publish action, publish timestamp, and authenticated preview before restoring Draft or Schedule. This mirrors the distinction between staged and live content in [Webflow’s CMS publishing model](https://developers.webflow.com/data/docs/working-with-the-cms/publishing) and the separate preview experience described in [Contentful’s live preview guidance](https://www.contentful.com/help/content-preview/live-preview-publishing/).

### P1 — Backend and admin must be released together

The protected Blog admin list endpoint and CMS Blog field fix are backend changes. The admin now reads `/api/blog/admin/all`. Deploy the backend first, then the admin and storefront. While localhost 3001 is still pointed at the old hosted backend, the new admin Blog list will show a load error, and Blog configuration saves will still be silently ignored by that old backend. Do not use an administrator’s login as evidence that the new backend code has been deployed.

### P2 — Remaining SEO fields do not all drive metadata

Policy and Contact metadata now work in code. Homepage, About, Categories and Rental Process editors expose SEO fields, but those routes still have static metadata or client pages. Connect each editor field to server `generateMetadata`, keeping a reliable fallback. Remove or relabel any “Google Preview” until the corresponding route is actually connected. Check titles and descriptions in page source after deployment.

### P2 — Service pages need a defined ownership model

The six service page structures and copy are in `frontend/src/app/services/[service]/serviceData.js`. Decide which parts should be CMS managed: hero title, intro, benefits, FAQs, images, related products, SEO, and CTA destination. Keep layout and interaction in code. One shared “Service Pages” editor with a page selector is easier to maintain than six duplicated editors; require a field schema, preview and per-page validation before adding it.

### P2 — CMS reads can create data

`GET /api/cms/:page` calls `getOrCreatePage`, so a public read can create a CMS record and accepts arbitrary page names. Change reads to return a transient default for known keys, validate page names (including Blog), and reserve persistence for admin writes or migrations. This needs an API compatibility review before release.

### P3 — Navigation and editing clarity

The CMS submenu mixes page templates, catalog content, legal pages and operational inboxes in one long flat list. Suggested order and labels: **Site** (Homepage, Global Layout), **Catalog pages** (Category Landing, Product Detail Template, Service Pages when added), **Content** (Blog, About, FAQ, Policy Pages), **Customer contact** (Contact Page, Contact Enquiries, Careers). Preserve direct route access and existing permissions. In editors, place a small “Where this appears” URL and a direct View Page action near Save; show last saved time and whether the change is public. Prefer one clear primary action and a restrained secondary preview. Mobbin references: [Framer CMS editor](https://mobbin.com/screens/af8d7af8-a020-4a37-95c4-203690d4123e) and [Webflow CMS collections](https://mobbin.com/screens/dd515b44-e526-45f0-9150-cf4bd2a411e6).

## Verification performed

- Backend regression tests: seven passed (CMS Blog save/read, Blog publication exposure, existing banner behavior).
- Targeted admin and storefront ESLint: zero errors; existing `<img>` performance warnings remain in the touched components.
- `git diff --check`: passed.
- Impeccable detector reported existing styling warnings (mainly indigo/gray combinations and a rich editor border treatment); no blocking result. This pass did not redesign the admin shell.

## Post-deployment acceptance checks

1. In admin Blog, save a new page title and filter tab. Refresh admin and `/blog`; both should show the change.
2. Create a draft Blog post. Confirm it appears in admin, does not appear in `/blog`, and its public slug returns 404. Publish it and confirm the public page appears.
3. Edit a policy meta title. Inspect the public page’s rendered `<title>` and description, then verify `/refund-policy` canonicals to `/return-policy`.
4. Open each homepage featured banner and the feature CTA in desktop/mobile layouts. Existing saved legacy paths must resolve to a real catalog page.
5. Open CMS from the collapsed admin sidebar; it should route to Homepage.
6. Submit one test Contact enquiry and one Careers application, then verify they appear in their respective admin inboxes without duplicate submissions.
7. On a test product, change one global Product Page label and one per-product layout field; reload the product detail and verify both values and their defaults.
