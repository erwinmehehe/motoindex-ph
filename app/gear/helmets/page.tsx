import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { helmetBrands } from "@/lib/data";
import { helmetProducts, isIndexableHelmetBrand } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { AuthorBox } from "@/components/AuthorBox";
import { php } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Helmets Philippines 2026: Prices, Brands & Guide",
  description: "One complete Philippine motorcycle helmet guide covering prices, brands, full-face, modular, open-face, ECE 22.06, intercom, fit and commuting.",
  path: "/gear/helmets",
  index: true
});

function ProductGrid({ products }: { products: typeof helmetProducts }) {
  if (!products.length) return <div className="note-box compact-note"><p>No matching verified helmet is published right now.</p></div>;
  return <div className="product-grid">{products.map(p=><ProductCard key={p.id} item={{
    entityId:p.id,
    href:`/gear/helmets/${p.brandSlug}/${p.slug}`,
    category:p.helmetType,
    brand:p.brand,
    model:p.model,
    meta:[p.certification,p.intercomReady?"Intercom-ready":undefined].filter(Boolean).join(" · "),
    status:p.status,
    priceFromPhp:p.priceFromPhp
  }}/>)}</div>;
}

export default function HelmetsPage(){
  const verified=helmetProducts.filter(p=>p.status==="verified").sort((a,b)=>(a.priceFromPhp??Number.MAX_SAFE_INTEGER)-(b.priceFromPhp??Number.MAX_SAFE_INTEGER)||a.brand.localeCompare(b.brand)||a.model.localeCompare(b.model));
  const brands=helmetBrands.filter(h=>isIndexableHelmetBrand(h.slug));
  const priced=verified.map(p=>p.priceFromPhp).filter((v):v is number=>typeof v==="number");
  const minPrice=priced.length?Math.min(...priced):undefined;
  const maxPrice=priced.length?Math.max(...priced):undefined;

  const fullFace=verified.filter(p=>p.helmetType==="Full face");
  const modular=verified.filter(p=>p.helmetType==="Modular");
  const openFace=verified.filter(p=>["Open face","Half face","Hybrid"].includes(p.helmetType));
  const under3000=verified.filter(p=>typeof p.priceFromPhp==="number"&&p.priceFromPhp<=3000);
  const under5000=verified.filter(p=>typeof p.priceFromPhp==="number"&&p.priceFromPhp<=5000);
  const ece2206=verified.filter(p=>/(?:ECE\s*)?(?:R?22[.\s-]?06|22\.06)/i.test(p.certification||""));
  const intercom=verified.filter(p=>p.intercomReady);
  const commuting=verified.filter(p=>["Full face","Modular","Half face","Open face"].includes(p.helmetType)).slice(0,12);

  const faqs: FaqItem[]=[
    {question:"How much is a motorcycle helmet in the Philippines?",answer:minPrice&&maxPrice?`The verified helmet models with published prices on this page currently start from ${php(minPrice)} to ${php(maxPrice)}. Final price can change with size, graphic, visor bundle, seller and promotion.`:"Helmet prices vary by brand, model, shell, visor package, size and seller. Open the exact model and current seller source before buying."},
    {question:"Which helmet type should I buy for commuting?",answer:"A full-face helmet gives a fixed chin bar, a modular helmet adds flip-up convenience, and an open-face helmet gives more airflow while leaving the chin exposed. Fit, visibility, ventilation and the exact certification marking matter more than choosing a category by name alone."},
    {question:"What does ECE 22.06 mean?",answer:"ECE 22.06 is a current UNECE motorcycle-helmet homologation standard. For a Philippine purchase, also inspect the exact helmet for the applicable PS or ICC conformity marking instead of relying on an overseas label alone."},
    {question:"What does intercom-ready mean?",answer:"It means the model has recorded provision for communication hardware such as speaker or microphone space. It does not guarantee that every intercom kit fits without checking speaker depth, microphone placement and mounting clearance."},
    {question:"How do I choose the correct helmet size?",answer:"Measure your head using the helmet maker's method and use the size chart for the exact model. Try the helmet on when possible because shell shape and cheek-pad thickness can differ even within one brand."},
    {question:"Does a more expensive helmet automatically mean safer?",answer:"No. Price can reflect shell material, finish, aerodynamics, visor hardware, liner quality and brand positioning. Check the exact model's certification, local conformity marking and fit rather than using price as a safety score."}
  ];

  return <section className="page shell helmet-hub-page">
    <div className="page-head">
      <span className="entity-kicker">Philippine helmet buying guide</span>
      <h1>Motorcycle helmets in the Philippines: prices, types and brands</h1>
      <p>Use one guide to compare helmet prices, protection formats, ECE 22.06 references, intercom provision, commuting choices, sizing and current brand/model pages. Open the exact helmet before buying to verify fit and the marking on the local unit.</p>
      <div className="helmet-shop-actions">
        <Link className="button" href="/gear/helmets/finder">Find my helmet</Link>
        <Link className="button secondary" href="/gear/helmets/compare">Compare exact helmets</Link>
      </div>
    </div>

    <div className="brand-facts">
      <div><span>Verified models</span><strong>{verified.length}</strong></div>
      <div><span>Brands</span><strong>{brands.length}</strong></div>
      <div><span>Published price span</span><strong>{minPrice&&maxPrice?`${php(minPrice)}–${php(maxPrice)}`:"Check products"}</strong></div>
      <div><span>ECE 22.06 records</span><strong>{ece2206.length}</strong></div>
    </div>

    <nav className="product-entity-nav helmet-master-nav" aria-label="Helmet guide sections">
      <a href="#full-face">Full-face</a>
      <a href="#modular">Modular</a>
      <a href="#open-face">Open-face</a>
      <a href="#under-3000">Under ₱3K</a>
      <a href="#under-5000">Under ₱5K</a>
      <a href="#ece-22-06">ECE 22.06</a>
      <a href="#intercom-ready">Intercom</a>
      <a href="#commuting">Commuting</a>
      <a href="#brands">Brands</a>
      <a href="#models">All models</a>
    </nav>

    <section className="helmet-master-intro">
      <div className="section-head compact"><div><span className="section-kicker">Start here</span><h2>Choose the helmet by fit and riding use first</h2><p>A helmet category is only the starting point. The exact fit, conformity marking, visor system, ventilation, weight and replacement-parts availability decide whether a model works for you day to day.</p></div></div>
      <div className="topic-grid">
        <article><h3>Full-face</h3><p>A fixed chin bar gives the most complete coverage among the common road formats. Good for riders prioritizing coverage, weather protection and highway use.</p><a href="#full-face">See full-face models →</a></article>
        <article><h3>Modular</h3><p>A flip-up chin bar is convenient at stops and checkpoints but usually adds weight and mechanical complexity.</p><a href="#modular">See modular models →</a></article>
        <article><h3>Open-face</h3><p>More airflow and easier communication in city use, while the chin and jaw remain more exposed than in a full-face helmet.</p><a href="#open-face">See open-face models →</a></article>
        <article><h3>Fit before graphics</h3><p>Measure your head and use the exact model chart. A helmet that looks right but moves excessively or creates a pressure hotspot is the wrong choice.</p><Link href="/guides/motorcycle-helmet-size-guide">Helmet size guide →</Link></article>
      </div>
    </section>

    <section id="full-face" className="helmet-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Helmet type</span><h2>Full-face motorcycle helmets</h2><p>Fixed-chin-bar helmets for commuting, touring and sport riding. Compare fit, visor setup, ventilation, shell construction and certification on the exact model.</p></div><strong>{fullFace.length} models</strong></div>
      <ProductGrid products={fullFace.slice(0,12)} />
    </section>

    <section id="modular" className="helmet-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Helmet type</span><h2>Modular and flip-up motorcycle helmets</h2><p>Useful for riders who want a chin bar that can open at stops. Check P/J homologation where claimed, hinge operation, weight and intercom clearance.</p></div><strong>{modular.length} models</strong></div>
      <ProductGrid products={modular.slice(0,12)} />
    </section>

    <section id="open-face" className="helmet-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Helmet type</span><h2>Open-face and half-face motorcycle helmets</h2><p>City-focused choices with more airflow and facial openness. Compare visor coverage, sun visor, fit and local conformity marking before buying.</p></div><strong>{openFace.length} models</strong></div>
      <ProductGrid products={openFace.slice(0,12)} />
    </section>

    <section id="under-3000" className="helmet-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Budget</span><h2>Motorcycle helmets under ₱3,000</h2><p>This is a price filter, not a safety ranking. Check the exact Philippine unit for PS or ICC marking, correct fit, secure retention and replacement-visor availability.</p></div><strong>{under3000.length} models</strong></div>
      <ProductGrid products={under3000.slice(0,12)} />
    </section>

    <section id="under-5000" className="helmet-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Budget</span><h2>Motorcycle helmets under ₱5,000</h2><p>Use the wider budget to compare fit, ventilation, visor quality, removable liners and parts availability. A graphic or visor bundle can push a specific variant above the starting price shown.</p></div><strong>{under5000.length} models</strong></div>
      <ProductGrid products={under5000.slice(0,12)} />
    </section>

    <section id="ece-22-06" className="helmet-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Certification</span><h2>ECE 22.06 motorcycle helmets</h2><p>These models explicitly reference ECE 22.06 or R22.06 in the checked product record. For Philippine use, also inspect the exact helmet for the applicable PS or ICC conformity marking.</p></div><strong>{ece2206.length} models</strong></div>
      <ProductGrid products={ece2206.slice(0,12)} />
      <p className="helmet-master-note"><Link href="/guides/motorcycle-helmet-certification-philippines">Read the Philippine helmet certification guide →</Link></p>
    </section>

    <section id="intercom-ready" className="helmet-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Communication</span><h2>Intercom-ready motorcycle helmets</h2><p>Speaker pockets or communication-system provision can make installation cleaner, but speaker depth, microphone routing and mount clearance still need to match your exact intercom.</p></div><strong>{intercom.length} models</strong></div>
      <ProductGrid products={intercom.slice(0,12)} />
    </section>

    <section id="commuting" className="helmet-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Daily riding</span><h2>Motorcycle helmets for commuting</h2><p>For Philippine stop-go riding, compare coverage with heat, rain, visor fogging, weight and repeated daily comfort. There is no single best format for every route.</p></div></div>
      <div className="topic-grid">
        <article><h3>Heavy city traffic</h3><p>Prioritize secure fit, low-speed ventilation, usable visor positions and a rain/fog plan. Modular convenience can help at stops, but extra weight may matter on long days.</p></article>
        <article><h3>Mixed city and highway</h3><p>A full-face or well-homologated modular model is a common starting point because weather protection and fixed coverage matter more as speed increases.</p></article>
        <article><h3>Daily intercom use</h3><p>Check speaker-pocket depth, microphone placement and controls with gloves. Do not cut the impact liner or shell to force an installation.</p></article>
        <article><h3>Daily fit check</h3><p>The helmet should stay stable when you move it, without a painful pressure point. Padding settles with use, so a new helmet should not start loose.</p></article>
      </div>
      <ProductGrid products={commuting} />
    </section>

    <section id="brands" className="helmet-master-section">
      <div className="section-head inline-head"><div><span className="section-kicker">Browse by brand</span><h2>Motorcycle helmet brands</h2><p>Brand pages stay separate because each is a real product family with its own current lineup and source trail.</p></div></div>
      <div className="helmet-grid helmet-brand-grid">{brands.map(h=><article key={h.slug}><div className="helmet-brand-badge" aria-hidden="true">{h.brand.slice(0,2).toUpperCase()}</div><div className="helmet-brand-copy"><h3>{h.brand}</h3><p>{h.positioning}</p></div><div className="topic-action"><Link href={`/gear/helmets/${h.slug}`}>View {h.brand} →</Link></div></article>)}</div>
    </section>

    <section id="models" className="helmet-master-section">
      <div className="section-head inline-head"><div><span className="section-kicker">All models</span><h2>Compare verified helmet models</h2><p>Open the exact product page for its current source, sizing, shell, visor, certification and available Philippine price information.</p></div><Link href="/gear/helmets/finder">Filter with Helmet Finder →</Link></div>
      <ProductGrid products={verified} />
    </section>

    <AuthorBox />
    <FaqSection title="Motorcycle helmet buying questions" items={faqs}/>
  </section>;
}
