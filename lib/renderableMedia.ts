import type { EntityMedia } from "./types";
import { entityMedia } from "./media";
import { generatedProductMedia } from "./generatedProductMedia";

const allRenderableMedia: EntityMedia[] = [...entityMedia, ...generatedProductMedia];
const SUPPRESSED_MEDIA_IDS = new Set([
  // This asset resolves to an unrelated Suzuki gallery photo rather than a Raider PRO product image.
  // Keep the provenance record in media.ts, but do not show it until a correct product image is verified.
  "suzuki-raider-pro-manufacturer",
  // The dealer image has a baked-in gray studio background that breaks the shared product stage.
  // Fall back to the neutral motorcycle placeholder until a clean verified Primavera asset is available.
  "vespa-primavera-150-editorial"
]);
const PRODUCT_PLACEHOLDERS = {
  motorcycle: "/media/placeholders/motorcycle.svg",
  helmet: "/media/placeholders/helmet.svg",
  tire: "/media/placeholders/tire.svg",
  topbox: "/media/placeholders/topbox.svg"
} as const;

type ProductEntityType = keyof typeof PRODUCT_PLACEHOLDERS;

function isRenderableAsset(asset: EntityMedia) {
  return asset.rightsStatus !== "pending" && !SUPPRESSED_MEDIA_IDS.has(asset.id);
}

function isProductEntityType(entityType: EntityMedia["entityType"]): entityType is ProductEntityType {
  return entityType === "motorcycle" || entityType === "helmet" || entityType === "tire" || entityType === "topbox";
}

function productPlaceholder(entityType: ProductEntityType, entityId: string): EntityMedia {
  const label = entityType === "motorcycle" ? "Motorcycle" : entityType === "topbox" ? "Top box" : entityType === "tire" ? "Tire" : "Helmet";
  return {
    id: `${entityType}-${entityId}-verification-placeholder`,
    entityType,
    entityId,
    role: "primary",
    src: PRODUCT_PLACEHOLDERS[entityType],
    alt: `${label} product image placeholder`,
    width: 1200,
    height: 1200,
    rightsStatus: "first-party",
    rightsHolder: "MotoIndex PH",
    sourceLabel: "MotoIndex PH product placeholder",
    lastChecked: "2026-09-16"
  };
}

export function getRenderableMedia(entityType: EntityMedia["entityType"], entityId: string): EntityMedia[] {
  const exact = allRenderableMedia
    .filter((asset) => asset.entityType === entityType && asset.entityId === entityId && isRenderableAsset(asset))
    .sort((a, b) => {
      if (a.role === b.role) return a.id.localeCompare(b.id);
      return a.role === "primary" ? -1 : 1;
    });
  if (exact.length) return exact;
  if (isProductEntityType(entityType)) return [productPlaceholder(entityType, entityId)];
  return [];
}

export function hasRenderableProductMedia(entityId: string) {
  return allRenderableMedia.some((asset) =>
    (asset.entityType === "helmet" || asset.entityType === "tire" || asset.entityType === "topbox") &&
    asset.entityId === entityId &&
    isRenderableAsset(asset)
  );
}
