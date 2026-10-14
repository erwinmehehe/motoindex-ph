# MotoIndex AEO + SEO publishing and quality SOP

## Scope and canonical owners

This workflow applies to the main buying-guide hub (`/recommendations`), every canonical `/recommendations/[slug]` guide, the editorial `/guides/[slug]` articles, `/ownership/[slug]` guides, used-motorcycle decision guides and original `/research` datasets. Motorcycle model entities remain at `/motorcycles/[make]/[slug]`; comparisons should link to them rather than duplicate their facts.

Search and AI answer visibility are outcomes to measure, not a reason to manufacture more URLs.

## Page publishing contract

1. **Answer the actual question up front.** Present an accurate, human-readable summary immediately after the title/hero. Usually two to four sentences, not filler to meet a word-count target. Use only checked model data, published price references or official rules. State when a value is a model-specific, variant-specific, illustrative or dataset statistic.
2. **Match the heading to the answer.** Question-led headings are useful when they correspond to genuine rider questions. Do not convert every heading mechanically; preserve clear comparison and methodology headings.
3. **Show how the answer was established.** Source link(s), last source-check date, published pricing scope, inclusion rules, and caveats must stay near the relevant information. A page-level "latest" date does not prove every model or dealer offer was checked on that date.
4. **Use visible evidence and useful comparisons.** Keep server-rendered price/spec/fit tables, sensible filters, and genuine examples. Never infer top speed from horsepower, real-world fuel consumption from a theoretical tank calculation, or ABS on a trim whose equipment is not confirmed.
5. **Make each URL do a distinct job.** Model entities own model pricing/specifications; comparison pages own pairwise differences; recommendation guides own buying shortlists; original research pages own aggregate statistics. Improve the canonical owner before considering a new keyword variation URL.
6. **Make related steps easy.** Guides should link to the relevant model records, the Finder, real pairwise comparisons, ownership tools, and related source-led articles where useful.
7. **Keep structured data identical to visible content.** FAQPage markup may be used for actual visible Q&A only; it does not guarantee rich results or AI citations. Article, BreadcrumbList, Dataset and Product data must each correspond to the page's real content and eligible page type. Do not fabricate seller inventory, offers, review counts or authors.
8. **Keep freshness honest.** Recheck manufacturer/agency/dealer material when changing a price, variant, registration rule or insurance requirement. Do not advance a source-check or article-modified date simply because the code deployed.
9. **Avoid repetitive or unsupported copy.** Follow `COPY_STYLE.md`. A buyer FAQ should answer that precise question, not return an unrelated total number of motorcycles.

## Weekly evidence-first growth cycle

- **Monday:** Export Search Console Web performance for the Philippines using query + page together (via the API; separate query and page exports cannot identify query-page ownership). Use 28-day periods for monitoring and compare matched periods, then inspect 3-month trends.
- **Prioritize:** Run `npm run seo:gsc-opportunities -- path/to/combined-query-page.csv --output artifacts/gsc-opportunities.md`. Review high-impression zero-click rows, striking-distance keywords, and possible cannibalization. The score is an internal heuristic; verify intent and the real SERP before acting.
- **Select three to five changes:** Fix an inaccurate answer, improve a current canonical page, update source-linked information, add a useful internal link, or publish genuinely missing research. Create a new URL only if the intent and answer differ materially from existing coverage.
- **Publish safely:** Run unit tests, TypeScript, lint, the project's SEO and public-trust validators, and the required production release preflight. Do not bypass manual deploy gates.
- **Measure:** Record clicks, impressions, CTR, positions, GSC Generative AI performance if available for this property, and verified citations from a repeatable set of motorcycle shopping prompts in ChatGPT and Perplexity. Include Finder interactions, comparison usage and qualified dealer referrals. No citation visibility is guaranteed.

## Review checklist before approving a new or updated article

- Does the first answer address the title without an invented fact or unspecified variant?
- Are all numerical claims tied to specific datasets, dates and named sources?
- Does every FAQ answer respond to its exact question? Does structured data mirror visible Q&A?
- Is there an obvious canonical owner, clear comparison/navigation path, and no competing thin duplicate?
- Are headings, tables, media, and source links usable in rendered HTML on mobile?
- Have changes passed the existing CI, content, technical and public-trust checks?
- Are measured outcomes recorded against the pre-change GSC baseline rather than inferred from position alone?

## Current rollout

This sprint adds lead-answer coverage for the 54 defined recommendation guides, 12 editorial guides and 5 ownership guides, plus the recommendation hub, the primary used-motorcycle decision pages and the three original research dataset pages. A new guide or dataset should extend the content maps and matching regression tests before launch. Product pages, accessory landing pages, electric hub sections and comparison routes should be audited as separate route families against the same contract before calling the entire domain complete.
