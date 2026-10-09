import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { motorcycleEntitySeo } from "@/lib/motorcycleEntitySeo";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import { getRenderableMedia } from "@/lib/renderableMedia";
import { Breadcrumbs } from "./Breadcrumbs";
import { Freshness } from "./Freshness";
import { CompareButton } from "./CompareButton";
import { SaveToShortlistButton } from "./SaveToShortlistButton";
import { ReviewedModelGallery } from "./ReviewedModelGallery";

export function ReviewedModelHero({ model }: { model: Motorcycle }) {
  const seo = motorcycleEntitySeo(model);
  const images = getRenderableMedia("motorcycle", model.id).map(({src,alt})=>({src,alt}));
  return <div className="reviewed-model-intro shell">
    <Breadcrumbs items={[{label:"Motorcycles",href:"/motorcycles"},{label:model.make,href:`/motorcycles/${model.makeSlug}`},{label:model.model}]} />
    <section className="reviewed-model-hero" id="overview"><div className="reviewed-model-copy"><span className="entity-kicker">{model.make} · {model.category}</span><h1>{model.make}<br />{model.model}</h1><p>{seo.intro}</p><strong className="reviewed-model-price">{observedMarketPriceLabel(model)}</strong><small>Published Philippine price · Final dealer pricing can vary.</small><div className="reviewed-model-actions"><CompareButton modelId={model.id} /><SaveToShortlistButton modelId={model.id} /></div><div className="reviewed-model-links"><Link href={{pathname:"/dealers",query:{brand:model.make}}}>Find checked dealers →</Link><a href="#installment">Estimate monthly →</a></div><Freshness model={model} /></div><ReviewedModelGallery images={images} make={model.make} makeSlug={model.makeSlug} /></section>
    <div className="reviewed-model-colors"><b>Available colors</b>{model.colors.map(color=><span key={color}>{color}</span>)}</div>
    <div className="reviewed-spec-strip">{[["Engine",`${model.engineCc} cc`],["Max power",`${model.powerHp} hp`],["Max torque",`${model.torqueNm} Nm`],["Transmission",model.transmission||"See specs"],["Brakes",model.abs]].map(([label,value])=><div key={label}><b>{value}</b><small>{label}</small></div>)}</div>
  </div>;
}
