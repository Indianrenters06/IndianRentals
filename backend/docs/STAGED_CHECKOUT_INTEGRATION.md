# Staged checkout integration — local verification, 2 October 2026

## Scope and rollout

The connected `/checkout/staged` layout is the main cart checkout. Product add-to-cart actions open `/checkout/staged?new=1` immediately. `/cart` and the previous address/KYC/payment entry URLs redirect to it; the new intent survives sign-in. My Orders can resume a specific staged booking by its order ID. The original cart/address/KYC/payment pages are preserved under `/checkout/legacy/` as a backup accessed through `/checkout/preview`, which remains an isolated design simulation. No deployment or live-payment enablement was performed.

The first payment is 10% of the authoritative initial first bill, rounded in integer paise. This includes first-month rent, GST, refundable deposit and delivery, less discount. Captured advance remains a partial payment. Current approved KYC and a separately reviewed final quote are required for the outstanding payment. The final quote freezes when balance checkout starts. Payment and current KYC are checked transactionally before fulfilment.

## API contracts

| Endpoint | Contract |
| --- | --- |
| POST `/api/rentals/quote` | Authenticated cart selections and delivery address; calculates the authoritative initial first bill |
| POST `/api/rentals/staged` | Existing quote selections plus reviewed `quoteHash` and durable `checkoutKey`; creates a staged rental before KYC |
| GET `/api/rentals/:id/staged` | Owner/orders admin; `{rental,kycStatus,advancePaise,paidPaise,balancePaise,finalQuote,canPayBalance}` |
| POST `/api/rentals/:id/staged/finalize` | Owner, confirmed advance and approved KYC; derives final bill from stored estimate |
| PUT `/api/rentals/:id/staged/final-quote` | Orders admin; `{deliveryPaise,reason}`, after advance/KYC and before balance initiation |
| POST `/api/payments/staged/order` | Owner; `{rentalId,stage:'advance'|'balance',quoteHash}`; fixed sandbox provider association |
| POST `/api/payments/staged/verify` | Owner; independently reconciles provider order and captured transaction |

The signed webhook dispatches by the exact stored stage association. Captures are recorded in a global transaction-provenance ledger shared with legacy payments. Stage state `paid` means confirmed capture; only fully collected rentals have `isPaid=true`. Any collection after cancellation or a balance/KYC race is retained for manual review. Refunds are not automatically issued.

## Required configuration

- Cashfree remains sandbox only. Configure the local/staging backend and frontend API origins together to exercise connected checkout; local UI servers using an older hosted API will not have these new endpoints.
- MongoDB must support transactions. Add and verify the four partial unique Rental indexes for `staged.advance/balance.providerOrderId/providerPaymentId`; runtime fails closed if absent. The PaymentCapture `_id` enforces global provider transaction identity.
- Legacy rentals are not repriced or migrated. The immutable estimate remains separate from the final bill.
- Confirm the business advance/refund policy and test provider redirects/webhooks in a configured sandbox before rollout. Catalogue availability is checked but inventory is not reserved by the advance.

### Local runtime status when the cart default changed

The checked-in backend has no local environment file or inherited database, JWT, Cashfree or private-upload credentials. Admin environment files currently point to the hosted API; the storefront also carries the hosted fallback. Updating routes and UI does not update that hosted service. Running the full connected app locally requires an explicitly configured isolated transaction-capable MongoDB, sandbox Cashfree credentials, authentication/private-upload configuration, and matching storefront/admin API origins. Use an available API port such as 5001: on this machine port 5000 belongs to macOS Control Center. No existing environment settings or real databases were changed for this work.

The running storefront's quote endpoint was checked and returned `Not Found - /api/rentals/quote`. The connected checkout now explains missing API routes and offers an explicit link to `/checkout/preview` for simulated exploration. It does not simulate a successful quote or payment in connected checkout. Both connected checkout and Profile → KYC render `KYCExperience` and use the account's same `/api/kyc` record; checkout shows it after confirmed advance payment and reuses existing approval.

The locally verified payment reconciliation uses synthetic provider fixtures and a disposable localhost replica set. It confirms the server-side advance, KYC, final-quote and balance contracts without making provider transactions.

## Verification evidence

### Main-entry routing correction

- Earlier work changed the old cart's Continue button but still rendered the old cart at `/cart`. This is corrected: `/cart`, `/checkout/address`, `/checkout/kyc` and `/checkout/payment` now redirect to `/checkout/staged?new=1`.
- All four add-to-cart implementations navigate to the main connected checkout immediately after saving the product. The original flow is preserved under `/checkout/legacy/` with a backup banner and a link from the isolated design preview.
- Gstack verified direct `/cart` navigation on both localhost and 127.0.0.1, actual desktop and mobile product booking, preservation of product/quantity/tenure in cart storage, the sign-in return URL, the preview-to-backup link and backup cart-to-address navigation. Mobile had no horizontal overflow. The frontend production build passed; targeted lint had no errors and two existing image warnings in FeaturedShowcase.
- Browser checks were signed out and placed no orders or payments. Existing hosted API connectivity warnings were observed; these do not change the runtime prerequisites above.

### Default checkout follow-up

- The cart's primary button opens `/checkout/staged?new=1`. Desktop browser verification confirmed the estimated 10% advance includes the refundable deposit, the checkout progress includes Advance and Balance, and the sign-in redirect preserves `new=1`. Mobile checkout had no horizontal overflow.
- The main admin Orders page now renders the same staged-aware OrdersTable as the filtered order pages. Refresh updates an open order's details; advance/balance collections, outstanding amounts, current KYC, manual refund review and final delivery adjustment controls are available there.
- Backend: 198 tests passed with zero skipped against an isolated localhost replica set. The added registered-route integration exercises advance capture, rejection of finalization before KYC approval, admin-only delivery adjustment, exact balance quote review and final capture. Provider and authentication in that route test are synthetic fixtures.
- Frontend: 57 tests passed. Admin: 25 tests passed. Both production builds passed. Targeted lint had no errors; the reused admin OrdersTable retains one existing Next.js warning for a product `<img>`.
- These checks do not configure the running hosted API or confirm settlement with the payment provider. The local runtime prerequisites above still apply.

- Backend: 197 tests passed, zero skipped, including real isolated localhost replica-set transactions, concurrent stage captures, quote freezing and KYC/cancellation races. Syntax check passed 154 JavaScript files.
- Frontend: 57 tests passed. Admin: 25 tests passed. Both production builds passed; targeted changed-file lint passed.
- Isolated browser fixture: 725px and 390px layouts had no horizontal overflow; amount surface computed as `#fffaeb` with `#ffcf46` border. Pending → approved → reviewed final quote → balance confirmation passed; exact reviewed hash sent, no payment enabled before review, remaining amount zero after server confirmation. Booking/payment-stage return links survive sign-in.
- Existing address popup checked at mobile/tablet sizes for saved/default selection, autofill, add/edit, focus and Escape. Design-preview address edits remain session-only; connected checkout persists account addresses.
- Browser fixture APIs and provider SDK were synthetic. Real provider settlement, production data and live administrative writes were not exercised.
