import Link from "next/link";
import { dealerFinancingObservationsFor } from "@/lib/dealerFinancing";
import { php } from "@/lib/utils";
import { SectionHeader } from "@/components/ui";

function readableDate(date: string) {
  const parsed = new Date(date + "T00:00:00Z");
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString("en-PH", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function DealerFinancingSnapshot({ modelId, modelName }: { modelId: string; modelName: string }) {
  const observations = dealerFinancingObservationsFor(modelId);

  return <div className="financing-snapshot installment-dealer-snapshot" data-dealer-financing-snapshot={modelId}>
    <SectionHeader
      kicker="Source-checked, not a quotation"
      title={modelName + " dealer financing observations"}
      description="These are dated published dealer listings, not comparable loan offers. The full term, rate method, fees and unit variant are not always stated."
    />
    {observations.length ? <div className="installment-dealer-grid">
      {observations.map(row => {
        const hasMonthly = typeof row.downPaymentPhp === "number" && typeof row.monthlyPhp === "number";
        return <article className="installment-dealer-card" key={row.modelId + "-" + row.label}>
          <div className="installment-dealer-card-heading">
            <div>
              <span className="installment-dealer-source">Published dealer listing</span>
              <h3>{row.label}</h3>
            </div>
            <time dateTime={row.checkedAt}>Checked {readableDate(row.checkedAt)}</time>
          </div>
          <div className="installment-dealer-figures">
            <div><span>Published listing price</span><strong>{php(row.srpPhp)}</strong></div>
            {hasMonthly ? <>
              <div><span>Advertised cash down</span><strong>{php(row.downPaymentPhp!)}</strong></div>
              <div className="installment-dealer-monthly"><span>Advertised monthly</span><strong>{php(row.monthlyPhp!)}/mo</strong></div>
            </> : <div className="installment-dealer-empty"><span>Monthly financing not published</span><strong>Ask the dealer</strong></div>}
          </div>
          {row.note && <p>{row.note}</p>}
          <div className="installment-dealer-card-footer">
            <span>{row.sourceName}</span>
            <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer">View source <span aria-hidden="true">↗</span></a>
          </div>
        </article>;
      })}
    </div> : <div className="installment-dealer-empty-state">
      <h3>No complete dealer financing observations on file</h3>
      <p>We do not fill gaps with invented downpayments or monthly offers. Use the calculator above for planning, then ask a dealer for a written breakdown.</p>
      <Link className="button ghost" href="/dealers">Find checked dealer records</Link>
    </div>}
    <p className="installment-dealer-disclaimer">Dealer cards and MotoIndex estimates use different assumptions. Do not compare the monthly amounts directly without knowing the exact downpayment, number of payments, interest-rate method, fees and variant.</p>
  </div>;
}
