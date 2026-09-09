import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { dealerCities, citySlug, dealersByCity, sellersByType } from "@/lib/sellers";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Dealers Philippines: City Directory",
  description: "Browse MotoIndex motorcycle dealer city pages and preview dealer records by location. Sample records stay noindex until business details are verified.",
  path: "/dealers",
  index: false,
});

export default function DealersPage() {
  const cities = dealerCities();
  const dealers = sellersByType("dealer");
  const brandCount = new Set(dealers.flatMap((dealer) => dealer.brands)).size;

  return <section className="page shell">
    <div className="page-head">
      <span className="entity-kicker">Dealer directory preview</span>
      <h1>Motorcycle dealers in the Philippines</h1>
      <p>Browse available dealer records by city and brand. This directory is still in verification mode, so sample businesses remain clearly labeled and are not indexed as real dealer listings.</p>
    </div>

    <div className="seller-stats">
      <div><strong>{dealers.length}</strong><span>Dealer records</span></div>
      <div><strong>{cities.length}</strong><span>Cities covered</span></div>
      <div><strong>{brandCount}</strong><span>Brands represented</span></div>
      <div><strong>Preview</strong><span>Verification status</span></div>
    </div>

    <section className="motorcycle-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Browse by location</span><h2>Dealer city pages</h2><p>Open a city to see the dealer records currently attached to that location.</p></div></div>
      <div className="seller-grid">
        {cities.map((city) => {
          const cityDealers = dealersByCity(citySlug(city));
          const brands = [...new Set(cityDealers.flatMap((dealer) => dealer.brands))];
          return <Link key={city} href={`/dealers/${citySlug(city)}`}>
            <div className="seller-icon">D</div>
            <span className="catalog-status">preview</span>
            <h3>{city}</h3>
            <p>{cityDealers.length} dealer {cityDealers.length === 1 ? "record" : "records"}</p>
            <small>{brands.join(" · ") || "Brand data pending"}</small>
            <b>View dealers →</b>
          </Link>;
        })}
      </div>
    </section>

    <section className="motorcycle-entity-section">
      <div className="seller-home">
        <div>
          <span className="section-kicker">What comes next</span>
          <h2>Verified dealer pages, not fake local SEO pages</h2>
          <p>Dealer and city pages should only become indexable after the business name, address, brand authorization, contact details and current status are verified. That keeps the directory useful and avoids publishing thousands of thin location pages.</p>
        </div>
        <div className="seller-home-flow" aria-label="Dealer verification workflow">
          <span>Business identity</span><b>→</b><span>Address</span><b>→</b><span>Brand authorization</span><b>→</b><span>Contact</span><b>→</b><span>Publish</span>
        </div>
      </div>
    </section>

    <section className="motorcycle-entity-section">
      <div className="section-head compact"><div><h2>Looking for a motorcycle instead?</h2><p>Start from the motorcycle catalog, compare models, then use dealer pages once a shortlist is ready.</p></div></div>
      <div className="hero-actions">
        <Link className="button" href="/motorcycles">Browse motorcycles</Link>
        <Link className="button secondary" href="/finder">Open motorcycle finder</Link>
        <Link className="button secondary" href="/compare">Compare motorcycles</Link>
      </div>
    </section>
  </section>;
}
