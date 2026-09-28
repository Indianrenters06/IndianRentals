# Rental process line-art generation

Mode: built-in image generation. Exact model version is not selectable. User direction: line art, a person narrating the process, white background. Character reference: first generated scene.

## Shared direction

One standalone square website illustration per step. Clean minimal editorial line art on pure white #ffffff. Thin charcoal #141414 outlines with restrained #ffcf46 yellow accents. Recurring young adult Indian woman with shoulder-length wavy dark hair tucked behind one ear, white shirt with sleeves rolled up, charcoal trousers. Three-quarter view, simple desk, clear action, minimal props, generous white padding. Match character, composition scale and drawing style across scenes. No letters, numbers, logos, step numbers, captions, extra people, glow, gradients, 3D or decorative plants. Readable at small website-card size.

## Scene 1 — Choose Your Tech

Woman seated at a desk choosing a rental on an open laptop. One hand on the trackpad, the other pointing to a screen with three simple laptop product tiles and one yellow selected tile. Human-led action, person occupies about 60% of composition. This generated image becomes the reference for subsequent scenes.

## Scene 2 — Complete KYC

Same woman holds her smartphone to verify a generic identity card. Phone has a simple portrait outline and yellow confirmation check. Card contains abstract lines only, no real personal data. Her attention and posture make verification clear.

## Scene 3 — Secure Your Order

Same woman confirms her laptop rental at the desk. One hand on trackpad, free hand resting naturally. Laptop screen contains a laptop thumbnail beside a large yellow confirmation check. Small payment card on the desk without numbers or logo.

## Scene 4 — Receive & Create

Same woman lifts an open laptop from a neatly opened shipping box on the desk. She looks ready to work. Laptop screen displays an abstract yellow creative canvas. Clear hands and box flaps; no extra supporting props.

## Outputs

Both frontend/public/images/rental-process and admin/public/images/rental-process contain the four `*-line-art.webp` files. CMS upload overrides and icon-only selections continue to take priority over built-in presets.

## White-background correction

The first image returned transparency. A built-in image edit replaced transparency with opaque white while preserving the character and composition; the corrected result is the shipped asset.
