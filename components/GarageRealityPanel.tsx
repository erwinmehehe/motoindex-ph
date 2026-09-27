"use client";

import type { CSSProperties } from "react";
import { useMemo } from "react";
import type {
  GarageCatalogModel,
  GarageOwnershipAnalytics,
  GarageRecord,
  SmartMaintenanceDue,
} from "@/lib/garage";

const s = {
  section: { margin: "0 0 42px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 14 },
  card: { minWidth: 0, padding: 22, border: "1px solid var(--line)", borderRadius: 22, background: "var(--white)" },
  kicker: { display: "block", color: "var(--accent)", fontSize: 10, fontWeight: 850, letterSpacing: ".1em", textTransform: "uppercase" },
  title: { margin: "6px 0 4px", fontSize: 24, lineHeight: 1.05, letterSpacing: "-.035em" },
  muted: { color: "var(--muted)", fontSize: 11, lineHeight: 1.5 },
  compare: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 16 },
  cell: { minWidth: 0, padding: 14, borderRadius: 14, background: "var(--paper)" },
  label: { display: "block", color: "var(--muted)", fontSize: 9, fontWeight: 850, letterSpacing: ".07em", textTransform: "uppercase" },
  value: { display: "block", marginTop: 5, fontSize: 21, lineHeight: 1, letterSpacing: "-.035em" },
  delta: { display: "block", marginTop: 12, fontSize: 12, fontWeight: 800 },
  facts: { display: "grid", gap: 8, marginTop: 16 },
  fact: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, paddingTop: 10, borderTop: "1px solid var(--line)" },
  factLabel: { color: "var(--muted)", fontSize: 11, lineHeight: 1.4 },
  factValue: { textAlign: "right", fontSize: 11, lineHeight: 1.4 },
} satisfies Record<string, CSSProperties>;

