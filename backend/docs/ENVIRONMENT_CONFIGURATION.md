# Environment and API ownership

The repository supports separate storefront, admin and backend services. Establish the serving backend revision and authoritative host before a release; the existing Render fallback is not proof that it is the intended deployment.

| Consumer | Resolution |
| --- | --- |
| Storefront browser | `NEXT_PUBLIC_API_URL`, otherwise same-origin `/backend` |
| Storefront server and proxy upstream | Absolute `API_URL`, then absolute `NEXT_PUBLIC_API_URL`, then the existing Render host; relative server URLs fail |
| Admin browser | `NEXT_PUBLIC_API_URL`, then the existing Render host |

Configure an absolute server `API_URL` whenever the storefront browser uses the relative proxy. Align the admin browser origin with that same isolated backend before authenticated writes. A localhost UI can otherwise send requests to the existing deployed service. The current development admin's ignored `.env.local` selects the existing public service; no real administrator login or deployed writes were used to certify the patch.

`frontend/.env.production` and `admin/.env.production` remain tracked. Their reviewed values are public deployment settings, not demonstrated private credentials. They are build inputs: `NEXT_PUBLIC_*` values are embedded in browser bundles. Document the release environment overrides and rebuild after changing public hosts or modes; adding an ignore pattern does not untrack existing files. Do not place private credentials in those files or any `NEXT_PUBLIC_*` variable.

Configure backend secrets privately in the server environment or ignored `backend/.env`: isolated database and signing credentials, sandbox Cashfree credentials, private Cloudinary credentials, intended Google client ID and controlled mail/SMS configuration. Configure the exact owned storefront/admin CORS origins using the names in `utils/httpPolicy.js`; no wildcard deployment-domain policy remains. Never paste secret values into chat, commits or reports.

Database migrations, provider configuration and matching backend/frontend revisions are release gates. Career submissions require the actual unique sparse submission index and a matching API capability; the updated browser disables application submission against an older API. Payment remains sandbox-only. Follow `PAYMENT_FOUNDATION.md`, `KYC_PRIVATE_STORAGE.md` and the remediation report for the remaining integration checks.
