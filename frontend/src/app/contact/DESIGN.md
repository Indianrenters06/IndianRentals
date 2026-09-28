---
name: IndianRenters Contact Page
description: A calm contact desk within the existing IndianRenters identity.
colors:
  orange-300: "#ffcf46"
  orange-50: "#fffaeb"
  grey-900: "#141414"
  grey-600: "#545454"
  grey-300: "#cbcbcb"
  grey-200: "#e2e2e2"
  grey-50: "#f6f6f6"
  white: "#ffffff"
typography:
  body:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
  control:
    fontFamily: "Mona Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 500
rounded:
  field: "8px"
  intent: "999px"
spacing:
  compact: "8px"
  control: "12px"
  related: "16px"
  group: "24px"
components:
  field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.grey-900}"
    typography: "{typography.control}"
    rounded: "{rounded.field}"
    padding: "12px"
  intent-selected:
    backgroundColor: "{colors.grey-900}"
    textColor: "{colors.white}"
    rounded: "{rounded.intent}"
  button-primary:
    backgroundColor: "{colors.orange-300}"
    padding: "12px 24px"
---

# Design System: IndianRenters Contact Page

## Overview

**Creative North Star: "The Contact Desk"**

A calm contact desk in the existing IndianRenters visual identity. Mona Sans, charcoal text, white space and yellow accents make actions easy to distinguish; thin rules organize practical details. This record applies only to the contact page and does not replace the storefront or parent brand system.

Recorded from `ContactPage.jsx`, `ContactForm.jsx`, `page.module.css`, `page.js`, the inherited `../globals.css` and `../layout.js`, with finished desktop and mobile captures. `PRODUCT.md` supplies the binding brand commitments. The implemented world matches the direction contract's Mona Sans, yellow, charcoal, white, clear rules and generous type.

**Key Characteristics:**

- Generous heading scale with compact supporting labels.
- Flat neutral surfaces and ruled rows.
- Pill actions and intent controls; softly rounded fields.

## Colors

A single warm yellow accent sits within a white and charcoal neutral system. Frontmatter preserves the source variable names and values.

### Primary

- **Brand Yellow (`orange-300`):** primary buttons, heading emphasis and the confirmation symbol.
- **Warm Paper (`orange-50`):** branch-directory background, an inherited brand tint.

### Neutral

- **Charcoal (`grey-900`):** headings, primary text, selected intent, focus outlines and selected directory rules.
- **Supporting Grey (`grey-600`):** explanatory copy, labels within contact rows, placeholders and metadata.
- **Field Border (`grey-300`):** editable control boundaries.
- **Rule Grey (`grey-200`):** row separators and intent-control outline.
- **Soft Grey (`grey-50`):** form surface.
- **White (`white`):** page and input surfaces; selected-intent text.

**The Action Accent Rule.** Use yellow for primary actions and brief emphasis; use charcoal for selected intent and directory states.

## Typography

**Display Font:** Mona Sans, with ui-sans-serif, system-ui and sans-serif fallbacks.
**Body Font:** the same family. The page uses regular, medium and semibold weights.

**Character:** Oversized, tightly tracked headings anchor restrained, practical body text. This is an observed hierarchy, not a fixed-ratio scale.

### Hierarchy

- **Display:** fluid hero (48–88px, 600, 1.02 line height, −0.04em tracking).
- **Headline:** fluid branch heading (36–56px, 600, 1.08, −0.035em).
- **Title:** contact and form headings (25–36px), helper heading (28px), branch names (32–40px); semibold with −0.03em tracking. Contact, form and helper headings use 1.2 line height.
- **Body:** recurring body role in frontmatter; branch detail uses 1.7 line height. Introductory hero copy grows from 15px to 19px.
- **Label:** compact medium labels, sentence case. Input values use the control role; placeholders are regular (13px).

**The Heading First Rule.** Put the branch name before the office or service-city description. Keep metadata in supporting text.

## Layout

Content caps at 1200px, centered with 20px side gutters on mobile and 30px from 600px. The page uses a single column below 600px. Above that breakpoint the hero, contact area and help area split into two columns; the contact split is 0.85fr/1.15fr. Form fields remain one column until 1024px, then pair with full-width name and message fields.

The branch selector is a native select below 600px, horizontal wrapping city buttons from 600px, and a vertical directory beside branch details and illustration from 1024px. Repeated gaps and padding use the compact, control, related and group spacing roles; section spacing expands at desktop rather than following a single rigid scale.

