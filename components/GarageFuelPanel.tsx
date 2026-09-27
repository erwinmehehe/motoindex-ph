"use client";

import type { CSSProperties, FormEvent } from "react";
import { useMemo, useState } from "react";
import { money, type GarageOwnershipAnalytics, type GarageRecord } from "@/lib/garage";

export type GarageFuelRecordInput = {
  date: string;
  odometerKm: number;
  liters: number;
  pricePerLiterPhp?: number;
  amountPhp: number;
  fullTank: boolean;
  notes?: string;
};

const s = {
  section: { margin: "0 0 42px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 14, alignItems: "start" },
  card: { minWidth: 0, padding: 22, border: "1px solid var(--line)", borderRadius: 22, background: "var(--white)" },
  fields: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,145px),1fr))", gap: 10 },
  label: { display: "grid", gap: 6, color: "var(--muted)", fontSize: 11, fontWeight: 800 },
  summary: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,130px),1fr))", gap: 8, marginBottom: 14 },
  stat: { minWidth: 0, padding: 12, borderRadius: 14, background: "var(--paper)" },
  statLabel: { display: "block", color: "var(--muted)", fontSize: 9, fontWeight: 850, letterSpacing: ".07em", textTransform: "uppercase" },
  statValue: { display: "block", marginTop: 4, fontSize: 17, lineHeight: 1.15, letterSpacing: "-.025em" },
  history: { display: "grid", gap: 8 },
  row: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, padding: "11px 0", borderTop: "1px solid var(--line)" },
  muted: { color: "var(--muted)", fontSize: 11, lineHeight: 1.45 },
} satisfies Record<string, CSSProperties>;

function dateLabel(value: string) {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.valueOf())) return value;
  return parsed.toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
}

