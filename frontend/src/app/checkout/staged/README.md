# Connected staged checkout

`/checkout/staged` is the main authenticated checkout, using the approved preview layout. Product booking and catalogue add-to-cart actions open `/checkout/staged?new=1` immediately. `/cart` and the former `/checkout/address`, `/checkout/kyc`, and `/checkout/payment` entry routes redirect to this same main flow. The `new=1` intent survives sign-in so a new cart does not silently resume an older booking.

The original cart, address, KYC and payment pages are preserved together at `/checkout/legacy/cart → /checkout/legacy/address → /checkout/legacy/kyc → /checkout/legacy/payment`. They have a backup banner and are reachable from the design preview's **Original checkout backup** link. These backup pages retain the original connected behavior. `/checkout/preview` remains a separate simulation with no payment/order/upload mutations.

## Stages

1. Select a saved account address, or add/edit one through the existing AddressModal. Review the authoritative server quote.
2. Create a staged rental with a reviewed quote hash and durable checkout key. The server calculates a 10% advance from the complete first bill (rent, GST, deposit and delivery, less discount).
3. Use the sandbox provider checkout. Server reconciliation records the captured advance separately; this does not mark the rental fully paid.
4. Submit/reuse the existing private KYC workflow. After approval, review the server's final bill. Orders admins may adjust delivery with a reason before balance checkout starts.
5. Confirm the displayed final quote and pay its outstanding balance. Provider callbacks are reconciled independently; only confirmed full collection marks the rental paid. Current approved KYC is also required for fulfilment.

Booking URLs use `?orderId=<id>` and can be resumed from My Orders. Provider returns include `paymentStage`, which triggers server verification. Refresh booking status reconciles pending payments. No browser payment/KYC flags are accepted as authority. Cancelling after any collected amount requires manual refund review; this implementation does not issue automatic refunds.

## Before a rollout

- This implementation preserves the existing **sandbox-only** provider restriction. It does not enable live payments or deploy services.
- MongoDB must support transactions. Build and verify the four staged unique indexes through the normal database/index rollout before enabling staged payments. Missing indexes fail closed.
- Confirm the advance refund policy, inventory/availability operations, tax treatment and delivery adjustment policy before publishing this flow. Availability is checked, not reserved.
- Verify the advance, KYC rejection/resubmission, adjusted final bill, balance, redirect/webhook retries, cancellation and fulfilment gates in a configured sandbox environment.

The immutable initial estimate and separate frozen final bill are retained. Existing legacy rentals are not migrated or repriced.
