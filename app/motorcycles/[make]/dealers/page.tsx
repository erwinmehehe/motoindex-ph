import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DealerFinder } from "@/components/DealerFinder";
import { JsonLd } from "@/components/JsonLd";
import { CTAGroup, InfoPanel, PageHero, SectionHeader, StatRow } from "@/components/ui";
import { motorcycles } from "@/lib/data";
import { officialDealerLocators } from "@/lib/dealerLocators";
import { allVerifiedDealers } from "@/lib/persistentSellers";
import { pageMetadata } from "@/lib/site";
import { MIN_PUBLIC_DEALERS_PER_CITY, citySlug } from "@/lib/sellers";
import { dealerDirectorySchema } from "@/lib/structuredData";

const supported = ["honda", "yamaha", "suzuki", "kawasaki"] as const;

function brandForSlug(make: string) {
  return motorcycles.find((model) => model.makeSlug === make)?.make;
}

function locatorForBrand(brand: string) {
  return officialDealerLocators.find((locator) => locator.brand.toLowerCase() === brand.toLowerCase());
}

export function generateStaticParams() {
  return supported.map((make) => ({ make }));
}

export async function generateMetadata({ params }: { params: Promise<{ make: string }> }): Promise<Metadata> {
  const { make } = await params;
  const brand = brandForSlug(make);
  if (!brand || !supported.includes(make as (typeof supported)[number])) return {};
  return pageMetadata({
    title: brand + " Motorcycle Dealers Philippines | Near Me & Branches",
    description: "Find checked " + brand + " motorcycle dealers in the Philippines, browse verified branches by city, and use the official " + brand + " dealer locator for wider coverage.",
    path: "/motorcycles/" + make + "/dealers",
    index: true
  });
}

export default async function BrandDealersPage({ params }: { params: Promise<{ make: string }> }) {
  const { make } = await params;
  const brand = brandForSlug(make);
  if (!brand || !supported.includes(make as (typeof supported)[number])) return notFound();

  const allDealers = await allVerifiedDealers();
  const dealers = allDealers.filter((dealer) => dealer.brands.some((item) => item.toLowerCase() === brand.toLowerCase()));
  const officialLocator = locatorForBrand(brand);
  const cityCounts = new Map<string, number>();
  const allCityCounts = new Map<string, number>();
  for (const dealer of allDealers) allCityCounts.set(dealer.city, (allCityCounts.get(dealer.city) || 0) + 1);
  for (const dealer of dealers) cityCounts.set(dealer.city, (cityCounts.get(dealer.city) || 0) + 1);
  const cities = [...cityCounts.entries()]
    .filter(([city]) => (allCityCounts.get(city) || 0) >= MIN_PUBLIC_DEALERS_PER_CITY)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const path = "/motorcycles/" + make + "/dealers";
  const schema = dealerDirectorySchema(dealers, path, brand + " motorcycle dealers in the Philippines");

  return <section className="page shell dealer-master-page">
    <JsonLd data={schema} />
    <Breadcrumbs items={[
      { label: "Motorcycles", href: "/motorcycles" },
      { label: brand, href: "/motorcycles/" + make },
      { label: "Dealers" }
    ]} />

    <PageHero
      kicker={brand + " dealer finder"}
      title={brand + " motorcycle dealers in the Philippines"}
      description={"Find checked " + brand + " dealer records by city, then confirm the exact model, variant, stock, cash price, fees and release date directly with the branch. MotoIndex also links the official " + brand + " dealer locator for broader coverage."}
      actions={<CTAGroup>
        <a className="button" href="#checked-dealers">Find checked dealers</a>
        {officialLocator ? <a className="button secondary" href={officialLocator.href} target="_blank" rel="noopener noreferrer">Official {brand} locator ↗</a> : null}
      </CTAGroup>}
    />

    <StatRow items={[
      { label: "Checked branches", value: String(dealers.length), note: brand + " records in the MotoIndex directory" },
      { label: "Cities represented", value: String(cities.length), note: "Across currently checked branch records" },
      { label: "Official locator", value: officialLocator ? "Linked" : "Not listed", note: officialLocator ? "Checked " + officialLocator.checkedAt : "Use the main dealer directory" }
    ]} />

    <section id="checked-dealers" className="section">
      <SectionHeader
        kicker="Checked branch records"
        title={"Search " + brand + " motorcycle dealers near you"}
        description="Search the checked records below. A verified listing confirms the branch relationship and reviewed business details; it does not guarantee current stock, promo pricing or same-day release."
      />
      {dealers.length
        ? <DealerFinder dealers={dealers} initialBrand={brand} />
        : <InfoPanel subtle><h3>No checked MotoIndex branch records yet</h3><p>Use the official brand locator below while MotoIndex expands verified branch coverage.</p></InfoPanel>}
    </section>

    {cities.length ? <section className="section">
      <SectionHeader
        kicker="Cities with checked records"
        title={brand + " dealer coverage by city"}
        description="Open the broader city directory to compare other checked motorcycle branches in the same area."
      />
      <div className="guide-strip">
        {cities.map(([city, count]) => <Link href={"/dealers/" + citySlug(city)} key={city}>
          <strong>{city}</strong>
          <small>{count} checked {brand} {count === 1 ? "branch" : "branches"} in MotoIndex</small>
        </Link>)}
      </div>
    </section> : null}

    <section className="section">
      <SectionHeader
        kicker="Official source"
        title={"Need more " + brand + " branches?"}
        description="Manufacturer locators remain the broadest source when MotoIndex has not yet checked a branch individually."
      />
      {officialLocator ? <InfoPanel subtle>
        <h3>{brand} official dealer locator</h3>
        <p>{officialLocator.note} MotoIndex last checked this locator on {officialLocator.checkedAt}.</p>
        <a className="text-link" href={officialLocator.href} target="_blank" rel="noopener noreferrer">Open official {brand} dealer locator ↗</a>
      </InfoPanel> : null}
    </section>

    <section className="section">
      <SectionHeader
        kicker="Before contacting a branch"
        title="Choose the exact motorcycle first"
        description="A dealer-near-me search is more useful after you know the model and variant you want quoted."
      />
      <CTAGroup>
        <Link className="button" href={"/motorcycles/" + make}>Compare {brand} motorcycles</Link>
        <Link className="button secondary" href="/dealers">Browse all dealers</Link>
        <Link className="button secondary" href="/tools/motorcycle-loan-calculator">Estimate financing</Link>
      </CTAGroup>
    </section>
  </section>;
}
