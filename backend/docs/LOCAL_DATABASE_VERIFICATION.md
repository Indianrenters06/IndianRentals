# Disposable local database verification — 1 October 2026

## Scope and isolation

Official MongoDB **8.0.15** for macOS ARM64 was downloaded to a temporary directory and checked against the publisher SHA-256 file. A single-node replica set `irLocalTests` ran only on `127.0.0.1:27027`, with temporary data/log files. No global install, package dependency, production connection or deployment migration was introduced. The final database inventory contained zero synthetic test databases; the temporary Mongo process was stopped after verification.

The integration tests accept only a loopback `mongodb://` URI whose database name is `ir_security_remediation_test`. Each test opens a unique synthetic database and drops that database on completion. They never read `MONGO_URI`. Models, collection indexes, transactions and Mongo concurrency are real; provider/payment/mail delivery remains mocked or unused. KYC receipts contain synthetic metadata, with no identity download or provider asset upload.

## Results

- **Payments:** concurrent checkout creation returns one order per key; final coupon use is consumed once; duplicate captured-payment reconciliation marks paid and claims receipt once. Actual required unique indexes are created only in the synthetic database. Stock is unchanged because inventory reservation is outside this patch's contract.
- **KYC:** submission and approval update User/KYC in transactions; identity change resets status; stale or simultaneous approval returns conflict. A forced failure after the first real write rolls the entire transaction back.
- **Reviews:** eight concurrent same-customer submissions produce one 201/seven 409 responses and one stored review with correct aggregate rating/count.
- **Careers:** six concurrent requests with the same submission key/details return the same persisted receipt. Changed details under the same key return 409; no candidate notification is sent.
- **CMS:** unpublished drafts preserve public content; publish and discard persist correctly; an inactive selected product blocks publication.
- **Testimonials:** customer-supplied approval is ignored; unpublished content is absent publicly; administrative handler approval/edit/delete persists and changes the public result. This checks local data handlers; deployed role-scoped admin UI persistence remains a separate gate.
- **Sessions:** real model/JWT/middleware checks deny replay after logout/password changes, preserve concurrent increments and replacement sessions, handle legacy records safely and consume concurrent reset codes once.

The full backend suite ran with this replica set: **180 passed, zero failed, zero skipped**. Session integration reports six tests including its parent and five child scenarios. Payment and workflow integration tests each report one parent containing several assertions; counts describe the test runner, not independent provider scenarios.

## Reproduce

Start a disposable loopback replica set; then, from `backend/`:

```sh
TEST_MONGO_URI='mongodb://127.0.0.1:27027/ir_security_remediation_test?replicaSet=irLocalTests' npm test
```

The GitHub quality workflow now starts pinned-version `mongo:8.0.15`, initializes a disposable replica set and supplies this test URI for the backend job. Its `directConnection=true` option handles the container's internal advertised port. The hosted workflow has not been dispatched; local test success is not CI certification.

## Remaining gates

Deployed topology, indexes, migrations, replication/write concern, backups/restore, historical data, Cloudinary privacy/invalidation, hosted Cashfree checkout/webhooks, real OAuth and mail/SMS are unverified. Local database success does not approve staging or live payments. Evidence logs are in ignored `.gstack/local-followup-2026-10-01/`.
