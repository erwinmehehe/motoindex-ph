import type { Motorcycle } from "@/lib/types";
import { getVerifiedVariantsForModel } from "@/lib/variants";
import { php } from "@/lib/utils";

export function VariantMatrix({ model }: { model: Motorcycle }) {
  const variants = getVerifiedVariantsForModel(model.id);
  if (variants.length < 2) return null;
  return <section className="variant-module">
    <div className="section-head compact"><div><h2>{model.model} variants and SRPs</h2><p>Current Philippine trims with separate suggested retail prices and equipment differences. Dealer prices can differ from these SRPs.</p></div></div>
    <div className="variant-grid">
      {variants.map((variant)=><article className="variant-card" key={variant.id}>
        <div className="variant-card-head"><div><span>{model.make} {model.model}</span><h3>{variant.name}</h3></div><strong>{php(variant.srpPhp)}</strong></div>
        <p>{variant.featureSummary}</p>
        <ul>{variant.differentiators.map((item)=><li key={item}>{item}</li>)}</ul>
        {(variant.braking || variant.weightKg || variant.colors?.length) && <div className="variant-facts">{variant.braking&&<span><small>Braking / control</small><b>{variant.braking}</b></span>}{variant.weightKg&&<span><small>Listed weight</small><b>{variant.weightKg} kg</b></span>}{variant.colors?.length&&<span><small>Listed colors</small><b>{variant.colors.join(", ")}</b></span>}</div>}
        <a href={variant.sourceUrl} target="_blank" rel="noreferrer"><span>Checked {variant.checkedAt} · {variant.sourceLabel}</span><b>Open source ↗</b></a>
      </article>)}
    </div>
    <p className="variant-footnote">SRP and dealer asking price are different. Check the market-price section for current dealer and comparison-site observations.</p>
  </section>;
}
