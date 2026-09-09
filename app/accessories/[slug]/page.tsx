import type { Metadata } from "next";
import Link from "next/link";
import { accessoryCategories, getAccessoryCategory, publicMotorcycles, getModelById } from "@/lib/data";
import { topBoxProducts } from "@/lib/catalog";
import { topBoxFitments } from "@/lib/topBoxFitment";
import { ProductCard } from "@/components/ProductCard";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { notFound, permanentRedirect } from "next/navigation";
import { pageMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { php } from "@/lib/utils";
import { topBoxBrandLineups } from "@/lib/topBoxBrandLineups";
import { hasRenderableProductMedia } from "@/lib/media";
import { getAccessorySeoGuide } from "@/lib/accessorySeo";
import { AccessorySeoGuideContent } from "@/components/AccessorySeoGuideContent";

export function generateStaticParams(){return accessoryCategories.map(a=>({slug:a.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  const a=getAccessoryCategory(slug);
  if(!a)return {};
  if(slug!=="top-box")return {};
  return pageMetadata({
    title:"Motorcycle Top Box Philippines: Sizes, Brackets & Fitment",
    description:"Compare motorcycle top boxes by capacity, mounting system, bike-specific bracket fitment and current GIVI/SHAD product records in the Philippines.",
    path:"/accessories/top-box",
    index:true
  });
  const guide=getAccessorySeoGuide(slug);
  return pageMetadata({title:guide?.seoTitle||`${a.name} for Motorcycles Philippines`,description:guide?.description||a.description,path:`/accessories/${a.slug}`,index:Boolean(guide)});
}

export default async function AccessoryCategoryPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const a=getAccessoryCategory(slug);
  if(!a) return notFound();
  if(slug!=="top-box") permanentRedirect(`/accessories#${slug}`);
  const isTopBox=true;
  const seoGuide=getAccessorySeoGuide(slug);
  const verifiedBoxes=topBoxProducts.filter(p=>p.status==="verified");
  const verifiedBoxesWithImages=verifiedBoxes.filter(p=>hasRenderableProductMedia(p.id));
  const verifiedBoxesWithoutImages=verifiedBoxes.filter(p=>!hasRenderableProductMedia(p.id));
  const verifiedFitments=topBoxFitments.filter(f=>f.status==="verified").map(f=>({fitment:f,motorcycle:getModelById(f.modelId)})).filter((row)=>row.motorcycle);
  const topBoxFaqs: FaqItem[] = [
    {question:"What size top box should I get for a motorcycle?",answer:"Capacity depends on what you carry, but liters alone do not determine motorcycle fitment. Check the box mounting interface, bike-specific rack or bracket, rack load rating, subframe limits and tail/seat clearance before buying."},
    {question:"Does a motorcycle top box need a bracket?",answer:"Usually yes. Some boxes include a universal plate, but the motorcycle still needs a compatible rear carrier or bike-specific rack. MotoIndex only calls a model fit verified when a specific manufacturer rack or bracket record is stored."},
    {question:"Can any top box fit any motorcycle?",answer:"No. Capacity and plate type are not enough to prove fitment. The exact motorcycle, model year, rear carrier, plate interface, fasteners, load limit and clearance all matter."},
    {question:"Does LTO charge a registration fee for motorcycle top boxes?",answer:"LTO announced that the ₱100 registration fee for custom-made motorcycle top boxes and saddle bags was removed. Riders still need to follow applicable mounting and road-safety requirements."}
  ];

  return <section className="page shell">
    <Breadcrumbs items={[{label:"Accessories",href:"/accessories"},{label:a.name}]} />
    <div className="page-head"><h1>{isTopBox?"Motorcycle top boxes: sizes, brackets and fitment":seoGuide?.title||`${a.name} for motorcycles`}</h1><p>{isTopBox?"Compare storage capacity and mounting systems, then check a motorcycle-specific rack or bracket before buying. A 32L or 39L box can be useful storage, but capacity alone never proves fitment.":seoGuide?.intro||a.description}</p></div>

    {isTopBox && <div className="brand-facts"><div><span>Verified boxes</span><strong>{verifiedBoxes.length}</strong></div><div><span>Bike-specific fitment records</span><strong>{verifiedFitments.length}</strong></div><div><span>Capacity range</span><strong>{Math.min(...verifiedBoxes.map(p=>p.capacityL))}–{Math.max(...verifiedBoxes.map(p=>p.capacityL))} L</strong></div></div>}

    <div className="split"><div><h2>What to check</h2><ul className="checklist">{a.buyerQuestions.map(q=><li key={q}>{q}</li>)}</ul></div><div className="info-card"><h3>Check the motorcycle first</h3><p>Open your motorcycle model page to check mounting, size and fitment notes before choosing a product.</p><Link href="/motorcycles">Choose a motorcycle →</Link></div></div>

    {isTopBox&&<>
      <div className="section-head inline-head"><div><h2>Top boxes with checked catalog records</h2><p>Product cards are shown only when MotoIndex has a checked, renderable product image. Every verified record remains available below instead of pretending a missing photo is verified.</p></div><Link href="/fitment">Open fitment finder →</Link></div>
      {verifiedBoxesWithImages.length>0&&<div className="product-grid">{verifiedBoxesWithImages.map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/accessories/top-box/${p.slug}`,category:"Top box",brand:p.brand,model:p.model,meta:`${p.capacityL}L · ${p.shell}`,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}</div>}
      {verifiedBoxesWithoutImages.length>0&&<div className="checked-record-list" aria-label="Checked top-box records awaiting sourced product photos">{verifiedBoxesWithoutImages.map(p=><Link key={p.id} href={`/accessories/top-box/${p.slug}`}><span><strong>{p.brand} {p.model}</strong><small>{p.capacityL}L · {p.shell} · checked product record</small></span><span className="checked-record-action">Photo not yet sourced · View details →</span></Link>)}</div>}

      <section className="topbox-brand-research" aria-labelledby="topbox-brand-research-title">
        <div className="section-head compact"><div><h2 id="topbox-brand-research-title">Top-box brands and product families</h2><p>Fully checked models get detailed product pages. Other families stay listed here until we have enough reliable model, specification and mounting information.</p></div></div>
        <div className="research-brand-grid">{topBoxBrandLineups.map((brand)=><article key={brand.slug}>
          <div><strong>{brand.brand}</strong><span className={`catalog-status ${brand.status === "verified-catalog" ? "verified" : "research"}`}>{brand.status === "verified-catalog" ? "catalog checked" : "research"}</span></div>
          <p>{brand.families.join(" · ")}</p><small>{brand.note}</small>
          {brand.sourceUrl&&<a className="text-link" href={brand.sourceUrl} target="_blank" rel="noreferrer">Open catalogue source ↗</a>}
        </article>)}</div>
      </section>

      <div className="section-head"><div><h2>32L vs 39L motorcycle top boxes</h2><p>Use capacity to compare storage, then use the exact bracket graph below for mounting.</p></div></div>
      <div className="helmet-brand-table"><div className="helmet-brand-row head"><span>Top box</span><span>Capacity</span><span>Helmet/storage note</span><span>Observed price</span></div>{verifiedBoxes.map(p=><Link href={`/accessories/top-box/${p.slug}`} className="helmet-brand-row" key={p.id}><strong>{p.brand} {p.model}</strong><span>{p.capacityL} L</span><span>{p.helmetCapacity}</span><span>{p.priceFromPhp?php(p.priceFromPhp):"Check product"}</span></Link>)}</div>

      <div className="section-head"><div><h2>Verified mounting edges: motorcycles with a stored rack or bracket record</h2><p>These are product + motorcycle-specific records, not capacity-based guesses.</p></div></div>
      <div className="fitment-evidence-grid">{verifiedFitments.map(({fitment,motorcycle})=><article key={fitment.id}><span className="catalog-status verified">verified</span><h3>{motorcycle!.make} {motorcycle!.model}</h3><p><b>{fitment.topBoxLabel}</b> · rack {fitment.rackCode}</p><p>{fitment.rackLabel}</p><small>{fitment.modelYears}</small><Link className="text-link" href={`/motorcycles/${motorcycle!.makeSlug}/${motorcycle!.slug}#tires-fitment`}>Open exact fitment →</Link></article>)}</div>

      <div className="note-box"><h2>Philippines LTO top-box note</h2><p>LTO announced that the ₱100 registration fee for custom-made motorcycle top boxes and saddle bags was removed. This does not replace safe mounting, load-limit and road-safety checks.</p><a className="text-link" href="https://lto.gov.ph/news/bayad-sa-rehistro-ng-top-box-sa-motorsiklo-inalis-na-ng-lto/" target="_blank" rel="noreferrer">Read the LTO notice ↗</a></div>
      <FaqSection title="Motorcycle top-box questions" items={topBoxFaqs}/>
    </>}

    {!isTopBox && seoGuide && <AccessorySeoGuideContent guide={seoGuide} />}

    <div className="section-head inline-head"><div><h2>Model-specific {a.name.toLowerCase()}</h2></div></div>
    <div className="list-cards">{publicMotorcycles.slice(0,8).map(m=><Link key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}#tires-fitment`}><span><strong>{a.name} for {m.make} {m.model}</strong><small>Mounting and fitment notes</small></span><b>View fitment →</b></Link>)}</div>
  </section>;
}
