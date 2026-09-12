import type { EntityMedia } from "./types";

// Populated by scripts/backfill-product-media.mjs from checked product source pages.
// Keep this separate from the hand-curated media registry so automated image
// backfills can be regenerated without rewriting editorial media records.
export const generatedProductMedia: EntityMedia[] = [];
