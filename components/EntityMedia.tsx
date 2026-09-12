import type { ReactNode } from "react";
import Link from "next/link";
import { SafeEntityImage } from "@/components/SafeEntityImage";
import { getRenderableMedia } from "@/lib/renderableMedia";
import { SourceRef } from "@/components/SourceRef";
import { isCompetitorSource } from "@/lib/competitors";
import type { EntityMedia as EntityMediaRecord } from "@/lib/types";

type Props = {
  entityType: EntityMediaRecord["entityType"];
  entityId: string;
  fallback: ReactNode;
  className?: string;
  priority?: boolean;
  sizes?: string;
  linkHref?: string;
  showCredit?: boolean;
};
export function EntityMedia({ entityType, entityId, fallback, className, priority = false, sizes = "(max-width: 800px) 100vw, 42vw", linkHref, showCredit = false }: Props) {
  const asset = getRenderableMedia(entityType, entityId)[0];
  if (!asset) return <>{fallback}</>;
  const credit = asset.sourceLabel || asset.rightsHolder;
  const image=<SafeEntityImage src={asset.src} fallbackSrc={isCompetitorSource(asset.sourceImageUrl) ? undefined : asset.sourceImageUrl} alt={asset.alt} width={asset.width} height={asset.height} sizes={sizes} priority={priority} unoptimized={asset.src.endsWith(".svg")} />;
  return <div className={className || "entity-media"}>
    {linkHref?<Link className="entity-media-link" href={linkHref} aria-label={`View ${asset.alt}`}>{image}</Link>:image}
    {showCredit&&<small className="entity-media-credit"><SourceRef url={asset.sourceUrl} label={`Image: ${credit}`} />{asset.src.startsWith("/") && asset.sourceImageUrl ? " · local-first media" : asset.rightsStatus === "external-reference" ? " · external reference" : ` · ${asset.rightsStatus}`}</small>}
  </div>;
}
