# Banner appearance controls

In **Admin → CMS**, open Contact, About, FAQ, Rental Process, or an image-banner policy page. Under **Banner appearance**:

- Turn off **Show text over the banner image** to hide the overlay. The page heading remains available to screen readers.
- Choose **Section background colour** with the picker or enter a six-digit hex value.
- Choose **Use page default** to restore the existing background.
- Save the page normally.

These settings affect the banner text and its surrounding section surface. Image dimensions, crop, spacing, and source remain unchanged. Existing records retain their current appearance until edited.

The CMS stores `bannerShowText` (boolean, default `true`) and `bannerBackground` (empty string for the page default, otherwise `#RRGGBB`). The backend rejects invalid values before saving.

## Verification

Frontend and admin production builds pass. `node --test backend/tests/cms-banner.test.js` covers controller update/read round trips, defaults, resets, and invalid values using a mocked persistence boundary. The local preview API is read-only, so saving through an authenticated admin against a live database still requires a deployment check.

## Contact concept

`/contact-demo` is a separate, unlisted, no-index design preview. Its form only shows a local confirmation; it sends and stores nothing. `/contact` retains its existing design.
