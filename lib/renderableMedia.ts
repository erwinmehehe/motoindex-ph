import type { EntityMedia } from "./types";
import { entityMedia } from "./media";
import { generatedProductMedia } from "./generatedProductMedia";

const allRenderableMedia: EntityMedia[] = [...entityMedia, ...generatedProductMedia];
const PRODUCT_PLACEHOLDERS = {
  helmet: "/media/placeholders/helmet.svg",
  tire: "/media/placeholders/tire.svg",
  topbox: "/media/placeholders/topbox.svg"
} as const;

type ProductEntityType = keyof typeof PRODUCT_PLACEHOLDERS;

function isProductEntityType(entityType: EntityMedia["entityType"]): entityType is ProductEntityType {
  return entityType === "helmet" || entityType === "tire" || entityType === "topbox";
}

function productPlaceholder(entityType: ProductEntityType, entityId: string): EntityMedia {
  const label = entityType === "topbox" ? "Top box" : entityType === "tire" ? "Tire" : "Helmet";
  return {
    id: `${entityType}-${entityId}-verification-placeholder`,
    entityType,
    entityId,
    role: "primary",
    src: PRODUCT_PLACEHOLDERS[entityType],
    alt: `${label} product image verification in progress`,
    width: 1200,
    height: 1200,
    rightsStatus: "first-party",
    rightsHolder: "MotoIndex PH",
    sourceLabel: "MotoIndex PH verification placeholder",
    lastChecked: "2026-09-12"
  };
}

export function getRenderableMedia(entityType: EntityMedia["entityType"], entityId: string): EntityMedia[] {
  const exact = allRenderableMedia
    .filter((asset) => asset.entityType === entityType && asset.entityId === entityId && asset.rightsStatus !== "pending")
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
    asset.rightsStatus !== "pending"
  );
}
