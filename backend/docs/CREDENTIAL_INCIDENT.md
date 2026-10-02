# Tracked authentication material: S4 incident plan

## Verified scope (1 October 2026)

The audited `hemant-changes` commit is `72d334557f8756a52c374c253ae83cef639d7380`.
`backend/token.txt` was tracked and contained authentication material. File history
contains commits `e3f423a`, `b789ef2` and `5f49974`. Contents and subject are deliberately
omitted. The audit recorded expiry on 28 October 2026; deployed signature validity,
issuer environment and account privileges are unverified. No token was sent to a service.

The working-tree remediation deletes this artifact and the legacy
`get_admin_token.js` generator, which could create an administrator with a fixed
credential and write a long-lived session. No application code references that script.
Use the normal authenticated admin login and protected Team workflow. No replacement
bootstrap tool creates accounts or prints/writes sessions. Use an access-controlled
operator runbook for first-admin provisioning if required; never a default password.

## Required operator actions before an externally accessible release

1. Privately identify the issuing environment and subject using authorized server
   tooling and environment owners. Never paste the token, claims or signing keys
   into chat/issues/logs. Determine whether the bootstrap credential was ever used.
2. Assess sign-in/recovery/contact-change logs and paid records for S1/S2/S3 abuse.
   Preserve restricted evidence; do not automatically rewrite historical orders.
3. Revoke affected sessions. This application has no individual JWT denylist at this
   baseline. Deleting the file, clearing a browser cookie, resetting a password or
   rewriting Git history does **not** invalidate an already issued bearer token.
   If issuer validity cannot be ruled out, plan rotation of that environment's
   `JWT_SECRET` with the operator. Set the replacement in the deployment's backend
   environment/secret manager (Render service environment or VPS server-only env),
   restart all issuers/verifiers together and force re-login. Assess downtime and
   integrations first; do not put the key in a NEXT_PUBLIC variable.
4. Privately inspect privileged contacts, account creation and bootstrap usage;
   reset affected privileged credentials through the approved recovery process.
5. Enable repository/provider secret scanning and alerts. Run
   `node backend/scripts/scan_credentials.js` before commits and release builds.
   This bounded scanner detects JWTs, key blocks and common token patterns; a green
   working-tree scan is not a clean-history or all-secrets certification.
6. Assess all affected branches/tags, PR diffs, forks, CI artifacts and clones.
   After revocation, the repository owner may coordinate a separately approved
   history cleanup using GitHub guidance and a history-filtering tool. Collaborators
   must re-clone/rebase correctly. No force push or history rewrite is performed
   by this remediation. Notify the host if cached views require removal.

## Residual risk

The old material remains in Git history until an explicitly coordinated cleanup.
Local removal and prevention checks pass independently of server revocation.
Incident closure and public/staging release approval remain blocked until the
operator documents issuer assessment and effective revocation as necessary.
