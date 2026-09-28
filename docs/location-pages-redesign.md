# City location pages

Shared template: `frontend/src/app/locations/[city]/page.js` and its CSS module.
Branch data: `frontend/src/config/locations.js`, transcribed from `00_brand/company-facts.md`.

## Design direction

Mobbin references reviewed:
- Care.com: https://mobbin.com/screens/a73098e7-095d-4032-a1f9-399f9c1c4385 — location-led introduction and direct access to services.
- Fresha: https://mobbin.com/screens/b47dfaac-d730-408e-9ade-688c39aa4858 — dedicated address, opening hours and contact panel.

Adapted to existing Mona Sans typography, neutral surfaces, yellow brand accent, pill buttons and existing city illustrations. All page interface icons are Heroicons outline. No new image assets were generated.

## Content corrections

- Canonical branch phones, addresses and map coordinates replace outdated contacts.
- Chennai and Kolkata display service information without fabricated physical branches; their structured data uses Service rather than LocalBusiness.
- Removed unsupported same-day delivery, insurance, 24/7 support and city-specific customer-count claims.
- Metadata has one brand suffix; each city retains its own title, canonical URL and structured data.

## Verification

- Production build and scoped ESLint passed.
- All eight city routes returned HTTP 200; phone/schema values checked.
- Browser checks at 359, 763 and 1280px: no horizontal overflow, city assets loaded, no runtime errors.
- Checked category/contact anchors and navigation between city pages.
