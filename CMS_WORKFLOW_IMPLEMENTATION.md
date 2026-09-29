# CMS workflow implementation

## What is implemented

- CMS pages now keep the published fields separate from `draftData`. Saving an editor creates or updates only its draft. Public `GET /api/cms/:page` continues to serve the last published version. An admin can preview a saved draft with a page-specific signed link, publish it, or discard it. Preview links expire after ten minutes and responses are marked private and noindex.
- The admin CMS bar shows the storefront URL, draft or published status, last save time, Preview saved draft and Publish saved draft. Policy pages show draft status in the list. The CMS navigation is grouped by Site, Catalog pages, Content and Customer contact.
- One Service Pages editor covers laptop, MacBook, camera, AV, server and office equipment rental pages. It edits the hero, catalogue destination and filters, use cases, FAQs and SEO fields. Layout remains in code; the six public routes use published CMS values with their existing defaults as fallback.
- While the admin still points at the older hosted API, the Service Pages and Contact Page editors use its existing CMS `pageContent` field to save structured content. That compatibility mode writes directly to the connected CMS and is labeled as such in each editor. The local storefront reads those saved values; the public deployment needs the matching storefront code before they appear there. The new backend reads the same saved contact content as a fallback when it is released.
- Published CMS title and description fields now drive metadata on Homepage, About, Categories, Rental Process, Contact, policy pages and all six service pages. Draft preview metadata follows the draft on server-rendered pages and preview requests are noindexed.
- Blog posts retain their separate post-level draft/publish workflow. Global Layout, Careers and individual product overrides still use their own APIs and save directly to the live site; the admin labels these paths accordingly.

## Editor workflow

1. Edit a CMS page and choose **Save draft**. The public page stays unchanged.
2. Choose **Preview saved draft**. The admin opens a temporary URL for that page; the yellow preview banner identifies it as unpublished.
3. Choose **Publish saved draft**. The public page then uses the saved values. A newer unsaved form edit is not included until it is saved again.
4. Choose **Discard** to remove the saved draft and reload the published values into the editor.

## Release and verification

The local admin and storefront currently point to `https://indianrentals-3ugl.onrender.com`. Release the backend schema, controller and routes to that API before the admin and storefront to enable staged drafts across CMS pages. The repository's backend GitHub Action targets a VPS, so that workflow alone will not update the Render API used by these local apps. Service Pages and Contact Page can save directly through the older hosted API in the meantime; other editors still require the new `/draft` endpoint. The hosted backend has no `/api/contact/enquiries` route yet. Until that backend update is released, the admin inbox shows the missing capability and the local contact form disables submission with phone and email alternatives. No production database changes or deployment were performed as part of this implementation.

After deployment, check one existing page and one service page: save a draft, confirm the public URL is unchanged, preview the draft, publish it, then confirm the public body and `<title>`/meta description update. Verify an expired or mismatched preview token fails, and check the admin URL/status bar for static pages. Global Layout, Careers, blog posts and product overrides should retain their separate save behavior.

Automated checks in this checkout: backend `node --test tests/*.test.js` (26 passing), targeted admin and storefront ESLint (no errors in the CMS changes), and `git diff --check`. All six local service routes, the local contact route and the three relevant admin routes returned HTTP 200.
