import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { getModelById } from "@/lib/data";
import { getModelGearGuide, modelGearGuides } from "@/lib/modelGearGuides";
import { helmetProducts, getTireProductsForModel, getTopBoxProductsForModel } from "@/lib/catalog";
import { pageMetadata } from "@/lib/site";

export function generateStaticParams(){
  return modelGearGuides.map(guide=>{
    const model=getModelById(guide.modelId);
    return model ? {make:model.makeSlug,slug:model.slug} : null;
  }).filter((value):value is {make:string;slug:string}=>Boolean(value));
}

function modelForRoute(make:string,slug:string){
  return modelGearGuides.map(guide=>getModelById(guide.modelId)).find(item=>item?.makeSlug===make&&item.slug===slug);
}

export async function generateMetadata({params}:{params:Promise<{make:string;slug:string}>}):Promise<Metadata>{
  const {make,slug}=await params;
  const model=modelForRoute(make,slug);
  if(!model)return {};
  return pageMetadata({
    title:`Gear for ${model.make} ${model.model}: Helmets, Tires & Top Boxes`,
    description:`Compare verified helmets, matching tire sizes and model-specific top-box fitment options for the ${model.make} ${model.model} in the Philippines.`,
    path:`/motorcycles/${model.makeSlug}/${model.slug}/gear`
  });
}

export default async function ModelGearPage({params}:{params:Promise<{make:string;slug:string}>}){
  const {make,slug}=await params;
  const model=modelForRoute(make,slug);
  if(!model)return notFound();
  const guide=getModelGearGuide(model.id)!;
  const helmets=guide.helmetIds.map(id=>helmetProducts.find(product=>product.id===id)).filter((item):item is NonNullable<typeof item>=>Boolean(item&&item.status==="verified"));
  const tires=getTireProductsForModel(model.id);
  const topBoxes=getTopBoxProductsForModel(model.id);

  return <section className="page shell">
    <Breadcrumbs items={[{label:"Motorcycles",href:"/motorcycles"},{label:model.make,href:`/motorcycles/${model.makeSlug}`},{label:model.model,href:`/motorcycles/${model.makeSlug}/${model.slug}`},{label:"Gear"}]}/>
    <div className="page-head"><span className="entity-kicker">Gear guide</span><h1>Gear for the {model.make} {model.model}</h1><p>{guide.intro}</p></div>

    <section className="motorcycle-entity-section">
      <div className="section-head compact"><div><h2>Helmet options for {model.model} riders</h2><p>These are verified road-helmet records, not motorcycle-fitment claims. Measure your head, use the exact helmet size chart and check the PS or ICC mark on the unit sold in the Philippines.</p></div></div>
      <div className="product-grid">{helmets.map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/gear/helmets/${p.brandSlug}/${p.slug}`,category:p.helmetType,brand:p.brand,model:p.model,meta:[p.certification,p.intercomReady?"Intercom-ready":undefined].filter(Boolean).join(" · "),status:p.status,priceFromPhp:p.priceFromPhp}}/>)}</div>
    </section>

    <section className="motorcycle-entity-section">
      <div className="section-head compact"><div><h2>{model.model} tire options</h2><p>These products include at least one size matching the recorded stock front or rear tire. Confirm the full size, load/speed rating and axle application before ordering.</p></div></div>
      {tires.length?<div className="product-grid">{tires.map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/tires/${p.brandSlug}/${p.slug}`,category:"Tire",brand:p.brand,model:p.model,meta:`Size match · ${p.useCase}`,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}</div>:<div className="note-box"><h3>No verified replacement tire product is published for this stock-size match yet</h3><p>Use the model page for the recorded front and rear tire sizes before shopping.</p></div>}
    </section>

    <section className="motorcycle-entity-section">
      <div className="section-head compact"><div><h2>{model.model} top-box options</h2><p>Top boxes appear here only when MotoIndex has a model-specific fitment edge. Capacity alone is not treated as proof that the box mounts to this motorcycle.</p></div></div>
      {topBoxes.length?<div className="product-grid">{topBoxes.map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/accessories/top-box/${p.slug}`,category:"Top box",brand:p.brand,model:p.model,meta:`${p.capacityL}L · model-specific fitment record available`,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}</div>:<div className="note-box"><h3>No model-specific top-box fitment is published yet</h3><p>Do not assume a universal plate or capacity will fit. Confirm the motorcycle-specific rear rack, plate and load limit first.</p></div>}
    </section>

    <div className="cta-panel"><div><span className="section-kicker">Back to the motorcycle</span><h2>Check price, fit and ownership before buying gear</h2><p>Use the model page for stock tire sizes, rider fit, price sources and dealer options.</p></div><Link className="button" href={`/motorcycles/${model.makeSlug}/${model.slug}`}>Open {model.model}</Link></div>
  </section>;
}
