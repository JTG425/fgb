# FGB Amplify Gen 2 migration runbook

Prepared October 25, 2026 for `JTG425/fgb`, branch `codex/amplify-gen2`.

## Current status

The **project source has been converted; the AWS migration is not yet deployed**. No production stack was locked, refactored, deleted, or redeployed, and no DNS settings were changed. This runbook completes those steps with you supervising the AWS prompts.

The new `amplify/` files started with AWS CLI **14.5.1** code generation against a freshly pulled copy of the deployed `main` environment. Generation ran only in a temporary copy, with `--skip-validations` for this **local source draft**, because production remains unlocked and the current website changes are uncommitted. This is **not** evidence that the production migration prerequisites passed. Do not use that flag for the operational steps below. Repeat ordinary generation after the rehearsal and lock, and compare it using the supplied verifier.

The draft includes the previously undeployed poster models, request validation, Gen 2 frontend configuration, a real Vite Hosting build, and migration-specific fixes to generated storage permissions. `/admin` remains disabled in this project. The RTS schedule producer and separate admin project are outside this repository.

AWS labels the migration tooling Developer Preview. Follow the [official migration guide](https://docs.amplify.aws/react/start/migrate-to-gen2/migrate-existing-app/) alongside this project-specific runbook; stop on an unexpected resource change rather than accepting every prompt.

## Backup and resource inventory

The backup was created **before any project source changes**:

- ZIP: `backups/fgb-before-amplify-gen2-20261025-204151.zip`
- SHA-256: `9c2b14e3cbe940641dbf798935170ca86f02d09db5aa945d0a9d67f6ae35888a`
- Checksum file: the adjacent `.zip.sha256` file.
- Contents: 244 website/configuration files, including the latest poster work, local environment configuration, and Gen 1 backend sources. Reinstallable `node_modules`, Git history, and backup archives were excluded.
- ZIP integrity was checked. Keep it private: it includes local environment settings. `backups/` is excluded from Git.
- A working copy of the old backend is also retained in `backups/gen1-amplify-source/`.

This ZIP does not contain live DynamoDB records, S3 objects, or Cognito accounts. Perform the cloud backup checkpoint below before moving resources. Restoring the ZIP only restores local files.

| Item | Verified value |
| --- | --- |
| AWS account / region | `767397816314` / `us-east-1` |
| Existing Amplify app | `fgbtheaters`, ID `d5vhylij0llj8` |
| Gen 1 backend environment | `main` |
| Gen 1 root stack | `amplify-fgbtheaters-main-c850c` |
| Hosting method | Manual uploads; no connected repository or service role |
| Public Hosting branch | `production` — different from backend environment `main` |
| Existing AppSync API ID | `vdopupkg5rachke3tpp5i745kq` |
| Existing model table | `AddAnnouncement-vdopupkg5rachke3tpp5i745kq-main` |
| Existing S3 bucket | `fgbtheatersstoragec850c-main` |
| Existing Cognito pool | `us-east-1_3S4DAuOec` |
| Existing identity pool | `us-east-1:7ea9fe65-7607-425c-abb9-ff4a3ee78c4a` |
| Public domains | `fgbtheaters.com` and `www.fgbtheaters.com` → `production` |
| Separate admin domain | `admin.fgbtheaters.com` → `admin` in the existing Hosting app |
| Other Hosting branches | `main`, `staging` |

The existing stack was `UPDATE_COMPLETE` when inspected. The deployed API has only the announcement model; neither poster table exists there yet. The deployed announcement data source is **not versioned**, and its create resolver has **no sync configuration**. The CLI nevertheless flags the legacy `conflictResolution: { defaultResolutionStrategy: { type: "NONE" } }` configuration. Resolve this stale configuration through the Gen 1 CLI before the operational migration; do not ignore the assessment warning.

## 1. Prepare tools and separate working directories

Use Node 22 for this project:

```sh
cd /Users/joshuagolonka/Documents/GitHub/fgb
nvm install 22
nvm use 22
npm ci
npm test
npm run check:backend
npm run test:backend
npm run build:test
```

`build:test` writes a mock-configured build under `.amplify/test-dist`; **do not upload it**. `npm run build` deliberately fails until real Gen 2 outputs are available. `npm run dev` can show the bundled poster catalog before deployment, with requests unavailable.

Use the migration CLI pinned in this runbook (`npx --yes @aws-amplify/cli@14.5.1 …`); the previously installed global CLI was 12.14.3 and lacks these commands.

Make a separate operator checkout of the old project so a pull cannot overwrite the new poster work:

```sh
mkdir -p /Users/joshuagolonka/Documents/GitHub/fgb-gen1-operator
unzip /Users/joshuagolonka/Documents/GitHub/fgb/backups/fgb-before-amplify-gen2-20261025-204151.zip \
  -d /Users/joshuagolonka/Documents/GitHub/fgb-gen1-operator
cd /Users/joshuagolonka/Documents/GitHub/fgb-gen1-operator/fgb
python3 - <<'PY'
import json
from pathlib import Path
config = Path('amplify/.config/local-env-info.json')
settings = json.loads(config.read_text())
settings['projectPath'] = str(Path.cwd())
config.write_text(json.dumps(settings, indent=2) + '\n')
PY
npx --yes @aws-amplify/cli@14.5.1 pull --appId d5vhylij0llj8 --envName main
```

The Python step points the extracted project's saved configuration at the operator directory before pulling. Choose your AWS profile for the account above. A local-changes warning is expected in this extracted copy: allow the pull to replace it with the deployed backend. **Do not run this pull in the active Gen 2 project.**

Verify the AWS identity and baseline:

```sh
aws sts get-caller-identity --profile default
npx --yes @aws-amplify/cli@14.5.1 status
npx --yes @aws-amplify/cli@14.5.1 gen2-migration assess
```

If `default` is not the intended account, select the correct profile through Amplify configuration. Never paste AWS access keys into source code or Hosting environment variables.

For the stale conflict-resolution warning, run `npx --yes @aws-amplify/cli@14.5.1 update api`, select the GraphQL API, and disable conflict detection. Review and apply the resulting Gen 1 update **before locking**. Pull again and rerun `assess`. If the assessment still fails while the live API has no sync configuration, resolve that CLI issue before continuing; do not turn on DataStore or use skip-validation flags to get past it. This site's React code does not use DataStore. Check the separate admin project before altering any shared API behavior.

Initialize a local Git repository in the operator directory if it does not have one, add a private baseline commit, and confirm `git status --porcelain` is empty. The generator requires a clean tree. Do not publish `.env`, backups, or credential files.

## 2. Rehearse on an isolated Gen 1 clone

Do this before locking `main`. In the operator directory, run:

```sh
npx --yes @aws-amplify/cli@14.5.1 env add
npx --yes @aws-amplify/cli@14.5.1 push
```

Use a new lowercase environment name such as `gen2trial` (at most 10 letters). Confirm the resulting pool, identity pool, S3 bucket, and announcement table all have new physical IDs. Do not copy real customer contacts into the trial.

The website's `VITE_AWS_API_GATEWAY_URL` points at an external schedule producer and is not cloned by Amplify. It is read-only in this website. Any hardcoded table/bucket references in generated trial code must point to the trial resources, never the production inventory listed above.

On the trial, complete the official sequence: `assess`, `lock`, `generate`, deploy to an isolated Gen 2 branch or sandbox, exercise authentication/storage/data, `refactor`, enable the generated `postRefactor()` call, and redeploy. Review each proposed operation. The CLI-generated `amplify.yml` may contain only an empty placeholder page; use the Vite build configuration in this repository when testing the actual frontend.

A sandbox of **this** prepared project also allows testing the new poster API with fresh resources:

```sh
# Run from the active Gen 2 project, not the Gen 1 operator directory.
npm run backend:sandbox -- --once --profile default
```

This command deploys billable trial resources. It is not a local emulator and does not replace rehearsing the Gen 1 resource transfer. The production table mapping is restricted to the exact branch `codex/amplify-gen2`, so an ordinary sandbox does not import production announcement data. Do not set the mapping's branch name to `sandbox`.

## 3. Take cloud backups and freeze production changes

In the AWS console, select **US East (N. Virginia), us-east-1**:

1. Open **DynamoDB → Tables → AddAnnouncement-vdopupkg5rachke3tpp5i745kq-main → Backups**. Create an on-demand backup and wait until it is available. Record its ARN. If additional tables have been deployed since this inspection, back up those too and refresh the migration inventory.
2. Back up the contents of `fgbtheatersstoragec850c-main` using your existing S3/AWS Backup process, and verify the backup completed. If using AWS Backup for S3, enable S3 Versioning first, then use **AWS Backup → Protected resources → Create on-demand backup**, select S3 and this bucket, and use the appropriate S3 backup role. Record the recovery point. Turning on versioning alone does not create a complete independent backup. Follow the [S3 backup prerequisites](https://docs.aws.amazon.com/aws-backup/latest/devguide/s3-backups.html).
3. Record the existing Cognito pool/client/identity-pool IDs and configuration. Cognito passwords cannot be exported into the site ZIP; account preservation depends on transferring the existing resources, not replacing them with a newly created pool.
4. Coordinate a backend deployment freeze with whoever manages the separate admin project and the upstream AWS integration. Keep customer access to the old website working. Stop manual backend pushes and any pipelines that update the Gen 1 stack.
5. Return the operator checkout to `main` with `env checkout main`, pull, resolve all assessment findings, and commit the clean baseline. Save the baseline commit so you can return to the Gen 1 files after generation.
6. Run `npx --yes @aws-amplify/cli@14.5.1 gen2-migration lock` and review its retention/stack-policy plan. Confirm only the intended `main` environment is targeted.

Do not add broad `custom-roles.json` admin bypasses to the old API as a shortcut. The production announcement model currently uses API-key authorization, while the new poster endpoints use identity-pool IAM and have no public read path for customer information. Any legacy IAM compatibility change must be checked against the separate admin application's actual operations.

## 4. Revalidate the generated production definitions

From the clean, locked Gen 1 operator checkout, create a new local branch and run ordinary code generation:

```sh
git switch -c codex/gen2-validated
npx --yes @aws-amplify/cli@14.5.1 gen2-migration generate
```

This overwrites `amplify/` in the **operator checkout**, not the active project. Then, from the active project:

```sh
cd /Users/joshuagolonka/Documents/GitHub/fgb
node scripts/verify-gen2-generation.mjs \
  /Users/joshuagolonka/Documents/GitHub/fgb-gen1-operator/fgb/amplify
```

This compares the fresh AWS-generated files to the baseline used for this migration draft. If they match, retain the prepared implementation in this project. If they differ, reconcile the named files before enabling deployment. Do not copy the generated folder wholesale over this project: it would remove the new poster schema, request validation, and the storage corrections.

Enabling S3 Versioning for the backup will intentionally change the generated storage file. Preserve that change by adding `s3Bucket.versioningConfiguration = { status: 'Enabled' };` in this project's storage `applyEscapeHatches()` function, then review the remaining diff and rerun the backend checks. Do not undo a backup setting just to make the baseline comparison pass.

Review these intentional additions to the generated baseline:

- `amplify/data/schema.graphql` contains all three models. Only `AddAnnouncement` maps to an existing table; the two poster tables are new. The mapping branch is exactly `codex/amplify-gen2`.
- `poster-request-validation.ts` inserts the existing VTL validation before the request authorization/data pipeline. No request query, update, delete, or subscription is generated.
- New model tables have retention policies. The existing announcement table is imported and retained.
- `amplify/storage/resource.ts` sanitizes the branch label, preserves identity-scoped private access, and restores direct `public/*` media reads and the existing CORS configuration. Its `postRefactor()` still targets the original bucket.
- Auth retains username sign-in, email verification, guest identities, and the existing password policy. No new admin route or sign-up UI was added.

Keep `// postRefactor();` commented in `amplify/backend.ts` for the first deployment.

## 5. Connect a new Amplify Hosting app — AWS portal

The existing app has **manual hosting** and no Git connection. Use a new Git-connected app for Gen 2; keep the existing app operational for production and the admin site.

1. Review the changes on `codex/amplify-gen2`, commit them, and push that branch to `https://github.com/JTG425/fgb`. The work in this session was not pushed.
2. Open **AWS Amplify → All apps → Create new app** (wording may be “Deploy an app”). Choose **GitHub**.
3. Authorize repository access when prompted, select **JTG425/fgb**, then select **codex/amplify-gen2**. Name the new app, for example, `fgbtheaters-gen2`.
4. Confirm the build uses the checked-in **amplify.yml**, frontend output directory **dist**, and **Node 22**. It runs `ampx pipeline-deploy` before building the actual Vite application. Do not use a manual ZIP deployment or the generator's placeholder `index.html` build.
5. In the setup's service-role section, create or select the Amplify backend deployment role with the supported **AmplifyBackendDeployFullAccess** policy and Amplify service trust. Use the console's role setup; do not use personal access keys as build variables. Resolve any deployment-permission error through that role.
6. Under **Hosting → Environment variables** (or **App settings → Environment variables**), copy the public website's `VITE_*` values from your local `.env`/current build setup, especially **VITE_AWS_API_GATEWAY_URL**. Keep the existing schedule endpoint. Copy other public map/integration configuration used by this site as well. These values are compiled into browser JavaScript; they must not contain server credentials.
7. Only after steps 2–4 of this runbook are complete, add **FGB_GEN2_MIGRATION_READY=true** for this reviewed branch. Without it the backend build stops intentionally. This value is your acknowledgment of the completed checkpoints; it does not perform an AWS audit.
8. Save and deploy. Record the **new app ID**, branch preview URL, and backend root CloudFormation stack name. They will differ from the existing app ID.
9. Open **Hosting → Rewrites and redirects → Edit**. Add the rules in `docs/amplify-spa-rewrites.json`: the existing apex-to-`www` redirect followed by the SPA 200 rewrite. This lets direct visits to `/posters?page=2` reach React while static assets retain their own URLs. The old app also contains an unrelated `joshuagolonka.com` redirect; it is not part of this public theater app's new configuration.
10. Use the branch's Amplify preview URL for testing. Do not move `fgbtheaters.com`, `www`, or `admin` yet.

If setup started a build before you entered the ready variable, the intentional deployment-check failure is expected. Finish the prerequisites, set the variable, and redeploy the branch.

## 6. Validate the new backend before transferring resources

Download outputs into the active project, using the **new** app ID:

```sh
npm run backend:outputs -- --app-id NEW_GEN2_APP_ID --branch codex/amplify-gen2 --profile default
npm run build
```

`amplify_outputs.json` is generated, ignored by Git, and environment-specific. Do not copy old Gen 1 configuration into that file or commit sandbox outputs. Hosting generates its own outputs during deployment.

Check the actual preview environment:

1. Confirm Capitol and Paramount schedules, dates, theater selection, slideshow, and supplied ticket links still work. Do not complete a ticket purchase as a test.
2. Check catalog count, public photos, searching, sorting, pagination, details, and the unavailable-photo fallback.
3. Submit one clearly labeled test request using non-customer details. In **DynamoDB → Tables**, locate the new PosterRequest table from the branch's CloudFormation resources and verify the item, `NEW` status, and server timestamps. Verify the form reports service failures without claiming success.
4. Verify anonymous and ordinary signed-in clients cannot list/get/update/delete request contacts, mutate listings, or subscribe to requests. The local tests check the generated operation surface; this step checks deployed authorization.
5. In the isolated preview, exercise sign-in/sign-out and storage with a disposable test account through an authorized test client. Verify guests can read public media, guests cannot upload/delete, and private files cannot be read by another identity. The public website intentionally has no admin or login route.
6. Check that the **announcement table name is the original table**, while the new preview still has temporary Cognito and S3 resources. Do not perform announcement writes during testing: that table is shared with Gen 1 immediately.
7. Test refreshing `/posters?page=2` and a poster detail URL directly. Confirm `/admin` still redirects away from the public site's disabled route.

## 7. Transfer resource ownership, then redeploy

1. In **CloudFormation → Stacks**, find the new branch's root stack using the new Amplify app ID and branch name. Copy the full **root stack name**, not a nested auth/storage stack.
2. Return the operator directory to its saved **Gen 1 baseline** branch/commit. Pull `main` again if required by the CLI, keeping the production deployment freeze in effect.
3. Run the interactive transfer from that Gen 1 directory:

```sh
npx --yes @aws-amplify/cli@14.5.1 gen2-migration refactor --to NEW_GEN2_ROOT_STACK_NAME
```

Review every proposed mapping. The original pool/identity pool/storage resources must move to the intended new stacks. Resolve validation failures rather than forcing them. Keep the generated `.amplify/gen2-migration/refactor.operations/` audit files and holding stacks.

4. After successful refactoring, return to the active Gen 2 project. In `amplify/backend.ts`, change the final `// postRefactor();` to `postRefactor();`. Leave the function itself intact. Commit and push this change to the same branch.
5. Wait for the new Hosting backend and frontend deployment to finish. This refreshes outputs to the transferred resources. Keep the call enabled for future deployments unless you roll back the refactor.
6. Regenerate local outputs using the new app ID/branch and repeat the preview checks. Confirm the pool, identity pool, and bucket IDs now match the original inventory. Verify old account sign-in with the real admin operator, without requesting or sharing their password.
7. Check that the existing separate admin site still signs in and can use its existing storage paths. It may retain old config during the coexistence period; its eventual API/config upgrade belongs to that separate project.

## 8. Move only the public domains — AWS portal

Current mapping: apex and `www` use the old app's `production` branch; `admin` uses its `admin` branch. **Do not delete the old app or its entire domain association.**

1. Record the current DNS records and Amplify domain mappings for all three hostnames. Choose a cutover window; cross-app hostname reassociation and certificate/DNS verification can cause temporary interruption.
2. In the old app, open **Hosting → Custom domains** (older consoles: **App settings → Domain management**) and edit `fgbtheaters.com`. Remove only the apex and `www` associations, retaining **admin → admin**. Save and wait for the change to complete.
3. In the new app, choose **Custom domains → Add domain**, enter `fgbtheaters.com`, and assign only the apex and `www` to **codex/amplify-gen2**. Do not add `admin` here.
4. Complete the certificate and DNS instructions shown by Amplify. With Route 53, review the proposed record changes; with an external DNS provider, copy the exact validation and routing records from the console. Preserve the `admin` records and its certificate validation records.
5. Wait for **Available**, then test HTTPS on the apex, `www`, and `admin` in a fresh browser. Verify deep links, media, schedules, and a controlled poster request again.
6. If the console reports `CNAMEAlreadyExistsException`, check that the **same hostname** is no longer attached to the previous distribution. Do not remove the admin hostname to work around a conflict. See [AWS custom-domain troubleshooting](https://docs.aws.amazon.com/amplify/latest/userguide/troubleshooting-custom-domains.html).

If the portal does not allow retaining the admin-only association, stop the domain move and resolve the split with AWS Support. The working Gen 2 preview can stay online while the existing public/admin domains continue serving from the old app.

## Rollback and eventual cleanup

- **Before refactor:** keep serving the old app. If abandoning the migration, use `gen2-migration lock --rollback` from the Gen 1 checkout before resuming Gen 1 updates.
- **After refactor:** restoring the ZIP or switching Git branches does not restore resource ownership. From the Gen 1 checkout, use `gen2-migration refactor --to NEW_GEN2_ROOT_STACK_NAME --rollback`. If you enabled `postRefactor()`, comment the call again for the reverted Gen 2 deployment. Follow the official rollback sequence to unlock and restore the Gen 1 deployment; inspect the plan before any forced push.
- **After domain cutover:** restore the recorded public hostname associations/DNS through the same cross-app process if needed. Leave admin routing intact.
- Do not decommission Gen 1 while the separate admin project or another integration still uses its APIs/roles. Keep the old Hosting app because it serves `admin.fgbtheaters.com`.
- Do not use `amplify env remove` or directly delete the old backend stacks as cleanup. Once all consumers are migrated, follow the official `gen2-migration retain` procedure and inspect each retained resource before removing anything. Holding stacks support rollback and must remain until that window closes.
- The local Gen 1 `dev` environment and old Hosting `main`/`staging` branches were not migrated or removed. Inventory their users before separately migrating or retiring them; a shared source-code conversion does not transfer every deployed environment automatically.

## Validation performed in this checkout

- TypeScript checks on the Gen 2 backend.
- Local CloudFormation synthesis with assertions for the imported announcement table, retention, request-only writes, listing-only reads, username/guest identity settings, public media reads, and owner-scoped private storage.
- Separate synthesis checks confirmed that an ordinary sandbox creates fresh tables and the post-refactor definition preserves the original storage bucket name.
- Frontend unit tests and a Vite test-mode build.
- Browser tests with synthetic AWS responses covering catalog interactions, request errors/retries, duplicate-submit protection, stock overrides, outages, mobile themes, focus, and the disabled admin route.

These checks do not establish live persistence, successful resource transfer, or a completed domain cutover. The live acceptance steps above are still required.

Additional references: [Gen 2 feature coverage](https://docs.amplify.aws/react/start/migrate-to-gen2/feature-matrix/), [configuration outputs](https://docs.amplify.aws/react/reference/amplify_outputs/), [storage authorization](https://docs.amplify.aws/react/build-a-backend/storage/authorization/), [Hosting rewrites](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html), and [CloudFormation resource refactoring](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stack-refactoring.html).
