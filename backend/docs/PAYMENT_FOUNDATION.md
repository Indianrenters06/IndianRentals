# Payment foundation and sandbox runbook

Status on 1 October 2026: local implementation and regression review pass. Actual disposable local MongoDB replica-set concurrency now passes; deployed database behavior and Cashfree sandbox checkout/webhook delivery remain unverified. Live Cashfree is deliberately disabled in both server configuration and the client SDK.

## Trust boundary

1. An authenticated customer submits product IDs, quantities, per-item tenure, delivery address and an optional coupon code to `POST /api/rentals/quote`.
2. `services/rentalQuote.js` retrieves Product, Settings, published product-page tenure configuration and Coupon data. It rejects unavailable products, excess quantities, unsupported terms/options, invalid addresses and invalid coupons. Money is calculated in integer paise. Client prices, tax, discounts and totals are not authoritative.
3. The customer reviews the returned amount. Rental creation requires the reviewed quote hash and a stable checkout key. The server calculates again and rejects changed quotes with HTTP 409. The saved rental contains its immutable pricing snapshot and selection hash.
4. Repeating the same owner's checkout key reuses that exact rental, including after a last-use coupon has been consumed. A changed selection or hash cannot reuse the key. The frontend preserves the attempt in session storage and requires review of a resumed snapshot before payment.
5. Cashfree creation is owner-only. The provider order ID is the internal rental ID, and its UUID request key persists across retries. Provider lookup failures other than 404 do not create a replacement order. Concurrent create conflicts fetch and reconcile the same order.
6. Settlement requires independent server-to-provider order and payment reads: matching internal/provider order, customer, INR currency, immutable amount, PAID order, SUCCESS payment, `is_captured: true`, and a unique transaction ID. A redirect, browser status or webhook amount cannot set paid state.
7. Paid state, transaction ID and receipt intent are persisted in one conditional database update. Repeated and concurrent callbacks cannot repeat that transition. This transition performs no automatic inventory, accounting or fulfilment mutation.
8. The confirmation page fetches the authenticated owner's server order. It shows confirmed payment only for persisted paid state without a refund-review flag. Pending, error, sign-in and manual-review states remain distinct.

## Pricing decisions requiring business review

- The initial payment is one monthly rent installment at the selected tenure rate, plus the refundable deposit, delivery and tax, less a validated rent discount. It is not the entire minimum tenure multiplied by months. This preserves the existing monthly checkout model while adding the previously omitted deposit explicitly.
- Whole-rupee tenure rounding matches the product page. Quantities multiply both rent and deposit. Coupon reductions apply to rent before tax, not to deposit/delivery.
- `Settings.checkoutPricing` defaults to the existing checkout's 18% rate (1800 basis points) and ₹400 delivery (40000 paise). These are implementation defaults, not a determination of tax treatment. Confirm rate, taxable base, delivery rules, deposit collection and recurrence policy before staging approval. No automatic subscription billing was added.
- Serviceability follows configured pincode prefixes. An empty list imposes no additional prefix restriction; no independent postal/courier availability lookup is asserted.
- Coupon usage is consumed atomically when a rental is created. Unpaid, abandoned and cancelled checkouts do not automatically restore usage. Approve this policy or implement a separately tested expiration/release policy before exposing limited coupons. No reservation expiry worker is supplied.
- Stock is checked at quote time; it is not reserved or decremented by this patch. Concurrent independent orders can compete for remaining stock. Validate the separate allocation/fulfilment process before selling scarce inventory.
- Existing orders without a version-1 snapshot cannot start new payment sessions. They require a fresh reviewed checkout; no historical repricing/backfill was performed.
- Nonempty options/addons fail closed until an authoritative pricing contract exists.

## States and retries

| Event | Persisted result |
| --- | --- |
| Server rental creation | `created`, unpaid |
| Cashfree session creation/reuse | `payment_pending`, unpaid |
| Fully reconciled captured success | `confirmed`, paid |
| Failed/pending attempt or abandoned ACTIVE provider order | Remains unpaid; a retry can reuse the same active order |
| Provider EXPIRED/TERMINATED | `cancelled`, unpaid; a fresh checkout is needed |
| Owner/admin cancellation while unpaid | `cancelled`; new provider session creation rejected |
| Captured payment after cancellation, or cancellation after payment | `manual_review`, paid with `refundReviewRequired`; automatic fulfilment and receipts blocked |

`payment_failed` is reserved in the schema; a failed attempt is intentionally not treated as a terminal order failure because another attempt may succeed. There is no automatic refund implementation. Review all paid cancellations manually against the provider ledger.

Webhook processing validates HMAC SHA-256 over the timestamp and exact captured raw bytes before reading event content. It uses a constant-time signature comparison. A modified body is rejected. Signed failed/pending attempts cannot undo successful settlement. Older signed retry timestamps are accepted; atomic transaction association prevents repeated side effects. Only exact `POST /api/payments/cashfree/webhook` bypasses maintenance restrictions, and signature verification still applies. Provider/network/database failures return non-success responses so the provider can retry.

## Database requirements and additive schema changes

Rental adds per-item tenure, deposit, immutable quote/selection/checkout context, explicit payment metadata/state, refund-review flag and receipt intent. Settings adds server checkout pricing. User adds purpose-bound, excluded-by-default OTP metadata. No dependency or framework migration is included.

Rental must have both unique indexes before checkout is enabled:

| Key | Required partial predicate |
| --- | --- |
| `{ user: 1, checkoutKey: 1 }` | `{ checkoutKey: { $type: 'string' } }` |
| `{ 'payment.providerPaymentId': 1 }` | `{ 'payment.providerPaymentId': { $type: 'string' } }` |

