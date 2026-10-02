# S13 — Local session revocation remediation

## Before

**Finding:** S13, browser-accessible bearer sessions and missing server-side revocation.

**Files:** `models/User.js`, `utils/generateToken.js`, `middleware/authMiddleware.js`, `controllers/authController.js`, `routes/authRoutes.js`.

**Root cause:** JWTs were valid for 30 days and checked only for signature/expiry and account state. Logout cleared a cookie but could not invalidate a copied bearer JWT. Password resets and administrator password changes did not revoke existing tokens.

**Fix selected:** add a persisted account-wide session version. Keep the existing transport contract for this patch; a coordinated HttpOnly-only transport migration remains separate work. Test with synthetic records and the actual model/middleware/controllers before integration into the main branch.

**Risks considered:** missing versions on legacy records, stale hydrated defaults overwriting revocation, simultaneous logout retries invalidating replacement sessions, concurrent password changes losing increments, recovery codes being reused concurrently, and acknowledging success after a failed database write.

## After

- Newly created accounts start at version zero. Legacy records without a stored version remain undefined when hydrated; they are interpreted as zero without an eager backfill or unrelated save overwriting a concurrent increment.
- Every centrally issued JWT includes the current version. Authentication compares it to the persisted account version on each protected request. Omitted claims are accepted only at version zero. Negative, fractional, null and mismatched versions fail closed.
- `POST /api/auth/logout` requires authentication and conditionally increments the version that was authenticated. Only an acknowledged matching update produces success and clears the cookie. The operation ends **all current account sessions**, including copied cookies and bearer tokens. Concurrent stale requests receive 401 and cannot revoke a newer replacement session. Database failures receive 503 with no success acknowledgement.
- Existing-account password changes use a model save hook that hashes the password and includes `$inc: { sessionVersion: 1 }` in the same MongoDB update. All current password setters use the model save path. Concurrent increments cannot overwrite one another.
- The administrator recovery handler consumes the exact verified OTP, purpose and expiry value in the same save as the password/revocation. A competing or changed recovery code produces 409 for both Mongoose `DocumentNotFoundError` and `VersionError` outcomes. Invalid passwords and failed writes leave stored credentials and the version unchanged.
- User profile edits do not accept a password or session-version field. The public user DTO does not expose the counter.

## Local verification

`tests/session-revocation.test.js` exercises the real Mongoose schema, validators, password hook, JWT library, protected middleware and authentication handlers. Only collection I/O is replaced with a synthetic compare-and-update fixture; no production account, database, email or credentials are used.

Fourteen tests cover central issuance; bearer/cookie replay after logout; legacy/future/malformed claims; failed logout; concurrent stale logout; password reset hash and revocation; one-use reset races; validation failures; administrator password edits; stale unrelated saves; concurrent password changes; database failure during reset; and corrupt persisted versions.

The synthetic-only backend suite at completion of the controller changes passed **172 tests**, with one optional database test skipped and zero failures. Other local remediation tests may change the combined suite count; the final count is recorded in the main report.

### Actual local MongoDB verification

`tests/session-database.integration.test.js` subsequently ran against the official local MongoDB 8 replica set `irLocalTests` on loopback port 27027. All **six reported integration tests** (one parent plus five scenarios) passed with zero skips. It used a unique disposable database, synthetic accounts, the real Mongoose model/collection, actual JWT issuance, protected middleware and authentication handlers. Only unused email/SMS side effects were replaced. The database was dropped after the test.

The real database scenarios verified copied cookie/bearer denial after logout; stale logout preserving a replacement; legacy hydration and unrelated saves preserving revocation; concurrent password changes retaining both increments and valid hashing; a stale password save after logout retaining the prior increment; and simultaneous recovery calls yielding one success and one 409 while consuming the code once.

Run with a dedicated local replica set only:

```sh
TEST_MONGO_URI='mongodb://127.0.0.1:27027/ir_security_remediation_test?replicaSet=irLocalTests' node --test tests/session-database.integration.test.js
```

The test rejects remote URI schemes/hosts and never reads `MONGO_URI`.

## Limits and merge/deployment gate

- This closes missing server-side logout/password revocation locally. It does **not** make browser-readable bearer storage resistant to token theft through XSS. Bearer storage, the 30-day expiry, cookie deployment topology and the deferred HttpOnly-only transport migration remain explicit risks.
- Frontend/admin clients now send the current token when logging out and clear local state only after confirmed 200 or a cookie-only already-ended 401. Database/network failures stay visible and retryable. A bearer 401 triggers one cookie-only retry so a newer valid cookie is also revoked. Both client helper suites verify failure/acknowledgement and stale-bearer/valid-cookie contracts; full authenticated deployed UI flows remain unverified.
- Deploy the backend and updated logout clients together. Do not roll the backend back to code that ignores the version after relying on revocation: old signed tokens would become usable again until expiry. A security rollback needs deliberate token-key revocation/session cutoff.
- No credential/key rotation, production backfill, forced logout or customer mutation was performed. Legacy version-zero tokens retain access until logout/password change, expiry, account disablement or an operator-managed global invalidation.
- Replay/concurrency has now passed against the disposable local MongoDB replica set. This does not certify the deployed database write concern, connectivity, replication or deployment topology. Repeat the controlled integration checks in the intended staging environment before staging approval.
