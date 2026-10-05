import { EntityMedia } from "./EntityMedia";

export function ReviewedCatalogArt({ entityId, entityType = "motorcycle" }: { entityId: string; entityType?: "motorcycle" | "helmet" }) {
  return <div className="reviewed-catalog-art" aria-hidden="true"><EntityMedia entityType={entityType} entityId={entityId} showCredit={false} fallback={null} /></div>;
}
