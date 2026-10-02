# Local storefront accessibility follow-up

Checked 1 October 2026 on the local storefront. These checks support merge review; they do not certify WCAG compliance or production behaviour.

## Changes

- Shared scroll-lock ownership now also covers cookie settings, location, filters and address overlays; each closes only its own lock, preserving other open overlays.
- Shared modal focus handling for the sign-in modal, rental-term drawer and product-detail drawers: opening focus, keyboard containment, Escape, focus restoration and body scrolling control. Parent callback changes no longer restart the focus session. If a responsive layout hides the original trigger, closing restores a visible external control.
- Closed product-detail drawers become visually hidden after their exit transition, while `inert` excludes their controls immediately. Reduced-motion styles disable the transition. The rental-term drawer retains its existing animated mobile bottom-sheet behaviour.
- Corrected the product page's heading order. Specification labels are labels rather than disconnected level-four headings. Long rental-term headings can wrap.
- Darkened benefit badge gradient endpoints. White text contrast is 5.40:1 against `#0066d8` and 6.43:1 against `#005bc1`; the previous endpoints were 3.48:1 and 4.21:1.
- Clipped testimonial previews reveal their content and remove the fade when a review source link receives keyboard focus. Card footers wrap instead of forcing a wide row.
- Product rating and review-count fallbacks now preserve real zero values; absent data displays zero rather than invented 4.5-star ratings and 12 reviews.
- Renamed the JPEG-encoded local MacBook asset to `.jpg` without changing its bytes and updated the read-only preview fixture. A compatibility redirect preserves the former `.png` URL.

## Browser evidence

GStack Browse, Chromium, local development server; public product reads and isolated browser interactions. No account, payment, KYC or testimonial records were created or changed. The browser selected Reject optional before the mobile-menu handoff check; the consent component may attempt an anonymous preference receipt request through its configured API.

| Check | Result |
| --- | --- |
| Populated product page at 320, 390, 768, 1024 and 1440 CSS pixels | Document scroll width matched viewport; one visible `h1`, one `main`; five closed drawers visually hidden. |
| Axe 4.13.0, product page at 320 and 1440 pixels | Zero reported violations after fixes. Each run passed 51 rules. |
| Rental-term drawer, 320 pixels | Focus entered close button; Shift+Tab wrapped to Apply; Tab returned inside; Escape closed and restored original trigger; body scroll restored. |
| Benefits drawer, 320 pixels | Focus entered close button; Shift+Tab wrapped to Book your plan without activating it; Escape restored benefits trigger; body scroll restored. |
| Sign-in modal, desktop | Focus entered close button; Shift+Tab wrapped to Privacy Policy; Tab stayed inside; Escape restored Login/Register; body scroll restored. No credentials submitted. |
| Sign-in modal, short mobile viewport | At 320 × 568 the dialog measured 288 × 536, within 16-pixel screen insets; no horizontal document overflow. Resizing an open desktop modal retained body scroll lock. Escape restored the visible mobile menu trigger and unlocked scrolling. |
| Mobile menu → sign-in handoff | At 320 pixels, Login/SignUp opened the sign-in modal, retained scroll lock, focused Close and contained Shift+Tab. Escape unlocked scrolling and restored the mobile menu trigger. Shared reference-counted body scroll locking prevents one overlay from releasing another overlay’s lock. |
| Synthetic long product heading | Replaced local browser heading with a repeated unbroken name; at 320 pixels document width remained 320. This was DOM stress testing, not a database edit. |
| Synthetic testimonial CSS fixture | Twelve long cards using the actual loaded component CSS, at 320/768/1440 pixels. Keyboard focus on the final source link revealed the full content, cleared its mask and retained viewport width. This tests the stylesheet, not testimonial publication or admin editing. |

Evidence saved under ignored `.gstack/local-followup-2026-10-01/`, including `pdp-reflow-axe-after.txt`, `testimonial-focus-after.txt` and `modal-scroll-focus-after.txt`.

## Limits

Axe returned manual-review items for gradient contrast and cookie-banner overlap, plus allowed-role checks on closed dialogs; these are not automated passes. Gradient endpoints were separately calculated above. Screen readers, high-contrast OS modes, actual mobile devices, every product/CMS copy variant and all customer journeys were not covered. Provider images and upstream API failures remain outside this visual evidence. Production builds and backend/admin integration results are recorded in the main remediation report.
