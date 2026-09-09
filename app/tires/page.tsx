import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { publicMotorcycles } from "@/lib/data";
import { tireProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { AuthorBox } from "@/components/AuthorBox";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";
import { tireFamilyHubs, getTireFamilyModels } from "@/lib/tireSeo";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Tire Size Chart Philippines: Finder & Fitment Guide",
  description: "One motorcycle tire guide with stock front and rear sizes, Aerox, NMAX and Click generation comparisons, tire-size markings and verified tire products.",
  path: "/tires",
  index: true
});

function normalize(value:string){
  return value.toUpperCase().replace(/\s+/g,"").replace(/R(?=\d)/g,"-").replace(/M\/C/g,"").replace(/--+/g,"-");
}

export default function TiresPage(){
  const verifiedProducts=tireProducts.filter(p=>p.status==="verified");
  const sizeMap=new Map<string,{label:string;models:typeof publicMotorcycles}>();
  for(const model of publicMotorcycles){
    for(const size of [model.frontTire,model.rearTire]){
      const key=normalize(size);
      const row=sizeMap.get(key)||{label:size,models:[] as typeof publicMotorcycles};
      if(!row.models.some(item=>item.id===model.id))row.models.push(model);
      sizeMap.set(key,row);
    }
  }
  const commonSizes=[...sizeMap.values()].sort((a,b)=>b.models.length-a.models.length||a.label.localeCompare(b.label)).slice(0,12);

  const schema=articleSchema({
    headline:"Motorcycle tire size and fitment guide for the Philippines",
    description:"One guide to motorcycle tire-size markings, stock front and rear sizes, model generations and verified replacement tire families.",
    path:"/tires",
    about:"motorcycle tire size Philippines",
    keywords:["motorcycle tire size chart","motorcycle tire size Philippines","Aerox tire size","NMAX tire size","Honda Click tire size"],
    checkedDates:publicMotorcycles.map(m=>m.verifiedAt)
  });

  return <section className="page shell tire-master-page">
    <div className="page-head">
      <span className="entity-kicker">Motorcycle tire fitment guide</span>
      <h1>Motorcycle tire size chart and finder</h1>
      <p>Start with the exact motorcycle&apos;s stock front and rear size. Then check load index, speed rating, construction, tube or tubeless requirement, rim width and physical clearance. Matching the printed size alone does not guarantee complete fitment.</p>
      <div className="hero-actions"><Link className="button" href="/fitment">Open fitment finder</Link><a className="button secondary" href="#stock-sizes">Browse stock sizes</a></div>
    </div>

    <nav className="product-entity-nav tire-master-nav" aria-label="Tire guide sections">
      <a href="#size-chart">Read tire sizes</a>
      <a href="#families">Aerox, NMAX & Click</a>
      <a href="#stock-sizes">Stock sizes</a>
      <a href="#common-sizes">Common sizes</a>
      <a href="#products">Tire products</a>
    </nav>

    <section id="size-chart" className="tire-master-section">
      <div className="section-head compact"><div><span className="section-kicker">How to read the number</span><h2>How motorcycle tire sizes work</h2><p>A marking such as 110/80-14 combines tire width, aspect ratio and rim diameter. It does not tell you every fitment requirement.</p></div></div>
      <div className="topic-grid">
        <article><h3>110</h3><p>Nominal section width in millimeters. Actual mounted width can vary by tire design and rim width.</p></article>
        <article><h3>80</h3><p>Aspect ratio. The sidewall height is approximately 80% of the nominal section width.</p></article>
        <article><h3>14</h3><p>Rim diameter in inches. The rim diameter must match, but matching this number alone is not enough.</p></article>
        <article><h3>Also check</h3><p>Front/rear application, load index, speed rating, construction, tube or tubeless requirement, approved rim width and clearance.</p></article>
      </div>
      <div className="note-box"><h3>Do not assume a wider tire is an upgrade</h3><p>Changing width or aspect ratio can change steering, clearance, overall diameter and speedometer behavior. Use the motorcycle manufacturer guidance or a qualified tire specialist before changing from stock size.</p></div>
    </section>

    <section id="families" className="tire-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Do not mix generations</span><h2>Aerox, NMAX and Honda Click tire sizes</h2><p>Popular model names span multiple generations. The exact generation matters because front and rear sizes can change.</p></div></div>
      <div className="tire-family-master-grid">{tireFamilyHubs.map(hub=>{
        const models=getTireFamilyModels(hub);
        return <article key={hub.slug}><h3>{hub.shortName}</h3><p>{hub.description}</p><div className="fitment-list compact-fitment-list">{models.map(m=><Link key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}#tires-fitment`}><span><strong>{m.model}</strong><small>{m.generation}</small></span><span className="tire-pair"><b>{m.frontTire}</b><b>{m.rearTire}</b></span></Link>)}</div></article>;
      })}</div>
    </section>

    <section id="stock-sizes" className="tire-master-section">
      <div className="section-head inline-head"><div><span className="section-kicker">Exact motorcycles</span><h2>Stock front and rear tire sizes</h2><p>Open the motorcycle for pressure references, compatible product candidates and model-specific fitment evidence.</p></div><Link href="/fitment">Open fitment finder →</Link></div>
      <div className="fitment-list">{publicMotorcycles.map(m=><Link key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}#tires-fitment`}><span><strong>{m.make} {m.model}</strong><small>{m.category}</small></span><span className="tire-pair"><b>{m.frontTire}</b><b>{m.rearTire}</b></span></Link>)}</div>
    </section>

    <section id="common-sizes" className="tire-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Size index</span><h2>Common stock motorcycle tire sizes</h2><p>These are grouped from the motorcycles currently in the catalog. Use them for discovery only, then open the exact motorcycle before ordering.</p></div></div>
      <div className="guide-master-link-grid">{commonSizes.map(row=><article key={row.label}><strong>{row.label}</strong><small>{row.models.length} motorcycle{row.models.length===1?"":"s"} use this size at the front, rear or both</small><div>{row.models.slice(0,5).map(m=><Link key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}#tires-fitment`}>{m.make} {m.model}</Link>)}</div></article>)}</div>
    </section>

    <section id="products" className="tire-master-section">
      <div className="section-head inline-head"><div><span className="section-kicker">Replacement tires</span><h2>Verified motorcycle tire products</h2><p>Product pages stay separate because each is a real tire family with its own manufacturer size range and use case.</p></div></div>
      <div className="product-grid">{verifiedProducts.map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/tires/${p.brandSlug}/${p.slug}`,category:"Tire",brand:p.brand,model:p.model,meta:`${p.useCase} · ${p.knownSizes.length} listed sizes`,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}</div>
    </section>

    <div className="fitment-crosslinks"><Link href="/fitment"><strong>Fitment finder</strong><small>Tires + motorcycle-specific accessories →</small></Link><Link href="/motorcycles"><strong>Motorcycle catalog</strong><small>Open exact model tire sections →</small></Link><Link href="/methodology"><strong>How fitment is checked</strong><small>Evidence and publishing rules →</small></Link></div>

    <JsonLd data={schema}/>
    <AuthorBox/>
  </section>;
}
