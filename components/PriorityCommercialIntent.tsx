import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { getModelById, isIndexableModel } from "@/lib/data";
import { financingScenario } from "@/lib/financing";
import { observedMarketPriceLabel, observedMarketRange } from "@/lib/marketChecks";
import { priorityModelGrowthProfile } from "@/lib/priorityModelGrowth";
import { php } from "@/lib/utils";

export function PriorityCommercialIntent({ model }: { model: Motorcycle }) {
  const profile = priorityModelGrowthProfile(model.id);
  if (!profile || model.marketStatus === "previous" || model.marketStatus === "uncertain" || model.marketStatus === "discontinued") return null;

  const range = observedMarketRange(model);
  const finance = financingScenario(range.from, 20, 36, 12);
  const alternatives = profile.alternativeIds
    .map(getModelById)
    .filter((item): item is Motorcycle => Boolean(item && isIndexableModel(item)));
  const related = profile.relatedIds
    .map(getModelById)
    .filter((item): item is Motorcycle => Boolean(item && isIndexableModel(item)));
  const modelName = `${model.make} ${model.model}`;

  return <section className="priority-model-brief priority-commercial-intent shell" aria-labelledby={`commercial-intent-${model.id}`}>
    <div className="priority-model-brief-head">
      <span>Price and buying path</span>
      <h2 id={`commercial-intent-${model.id}`}>{modelName} price, monthly payment and alternatives</h2>
      <p>{profile.intentIntro}</p>
    </div>

    {profile.legacyContext && <div className="note-box">
      <h3>{profile.legacyContext.heading}</h3>
      <p>{profile.legacyContext.body}</p>
    </div>}

    <div className="priority-model-brief-grid commercial-intent-grid">
      <article className="commercial-intent-card">
        <span>Published price</span>
        <h3>{observedMarketPriceLabel(model)}</h3>
        <div className="commercial-intent-meta"><b>Checked</b><strong>{model.marketPriceCheckedAt || model.verifiedAt}</strong></div>
        <p>Confirm the exact variant, cash price, fees and availability before paying a reservation.</p>
        <Link href="#price">Check price and variants →</Link>
      </article>
      <article className="commercial-intent-card is-primary">
        <span>Planning example</span>
        <div className="commercial-finance-hero"><strong>{php(Math.round(finance.downPaymentPhp))}</strong><small>down</small><b>{php(Math.round(finance.monthlyPhp))}/mo</b></div>
        <div className="commercial-finance-facts"><span>20% down</span><span>36 months</span><span>12% annual</span></div>
        <p>Illustration only. {profile.moneyQuestion}</p>
        <Link href="#installment">Edit the monthly estimate →</Link>
      </article>
      <article className="commercial-intent-card">
        <span>Ownership check</span>
        <h3>Price the bike beyond the showroom</h3>
        <div className="commercial-cost-chips"><span>Service</span><span>Insurance</span><span>Tires</span><span>Fuel</span></div>
        <p>{profile.ownershipQuestion}</p>
        <Link href={`/ownership/cost-calculator?bike=${model.id}`}>Calculate 3-year ownership cost →</Link>
      </article>
    </div>

    {alternatives.length > 0 && <div className="priority-model-alternatives commercial-link-group">
      <strong>Cross-shop before buying</strong>
      {alternatives.map((item) => <Link key={item.id} href={`/motorcycles/${item.makeSlug}/${item.slug}`}>{item.make} {item.model} →</Link>)}
    </div>}

    {related.length > 0 && <div className="priority-model-alternatives commercial-link-group">
      <strong>Related {model.make} research</strong>
      {related.map((item) => <Link key={item.id} href={`/motorcycles/${item.makeSlug}/${item.slug}`}>{item.make} {item.model} →</Link>)}
    </div>}

    <div className="priority-model-alternatives commercial-link-group">
      <strong>Research the purchase</strong>
      <Link href={`/motorcycles/${model.makeSlug}`}>All {model.make} prices and models →</Link>
      <Link href={profile.recommendationHref}>{profile.recommendationLabel} →</Link>
      <Link href="/research/motorcycle-price-index-philippines">Philippine motorcycle price index →</Link>
      <Link href="/research/motorcycle-financing-index-philippines">Downpayment and monthly index →</Link>
      <Link href="/research/motorcycle-seat-height-database">Seat-height database →</Link>
      <Link href={{ pathname: "/tools/motorcycle-loan-calculator", query: { price: range.from, model: modelName } }}>Open loan calculator →</Link>
      <Link href={`/get-quote/${model.makeSlug}/${model.slug}`}>Get dealer price →</Link>
    </div>
  </section>;
}
