# FGB Theaters

React/Vite public website with an Amplify Gen 2 backend for authentication, media storage, and poster purchase requests. The source migration is prepared on `codex/amplify-gen2`; the existing AWS production environment has not yet been transferred or redeployed.

Follow the [Amplify Gen 2 migration and AWS console runbook](docs/amplify-gen2-migration.md) to finish the cloud migration. It includes the verified pre-change backup, resource inventory, rehearsal, hosting setup, resource transfer, public-domain cutover, and rollback instructions. The existing Hosting app also serves the separate admin site and must remain available.

## Local development

```sh
nvm use
npm ci
npm run dev
```

Without `amplify_outputs.json`, the public catalog still works and purchase requests are disabled. Generate real outputs from the intended Gen 2 branch using `npm run backend:outputs -- --app-id APP_ID --branch BRANCH --profile PROFILE`. Keep `VITE_AWS_API_GATEWAY_URL` in your local `.env`; the external theater schedule producer is not managed by this repository.

## Verification and builds

```sh
npm test
npm run check:backend
npm run test:backend
npm run build:test
```

The backend tests synthesize CloudFormation locally without changing AWS. The test build uses synthetic configuration and writes to `.amplify/test-dist`; it is only for local browser verification. Use `npm run preview:test -- --host 127.0.0.1` to preview it. For production, `npm run build` requires real Gen 2 outputs and writes to `dist`.

`amplify.yml` deploys the backend and builds the website on a connected Amplify branch. Its deployment check requires the operator to finish the migration checkpoints before enabling the branch. Never run Gen 1 `amplify push` or `amplify publish` in this converted checkout.

The poster collection lives at `/posters`. See [poster catalog and request notes](docs/posters.md). `/admin` remains disabled; administration belongs to a separate project.
