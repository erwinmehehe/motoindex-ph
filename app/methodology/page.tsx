import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "MotoIndex Data Methodology",
  description: "How MotoIndex PH reviews motorcycle prices, specifications, helmet information, tire fitment, seller offers and used-market data.",
  path: "/methodology"
});

export default function MethodologyPage() {
  return <section className="page shell trust-page">
    <div className="page-head">
      <h1>How we review prices, specs and fitment.</h1>
      <p>MotoIndex separates current models from previous generations, labels estimates clearly and keeps uncertain records out of the current shopping catalog.</p>
    </div>
    <div className="method-steps">
      <article><b>01</b><h2>Identify the exact model</h2><p>Generations, trims, helmet models and accessory products are kept separate so an older or different version does not inherit the wrong price or specification.</p></article>
      <article><b>02</b><h2>Review changing information</h2><p>Prices, variants, availability and regulations can change. Current shopping pages are reviewed as the underlying market changes.</p></article>
      <article><b>03</b><h2>Keep historical pricing historical</h2><p>Previous-generation launch prices stay clearly separated from current new-bike pricing so an old figure is not presented as today's dealer quote.</p></article>
      <article><b>04</b><h2>Do not confuse size with fit</h2><p>A matching tire size does not prove full fitment, and a top-box capacity does not prove a bracket fits. Exact compatibility is kept separate from general guidance.</p></article>
      <article><b>05</b><h2>Show uncertainty</h2><p>If information is incomplete or conflicting, MotoIndex either labels the limitation or keeps the record outside the current shopping catalog until it can be reviewed.</p></article>
    </div>
    <div className="note-box"><h2>Labels you may see</h2><p><b>Specifications checked</b> means the model has passed the current review workflow. <b>Needs update</b> means the record should be reviewed again. <b>General guidance</b> means the information helps narrow options but is not an exact seller quote or fitment guarantee.</p></div>
    <p className="trust-links"><Link href="/corrections">Report a correction →</Link></p>
  </section>;
}