`utils/checkoutStorage.js` checks actual collection indexes; schema declarations alone are insufficient. Missing or differently scoped indexes fail checkout closed with HTTP 503. Do not run `syncIndexes()` on production casually: it can drop indexes. Inspect duplicates and create the intended additive indexes through the approved deployment migration process.

Coupon usage and rental creation share `mongoose.connection.transaction`, including Mongoose retry tracking. A replica set or sharded MongoDB deployment supporting transactions is required. There is no nontransactional fallback.

The opt-in integration test accepts only a local URI shaped like `mongodb://127.0.0.1:PORT/ir_security_remediation_test` or the localhost equivalent, with an optional query. It creates a uniquely named disposable database, uses synthetic User/Product/Coupon/Settings/CMS records, exercises concurrent checkout/coupon/settlement against actual models, and drops only that disposable database. Never supply a production URI.

```sh
# From the backend directory, with TEST_MONGO_URI set privately to a local replica set:
node --test tests/database-fixtures.test.js tests/payment-database.integration.test.js
```

On 1 October, the actual integration test passed against disposable loopback MongoDB 8.0.15: concurrent checkout/coupon use and settlement persisted once. Provider responses and delivery effects remain controlled doubles. See [LOCAL_DATABASE_VERIFICATION.md](LOCAL_DATABASE_VERIFICATION.md). Without TEST_MONGO_URI the opt-in test skips; a skip is not validation.

## Receipt recovery

Receipt intent is durable with paid state. A conditional claim changes `pending` to `dispatching` before SMTP. Success sets `sent`; failure or ambiguous delivery sets `delivery_unknown`. SMTP has no idempotency key, so exactly-once email delivery is not promised. Ambiguous/claimed attempts are never automatically resent.

- A provider retry or the protected verification endpoint can process a still-`pending` receipt.
- There is no background outbox worker. A crash after persistence with no later callback requires an operator or a future tested recovery worker to reconcile pending intents.
- For stale `dispatching`/`delivery_unknown`, inspect authorized mail-provider delivery records privately. Do not reset to pending and resend without establishing that delivery did not occur.
- Paid state remains authoritative even when receipt delivery is uncertain. A receipt failure cannot undo settlement.

## Configure sandbox privately

For isolated local work, create the ignored file `/Users/hemant/IndianRentals-clean/backend/.env`; backend `index.js` loads it when launched from the backend directory. Configure values there or in a restricted server environment, never in chat or a frontend environment:

- `CASHFREE_APP_ID`: sandbox app ID.
- `CASHFREE_SECRET_KEY`: sandbox secret used for API authentication and webhook HMAC.
- `CASHFREE_ENV=sandbox`.
- `CASHFREE_API_VERSION=2023-08-01`: retained existing contract; validate actual sandbox responses before changing it.
- `MONGO_URI`: isolated synthetic local/staging replica-set database, not the deployed customer database.
- `JWT_SECRET`: an isolated local/test signing key.
- `FRONTEND_URL`: controlled storefront origin for the return URL.
- Existing email/SMS settings only for controlled test recipients; no real customer mail.

Set `TEST_MONGO_URI` in the test runner's private environment for the disposable local database test. Node tests do not automatically load backend `.env`.

Point storefront browser/server API configuration to the isolated backend before testing. Existing development storefront/admin pages can target the deployed Render API; opening localhost alone does not make database writes local. Keep ports 3000/3001 running and use a separately configured local API port as appropriate.

In the Cashfree **sandbox** dashboard, configure a reachable controlled HTTPS URL ending `/api/payments/cashfree/webhook`, subscribe to success/failure/user-dropped events as applicable, and enable delivery retries. Localhost is not a reachable provider callback destination. Verify the proxy preserves raw request bytes and signature headers. Restrict any temporary tunnel to the isolated test service. Use only synthetic customers and provider test instruments.

## Required sandbox verification

First run the real local database test. Then verify cart → address → KYC when required → reviewed server quote → saved rental → hosted sandbox checkout → return → protected verification → signed provider callback → paid confirmation. Check the actual provider charge equals the snapshot, and changing client money fields cannot change it.

Exercise cancellation, failure, abandonment, network/provider errors, retry, duplicate retry, wrong amount/order/currency/customer, forged/missing/modified signatures, duplicate/concurrent delivery, internal processing failure and maintenance. Record sanitized IDs/statuses only, never headers, credentials, payment instruments or customer documents. Inspect final database states and receipt counts. Verify paid cancellation requires manual refund review and cannot start fulfilment.

Actual responses under API version `2023-08-01`, captured-payment field semantics, dashboard delivery retries, merchant fee behavior and hosted checkout/return behavior remain unverified. Exact amount matching deliberately fails closed if provider fee policy alters `payment_amount`; resolve that configuration/contract explicitly rather than weakening reconciliation.

Primary provider references reviewed during implementation:

- [Create order](https://www.cashfree.com/docs/api-reference/payments/latest/orders/create-order)
- [Get order payments](https://www.cashfree.com/docs/api-reference/payments/latest/payments/get-payments-for-an-order)
- [Webhook signature verification](https://www.cashfree.com/docs/payments/online/webhooks/signature-verification)
- [Webhook idempotency](https://www.cashfree.com/docs/payments/online/webhooks/webhook-indempotency)

These are current documentation references, not proof of the merchant's configured API/dashboard behavior. Live activation stays disabled even after sandbox passes.
