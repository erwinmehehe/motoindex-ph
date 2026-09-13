import type { Metadata } from "next";
import Link from "next/link";
import { publicMotorcycles } from "@/lib/data";
import { pageMetadata } from "@/lib/site";
import { FitmentExplorer } from "@/components/FitmentExplorer";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Accessory Fitment Finder Philippines",
  description: "Search Philippine motorcycle models, check stock front and rear tire sizes, and open exact fitment records before buying tires or accessories.",
  path: "/fitment",
  index: publicMotorcycles.length > 0
});

export default function FitmentPage() {
  const models = publicMotorcycles.map(({ id, make, makeSlug, model, slug, category, frontTire, rearTire }) => ({
    id, make, makeSlug, model, slug, category, frontTire, rearTire
  }));

  return <section className="page shell fitment-hub-page">
    <div className="page-head">
      <span className="entity-kicker">Motorcycle fitment finder</span>
      <h1>Check what actually fits your motorcycle.</h1>
      <p>Start with the exact model and its stock tire sizes. For accessories, look for a model-specific bracket, mounting record or manufacturer fitment reference instead of assuming that size or capacity alone means it fits.</p>
      <div className="hero-actions"><Link className="button" href="/tires">Tire size guide</Link><Link className="button secondary" href="/motorcycles">Browse motorcycles</Link></div>
    </div>

    <section className="fitment-guide-panel">
      <div><span>01</span><h2>Choose the exact model</h2><p>Generation and variant matter. Similar model names can use different wheels, racks or mounting points.</p></div>
      <div><span>02</span><h2>Check stock dimensions</h2><p>Use front and rear tire size as the starting point, then verify load, speed rating, construction and clearance.</p></div>
      <div><span>03</span><h2>Open fitment evidence</h2><p>The motorcycle page keeps tire sizes and model-specific accessory records together so you can verify before ordering.</p></div>
    </section>

    {models.length ? <FitmentExplorer models={models} /> : <div className="note-box"><h2>Fitment records are being updated</h2><p>Motorcycle specifications still need checking before the fitment directory is published.</p></div>}

    <div className="note-box fitment-safety-note"><h2>Matching a size is not the same as complete fitment</h2><p>For tires, confirm the full specification and motorcycle manufacturer guidance. For boxes, racks, mounts and other accessories, confirm the exact bracket or mounting system for your motorcycle.</p></div>
  </section>;
}
