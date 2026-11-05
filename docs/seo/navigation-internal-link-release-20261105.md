# MotoIndex navigation and internal-link release checklist
Date: 2026-11-05

## Scope
- Desktop menu groups: Motorcycles, Compare, Finder, Buying Guides, Gear, Ownership & Tools.
- Mobile navigation: finder/compare/canonical hubs first; brands and topic sections in accessible accordions.
- Use real canonical buying-guide and scooter URLs rather than hub-only fragments.
- Footer links to core buying, used-bike, helmet, fitment, dealer, service and ownership hubs.
- Model-page related research links prioritize curated comparisons and verified alternatives ahead of redundant self-anchors.
- Editorial guide related links include context-appropriate hub destinations, deduplicated.
- Eliminate the nested HTML main landmark in the recommendations hub.
- Static navigation route and rendered-site sampling scripts.

## Explicitly out of scope
Do not change quote CTAs, My Garage or other disabled-service behavior in this PR. The rendered HTTP audit intentionally excludes unavailable private or quote-service URLs. Their separate availability work remains independent.

## Release validation
1. Run `npm run check:links` and `npm run check:legacy-links`.
2. Run `npm run validate:all`, `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run test:e2e`, and `npm run build`.
3. Inspect header/dropdowns at desktop 1440px and 1024px, mobile 768px, 390px and 320px. Verify no horizontal scrolling, unclipped flyouts, functional keyboard navigation, ESC close and visible focus.
4. Inspect navigation from Homepage, Motorcycle Hub, PCX 160 or other verified model, Buying Guides, Helmet Hub, Ownership Hub and an editorial guide.
5. For a running preview or production deployment, run `BASE_URL=https://YOUR_DEPLOYMENT npm run audit:rendered-links`. Optional `CRAWL_LIMIT=250` and `AUDIT_OUTPUT=report.json`. The script reports HTTP errors, canonical conflicts, apparent click depth and zero-inbound pages **within the sampled graph**.
6. The rendered audit is a sample and cannot conclusively establish sitewide orphans. Run an unrestricted authenticated crawl plus URL-level Google Search Console export before declaring complete crawl coverage.
7. Verify that no new legacy recommendation route redirects or noindex pages are promoted by the nav; ensure the publication gate for a newly added page remains unchanged.
8. Post-launch: retain a baseline and compare GSC query + landing-page clicks, impressions, CTR, indexing and click paths after recrawl. Do not promise ranking improvements.

## Acceptance
- All new navigation and footer links resolve directly to intended public canonical pages.
- Priority topic pages have meaningful inbound links from homepage, navigation, related models and/or topic hubs.
- The full brand list is available but does not bury the primary mobile actions.
- Related model links expose curated comparisons, available alternatives and relevant support topics.
- Automated link checks remain part of CI, and the production link crawl is available on demand.
- The existing site layout, page copy, indexing quality gates, quote/Garage behavior and product data remain unchanged.