## Elevation & Depth

**The Flat Surface Rule.** Separate content with tone, whitespace and rules. Reserve the inherited soft button shadow for hover feedback.

The form and directory use tonal backgrounds without container shadows. The inherited primary button adds a small soft shadow and half-pixel lift on hover, then removes its shadow and compresses on press. Its focus treatment combines an inset brand ring with the page's visible charcoal outline.

## Shapes

Fields use the field radius. Intent options are pills within a ruled pill enclosure. Primary buttons inherit fully rounded corners. The form container uses a softer enclosing radius (16px); this single container value is recorded as a component detail, not a new radius scale. Contact and directory rows remain open, with thin bottom rules. Outline SVG icons accompany actions and metadata.

## Components

### Buttons

Yellow pills with medium text and the scoped padding in frontmatter. Minimum height is 44px, with 14px text. Hover, active and focus inherit the storefront button states. Links use inline outline arrows, underlines or darker rules for feedback. The page applies a 2px charcoal keyboard outline with 4px offset to links, buttons and editable controls.

### Inputs / Fields

White, bordered fields on the soft-grey form surface. Inputs, selects and textareas share the field component; minimum control height is 46px. Textareas resize vertically. Labels remain outside the controls. Native selects use an inline SVG chevron and retain 16px editable text. Browser validation supplies the current error behavior; no custom error or disabled visual pattern is established here.

### Intent Control

Two native radio choices in a pill enclosure, with charcoal fill and white text for the selected choice. The input stays keyboard accessible, and focus is shown around its containing label (2px outline, 3px offset). Option padding expands on desktop.

### Contact and Help Rows

Direct contact links combine an outline icon, supporting label, contact value and trailing arrow. Thin bottom rules separate rows; hover darkens the rule. Help links reuse the open row treatment. Long contact text can wrap.

### Branch Navigation

The local directory uses pressed-state buttons with a charcoal rule and heavier text; desktop adds a visible arrow to the selected row. The mobile native select controls the same detail region. The city name leads the region, followed by office or service-city metadata. Existing city art uses contain sizing and multiply blending on warm paper. Cities advance every three seconds and loop back to Delhi after Kolkata. Clicking a city or choosing it on mobile updates the details immediately and restarts the timer. A progress line and pause/play control expose playback. Images crossfade in 300ms; detail copy settles in 240ms. Rotation pauses offscreen, in a hidden tab, while reading hovered details, and during keyboard interaction. Reduced-motion preferences disable autoplay and transitions.

### Form Container

Soft-grey enclosing surface with progressively larger padding: 24px 20px, then 28px 24px, then 36px. The confirmation occupies the same container. It appears only after the backend acknowledges a saved request. Failed requests retain their input and display an inline error. Rental and support modes have distinct fields and submit labels.

The storefront header and footer are inherited context, outside this scoped component record.

## Do's and Don'ts

### Do:

- **Do** inherit Mona Sans and the existing brand color variables.
- **Do** retain visible labels, native form controls and visible keyboard focus.
- **Do** stack the form and branch content on narrow screens; keep editable control text at 16px.
- **Do** use the supplied city illustrations and outline SVG icons.

### Don't:

- **Don't** promote the demo notice or confirmation copy into reusable brand messaging.
- **Don't** use branch metadata as an eyebrow above the city heading.
- **Don't** replace the existing storefront design authority with this scoped demo record.

**Not canonized:** the one-off hero underline dimensions, demo-strip typography and confirmation symbol dimensions are surface details, not reusable tokens. No remaining craft-floor defect is promoted into the system.

## Contact hero addition

A generated editorial contact photo now precedes the original text hero. The desktop frame follows Figma node `23612:16550`: 12:5 aspect ratio, 1200px maximum width and 32px corners. On mobile, the frame becomes 4:3 with 20px corners and a 70% horizontal focal point. White Contact Us copy remains HTML; mobile places it at the lower left with a restrained contrast scrim. The original “Let’s get you set up.” heading and supporting copy remain below. Asset: `public/images/contact-support-hero-v1.png`. Prompt and art direction: `docs/contact-hero-art-direction.md`.


## Promotion and CMS

The design is now served at `/contact`; `/contact-demo` preserves the original page. The hero is first. Page content, branch details, images, equipment options and form copy are managed under Contact Page in the admin CMS. See `docs/contact-integration.md` for request handling and verification.
