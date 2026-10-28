"use client";

import { useMemo, useState } from "react";
import type { FuelCompany, FuelMovement, FuelType } from "@/lib/fuelPriceFeed";
import styles from "@/app/gas-price-philippines/page.module.css";

type FuelFilter = "all" | FuelType;
const fuels: FuelType[] = ["gasoline", "diesel", "kerosene"];
const names: Record<FuelType, string> = { gasoline: "Gasoline", diesel: "Diesel", kerosene: "Kerosene" };

function formatChange(value: number | null): string {
  if (value === null) return "—";
  const amount = `₱${Math.abs(value).toFixed(2)}`;
  return value < 0 ? `−${amount}` : value > 0 ? `+${amount}` : amount;
}
function direction(value: number | null): string {
  if (value === null) return styles.unreported;
  return value < 0 ? styles.decrease : value > 0 ? styles.increase : styles.unchanged;
}

export function FuelCompanyExplorer({ companies, sourceUrl }: { companies: FuelCompany[]; sourceUrl: string }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FuelFilter>("all");
  const [expanded, setExpanded] = useState(false);
  const matching = useMemo(() => companies.filter((company) =>
    company.company.toLocaleLowerCase("en").includes(query.trim().toLocaleLowerCase("en")) &&
    (filter === "all" || company[filter] !== null)), [companies, query, filter]);
  const visible = expanded ? matching : matching.slice(0, 7);
  const visibleTypes = filter === "all" ? fuels : [filter];
  const remaining = matching.length - visible.length;

  return <div className={styles.tableBox}>
    <div className={styles.tableToolbar}>
      <label className={styles.companySearch}>
        <span className={styles.srOnly}>Search oil companies</span>
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 5 5"/></svg>
        <input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setExpanded(false); }} placeholder="Search oil companies" />
      </label>
      <div className={styles.fuelFilters} role="group" aria-label="Filter oil company fuel type">
        {(["all", ...fuels] as FuelFilter[]).map((type) => <button
          key={type} type="button" aria-pressed={filter === type}
          className={filter === type ? styles.filterActive : ""}
          onClick={() => { setFilter(type); setExpanded(false); }}
        >{type === "all" ? "All fuels" : names[type]}</button>)}
      </div>
    </div>
    <div className={styles.tableScroll}>
      <table className={styles.dataTable}>
        <caption className={styles.srOnly}>Price adjustments by oil company in Philippine pesos per liter; blank values were not reported</caption>
        <thead><tr><th scope="col">Oil company</th>{visibleTypes.map((type) => <th scope="col" key={type}>{names[type]} <span>(₱/L)</span></th>)}<th scope="col">Source</th></tr></thead>
        <tbody>
          {visible.map((company) => <tr key={company.company}>
            <th scope="row">{company.company}</th>
            {visibleTypes.map((type) => <td key={type}><span className={`${styles.number} ${direction(company[type])}`}>{formatChange(company[type])}</span></td>)}
            <td><a href={sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`DOE notice for ${company.company} price adjustment`}>DOE ↗</a></td>
          </tr>)}
          {matching.length === 0 ? <tr><td className={styles.empty} colSpan={visibleTypes.length + 2}>No reporting companies match this filter.</td></tr> : null}
        </tbody>
      </table>
    </div>
    <div className={styles.tableBottom}>
      <span aria-live="polite">Showing {visible.length} of {matching.length} matching companies</span>
      {remaining > 0 ? <button type="button" onClick={() => setExpanded(true)}>View all {matching.length} companies ↓</button> :
        expanded && matching.length > 7 ? <button type="button" onClick={() => setExpanded(false)}>Show fewer ↑</button> : null}
    </div>
  </div>;
}

function formatImpact(value: number): string {
  return `₱${Math.abs(value).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function FuelCostImpactCalculator({ summary }: { summary: Record<FuelType, FuelMovement> }) {
  const [fuel, setFuel] = useState<FuelType>("gasoline");
  const [litersInput, setLitersInput] = useState("8");
  const liters = Number(litersInput);
  const valid = litersInput.trim() !== "" && Number.isFinite(liters) && liters > 0 && liters <= 10000;
  const adjustment = summary[fuel];
  const low = valid && adjustment ? adjustment.min * liters : null;
  const high = valid && adjustment ? adjustment.max * liters : null;
  const value = low === null || high === null ? "Not available" : low !== high
    ? `${formatImpact(low)} to ${formatImpact(high)}`
    : `${formatImpact(low)} ${low < 0 ? "less" : low > 0 ? "more" : "change"}`;

  return <article className={styles.calculator}>
    <span className={styles.calcEyebrow}>Quick fuel cost estimate</span>
    <h3>Your weekly fuel impact</h3>
    <p>Estimate how a reported price adjustment could change your fuel bill, assuming the same weekly volume.</p>
    <div className={styles.calcFields}>
      <label>Fuel type
        <select value={fuel} onChange={(event) => setFuel(event.target.value as FuelType)}>
          {fuels.map((type) => <option key={type} value={type}>{names[type]}</option>)}
        </select>
      </label>
      <label>Liters per week
        <input type="number" min="0.1" max="10000" step="0.1" inputMode="decimal" value={litersInput} onChange={(event) => setLitersInput(event.target.value)} aria-invalid={!valid} />
      </label>
    </div>
    <div className={styles.calcResult} aria-live="polite">
      <span>Estimated change in weekly fuel spend</span>
      <strong>{value}</strong>
    </div>
    <small>{!valid ? "Enter a weekly fuel volume greater than 0 and no more than 10,000 liters." :
      adjustment === null ? "No reported price movement is available for this fuel." :
      low !== high ? "A range reflects different oil-company notices; signs and direction may vary." :
      "Illustrative estimate only, not a retail price forecast. Actual stations and dates may differ."}</small>
  </article>;
}
