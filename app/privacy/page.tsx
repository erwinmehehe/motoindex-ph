import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: "Privacy information for MotoIndex PH, including dealer quote requests, My Garage, price alerts, retention, analytics and commerce links.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return <section className="page shell trust-page">
    <div className="page-head"><h1>Privacy at MotoIndex PH</h1><p>MotoIndex collects personal information only when you deliberately use features that need it, such as dealer quote requests, Dealer Portal onboarding, My Garage cloud sync, used-listing inquiries, price alerts or the contact channel.</p></div>
    <div className="method-steps">
      <article><b>01</b><h2>Dealer quote requests</h2><p>A quote request may store the motorcycle and variant, city or province, cash or installment preference, optional down-payment budget, name, mobile number, optional email, consent timestamp and source page. MotoIndex uses this information to match the request to relevant verified dealers and manage the quote workflow.</p></article>
      <article><b>02</b><h2>Dealer sharing and private links</h2><p>Submitting a quote request permits MotoIndex to share the request with relevant verified dealer partners. Dealer and buyer access links are time-limited. New access links are stored as one-way hashes rather than recoverable bearer tokens. Authenticated dealers can also access assigned requests through the private Dealer Portal.</p></article>
      <article><b>03</b><h2>My Garage accounts</h2><p>My Garage works locally without an account. If you choose cloud sync, MotoIndex stores your account email, cloud Garage snapshot, configured reminder records and related account/session information. Email reminders are opt-in.</p></article>
      <article><b>04</b><h2>Export and account deletion</h2><p>Signed-in My Garage users can download an account-data export and permanently delete their cloud account from My Garage. Account deletion removes the cloud Garage, reminders, authentication records and owner-created used listings. The deletion control can also clear the local Garage from the browser where the request is made.</p></article>
      <article><b>05</b><h2>Dealer partner applications</h2><p>Dealer applicants provide branch details, brands, business contact information, an authorized contact, verification evidence and consent. Approved business details may be published. Application contact details remain in the protected operational workflow.</p></article>
      <article><b>06</b><h2>Price alerts</h2><p>When enabled, price alerts store an email address, motorcycle, target price, status, price-check history and delivery timestamps. Confirmation secrets are stored as one-way hashes. Unsubscribe links are cryptographically signed so MotoIndex does not need to keep a recoverable unsubscribe secret in the database.</p></article>
      <article><b>07</b><h2>Retention and automated cleanup</h2><p>Database-backed production deployments must configure automated retention before launch. Default limits are 180 days for closed dealer leads, 365 days for rejected dealer applications, 180 days for closed used-listing inquiries, 30 days for unsubscribed price alerts, 30 days after expiry for authentication artifacts and 365 days for outbound commerce-click events. Deployment settings may shorten these periods where appropriate.</p></article>
      <article><b>08</b><h2>Used-market inquiries</h2><p>When a buyer contacts a used-listing seller through MotoIndex, the inquiry may contain the buyer name, email, optional mobile number, message, consent time and workflow status. Closed inquiries are subject to the automated retention policy.</p></article>
      <article><b>09</b><h2>Normal hosting and security logs</h2><p>The hosting, CDN or security provider may process ordinary request information such as IP address, user agent, requested path and timestamps for delivery, abuse prevention and reliability. These infrastructure logs are separate from MotoIndex application records.</p></article>
      <article><b>10</b><h2>Commerce click measurement</h2><p>When persistent commerce measurement is enabled, MotoIndex may store an offer or product reference, merchant label and event timestamp when a merchant redirect is used. This measurement does not require the personal fields collected by dealer quote forms.</p></article>
      <article><b>11</b><h2>Analytics and advertising</h2><p>Google Analytics, Plausible or Google AdSense load only when configured by the deployment operator. If AdSense is enabled, Google and other vendors may use cookies where permitted. Advertising remains subject to applicable consent requirements. Personalized-ad settings can be managed through <a className="text-link" href="https://adssettings.google.com/" rel="noreferrer">Google Ads Settings →</a>.</p></article>
      <article><b>12</b><h2>External sites</h2><p>MotoIndex links to manufacturers, government agencies, dealers, retailers, marketplaces and original listing sources. Their own privacy practices apply after you leave MotoIndex.</p></article>
      <article><b>13</b><h2>Questions, corrections and deletion requests</h2><p>Use the published contact channel for privacy questions or requests concerning information you submitted. Published motorcycle and product-data corrections use the separate corrections process.</p><Link className="text-link" href="/corrections">Open corrections policy →</Link></article>
    </div>
  </section>;
}
