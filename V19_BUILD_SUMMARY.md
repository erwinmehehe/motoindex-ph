# MotoIndex PH v1.9 — commuter + affordability release

Date: 2026-08-25

## Built

- New `/commute` Philippines-first hub focused on traffic, affordability and everyday motorcycle use.
- New commute-cost calculator with motorcycle selector, daily round-trip distance, workdays, gasoline input, parking and maintenance reserve.
- New affordability calculator that lets the user choose their own take-home-pay share, running-cost reserve, down payment, APR and term, then surfaces current motorcycles below the modeled ceiling.
- Four data-backed commute guides: heavy traffic, under ₱80K, delivery/work riding and frequent passenger commuting.
- Rainy-season commuting checklist with explicit no-wading-depth/no-flood-ready safety boundary.
- Finder now includes daily round-trip distance and shows a monthly fuel + maintenance planning estimate on each result.
- Site search understands heavy-traffic and delivery-rider intent and indexes the new commuter tools/guides.
- Every current motorcycle detail page now includes a daily commute snapshot and link to the route-cost calculator.
- Homepage, header, footer and sitemap now expose the commuter cluster.
- Launch preflight now requires a Next.js 15.5 patch newer than the current pre-security-release 15.5.23 baseline after the scheduled 2026-08-26 critical patch, instead of accepting any version newer than 15.5.21.
- Price history remains excluded by request.

## What the commuter scores do not claim

They do not estimate lane-filtering speed, route travel time, crash risk, flood/wading capability, delivery-platform eligibility or measured passenger comfort. Scores are ranking aids using fields already stored in MotoIndex.

## Production gate

Source validation can run in this archive. A real deployment still requires registry access, a generated/committed npm lockfile, installation of the post-2026-08-26 patched Next.js 15.5 release, production environment values, a clean dependency-backed build and production smoke testing.
