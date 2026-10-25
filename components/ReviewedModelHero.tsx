import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { motorcycleEntitySeo } from "@/lib/motorcycleEntitySeo";
import { latestPriceReference, observedMarketPriceLabel } from "@/lib/marketChecks";
import { highIntentModelAnswer } from "@/lib/highIntentModelAnswers";
import { SourceRef } from "@/components/SourceRef";
import { getRenderableMedia } from "@/lib/renderableMedia";
import { Breadcrumbs } from "./Breadcrumbs";
import { Freshness } from "./Freshness";
import { CompareButton } from "./CompareButton";
import { SaveToShortlistButton } from "./SaveToShortlistButton";
import { ReviewedModelGallery } from "./ReviewedModelGallery";

const PRICE_FOCUSED_H1: Record<string, string> = {
  "yamaha-aerox-v3": "Aerox V3 Price Philippines",
  "yamaha-nmax-v3": "NMAX V3 Price Philippines",
  "honda-adv-160": "ADV 160 Price Philippines"
};

export function ReviewedModelHero({ model }: { model: Motorcycle }) {
  const seo = motorcycleEntitySeo(model);
  const priceFocusedHeading = PRICE_FOCUSED_H1[model.id];
  const highlightedAnswer = highIntentModelAnswer(model.id);
  const latestPrice = highlightedAnswer ? latestPriceReference(model) : null;
  const images = getRenderableMedia("motorcycle", model.id).map(({src,alt})=>({src,alt}));
  return <div className="reviewed-model-intro shell">
    <Breadcrumbs items={[{label:"Motorcycles",href:"/motorcycles"},{label:model.make,href:`/motorcycles/${model.makeSlug}`},{label:model.model}]} />
    <section className="reviewed-model-hero" id="overview"><div className="reviewed-model-copy"><span className="entity-kicker">{model.make} · {model.category}</span><h1>{priceFocusedHeading || <>{model.make}<br />{model.model}</>}</h1><p>{seo.intro}</p><strong className="reviewed-model-price">{observedMarketPriceLabel(model)}</strong><small>Published Philippine price · Final dealer pricing can vary.</small>{highlightedAnswer && <div className="source-panel"><h2>{highlightedAnswer.question}</h2><p>{highlightedAnswer.answer}</p>{latestPrice?.kind === "price-check" && <small>Most recent recorded price check: {latestPrice.date}. This is not a live dealer quote.</small>}{latestPrice?.kind === "model-source" && <small>No independently dated price check is recorded for this model. Confirm the seller’s current price.</small>}<small>Model specification reference checked {model.verifiedAt}. <SourceRef url={model.sourceUrl} label="View cited model source" /></small><nav aria-label="Price and comparison links" className="reviewed-model-links"><a href="#price">View price sources →</a><Link href={highlightedAnswer.compareHref}>{highlightedAnswer.compareLabel} →</Link></nav></div>}<div className="reviewed-model-actions"><CompareButton modelId={model.id} /><SaveToShortlistButton modelId={model.id} /></div><div className="reviewed-model-links"><Link href={`/get-quote/${model.makeSlug}/${model.slug}`}>Get dealer price →</Link><a href="#installment">Estimate monthly →</a></div><Freshness model={model} /></div><ReviewedModelGallery images={images} make={model.make} makeSlug={model.makeSlug} /></section>
    <div className="reviewed-model-colors"><b>Available colors</b>{model.colors.map(color=><span key={color}>{color}</span>)}</div>
    <div className="reviewed-spec-strip">{[["Engine",`${model.engineCc} cc`],["Max power",`${model.powerHp} hp`],["Max torque",`${model.torqueNm} Nm`],["Transmission",model.transmission||"See specs"],["Brakes",model.abs]].map(([label,value])=><div key={label}><b>{value}</b><small>{label}</small></div>)}</div>
  </div>;
}
