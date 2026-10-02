import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EntityMedia } from "@/components/EntityMedia";
import { EntityVerificationFallback } from "@/components/EntityVerificationFallback";
import { pageMetadata } from "@/lib/site";
import { helmetBrands } from "@/lib/data";
import { helmetProducts, isIndexableHelmetBrand } from "@/lib/catalog";
import { hasRenderableProductMedia } from "@/lib/media";
import { ProductCard } from "@/components/ProductCard";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { AuthorBox } from "@/components/AuthorBox";
import { php } from "@/lib/utils";
import { CTAGroup, InfoPanel, PageHero, ProductGrid, SectionHeader, StatRow } from "@/components/ui";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Helmets Philippines 2026: Prices, Brands & Guide",
  description: "One complete Philippine motorcycle helmet guide covering prices, brands, full-face, modular, open-face, ECE 22.06, intercom, fit and commuting.",
  path: "/gear/helmets",
  index: true,
  image: "/media/helmets/kyt-tt-course.webp",
  imageAlt: "KYT TT-Course full-face motorcycle helmet",
  imageWidth: 1200,
  imageHeight: 1200
});

function compactHelmetMeta(product: (typeof helmetProducts)[number]) {
  const certification = product.certification || "";
  let certificationLabel: string | undefined;
  if (/(?:ECE\s*)?(?:R?22[.\s-]?06|22\.06)/i.test(certification)) certificationLabel = "ECE 22.06";
  else if (/ECE/i.test(certification)) certificationLabel = "ECE";
  else if (/DOT/i.test(certification)) certificationLabel = "DOT";
  else if (/\b(?:PS|ICC)\b/i.test(certification)) certificationLabel = "PS/ICC check";
  return [certificationLabel, product.intercomReady ? "Intercom-ready" : undefined].filter(Boolean).join(" · ");
}

function HelmetProductGrid({ products, limit = 8 }: { products: typeof helmetProducts; limit?: number }) {
  const visible = products.filter(product=>hasRenderableProductMedia(product.id)).slice(0, limit);
  if (!visible.length) return <InfoPanel subtle><p>No matching verified helmet is published right now.</p></InfoPanel>;
  return <ProductGrid className="helmet-product-grid" density="compact">{visible.map(p=><ProductCard key={p.id} item={{
    entityId:p.id,
    href:`/gear/helmets/${p.brandSlug}/${p.slug}`,
    category:p.helmetType,
    brand:p.brand,
    model:p.model,
    meta:compactHelmetMeta(p),
    status:p.status,
    priceFromPhp:p.priceFromPhp
  }}/>)}</ProductGrid>;
}

function HelmetPreviewGrid({ products, limit = 8 }: { products: typeof helmetProducts; limit?: number }) {
  const visible=products.filter(product=>hasRenderableProductMedia(product.id)).slice(0,limit);
  return <div className="helmet-preview-grid">{visible.map(product=><Link className="helmet-preview-card" href={`/gear/helmets/${product.brandSlug}/${product.slug}`} key={product.id}>
    <div className="helmet-preview-media"><EntityMedia entityType="helmet" entityId={product.id} showCredit={false} fallback={<EntityVerificationFallback brand={product.brand} model={product.model} kind="helmet" />} /></div>
    <div className="helmet-preview-copy"><span>{product.helmetType}</span><h3>{product.brand} {product.model}</h3>{compactHelmetMeta(product)&&<p>{compactHelmetMeta(product)}</p>}<div>{typeof product.priceFromPhp==="number"?<strong>From {php(product.priceFromPhp)}</strong>:<span /> }<b>View →</b></div></div>
  </Link>)}</div>;
}

