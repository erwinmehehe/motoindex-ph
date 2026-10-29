# Global model-first Price Philippines metadata and H1 alignment

Implemented October 29, 2026, in the MotoIndex motorcycle detail route.

## Rule

All **236 standard motorcycle detail URLs** use the exact same title and H1, with no brand prefix, year or marketing suffix:

```
<meta title> = <h1> = `${model.model} Price Philippines`
```

Examples: `Sniper 155 Price Philippines`, `NMAX V2 Price Philippines`, `BeAT Price Philippines`, `Classic 250i Price Philippines`.

There are **236 distinct model strings**, with no duplicates or missing model labels, so the model-only formula produces unique HTML titles. The original manufacturer identity still appears in body copy, links, structured data, and displayed breadcrumbs.

The previously reviewed eight model pages retain their tailored meta descriptions and hero intros, but their HTML titles lose the old `| Specs...` suffixes. For other models, the existing detailed SEO description is reused, with its primary keyword adjusted or introduced at the beginning. Both current and historical heroes use the same H1 helper, and the hero lede starts with the price keyword. Historical and availability-uncertain model status labels and existing price data remain intact.

Three VinFast electric model detail pages follow the same pattern: `Evo Price Philippines`, `Feliz II Price Philippines`, `Viper Price Philippines`. Their current price/battery/range content stays intact.

The four **generation-family hubs** (Aerox, NMAX, Click, ADV) are *not* single-model detail pages. They retain their separate generation-comparison metadata and H1s. Redirect-only paths are also excluded.

## Regression coverage

- Enforce 236 catalog models and unique exact-model titles without suffixes.
- Require route HTML title to use the same H1 helper as both current and historical hero templates.
- Require the exact keyword in snippets and in hero introduction text.
- Keep previous-generation price disclaimers, the original cited price references and the licensed R15 V3 hero photo.
- Ensure the three electric detail pages use the same model-first title/H1 rule.

No code in this change triggers production deployment. Merge after required GitHub Actions and Cloudflare preview checks pass; publish production only via the existing manually approved workflow.