function signed(value: number, suffix = "") {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}${suffix}`;
}

function km(value?: number) {
  return value === undefined ? "Not available" : `${Math.round(value).toLocaleString()} km`;
}

export function GarageRealityPanel({
  catalog,
  analytics,
  records,
  smartMaintenance,
}: {
  catalog?: GarageCatalogModel;
  analytics: GarageOwnershipAnalytics | null;
  records: GarageRecord[];
  smartMaintenance: SmartMaintenanceDue[];
}) {
  const fuelBasis = useMemo(() => {
    const fills = records
      .filter((record) => record.category === "FUEL" && record.fullTank && record.odometerKm !== undefined && (record.liters || 0) > 0)
      .sort((a, b) => (a.odometerKm || 0) - (b.odometerKm || 0) || a.date.localeCompare(b.date));
    let usableIntervals = 0;
    for (let index = 1; index < fills.length; index += 1) {
      if ((fills[index].odometerKm || 0) > (fills[index - 1].odometerKm || 0)) usableIntervals += 1;
    }
    return { fills: fills.length, usableIntervals };
  }, [records]);

  const catalogEconomy = catalog?.fuelConsumptionKmL;
  const actualEconomy = analytics?.fuelEconomyKmL;
  const economyDeltaPct = catalogEconomy && actualEconomy !== undefined
    ? ((actualEconomy - catalogEconomy) / catalogEconomy) * 100
    : undefined;

  const catalogRange = catalog?.fuelTankL && catalogEconomy
    ? catalog.fuelTankL * catalogEconomy
    : undefined;
  const ownerRange = catalog?.fuelTankL && actualEconomy !== undefined
    ? catalog.fuelTankL * actualEconomy
    : undefined;
  const rangeDelta = catalogRange !== undefined && ownerRange !== undefined
    ? ownerRange - catalogRange
    : undefined;

  const nextMaintenance = useMemo(() => smartMaintenance
    .filter((item) => item.nextDueKm !== undefined)
    .sort((a, b) => (a.remainingKm ?? Number.POSITIVE_INFINITY) - (b.remainingKm ?? Number.POSITIVE_INFINITY))[0], [smartMaintenance]);

  if (!catalog) return null;

  return <section style={s.section} aria-label="Catalog versus owner reality">
    <div className="section-head">
      <div>
        <span className="field-label">Catalog vs your Garage</span>
        <h2>What the published figures look like in your ownership data.</h2>
        <p>MotoIndex keeps manufacturer/reference figures separate from your own logs. Owner figures below are calculated only from records saved in this Garage.</p>
      </div>
    </div>

    <div style={s.grid}>
      <article style={s.card}>
        <span style={s.kicker}>Fuel economy</span>
        <h3 style={s.title}>Published vs actual</h3>
        <small style={s.muted}>Actual economy uses consecutive full-tank fill-ups with increasing odometer readings.</small>
        <div style={s.compare}>
          <span style={s.cell}><small style={s.label}>Catalog figure</small><strong style={s.value}>{catalogEconomy !== undefined ? `${catalogEconomy.toFixed(1)} km/L` : "Not listed"}</strong></span>
          <span style={s.cell}><small style={s.label}>Your actual</small><strong style={s.value}>{actualEconomy !== undefined ? `${actualEconomy.toFixed(1)} km/L` : "Need fills"}</strong></span>
        </div>
        {economyDeltaPct !== undefined && <strong style={s.delta}>{signed(economyDeltaPct, "%")} vs the catalog figure</strong>}
        <div style={s.facts}>
          <div style={s.fact}><span style={s.factLabel}>Full-tank records</span><strong style={s.factValue}>{fuelBasis.fills}</strong></div>
          <div style={s.fact}><span style={s.factLabel}>Usable fill intervals</span><strong style={s.factValue}>{fuelBasis.usableIntervals}</strong></div>
          <div style={s.fact}><span style={s.factLabel}>Distance in economy calculation</span><strong style={s.factValue}>{km(analytics?.fuelEconomyDistanceKm)}</strong></div>
        </div>
      </article>

      <article style={s.card}>
        <span style={s.kicker}>Tank range estimate</span>
        <h3 style={s.title}>Catalog-based vs owner-based</h3>
        <small style={s.muted}>Both figures use the catalog tank capacity. The owner-based estimate swaps in your logged full-tank economy. Real range varies with traffic, load, speed and conditions.</small>
        <div style={s.compare}>
          <span style={s.cell}><small style={s.label}>Catalog-based</small><strong style={s.value}>{km(catalogRange)}</strong></span>
          <span style={s.cell}><small style={s.label}>Owner-based</small><strong style={s.value}>{km(ownerRange)}</strong></span>
        </div>
        {rangeDelta !== undefined && <strong style={s.delta}>{signed(rangeDelta, " km")} estimated difference per full tank</strong>}
        <div style={s.facts}>
          <div style={s.fact}><span style={s.factLabel}>Tank capacity used</span><strong style={s.factValue}>{catalog.fuelTankL !== undefined ? `${catalog.fuelTankL.toFixed(1)} L` : "Not listed"}</strong></div>
          <div style={s.fact}><span style={s.factLabel}>Catalog source</span><strong style={s.factValue}><a href={catalog.sourceUrl} target="_blank" rel="noreferrer">{catalog.sourceLabel} ↗</a></strong></div>
        </div>
      </article>

      <article style={s.card}>
        <span style={s.kicker}>Maintenance reality</span>
        <h3 style={s.title}>Schedule vs your completed service</h3>
        <small style={s.muted}>MotoIndex only shows an exact-model maintenance comparison when a verified schedule is available.</small>
        {catalog.exactMaintenance && nextMaintenance ? <>
          <div style={s.compare}>
            <span style={s.cell}><small style={s.label}>Next item</small><strong style={{ ...s.value, fontSize: 17 }}>{nextMaintenance.item}</strong></span>
            <span style={s.cell}><small style={s.label}>Due point</small><strong style={s.value}>{km(nextMaintenance.nextDueKm)}</strong></span>
          </div>
          <div style={s.facts}>
            <div style={s.fact}><span style={s.factLabel}>Due calculation basis</span><strong style={s.factValue}>{nextMaintenance.basis === "service-record" ? "Your last completed service" : "Verified model schedule"}</strong></div>
            <div style={s.fact}><span style={s.factLabel}>Last completion</span><strong style={s.factValue}>{nextMaintenance.lastCompletedDate || "Not logged"}{nextMaintenance.lastCompletedOdometerKm !== undefined ? ` · ${nextMaintenance.lastCompletedOdometerKm.toLocaleString()} km` : ""}</strong></div>
            <div style={s.fact}><span style={s.factLabel}>Source</span><strong style={s.factValue}>{catalog.maintenanceSourceUrl ? <a href={catalog.maintenanceSourceUrl} target="_blank" rel="noreferrer">{catalog.maintenanceSourceLabel || "Maintenance source"} ↗</a> : "Verified schedule data"}</strong></div>
          </div>
        </> : <div className="note-box"><p>{catalog.exactMaintenance ? "No mileage-based maintenance item is available to compare yet." : "This model currently has brand guidance only. MotoIndex will not invent exact maintenance intervals."}</p></div>}
      </article>
    </div>
  </section>;
}
