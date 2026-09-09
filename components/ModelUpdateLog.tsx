import type { Motorcycle } from "@/lib/types";

/**
 * Page-level source/update logs are intentionally hidden from public pages.
 * Source links remain available in the relevant price, specification, media,
 * safety and maintenance sections instead of being repeated in a large footer block.
 */
export function ModelUpdateLog({ model: _model }: { model: Motorcycle }) {
  return null;
}
