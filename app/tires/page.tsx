import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { publicMotorcycles } from "@/lib/data";
import { tireProducts } from "@/lib/catalog";
import { FitmentExplorer } from "@/components/FitmentExplorer";
import { ProductCard } from "@/components/ProductCard";
import { AuthorBox } from "@/components/AuthorBox";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";
import { tireFamilyHubs } from "@/lib/tireSeo";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Tire Finder Philippines: Sizes & Fitment Guide",
  description: "Find the recorded front and rear tire sizes for Philippine motorcycles, then research compatible tire products, common sizes and fitment guidance.",
  path: "/tires",
  index: true
});

function normalize(value:string){
  return value.toUpperCase().replace(/\s+/g,"").replace(/R(?=\d)/g,"-").replace(/M\/C/g,"").replace(/--+/g,"-");
}

export default function TiresPage(){
  const verifiedProducts=tireProducts.filter(p=>p.status==="verified");
  const productPreview=verifiedProducts.filter(p=>typeof p.priceFromPhp==="number").slice(0,6);
  const models=publicMotorcycles.map(({ id, make, makeSlug, model, slug, category, frontTire, rearTire })=>({id,make,makeSlug,model,slug,category,frontTire,rearTire}));
  const sizeMap=new Map<string,{label:string;count:number}>();
  for(const model of publicMotorcycles){
    for(const size of [model.frontTire,model.rearTire]){
      const key=normalize(size);
      const row=sizeMap.get(key)||{label:size,count:0};
      row.count+=1;
      sizeMap.set(key,row);
    }
  }
  const commonSizes=[...sizeMap.values()].sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label)).slice(0,8);

  const schema=articleSchema({
    headline:"Motorcycle tire size and fitment guide for the Philippines",
    description:"Find stock motorcycle tire sizes first, then research fitment, common sizes and replacement tire families.",
    path:"/tires",
    about:"motorcycle tire size Philippines",
    keywords:["motorcycle tire size chart","motorcycle tire size Philippines","motorcycle tire finder","Aerox tire size","NMAX tire size","Honda Click tire size"],
    checkedDates:publicMotorcycles.map(m=>m.verifiedAt)
  });

  return <section className="page shell tire-master-page">
    <div className="page-head">
      <span className="entity-kicker">Motorcycle tire finder</span>
      <h1>Find tires for your motorcycle.</h1>
      <p>Start with the exact motorcycle or a tire-size marking. MotoIndex will show the recorded front and rear sizes before you open product research.</p>
      <div className="hero-actions"><a className="button" href="#tire-finder">Find my tire size</a><a className="button secondary" href="#products">Browse researched tires</a></div>
    </div>

    <section id="tire-finder" className="tire-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Start here</span><h2>Choose motorcycle or enter tire size</h2><p>The Finder stays empty until you search, so you do not have to scan the whole motorcycle catalog first.</p></div></div>
      <FitmentExplorer models={models}/>
    </section>

    <section id="products" className="tire-master-section">
      <div className="section-head inline-head"><div><span className="section-kicker">Researched tire products</span><h2>Replacement tires worth opening next</h2><p>Matching a size is only the first check. Open the product and confirm front/rear application, load and speed rating, construction and rim requirements.</p></div></div>
      {productPreview.length>0?<div className="product-grid">{productPreview.map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/tires/${p.brandSlug}/${p.slug}`,category:"Tire",brand:p.brand,model:p.model,meta:p.useCase,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}</div>:<div className="note-box compact-note"><p>No priced verified tire products are ready for the discovery shelf yet.</p></div>}
      {verifiedProducts.length>productPreview.length&&<details className="tire-product-catalog"><summary>Browse all {verifiedProducts.length} researched tire products</summary><div className="product-grid">{verifiedProducts.map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/tires/${p.brandSlug}/${p.slug}`,category:"Tire",brand:p.brand,model:p.model,meta:`${p.useCase} · ${p.knownSizes.length} listed sizes`,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}</div></details>}
    </section>

    <section className="tire-master-section">
      <div className="section-head compact"><div><span className="section-kicker">How to read a tire</span><h2>What 110/80-14 actually tells you</h2><p>The printed size is useful, but it does not prove complete fitment by itself.</p></div></div>
      <div className="topic-grid">
        <article><h3>110</h3><p>Nominal section width in millimeters.</p></article>
        <article><h3>80</h3><p>Aspect ratio: sidewall height relative to nominal width.</p></article>
        <article><h3>14</h3><p>Rim diameter in inches.</p></article>
        <article><h3>Also verify</h3><p>Front/rear application, load index, speed rating, construction, tube/tubeless requirement, rim width and clearance.</p></article>
      </div>
    </section>

    <section className="tire-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Popular sizes</span><h2>Common stock sizes in the current catalog</h2><p>Use these for orientation, then search the exact motorcycle above before ordering.</p></div></div>
      <div className="guide-master-link-grid">{commonSizes.map(row=><article key={row.label}><strong>{row.label}</strong><small>{row.count} front/rear occurrences in current model records</small></article>)}</div>
    </section>

    <section className="tire-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Generation guides</span><h2>Do not mix popular model generations</h2><p>Aerox, NMAX and Click names span multiple generations. Open the family guide when the model year is uncertain.</p></div></div>
      <div className="guide-master-link-grid">{tireFamilyHubs.map(hub=><Link key={hub.slug} href={`/tires/${hub.slug}`}><strong>{hub.shortName}</strong><small>{hub.description}</small></Link>)}</div>
    </section>

    <div className="note-box"><h3>Matching the size is not complete fitment</h3><p>Changing width or aspect ratio can affect steering, clearance and overall diameter. Use manufacturer guidance or a qualified tire specialist before changing from the recorded stock specification.</p></div>

    <JsonLd data={schema}/>
    <AuthorBox/>
  </section>;
}
