import type { SellerProfile } from "@/lib/types";
import { absoluteUrl } from "@/lib/site";

function businessType(seller: SellerProfile) {
  return seller.type === "dealer" ? "MotorcycleDealer" : "Store";
}

export function sellerBusinessSchema(seller: SellerProfile) {
  const url = absoluteUrl(`/sellers/${seller.slug}`);
  const sameAs = [seller.website, seller.sourceUrl].filter((value): value is string => Boolean(value));

  return {
    "@context": "https://schema.org",
    "@type": businessType(seller),
    "@id": `${url}#business`,
    name: seller.name,
    url,
    description: seller.description,
    telephone: seller.phoneLabel,
    address: {
      "@type": "PostalAddress",
      streetAddress: seller.addressLabel,
      addressLocality: seller.city,
      addressRegion: seller.province || seller.region,
      addressCountry: "PH",
    },
    areaServed: seller.city ? { "@type": "City", name: seller.city } : undefined,
    brand: seller.brands.map((name) => ({ "@type": "Brand", name })),
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

export function motorcycleDealerDirectorySchema(
  sellers: SellerProfile[],
  name: string,
  path: string,
) {
  const dealers = sellers.filter((seller) => seller.type === "dealer");
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${absoluteUrl(path)}#motorcycle-dealers`,
    name,
    numberOfItems: dealers.length,
    itemListElement: dealers.map((seller, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/sellers/${seller.slug}`),
      item: {
        ...sellerBusinessSchema(seller),
        "@context": undefined,
      },
    })),
  };
}
