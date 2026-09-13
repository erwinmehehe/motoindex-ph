import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { AUTHOR_BIO, AUTHOR_NAME, AUTHOR_PATH, AUTHOR_ROLE, authorPersonSchema } from "@/lib/author";
import { absoluteUrl, pageMetadata, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Erwin Valles | MotoIndex Philippines Author",
  description: "About Erwin Valles, author and editor behind MotoIndex Philippines motorcycle, gear and buyer research.",
  path: AUTHOR_PATH,
  index: true,
});

export default function ErwinVallesAuthorPage() {
  const person = {
    ...authorPersonSchema(),
    description: AUTHOR_BIO,
    knowsAbout: [
      "Motorcycle prices in the Philippines",
      "Motorcycle specifications",
      "Motorcycle helmets and riding gear",
      "Motorcycle ownership research",
      "Motorcycle buyer guides"
    ]
  };
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${AUTHOR_NAME} | ${SITE_NAME}`,
    url: absoluteUrl(AUTHOR_PATH),
    mainEntity: person,
  };

  return <section className="page shell author-profile-page">
    <div className="author-profile-hero">
      <div className="author-avatar large" aria-hidden="true">EV</div>
      <div>
        <span className="section-kicker">MotoIndex Philippines author</span>
        <h1>{AUTHOR_NAME}</h1>
        <strong>{AUTHOR_ROLE}</strong>
        <p>{AUTHOR_BIO}</p>
      </div>
    </div>

    <div className="split section">
      <div>
        <h2>What Erwin covers</h2>
        <p>Erwin focuses on information that helps Philippine riders make better purchase and ownership decisions: current motorcycle pricing, model specifications, helmet and gear comparisons, fitment, maintenance, running costs and practical buying guides.</p>
        <p>Pages are built around identifiable sources and dates where the information can change. Manufacturer and government sources are preferred for specifications and rules, while Philippine seller sources are used when current local pricing or availability needs to be checked.</p>
      </div>
      <div className="info-card">
        <h3>Editorial principles</h3>
        <ul className="checklist">
          <li>Use the exact model or generation, not a similar product.</li>
          <li>Keep changing prices separate from fixed specifications.</li>
          <li>Show the source when a buyer may need to verify a claim.</li>
          <li>Correct errors when better evidence becomes available.</li>
        </ul>
      </div>
    </div>

    <section className="section author-profile-links">
      <h2>Explore Erwin&apos;s work on MotoIndex</h2>
      <div className="guide-strip">
        <Link href="/motorcycles"><strong>Motorcycle research</strong><small>Prices, specs and ownership information</small></Link>
        <Link href="/gear/helmets"><strong>Helmet research</strong><small>Models, sizing, certification and buying guides</small></Link>
        <Link href="/recommendations"><strong>Buying guides</strong><small>Compare motorcycles by budget, fit and use</small></Link>
        <Link href="/methodology"><strong>Editorial methodology</strong><small>How MotoIndex checks changing data</small></Link>
      </div>
    </section>

    <section className="split section" aria-labelledby="author-accountability">
      <div>
        <span className="section-kicker">Accountability</span>
        <h2 id="author-accountability">How the research can be checked</h2>
        <p>MotoIndex keeps source links, source-check dates and correction paths visible so readers can distinguish a current manufacturer specification from a market observation or an editorial estimate.</p>
      </div>
      <div className="info-card">
        <h3>Research records</h3>
        <ul className="checklist">
          <li><Link href="/data-sources">Review the data-source policy and source hierarchy.</Link></li>
          <li><Link href="/corrections">See how errors and stale information are corrected.</Link></li>
          <li><Link href="/methodology">Read the editorial and verification methodology.</Link></li>
        </ul>
      </div>
    </section>

    <section className="section author-profile-links">
      <h2>Selected buyer research</h2>
      <div className="guide-strip">
        <Link href="/guides/motorcycle-helmet-size-guide"><strong>Motorcycle helmet size guide</strong><small>Fit, measurement and manufacturer-chart verification.</small></Link>
        <Link href="/guides/motorcycle-helmet-certification-philippines"><strong>Helmet certification guide</strong><small>How to verify current certification and Philippine requirements.</small></Link>
        <Link href="/ownership/cost-calculator"><strong>Ownership cost calculator</strong><small>Estimate purchase, financing and running costs together.</small></Link>
      </div>
    </section>

    <JsonLd data={schema} />
  </section>;
}
