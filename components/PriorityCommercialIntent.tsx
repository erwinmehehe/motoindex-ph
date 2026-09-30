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
      <article className="commercial-intent-card" style={{display:"flex",minWidth:0,padding:22,flexDirection:"column",border:"1px solid var(--mi-color-line)",borderRadius:18,background:"var(--mi-color-surface)",boxShadow:"var(--mi-shadow-sm)"}}>
        <span>Published price</span>
        <h3>{observedMarketPriceLabel(model)}</h3>
        <div className="commercial-intent-meta" style={{display:"flex",gap:7,marginTop:12,color:"var(--mi-color-copy)",fontSize:9}}><b>Checked</b><strong>{model.marketPriceCheckedAt || model.verifiedAt}</strong></div>
        <p>Confirm the exact variant, cash price, fees and availability before paying a reservation.</p>
        <Link href="#price">Check price and variants →</Link>
      </article>
      <article className="commercial-intent-card is-primary" style={{display:"flex",minWidth:0,padding:22,flexDirection:"column",border:"1px solid var(--mi-color-primary-soft)",borderRadius:18,background:"linear-gradient(145deg,var(--mi-color-primary-soft),var(--mi-color-surface) 62%)",boxShadow:"var(--mi-shadow-sm)"}}>
        <span>Planning example</span>
        <div className="commercial-finance-hero" style={{display:"grid",gridTemplateColumns:"auto 1fr",alignItems:"baseline",gap:"0 6px"}}><strong style={{color:"var(--mi-color-ink)",fontSize:27,letterSpacing:"-.04em"}}>{php(Math.round(finance.downPaymentPhp))}</strong><small style={{color:"var(--mi-color-copy)",fontSize:10}}>down</small><b style={{gridColumn:"1 / -1",marginTop:3,color:"var(--mi-color-primary)",fontSize:22,letterSpacing:"-.035em"}}>{php(Math.round(finance.monthlyPhp))}/mo</b></div>
        <div className="commercial-finance-facts" style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:13}}><span style={{padding:"6px 8px",border:"1px solid var(--mi-color-line)",borderRadius:999,background:"var(--mi-color-surface)",fontSize:8,fontWeight:750}}>20% down</span><span style={{padding:"6px 8px",border:"1px solid var(--mi-color-line)",borderRadius:999,background:"var(--mi-color-surface)",fontSize:8,fontWeight:750}}>36 months</span><span style={{padding:"6px 8px",border:"1px solid var(--mi-color-line)",borderRadius:999,background:"var(--mi-color-surface)",fontSize:8,fontWeight:750}}>12% annual</span></div>
        <p>Illustration only. {profile.moneyQuestion}</p>
        <Link href="#installment">Edit the monthly estimate →</Link>
      </article>
      <article className="commercial-intent-card">
        <span>Ownership check</span>
        <h3>Price the bike beyond the showroom</h3>
        <div className="commercial-cost-chips" style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:13}}>{["Service","Insurance","Tires","Fuel"].map((item)=><span key={item} style={{padding:"6px 8px",border:"1px solid var(--mi-color-line)",borderRadius:999,background:"var(--mi-color-surface)",fontSize:8,fontWeight:750}}>{item}</span>)}</div>
        <p>{profile.ownershipQuestion}</p>
        <Link href={`/ownership/cost-calculator?bike=${model.id}`}>Calculate 3-year ownership cost →</Link>
      </article>
    </div>

    {alternatives.length > 0 && <div className="priority-model-alternatives commercial-link-group" style={{marginTop:0,padding:"13px 0"}}>
      <strong>Cross-shop before buying</strong>
      {alternatives.map((item) => <Link key={item.id} href={`/motorcycles/${item.makeSlug}/${item.slug}`}>{item.make} {item.model} →</Link>)}
    </div>}

    {related.length > 0 && <div className="priority-model-alternatives commercial-link-group" style={{marginTop:0,padding:"13px 0"}}>
      <strong>Related {model.make} research</strong>
      {related.map((item) => <Link key={item.id} href={`/motorcycles/${item.makeSlug}/${item.slug}`}>{item.make} {item.model} →</Link>)}
    </div>}

    <div className="priority-model-alternatives commercial-link-group" style={{marginTop:0,padding:"13px 0"}}>
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
