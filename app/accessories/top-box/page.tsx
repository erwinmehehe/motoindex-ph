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
import { DataTable, InfoPanel, PageHero, ProductGrid, SectionHeader, StatRow } from "@/components/ui";

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
    <PageHero kicker="Storage + fitment" title="Motorcycle top boxes: sizes, brackets and fitment" description="Compare storage capacity and mounting systems, then check a motorcycle-specific rack or bracket before buying. Capacity alone never proves fitment." />

    <nav className="product-entity-nav" aria-label="Motorcycle top-box sections">
      <a href="#products">Products</a><a href="#brands">Brands</a><a href="#capacity">Capacity</a><a href="#fitment">Fitment</a><a href="#lto">LTO note</a>
    </nav>

    <StatRow className="brand-facts" items={[
      {label:"Verified boxes",value:verifiedBoxes.length},
      {label:"Bike-specific fitment records",value:verifiedFitments.length},
      {label:"Capacity range",value:`${Math.min(...verifiedBoxes.map(p=>p.capacityL))}–${Math.max(...verifiedBoxes.map(p=>p.capacityL))} L`}
    ]}/>

    <section className="motorcycle-entity-section ui-page-section">
      <SectionHeader kicker="Before you buy" title="What to check before buying" description="Capacity is only one part of the decision. Confirm the mounting system, bike-specific support and load limits before ordering." />
      <div className="split"><div><ul className="checklist">{category.buyerQuestions.map(q=><li key={q}>{q}</li>)}</ul></div><InfoPanel><h3>Check the motorcycle first</h3><p>Open the exact model to verify rear-carrier, rack and mounting notes before choosing a box.</p><Link href="/fitment">Open fitment finder →</Link></InfoPanel></div>
    </section>

    <section id="products" className="motorcycle-entity-section ui-page-section">
      <SectionHeader className="section-head inline-head" kicker="Checked products" title="Motorcycle top boxes with catalog records" description="Product cards are shown only when MotoIndex has a checked, renderable product image. Records without a sourced photo stay listed separately." />
      {verifiedBoxesWithImages.length>0&&<ProductGrid className="product-grid">{verifiedBoxesWithImages.map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/accessories/top-box/${p.slug}`,category:"Top box",brand:p.brand,model:p.model,meta:`${p.capacityL}L · ${p.shell}`,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}</ProductGrid>}
      {verifiedBoxesWithoutImages.length>0&&<div className="checked-record-list list-cards" aria-label="Checked top-box records awaiting sourced product photos">{verifiedBoxesWithoutImages.map(p=><Link key={p.id} href={`/accessories/top-box/${p.slug}`}><span><strong>{p.brand} {p.model}</strong><small>{p.capacityL}L · {p.shell} · checked product record</small></span><span className="checked-record-action">Photo not yet sourced · View details →</span></Link>)}</div>}
    </section>

    <section id="brands" className="motorcycle-entity-section ui-page-section topbox-brand-research" aria-labelledby="topbox-brand-research-title">
      <SectionHeader className="section-head compact" kicker="Brand research" title={<span id="topbox-brand-research-title">Top-box brands and product families</span>} description="Fully checked models get detailed product pages. Other families stay here until the manufacturer/model/SKU identity and mounting bundle are stable." />
      <div className="research-brand-grid ui-content-grid">{topBoxBrandLineups.map(brand=><article className="ui-content-card" key={brand.slug}><div><strong>{brand.brand}</strong><span className={`catalog-status ${brand.status==="verified-catalog"?"verified":"research"}`}>{brand.status==="verified-catalog"?"catalog checked":"research"}</span></div><p>{brand.families.join(" · ")}</p><small>{brand.note}</small>{brand.sourceUrl&&<a className="text-link" href={brand.sourceUrl} target="_blank" rel="noreferrer">Open catalogue source ↗</a>}</article>)}</div>
    </section>

    <section id="capacity" className="motorcycle-entity-section ui-page-section">
      <SectionHeader className="section-head" kicker="Capacity comparison" title="Compare motorcycle top-box capacity" description="Use liters to compare storage only. Mounting compatibility still comes from the exact rack, plate and motorcycle record." />
      <DataTable className="helmet-brand-table" label="Motorcycle top-box capacity comparison"><div className="helmet-brand-row head" role="row"><span>Top box</span><span>Capacity</span><span>Helmet/storage note</span><span>Observed price</span></div>{verifiedBoxes.map(p=><Link role="row" href={`/accessories/top-box/${p.slug}`} className="helmet-brand-row" key={p.id}><strong>{p.brand} {p.model}</strong><span>{p.capacityL} L</span><span>{p.helmetCapacity}</span><span>{p.priceFromPhp?php(p.priceFromPhp):"Check product"}</span></Link>)}</DataTable>
    </section>

    <section id="fitment" className="motorcycle-entity-section ui-page-section">
      <SectionHeader className="section-head" kicker="Verified fitment" title="Motorcycles with a stored rack or bracket record" description="These are product + motorcycle-specific edges, not capacity-based guesses." />
      <div className="fitment-evidence-grid">{verifiedFitments.map(({fitment,motorcycle})=><article key={fitment.id}><span className="catalog-status verified">verified</span><h3>{motorcycle!.make} {motorcycle!.model}</h3><p><b>{fitment.topBoxLabel}</b> · rack {fitment.rackCode}</p><p>{fitment.rackLabel}</p><small>{fitment.modelYears}</small><Link className="text-link" href={`/motorcycles/${motorcycle!.makeSlug}/${motorcycle!.slug}#tires-fitment`}>Open exact fitment →</Link></article>)}</div>
    </section>

    <section id="lto" className="motorcycle-entity-section ui-page-section">
      <InfoPanel subtle><h2>Philippines LTO top-box note</h2><p>LTO announced that the ₱100 registration fee for custom-made motorcycle top boxes and saddle bags was removed. This does not replace safe mounting, load-limit and road-safety checks.</p><a className="text-link" href="https://lto.gov.ph/news/bayad-sa-rehistro-ng-top-box-sa-motorsiklo-inalis-na-ng-lto/" target="_blank" rel="noreferrer">Read the LTO notice ↗</a></InfoPanel>
    </section>

    <FaqSection title="Motorcycle top-box questions" items={topBoxFaqs}/>

    <section className="motorcycle-entity-section ui-page-section">
      <SectionHeader className="section-head inline-head" kicker="Model research" title="Check top-box fitment on the exact motorcycle" />
      <div className="list-cards">{publicMotorcycles.slice(0,8).map(m=><Link key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}#tires-fitment`}><span><strong>Top box for {m.make} {m.model}</strong><small>Mounting and fitment notes</small></span><b>View fitment →</b></Link>)}</div>
    </section>

    <JsonLd data={schema}/>
    <AuthorBox/>
  </section>;
}
