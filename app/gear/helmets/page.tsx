import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import { helmetBrands } from "@/lib/data";
import { helmetProducts, isIndexableHelmetBrand } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { php } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Helmet Prices Philippines 2026: Brands & Models",
  description: "Compare motorcycle helmet prices in the Philippines by brand and type, with checked models, certifications, sizing, source dates and helmet finder tools.",
  path: "/gear/helmets",
  index: true
});

export default function HelmetsPage(){
  const verified=helmetProducts.filter(p=>p.status==="verified");
  const brands=helmetBrands.filter(h=>isIndexableHelmetBrand(h.slug));
  const priced=verified.map(p=>p.priceFromPhp).filter((v):v is number=>typeof v==="number");
  const minPrice=priced.length?Math.min(...priced):undefined;
  const maxPrice=priced.length?Math.max(...priced):undefined;
  const faqs: FaqItem[]=[
    {question:"How much is a motorcycle helmet in the Philippines?",answer:minPrice&&maxPrice?`MotoIndex’s currently checked helmet catalog has observed starting prices from ${php(minPrice)} to ${php(maxPrice)}. Prices depend on brand, model, shell, visor package, size and seller, so open the product source before buying.`:"Helmet prices vary by brand, model, shell, visor package, size and seller. Open the checked model pages for dated price observations."},
    {question:"Which helmet brands can I compare on MotoIndex?",answer:`MotoIndex currently has indexable brand pages for ${brands.map(b=>b.brand).join(", ")}. A brand is published only after enough current product records have been checked.`},
    {question:"Should I choose full-face, modular or half-face?",answer:"Choose based on the protection format, fit, riding use and the exact certified unit available to you. Use the category pages and Helmet Finder to narrow the catalog, then try the helmet on when possible."},
    {question:"Does MotoIndex guarantee a helmet is certified?",answer:"No. MotoIndex records certification details from the cited source, but buyers should inspect the PS or ICC marking and certification label on the exact helmet sold in the Philippines."}
  ];
  return <section className="page shell">
    <div className="page-head"><h1>Motorcycle helmets and prices in the Philippines</h1><p>Browse helmet brands, formats and individual models. Compare current price observations, certification details, shell construction and visor setup before checking the exact fit and unit marking.</p></div>
    <div className="brand-facts"><div><span>Checked models</span><strong>{verified.length}</strong></div><div><span>Indexable brands</span><strong>{brands.length}</strong></div><div><span>Observed starting prices</span><strong>{minPrice&&maxPrice?`${php(minPrice)}–${php(maxPrice)}`:"Check products"}</strong></div></div>
    <div className="helmet-shop-actions"><Link className="button" href="/gear/helmets/finder">Find my helmet</Link><Link className="button secondary" href="/gear/helmets/compare">Compare helmets</Link></div>
    <div className="helmet-category-links"><Link href="/gear/helmets/full-face"><strong>Full-face</strong><span>Fixed chin bar · sport, commuter and premium models</span></Link><Link href="/gear/helmets/half-face"><strong>Half-face / open-face</strong><span>City-focused helmets without a fixed chin bar</span></Link><Link href="/gear/helmets/modular"><strong>Modular</strong><span>Flip-up helmets for commuting and touring</span></Link><Link href="/gear/helmets/brands"><strong>Compare brands</strong><span>Models checked, types covered and price ranges</span></Link></div>
    <div className="section-head inline-head"><div><h2>Shop helmets by budget, certification and use</h2><p>These pages filter the same verified product records instead of creating separate unsupported product claims.</p></div></div>
    <div className="topic-grid">
      <article><h2>Helmets under ₱3,000</h2><p>Compare checked entry-price helmets while keeping fit, visor and certification evidence visible.</p><div className="topic-action"><Link href="/gear/helmets/under-3000">Compare under ₱3,000 →</Link></div></article>
      <article><h2>Helmets under ₱5,000</h2><p>Compare verified road helmets in a wider commuter budget with model-level source checks.</p><div className="topic-action"><Link href="/gear/helmets/under-5000">Compare under ₱5,000 →</Link></div></article>
      <article><h2>ECE 22.06 helmets</h2><p>See models whose checked certification record explicitly references ECE 22.06 or R22.06.</p><div className="topic-action"><Link href="/gear/helmets/ece-22-06">View ECE 22.06 models →</Link></div></article>
      <article><h2>Intercom-ready helmets</h2><p>Compare helmets with recorded speaker or communication-system provision.</p><div className="topic-action"><Link href="/gear/helmets/intercom-ready">Compare intercom-ready helmets →</Link></div></article>
      <article><h2>Helmets for commuting</h2><p>Compare full-face, modular and open-face tradeoffs for daily Philippine riding.</p><div className="topic-action"><Link href="/gear/helmets/for-commuting">Open commuter helmet guide →</Link></div></article>
      <article><h2>Helmet fit and certification guides</h2><p>Measure your head correctly and understand the local conformity checks before buying.</p><div className="topic-action"><Link href="/guides/motorcycle-helmet-size-guide">Open helmet size guide →</Link></div></article>
    </div>
    <div className="helmet-grid">{brands.map(h=><article key={h.slug}><div className="helmet-icon">◖</div><h2>{h.brand}</h2><p>{h.positioning}</p><div className="topic-action"><Link href={`/gear/helmets/${h.slug}`}>View brand catalog →</Link></div></article>)}</div>
    <div className="section-head inline-head"><div><h2>Compare models and price checks</h2></div><Link href="/gear/helmets/brands">Compare helmet brands →</Link></div>
    <div className="product-grid">{verified.map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/gear/helmets/${p.brandSlug}/${p.slug}`,category:"Helmet",brand:p.brand,model:p.model,meta:`${p.helmetType}${p.sizes.length?` · ${p.sizes.join(" / ")}`:""}`,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}</div>
    <FaqSection title="Motorcycle helmet price and buying questions" items={faqs}/>
  </section>;
}