function numberValue(value: FormDataEntryValue | null) {
  if (value === null || String(value).trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export function GarageFuelPanel({
  records,
  currentOdometerKm,
  analytics,
  onAddFuel,
}: {
  records: GarageRecord[];
  currentOdometerKm: number;
  analytics: GarageOwnershipAnalytics | null;
  onAddFuel: (input: GarageFuelRecordInput) => void;
}) {
  const [message, setMessage] = useState("");

  const fuel = useMemo(() => records
    .filter((record) => record.category === "FUEL")
    .sort((a, b) => b.date.localeCompare(a.date) || (b.odometerKm || 0) - (a.odometerKm || 0)), [records]);

  const economyById = useMemo(() => {
    const fullTanks = fuel
      .filter((record) => record.fullTank && record.odometerKm !== undefined && (record.liters || 0) > 0)
      .sort((a, b) => (a.odometerKm || 0) - (b.odometerKm || 0) || a.date.localeCompare(b.date));
    const values = new Map<string, number>();
    for (let index = 1; index < fullTanks.length; index += 1) {
      const previous = fullTanks[index - 1];
      const current = fullTanks[index];
      const distance = (current.odometerKm || 0) - (previous.odometerKm || 0);
      if (distance > 0 && (current.liters || 0) > 0) values.set(current.id, distance / (current.liters || 1));
    }
    return values;
  }, [fuel]);

  const averagePrice = analytics?.fuelLiters && analytics.fuelLiters > 0
    ? analytics.fuelSpendPhp / analytics.fuelLiters
    : undefined;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);
    const date = String(form.get("date") || "");
    const odometerKm = numberValue(form.get("odometerKm"));
    const liters = numberValue(form.get("liters"));
    const pricePerLiterPhp = numberValue(form.get("pricePerLiterPhp"));
    const enteredAmount = numberValue(form.get("amountPhp"));
    const fullTank = form.get("fullTank") === "on";
    const notes = String(form.get("notes") || "").trim() || undefined;

    if (!date || odometerKm === undefined || liters === undefined || liters <= 0) {
      setMessage("Date, odometer and liters are required.");
      return;
    }
    if (date > new Date().toISOString().slice(0, 10)) {
      setMessage("Fuel date cannot be in the future.");
      return;
    }
    const amountPhp = enteredAmount ?? (pricePerLiterPhp !== undefined ? liters * pricePerLiterPhp : undefined);
    if (amountPhp === undefined) {
      setMessage("Enter either price per liter or the total fuel amount.");
      return;
    }

    onAddFuel({ date, odometerKm, liters, pricePerLiterPhp, amountPhp, fullTank, notes });
    setMessage(`Fuel entry saved at ${odometerKm.toLocaleString()} km.`);
    event.currentTarget.reset();
  }

  return <section style={s.section} aria-label="Fuel log">
    <div className="section-head">
      <div>
        <span className="field-label">Fuel log</span>
        <h2>Make real-world economy easy to maintain.</h2>
        <p>Log fill-ups here. Consecutive full-tank entries are what power Garage actual fuel economy and owner-based range estimates.</p>
      </div>
    </div>

    <div style={s.grid}>
      <article style={s.card}>
        <div style={s.summary}>
          <span style={s.stat}><small style={s.statLabel}>Fuel spend</small><strong style={s.statValue}>{money(analytics?.fuelSpendPhp)}</strong></span>
          <span style={s.stat}><small style={s.statLabel}>Liters logged</small><strong style={s.statValue}>{analytics?.fuelLiters ? `${analytics.fuelLiters.toFixed(1)} L` : "0 L"}</strong></span>
          <span style={s.stat}><small style={s.statLabel}>Actual economy</small><strong style={s.statValue}>{analytics?.fuelEconomyKmL !== undefined ? `${analytics.fuelEconomyKmL.toFixed(1)} km/L` : "Need full tanks"}</strong></span>
          <span style={s.stat}><small style={s.statLabel}>Avg logged price</small><strong style={s.statValue}>{averagePrice !== undefined ? `₱${averagePrice.toFixed(2)}/L` : "Not available"}</strong></span>
        </div>

        <form className="lead-form" onSubmit={submit}>
          <div style={s.fields}>
            <label style={s.label}>Date<input name="date" type="date" required max={new Date().toISOString().slice(0, 10)} defaultValue={new Date().toISOString().slice(0, 10)} /></label>
            <label style={s.label}>Odometer (km)<input name="odometerKm" type="number" min="0" step="1" required defaultValue={currentOdometerKm} /></label>
            <label style={s.label}>Liters<input name="liters" type="number" min="0.01" step="0.01" required /></label>
            <label style={s.label}>Price / liter<input name="pricePerLiterPhp" type="number" min="0" step="0.01" placeholder="Optional if total entered" /></label>
            <label style={s.label}>Total amount (₱)<input name="amountPhp" type="number" min="0" step="0.01" placeholder="Auto from liters × price/L" /></label>
            <label style={s.label}>Fill type<select name="fullTank" defaultValue=""><option value="">Partial / not sure</option><option value="on">Full tank</option></select></label>
          </div>
          <label style={{ ...s.label, marginTop: 10 }}>Notes<input name="notes" placeholder="Fuel station, route, traffic or riding notes" /></label>
          <div className="hero-actions"><button className="button small" type="submit">Save fuel entry</button></div>
          {message && <p className="muted-note" role="status">{message}</p>}
        </form>
      </article>

      <article style={s.card}>
        <div className="section-head"><div><h3>Recent fill-ups</h3><p>Interval economy appears on a full-tank entry when a prior full-tank odometer reading exists.</p></div></div>
        {fuel.length ? <div style={s.history}>
          {fuel.slice(0, 8).map((record) => {
            const intervalEconomy = economyById.get(record.id);
            return <div style={s.row} key={record.id}>
              <div>
                <strong>{record.liters !== undefined ? `${record.liters.toFixed(2)} L` : "Fuel entry"}</strong>
                <small style={{ ...s.muted, display: "block", marginTop: 3 }}>{dateLabel(record.date)}{record.odometerKm !== undefined ? ` · ${record.odometerKm.toLocaleString()} km` : ""}{record.fullTank ? " · full tank" : ""}</small>
                {intervalEconomy !== undefined && <small style={{ ...s.muted, display: "block" }}>{intervalEconomy.toFixed(1)} km/L for this full-tank interval</small>}
              </div>
              <div style={{ textAlign: "right" }}>
                {record.amountPhp !== undefined && <strong>{money(record.amountPhp)}</strong>}
                {record.pricePerLiterPhp !== undefined && <small style={{ ...s.muted, display: "block", marginTop: 3 }}>₱{record.pricePerLiterPhp.toFixed(2)}/L</small>}
              </div>
            </div>;
          })}
        </div> : <div className="note-box"><p>No fuel entries yet. Two consecutive full-tank entries with odometer readings are enough to start calculating actual economy.</p></div>}
      </article>
    </div>
  </section>;
}
