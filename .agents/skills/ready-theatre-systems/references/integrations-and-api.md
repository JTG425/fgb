# RTS integrations and API contracts

## Integration principles

- Use a separate least-privilege account for every integrator.
- Keep credentials server-side and outside version control.
- Use HTTPS and current TLS requirements.
- Treat schedule data as a snapshot and checkout/transaction responses as authoritative state.
- Persist stable RTS identifiers and provider transaction IDs.
- Make state-changing operations idempotent at the integration layer.
- On timeouts, query transaction state before retrying.
- Log request correlation, command, RTN, show/place, status, and timing—but no authorization header, card data, PIN, or private customer content.
- Test against the RTS-provided test system and current test data, never a live theater by convenience.

## RTS API v1

The maintained `API Documentation` article describes an XML API commonly accessed with an HTTPS `POST` to:

`https://<RTN>.formovietickets.com:<port>/Data.ASP`

The documented default external port is commonly `2235`. Authentication is HTTP Basic using a configured web/API user. Schedule responses can be GZIP-compressed.

Account flags such as schedule selling/availability fields must match the requested schedule form. A mismatch can produce authorization failure even when the username and password are otherwise valid.

Documented capability families include:

- schedule retrieval (`ShowTimeXml`);
- general-admission and reserved ticket purchase (`Buy` and related structures);
- fees and adjustment detail;
- gift/loyalty balance, generation, purchase, and registration;
- sold-out and redeemability checks;
- transaction verification, detail, redemption, refund, and reversal;
- processor-specific or third-party payment flows;
- seat layouts, seat plans, selection validation, seat charts, holds, and releases;
- concession/menu purchase data;
- error codes, seat codes, and film/show bit fields.

Command names are case/version sensitive in places. Consult the live current article for the exact XML envelope and current response fields. Do not copy the public article's credentials, card examples, or test values into this skill or a repository.

## RTS API v2

The maintained `RTS API 2` article directs developers to current external documentation/Postman material. It describes a TLS JSON/REST integration using HTTP Basic per location. A developer ID is required after test implementation and per-location costs may apply.

Legacy API2 documentation describes a pattern similar to:

`https://<RTN>-api2.formovietickets.com:<port>/app/api/v2/<endpoint>`

It also describes:

- an `info` identity object with developer/location information;
- `purchaseInfo` metadata for customer-initiated transactions;
- schedule and item data delivered as push feeds rather than pulled on demand;
- a receiver handshake requiring HTTP 200 and an `rtsok` body;
- GZIP-compressed JSON schedule delivery.

Treat those legacy details as a hypothesis until confirmed in the current API2 package. Do not build a new integration solely from the retired wiki.

## Schedule and reporting feeds

- Gracenote/data-feed documentation shows location-scoped showtime XML commonly available under an RTN `formovietickets.com` host and port `2235`.
- Schedule exports can write locally or use FTP/FTPS with format, machine, interval, retry, destination, and test settings.
- Internet data transfer can send/receive chain or corporate sales/performance data. Passwords must match and incoming connectivity depends on port `2235`.
- Numero can send hourly and run a nightly catch-up.
- MaccsBox EBOR sends around ticket close and requires all tickets for the date to be closed.
- QuickBooks Online exports can run at deposit close; manual export and error review remain necessary.

Identify whether a task is a pull API, RTS push feed, local file export, close-triggered report, or hosted web link. The retry and trust model differs for each.

## Transaction safety

For a purchase, hold, refund, or redemption:

1. Generate a client correlation/idempotency key outside RTS if the API does not provide one.
2. Record RTN, performance/show ID, place ID, ticket/item choices, expected amount, and the RTS/provider transaction identity.
3. Validate monetary totals and seat assignment before committing.
4. Treat HTTP success as transport success only; inspect the RTS result/status.
5. If the response is lost, verify transaction state before retrying.
6. On partial success, reconcile the authoritative RTS transaction and tender before compensating.
7. Use the original tender and supported refund/reversal command.
8. Reconcile against RTS API sales, Internet sales, card, deposit, and channel reports.

Never cache a seat hold or availability response as sale authority. Holds expire and availability changes concurrently.

## Schedule normalization

Keep raw and normalized layers separate:

- Preserve the raw source artifact long enough to diagnose mapping errors, subject to privacy/retention policy.
- Map RTN, film code, performance ID, place ID, start time, seat mode, availability flags, accessibility/format flags, and sale URL explicitly.
- Add posters, trailers, descriptions, and external film pages as enrichment; do not let enrichment replace RTS identity.
- Use theater local time with an explicit time zone at the transformer boundary.
- Preserve unknown fields and bitmasks until the current contract defines them.
- Version normalized schemas and reject incompatible payloads visibly.
- Deduplicate using stable identifiers, not title plus time alone.

## Integration acceptance tests

- Fetch/push a schedule for each configured RTN.
- Verify one film shared by multiple venues remains two sets of performances.
- Verify a general-admission and a reserved performance.
- Verify a sold-out/closed performance does not appear purchasable.
- Verify subtitles/accessibility and premium-format flags.
- Verify an amended title and a canceled show.
- Open every generated sale URL and confirm theater, title, date, time, and place.
- Simulate timeout/retry without a duplicate transaction.
- Confirm credentials and authorization headers are absent from client bundles/logs.
- Reconcile test totals with RTS reports.

## When current documentation is required

Re-open the live current docs before work involving:

- API v2 endpoints or developer onboarding;
- exact v1 XML, bit fields, errors, or payment commands;
- test credentials or card data;
- TLS/cipher and port requirements;
- processor/device compatibility;
- third-party fees or licensing;
- distributor/accounting transmission requirements.
