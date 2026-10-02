# Private KYC storage and migration runbook

Status: 1 October 2026. New upload, submission and authorized download contracts are implemented and covered by synthetic local tests. Actual Cloudinary authenticated delivery, MongoDB transactions and existing asset exposure have not been verified. **This patch does not make previously public documents private.**

## Current contract

| Operation | Contract |
| --- | --- |
| Customer upload | `POST /api/kyc/upload`, authenticated active customer, one file per supported field; JPG/PNG/PDF signatures, at most 10 MiB per file |
| Storage | Random UUID within `indian-rentals/kyc-private/`; Cloudinary `resource_type: raw`, `type: authenticated`, `overwrite: false` |
| Receipt | `KYCAsset` stores owner, field, provider ID, authenticated delivery type, MIME type, extension and byte count. Browser receives the database asset ID, never a provider URL |
| Customer submission | `POST /api/kyc` accepts only supported fields and references belonging to that customer and document field. Arbitrary URLs and foreign references are rejected |
| State | KYC and User verification state update in one MongoDB transaction. Identity/document changes reset approved submissions to pending; reference-only changes retain approval |
| Approval | Authorized KYC staff must supply the reviewed `expectedUpdatedAt`; a changed submission returns 409. Approval requires valid private document references |
| Customer status | `GET /api/kyc` returns owner metadata and references; legacy URLs are omitted and represented by `migrationRequiredFields` |
| Staff download | `GET /api/kyc/admin/:id/document/:field`, active admin/staff with KYC permission, customer-only target, owned asset lookup |
| Delivery | The server generates a provider download URL expiring after 60 seconds, fetches bytes itself and returns an attachment with `no-store, private` and `nosniff`. Signed provider URLs never reach the browser |

Supported file fields: `identityProof`, `addressProof`, `bankStatement`, `aadharFront`, `aadharBack`, `panCard`, `photo`. The two document-type labels are text only, not download references. General user DTOs omit identity document URLs/numbers.

The server permits only its generated HTTPS Cloudinary API hosts, rejects redirects and credentials/ports, enforces a 15-second download timeout and a streamed 10 MiB bound, then checks expected byte count and file signature. It does not retrieve arbitrary legacy links. The legacy user URL-submission endpoint returns 410. Staff view documents through the authenticated blob workflow; the old viewer delegates to the same workflow.

## Limits requiring operator decisions

- Signature checks establish an allowed format, not malware-free content. No antivirus, PDF active-content inspection or content-disarm service was added.
- There is no per-customer storage quota, aggregate submission quota or automatic retention/deletion worker in this patch. Multer and each file are bounded; review storage-abuse and retention policy before release.
- Uploads occur before the submission transaction. A failed database receipt triggers best-effort private asset deletion. Provider response errors, partial multi-file uploads or abandoned forms can leave private orphan assets. Do not expose these assets to simplify cleanup.
- Notifications run after successful state changes. A delivery failure does not undo the committed decision; actual mail delivery remains unverified.
- Cloudinary account settings, regional endpoints, credentials, deletion/invalidation behavior and direct unsigned denial require real provider checks with synthetic fixtures. Do not infer these from HTTPS or mocked SDK responses.
- MongoDB transaction support is required. A standalone server cannot safely emulate the two-record KYC state transition. Real transaction/concurrent-review checks remain pending.

## Before migration

1. Assign an authorized operator and a change window. Confirm incident-response, retention and access policy for identity documents. Use restricted storage for any migration manifest; no documents or signed URLs in Git, tickets, logs or chat.
2. Establish the serving backend revision, intended Cloudinary account and restricted service credentials privately. Use only a synthetic local/staging customer for the initial validation. Point both browser and server API resolvers to that isolated service before any writes.
3. Create/review the additive `KYCAsset` collection and verify MongoDB replica-set transaction support. Review a database backup and restore procedure. Do not run blanket index synchronization or mutate customer records to test readiness.
4. Upload a synthetic JPG/PNG/PDF with the application workflow. Verify the returned reference belongs to the synthetic owner and field. Verify a foreign customer, missing staff permission and changed review revision are denied.
5. Independently verify direct **unsigned** delivery of that synthetic provider asset is denied. Verify authorized application download succeeds and its response is private/no-store. Verify no signed provider URL appears in browser responses or ordinary access logs. A provider-generated signed API download has a different contract from public CDN delivery.
6. Verify any frontend/API/CDN service cannot cache authenticated document bytes. Verify the actual provider account does not permit public delivery/transformation paths for authenticated raw assets. Record statuses and opaque synthetic IDs only.

