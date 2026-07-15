# Cashfree — client setup steps

Client-facing checklist for the two Cashfree dashboard actions needed to finish
going live. Everything else (checkout, payment processing, order confirmation)
is built and deployed on the VPS in live mode.

Shareable version of this doc: https://claude.ai/code/artifact/b40322ca-92f0-4e2d-8d1e-0870bab25947

> Do not put the App ID or Secret Key in this file — it is committed to the repo.

---

## 1. Generate a new API secret key

**Why:** the current secret key appeared in a shared screenshot, so it must be
treated as exposed. Anyone who has seen it could transact on the account.
Regenerating immediately invalidates the old one.

1. Sign in to the Cashfree Merchant Dashboard.
2. Go to **Developers → API Keys**.
3. Confirm the **Production** environment is selected (not Sandbox).
4. Click **Regenerate** on the Secret Key.
5. Send the new **App ID** and **Secret Key** — see "Sending the keys safely" below.

Payments keep working until the new key is installed.

**Our side after receiving it:** update `CASHFREE_APP_ID` / `CASHFREE_SECRET_KEY`
in `/var/www/IndianRentals/backend/.env` on the VPS, then
`pm2 restart indianrentals-api --update-env`. The restart is required — the app
reads `.env` only at startup, so without it the live process keeps the old key
and `assertCashfreeConfigured()` can throw "Cashfree is not configured".

## 2. Add the payment webhook

**Why:** this is how Cashfree tells the backend a payment succeeded. Without it,
an order can be paid but never marked paid — e.g. if the customer closes the
browser right after paying. Only the client-side verify call covers that case
today.

1. Dashboard → **Developers → Webhooks**.
2. **Add Webhook Endpoint**.
3. Enter:

   | Field | Value |
   | --- | --- |
   | URL | `https://31-97-202-194.sslip.io/api/payments/cashfree/webhook` |
   | Event | Payment Success |

Cashfree may send a test request on save; it should succeed.

**Note:** this URL changes to `https://shop.indianrenters.com/api/payments/cashfree/webhook`
once the domain is connected. Send the client the updated URL after cutover.

## Sending the keys safely

The Secret Key is equivalent to the password for the payment account. It must
**not** be sent via WhatsApp, email, or screenshot — those retain permanent,
easily-forwarded copies, which is how the current key leaked.

- Preferred: a self-destructing note (e.g. onetimesecret.com) — send only the link.
- Or read it over a call and enter it directly.

The **App ID** is not sensitive. Only the **Secret Key** needs this handling.

---

## Status

- [ ] Secret key regenerated and installed on the VPS
- [ ] Webhook registered in the Cashfree dashboard
- [ ] Live test payment confirmed end to end
- [ ] Webhook URL updated to the custom domain (after DNS cutover)
