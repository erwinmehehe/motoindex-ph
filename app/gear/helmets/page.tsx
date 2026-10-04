import type { Metadata } from "next";
import Link from "next/link";
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
  title: "Motorcycle Helmets Philippines 2026: Prices, Types & Brands",
  description: "Compare motorcycle helmets in the Philippines by price and type, including full-face, modular, open-face, adventure, dual-sport, off-road and motocross helmets."
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

function Count({ value }: { value: number }) {
  return <strong className="ui-section-count">{value} models</strong>;
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
  const adventure=verified.filter(p=>p.helmetType==="Adventure");
  const offRoad=verified.filter(p=>p.helmetType==="Off-road");
  const under3000=verified.filter(p=>typeof p.priceFromPhp==="number"&&p.priceFromPhp<=3000);
  const under5000=verified.filter(p=>typeof p.priceFromPhp==="number"&&p.priceFromPhp<=5000);
  const ece2206=verified.filter(p=>/(?:ECE\s*)?(?:R?22[.\s-]?06|22\.06)/i.test(p.certification||""));
  const intercom=verified.filter(p=>p.intercomReady);
  const commuting=verified.filter(p=>["Full face","Modular","Half face","Open face"].includes(p.helmetType)).slice(0,12);

  const faqs: FaqItem[]=[
    {question:"How much is a motorcycle helmet in the Philippines?",answer:minPrice&&maxPrice?`The verified helmet models with published prices on this page currently start from ${php(minPrice)} to ${php(maxPrice)}. Final price can change with size, graphic, visor bundle, seller and promotion.`:"Helmet prices vary by brand, model, shell, visor package, size and seller. Open the exact model and current seller source before buying."},
    {question:"Which helmet type should I buy for commuting?",answer:"A full-face helmet gives a fixed chin bar, a modular helmet adds flip-up convenience, and an open-face helmet gives more airflow while leaving the chin exposed. Fit, visibility, ventilation and the exact certification marking matter more than choosing a category by name alone."},
    {question:"What is an adventure or dual-sport helmet?",answer:"Adventure helmets typically combine a road visor with a peak and a wider eye opening for mixed paved and unpaved use. Check peak stability, visor sealing, ventilation, goggle compatibility and the exact certification on the model you are considering."},
    {question:"What is the difference between a motocross helmet and a full-face road helmet?",answer:"A motocross or off-road helmet usually uses a large eye port, peak and high-flow ventilation designed around goggles and trail use. A road full-face helmet generally gives a more sealed visor and better wind and weather isolation."},
    {question:"What does ECE 22.06 mean?",answer:"ECE 22.06 is a current UNECE motorcycle-helmet homologation standard. For a Philippine purchase, also inspect the exact helmet for the applicable PS or ICC conformity marking instead of relying on an overseas label alone."},
    {question:"What does intercom-ready mean?",answer:"It means the model has recorded provision for communication hardware such as speaker or microphone space. It does not guarantee that every intercom kit fits without checking speaker depth, microphone placement and mounting clearance."},
    {question:"How do I choose the correct helmet size?",answer:"Measure your head using the helmet maker's method and use the size chart for the exact model. Try the helmet on when possible because shell shape and cheek-pad thickness can differ even within one brand."},
    {question:"Does a more expensive helmet automatically mean safer?",answer:"No. Price can reflect shell material, finish, aerodynamics, visor hardware, liner quality and brand positioning. Check the exact model's certification, local conformity marking and fit rather than using price as a safety score."}
  ];

  return <section className="page shell helmet-hub-page">
    <PageHero
      kicker="Philippine helmet buying guide"
      title="Motorcycle helmets in the Philippines: prices, types and brands"
      description="Use one guide to compare helmet prices, protection formats, ECE 22.06 references, intercom provision, commuting choices, sizing and current brand/model pages. Open the exact helmet before buying to verify fit and the marking on the local unit."
      actions={<CTAGroup><Link className="button" href="/gear/helmets/finder">Find my helmet</Link><Link className="button secondary" href="/gear/helmets/compare">Compare exact helmets</Link></CTAGroup>}
    />

    <StatRow items={[
      {label:"Verified models",value:verified.length},
      {label:"Brands",value:brands.length},
      {label:"Published price span",value:minPrice&&maxPrice?`${php(minPrice)}–${php(maxPrice)}`:"Check products"},
      {label:"ECE 22.06 records",value:ece2206.length}
    ]}/>

    <nav className="product-entity-nav helmet-master-nav" aria-label="Helmet guide sections">
      <a href="#full-face">Full-face</a><a href="#modular">Modular</a><a href="#open-face">Open-face</a><a href="#adventure">Adventure</a><a href="#off-road">Off-road</a><a href="#under-3000">Under ₱3K</a><a href="#under-5000">Under ₱5K</a><a href="#ece-22-06">ECE 22.06</a><a href="#intercom-ready">Intercom</a><a href="#commuting">Commuting</a><a href="#brands">Brands</a><a href="#models">Model preview</a>
    </nav>

    <InfoPanel className="helmet-master-intro">
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

    <section id="adventure" className="ui-page-section helmet-master-section">
      <SectionHeader kicker="Helmet type" title="Adventure and dual-sport motorcycle helmets" description="Adventure helmets blend road-oriented visor coverage with an extended peak and off-road-inspired shell shape. Compare visor setup, peak stability, ventilation, weight, intercom provision and certification on the exact model." aside={<Count value={adventure.length}/>} />
      <HelmetProductGrid products={adventure} />
      <div className="ui-content-grid topic-grid">
        <article className="ui-content-card"><h3>Adventure vs full-face</h3><p>Adventure helmets typically add a peak and wider visual opening. That can help mixed-road use, but it can also add wind load compared with a road-focused full-face helmet.</p></article>
        <article className="ui-content-card"><h3>Dual-sport use</h3><p>Choose by the actual mix of paved and unpaved riding. Check whether the peak is removable, whether goggles fit if needed and how the visor seals in rain.</p></article>
        <article className="ui-content-card"><h3>Touring practicality</h3><p>For longer road rides, compare noise, visor anti-fog provision, speaker clearance and peak stability rather than assuming every adventure helmet is equally touring-friendly.</p></article>
      </div>
    </section>

    <section id="off-road" className="ui-page-section helmet-master-section">
      <SectionHeader kicker="Helmet type" title="Off-road and motocross motorcycle helmets" description="Off-road helmets prioritize airflow, a large eye port and peak protection for trail or motocross use. Compare goggle compatibility, chin-bar clearance, ventilation, shell weight and the exact certification record." aside={<Count value={offRoad.length}/>} />
      <HelmetProductGrid products={offRoad} />
      <div className="ui-content-grid topic-grid">
        <article className="ui-content-card"><h3>Motocross vs road helmet</h3><p>Most off-road helmets are designed around goggles and high airflow rather than a sealed street visor. Do not assume a motocross helmet gives the same rain, wind and noise protection as a road full-face helmet.</p></article>
        <article className="ui-content-card"><h3>Goggle fit matters</h3><p>Check eye-port width, nose clearance and strap position with the exact goggles you plan to use. A poor helmet-and-goggle combination can create gaps or pressure points.</p></article>
        <article className="ui-content-card"><h3>Street use needs a separate check</h3><p>If you plan to use an off-road helmet on public roads, verify the exact local conformity marking, visor or eye-protection setup and whether the model is suitable for your road use.</p></article>
      </div>
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
