"use client";

import type { CSSProperties, FormEvent } from "react";
import { useMemo, useState } from "react";
import type { GarageMotorcycle, GarageRecord } from "@/lib/garage";

export type GarageOdometerReadingInput = {
  date: string;
  odometerKm: number;
  notes?: string;
};

const s = {
  panel: { margin: "0 0 42px", padding: 22, border: "1px solid var(--line)", borderRadius: 22, background: "var(--white)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,280px),1fr))", gap: 14, alignItems: "start" },
  form: { display: "grid", gap: 10 },
  fields: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,150px),1fr))", gap: 10 },
  label: { display: "grid", gap: 6, color: "var(--muted)", fontSize: 11, fontWeight: 800 },
  input: { width: "100%", minWidth: 0 },
  stats: { display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 8, marginTop: 14 },
  stat: { padding: 12, borderRadius: 14, background: "var(--paper)", minWidth: 0 },
  statLabel: { display: "block", color: "var(--muted)", fontSize: 9, fontWeight: 800, letterSpacing: ".07em", textTransform: "uppercase" },
  statValue: { display: "block", marginTop: 4, fontSize: 17, lineHeight: 1.15, letterSpacing: "-.025em" },
  chart: { width: "100%", height: 170, marginTop: 14, overflow: "visible" },
  history: { display: "grid", gap: 8, marginTop: 14 },
  row: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 0", borderTop: "1px solid var(--line)" },
  muted: { color: "var(--muted)", fontSize: 11, lineHeight: 1.45 },
  warning: { marginTop: 10 },
} satisfies Record<string, CSSProperties>;

function dateLabel(value: string) {
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.valueOf())) return value;
  return parsed.toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
}

function dateKey(value: string) {
  return value.slice(0, 10);
}

function daysBetween(a: string, b: string) {
  const start = new Date(`${dateKey(a)}T00:00:00`);
  const end = new Date(`${dateKey(b)}T00:00:00`);
  if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf())) return 0;
  return Math.max(0, (end.valueOf() - start.valueOf()) / 86400000);
}

