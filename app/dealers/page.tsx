import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { publicSellersByType } from "@/lib/sellers";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Dealers Philippines: Buying Guide",
  description: "Learn how to verify motorcycle dealers, compare written quotes and check the final cash price before paying a reservation or deposit.",
  path: "/dealers",
  index: false,
});

export default function DealersPage() {
  const verifiedDealers = publicSellersByType("dealer");

  return <section className="page shell">
    <div className="page-head">
      <span className="entity-kicker">Dealer guide</span>
      <h1>Finding a motorcycle dealer in the Philippines</h1>
      <p>Start with the motorcycle brand&apos;s official dealer locator, then ask nearby branches for a written quote. Compare the complete amount, not only the advertised SRP or monthly payment.</p>
    </div>

    {verifiedDealers.length > 0 ? <section className="motorcycle-entity-section">
      <div className="section-head compact"><div>
        <span className="section-kicker">Verified businesses</span>
        <h2>Motorcycle dealers</h2>
        <p>These dealer records have passed the site&apos;s business-detail checks.</p>
      </div></div>
      <div className="seller-grid">
        {verifiedDealers.map((dealer) => <Link key={dealer.slug} href={`/sellers/${dealer.slug}`}>
          <div className="seller-icon">D</div>
          <h3>{dealer.name}</h3>
          <p>{dealer.addressLabel}</p>
          <small>{dealer.brands.join(" · ")}</small>
          <b>View dealer →</b>
        </Link>)}
      </div>
    </section> : <section className="motorcycle-entity-section">
      <div className="seller-home dealer-empty-state">
        <div>
          <span className="section-kicker">Directory status</span>
          <h2>No dealer profiles are published yet</h2>
          <p>We will add dealer profiles only after checking the business name, address, contact details and current operating status. Until then, use the motorcycle brand&apos;s official dealer locator and confirm details directly with the branch.</p>
        </div>
      </div>
    </section>}

    <section className="motorcycle-entity-section">
      <div className="section-head compact"><div>
        <span className="section-kicker">Before you pay</span>
        <h2>What to ask the dealer</h2>
        <p>Request the details below in writing so quotes from different branches are easy to compare.</p>
      </div></div>
      <div className="seller-stats dealer-checklist">
        <div><strong>Cash price</strong><span>Exact variant and color</span></div>
        <div><strong>Added fees</strong><span>Registration and processing</span></div>
        <div><strong>Release date</strong><span>Confirmed stock availability</span></div>
        <div><strong>Warranty</strong><span>Coverage and service location</span></div>
      </div>
    </section>

    <section className="motorcycle-entity-section">
      <div className="section-head compact"><div>
        <h2>Choose the motorcycle first</h2>
        <p>Compare models and estimate the budget before requesting dealer quotes.</p>
      </div></div>
      <div className="hero-actions">
        <Link className="button" href="/motorcycles">Browse motorcycles</Link>
        <Link className="button secondary" href="/finder">Open motorcycle finder</Link>
        <Link className="button secondary" href="/compare">Compare motorcycles</Link>
      </div>
    </section>
  </section>;
}
