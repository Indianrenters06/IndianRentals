# Carousel controls

CarouselControls.jsx shares navigation behavior, with distinct presentations for each section. SwiperControls adapts Swiper snap positions and loop indexes.

- Product and category rails use the original long, thin progress line followed by two light circular chevrons. There is no numeric counter or centered segmented row.
- The hero retains side chevrons, reserved outer gutters and a compact in-image indicator on tablet/desktop.
- Collections have their own in-image controls: chevrons beside the centered title, a subtitle, and small dot indicators underneath.
- Offers and product galleries use dots and side arrows instead of the rail layout.
- Autoplay carousels expose pause/play. Reduced-motion preferences stop autoplay and disable collection transitions.
- Single-image galleries hide navigation. CMS image, product and link sources remain unchanged.

## Product-card interaction

The shared RentalProductCard lifts slightly, scales its image and adds a drop shadow on hover or keyboard focus. Rent Now slides upward from the bottom. Reserved space prevents the reveal from moving the next section. Product rails allow the shadow into the gutter without exposing the following slide. Below 1024px, compact cards use one rating star, a single metadata row, and a 30px Rent Now action revealed on hover or focus within the card. Product images cover the complete square frame. Reduced-motion users get the same action without movement.

## Mobile exceptions from the supplied Figma

Hero cards below 768px are exactly **216 × 345px**, with a 12px radius, 8px gap and 20px outer inset. Adjacent cards peek into the viewport. Desktop/tablet use fluid full-width slides with a 1200px maximum content width: 30px tablet gutters, 48px minimum desktop gutters, and a fluid 360–500px height. Hero side chevrons remain inside those gutters as the viewport changes. Mobile card dimensions remain unchanged.

Rent by Category receives a bottom-to-top gradient (brand yellow at the bottom, light grey at the top) below 768px only. Its desktop/tablet background remains solid. Best Rented Products and New Launches hide their progress line and arrow controls below 768px; swipe navigation remains available.

## References

- [Collection controls in Figma](https://www.figma.com/design/lB3vJxPhUKgF4Su1TxMSEo/Changes?node-id=24181-29826): centered title with in-image arrows and dots.
- [Product-card component in Figma](https://www.figma.com/design/lB3vJxPhUKgF4Su1TxMSEo/Changes?node-id=23337-17883): card and reveal reference, supplemented by the user’s pop-animation example.
- [Mobile hero Figma](https://www.figma.com/design/lB3vJxPhUKgF4Su1TxMSEo/Changes?node-id=25220-23936): fixed portrait card dimensions and adjacent-card preview.

## Verification

Production build passed. Scoped ESLint reported no errors; existing raw-image warnings remain. Browser checks covered 320, 390/414, 822, 1263 and 1440px during implementation. Verified hero navigation, direct slide selection, product-row next/end states, collection navigation, horizontal overflow, control bounds, the exact mobile card dimensions, and mobile-only gradient. Offer banners were absent from the sample CMS, so their integration was checked in code/build rather than with populated live data.

The separate signup refinement puts Full name and Email side by side at 768px and above. They stack below 768px. Required fields, input types, state bindings and registration submission are unchanged; no account was created during layout verification.

Latest restoration checked at 390, 918 and 1440px: product-rail navigation and progress, collection direct selection, keyboard card reveal (the same visual state as hover), and horizontal overflow. The production build and scoped lint passed with existing raw-image warnings.

Latest compact-card update checked at 445, 918 and 1255px: 2/3/4 visible cards, edge-to-edge cover images, compact default/focus states, mobile swipe navigation, hidden mobile controls, tablet next/end states, and no horizontal page overflow. The approved shadow fix expands the hover rail boundary and hides fully offscreen slides using Swiper visibility tracking. Production build and scoped ESLint passed.
