import { isCompetitorSource } from "@/lib/competitors";
import { dealerFinancingObservationsFor } from "@/lib/dealerFinancing";
import { php } from "@/lib/utils";
import { SectionHeader, StatRow } from "@/components/ui";

export function DealerFinancingSnapshot({ modelId, modelName }: { modelId: string; modelName: string }) {
  const observations = dealerFinancingObservationsFor(modelId);
  if (!observations.length) return null;

  const items = observations.map((row) => ({
    label: <a href={row.sourceUrl} target="_blank" rel={isCompetitorSource(row.sourceUrl) ? "nofollow noreferrer" : "noreferrer"}>{row.label}</a>,
    value: php(row.srpPhp),
    note: row.downPaymentPhp && row.monthlyPhp
      ? <>{php(row.downPaymentPhp)} down · {php(row.monthlyPhp)}/mo · checked {row.checkedAt}</>
      : <>SRP only on the current dealer page · checked {row.checkedAt}</>
  }));

  return <div className="financing-snapshot finance-scenario-section" data-dealer-financing-snapshot={modelId}>
    <SectionHeader
      kicker="Dealer snapshot"
      title={`${modelName} dealer price and financing examples`}
      description="Current Motortrade observations are shown separately from MotoIndex planning estimates so branch-specific dealer figures are not mixed with a generic loan calculation."
    />
    <StatRow className="finance-scenario-row" items={items} />
    <div className="entity-section-note">
      {observations.map((row) => <p key={`${row.modelId}-${row.label}`}><strong>{row.label}:</strong> {row.note}</p>)}
    </div>
    <p className="muted-copy">Dealer figures are indicative observations, not guaranteed quotes. Monthly values are reproduced only when the dealer publishes them; MotoIndex does not infer missing terms, rates or payments.</p>
  </div>;
}
