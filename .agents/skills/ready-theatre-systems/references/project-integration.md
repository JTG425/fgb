# fgb project and RTS integration contract

## Repository boundary

This repository is a React/Vite public website with AWS Amplify configuration. It does not contain the implementation that talks to RTS, transforms the RTS schedule, enriches film metadata, or serves the configured API Gateway response.

The checked-in browser application:

1. Fetches `VITE_AWS_API_GATEWAY_URL` from `src/App.jsx`.
2. Expects top-level categories `Capitol`, `Paramount`, `Upcoming`, and `Slideshow`.
3. Reads the first element of each category and expects `{ eTag, data }`.
4. Caches each category's `data` and `eTag` in `localStorage` under `theaterCache`.
5. Renders normalized schedules and outbound RTS-hosted sale links.
6. Uses Amplify Storage and Cognito-protected administration for slideshow content.

The repository does **not** make RTS API v1/v2 purchase calls from the browser. Preserve that boundary. A direct RTS Basic-auth request in Vite/React would expose credentials and bypass the existing transformer/cache architecture.

`src/dataService.js` contains a separate Amplify Storage JSON fetch helper, but no current checked-in module imports it. Do not assume it is the active schedule path.

## Venues and current public routing

Repository observations at the 2026-07-13 audit:

| Website venue | City | Current RTN seen in sample/public links |
|---|---|---|
| Capitol Theater | Montpelier, Vermont | `61849` |
| Paramount Theater | Barre, Vermont | `12237` |

The public RTS WebApp chain ID is currently `fgbtheatres`. Treat these as configuration observations, not permanent constants. Verify the upstream payload and current RTS setup before changing routing.

Current public link roles:

- `https://app.formovietickets.com/?id=fgbtheatres`: chain-level “Buy Tickets” entry.
- Per-show `salelink`: location/performance/place-specific checkout entry supplied in normalized schedule data.
- The gift-card page currently links to an RTN-hosted gift route for RTN `61849`; verify whether that location is the intended chain gift-card authority before changing it.

Do not substitute one role for another. A chain landing page cannot replace a stable per-show link when the UI promises a specific performance.

## API Gateway envelope

The browser expects a response conceptually shaped like:

```json
{
  "Capitol": [{ "eTag": "...", "data": [] }],
  "Paramount": [{ "eTag": "...", "data": [] }],
  "Upcoming": [{ "eTag": "...", "data": [] }],
  "Slideshow": [{ "eTag": "...", "data": [] }]
}
```

If a category is absent, `App.jsx` leaves the corresponding new value unset. Cached values may already have been shown before the network request completes. A contract change must explicitly define behavior for absent, empty, malformed, and stale categories.

The eTag is an application-level per-category change marker in this client, not necessarily the HTTP `ETag` header. Preserve its semantics or version the cache.

## Normalized theater schedule schema

Each Capitol/Paramount film currently has fields like:

```json
{
  "name": "FILM TITLE",
  "rating": "PG13",
  "length": "120",
  "website": "https://...",
  "RtsCode": "AB123",
  "StartDate": "20260713",
  "poster": "https://.../poster.webp",
  "trailer": "https://www.youtube.com/embed/...",
  "description": "...",
  "show": []
}
```

Important contract details:

- `length` is currently a numeric string in minutes.
- `StartDate` is `YYYYMMDD`.
- `RtsCode` is used in asset paths and admin views; preserve case and exact value.
- `poster`, `trailer`, `website`, and `description` are enrichment fields and can be absent or empty.
- A film can exist in both venue arrays but its performance identities differ.

Each `show` currently has fields like:

```json
{
  "screen": "1",
  "date": "07132026",
  "time": "1900",
  "Info1": "7",
  "Info2": "7",
  "Info3": "8193",
  "Info4": "0",
  "soldout": "0",
  "soldoutGen": "0",
  "reserved": "0",
  "HasSold": "0",
  "salelink": "https://app.formovietickets.com/index.html?...",
  "Subtitles": "False"
}
```

Important contract details:

