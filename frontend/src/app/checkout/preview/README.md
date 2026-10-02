# Staged checkout design preview

Open `/checkout/preview` on the local frontend. This is a reversible prototype for design review.

## Review the flow

1. Select **Use example details** to fill the address and KYC forms.
2. Continue through address, booking advance, KYC submission, and the pending review screen.
3. Use the **Preview screen** dropdown to simulate rejected or approved KYC.
4. Review the final bill, simulate balance payment, and view the booking status.
5. **Reset** clears the preview. **Original checkout backup** opens the saved original flow at `/checkout/legacy/cart`. **Go to checkout** opens the main connected flow.

Payment failure and a delivery charge adjustment are available as explicit preview controls.

## Calculation used for this trial

The advance is 10% of the estimated first bill: first-month rent, GST, refundable deposit and delivery, less any coupon discount. The balance is the final first bill minus that advance. Calculations use integer paise; a changed final bill does not change the recorded advance.

With an empty cart, the preview reads a catalogue product. Example delivery and GST amounts are illustrative. The advance refund policy remains unconfirmed and the UI says so.

## Isolation

- No payment, order, KYC, or upload API mutations.
- No changes to real cart state.
- Preview progress, entered strings and document filenames stay in a separate session-storage key. File contents are never uploaded or stored.
- The route is marked private for search engines.
- The original checkout remains available under `/checkout/legacy/`; its connected account/payment behavior is preserved separately from this simulation.

The new route, `CheckoutPreview` component, its CSS, and `checkoutPreviewModel.mjs` can be removed together. The only shared integration is the exact preview-route layout exception and optional progress props in `CheckoutHeader`; preserve all unrelated edits in those files when removing this prototype.
