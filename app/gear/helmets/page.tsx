import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import { helmetBrands } from "@/lib/data";
import { helmetProducts, isIndexableHelmetBrand } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { php } from "@/lib/utils";
import { AuthorBox } from "@/components/AuthorBox";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Helmet Prices Philippines 2026: Brands & Models",
  description: "Compare motorcycle helmet prices in the Philippines by brand and type, with model guides, certification notes, sizing and helmet finder tools.",
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
    {question:"How much is a motorcycle helmet in the Philippines?",answer:minPrice&&maxPrice?`Helmet models in this guide currently have published starting prices from ${php(minPrice)} to ${php(maxPrice)}. Prices depend on brand, model, shell, visor package, size and seller, so open the product source before buying.`:"Helmet prices vary by brand, model, shell, visor package, size and seller. Open the model guides and current seller sources before buying."},
    {question:"Which helmet brands can I compare on MotoIndex?",answer:`You can compare current brand pages for ${brands.map(b=>b.brand).join(", ")}. Open a brand to compare its current models, price references and documented features.`},
    {question:"Should I choose full-face, modular or half-face?",answer:"Choose based on the protection format, fit, riding use and the exact certified unit available to you. Use the category pages and Helmet Finder to narrow the catalog, then try the helmet on when possible."},
    {question:"Does MotoIndex guarantee a helmet is certified?",answer:"No. Certification can vary by market and unit. Inspect the PS or ICC marking and certification label on the exact helmet sold in the Philippines."}
  ];
  return <section className="page shell helmet-hub-page">
    <div className="page-head"><h1>Motorcycle helmets and prices in the Philippines</h1><p>Browse helmet brands, formats and individual models. Compare published starting prices, certification details, shell construction and visor setup before checking the exact fit and unit marking.</p></div>
    <div className="brand-facts"><div><span>Helmet models</span><strong>{verified.length}</strong></div><div><span>Brands</span><strong>{brands.length}</strong></div><div><span>Published starting prices</span><strong>{minPrice&&maxPrice?`${php(minPrice)}–${php(maxPrice)}`:"Check products"}</strong></div></div>
    <div className="helmet-shop-actions"><Link className="button" href="/gear/helmets/finder">Find my helmet</Link><Link className="button secondary" href="/gear/helmets/compare">Compare helmets</Link></div>
    <div className="helmet-category-links"><Link href="/gear/helmets/full-face"><strong>Full-face</strong><span>Fixed chin bar · sport, commuter and premium models</span></Link><Link href="/gear/helmets/half-face"><strong>Half-face / open-face</strong><span>City-focused helmets without a fixed chin bar</span></Link><Link href="/gear/helmets/modular"><strong>Modular</strong><span>Flip-up helmets for commuting and touring</span></Link><Link href="/gear/helmets/brands"><strong>Compare brands</strong><span>Models checked, types covered and price ranges</span></Link></div>
    <div className="section-head inline-head helmet-hub-section-head"><div><span className="section-kicker">Shop by need</span><h2>Find the right helmet faster</h2><p>Start with budget, certification or riding use, then narrow to the exact model.</p></div></div>
    <div className="topic-grid helmet-seo-grid">
      <article><h2>Helmets under ₱3,000</h2><p>Compare entry-price helmets while keeping fit, visor and certification details visible.</p><div className="topic-action"><Link href="/gear/helmets/under-3000">Compare under ₱3,000 →</Link></div></article>
      <article><h2>Helmets under ₱5,000</h2><p>Compare road helmets in a wider commuter budget with model-level price and product details.</p><div className="topic-action"><Link href="/gear/helmets/under-5000">Compare under ₱5,000 →</Link></div></article>
      <article><h2>ECE 22.06 helmets</h2><p>See models whose checked certification record explicitly references ECE 22.06 or R22.06.</p><div className="topic-action"><Link href="/gear/helmets/ece-22-06">View ECE 22.06 models →</Link></div></article>
      <article><h2>Intercom-ready helmets</h2><p>Compare helmets with recorded speaker or communication-system provision.</p><div className="topic-action"><Link href="/gear/helmets/intercom-ready">Compare intercom-ready helmets →</Link></div></article>
      <article><h2>Helmets for commuting</h2><p>Compare full-face, modular and open-face tradeoffs for daily Philippine riding.</p><div className="topic-action"><Link href="/gear/helmets/for-commuting">Open commuter helmet guide →</Link></div></article>
      <article><h2>Helmet fit and certification guides</h2><p>Measure your head correctly and understand the local conformity checks before buying.</p><div className="topic-action"><Link href="/guides/motorcycle-helmet-size-guide">Open helmet size guide →</Link></div></article>
    </div>
    <div className="section-head inline-head helmet-hub-section-head"><div><span className="section-kicker">Popular comparisons</span><h2>Compare before you buy</h2><p>Side-by-side comparisons using model-level product details, not paid rankings.</p></div><Link href="/gear/helmets/compare">Compare exact models →</Link></div>
    <div className="topic-grid helmet-comparison-link-grid">
      <article><h2>KYT vs LS2</h2><p>Compare KYT and LS2 models by price, format, visor equipment, intercom provision and certification notes.</p><div className="topic-action"><Link href="/gear/helmets/compare/kyt-vs-ls2">Compare KYT vs LS2 →</Link></div></article>
      <article><h2>EVO vs Spyder</h2><p>Compare two common Philippine helmet brands using model-level records rather than brand assumptions.</p><div className="topic-action"><Link href="/gear/helmets/compare/evo-vs-spyder">Compare EVO vs Spyder →</Link></div></article>
      <article><h2>Full-face vs modular</h2><p>Compare coverage, convenience, weight and model-level equipment across the two road-helmet formats.</p><div className="topic-action"><Link href="/gear/helmets/compare/full-face-vs-modular">Full-face vs modular →</Link></div></article>
    </div>
    <div className="section-head inline-head helmet-hub-section-head"><div><span className="section-kicker">Browse by brand</span><h2>Helmet brands</h2><p>Open a brand page to compare models, prices and documented features.</p></div><Link href="/gear/helmets/brands">Compare all brands →</Link></div>
    <div className="helmet-grid helmet-brand-grid">{brands.map(h=><article key={h.slug}><div className="helmet-brand-badge" aria-hidden="true">{h.brand.slice(0,2).toUpperCase()}</div><div className="helmet-brand-copy"><h2>{h.brand}</h2><p>{h.positioning}</p></div><div className="topic-action"><Link href={`/gear/helmets/${h.slug}`}>View brand →</Link></div></article>)}</div>
    <div className="section-head inline-head"><div><h2>Compare helmet models and prices</h2></div><Link href="/gear/helmets/brands">Compare helmet brands →</Link></div>
    <div className="product-grid">{verified.map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/gear/helmets/${p.brandSlug}/${p.slug}`,category:"Helmet",brand:p.brand,model:p.model,meta:`${p.helmetType}${p.sizes.length?` · ${p.sizes.join(" / ")}`:""}`,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}</div>
    <AuthorBox />
    <FaqSection title="Motorcycle helmet price and buying questions" items={faqs}/>
  </section>;
}
