import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { helmetBrands } from "@/lib/data";
import { helmetProducts, isIndexableHelmetBrand } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { AuthorBox } from "@/components/AuthorBox";
import { php } from "@/lib/utils";
import styles from "./HelmetHub.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Helmets Philippines 2026: Prices, Brands & Guide",
  description: "Find motorcycle helmets in the Philippines by type, budget, certification, brand and riding use, with a dedicated helmet finder for the full verified catalog.",
  path: "/gear/helmets",
  index: true
});

export default function HelmetsPage(){
  const verified=helmetProducts.filter(p=>p.status==="verified").sort((a,b)=>(a.priceFromPhp??Number.MAX_SAFE_INTEGER)-(b.priceFromPhp??Number.MAX_SAFE_INTEGER)||a.brand.localeCompare(b.brand)||a.model.localeCompare(b.model));
  const brands=helmetBrands.filter(h=>isIndexableHelmetBrand(h.slug));
  const priced=verified.map(p=>p.priceFromPhp).filter((v):v is number=>typeof v==="number");
  const minPrice=priced.length?Math.min(...priced):undefined;
  const maxPrice=priced.length?Math.max(...priced):undefined;
  const ece2206=verified.filter(p=>/(?:ECE\s*)?(?:R?22[.\s-]?06|22\.06)/i.test(p.certification||""));
  const ecePreview=ece2206.filter(p=>typeof p.priceFromPhp==="number").slice(0,4);
  const popularBrands=brands.slice(0,8);

  const faqs: FaqItem[]=[
    {question:"How much is a motorcycle helmet in the Philippines?",answer:minPrice&&maxPrice?`The verified helmet models with published prices in MotoIndex currently run from about ${php(minPrice)} to ${php(maxPrice)}. Final price varies by size, graphic, visor bundle, seller and promotion.`:"Helmet prices vary by brand, model, shell, visor package, size and seller. Open the exact model and current seller source before buying."},
    {question:"Which helmet type should I buy for commuting?",answer:"A full-face helmet gives a fixed chin bar, a modular helmet adds flip-up convenience, and an open-face helmet gives more airflow while leaving the chin exposed. Fit, visibility, ventilation and the exact certification marking matter more than category name alone."},
    {question:"What does ECE 22.06 mean?",answer:"ECE 22.06 is a current UNECE motorcycle-helmet homologation standard. For a Philippine purchase, also inspect the exact helmet for the applicable PS or ICC conformity marking."},
    {question:"How do I choose the correct helmet size?",answer:"Measure your head using the helmet maker's method and use the size chart for the exact model. Try the helmet on when possible because shell shape and cheek-pad thickness differ even within one brand."}
  ];

  return <section className={`page shell helmet-hub-page ${styles.hub}`}>
    <div className="page-head">
      <span className="entity-kicker">Helmet discovery</span>
      <h1>Find the right motorcycle helmet.</h1>
      <p>Start with fit, helmet type and budget. Use the Finder for the full verified catalog, then open an exact model for sizing, certification evidence, visor details and current pricing.</p>
      <div className="helmet-shop-actions">
        <Link className="button" href="/gear/helmets/finder">Open Helmet Finder</Link>
        <Link className="button secondary" href="/gear/helmets/compare">Compare exact helmets</Link>
      </div>
    </div>

    <div className="brand-facts">
      <div><span>Verified helmets</span><strong>{verified.length}</strong></div>
      <div><span>Brands</span><strong>{brands.length}</strong></div>
      <div><span>Published price span</span><strong>{minPrice&&maxPrice?`${php(minPrice)}–${php(maxPrice)}`:"Varies"}</strong></div>
      <div><span>ECE 22.06 records</span><strong>{ece2206.length}</strong></div>
    </div>

    <section className="helmet-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Shop by type</span><h2>Choose the protection format first</h2><p>Use the type to narrow the field, then verify fit and the exact product marking before buying.</p></div></div>
      <div className="topic-grid">
        <Link href="/gear/helmets/full-face"><h3>Full-face</h3><p>Fixed chin bar for riders prioritizing coverage and weather protection.</p><b>Browse full-face →</b></Link>
        <Link href="/gear/helmets/modular"><h3>Modular</h3><p>Flip-up convenience with extra hinge hardware and usually more weight.</p><b>Browse modular →</b></Link>
        <Link href="/gear/helmets/half-face"><h3>Open / half-face</h3><p>More airflow and facial openness for city-focused riding.</p><b>Browse open-face →</b></Link>
        <Link href="/gear/helmets/for-commuting"><h3>Commuting</h3><p>Shortlist around daily comfort, visibility, rain and ventilation.</p><b>Browse commuter helmets →</b></Link>
      </div>
    </section>

    <section className="helmet-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Shop by budget</span><h2>Set the budget, then check the exact helmet</h2><p>Price is not a safety score. Use it to narrow choices, then verify fit, certification and local conformity marking.</p></div></div>
      <div className="topic-grid">
        <Link href="/gear/helmets/under-3000"><h3>Under ₱3,000</h3><p>Entry-price verified helmet records with exact product pages.</p><b>Browse under ₱3K →</b></Link>
        <Link href="/gear/helmets/under-5000"><h3>Under ₱5,000</h3><p>A wider range for fit, visor quality, ventilation and replaceable parts.</p><b>Browse under ₱5K →</b></Link>
        <Link href="/gear/helmets/finder"><h3>Set my own budget</h3><p>Filter the full catalog by price, helmet type and other requirements.</p><b>Use Helmet Finder →</b></Link>
        <Link href="/guides/motorcycle-helmet-size-guide"><h3>Size before graphics</h3><p>Measure first and use the exact model size chart.</p><b>Helmet sizing guide →</b></Link>
      </div>
    </section>

    <section className="helmet-master-section">
      <div className="section-head inline-head"><div><span className="section-kicker">ECE 22.06</span><h2>Helmets with an ECE 22.06 reference</h2><p>{ece2206.length} verified records explicitly reference ECE 22.06/R22.06. The exact Philippine unit still needs the applicable local conformity marking.</p></div><Link href="/gear/helmets/ece-22-06">Browse all ECE 22.06 →</Link></div>
      {ecePreview.length>0&&<div className="product-grid hub-product-rail">{ecePreview.map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/gear/helmets/${p.brandSlug}/${p.slug}`,category:p.helmetType,brand:p.brand,model:p.model,meta:"ECE 22.06",status:p.status,priceFromPhp:p.priceFromPhp}} />)}</div>}
      <p className="helmet-master-note"><Link href="/guides/motorcycle-helmet-certification-philippines">Read the Philippine helmet certification guide →</Link></p>
    </section>

    <section className="helmet-master-section">
      <div className="section-head inline-head"><div><span className="section-kicker">Popular brands</span><h2>Start with a helmet brand</h2><p>Brand pages keep each product family and its source trail together.</p></div><Link href="/gear/helmets/brands">All helmet brands →</Link></div>
      <div className="helmet-grid helmet-brand-grid">{popularBrands.map(h=><article key={h.slug}><div className="helmet-brand-badge" aria-hidden="true">{h.brand.slice(0,2).toUpperCase()}</div><div className="helmet-brand-copy"><h3>{h.brand}</h3><p>{h.positioning}</p></div><div className="topic-action"><Link href={`/gear/helmets/${h.slug}`}>View {h.brand} →</Link></div></article>)}</div>
    </section>

    <section className="helmet-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Full catalog</span><h2>Need all {verified.length} verified helmet records?</h2><p>The landing page stays focused on discovery. The Helmet Finder is the full filtering experience.</p></div><Link className="button" href="/gear/helmets/finder">Browse all helmets</Link></div>
    </section>

    <AuthorBox />
    <FaqSection title="Motorcycle helmet buying questions" items={faqs}/>
  </section>;
}
