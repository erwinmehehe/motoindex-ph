import type { EntityMedia } from "./types";
import { entityMedia } from "./media";
import { generatedProductMedia } from "./generatedProductMedia";

const allRenderableMedia: EntityMedia[] = [...entityMedia, ...generatedProductMedia];

export function getRenderableMedia(entityType: EntityMedia["entityType"], entityId: string) {
  return allRenderableMedia.filter((asset) => asset.entityType === entityType && asset.entityId === entityId && asset.rightsStatus !== "pending");
}

export function hasRenderableProductMedia(entityId: string) {
  return allRenderableMedia.some((asset) =>
    (asset.entityType === "helmet" || asset.entityType === "tire" || asset.entityType === "topbox") &&
    asset.entityId === entityId &&
    asset.rightsStatus !== "pending"
  );
}
