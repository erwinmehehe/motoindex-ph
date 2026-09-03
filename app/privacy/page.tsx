import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: "Privacy information for MotoIndex PH.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return <section className="page shell trust-page">
    <div className="page-head"><h1>Privacy at MotoIndex PH</h1><p>Dealer-request forms and price-alert email collection are currently disabled. Commerce links may use privacy-minimized click measurement as described below.</p></div>
    <div className="method-steps">
      <article><b>01</b><h2>Dealer and alert forms are disabled</h2><p>MotoIndex does not currently ask for your name, phone number or email address through dealer-request or price-alert forms.</p></article>
      <article><b>02</b><h2>Normal hosting logs may exist</h2><p>The hosting, CDN or security provider used for deployment may process ordinary request information such as IP address, user agent, requested path and timestamps for delivery, abuse prevention and reliability. Deployment operators should configure retention appropriately.</p></article>
      <article><b>03</b><h2>Contact is your choice</h2><p>If you use the published contact email, your email provider and the receiving provider will process the message and addressing information needed to deliver it. Do not send sensitive account or payment information.</p></article>
      <article><b>04</b><h2>External sources and merchant links</h2><p>MotoIndex links to manufacturers, government agencies, retailers and marketplaces. Their privacy practices apply when you leave MotoIndex and visit those sites.</p></article>
      <article><b>05</b><h2>Commerce click measurement</h2><p>When the persistent commerce database is enabled, MotoIndex may store a merchant-offer identifier, product/entity reference, merchant label and event timestamp when a merchant redirect is used. The v2.9.1 click event does not store the browser referrer, user-agent string or form/contact data. This measurement is used to understand whether commerce links work and which source records need maintenance.</p></article>
      <article><b>06</b><h2>Optional analytics</h2><p>No advertising tracker is required for the site to work. Google Analytics or Plausible scripts load only when the deployment operator explicitly configures their environment variables. Before enabling optional analytics, advertising pixels, cookies, accounts, dealer lead routing or notification subscriptions, the operator should confirm the applicable consent and policy requirements.</p></article>
      <article><b>07</b><h2>Corrections and questions</h2><p>For a data correction or privacy question, use the published contact channel. MotoIndex also keeps a dedicated corrections process for published data.</p><Link className="text-link" href="/corrections">Open corrections policy →</Link></article>
    </div>
  </section>;
}
