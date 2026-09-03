# MotoIndex entity image standard

MotoIndex uses one canonical primary image per entity. Product/model pages may add galleries later, but cards, recommendations, compare pages, search, and entity heroes all resolve to this single primary record first.

## Primary-image standard

- **Aspect ratio:** 1:1.
- **Canonical canvas:** 1200 × 1200 px maximum/output size.
- **Background:** solid white (`#fff`). Never use the old gray product canvas.
- **Fit:** contain the complete motorcycle/product inside the square canvas; do not crop wheels, helmet shells, boxes, or tires to fill the frame.
- **Canonical source format:** WebP at quality 86.
- **Browser delivery:** WebP remains enabled. AVIF is intentionally deferred while the existing Next.js image-security gate keeps it disabled; enable it only after that gate is deliberately cleared in a dependency-verified release.
- **One primary per entity:** exactly one `role: "primary"` media record for each entity.
- **Filename:** lowercase, descriptive, kebab-case and stable, e.g. `honda-adv-160.webp`, `yamaha-aerox-v3.webp`, `kyt-tt-course.webp`. Include a year/version only when it is part of the actual entity/generation; do not add a guessed model year solely for SEO.
- **Local path:** `/media/<entity-group>/<filename>.webp`.
- **Alt text:** identify the actual entity and, when useful, the visible color/type. Avoid keyword stuffing and generic text such as “product image”.
- **Provenance:** retain the original checked image URL, source page, rights holder, and checked date in the media record even after the derivative is self-hosted.

## Directory layout

```text
public/media/motorcycles/
public/media/helmets/
public/media/tires/
public/media/top-boxes/
```

## Sync workflow

`npm run media:sync` downloads the checked upstream image for each media record and generates the standardized 1200 × 1200 white-canvas WebP derivative. Existing local files are kept unless `--force` is supplied.

Useful commands:

```bash
npm run media:sync
npm run media:sync -- --only=honda-adv-160
npm run media:sync -- --force
npm run validate:media
MEDIA_STRICT_LOCAL=1 npm run validate:media
```

The normal validator allows migration-time remote fallbacks so an incomplete local sync does not blank the site. The strict form must pass before remote image fallbacks and `remotePatterns` are removed.

## Rights and source handling

Self-hosting changes delivery, not provenance or usage rights. Keep the source/rights metadata attached to every derivative. Do not silently replace a checked entity image with an unrelated marketplace image merely to fill a slot.
