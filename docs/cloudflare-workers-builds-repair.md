# Cloudflare Workers Builds: MotoIndex release and repair notes

## Observed failure, October 14, 2026

The external **Workers Builds: motoindex-ph** GitHub check reported failure on both the then-current `main` commit `4b8494d` and AEO draft PR #486 at `2402293`. At the same commits, the separate **Cloudflare Runtime Compatibility** GitHub Actions workflow built the OpenNext Worker and passed `wrangler deploy --dry-run` and Worker route QA. This does **not** establish the specific external failure, since Workers Builds logs and dashboard trigger configuration were not accessible from the GitHub connection.

GitHub dry-run (successful, before this fix, PR #486): `Total Upload: 20792.32 KiB / gzip: 3275.14 KiB`. Cloudflare's September 2026 limit is 64 MiB uncompressed across plans, so this measured bundle is below the published Worker size limit.

## Repository-side compatibility fix

- `.node-version` pins Cloudflare to Node 22.23.2, matching the Node 22 major version used in GitHub Actions, instead of Cloudflare's new Node 24 default.
- `wrangler.jsonc` uses a custom `build.command` to ensure `.open-next/worker.js` exists before Wrangler deploys. If OpenNext already ran, it is a no-op. Otherwise it runs the full `npm run cf:build`, including the framework build, because plain `next build` output lacks the standalone manifest required by OpenNext's `--skipNextBuild` mode.
- `cloudflare-runtime-compat.yml` now exercises the incomplete-build case in a clean PR checkout: plain `npm run build` followed by `wrangler deploy --dry-run`. The test is successful only when OpenNext produces a real Worker and local Worker route QA succeeds.

These repository changes may fix a missing-entrypoint failure, but do **not** override Cloudflare account-level authentication, Build trigger settings or previews.

## Required Cloudflare dashboard configuration

The repository's approved production release path is manual **Deploy MotoIndex Production to Cloudflare** GitHub Actions (`workflow_dispatch`), with release review and smoke checks. To prevent two systems from deploying the same `motoindex-ph` Worker:

1. Open Cloudflare **Workers & Pages > motoindex-ph > Settings > Builds** (may appear as **Settings > Build**).
2. Check Build History for the original failing build and note whether the error occurred during **Install**, **Build**, or **Deploy/Preview**; capture only sanitized error lines.
3. **Preferred:** Disable automatic production branch Builds and disable preview branch Builds, or disconnect the Git repository from Workers Builds, leaving the deployed Worker intact. Keep GitHub Actions as the sole approved production deployment path. Do not delete the Worker or its routes.
4. If the operator intentionally keeps Workers Builds enabled, verify the project root is `/` and the build command is **`npm run cf:build`** (not bare `npm run build`). For Git-triggered production builds, set the Cloudflare dashboard **Deploy command** to **`npx wrangler versions upload`** so a build produces a non-active Worker version rather than publishing to live traffic; reserve **`npm run cf:deploy:built`** for the separately approved manual GitHub Actions production job. Confirm the branch preview command and bindings match the account's configured Worker Previews mode and remain isolated. **Do not leave automatic `wrangler deploy` on main** while relying on GitHub's release gate.
5. Verify the Cloudflare build environment has Node 22 (the committed `.node-version` should select it) and only the required approved build-time `NEXT_PUBLIC_...` values. Keep production secrets in appropriate secure account bindings, never in GitHub or source files.
6. Re-run the failing Cloudflare build or create a new preview after confirming its trigger configuration. Review the latest GitHub Actions **CI**, **Cloudflare Runtime Compatibility**, and **Visual QA** on the exact PR head as well.
7. Only after review and successful checks, merge through the protected release process, dispatch the production deploy workflow manually, then run `BASE_URL=https://motoindexph.com npm run smoke:production` and confirm key page routes and access controls.

If Workers Builds continues to fail after the repository fix, its **first actual error line** is required to identify an environment, authentication, quota, dependency or permissions problem. A successful dry run cannot prove that a remote upload has succeeded.

## Automatic Git production build failsafe

MotoIndex additionally rejects Cloudflare Workers Builds jobs where the injected `WORKERS_CI=1` and `WORKERS_CI_BRANCH=main`, or the branch is missing. The guard is wired into npm's default `prebuild`, explicit `precf:build`, and the Wrangler OpenNext build hook. This ensures the usual repository-defined build paths cannot publish on an unmanaged production branch push. A deliberately successful **preview** build may still run on a non-production branch.

This code fails closed but is **not** proof of the Cloudflare account's build/deploy settings, and direct/unexpected commands may bypass it. Cloudflare Workers Builds production auto-deployment must still be disconnected or configured for non-active version uploads, with operator evidence, before PR merges. Manual GitHub Actions releases do not set `WORKERS_CI` and instead pass the protected-main + production-environment approval checks.

## Worker commands

- Build a Worker explicitly: `npm run cf:build`
- Check it without remote deployment: `npx wrangler deploy --dry-run`
- Existing controlled production release: GitHub Actions `Deploy MotoIndex Production to Cloudflare` → manual workflow dispatch

Sources:
- https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
- https://developers.cloudflare.com/workers/ci-cd/builds/build-image/
- https://developers.cloudflare.com/workers/wrangler/custom-builds/
- https://developers.cloudflare.com/changelog/post/2026-09-04-increased-worker-size-limit/
- https://opennext.js.org/cloudflare/howtos/dev-deploy
