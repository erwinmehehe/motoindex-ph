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
import { CTAGroup, InfoPanel, PageHero, ProductGrid, SectionHeader } from "@/components/ui";

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
  const stockPreview=publicMotorcycles.slice(0,24);
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
    <PageHero
      kicker="Motorcycle tire fitment guide"
      title="Motorcycle tire size chart and finder"
      description={<>Start with the exact motorcycle&apos;s stock front and rear size. Then check load index, speed rating, construction, tube or tubeless requirement, rim width and physical clearance. Matching the printed size alone does not guarantee complete fitment.</>}
      actions={<CTAGroup><Link className="button" href="/fitment">Open fitment finder</Link><a className="button secondary" href="#stock-sizes">Browse stock-size preview</a></CTAGroup>}
    />

    <nav className="product-entity-nav tire-master-nav" aria-label="Tire guide sections">
      <a href="#size-chart">Read tire sizes</a>
      <a href="#families">Aerox, NMAX & Click</a>
      <a href="#stock-sizes">Stock-size preview</a>
      <a href="#common-sizes">Common sizes</a>
      <a href="#products">Tire products</a>
    </nav>

    <section id="size-chart" className="tire-master-section ui-page-section">
      <SectionHeader className="section-head compact" kicker="How to read the number" title="How motorcycle tire sizes work" description="A marking such as 110/80-14 combines tire width, aspect ratio and rim diameter. It does not tell you every fitment requirement." />
      <div className="ui-content-grid topic-grid">
        <article className="ui-content-card"><h3>110</h3><p>Nominal section width in millimeters. Actual mounted width can vary by tire design and rim width.</p></article>
        <article className="ui-content-card"><h3>80</h3><p>Aspect ratio. The sidewall height is approximately 80% of the nominal section width.</p></article>
        <article className="ui-content-card"><h3>14</h3><p>Rim diameter in inches. The rim diameter must match, but matching this number alone is not enough.</p></article>
        <article className="ui-content-card"><h3>Also check</h3><p>Front/rear application, load index, speed rating, construction, tube or tubeless requirement, approved rim width and clearance.</p></article>
      </div>
      <InfoPanel subtle><h3>Do not assume a wider tire is an upgrade</h3><p>Changing width or aspect ratio can change steering, clearance, overall diameter and speedometer behavior. Use the motorcycle manufacturer guidance or a qualified tire specialist before changing from stock size.</p></InfoPanel>
    </section>

    <section id="families" className="tire-master-section ui-page-section">
      <SectionHeader className="section-head compact" kicker="Do not mix generations" title="Aerox, NMAX and Honda Click tire sizes" description="Popular model names span multiple generations. The exact generation matters because front and rear sizes can change." />
      <div className="tire-family-master-grid">{tireFamilyHubs.map(hub=>{
        const models=getTireFamilyModels(hub);
        return <article key={hub.slug}><h3>{hub.shortName}</h3><p>{hub.description}</p><div className="fitment-list compact-fitment-list">{models.map(m=><Link key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}#tires-fitment`}><span><strong>{m.model}</strong><small>{m.generation}</small></span><span className="tire-pair"><b>{m.frontTire}</b><b>{m.rearTire}</b></span></Link>)}</div></article>;
      })}</div>
    </section>

    <section id="stock-sizes" className="tire-master-section ui-page-section">
      <SectionHeader className="section-head inline-head" kicker="Exact motorcycles" title="Stock front and rear tire sizes" description="This is a compact preview. Use the Fitment Finder to search the complete current motorcycle catalog and open the exact model before ordering." aside={<Link href="/fitment">Search all fitment →</Link>} />
      <div className="fitment-list">{stockPreview.map(m=><Link key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}#tires-fitment`}><span><strong>{m.make} {m.model}</strong><small>{m.category}</small></span><span className="tire-pair"><b>{m.frontTire}</b><b>{m.rearTire}</b></span></Link>)}</div>
      <CTAGroup><Link className="button secondary small" href="/fitment">Search all {publicMotorcycles.length} motorcycles in Fitment Finder</Link></CTAGroup>
    </section>

    <section id="common-sizes" className="tire-master-section ui-page-section">
      <SectionHeader className="section-head compact" kicker="Size index" title="Common stock motorcycle tire sizes" description="These are grouped from the motorcycles currently in the catalog. Use them for discovery only, then open the exact motorcycle before ordering." />
      <div className="guide-master-link-grid ui-content-grid topic-grid">{commonSizes.map(row=><article className="ui-content-card" key={row.label}><h3>{row.label}</h3><p>{row.models.length} motorcycle{row.models.length===1?"":"s"} use this size at the front, rear or both</p><p className="tire-size-model-links">{row.models.slice(0,5).map((m,index)=><span key={m.id}>{index>0?" · ":""}<Link href={`/motorcycles/${m.makeSlug}/${m.slug}#tires-fitment`}>{m.make} {m.model}</Link></span>)}</p></article>)}</div>
    </section>

    <section id="products" className="tire-master-section ui-page-section">
      <SectionHeader className="section-head inline-head" kicker="Replacement tires" title="Verified motorcycle tire products" description="Product pages stay separate because each is a real tire family with its own manufacturer size range and use case." />
      <ProductGrid className="product-grid">{verifiedProducts.map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/tires/${p.brandSlug}/${p.slug}`,category:"Tire",brand:p.brand,model:p.model,meta:`${p.useCase} · ${p.knownSizes.length} listed sizes`,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}</ProductGrid>
    </section>

    <div className="fitment-crosslinks"><Link href="/fitment"><strong>Fitment finder</strong><small>Tires + motorcycle-specific accessories →</small></Link><Link href="/motorcycles"><strong>Motorcycle catalog</strong><small>Open exact model tire sections →</small></Link><Link href="/methodology"><strong>How fitment is checked</strong><small>Evidence and publishing rules →</small></Link></div>

    <JsonLd data={schema}/>
    <AuthorBox/>
  </section>;
}
