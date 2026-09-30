import type { CatalogStatus, Motorcycle, SellerProfile } from "./types";
import { observedMarketRange } from "./marketChecks";
import { absoluteUrl } from "./site";

type CatalogPricedItem = {
  status: CatalogStatus;
  priceFromPhp?: number;
  stockStatus?: string;
};

function availabilityFromStockStatus(stockStatus?: string) {
  if (!stockStatus) return undefined;
  const value = stockStatus.toLowerCase();
  if (/sold out/.test(value)) return "https://schema.org/SoldOut";
  if (/out of stock|unavailable/.test(value)) return "https://schema.org/OutOfStock";
  if (/pre[- ]?order/.test(value)) return "https://schema.org/PreOrder";
  if (/limited|low stock/.test(value)) return "https://schema.org/LimitedAvailability";
  if (/in stock|available/.test(value)) return "https://schema.org/InStock";
  return undefined;
}

export function catalogProductOfferSchema(item: CatalogPricedItem, canonicalPath: string) {
  if (item.status !== "verified" || typeof item.priceFromPhp !== "number" || item.priceFromPhp <= 0) return undefined;
  const availability = availabilityFromStockStatus(item.stockStatus);
  return {
    "@type": "Offer",
    price: item.priceFromPhp,
    priceCurrency: "PHP",
    url: absoluteUrl(canonicalPath),
    itemCondition: "https://schema.org/NewCondition",
    ...(availability ? { availability } : {})
  };
}

export function motorcycleOfferSchema(model: Motorcycle, canonicalPath: string, indexable: boolean) {
  if (!indexable || model.marketStatus === "previous" || model.marketStatus === "uncertain" || model.marketStatus === "discontinued") return undefined;
  const range = observedMarketRange(model);
  if (!(range.from > 0)) return undefined;
  return {
    "@type": "Offer",
    price: range.from,
    priceCurrency: "PHP",
    url: absoluteUrl(canonicalPath),
    itemCondition: "https://schema.org/NewCondition"
  };
}

export function sellerBusinessSchema(seller: SellerProfile) {
  const type = seller.type === "dealer"
    ? "MotorcycleDealer"
    : seller.type === "retailer"
      ? "Store"
      : "LocalBusiness";
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${absoluteUrl(`/sellers/${seller.slug}`)}#business`,
    name: seller.name,
    url: absoluteUrl(`/sellers/${seller.slug}`),
    description: seller.description,
    ...(seller.phoneLabel ? { telephone: seller.phoneLabel } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: seller.addressLabel,
      addressLocality: seller.city,
      addressRegion: seller.province || seller.region,
      addressCountry: "PH"
    },
    ...(seller.brands.length ? { brand: seller.brands.map((name) => ({ "@type": "Brand", name })) } : {}),
    areaServed: {
      "@type": "AdministrativeArea",
      name: seller.province || seller.region || seller.city
    },
    ...(seller.sourceUrl ? { sameAs: [seller.sourceUrl] } : {})
  };
}

export function dealerDirectorySchema(dealers: SellerProfile[], canonicalPath: string, name: string) {
  const url = absoluteUrl(canonicalPath);
  const itemListId = `${url}#dealer-list`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name,
      url,
      mainEntity: { "@id": itemListId }
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": itemListId,
      name,
      numberOfItems: dealers.length,
      itemListElement: dealers.map((dealer, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/sellers/${dealer.slug}`),
        item: {
          "@type": "MotorcycleDealer",
          "@id": `${absoluteUrl(`/sellers/${dealer.slug}`)}#business`,
          name: dealer.name,
          url: absoluteUrl(`/sellers/${dealer.slug}`),
          ...(dealer.phoneLabel ? { telephone: dealer.phoneLabel } : {}),
          address: {
            "@type": "PostalAddress",
            streetAddress: dealer.addressLabel,
            addressLocality: dealer.city,
            addressRegion: dealer.province || dealer.region,
            addressCountry: "PH"
          },
          ...(dealer.brands.length ? { brand: dealer.brands.map((brand) => ({ "@type": "Brand", name: brand })) } : {})
        }
      }))
    }
  ];
}
