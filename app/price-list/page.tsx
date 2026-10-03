import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PriceListExplorer } from "@/components/PriceListExplorer";
import { publicMotorcycles } from "@/lib/data";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import { pageMetadata, SITE_URL } from "@/lib/site";
import { PageHero } from "@/components/ui";

export const dynamic = "force-static";
export const revalidate = false;

const baseMetadata = pageMetadata({
  title: "Motorcycle Price List Philippines 2026 | MotoIndex PH",
  description: "Browse current motorcycle prices in the Philippines by brand, category and engine size. Compare published PHP prices and open each model for full specs.",
  path: "/price-list",
  index: false
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: { canonical: "/motorcycles" },
  robots: { index: false, follow: true }
};

const rows = [...publicMotorcycles]
  .filter((model) => model.marketStatus !== "previous" && model.marketStatus !== "discontinued")
  .sort((a, b) => a.srp - b.srp || a.make.localeCompare(b.make) || a.model.localeCompare(b.model));

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Current motorcycle price references in the Philippines",
  numberOfItems: rows.length,
  itemListElement: rows.map((model, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: `${model.make} ${model.model}`,
    url: `${SITE_URL}/motorcycles/${model.makeSlug}/${model.slug}`
  }))
};

export default function PriceListPage() {
  return <section className="page shell wire-price-list-page">
    <Breadcrumbs items={[{ label: "Motorcycles", href: "/motorcycles" }, { label: "Price list" }]} />
    <PageHero
      kicker="Philippine motorcycle market"
      title="Motorcycle price list in the Philippines"
      description="Filter the current MotoIndex catalog by brand, category and engine size. Published prices remain model-level research references, so open the exact motorcycle to see source context, checked dates, variants and specifications."
      actions={<Link className="button" href="/motorcycles">Browse full motorcycle catalog</Link>}
    />

    <PriceListExplorer rows={rows.map((model) => ({
      id: model.id,
      make: model.make,
      makeSlug: model.makeSlug,
      model: model.model,
      slug: model.slug,
      category: model.category,
      engineCc: model.engineCc,
      srp: model.srp,
      priceLabel: observedMarketPriceLabel(model)
    }))} />

    <p className="wire-price-note">Prices are research references and may vary by dealer, variant, registration, fees and promotion. Confirm the current transaction price before purchase.</p>
    <JsonLd data={itemListSchema} />
  </section>;
}
