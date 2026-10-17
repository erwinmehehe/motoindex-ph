# MotoIndex release controls — operator acceptance checklist (2026-10-17)

**Code-only change in this PR. No production deployment or account configuration occurs by merging this branch.**

## GitHub: owner or authorized administrator must configure

1. An **active** reviewed-main ruleset payload is checked in at `docs/github-main-protection-ruleset.json`. A repository administrator with **Administration: write** permissions can check out this PR branch and apply it using GitHub CLI (this GitHub connector itself cannot write rulesets):

   ```bash
   gh auth status
   gh api --method POST repos/erwinmehehe/motoindex-ph/rulesets --input docs/github-main-protection-ruleset.json
   ```

   Do this **once** after verifying a second person can review pull requests; rerunning POST could produce a duplicate. The payload enforces independent approval, current-head checks, no force-push or deletion, and no explicit bypass actors. Inspect the created active ruleset in **Repository > Settings > Rules > Rulesets**. The exact check-run context names are `build`, `browser-qa` and `validate` from GitHub Actions app ID `15368` (displayed in the Actions UI as CI / build, Visual QA / browser-qa, Cloudflare Runtime Compatibility / validate).
2. Require pull requests before changes to `main`, at least one **independent human review**, dismissal or refresh of outdated approvals, block force-pushes and deletions, and restrict bypasses/direct pushes.
3. The ruleset config requires exact current-commit GitHub Actions checks: `build`, `browser-qa`, and `validate` (with app ID `15368`). The Cloudflare runtime workflow now triggers for **every PR** against `main`, including docs-only changes; otherwise an ordinary docs-only PR would wait forever for a required check that never runs. Confirm these are the intended contexts in GitHub Settings and never weaken checks simply to force a merge.
4. Create the GitHub **production** Environment, require designated reviewers, and configure least-privilege deployment secrets and approved variables. Confirm the environment does not auto-approve its own initiator.
5. Verify `GET /repos/erwinmehehe/motoindex-ph/branches/main` now reports `protected: true`. That boolean alone is insufficient: review the actual rules in the GitHub settings UI, because this integration has no permission to read or edit branch protection.

## Cloudflare: independent account-level gate (must be confirmed before any merge)

1. Under **Cloudflare > Workers & Pages > motoindex-ph > Settings > Builds**, inspect the Git-connected Workers Builds pipeline. The GitHub external check currently runs separately from GitHub Actions.
2. **Disable automatic production deployments on `main`**. The preferred simple option is **Settings > Builds > Disconnect**, preserving the already deployed Worker and its routes. If keeping Git-connected builds, configure the production **Deploy command** to `npx wrangler versions upload` (upload a non-active version rather than deploying); verify this in Cloudflare's build history and do not use `wrangler deploy` for automatic builds. Disable or isolate preview builds if they use production bindings. This prevents a Git merge from bypassing manual deployment controls.
3. Inspect the actual recent build logs and check preview-vs-production targets; a successful `Workers Builds` check does *not* prove no automatic deployment can occur.
4. Set and check runtime Worker secret names as required by `scripts/verify-worker-binding-names.mjs`. Configure Cloudflare Access/MFA, Turnstile and WAF per issue #462. Never put secret values into issues or logs.
5. Preserve redacted screenshots or configuration exports showing triggers, environments and Access status. Require another person to sign off on the release gate before marking #462 complete.

## Release order

- Do **not** merge this PR or any other PR until the external Cloudflare automatic-production-deployment path is proven gated.
- Merge this small release-gate PR after current CI, Visual QA, Cloudflare runtime and reviewer approval.
- Re-run the check matrix after merge, then review #486 (SEO/AEO) at its latest head; #487 (CSV export) next. Both must be reviewed against a newly protected `main` branch.
- Keep #485 (affiliate database migration) draft until verified MotoIndex staging migration, backup/restore and merchant-link acceptance. Keep #459 draft until image reuse rights are cleared; keep #467 gated on #462/#466.
- Use **manual** `Deploy MotoIndex Production to Cloudflare` only after production Environment approval. Run expected-commit smoke checks and verify rollback.

## What this repository PR adds

- Manual deployment workflow runs only on `main` and through the `production` environment.
- `scripts/verify-production-release.mjs` rejects missing protection, moved SHA, or missing/failed exact-main push workflow checks. The gate runs both before build and immediately before deploy.
- `scripts/verify-worker-binding-names.mjs` verifies only the required binding *names*, not their values, and fails on missing names.
- Adds test coverage for these guardrails.
- Pins Cloudflare Node.js to 22.23.2, adds the Wrangler OpenNext missing-worker build fallback, and runs a clean-checkout Workers compatibility simulation. These changes are ported from the known-green #486 head and require fresh validation on this PR.
- The `WORKERS_CI` / `WORKERS_CI_BRANCH` fail-closed build guard rejects Git-connected `main` builds (including unknown branches) through `npm run build`, `npm run cf:build`, and Wrangler's OpenNext build hook. Explicit, human-reviewed GitHub Actions deployments run without `WORKERS_CI`. This is **defense in depth only**: an account-level deployment path that bypasses these build entrypoints would not be stopped, so Cloudflare trigger verification remains mandatory.

**Limit:** A repository workflow cannot itself configure Cloudflare Workers Builds triggers, GitHub admin branch rules, identity policies or a live mailbox; those require owner/operator access and independent evidence.
