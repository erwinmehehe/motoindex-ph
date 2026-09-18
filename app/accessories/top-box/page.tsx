import type { Metadata } from "next";
import Link from "next/link";
import { getAccessoryCategory, publicMotorcycles, getModelById } from "@/lib/data";
import { topBoxProducts } from "@/lib/catalog";
import { topBoxFitments } from "@/lib/topBoxFitment";
import { ProductCard } from "@/components/ProductCard";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { pageMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { php } from "@/lib/utils";
import { topBoxBrandLineups } from "@/lib/topBoxBrandLineups";
import { hasRenderableProductMedia } from "@/lib/media";
import { AuthorBox } from "@/components/AuthorBox";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Top Box Philippines: Sizes, Brackets & Fitment",
  description: "Compare motorcycle top boxes by capacity, mounting system, bike-specific bracket fitment and checked GIVI, SHAD and other product records.",
  path: "/accessories/top-box",
  index: true
});

export default function TopBoxPage(){
  const category=getAccessoryCategory("top-box")!;
  const verifiedBoxes=topBoxProducts.filter(p=>p.status==="verified");
  const verifiedBoxesWithImages=verifiedBoxes.filter(p=>hasRenderableProductMedia(p.id));
  const verifiedBoxesWithoutImages=verifiedBoxes.filter(p=>!hasRenderableProductMedia(p.id));
  const verifiedFitments=topBoxFitments.filter(f=>f.status==="verified").map(f=>({fitment:f,motorcycle:getModelById(f.modelId)})).filter(row=>row.motorcycle);
  const topBoxFaqs: FaqItem[]=[
    {question:"What size top box should I get for a motorcycle?",answer:"Capacity depends on what you carry, but liters alone do not determine fitment. Check the box mounting interface, bike-specific rack or bracket, rack load rating, subframe limits and tail or seat clearance before buying."},
    {question:"Does a motorcycle top box need a bracket?",answer:"Usually yes. Some boxes include a universal plate, but the motorcycle still needs a compatible rear carrier or bike-specific rack. MotoIndex only calls a fit verified when a specific rack or bracket record is stored."},
    {question:"Can any top box fit any motorcycle?",answer:"No. Capacity and plate type are not enough to prove fitment. The exact motorcycle, model year, rear carrier, plate interface, fasteners, load limit and clearance all matter."},
    {question:"Does LTO charge a registration fee for motorcycle top boxes?",answer:"LTO announced that the ₱100 registration fee for custom-made motorcycle top boxes and saddle bags was removed. Riders still need to follow applicable mounting and road-safety requirements."}
  ];
  const schema=articleSchema({
    headline:"Motorcycle top boxes in the Philippines: sizes, brackets and fitment",
    description:"Compare motorcycle top boxes by capacity, mounting system and bike-specific rack or bracket evidence.",
    path:"/accessories/top-box",
    about:"motorcycle top box Philippines",
    keywords:["motorcycle top box Philippines","motorcycle top box bracket","motorcycle top box fitment"]
  });

  return <section className="page shell accessories-master-page topbox-master-page">
    <Breadcrumbs items={[{label:"Accessories",href:"/accessories"},{label:category.name}]} />
    <div className="page-head">
      <span className="entity-kicker">Storage + fitment</span>
      <h1>Motorcycle top boxes: sizes, brackets and fitment</h1>
      <p>Compare storage capacity and mounting systems, then check a motorcycle-specific rack or bracket before buying. Capacity alone never proves fitment.</p>
    </div>

    <nav className="product-entity-nav" aria-label="Motorcycle top-box sections">
      <a href="#products">Products</a><a href="#brands">Brands</a><a href="#capacity">Capacity</a><a href="#fitment">Fitment</a><a href="#lto">LTO note</a>
    </nav>

    <div className="brand-facts"><div><span>Verified boxes</span><strong>{verifiedBoxes.length}</strong></div><div><span>Bike-specific fitment records</span><strong>{verifiedFitments.length}</strong></div><div><span>Capacity range</span><strong>{Math.min(...verifiedBoxes.map(p=>p.capacityL))}–{Math.max(...verifiedBoxes.map(p=>p.capacityL))} L</strong></div></div>

    <section className="motorcycle-entity-section">
      <div className="split"><div><h2>What to check before buying</h2><ul className="checklist">{category.buyerQuestions.map(q=><li key={q}>{q}</li>)}</ul></div><div className="info-card"><h3>Check the motorcycle first</h3><p>Open the exact model to verify rear-carrier, rack and mounting notes before choosing a box.</p><Link href="/fitment">Open fitment finder →</Link></div></div>
    </section>

    <section id="products" className="motorcycle-entity-section">
      <div className="section-head inline-head"><div><span className="section-kicker">Checked products</span><h2>Motorcycle top boxes with catalog records</h2><p>Product cards are shown only when MotoIndex has a checked, renderable product image. Records without a sourced photo stay listed separately.</p></div></div>
      {verifiedBoxesWithImages.length>0&&<div className="product-grid">{verifiedBoxesWithImages.map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/accessories/top-box/${p.slug}`,category:"Top box",brand:p.brand,model:p.model,meta:`${p.capacityL}L · ${p.shell}`,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}</div>}
      {verifiedBoxesWithoutImages.length>0&&<div className="checked-record-list list-cards" aria-label="Checked top-box records awaiting sourced product photos">{verifiedBoxesWithoutImages.map(p=><Link key={p.id} href={`/accessories/top-box/${p.slug}`}><span><strong>{p.brand} {p.model}</strong><small>{p.capacityL}L · {p.shell} · checked product record</small></span><span className="checked-record-action">Photo not yet sourced · View details →</span></Link>)}</div>}
    </section>

    <section id="brands" className="motorcycle-entity-section topbox-brand-research" aria-labelledby="topbox-brand-research-title">
      <div className="section-head compact"><div><span className="section-kicker">Brand research</span><h2 id="topbox-brand-research-title">Top-box brands and product families</h2><p>Fully checked models get detailed product pages. Other families stay here until the manufacturer/model/SKU identity and mounting bundle are stable.</p></div></div>
      <div className="research-brand-grid topic-grid">{topBoxBrandLineups.map(brand=><article key={brand.slug}><div><strong>{brand.brand}</strong><span className={`catalog-status ${brand.status==="verified-catalog"?"verified":"research"}`}>{brand.status==="verified-catalog"?"catalog checked":"research"}</span></div><p>{brand.families.join(" · ")}</p><small>{brand.note}</small>{brand.sourceUrl&&<a className="text-link" href={brand.sourceUrl} target="_blank" rel="noreferrer">Open catalogue source ↗</a>}</article>)}</div>
    </section>

    <section id="capacity" className="motorcycle-entity-section">
      <div className="section-head"><div><span className="section-kicker">Capacity comparison</span><h2>Compare motorcycle top-box capacity</h2><p>Use liters to compare storage only. Mounting compatibility still comes from the exact rack, plate and motorcycle record.</p></div></div>
      <div className="helmet-brand-table"><div className="helmet-brand-row head"><span>Top box</span><span>Capacity</span><span>Helmet/storage note</span><span>Observed price</span></div>{verifiedBoxes.map(p=><Link href={`/accessories/top-box/${p.slug}`} className="helmet-brand-row" key={p.id}><strong>{p.brand} {p.model}</strong><span>{p.capacityL} L</span><span>{p.helmetCapacity}</span><span>{p.priceFromPhp?php(p.priceFromPhp):"Check product"}</span></Link>)}</div>
    </section>

    <section id="fitment" className="motorcycle-entity-section">
      <div className="section-head"><div><span className="section-kicker">Verified fitment</span><h2>Motorcycles with a stored rack or bracket record</h2><p>These are product + motorcycle-specific edges, not capacity-based guesses.</p></div></div>
      <div className="fitment-evidence-grid">{verifiedFitments.map(({fitment,motorcycle})=><article key={fitment.id}><span className="catalog-status verified">verified</span><h3>{motorcycle!.make} {motorcycle!.model}</h3><p><b>{fitment.topBoxLabel}</b> · rack {fitment.rackCode}</p><p>{fitment.rackLabel}</p><small>{fitment.modelYears}</small><Link className="text-link" href={`/motorcycles/${motorcycle!.makeSlug}/${motorcycle!.slug}#tires-fitment`}>Open exact fitment →</Link></article>)}</div>
    </section>

    <section id="lto" className="motorcycle-entity-section">
      <div className="note-box"><h2>Philippines LTO top-box note</h2><p>LTO announced that the ₱100 registration fee for custom-made motorcycle top boxes and saddle bags was removed. This does not replace safe mounting, load-limit and road-safety checks.</p><a className="text-link" href="https://lto.gov.ph/news/bayad-sa-rehistro-ng-top-box-sa-motorsiklo-inalis-na-ng-lto/" target="_blank" rel="noreferrer">Read the LTO notice ↗</a></div>
    </section>

    <FaqSection title="Motorcycle top-box questions" items={topBoxFaqs}/>

    <section className="motorcycle-entity-section">
      <div className="section-head inline-head"><div><span className="section-kicker">Model research</span><h2>Check top-box fitment on the exact motorcycle</h2></div></div>
      <div className="list-cards">{publicMotorcycles.slice(0,8).map(m=><Link key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}#tires-fitment`}><span><strong>Top box for {m.make} {m.model}</strong><small>Mounting and fitment notes</small></span><b>View fitment →</b></Link>)}</div>
    </section>

    <JsonLd data={schema}/>
    <AuthorBox/>
  </section>;
}
