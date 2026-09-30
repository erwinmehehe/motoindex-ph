import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { electricMotorcycles, getElectricMotorcycle, php } from "@/lib/electricMotorcycles";
import { absoluteUrl, pageMetadata } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams(){return electricMotorcycles.map(model=>({slug:model.slug}));}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params; const model=getElectricMotorcycle(slug); if(!model)return {};
  return pageMetadata({
    title:`${model.make} ${model.model} Price, Range & Specs Philippines`,
    description:`${model.make} ${model.model} electric motorcycle price, battery capacity, claimed range, charging time, maximum speed and LTO classification in the Philippines.`,
    path:`/motorcycles/electric/${model.slug}`,
    image:model.imageUrl
  });
}

export default async function ElectricModelPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const model=getElectricMotorcycle(slug); if(!model)return notFound();
  const name=`${model.make} ${model.model}`;
  const schema={"@context":"https://schema.org","@type":"Product",name,image:[model.imageUrl],brand:{"@type":"Brand",name:model.make},offers:{"@type":"AggregateOffer",priceCurrency:"PHP",lowPrice:model.priceFromPhp,highPrice:model.twoBatteryPricePhp||model.priceFromPhp,offerCount:3,url:absoluteUrl(`/motorcycles/electric/${model.slug}`)}};
  return <section className="page shell electric-model-page">
    <JsonLd data={schema}/>
    <Breadcrumbs items={[{label:"Motorcycles",href:"/motorcycles"},{label:"Electric",href:"/motorcycles/electric"},{label:name}]}/>
    <div className="product-hero">
      <div className="product-hero-media"><img src={model.imageUrl} alt={`${name} electric motorcycle`} decoding="async"/><small>Image: {model.make} Philippines</small></div>
      <div className="product-hero-copy">
        <span className="entity-kicker">LTO L3 electric motorcycle</span>
        <h1>{name} price and specifications</h1>
        <p>{name} starts at <strong>{php(model.priceFromPhp)}</strong>. The one-battery setup has a {model.batteryKwh} kWh battery and a claimed {model.rangeOneKm} km range. The two-battery setup has {model.twoBatteryKwh} kWh and a claimed {model.rangeTwoKm} km range.</p>
        <div className="hero-actions"><a className="button" href={model.sourceUrl} rel="nofollow noopener noreferrer" target="_blank">Check official model page</a><Link className="button secondary" href="/tools/electric-motorcycle-charging-cost">Estimate charging cost</Link></div>
      </div>
    </div>

    <section className="motorcycle-entity-section">
      <div className="section-head compact"><div><h2>{name} price options</h2><p>Battery subscription and battery ownership produce different starting prices.</p></div></div>
      <div className="price-history-summary">
        <div><span>Battery subscription</span><strong>{php(model.priceFromPhp)}</strong></div>
        <div><span>One battery</span><strong>{model.oneBatteryPricePhp?php(model.oneBatteryPricePhp):"Check manufacturer"}</strong></div>
        <div><span>Two batteries</span><strong>{model.twoBatteryPricePhp?php(model.twoBatteryPricePhp):"Check manufacturer"}</strong></div>
      </div>
      <p className="variant-footnote">The subscription starting price comes from the manufacturer. One- and two-battery purchase prices are recorded from a dated Philippine motorcycle-news report. <a href={model.purchasePriceSourceUrl} target="_blank" rel="nofollow noopener noreferrer">Check the battery-purchase price source</a>.</p>
    </section>

    <section className="motorcycle-entity-section">
      <div className="section-head compact"><div><h2>Battery, range and charging</h2></div></div>
      <div className="entity-spec-grid">
        <div><span>Battery type</span><strong>{model.batteryType}</strong></div>
        <div><span>One-battery capacity</span><strong>{model.batteryKwh} kWh</strong></div>
        <div><span>Two-battery capacity</span><strong>{model.twoBatteryKwh} kWh</strong></div>
        <div><span>Claimed range, one battery</span><strong>{model.rangeOneKm} km</strong></div>
        <div><span>Claimed range, two batteries</span><strong>{model.rangeTwoKm} km</strong></div>
        <div><span>Full charge, one battery</span><strong>{model.chargeOneHours} hours</strong></div>
        <div><span>Full charge, two batteries</span><strong>{model.chargeTwoHours} hours</strong></div>
        <div><span>Maximum speed</span><strong>{model.topSpeedKph} km/h</strong></div>
        <div><span>Maximum power, one battery</span><strong>{(model.maxPowerOneW/1000).toFixed(1)} kW</strong></div>
        <div><span>Maximum power, two batteries</span><strong>{(model.maxPowerTwoW/1000).toFixed(1)} kW</strong></div>
        <div><span>Dimensions</span><strong>{model.dimensionsMm} mm</strong></div>
        <div><span>Wheelbase</span><strong>{model.wheelbaseMm} mm</strong></div>
      </div>
      <p className="variant-footnote">Range and charging figures are manufacturer claims for the stated battery setup. Actual results depend on speed, rider weight, payload, road conditions, temperature and battery condition.</p>
    </section>

    <section className="motorcycle-entity-section">
      <div className="section-head compact"><div><h2>LTO registration classification</h2></div></div>
      <div className="source-panel"><p>{name} is listed by LTO as an L3 electric motorcycle without sidecar. It must be registered as a motorcycle for public-road use. Confirm that the battery configuration on the unit matches its registration documents.</p><a href={model.ltoSourceUrl} target="_blank" rel="nofollow noopener noreferrer">Open the LTO classification circular</a></div>
    </section>

    <section className="motorcycle-entity-section">
      <div className="section-head compact"><div><h2>Available colors</h2></div></div>
      <p>{model.colors.join(", ")}.</p>
    </section>

    <FaqSection title={`${name} questions`} items={[
      {question:`How much is the ${name} in the Philippines?`,answer:`The starting price is ${php(model.priceFromPhp)} with battery subscription. The recorded battery-purchase prices are ${model.oneBatteryPricePhp?php(model.oneBatteryPricePhp):"not available"} with one battery and ${model.twoBatteryPricePhp?php(model.twoBatteryPricePhp):"not available"} with two batteries.`},
      {question:`What is the range of the ${name}?`,answer:`The manufacturer claims ${model.rangeOneKm} km with one battery and ${model.rangeTwoKm} km with two batteries. Real range changes with riding conditions and load.`},
      {question:`How long does the ${name} take to charge?`,answer:`The published 0–100% charging time is ${model.chargeOneHours} hours for one battery and ${model.chargeTwoHours} hours for two batteries.`},
      {question:`Does the ${name} need LTO registration?`,answer:"Yes. LTO classifies this model as an L3 electric motorcycle without sidecar, so it follows motorcycle registration requirements for public-road use."}
    ]}/>
  </section>;
}
