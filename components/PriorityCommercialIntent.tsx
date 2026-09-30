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

    <div className="comparison-highlight-grid priority-commercial-grid">
      <article>
        <span>Published price</span>
        <strong>{observedMarketPriceLabel(model)}</strong>
        <p>Checked {model.marketPriceCheckedAt || model.verifiedAt}. Confirm the exact trim, cash price, fees and availability before paying a reservation.</p>
        <Link className="text-link" href="#price">Check price and variants →</Link>
      </article>
      <article>
        <span>20% down planning example</span>
        <strong>{php(Math.round(finance.downPaymentPhp))} down</strong>
        <p><b>{php(Math.round(finance.monthlyPhp))}/month</b> for 36 months at 12% annual amortizing interest. Illustration only, not a lender quote.</p>
        <Link className="text-link" href="#installment">Edit downpayment and term →</Link>
      </article>
      <article>
        <span>Ownership check</span>
        <strong>Price beyond the showroom</strong>
        <p>{profile.ownershipQuestion}</p>
        <Link className="text-link" href={`/ownership/cost-calculator?bike=${model.id}`}>Calculate 3-year ownership cost →</Link>
      </article>
    </div>

    <div className="info-card priority-commercial-next">
      <h3>Compare and research next</h3>
      {alternatives.length > 0 && <div className="fitment-card-links">
        <strong>Cross-shop</strong>
        {alternatives.map((item) => <Link key={item.id} href={`/motorcycles/${item.makeSlug}/${item.slug}`}>{item.make} {item.model} →</Link>)}
      </div>}
      {related.length > 0 && <div className="fitment-card-links">
        <strong>Related {model.make}</strong>
        {related.map((item) => <Link key={item.id} href={`/motorcycles/${item.makeSlug}/${item.slug}`}>{item.make} {item.model} →</Link>)}
      </div>}
      <div className="fitment-card-links">
        <strong>Buying tools</strong>
        <Link href={`/motorcycles/${model.makeSlug}`}>All {model.make} prices →</Link>
        <Link href={profile.recommendationHref}>{profile.recommendationLabel} →</Link>
        <Link href="/research/motorcycle-financing-index-philippines">Downpayment index →</Link>
        <Link href={{ pathname: "/tools/motorcycle-loan-calculator", query: { price: range.from, model: modelName } }}>Loan calculator →</Link>
        <Link href={`/get-quote/${model.makeSlug}/${model.slug}`}>Get dealer price →</Link>
      </div>
    </div>
  </section>;
}
