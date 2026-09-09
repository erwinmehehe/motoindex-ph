import Link from "next/link";
import { EntityMedia } from "@/components/EntityMedia";
import { AffiliateOffer } from "@/components/AffiliateOffer";
import { hasRenderableProductMedia } from "@/lib/media";

export type ProductCardItem = {
  href: string;
  category: string;
  brand: string;
  model: string;
  meta: string;
  status: "research" | "verified";
  priceFromPhp?: number;
  entityId?: string;
};

function entityTypeForHref(href:string): "helmet" | "tire" | "topbox" | null {
  if (href.startsWith("/gear/helmets/")) return "helmet";
  if (href.startsWith("/tires/")) return "tire";
  if (href.startsWith("/accessories/top-box/")) return "topbox";
  return null;
}

export function ProductCard({ item }: { item: ProductCardItem }) {
  const entityType=entityTypeForHref(item.href);
  const productName=`${item.brand} ${item.model}`;
  const hasMedia=Boolean(item.entityId&&hasRenderableProductMedia(item.entityId));
  const card=<Link className="product-card" href={item.href}>
    {entityType&&item.entityId&&hasMedia?<EntityMedia entityType={entityType} entityId={item.entityId} className="product-card-media" showCredit={false} fallback={null}/>:<div className="product-art" aria-label="Product photo not yet available"><span>Photo not yet available</span></div>}
    <div className="product-card-copy">
      <div className="product-card-top">{item.status!=="verified"&&<span className="catalog-status">Check details</span>}</div>
      <h3>{productName}</h3>
      <p>{item.meta}</p>
      <div className="product-card-foot"><strong>{item.priceFromPhp ? `From ₱${item.priceFromPhp.toLocaleString("en-PH")}` : "Price pending"}</strong><span>View →</span></div>
    </div>
  </Link>;
  if(!item.entityId)return card;
  return <article className="product-card-shell">{card}<AffiliateOffer productId={item.entityId} productName={productName} compact /></article>;
}
