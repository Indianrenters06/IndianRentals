---
name: IndianRenters homepage proof section
description: Scoped record of the implemented homepage proof section within the existing storefront identity.
colors:
  orange-300: "#ffcf46"
  grey-900: "#141414"
  white: "#ffffff"
  stat-label: "#d3d3d3"
  proof-rule: "#ffffff30"
typography:
  display:
    fontFamily: '"Mona Sans", ui-sans-serif, system-ui, sans-serif'
    fontSize: "clamp(44px, 7.5vw, 92px)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-.04em"
  label:
    fontFamily: '"Mona Sans", ui-sans-serif, system-ui, sans-serif'
    fontSize: "14px"
    lineHeight: 1.4
spacing:
  section-block: "48px"
  mobile-gap: "24px"
components:
  proof-value:
    textColor: "{colors.white}"
    typography: "{typography.display}"
  proof-value-leading:
    textColor: "{colors.orange-300}"
    typography: "{typography.display}"
---

# Design System: IndianRenters homepage proof section

## Overview

**Creative North Star: "IndianRenters’ existing calm, refined storefront"**

This record covers the homepage branch of `frontend/src/components/WhyChooseUs.jsx` and its `WhyChooseUs.module.css`. It records a stronger expression of the existing Mona Sans, yellow and charcoal identity. It is not an identity replacement or a site-wide composition rule.

The shipped section gives existing CMS figures typographic prominence, with the current creator photograph and supporting copy beneath. `PRODUCT.md` supplies durable brand commitments; its contact-demo notes are outside this boundary. `../../00_brand/visual-brain.md` remains the parent brand authority.

**Key Characteristics:**

- Oversized, tightly tracked figures with quiet descriptive labels.
- One yellow value within a charcoal section.
- Flat rules separating information; a rounded photographic crop supplies visual contrast.
- Restrained entrance motion with a reduced-motion opt-out.

Evidence: the component and stylesheet above; `frontend/src/app/globals.css` and `layout.js`; `BestRentedProducts.jsx` for adjacent section spacing; desktop and mobile review captures at `/tmp/ir-proof-review/`. The [Mobbin section reference](https://mobbin.com/sites/sections/69af7d93-dd7b-4dbd-83b8-8de1e195c93c) was examined during the parent implementation for the relationship between statistics and photography; the code is the authority for this record. No new visual world, FORM seed or generated comp was introduced.

## Colors

Yellow creates a single emphasis within the dark neutral section.

### Primary

- **Brand yellow:** the leading statistic, offset image backing, link hover and keyboard focus ring. The frontmatter preserves the incumbent `orange-300` token name even though the visible accent is yellow.

### Neutral

- **Charcoal:** continuous section background, using the global `grey-900` variable.
- **White:** heading, secondary figures and resting link.
- **Soft grey:** repeated statistic labels.
- **Translucent white rule:** horizontal boundaries and vertical separators in the statistics row.

**The Single Value Rule.** In the resting proof row, only the first value uses the brand accent.

## Typography

**Display and body font:** Mona Sans, with the inherited UI sans-serif fallback stack. The source loads the face locally through `@fontsource/mona-sans`.

### Hierarchy

- **Display:** the repeated statistic values use the frontmatter display role. Below the mobile breakpoint their size becomes `clamp(32px, 9vw, 64px)`; weight and tracking persist.
- **Headline:** section heading matches Rental Process with `clamp(28px, 3vw, 36px)`, weight 600, line-height 1.2 and tracking −.03em. It is a component measurement, not a newly established site-wide ramp step.
- **Body:** supporting paragraph uses `clamp(16px, 1.45vw, 18px)`, line-height 1.65 and a 46ch desktop measure. Mobile uses 16px without a character-width cap.
- **Label:** frontmatter label role; mobile uses 12px with a 10ch cap. Labels remain sentence case in Mona Sans.
- **Action:** 16px, weight 500, accompanied by an outlined SVG arrow.

**The Value Before Label Rule.** Figures visually precede their labels while the definition list retains semantic label/value relationships.

## Layout

The full-width section has a centered container capped at 1200px. Vertical padding is 48px, matching the adjacent best-rented section’s `py-12`. Horizontal insets are 20px below 768px and 30px from 768px upward. This is the implemented section grid; it does not replace the brand’s wider grid guidance.

Three equal statistic columns persist on mobile. Top and bottom rules enclose the row; subsequent cells have left rules. Desktop cells have 26px top and 28px bottom padding, and subsequent cells use fluid left padding. Mobile cells use 22px vertical padding and 14px left inset after separators.

The supporting story uses two columns in a 1.35:1 ratio with a fluid gap. Below 768px it becomes a single column, placing the photograph before the paragraph and link, with a 24px gap. The photograph changes from a 2:1 desktop crop to 3:2 on mobile. Therefore “mobile stacks” describes the story, not the statistics.

## Elevation & Depth

The proof section has no shadows. A continuous charcoal field, subtle rules and the photograph’s natural depth establish separation. The link’s border and focus outline convey interaction without raised surfaces.

## Shapes

The statistic cells remain open, rectilinear divisions of one row. At the user’s request, the photograph has a rounded yellow backing offset to the right and bottom, matching their supplied reference. The offset is `clamp(12px, 1.5vw, 20px)` and the corner radius is `clamp(20px, 2.5vw, 32px)`. An inner crop clips the photograph and its existing entrance animation; the outer frame reserves space for the backing to avoid overflow. Cover fitting stays at `center 42%`.

## Components

### Proof row

A semantic definition list containing three CMS-backed values and labels. The existing fallback figures are 90k+, 30k+ and 401+; they are content, not design tokens or a new validation of the claims. Preserve the current CMS mappings. Values use `overflow-wrap: anywhere` to accommodate content growth.

When the homepage section enters view at an 18% intersection threshold, GSAP moves values from 14px below over .65s with an .08s stagger and `expo.out`. The image settles from scale 1.045 over 1.1s using the same easing. Content is visible before animation initialization. Reduced motion skips the entrance effect entirely. Cleanup disconnects the observer and reverts the GSAP context.

### Supporting story and rental link

The current image selection remains unchanged: `/images/why-choose-creator.png` for the established default mapping, otherwise the configured CMS image. Copy is alongside the image on desktop and follows it on mobile.

“Explore rentals” links to `/products`. It has a minimum 48px height, bottom rule, 36px icon gap and 12px vertical padding. Hover changes text and rule to yellow over 180ms. Keyboard focus uses a 2px yellow outline offset by 6px. Reduced motion removes transitions. The Heroicons arrow is an SVG and is hidden from assistive technology.

### Boundary with the About page

The `cmsData` branch still uses `WhyChooseUsLegacy.module.css`. Its existing copy/image arrangement is outside this scoped system. Neither this document nor the sidecar prescribes migration of that branch.

## Do's and Don'ts

### Do:

- **Do** preserve the existing Mona Sans and yellow/charcoal identity.
- **Do** retain CMS-sourced values and their descriptive labels.
- **Do** keep visible keyboard focus and the reduced-motion opt-out.
- **Do** preserve three mobile statistic columns while stacking the supporting story.

### Don't:

- **Don't** promote this section’s composition into a site-wide mandate.
- **Don't** introduce new proof claims through visual documentation.
- **Don't** let the decorative image backing overflow the page or cover the photograph.

The rounded offset image backing is explicitly requested for this section; it is not a site-wide rule. The About branch and neighboring FAQ copy remain outside this scope. Isolated crop, spacing and entrance measurements above remain component evidence rather than a new global token scale.
