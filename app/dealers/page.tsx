import type { Metadata } from "next";
import Link from "next/link";
import { DealerFinder } from "@/components/DealerFinder";
import { pageMetadata } from "@/lib/site";
import { officialDealerLocators } from "@/lib/dealerLocators";
import { MIN_PUBLIC_DEALERS_PER_CITY, citySlug } from "@/lib/sellers";
import { allVerifiedDealers } from "@/lib/persistentSellers";
import { CTAGroup, InfoPanel, PageHero, SectionHeader, StatRow } from "@/components/ui";
import styles from "../styles/hub-index.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Dealers Philippines: Find Checked Dealers",
  description: "Find checked motorcycle dealer records in the Philippines, search by city or brand, and open official Honda, Yamaha, Suzuki and Kawasaki dealer locators.",
  path: "/dealers",
  index: true,
});

const NCR_CITY_ORDER=["Quezon City","Manila","Caloocan City","Pasig City","Makati City","Taguig City","Paranaque City","Pasay City"];
function first(value?: string | string[]) { return Array.isArray(value) ? value[0] : value; }

export default async function DealersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const verifiedDealers = await allVerifiedDealers();
  const availableBrands = [...new Set(verifiedDealers.flatMap(dealer => dealer.brands))];
  const requestedBrandRaw = (first(query.brand) || "").trim().slice(0,40);
  const requestedBrandMatch = availableBrands.find(brand => brand.toLowerCase() === requestedBrandRaw.toLowerCase());
  const requestedBrand = requestedBrandMatch || requestedBrandRaw || "all";
  const cityCounts = new Map<string, number>();
  for (const dealer of verifiedDealers) cityCounts.set(dealer.city, (cityCounts.get(dealer.city) || 0) + 1);

  const publishedCities = [...cityCounts.entries()]
    .filter(([,count])=>count>=MIN_PUBLIC_DEALERS_PER_CITY)
    .map(([city])=>city)
    .sort();

  const ncrCities=NCR_CITY_ORDER.filter(city=>publishedCities.includes(city));
  const otherCities=publishedCities.filter(city=>!NCR_CITY_ORDER.includes(city));
  const pampangaCount = verifiedDealers.filter(dealer=>dealer.province==="Pampanga").length;
  const featuredJoinHref="/dealers/join?plan=featured-city&source=%2Fdealers#featured-options";
  const pageTitle=requestedBrand!=="all"
    ? `${requestedBrand} motorcycle dealers in the Philippines`
    : "Find motorcycle dealers in the Philippines";
  const pageDescription=requestedBrand!=="all"
    ? `Start with checked ${requestedBrand} dealer records, then confirm the exact model, variant, stock and complete cash price with the branch before paying a reservation or deposit.`
    : "Search checked dealer records by city or brand, then confirm stock and the complete cash price with the branch before paying a reservation or deposit.";

  return <section className="page shell dealer-master-page">
    <PageHero
      kicker="Motorcycle dealer finder"
      title={pageTitle}
      description={pageDescription}
      actions={<CTAGroup><a className="button" href="#dealer-search">Search checked dealers</a><Link className="button secondary" href="/motorcycles">Choose a motorcycle first</Link></CTAGroup>}
    />

    <StatRow items={[
      {label:"Checked dealers",value:String(verifiedDealers.length),note:"Published verification records"},
      {label:"Published cities",value:String(publishedCities.length),note:`Minimum ${MIN_PUBLIC_DEALERS_PER_CITY} checked branches`},
      {label:"Brands represented",value:String(availableBrands.length),note:"From current checked dealer records"}
    ]}/>

    <section id="dealer-search" className={styles.section} data-dealer-search-section>
      <SectionHeader
        kicker="Checked records"
        title="Search the dealer directory"
        description="MotoIndex publishes a branch only when its dealer relationship and business details can be checked against a current verification source."
      />
      <DealerFinder dealers={verifiedDealers} initialBrand={requestedBrand} />
    </section>

    {(ncrCities.length||otherCities.length||pampangaCount>=5)?<section className={styles.section} data-dealer-city-section>
      <SectionHeader
        kicker="Local dealer guides"
        title="Browse checked dealer coverage by area"
        description={`City pages publish only after at least ${MIN_PUBLIC_DEALERS_PER_CITY} dealer records pass the verification gate.`}
      />
      <div className={styles.decisionList}>
        {ncrCities.map(city=><Link className={styles.decisionRow} href={`/dealers/${citySlug(city)}`} key={city}>
          <span className={styles.decisionLabel}>Metro Manila</span>
          <span className={styles.decisionCopy}><h3>Motorcycle dealers in {city}</h3><p>Checked branch directory for {city}.</p></span>
          <span className={styles.decisionMeta}>{cityCounts.get(city)||0} branches →</span>
        </Link>)}
        {otherCities.map(city=><Link className={styles.decisionRow} href={`/dealers/${citySlug(city)}`} key={city}>
          <span className={styles.decisionLabel}>City guide</span>
          <span className={styles.decisionCopy}><h3>Motorcycle dealers in {city}</h3><p>Compare checked nearby branches before asking for current stock and final pricing.</p></span>
          <span className={styles.decisionMeta}>{cityCounts.get(city)||0} branches →</span>
        </Link>)}
        {pampangaCount>=5?<Link className={styles.decisionRow} href="/dealers/pampanga">
          <span className={styles.decisionLabel}>Province guide</span>
          <span className={styles.decisionCopy}><h3>Motorcycle dealers in Pampanga</h3><p>Checked dealer branches across Angeles City and San Fernando in one local directory.</p></span>
          <span className={styles.decisionMeta}>{pampangaCount} branches →</span>
        </Link>:null}
      </div>
    </section>:null}

    <section className={styles.section} data-official-dealer-locators>
      <SectionHeader
        kicker="Official sources"
        title="Use the motorcycle brand's dealer locator"
        description="MotoIndex coverage is still growing. Use official Philippine brand directories when you need broader branch coverage."
      />
      <div className={styles.decisionList}>
        {officialDealerLocators.map(locator=><a className={styles.decisionRow} href={locator.href} target="_blank" rel="noopener noreferrer" key={locator.brand}>
          <span className={styles.decisionLabel}>{locator.brand}</span>
          <span className={styles.decisionCopy}><h3>{locator.brand} dealer locator</h3><p>{locator.note}</p></span>
          <span className={styles.decisionMeta}>Open official locator ↗</span>
        </a>)}
      </div>
    </section>

    <section className={styles.section}>
      <SectionHeader
        kicker="Before you pay"
        title="What to ask the dealer"
        description="Get these details in writing so quotes from different branches are easy to compare."
      />
      <StatRow items={[
        {label:"Cash price",value:"Exact variant",note:"Confirm color and complete cash price"},
        {label:"Added fees",value:"Itemized",note:"Registration and processing"},
        {label:"Release date",value:"Confirmed",note:"Ask whether stock is physically available"},
        {label:"Warranty",value:"In writing",note:"Coverage and service location"}
      ]}/>
      <InfoPanel subtle className={styles.notice}>
        <h3>What “checked” means here</h3>
        <p>The dealer relationship has a reviewed verification source on file. For manufacturer-locator records, that source is the official brand directory. Address and contact details are also checked before publication. This does not verify current inventory, financing approval, promo pricing or same-day release.</p>
      </InfoPanel>
    </section>

    <section className={styles.section}>
      <InfoPanel subtle>
        <h3>For motorcycle dealers</h3>
        <p>Verified dealer listings are free. Approved dealers can publish branch details and appear in city and brand searches. Optional paid placements are clearly labeled and do not change MotoIndex verification standards.</p>
        <CTAGroup><Link className="button" href="/dealers/join">Get listed free</Link><Link className="button secondary" href={featuredJoinHref}>See featured options</Link></CTAGroup>
      </InfoPanel>
    </section>

    <section className={styles.section}>
      <SectionHeader
        kicker="Before requesting quotes"
        title="Choose the motorcycle first"
        description="Compare models and set a budget first, then contact more than one branch for the same exact variant."
      />
      <CTAGroup><Link className="button" href="/motorcycles">Browse motorcycles</Link><Link className="button secondary" href="/finder">Open motorcycle finder</Link><Link className="button secondary" href="/compare">Compare motorcycles</Link></CTAGroup>
    </section>
  </section>;
}
