# MotoIndex PH v1.9.1 launch-hardening patch

Applied August 25, 2026.

## Changes
- Added `.gitignore` protection for secrets, dependencies and build output.
- Updated the pre-patch Next.js baseline from 15.5.21 to 15.5.23; the August 26 security hold remains intentionally enforced.
- Added a 90-day model-source freshness window to public/indexable motorcycle surfaces and 30-day market-price refresh warnings.
- Expanded the protected admin data-health view with source/price refresh flags.
- Bounded `/api/finance` parameters and disabled caching for finance responses.
- Made the installment purchase price editable and seeded it from the displayed observed-market starting price instead of always using stored SRP.
- Labeled source-listed versus planning-estimated fuel economy directly in commute cost surfaces.
- Added a portable Prisma validation wrapper so `DATABASE_URL` remains optional while persistence is disabled.
- Extended production smoke tests with finance success/failure cases.
- Added `validate:launch-hardening` to the main validation chain.

## Remaining external launch gates
- Install the official Next.js 15.5 security release after it is published on August 26, regenerate `package-lock.json`, and run the full launch verification again.
- Set real production URL/contact/admin environment values.
- Run the deployed production smoke test against the real HTTPS origin.