const HELMET_MOCKUP_CSS = `
.helmet-mockup-page{width:min(1280px,calc(100% - 32px))}
.helmet-mockup-hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(400px,1fr);gap:28px;align-items:center;margin-top:10px}
.helmet-mockup-visual{position:relative;min-height:300px;overflow:hidden;border:1px solid var(--mi-color-line);border-radius:var(--mi-radius-sm);background:var(--mi-color-surface)}
.helmet-mockup-badge{position:absolute;z-index:3;top:12px;left:12px;padding:5px 8px;border:1px solid var(--mi-color-line);border-radius:var(--mi-radius-xs);background:var(--mi-color-surface);color:var(--mi-color-copy);font-size:8px;font-weight:850;text-transform:uppercase}
.helmet-mockup-media{position:absolute;inset:22px 18px 30px}.helmet-mockup-media,.helmet-mockup-media>*{width:100%;height:100%}.helmet-mockup-media img{width:100%;height:100%;object-fit:contain}
.helmet-mockup-caption{position:absolute;z-index:3;right:12px;bottom:12px;padding:8px 10px;border:1px solid var(--mi-color-line);border-radius:var(--mi-radius-xs);background:var(--mi-color-surface)}.helmet-mockup-caption small,.helmet-mockup-caption strong,.helmet-mockup-caption span{display:block}.helmet-mockup-caption small{color:var(--mi-color-muted);font-size:8px;text-transform:uppercase}.helmet-mockup-caption strong{font-size:13px}.helmet-mockup-caption span{color:var(--mi-color-primary);font-size:9px;font-weight:850}
.helmet-mockup-filters{display:flex;gap:6px;overflow:auto;margin:14px 0;padding:8px;border:1px solid var(--mi-color-line);border-radius:var(--mi-radius-xs);background:var(--mi-color-surface)}.helmet-mockup-filters a{flex:0 0 auto;padding:6px 9px;font-size:9px}
.helmet-mockup-catalog{margin:14px 0 24px;padding:12px;border:1px solid var(--mi-color-line);border-radius:var(--mi-radius-sm);background:var(--mi-color-surface)}.helmet-mockup-head{display:flex;justify-content:space-between;gap:16px;margin-bottom:10px}.helmet-mockup-head h2{margin:0;font-size:18px}.helmet-mockup-head span,.helmet-mockup-head>a{font-size:9px}.helmet-mockup-head span{color:var(--mi-color-primary);font-weight:850;text-transform:uppercase}
.helmet-preview-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.helmet-preview-card{display:flex;min-width:0;flex-direction:column;overflow:hidden;border:1px solid var(--mi-color-line);border-radius:var(--mi-radius-xs);background:var(--mi-color-surface)}.helmet-preview-media{height:165px;border-bottom:1px solid var(--mi-color-line-soft)}.helmet-preview-media,.helmet-preview-media>*{width:100%}.helmet-preview-media>*{height:100%}.helmet-preview-media img{width:100%;height:100%;padding:10px;object-fit:contain}.helmet-preview-copy{display:flex;flex:1;flex-direction:column;padding:9px 10px}.helmet-preview-copy>span,.helmet-preview-copy p,.helmet-preview-copy b{font-size:8px}.helmet-preview-copy>span{color:var(--mi-color-muted);text-transform:uppercase}.helmet-preview-copy h3{margin:4px 0;font-size:13px}.helmet-preview-copy p{margin:0;color:var(--mi-color-copy)}.helmet-preview-copy>div{display:flex;justify-content:space-between;margin-top:auto;padding-top:8px}.helmet-preview-copy strong,.helmet-preview-copy b{color:var(--mi-color-primary)}
@media(max-width:900px){.helmet-mockup-hero{grid-template-columns:1fr}.helmet-preview-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.helmet-mockup-page{width:min(100% - 24px,1280px)}.helmet-mockup-visual{min-height:230px}.helmet-preview-grid{grid-template-columns:1fr}.helmet-preview-media{height:200px}.helmet-mockup-head{flex-direction:column}}
`;

function Count({ value }: { value: number }) {
  return <strong className="ui-section-count">{value} models</strong>;
}

