import Link from "next/link";
import { EntityMedia } from "@/components/EntityMedia";
import { EntityVerificationFallback } from "@/components/EntityVerificationFallback";
import { AffiliateOffer } from "@/components/AffiliateOffer";

export type ProductCardItem = {
  href: string;
  category: string;
  brand: string;
  model: string;
  meta?: string;
  status: "research" | "verified";
  priceFromPhp?: number;
  entityId?: string;
};

function entityTypeForHref(href: string): "helmet" | "tire" | "topbox" | null {
  if (href.startsWith("/gear/helmets/")) return "helmet";
  if (href.startsWith("/tires/")) return "tire";
  if (href.startsWith("/accessories/top-box/")) return "topbox";
  return null;
}

export function ProductCard({ item }: { item: ProductCardItem }) {
  const entityType = entityTypeForHref(item.href);
  const productName = `${item.brand} ${item.model}`;
  const missingPhoto = <EntityVerificationFallback brand={item.brand} model={item.model} />;
  const card = <Link className="product-card ui-product-card" href={item.href}>
    {entityType && item.entityId
      ? <EntityMedia entityType={entityType} entityId={item.entityId} className="product-card-media ui-product-media" showCredit={false} fallback={missingPhoto} />
      : missingPhoto}
    <div className="product-card-copy ui-product-card-copy">
      <div className="product-card-top">
        <span className="product-card-category">{item.category}</span>
        {item.status !== "verified" && <span className="catalog-status">Check details</span>}
      </div>
      <h3>{productName}</h3>
      {item.meta && <p>{item.meta}</p>}
      <div className="product-card-foot ui-product-card-foot">{typeof item.priceFromPhp === "number" ? <strong>From ₱{item.priceFromPhp.toLocaleString("en-PH")}</strong> : <span aria-hidden="true" /> }<span>View →</span></div>
    </div>
  </Link>;
  if (!item.entityId) return card;
  return <article className="product-card-shell ui-product-card-shell">{card}<AffiliateOffer productId={item.entityId} productName={productName} compact /></article>;
}
