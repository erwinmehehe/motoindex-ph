import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
const contactConfigured = Boolean(email);

export const metadata: Metadata = pageMetadata({
  title: "Contact MotoIndex PH",
  description: "Contact MotoIndex PH about data corrections, product information, partnerships and general feedback.",
  path: "/contact",
  index: contactConfigured
});

function mailto(subject: string) {
  return email ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : undefined;
}

export default function ContactPage() {
  return <section className="page shell trust-page contact-page">
    <Breadcrumbs items={[{ label: "Contact" }]} />
    <div className="page-head">
      <h1>Contact MotoIndex PH</h1>
      <p>Send a correction, flag an outdated source, suggest a product or motorcycle, or get in touch about a partnership. We read messages sent to the published contact address.</p>
    </div>

    <div className="contact-grid">
      <article className="contact-card">
        <h2>Data correction</h2>
        <p>Found a wrong price, specification, model year, tire size or source? Send the page URL and the source that supports the correction.</p>
        {email ? <a className="button small" href={mailto("MotoIndex data correction")}>Send a correction</a> : <Link className="text-link" href="/corrections">See correction guidance →</Link>}
      </article>
      <article className="contact-card">
        <h2>Brand, dealer or product update</h2>
        <p>Brands, dealers and distributors can send current Philippine product pages, official price lists, model launches and fitment documentation for review.</p>
        {email ? <a className="button small" href={mailto("MotoIndex brand or dealer update")}>Send an update</a> : <Link className="text-link" href="/data-sources">See accepted sources →</Link>}
      </article>
      <article className="contact-card">
        <h2>Partnership or commercial inquiry</h2>
        <p>For affiliate, advertising, data or distribution partnerships, include the company name, your role and the exact proposal. Editorial inclusion is never guaranteed by payment.</p>
        {email ? <a className="button small" href={mailto("MotoIndex partnership inquiry")}>Contact partnerships</a> : <Link className="text-link" href="/editorial-policy">Read editorial policy →</Link>}
      </article>
      <article className="contact-card">
        <h2>General feedback</h2>
        <p>Tell us what you were trying to find, which page you used and what would have made the answer clearer or more useful.</p>
        {email ? <a className="button small" href={mailto("MotoIndex feedback")}>Send feedback</a> : <span className="contact-unavailable">Public email will appear here when configured.</span>}
      </article>
    </div>

    <div className="contact-email-panel">
      <div>
        <h2>{email ? "Email MotoIndex" : "Contact email is not configured yet"}</h2>
        <p>{email ? "This is the public contact address used for MotoIndex inquiries." : "The production launch requires NEXT_PUBLIC_CONTACT_EMAIL to be set to a real monitored mailbox. The site will not invent or publish a placeholder address."}</p>
      </div>
      {email ? <a className="contact-email" href={`mailto:${email}`}>{email}</a> : <code>NEXT_PUBLIC_CONTACT_EMAIL</code>}
    </div>

    <div className="split contact-help">
      <div>
        <h2>What helps us review a correction</h2>
        <ul className="checklist">
          <li>The MotoIndex page URL.</li>
          <li>The field or statement that looks wrong.</li>
          <li>A manufacturer, government, distributor or seller source URL.</li>
          <li>The date you checked the source.</li>
          <li>A screenshot only when the source page cannot be linked directly.</li>
        </ul>
      </div>
      <div className="info-card">
        <h3>Before sending personal information</h3>
        <p>Do not send passwords, payment details, government ID numbers or other sensitive personal information. MotoIndex does not need them to review a correction or product update.</p>
        <p><Link className="text-link" href="/privacy">Privacy policy →</Link></p>
        <p><Link className="text-link" href="/corrections">Corrections policy →</Link></p>
      </div>
    </div>
  </section>;
}