export default function HelmetsPage(){
  const verified=helmetProducts.filter(p=>p.status==="verified").sort((a,b)=>(a.priceFromPhp??Number.MAX_SAFE_INTEGER)-(b.priceFromPhp??Number.MAX_SAFE_INTEGER)||a.brand.localeCompare(b.brand)||a.model.localeCompare(b.model));
  const brands=helmetBrands.filter(h=>isIndexableHelmetBrand(h.slug));
  const priced=verified.map(p=>p.priceFromPhp).filter((v):v is number=>typeof v==="number");
  const minPrice=priced.length?Math.min(...priced):undefined;
  const maxPrice=priced.length?Math.max(...priced):undefined;
  const heroHelmet=verified.find(p=>p.slug==="tt-course")??verified[0];

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

  return <section className={`page shell helmet-hub-page $"helmet-mockup-page"`}>
    <Breadcrumbs items={[{label:"Helmets"}]} />
    <div className="helmet-mockup-hero">
      <div className="helmet-mockup-copy">
        <PageHero
          kicker="Philippine helmet buying guide"
          title="Motorcycle helmets in the Philippines"
          description="Compare verified helmet prices, protection formats, ECE 22.06 references, intercom provision, commuting choices, sizing and current brand/model pages."
          actions={<CTAGroup><Link className="button" href="/gear/helmets/finder">Find my helmet</Link><Link className="button secondary" href="/gear/helmets/compare">Compare helmets</Link></CTAGroup>}
        />
      </div>
      {heroHelmet&&<div className="helmet-mockup-visual">
        <span className="helmet-mockup-badge">Featured verified helmet</span>
        <EntityMedia entityType="helmet" entityId={heroHelmet.id} className="helmet-mockup-media" priority showCredit={false} sizes="(max-width: 820px) 100vw, 44vw" fallback={<EntityVerificationFallback brand={heroHelmet.brand} model={heroHelmet.model} kind="helmet" />} />
        <div className="helmet-mockup-caption"><small>{heroHelmet.helmetType}</small><strong>{heroHelmet.brand} {heroHelmet.model}</strong>{typeof heroHelmet.priceFromPhp==="number"&&<span>From {php(heroHelmet.priceFromPhp)}</span>}</div>
      </div>}
    </div>

    <StatRow items={[
      {label:"Verified models",value:verified.length},
      {label:"Brands",value:brands.length},
      {label:"Published price span",value:minPrice&&maxPrice?`${php(minPrice)}–${php(maxPrice)}`:"Check products"},
      {label:"ECE 22.06 records",value:ece2206.length}
    ]}/>

    <nav className={`product-entity-nav helmet-master-nav $"helmet-mockup-filters"`} aria-label="Helmet guide sections">
      <a href="#full-face">Full-face</a><a href="#modular">Modular</a><a href="#open-face">Open-face</a><a href="#under-3000">Under ₱3K</a><a href="#under-5000">Under ₱5K</a><a href="#ece-22-06">ECE 22.06</a><a href="#intercom-ready">Intercom</a><a href="#commuting">Commuting</a><a href="#brands">Brands</a><a href="#models">Model preview</a>
    </nav>

    <section className="helmet-mockup-catalog" aria-labelledby="helmet-catalog-title">
      <div className="helmet-mockup-head"><div><span>Verified catalog</span><h2 id="helmet-catalog-title">Browse motorcycle helmets</h2></div><Link href="/gear/helmets/finder">Filter all helmets →</Link></div>
      <HelmetPreviewGrid products={verified} limit={8} />
    </section>

    <InfoPanel className={`helmet-master-intro $"helmet-mockup-intro"`}>
      <SectionHeader kicker="Start here" title="Choose the helmet by fit and riding use first" description="A helmet category is only the starting point. The exact fit, conformity marking, visor system, ventilation, weight and replacement-parts availability decide whether a model works for you day to day." />
      <div className="ui-content-grid topic-grid">
        <article className="ui-content-card"><h3>Full-face</h3><p>A fixed chin bar gives the most complete coverage among the common road formats. Good for riders prioritizing coverage, weather protection and highway use.</p><a href="#full-face">See full-face models →</a></article>
        <article className="ui-content-card"><h3>Modular</h3><p>A flip-up chin bar is convenient at stops and checkpoints but usually adds weight and mechanical complexity.</p><a href="#modular">See modular models →</a></article>
        <article className="ui-content-card"><h3>Open-face</h3><p>More airflow and easier communication in city use, while the chin and jaw remain more exposed than in a full-face helmet.</p><a href="#open-face">See open-face models →</a></article>
        <article className="ui-content-card"><h3>Fit before graphics</h3><p>Measure your head and use the exact model chart. A helmet that looks right but moves excessively or creates a pressure hotspot is the wrong choice.</p><Link href="/guides/motorcycle-helmet-size-guide">Helmet size guide →</Link></article>
      </div>
    </InfoPanel>

    <section id="full-face" className="ui-page-section helmet-master-section">
      <SectionHeader kicker="Helmet type" title="Full-face motorcycle helmets" description="Fixed-chin-bar helmets for commuting, touring and sport riding. Compare fit, visor setup, ventilation, shell construction and certification on the exact model." aside={<Count value={fullFace.length}/>} />
      <HelmetProductGrid products={fullFace} />
    </section>

    <section id="modular" className="ui-page-section helmet-master-section">
      <SectionHeader kicker="Helmet type" title="Modular and flip-up motorcycle helmets" description="Useful for riders who want a chin bar that can open at stops. Check P/J homologation where claimed, hinge operation, weight and intercom clearance." aside={<Count value={modular.length}/>} />
      <HelmetProductGrid products={modular} />
    </section>

    <section id="open-face" className="ui-page-section helmet-master-section">
      <SectionHeader kicker="Helmet type" title="Open-face and half-face motorcycle helmets" description="City-focused choices with more airflow and facial openness. Compare visor coverage, sun visor, fit and local conformity marking before buying." aside={<Count value={openFace.length}/>} />
      <HelmetProductGrid products={openFace} />
    </section>

    <section id="under-3000" className="ui-page-section helmet-master-section">
      <SectionHeader kicker="Budget" title="Motorcycle helmets under ₱3,000" description="This is a price filter, not a safety ranking. Check the exact Philippine unit for PS or ICC marking, correct fit, secure retention and replacement-visor availability." aside={<Count value={under3000.length}/>} />
      <HelmetProductGrid products={under3000} />
    </section>

    <section id="under-5000" className="ui-page-section helmet-master-section">
      <SectionHeader kicker="Budget" title="Motorcycle helmets under ₱5,000" description="Use the wider budget to compare fit, ventilation, visor quality, removable liners and parts availability. A graphic or visor bundle can push a specific variant above the starting price shown." aside={<Count value={under5000.length}/>} />
      <HelmetProductGrid products={under5000} />
    </section>

    <section id="ece-22-06" className="ui-page-section helmet-master-section">
      <SectionHeader kicker="Certification" title="ECE 22.06 motorcycle helmets" description="These models explicitly reference ECE 22.06 or R22.06 in the checked product record. For Philippine use, also inspect the exact helmet for the applicable PS or ICC conformity marking." aside={<Count value={ece2206.length}/>} />
      <HelmetProductGrid products={ece2206} />
      <p className="helmet-master-note"><Link href="/guides/motorcycle-helmet-certification-philippines">Read the Philippine helmet certification guide →</Link></p>
    </section>

    <section id="intercom-ready" className="ui-page-section helmet-master-section">
      <SectionHeader kicker="Communication" title="Intercom-ready motorcycle helmets" description="Speaker pockets or communication-system provision can make installation cleaner, but speaker depth, microphone routing and mount clearance still need to match your exact intercom." aside={<Count value={intercom.length}/>} />
      <HelmetProductGrid products={intercom} />
      <p className="helmet-master-note"><Link href="/accessories/intercoms">Read the motorcycle helmet intercom buying guide →</Link></p>
    </section>

    <section id="commuting" className="ui-page-section helmet-master-section">
      <SectionHeader kicker="Daily riding" title="Motorcycle helmets for commuting" description="For daily Philippine riding, balance coverage with heat, rain, visor fogging, weight and repeated comfort." />
      <div className="ui-content-grid topic-grid">
        <article className="ui-content-card"><h3>Heavy city traffic</h3><p>Prioritize secure fit, low-speed ventilation and a practical rain or fog plan.</p></article>
        <article className="ui-content-card"><h3>Mixed city and highway</h3><p>Start with weather protection, stable fit and the coverage you want at higher speeds.</p></article>
        <article className="ui-content-card"><h3>Daily intercom use</h3><p>Check speaker-pocket depth, microphone placement and glove-friendly controls.</p></article>
        <article className="ui-content-card"><h3>Daily fit check</h3><p>The helmet should stay stable without painful pressure points or starting loose.</p></article>
      </div>
      <HelmetProductGrid products={commuting} />
      <p className="helmet-master-note"><Link href="/accessories/rain-gear">Compare motorcycle rain gear for daily commuting →</Link></p>
    </section>

    <section id="brands" className="ui-page-section helmet-master-section">
      <SectionHeader kicker="Browse by brand" title="Motorcycle helmet brands" description="Brand pages stay separate because each is a real product family with its own current lineup and source trail." />
      <div className="ui-content-grid helmet-brand-grid">{brands.map(h=><article className="ui-content-card" key={h.slug}><h3>{h.brand}</h3><p>{h.positioning}</p><Link href={`/gear/helmets/${h.slug}`}>View {h.brand} →</Link></article>)}</div>
    </section>

    <section id="models" className="ui-page-section helmet-master-section">
      <SectionHeader kicker="Model preview" title="Browse a sample of verified helmet models" description="Use the Helmet Finder for the full catalog. Open an exact product page for sizing, shell, visor, certification and current Philippine price information." aside={<Link href="/gear/helmets/finder">Filter the full catalog →</Link>} />
      <HelmetProductGrid products={verified} limit={16} />
    </section>

    <AuthorBox />
    <FaqSection title="Motorcycle helmet buying questions" items={faqs}/>
  </section>;
}
