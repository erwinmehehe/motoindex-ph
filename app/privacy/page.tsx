import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: "Privacy information for MotoIndex PH, including dealer quote requests, analytics and commerce links.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return <section className="page shell trust-page">
    <div className="page-head"><h1>Privacy at MotoIndex PH</h1><p>MotoIndex collects contact details only when you deliberately submit a dealer quote request, a dealer partner application, or contact the site. Price-alert email collection remains disabled.</p></div>
    <div className="method-steps">
      <article><b>01</b><h2>Dealer quote requests</h2><p>When you submit a dealer quote request, MotoIndex stores the motorcycle and optional variant, city or province, cash or installment preference, optional down-payment budget, name, mobile number, optional email address, consent timestamp and the page where the request was submitted.</p></article>
      <article><b>02</b><h2>Why dealer-request data is used</h2><p>The information is used to save the request, detect duplicate submissions, match the motorcycle brand and location against verified dealer records, review the lead through the protected administration area and manage follow-up status.</p></article>
      <article><b>03</b><h2>Dealer sharing</h2><p>Submitting the form gives MotoIndex permission to share the request with a relevant verified dealer when a match exists. Approved dealer partners may receive a time-limited secure link containing the buyer details needed to respond to that request. If there is no verified match or approved delivery contact, MotoIndex does not represent the lead as delivered.</p></article>
      <article><b>04</b><h2>Storage and access</h2><p>Dealer-request records are stored in the configured production database. Administrative lead review is protected by authentication and excluded from search indexing. Deployment operators should limit access to people who need the information and set an appropriate retention and deletion process for old or closed leads.</p></article>
      <article><b>05</b><h2>Dealer partner applications</h2><p>Dealer applicants provide branch details, motorcycle brands, business contact information, an authorized contact person, optional verification-source URLs and consent to review and possible publication. Application contact details remain in the protected review workflow; only approved business information is published to the dealer directory.</p></article>
      <article><b>06</b><h2>Normal hosting logs may exist</h2><p>The hosting, CDN or security provider may process ordinary request information such as IP address, user agent, requested path and timestamps for delivery, abuse prevention and reliability. These logs are separate from the dealer-request fields stored by the MotoIndex lead form.</p></article>
      <article><b>07</b><h2>External sources and merchant links</h2><p>MotoIndex links to manufacturers, government agencies, retailers, marketplaces and original used-listing sources. Their privacy practices apply when you leave MotoIndex and visit those sites.</p></article>
      <article><b>08</b><h2>Commerce click measurement</h2><p>When the persistent commerce database is enabled, MotoIndex may store a merchant-offer identifier, product reference, merchant label and event timestamp when a merchant redirect is used. Commerce click records do not need the dealer-request form fields to measure whether a product link was opened.</p></article>
      <article><b>09</b><h2>Optional analytics</h2><p>Google Analytics or Plausible scripts load only when the deployment operator configures their environment variables. Before adding advertising pixels, new cookies, accounts or notification subscriptions, the operator should update the applicable consent and policy controls.</p></article>
      <article><b>10</b><h2>Corrections, privacy questions and deletion requests</h2><p>Use the published contact channel for a privacy question or a request concerning dealer information you submitted. MotoIndex also keeps a dedicated corrections process for published motorcycle and product data.</p><Link className="text-link" href="/corrections">Open corrections policy →</Link></article>
    </div>
  </section>;
}