- `date` is `MMDDYYYY`, unlike film `StartDate`.
- `time` is a zero-padded `HHmm` string in theater local time.
- booleans/flags are strings, not JavaScript booleans.
- `Subtitles` is rendered only when exactly `"True"` in current code.
- `Info1`–`Info4` are opaque. Do not decode or overwrite them without the transformer/current RTS contract.
- `salelink` is the trusted customer handoff and must remain HTTPS and match the film's venue/performance/place.
- the public site displays schedule data but RTS checkout remains the authority for live inventory, sold-out state, prices, fees, and seats.

## Upcoming and slideshow schemas

`Upcoming` entries reuse film-level fields without `show`, plus optional `background` in checked-in examples. Clicking an upcoming item changes the selected site date to `StartDate`; it does not itself select a theater.

Slideshow entries are shaped like:

```json
{
  "Date": "2026-07-13",
  "Title": "...",
  "Description": "...",
  "Image": "https://...",
  "Background": "https://..."
}
```

The authenticated admin page uploads slideshow JSON and image/background files through Amplify Storage. Schedule/film data is not edited there. Do not make the public website's slideshow administration an RTS film editor.

## Active rendering behavior

- `src/pages/home.jsx` formats selected dates as `MMDDYYYY`.
- `src/components/movieCard.jsx` filters the selected venue's film shows by exact string equality on `show.date`.
- `movieCard.jsx` converts `HHmm` to local display time and uses `show.salelink` directly.
- Subtitle labeling depends on `Subtitles === "True"`.
- `src/components/upcoming.jsx` parses `StartDate` and changes the selected day.
- `src/pages/tickets.jsx` provides the chain-level WebApp link and separately displays static price/policy copy.
- `src/pages/gift.jsx` provides an RTN-hosted gift purchase link.

Static prices and refund text can drift from RTS configuration. When changing those pages, verify current theater policy, actual RTS ticket pricing/fees, and the hosted checkout behavior.

## Repository source artifacts

Checked-in samples under `Data Structure Formats/` document normalized output, not raw RTS API contracts:

- `RTS_Schedule_Capitol.json`
- `RTS_Schedule_Paramount.json`
- `Current.json`
- `Upcoming.json`

`test.json` contains a larger API-Gateway-shaped fixture. Use fixtures carefully: their films, dates, URLs, bucket names, and IDs are stale examples. Never infer current production availability from them.

## Change decision guide

| Desired change | Correct layer |
|---|---|
| Change a film title, showtime, auditorium, price, ticket availability, seat mode | RTS configuration first |
| Change whether a film appears on app/kiosk/API/signage | RTS film/performance/channel flags |
| Fix wrong RTN/show/place in all payloads | Upstream RTS configuration or transformer |
| Add poster/trailer/description mapping | Upstream transformer/enrichment, unless purely display fallback |
| Change how normalized shows render/filter | `fgb` React code |
| Change category envelope or eTag semantics | API Gateway producer and `fgb` client together |
| Change checkout, tender, card, seat allocation, refund transaction | RTS/API/processor—not the public React site |
| Change slideshow editorial content | Authenticated fgb Amplify Storage flow |

If the requested layer is not present in this repository, say so and identify the missing deployment/source rather than creating speculative client code.

## Implementation checklist for fgb

- Inspect `src/App.jsx`, the affected component, and a current non-sensitive payload.
- Preserve the API Gateway boundary and server-side secrets.
- Test both venue arrays and shared-film cases.
- Test multiple showtimes on one date and one title across multiple screens.
- Test absent poster/trailer/website/description values.
- Test string flag values and malformed date/time without crashing the page.
- Validate every outbound `salelink` host and its RTN/show/place values.
- Check cache migration when altering any category shape.
- Keep optional enrichment failure from blocking ticket access.
- Do not assert live price, seat, sold-out, or refund state from stale cached data.
- Use the existing project scripts for build/lint when code changes are authorized.

## Security boundary

Amplify/Cognito/API configuration intended for a public SPA is not a place for RTS credentials. Keep all of the following out of Vite environment variables exposed to the client and out of `amplifyconfiguration.json`:

- RTS Basic-auth users/passwords;
- processor merchant credentials or tokens;
- SMTP application passwords;
- AWS privileged credentials;
- API2 developer secrets;
- test card numbers or cardholder data.

Any future direct RTS integration belongs in a protected server-side component with network controls, secret storage, request validation, rate limits, transaction idempotency, and audit logging.
