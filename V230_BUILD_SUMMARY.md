# MotoIndex PH v2.3.0 build summary

## Release blockers fixed

### Production affiliate redirects
`/go` was incorrectly included in the middleware prototype deny-list. In production that caused the middleware to return its own 404 before the affiliate route handler could decide whether to fail closed or redirect.

v2.3.0 removes `/go` from `prototypePrefixes` while retaining `/go/:path*` in the matcher. Affiliate routes therefore retain their intended behavior:

- missing/unapproved config -> route-owned 404 with no-store/noindex
- configured approved destination -> route-owned 307 redirect

`validate-v221.mjs` and `validate-v230.mjs` both guard against putting `/go` back in the prototype deny-list.

### Validator integrity
Machine-specific TypeScript imports were removed from the validator suite. `scripts/load-typescript.mjs` now resolves TypeScript in this order:

1. local project dependency
2. global installation discoverable through `NODE_PATH` or `npm root -g`
3. clear validation failure

The two validators that previously swallowed TypeScript load errors now call this fail-loud loader. Windows-sensitive relative-path comparisons are normalized before comparing with POSIX source literals.

The complete `validate:all` chain passes after deleting local `node_modules`, proving the global fallback works on a clean source tree.

### Production environment example
`.env.example` again includes:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `DATABASE_URL`
- `NEXT_PUBLIC_ANALYTICS_CAPTURE_SEARCH_TERMS=false`
- analytics IDs
- unified + legacy affiliate maps

## Helmet Finder

New canonical route: `/gear/helmets/finder`

Filters:

- budget
- helmet type
- riding use
- brand
- listed size
- intercom provision
- Pinlock/sun-visor feature
- certification evidence

The Finder uses verified helmet records only, keeps filter state in the URL, supports copying the current finder link, shows real product imagery, and allows up to three helmets to be selected for comparison. Use-case ranking is explained with reason chips and does not present a fake safety score.

## Helmet comparison

New workspace: `/gear/helmets/compare?a=<id>&b=<id>&c=<id>`

The comparison includes real product images and side-by-side:

- observed price
- helmet format
- sizes listed
- weight where published
- shell
- visor equipment
- intercom provision
- certification evidence
- last checked date
- product-detail links
- configured Shopee / Involve Asia offer buttons

The route is `noindex` and intentionally omitted from sitemaps; the canonical Finder is added to the gear sitemap. This avoids generating indexable thin comparison permutations.

## Validation

Passing on a clean tree with no local dependencies:

- full `npm run validate:all` chain (30 checks/commands)
- v2.3 production affiliate middleware regression
- portable TypeScript-loader checks
- deployment env coverage checks
- Helmet Finder / comparison checks
- 50-model data validation
- 30/30 verified public gear-product media gate
- internal-link audit: 75 page route patterns, 135 source files, no broken literal/template routes or static indexable orphans

## Environment limitation

A fresh `npm ci` attempt in this sandbox timed out and left only empty package directories, so dependency-backed `npm run typecheck` / `next build` could not be independently rerun here. The partial `node_modules` directory was removed before packaging. Source-level TypeScript transpilation is now fail-loud and all project validators pass cleanly; CI/deployment should still run `npm ci && npm run typecheck && npm run build` as the final dependency-backed release gate.
