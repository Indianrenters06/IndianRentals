# PDP rental comparison illustration

## Scope and direction

Replace the repeated product/price sidebar in the shared PDP comparison with a generic rental story. Keep the factual buy-versus-rent table and existing rental-term action. The user requested a 3D illustration with a palette independent of the site colors.

AI Creative Director brief: a reusable equipment case communicates delivery and return; a generic laptop and camera communicate the rental category. Creative Director Pro refinement: one central sculpture, directional lighting, clear silhouettes, generous negative space, and cobalt/porcelain against deep ink. Website typography and yellow controls remain HTML.

## Final generation prompt

Create a premium sculptural 3D editorial illustration for a technology rental website's buy-versus-rent section. Square composition, deep midnight ink background (#101827). An open porcelain-white reusable delivery box holds an unbranded silver laptop with a plain cobalt screen and one simple white camera. One substantial cobalt-blue curved arrow loops around the box, clearly conveying equipment going out and coming back. Directional studio lighting, deep shadows, crisp readable silhouettes, polished matte ceramic and brushed-metal materials. Keep the complete sculpture in the central 70% with breathing room all around. Sophisticated conceptual advertising, not a literal product catalogue photo. Pure illustration without typography, logos, numbers, currency, yellow, or orange. Render a finished reusable website artwork.

## Asset and implementation

- Generated with the built-in image generation tool; image contains paired return arrows.
- Shipped asset: `frontend/public/images/rental-comparison/rental-cycle-v1.webp`, 960 × 960, approximately 39 KB.
- Shared component: `frontend/src/app/products/[id]/SimpleRentComparison.jsx`.
- Desktop: table and illustration beside one another.
- Tablet: table followed by a horizontal illustration/story panel.
- Mobile: table followed by stacked illustration, copy, and action.
- Illustration identifies a category/process, not an exact rented SKU or delivery packaging promise.

## Verification

ESLint and `git diff --check` passed; Impeccable mechanical scan returned no findings. Source layout review found no confirmed defects. B2C brand voice review passed. Browser screenshots inspected at 1178, 768, 516, and 320 px; illustration decoded at each size. Mobile document width matched its viewport. The action opened the real tenure picker, and closing finished with the picker hidden.
