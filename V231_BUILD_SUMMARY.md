# MotoIndex PH v2.3.1 build summary

## Release goal
v2.3.1 is a launch-readiness release rather than another public feature expansion. The current product surface is already broad enough to ship; the highest-value next step is making the release gate accurately report what is still blocking production and clearing the critical framework issue.

## Launch status command
Added `npm run launch:status`.

It reports three classes of findings:
- blockers: vulnerable framework baseline, package/lock drift, missing production origin/contact/admin credentials, malformed affiliate configuration;
- warnings: optional database/affiliate/analytics state, missing local `node_modules`, and the one-time npm SRI refresh state for newly published security packages;
- passes: checks that are already launch-safe.

The status command correctly treats `DATABASE_URL` as optional for the current seed-backed runtime. Prisma remains the future persistence contract, but `@prisma/client` is not imported by the running app yet.

## Lockfile gate fixed
`npm run verify` runs `npm run validate:lockfile` explicitly. This closes a release-check gap where a lockfile could exist while its exact root dependency versions had drifted from `package.json`.

For the security patch, the validator permits missing npm SRI metadata only for the exact `next@15.5.24` and `@next/env@15.5.24` registry tarball URLs. Every unchanged lockfile package still requires its integrity hash. This keeps the patch exact-pinned without inventing cryptographic values that the isolated sandbox cannot fetch.

## Next.js security blocker fixed
The project now pins **Next.js 15.5.24** and `@next/env` 15.5.24 in the lockfile. That clears the prior 15.5.23 framework-version launch blocker.

AVIF output remains disabled in `next.config.mjs` as defense in depth; WebP remains enabled.

The sandbox has no npm-registry connectivity, so the two newly published package records cannot receive their npm SRI values here. A one-command metadata refresh is included for the first networked build environment:

```bash
npm run refresh:security-lock
npm run validate:lockfile
npm ci
npm run verify:launch
```

If npm adds the SRI fields, commit the refreshed lockfile. No integrity hashes were fabricated.

## Documentation
`LAUNCH_CHECKLIST.md` reflects the patched 15.5.24 baseline, optional current-runtime database posture, optional affiliate monetization and the exact release/deployment gates.

## Validation
`validate:v231` is folded into `validate:all` to guard:
- launch-status coverage;
- strict lockfile validation in `verify`;
- current 15.5.24 security baseline;
- correct database/affiliate blocker classification;
- temporary AVIF defense in depth.
