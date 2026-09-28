# Rental process illustrations

## Brief

Four coordinated person-led line-art scenes on white backgrounds: choose equipment, complete identity verification, confirm an order, and receive equipment. The same woman appears throughout in a white shirt with charcoal hair/trousers and restrained yellow accents. This replaces the earlier dark isometric direction following the user's feedback.

Generated with the built-in image tool, using the first scene as the character/style reference for the next three. The tool does not expose a selectable GPT 2.5 model identifier. New assets use a `-line-art.webp` suffix to avoid stale image caches. Optimized copies are 768px square; storefront frames are capped at 224px, or 128px alongside the step text on mobile. All frames have white backgrounds, including behind transparent artwork.

## Admin editing

For the homepage, open **CMS → Homepage → Rental Process**. Each step has a **Built-in illustration** selector. Choose an illustration, upload a replacement using **Step illustration**, or click **Remove image and use icon**. Save the page to publish. The standalone Rental Process page uses the same editor under **CMS → Rental Process** but saves its own page content.

Uploaded images take priority. Existing legacy icon names map to the new illustrations automatically; custom steps with unknown icons retain their icon fallback. Selecting **Icon only** persists `illustration: "none"`, so removed images do not return. Explicit selections follow the step when reordered. An empty steps list still hides the section.

## Files and delivery

Artwork is generated with the built-in image generation tool. Optimized WebP copies are stored in both frontend/public/images/rental-process and admin/public/images/rental-process so independently deployed apps can render their own previews. Both apps retain a small local illustration manifest because their builds intentionally use separate roots. The CMS schema validates the same illustration IDs.

Original generation prompts and correction prompts are recorded in rental-process-artwork-prompts.md. The initial choosing/order variants included construction tools; these were corrected to electronics before integration.

## Verification

- Storefront and admin production builds passed; scoped ESLint passed.
- All four images loaded at 1440px, 918px and 390px, with four columns, two columns and a vertical list respectively. No horizontal overflow.
- CMS model validation covers explicit presets and icon-only selection. Admin and frontend presets include the existing legacy icon names.
- The local API on port 5001 is a read-only sample server. Authenticated upload/save persistence against a real database was not exercised; the existing protected save/upload routes remain in use.

## Current responsive layout

Rental Process uses the shared primary and secondary button classes. Product rails show 4 cards from 1024px, 3 from 768px, and 2 below 768px. Hero loop normalization preserves a preview on each side at desktop/tablet sizes without changing the mobile 216 × 345px cards.

Latest checks: frontend production build and scoped ESLint passed. Browser verification at 1271, 918 and 390px confirmed four/three/two product cards, hero preview loop boundaries, 216 × 345px mobile hero cards, all four illustration loads, primary/secondary buttons, and no horizontal overflow. Admin manifests point to matching local assets; no authenticated CMS write was performed.
