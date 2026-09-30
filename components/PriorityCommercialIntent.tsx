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

  return <section className="priority-model-brief shell" aria-labelledby={`commercial-intent-${model.id}`}>
    <div className="priority-model-brief-head">
      <span>Price and buying path</span>
      <h2 id={`commercial-intent-${model.id}`}>{modelName} price, monthly payment and alternatives</h2>
      <p>{profile.intentIntro}</p>
    </div>

    {profile.legacyContext && <div className="note-box">
      <h3>{profile.legacyContext.heading}</h3>
      <p>{profile.legacyContext.body}</p>
    </div>}

    <div className="priority-model-brief-grid">
      <article>
        <span>Published price</span>
        <h3>{observedMarketPriceLabel(model)}</h3>
        <p>Price reference checked {model.marketPriceCheckedAt || model.verifiedAt}. Confirm the exact variant, cash price, fees and availability before paying a reservation.</p>
        <Link href="#price">Check price and variants →</Link>
      </article>
      <article>
        <span>Planning example</span>
        <h3>{php(Math.round(finance.downPaymentPhp))} down · {php(Math.round(finance.monthlyPhp))}/mo</h3>
        <p>Illustration only: 20% down, 36 months and 12% annual amortizing interest. {profile.moneyQuestion}</p>
        <Link href="#installment">Edit the monthly estimate →</Link>
      </article>
      <article>
        <span>Ownership check</span>
        <h3>Price the bike beyond the showroom</h3>
        <p>{profile.ownershipQuestion}</p>
        <Link href={`/ownership/cost-calculator?bike=${model.id}`}>Calculate 3-year ownership cost →</Link>
      </article>
    </div>

    {alternatives.length > 0 && <div className="priority-model-alternatives">
      <strong>Cross-shop before buying</strong>
      {alternatives.map((item) => <Link key={item.id} href={`/motorcycles/${item.makeSlug}/${item.slug}`}>{item.make} {item.model} →</Link>)}
    </div>}

    {related.length > 0 && <div className="priority-model-alternatives">
      <strong>Related {model.make} research</strong>
      {related.map((item) => <Link key={item.id} href={`/motorcycles/${item.makeSlug}/${item.slug}`}>{item.make} {item.model} →</Link>)}
    </div>}

    <div className="priority-model-alternatives">
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
