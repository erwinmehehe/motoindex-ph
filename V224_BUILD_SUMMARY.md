# MotoIndex PH v2.2.4 — Navigation continuity

## What was checked
- All rendered pages use the single `app/layout.tsx` root chrome.
- No nested `layout.tsx` files replace the header or footer on public sections.
- Model pages add a sticky model subnav only as a secondary layer under the global header.
- API, sitemap, robots and `/go/*` affiliate redirect endpoints intentionally do not render site chrome because they are not pages.

## Fixes
- Added pathname-aware active section highlighting across desktop and mobile navigation.
- The active state follows nested routes, so `/motorcycles/.../price` still highlights Motorcycles, `/gear/...`, `/tires/...` and `/accessories/...` highlight Gear, and ownership/compare/commute/guides remain visually anchored.
- Search and Shortlist receive matching active states.
- Native `Explore` and mobile `<details>` menus now close immediately when a link is selected and again after pathname changes. This prevents a persistent root layout from carrying an open menu onto the next route.
- Added `validate:v224` to prevent nested layout/header drift and verify active/menu-reset behavior.

## Result
The primary site navigation is one continuous global component across all UI pages. Section-specific subnavigation can appear below it but never replaces it.
