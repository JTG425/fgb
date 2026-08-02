---
name: ready-theatre-systems
description: >-
  Use when analyzing, designing, debugging, documenting, or changing the fgb
  theater website or any workflow that touches Ready Theatre Systems (RTS):
  theater schedules, films, ticket links, RTNs, show and place IDs, online
  selling, concessions, gift/loyalty cards, memberships, reserved seating,
  reporting, deposits, the Internet Server, schedule exports, or RTS APIs.
  Provides the RTS operating model, current-versus-legacy documentation rules,
  safety constraints, and the exact fgb-to-RTS data boundary.
---

# Ready Theatre Systems

Use this skill to reason about the Ready Theatre Systems ticketing platform and its relationship to the `fgb` repository. Treat RTS as an operational point-of-sale, ticketing, accounting, and external-integration system—not merely a showtime feed.

## Establish authority before acting

Apply sources in this order:

1. Treat the current [RTS Knowledge Base](https://helpdesk.rts-solutions.com/portal/en/kb/ready-theatre-systems) as the primary product authority.
2. Use the [legacy RTS wiki](http://wiki.readyticket.net/mw/index.php/Main_Page) for historical concepts and details omitted from the current knowledge base. The wiki explicitly says it is no longer maintained.
3. Treat the checked-in `fgb` implementation and its actual runtime payload as authoritative for the website's current data contract.
4. Treat processor, device, and API-provider documentation as authoritative for their own current requirements.
5. When sources conflict, prefer the newer source and call out the conflict. Do not silently combine incompatible procedures.

Re-open the current article before giving high-stakes operational instructions or implementing a version-sensitive integration. RTS menus, processor compatibility, APIs, legal requirements, and hosted URLs can change.

## Start with the system boundary

Classify the task before proposing a change:

- **RTS configuration:** films, schedules, price categories, tickets, concessions, stations, users, reporting, Internet Server, cards, memberships, or operational procedures.
- **RTS integration/transformer:** API credentials, schedule export, feed ingestion, normalization, enrichment, poster/trailer lookup, generated sale links, or API Gateway output.
- **fgb website:** rendering and caching the normalized payload, location selection, showtime display, outbound purchase links, content, or authenticated slideshow administration.
- **External service:** payment processor, email provider, Google Drive backup, accounting, distributor reporting, data provider, mobile app, or signage.

Do not implement a website workaround for an RTS configuration defect without identifying the true source of the data. Do not claim to change the upstream transformer from this repository: its implementation is not present here.

Read [references/project-integration.md](references/project-integration.md) before any task involving `fgb` code, payloads, showtimes, ticket links, AWS, or venue identity.

## Observe operational safety

- Never run test sales, refunds, voids, deposit closes, card batches, inventory corrections, seat changes, database restores, or server restarts against a live theater unless the user explicitly authorizes that exact live operation and its consequences are understood.
- Never expose or commit RTS, API, processor, SMTP, remote-access, database, or card-test credentials. Public RTS pages contain examples and historical credentials; do not repeat them.
- Never use real cardholder data in tests, logs, screenshots, fixtures, or prompts.
- Never invent API fields, bit meanings, endpoints, or sale URLs. Preserve opaque identifiers and confirm against current documentation or a captured non-sensitive payload.
- Never refund an online sale to cash by default. Follow the theater's current refund policy and processor flow.
- Never improvise an RTS database restore. Escalate restores and unexplained data corruption to RTS Support.
- Treat the RTS Server, its database, the Internet Server, port forwarding, TLS, and daily close as production infrastructure with accounting impact.
- Separate descriptive guidance from live mutation. When access to a live RTS console is unavailable, give a verification checklist and identify the required authorized operator.

## Use the operating model

Read only the references needed for the task:

- [references/architecture-and-security.md](references/architecture-and-security.md): server/workstation topology, RTN identity, networking, Internet Server, installation, backup, permissions, card processing, PCI, and failure boundaries.
- [references/configuration-and-selling.md](references/configuration-and-selling.md): films, schedules, auditoriums, tickets, concessions, inventory, fees, cards, memberships, online channels, restaurant, reserved seating, kiosk, signage, and timeclock.
- [references/operations-and-reporting.md](references/operations-and-reporting.md): opening and closing, deposits, refunds, reports, integrations that run at close, troubleshooting, and escalation.
- [references/integrations-and-api.md](references/integrations-and-api.md): RTS API v1/v2, feeds, accounting and box-office exports, data contracts, idempotency, and integration safeguards.
- [references/project-integration.md](references/project-integration.md): the exact `fgb` runtime flow, venue identifiers, JSON schemas, caching, AWS boundary, and repository-specific implementation rules.
- [references/source-index.md](references/source-index.md): complete current public article inventory, legacy coverage, provenance, and recency notes.

## Follow the task workflow

1. Identify the affected layer and location: Capitol, Paramount, both, chain-wide, or unknown.
2. Identify the source of truth for every field or action: RTS database, transformed feed, fgb/AWS content, or third party.
3. Trace stable identifiers end-to-end. Prefer RTN, RTS film code, performance/show ID, place ID, station, terminal, transaction ID, and card/account identity over display names.
4. Check timing and lifecycle boundaries: schedule publication, Internet Server refresh, cache/eTag behavior, performance open/close state, card batch, deposit close, nightly backup, or downstream export.
5. Preserve channel distinctions. Box office, kiosk, legacy RTN web, WebApp/mobile app, third-party API, signage, and reports may each have separate enable flags or names.
6. Preserve accounting invariants. Revenue, deductions, taxes, transaction fees, surcharges, tips, inventory, tenders, refunds, station close, and deposit close must remain reconcilable.
7. Design for retries and partial failure. Use stable transaction identities and status checks; never repeat a purchase, refund-all, or close merely because a client timed out.
8. Validate with non-sensitive fixtures and at least two venue cases when the task touches shared schedule or ticket data.
9. State what must be refreshed or restarted. Do not use “restart RTS” ambiguously: distinguish the Internet Server service, RTS client, kiosk/signage host, and Windows machine.
10. For live behavior that cannot be verified locally, provide an explicit theater-side acceptance checklist.

## Apply fgb-specific invariants

- Keep the public website read-only with respect to ticket inventory and transactions. Send customers to the sale link supplied by the trusted upstream payload.
- Keep RTN, show ID, and place ID together. A syntactically valid link can still sell the wrong venue, performance, or auditorium.
- Preserve the website's current date and time formats until the upstream contract is deliberately versioned: film `StartDate` is `YYYYMMDD`; show `date` is `MMDDYYYY`; show `time` is `HHmm` local theater time.
- Treat `Info1` through `Info4` as opaque RTS/transformer values unless current authoritative documentation defines the exact bit contract.
- Preserve string booleans such as `"True"`/`"False"` when consuming the current payload; normalize only at a documented boundary.
- Keep location identity data-driven. The current public repository contains chain and venue identifiers, but they may change operationally.
- Do not add RTS credentials, Basic Authorization headers, processor tokens, or private API calls to React/Vite client code.
- Do not conflate the public schedule payload with authoritative availability. RTS remains the authority at checkout.
- Treat the generic “Buy Tickets” link, per-show `salelink`, and gift-card link as different RTS channels with different routing semantics.
- When a source film appears in both venues, do not assume identical show IDs, place IDs, seat mode, accessibility flags, prices, or availability.

## Verify proposed work

For code or data-contract changes, verify:

- Capitol and Paramount remain correctly separated.
- A film with multiple shows and a show with subtitles render correctly.
- Empty, delayed, duplicated, malformed, or stale feed data fails safely.
- A cached eTag does not mask a schema change.
- Outbound URLs use HTTPS and the expected RTS host and identifiers.
- No secret or card data enters browser code, version control, logs, or fixtures.
- The user can still reach RTS checkout even when optional film enrichment is absent.
- The change does not alter station close, deposit, reporting, inventory, or refund semantics unless that scope is explicit.

For RTS configuration or operational guidance, verify:

- The operator is on the intended server/workstation and theater.
- The affected channel flags and stations are identified.
- Existing transactions, sold seats, open tabs, open stations, and batches have been considered.
- The expected Internet Server/service refresh is included.
- A rollback or support-escalation point is stated.
- Reconciliation reports are named when money, cards, inventory, or tickets are affected.

## Communicate uncertainty precisely

Label information as one of:

- **Current KB:** directly supported by the maintained helpdesk.
- **Legacy detail:** documented only in the retired wiki; verify in the installed RTS version.
- **Repository observation:** true of this `fgb` checkout, not necessarily RTS generally.
- **Inference:** derived from multiple sources or payload behavior and requiring confirmation.

Do not present legacy menu paths, unsupported field decoding, legal conclusions, or processor behavior as current fact.