export function GarageMileagePanel({
  bike,
  records,
  onAddReading,
}: {
  bike: GarageMotorcycle;
  records: GarageRecord[];
  onAddReading: (input: GarageOdometerReadingInput) => void;
}) {
  const [message, setMessage] = useState("");

  const readings = useMemo(() => {
    const points: { id: string; date: string; km: number; source: string }[] = [];

    if (bike.purchaseDate && bike.purchaseOdometerKm !== undefined) {
      points.push({
        id: "purchase",
        date: bike.purchaseDate,
        km: bike.purchaseOdometerKm,
        source: "Purchase reading",
      });
    }

    for (const record of records) {
      if (record.odometerKm === undefined || !Number.isFinite(record.odometerKm)) continue;
      points.push({
        id: record.id,
        date: record.date,
        km: record.odometerKm,
        source: record.category === "ODOMETER" ? "Odometer update" : record.title,
      });
    }

    const updatedDate = (bike.odometerUpdatedAt || bike.updatedAt).slice(0, 10);
    if (!points.some((point) => point.km === bike.odometerKm && dateKey(point.date) === updatedDate)) {
      points.push({
        id: "current",
        date: updatedDate,
        km: bike.odometerKm,
        source: "Current Garage odometer",
      });
    }

    const deduped = new Map<string, typeof points[number]>();
    for (const point of points) {
      deduped.set(`${dateKey(point.date)}-${point.km}`, point);
    }

    return [...deduped.values()]
      .sort((a, b) => dateKey(a.date).localeCompare(dateKey(b.date)) || a.km - b.km)
      .slice(-24);
  }, [bike.odometerKm, bike.odometerUpdatedAt, bike.purchaseDate, bike.purchaseOdometerKm, bike.updatedAt, records]);

  const regressionCount = readings.reduce((count, point, index) => {
    if (index === 0) return count;
    return point.km < readings[index - 1].km ? count + 1 : count;
  }, 0);

  const cleanReadings = readings.reduce<typeof readings>((valid, point) => {
    const previous = valid.at(-1);
    if (!previous || point.km >= previous.km) valid.push(point);
    return valid;
  }, []);
  const first = cleanReadings[0];
  const latest = cleanReadings.at(-1);
  const trackedDistance = first && latest && latest.km >= first.km ? latest.km - first.km : undefined;
  const trackedDays = first && latest ? daysBetween(first.date, latest.date) : 0;
  const monthlyPace = trackedDistance !== undefined && trackedDistance > 0 && trackedDays > 0
    ? trackedDistance / trackedDays * 30.4375
    : undefined;

  const width = 520;
  const height = 135;
  const padX = 22;
  const padY = 18;
  const chartReadings = cleanReadings.slice(-10);
  const minKm = chartReadings.length ? Math.min(...chartReadings.map((point) => point.km)) : 0;
  const maxKm = chartReadings.length ? Math.max(...chartReadings.map((point) => point.km)) : 0;
  const kmRange = Math.max(1, maxKm - minKm);
  const chartPoints = chartReadings.map((point, index) => {
    const x = chartReadings.length <= 1 ? width / 2 : padX + (index / (chartReadings.length - 1)) * (width - padX * 2);
    const y = height - padY - ((point.km - minKm) / kmRange) * (height - padY * 2);
    return { ...point, x, y };
  });
  const polyline = chartPoints.map((point) => `${point.x},${point.y}`).join(" ");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);
    const odometerKm = Number(form.get("odometerKm"));
    const date = String(form.get("date") || "");
    const notes = String(form.get("notes") || "").trim() || undefined;

    if (!Number.isFinite(odometerKm) || odometerKm < 0) {
      setMessage("Enter a valid odometer reading.");
      return;
    }
    if (odometerKm < bike.odometerKm) {
      setMessage(`The new reading cannot be lower than the current ${bike.odometerKm.toLocaleString()} km. Use Update current motorcycle if you are correcting a mistaken current reading.`);
      return;
    }
    if (!date) {
      setMessage("Choose the date of this odometer reading.");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    if (dateKey(date) > today) {
      setMessage("The odometer reading date cannot be in the future.");
      return;
    }
    if (records.some((record) => record.odometerKm === odometerKm && dateKey(record.date) === dateKey(date))) {
      setMessage("That mileage is already logged for this date.");
      return;
    }

    onAddReading({ date, odometerKm, notes });
    setMessage(`Odometer updated to ${odometerKm.toLocaleString()} km.`);
    event.currentTarget.reset();
  }

  return <section style={s.panel} aria-label="Odometer history">
    <div className="section-head">
      <div>
        <span className="field-label">Mileage history</span>
        <h2>Keep maintenance tied to the real odometer.</h2>
        <p>Save dated readings so mileage-based reminders, ownership cost per kilometre and resale history are based on an actual progression.</p>
      </div>
    </div>

    <div style={s.grid}>
      <form className="lead-form" onSubmit={submit} style={s.form}>
        <div style={s.fields}>
          <label style={s.label}>New odometer (km)
            <input style={s.input} name="odometerKm" type="number" min={bike.odometerKm} step="1" required defaultValue={bike.odometerKm} />
          </label>
          <label style={s.label}>Reading date
            <input style={s.input} name="date" type="date" required max={new Date().toISOString().slice(0, 10)} defaultValue={new Date().toISOString().slice(0, 10)} />
          </label>
        </div>
        <label style={s.label}>Optional note
          <input style={s.input} name="notes" placeholder="Before PMS, monthly check, long ride" />
        </label>
        <div className="hero-actions">
          <button className="button small" type="submit">Update odometer</button>
        </div>
        {message && <p className="muted-note" role="status">{message}</p>}
      </form>

      <div>
        {chartPoints.length >= 2 ? <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Logged odometer progression" style={s.chart}>
          <line x1={padX} y1={height - padY} x2={width - padX} y2={height - padY} stroke="currentColor" opacity=".12" />
          <polyline points={polyline} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {chartPoints.map((point) => <circle key={point.id} cx={point.x} cy={point.y} r="5" fill="currentColor"><title>{dateLabel(point.date)}: {point.km.toLocaleString()} km</title></circle>)}
        </svg> : <div className="note-box"><p>Add another dated mileage reading to build an odometer trend.</p></div>}

        <div style={s.stats}>
          <span style={s.stat}><small style={s.statLabel}>Current</small><strong style={s.statValue}>{bike.odometerKm.toLocaleString()} km</strong></span>
          <span style={s.stat}><small style={s.statLabel}>Tracked distance</small><strong style={s.statValue}>{trackedDistance !== undefined ? `${trackedDistance.toLocaleString()} km` : "Need history"}</strong></span>
          <span style={s.stat}><small style={s.statLabel}>Avg riding pace</small><strong style={s.statValue}>{monthlyPace !== undefined ? `${Math.round(monthlyPace).toLocaleString()} km/mo` : "Need history"}</strong></span>
        </div>
      </div>
    </div>

    {regressionCount > 0 && <div className="note-box" style={s.warning}>
      <strong>Review older mileage entries</strong>
      <p>{regressionCount} saved reading{regressionCount === 1 ? " is" : "s are"} lower than the prior dated reading. MotoIndex keeps the data visible instead of silently rewriting it.</p>
    </div>}

    {readings.length > 0 && <div style={s.history}>
      {readings.slice(-6).reverse().map((point) => <div style={s.row} key={point.id}>
        <div><strong>{point.km.toLocaleString()} km</strong><small style={{ ...s.muted, display: "block", marginTop: 2 }}>{point.source}</small></div>
        <small style={s.muted}>{dateLabel(point.date)}</small>
      </div>)}
    </div>}
  </section>;
}
