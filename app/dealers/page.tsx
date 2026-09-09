import type { Metadata } from "next";
import Link from "next/link";
import { DealerFinder } from "@/components/DealerFinder";
import { pageMetadata } from "@/lib/site";
import { officialDealerLocators } from "@/lib/dealerLocators";
import { MIN_PUBLIC_DEALERS_PER_CITY, citySlug } from "@/lib/sellers";
import { allVerifiedDealers } from "@/lib/persistentSellers";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Dealers Philippines: Find Checked Dealers",
  description: "Find checked motorcycle dealer records in the Philippines, search by city or brand, and open official Honda, Yamaha, Suzuki and Kawasaki dealer locators.",
  path: "/dealers",
  index: true,
});

export default async function DealersPage() {
  const verifiedDealers = await allVerifiedDealers();
  const cityCounts = new Map<string, number>();
  for (const dealer of verifiedDealers) cityCounts.set(dealer.city, (cityCounts.get(dealer.city) || 0) + 1);
  const publishedCities = [...cityCounts.entries()].filter(([,count])=>count>=MIN_PUBLIC_DEALERS_PER_CITY).map(([city])=>city).sort();

  return <section className="page shell">
    <div className="page-head dealer-page-head">
      <span className="entity-kicker">Motorcycle dealer finder</span>
      <h1>Find motorcycle dealers in the Philippines</h1>
      <p>Search checked dealer records by city or brand, then confirm stock and the complete cash price with the branch before paying a reservation or deposit.</p>
    </div>

    <section className="motorcycle-entity-section dealer-directory-section">
      <div className="section-head compact"><div>
        <span className="section-kicker">Checked records</span>
        <h2>Search the dealer directory</h2>
        <p>We publish a branch only when its dealer relationship and business details can be checked against a trustworthy current verification source.</p>
      </div></div>
      <DealerFinder dealers={verifiedDealers} />
    </section>

    {publishedCities.length?<section className="motorcycle-entity-section">
      <div className="section-head compact"><div>
        <span className="section-kicker">City guides</span>
        <h2>Browse dealer coverage by city</h2>
        <p>City pages open only when at least {MIN_PUBLIC_DEALERS_PER_CITY} checked dealer records are available.</p>
      </div></div>
      <div className="dealer-city-links">
        {publishedCities.map(city=><Link href={`/dealers/${citySlug(city)}`} key={city}>
          <strong>Motorcycle dealers in {city}</strong>
          <span>{cityCounts.get(city) || 0} checked branches</span>
        </Link>)}
      </div>
    </section>:null}

    <section className="motorcycle-entity-section">
      <div className="section-head compact"><div>
        <span className="section-kicker">Official sources</span>
        <h2>Use the motorcycle brand&apos;s dealer locator</h2>
        <p>MotoIndex coverage is still growing. These links go directly to the official Philippine dealer directories for broader branch coverage.</p>
      </div></div>
      <div className="dealer-locator-grid">
        {officialDealerLocators.map(locator=><a className="dealer-locator-card" href={locator.href} target="_blank" rel="noopener noreferrer" key={locator.brand}>
          <span>{locator.brand}</span>
          <h3>{locator.brand} dealer locator</h3>
          <p>{locator.note}</p>
          <b>Open official locator ↗</b>
        </a>)}
      </div>
    </section>

    <section className="motorcycle-entity-section">
      <div className="section-head compact"><div>
        <span className="section-kicker">Before you pay</span>
        <h2>What to ask the dealer</h2>
        <p>Get these details in writing so quotes from different branches are easy to compare.</p>
      </div></div>
      <div className="seller-stats dealer-checklist">
        <div><strong>Cash price</strong><span>Exact variant and color</span></div>
        <div><strong>Added fees</strong><span>Registration and processing</span></div>
        <div><strong>Release date</strong><span>Confirmed stock availability</span></div>
        <div><strong>Warranty</strong><span>Coverage and service location</span></div>
      </div>
      <div className="dealer-verification-note">
        <strong>What “checked” means here</strong>
        <p>The dealer relationship has a reviewed verification source on file. For manufacturer-locator records, that source is the official brand directory. Address and contact details are also checked before publication. This does not verify current inventory, financing approval, promo pricing or same-day release.</p>
      </div>
    </section>

    <section className="dealer-partner-strip">
      <div><span className="section-kicker">Dealer partners</span><h2>Own or represent a motorcycle dealership?</h2><p>Apply to add a verified branch, publish checked dealer details and become eligible for relevant buyer quote matching.</p></div>
      <Link className="button" href="/dealers/join">Join MotoIndex as a dealer</Link>
    </section>

    <section className="motorcycle-entity-section">
      <div className="section-head compact"><div>
        <h2>Choose the motorcycle before requesting quotes</h2>
        <p>Compare models and set a budget first, then contact more than one branch for the same exact variant.</p>
      </div></div>
      <div className="hero-actions">
        <Link className="button" href="/motorcycles">Browse motorcycles</Link>
        <Link className="button secondary" href="/finder">Open motorcycle finder</Link>
        <Link className="button secondary" href="/compare">Compare motorcycles</Link>
      </div>
    </section>
  </section>;
}
