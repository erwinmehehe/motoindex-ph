"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { money, type GarageRecord } from "@/lib/garage";

const s = {
  section: { margin: "0 0 42px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: 14 },
  card: { border: "1px solid var(--line)", borderRadius: 22, background: "var(--white)", padding: 22, minWidth: 0 },
  kicker: { display: "block", color: "var(--accent)", fontSize: 10, fontWeight: 850, letterSpacing: ".1em", textTransform: "uppercase" },
  title: { margin: "6px 0 4px", fontSize: 25, lineHeight: 1, letterSpacing: "-.035em" },
  muted: { color: "var(--muted)", fontSize: 11, lineHeight: 1.45 },
  bars: { height: 180, display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8, alignItems: "end", marginTop: 20 },
  barCell: { height: "100%", display: "grid", gridTemplateRows: "1fr auto", gap: 8, alignItems: "end" },
  barTrack: { height: "100%", minHeight: 0, display: "flex", alignItems: "end", borderRadius: 12, background: "var(--paper)", overflow: "hidden" },
  bar: { width: "100%", borderRadius: 12, background: "linear-gradient(180deg,var(--accent),#ffcf3f)", transition: "height .75s cubic-bezier(.2,.8,.2,1)" },
  month: { textAlign: "center", fontSize: 9, color: "var(--muted)", textTransform: "uppercase", fontWeight: 800 },
  stats: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 },
  stat: { padding: 12, borderRadius: 14, background: "var(--paper)" },
  label: { display: "block", color: "var(--muted)", fontSize: 9, textTransform: "uppercase", letterSpacing: ".07em", fontWeight: 800 },
  value: { display: "block", marginTop: 4, fontSize: 17, letterSpacing: "-.025em" },
  chart: { width: "100%", height: 180, marginTop: 16, overflow: "visible" },
} satisfies Record<string, CSSProperties>;

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(date: Date) {
  return date.toLocaleDateString("en-PH", { month: "short" });
}

export function GarageTrendPanel({ records }: { records: GarageRecord[] }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const data = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return { key: monthKey(date), label: monthLabel(date), total: 0 };
    });
    const byMonth = new Map(months.map((item) => [item.key, item]));
    for (const record of records) {
      const month = byMonth.get(record.date.slice(0, 7));
      if (month) month.total += record.amountPhp || 0;
    }

    const fullTanks = records
      .filter((record) => record.category === "FUEL" && record.fullTank && record.odometerKm !== undefined && (record.liters || 0) > 0)
      .sort((a, b) => (a.odometerKm || 0) - (b.odometerKm || 0) || a.date.localeCompare(b.date));

    const economy: { date: string; kmL: number }[] = [];
    for (let index = 1; index < fullTanks.length; index += 1) {
      const previous = fullTanks[index - 1];
      const current = fullTanks[index];
      const distance = (current.odometerKm || 0) - (previous.odometerKm || 0);
      if (distance > 0 && (current.liters || 0) > 0) {
        economy.push({ date: current.date, kmL: distance / (current.liters || 1) });
      }
    }

    return { months, economy: economy.slice(-8) };
  }, [records]);

  const maxSpend = Math.max(...data.months.map((item) => item.total), 1);
  const sixMonthTotal = data.months.reduce((sum, item) => sum + item.total, 0);
  const activeMonths = data.months.filter((item) => item.total > 0);
  const monthlyAverage = activeMonths.length ? sixMonthTotal / activeMonths.length : 0;

  const values = data.economy.map((item) => item.kmL);
  const minEconomy = values.length ? Math.min(...values) : 0;
  const maxEconomy = values.length ? Math.max(...values) : 0;
  const economyAverage = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : undefined;
  const width = 520;
  const height = 150;
  const padX = 22;
  const padY = 18;
  const range = Math.max(1, maxEconomy - minEconomy);
  const points = data.economy.map((item, index) => {
    const x = data.economy.length <= 1 ? width / 2 : padX + (index / (data.economy.length - 1)) * (width - padX * 2);
    const y = height - padY - ((item.kmL - minEconomy) / range) * (height - padY * 2);
    return { ...item, x, y };
  });
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  return <section style={s.section} aria-label="Garage ownership trends">
    <div className="section-head">
      <div>
        <span className="field-label">Ownership trends</span>
        <h2>How ownership is changing</h2>
        <p>Six-month spending and actual full-tank fuel economy from the records saved in this Garage.</p>
      </div>
    </div>

    <div style={s.grid}>
      <article style={s.card}>
        <span style={s.kicker}>Spend trend</span>
        <h3 style={s.title}>Last 6 months</h3>
        <small style={s.muted}>Only costs you have actually logged are included.</small>
        <div style={s.bars} aria-label="Monthly ownership spend">
          {data.months.map((item) => {
            const pct = item.total > 0 ? Math.max(8, (item.total / maxSpend) * 100) : 0;
            return <div key={item.key} style={s.barCell} title={`${item.label}: ${money(item.total)}`}>
              <div style={s.barTrack}><i style={{ ...s.bar, height: shown ? `${pct}%` : "0%" }} /></div>
              <span style={s.month}>{item.label}</span>
            </div>;
          })}
        </div>
        <div style={s.stats}>
          <span style={s.stat}><small style={s.label}>6-month logged spend</small><strong style={s.value}>{money(sixMonthTotal)}</strong></span>
          <span style={s.stat}><small style={s.label}>Average active month</small><strong style={s.value}>{money(monthlyAverage)}</strong></span>
        </div>
      </article>

      <article style={s.card}>
        <span style={s.kicker}>Actual economy</span>
        <h3 style={s.title}>Full-tank history</h3>
        <small style={s.muted}>Each point uses the distance between consecutive full-tank fills divided by the later fill volume.</small>

        {points.length >= 2 ? <>
          <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Actual fuel economy trend" style={s.chart}>
            <line x1={padX} y1={height - padY} x2={width - padX} y2={height - padY} stroke="currentColor" opacity=".12" />
            <polyline
              points={polyline}
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="1"
              style={{ strokeDasharray: 1, strokeDashoffset: shown ? 0 : 1, transition: "stroke-dashoffset .9s cubic-bezier(.2,.8,.2,1)" }}
            />
            {points.map((point) => <circle key={`${point.date}-${point.x}`} cx={point.x} cy={point.y} r="5" fill="currentColor"><title>{point.date}: {point.kmL.toFixed(1)} km/L</title></circle>)}
          </svg>
          <div style={s.stats}>
            <span style={s.stat}><small style={s.label}>Recent average</small><strong style={s.value}>{economyAverage?.toFixed(1)} km/L</strong></span>
            <span style={s.stat}><small style={s.label}>Latest fill interval</small><strong style={s.value}>{points.at(-1)?.kmL.toFixed(1)} km/L</strong></span>
          </div>
        </> : <div className="note-box"><p>Mark at least three consecutive fuel entries as full tank to build a useful economy trend.</p></div>}
      </article>
    </div>
  </section>;
}
