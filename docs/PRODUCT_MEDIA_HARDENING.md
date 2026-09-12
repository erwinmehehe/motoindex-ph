# Product media hardening

MotoIndex keeps verified product imagery local at runtime while preserving the original source URL and source page for provenance.

## Safety rules

- Existing localized media is preserved when an upstream manufacturer or merchant source is temporarily unavailable.
- Backfill jobs only attempt products that do not already have a usable localized media record.
- Newly discovered images are rejected when the same upstream image or identical bytes are assigned to multiple products.
- Product pages without a verified exact image use a first-party verification placeholder instead of a guessed or generic product image.
- The media safety validator requires the established generated-media baseline and the localized LS2 set to remain present.
- Source-specific recovery scripts may add images, but source failures never delete already verified media.

## Release gate

Product-media changes must pass media safety validation, exact-media validation, dependency audit, TypeScript checking, the production Next.js build, normal CI, visual QA, and the pull-request media coverage audit before merge.
