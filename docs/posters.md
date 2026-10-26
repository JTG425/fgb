# Posters page

The public collection lives at `/posters`, with links in desktop and mobile navigation. `/admin` remains disabled: the admin interface belongs to a separate project and is deferred.

## Catalog

`src/data/poster-catalog.json` contains 1,032 listings representing 1,492 physical posters from the supplied catalog. Empty/total rows are excluded. All four repeated catalog numbers retain both records, with `-2` appended to the second listing's internal ID. The original number is retained as `catalogNumber`.

Titles, years, types, sizes, condition notes, estimated values, quantities, storage locations, acquisition dates, provenance, and comments are preserved. Missing years remain unknown. The 1,030 public Drive image links are stored as `imageUrl` and displayed through Google's thumbnail endpoint, with responsive sizes and lazy loading. Cards keep a 9:16 frame and show the entire photograph without cropping; detail views use the photograph's natural proportions. Unused acquisition-cost/ROI columns are excluded.

The source has no usable image URL for `MOV-0541` (The Falcon and the Snowman) or `MOV-0802` (Claire's Knee (Le Genou de Claire) (2)). These retain `public/poster-placeholder.svg`, which is also the fallback when a remote image cannot load. Existing catalog overrides without an image field retain their baseline photograph. Image links are part of the bundled catalog and do not require a backend deployment.

The supplied values are estimates, not confirmed sale prices. `askingPrice` starts as `null`; a future saved asking price takes precedence over the estimate. Values are per physical poster. Requests do not reserve inventory, decrement stock, or take payment.

To regenerate the baseline from the original CSV:

```sh
python3 scripts/import-poster-catalog.py '/path/to/Poster Catalog.csv'
```

Keep the source's row order when reimporting, because duplicate-number suffixes follow its order. Review inventory-ID changes before publishing a new baseline.

## Backend and deployment

The implementation uses the Amplify Gen 2 data resource in `amplify/data/resource.ts` and the string GraphQL schema in `amplify/data/schema.graphql`. Keeping the GraphQL schema is supported by AWS's Gen 2 migration tooling. The poster API uses Cognito identity-pool IAM credentials, independent of the announcement API key, and preserves the theater's external ticketing integration.

- `PosterListing`: public read-only catalog overrides. An empty table uses the bundled catalog. Existing IDs replace their baseline listing; new IDs add listings. Hidden (`active: false`) and zero-stock records persist as overrides.
- `PosterRequest`: create-only submission API. Records contain the listing ID/title, catalog number, name, phone, comments, status, and server timestamps. There are no query, update, delete, or subscription endpoints for requests. Neither visitors nor signed-in users can read another customer's information through this API.
- The custom `createPosterRequest` pre-auth resolver validates input lengths and phone syntax, and forces initial status `NEW` and server timestamps.

**The backend must be deployed before purchase requests work.** Follow the [Gen 2 migration runbook](amplify-gen2-migration.md) for the existing AWS environment, then deploy with the branch's `amplify.yml`. Hosting generates `amplify_outputs.json`; local development can retrieve it with `ampx generate outputs`. Do not use Gen 1 `amplify push` in this converted checkout. The public catalog remains browsable when the service is unavailable or unconfigured, with request submission disabled.

`amplify/data/poster-request-validation.ts` attaches the validation resolver to the generated mutation pipeline. `npm run test:backend` synthesizes CloudFormation and verifies the restricted operation surface, validation attachment, and table retention. The announcement table is imported during migration; the two poster tables are new resources.

The separate admin project should later add authenticated listing mutations and private request queries/status updates to the shared backend after its actual authentication setup is inspected. It should use the same stable listing IDs and save hidden records rather than deleting overrides, which would reveal their bundled baseline again. No admin editor or request inbox is enabled in this public site.

## Verification

```sh
npm test
npm run check:backend
npm run test:backend
npm run build:test
```

`tests/posters.browser.mjs` runs against the local Vite server and uses Playwright with installed Chrome. It intercepts all AWS calls with synthetic fixtures and never submits a real purchase request. Set `PLAYWRIGHT_MODULE` to a Playwright package path when it is supplied by a workspace runtime rather than installed locally:

```sh
npm run dev:test -- --host 127.0.0.1
PLAYWRIGHT_MODULE=/path/to/playwright node tests/posters.browser.mjs
```

Test mode supplies synthetic Gen 2 outputs. Never publish a test-mode build. The browser checks cover searching, filters, sorting, pagination, details, invalid inputs, submission failure/retry, prevention of duplicate clicks, hidden/sold-out overrides, unavailable services, light/dark mobile layouts, focus restoration, and the disabled admin route. Screenshots go to `/tmp/fgb-posters-tests` by default.

After deployment, verify a controlled submission is stored in the new table and that anonymous request reads and catalog writes remain unavailable. Live AWS persistence has not been tested by the fixture-based browser checks.

Implementation references: [Amplify authorization](https://docs.amplify.aws/gen1/react/build-a-backend/graphqlapi/customize-authorization-rules/) and [custom resolver slots](https://docs.amplify.aws/gen1/react/build-a-backend/graphqlapi/custom-business-logic/).