## Inventory existing assets without arbitrary URL retrieval

Run an authorized metadata-only inventory of KYC/User document references and the trusted provider asset inventory. Keep a restricted mapping of customer ID, field, legacy provider asset ID/resource/delivery type and intended private asset reference. Exclude bytes and credentials from routine audit output.

Do not follow caller/stored HTTP URLs or use their hostnames as migration authority. Derive an existing asset's identity from a verified provider account inventory and approved namespace. Unknown hosts/assets require investigation or a fresh customer upload. Do not reinstate the previous unrestricted fetch fallback.

Inspect original public assets, derived/transformed copies, cached delivery variants and known shared links. The application suppresses legacy URLs, but old CDN links may still work. Removing a database reference alone is not exposure remediation.

## Choose migration or customer re-upload

### Fresh private re-upload

Customers whose record contains legacy references receive a migration warning and can submit fresh private documents. A new private upload removes obsolete public URL references from the next submission while retaining existing valid private references; identity changes require a new review. This does **not** delete the old provider assets. Include those old assets in the controlled deletion/invalidation work below.

### Operator migration

No production migration script has been supplied or executed. Prepare a reviewed, resumable job with dry-run output, explicit customer/field ownership, an approved provider namespace, checkpointed progress and a separate rollback mapping. The job must:

1. Resolve each legacy asset through the trusted provider account, not by fetching its stored URL.
2. Create a new random authenticated raw asset without overwriting or publishing the existing asset. Verify provider delivery/resource type, byte count and allowed format.
3. Create the owner-and-field-bound `KYCAsset` receipt.
4. Replace only the expected legacy reference, conditioned on its prior value/current record revision. Skip a record changed by a customer or reviewer; never overwrite a newer submission.
5. Keep KYC/User verification state consistent in a transaction. Decide explicitly whether migrated documents require re-review; do not grant approval merely because a copy succeeded.
6. Confirm authorized application download and unsigned denial before marking that mapping successful.
7. Reconcile every failed/partial item. Retain the restricted mapping only for the approved recovery period.

## Remove old exposure and private orphans

After successful mapping and recovery checks, use authorized provider APIs to delete/invalidate the old public original and its derived/cached variants. Verify known former unsigned URLs no longer deliver bytes; record denial statuses, not document contents. CDN invalidation is asynchronous/provider-specific and requires a follow-up check. An inaccessible application endpoint is insufficient evidence.

Reconcile private orphan assets against `KYCAsset` receipts and live document references. Use an approved age threshold and legal-retention policy before deletion. Do not delete recently uploaded assets that a customer is still submitting; do not assume an unreferenced receipt is immediately disposable. No automatic cleaner is installed.

## Recovery and rollback

Pause affected document actions if provider privacy or state consistency cannot be established. Preserve private assets and restricted mappings for investigation. Roll back UI/schema compatibility only through a version that retains private delivery and owned-reference checks. **Never roll back to public uploads, URL-based browser display or unrestricted legacy fetching.** Restoring a database snapshot must not resurrect a public URL delivery path.

The safer recovery for an unmappable item is a new private customer upload and review. Do not guess document ownership, change account roles or fabricate customer approval.

## Evidence and completion gate

Local tests: `backend/tests/kyc-private.test.js` covers authenticated upload metadata, owned references, legacy DTO suppression, no-outbound arbitrary URL rejection, signed trusted read constraints, MIME/size limits, actor permissions, state reset, stale approval and legacy replacement. Existing KYC/customer-target tests cover related authorization contracts. These use synthetic bytes and controlled dependencies.

Close S7 operationally only after new synthetic provider denial/download checks, real transactional workflow checks and documented old-asset cleanup/re-upload completion. Close legacy exposure only with provider/CDN evidence for the inventoried assets. Current status is **local contract verified; provider and legacy migration gates pending**.

Implementation: `models/KYCAsset.js`, `services/kycAssets.js`, `controllers/kycController.js`, `routes/kycRoutes.js`, `admin/src/app/dashboard/kyc/page.js`, `frontend/src/components/KYCExperience.jsx`.
