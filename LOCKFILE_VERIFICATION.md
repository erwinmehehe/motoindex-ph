# Lockfile verification — 2026-08-25

MotoIndex PH v2.0.1 includes an npm v3 `package-lock.json` for the exact dependency versions in `package.json`.

## Why the lockfile was assembled this way

The execution sandbox used for this release can run npm but cannot resolve or download from `registry.npmjs.org`. Rather than create placeholder hashes or relax dependency pins, the lockfile was assembled from the exact published package metadata for the pinned dependency graph, including resolved npm tarball URLs and published integrity hashes.

## Verification completed

- npm 10.9.2 / Node 22.16.0 Arborist successfully loads the virtual dependency tree.
- 55 total lockfile package records including the root record; 54 dependency package records.
- All eight direct production/development dependencies resolve to their exact pinned versions.
- Arborist reports zero broken dependency edges.
- Every non-root package record contains a version, resolved tarball URL, and integrity hash.
- `npm ci --offline --ignore-scripts` accepts the lockfile and proceeds to package retrieval; it stops with `ENOTCACHED` because the sandbox has no cached package tarballs. It does not report an npm lockfile/package.json mismatch.
- `npm run validate:lockfile` checks package/lock synchronization without network access.
- The complete MotoIndex `validate:all` suite passes with the lockfile present.
- Launch preflight no longer reports a missing npm lockfile.

## Important next dependency step

The Next.js 15.5 security release scheduled for 2026-08-26 will require changing the pinned `next` version. When that patched version is installed, regenerate `package-lock.json` with normal registry access and commit the regenerated lockfile before production deployment.

A compiled TypeScript/Next.js build is not claimed from this sandbox because the dependency tarballs cannot be downloaded here.
