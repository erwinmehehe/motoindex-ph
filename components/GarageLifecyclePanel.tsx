"use client";

import type { CSSProperties, ReactNode } from "react";
import { useMemo, useState, useEffect } from "react";
import type { GarageDocument, GarageMotorcycle, GarageRecord, SmartMaintenanceDue } from "@/lib/garage";
import { daysUntil, money } from "@/lib/garage";

const s = {
  wrap: { margin: "0 0 42px", display: "grid", gap: 14 },
  head: { display: "flex", justifyContent: "space-between", alignItems: "end", gap: 18, flexWrap: "wrap" },
  kicker: { color: "#f0542d", fontSize: 10, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 850 },
  title: { margin: "5px 0 0", fontSize: "clamp(28px,3.5vw,42px)", lineHeight: 1, letterSpacing: "-.045em" },
  intro: { maxWidth: 620, color: "#66707a", fontSize: 13, lineHeight: 1.5, margin: 0 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 10 },
  card: { minHeight: 150, padding: 18, border: "1px solid #dfe4e7", borderRadius: 19, background: "#fff", transition: "opacity .4s ease, transform .4s ease" },
  label: { display: "block", color: "#737d84", fontSize: 9, textTransform: "uppercase", letterSpacing: ".09em", fontWeight: 850 },
  value: { display: "block", margin: "8px 0 5px", fontSize: 24, lineHeight: 1, letterSpacing: "-.04em", color: "#101317" },
  note: { display: "block", color: "#737d84", fontSize: 10, lineHeight: 1.45 },
  signal: { display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, padding: "6px 8px", borderRadius: 999, background: "#f2f3ef", color: "#596168", fontSize: 9, fontWeight: 800 },
  timeline: { border: "1px solid #dfe4e7", borderRadius: 20, background: "#fff", overflow: "hidden" },
  timelineRow: { display: "grid", gridTemplateColumns: "92px minmax(0,1fr) auto", gap: 14, alignItems: "center", padding: "14px 17px", borderTop: "1px solid #edf0f1" },
  badge: { display: "inline-flex", width: "fit-content", padding: "5px 7px", borderRadius: 999, background: "#f1f2ef", color: "#596168", fontSize: 9, fontWeight: 850 },
  rowTitle: { display: "block", fontSize: 13, color: "#101317" },
  rowMeta: { display: "block", marginTop: 3, color: "#737d84", fontSize: 10 },
  amount: { fontSize: 12, color: "#101317", fontWeight: 800, whiteSpace: "nowrap" },
} satisfies Record<string, CSSProperties>;

function ageInMonths(date?: string) {
  if (!date) return undefined;
  const then = new Date(`${date}T00:00:00`);
  if (Number.isNaN(then.valueOf())) return undefined;
  const now = new Date();
  const months = (now.getFullYear() - then.getFullYear()) * 12 + now.getMonth() - then.getMonth();
  return Math.max(0, months - (now.getDate() < then.getDate() ? 1 : 0));
}

function distanceSince(current: number, record?: GarageRecord) {
  if (record?.odometerKm === undefined || record.odometerKm > current) return undefined;
  return current - record.odometerKm;
}

function trend(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? undefined : 0;
  return ((current - previous) / previous) * 100;
}

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const timer = window.setTimeout(() => setShown(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);
  return <div style={{ ...s.card, opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(7px)" }}>{children}</div>;
}

function recentWindow(records: GarageRecord[], fromDays: number, toDays = 0) {
  const now = new Date();
  const end = new Date(now.valueOf() - toDays * 86400000);
  const start = new Date(now.valueOf() - fromDays * 86400000);
  return records.filter((record) => {
    const date = new Date(`${record.date}T00:00:00`);
    return !Number.isNaN(date.valueOf()) && date.valueOf() >= start.valueOf() && date.valueOf() < end.valueOf();
  });
}

export function GarageLifecyclePanel({ bike, records, documents, smartMaintenance }: {
  bike: GarageMotorcycle;
  records: GarageRecord[];
  documents: GarageDocument[];
  smartMaintenance: SmartMaintenanceDue[];
}) {
  const data = useMemo(() => {
    const ordered = [...records].sort((a, b) => b.date.localeCompare(a.date));
    const lastPms = ordered.find((item) => item.category === "PMS");
    const lastTire = ordered.find((item) => item.category === "TIRE");
    const lastBattery = ordered.find((item) => item.category === "BATTERY");
    const current30 = recentWindow(records, 30);
    const previous30 = recentWindow(records, 60, 30);
    const fuelCurrent = current30.filter((r) => r.category === "FUEL").reduce((sum, r) => sum + (r.amountPhp || 0), 0);
    const fuelPrevious = previous30.filter((r) => r.category === "FUEL").reduce((sum, r) => sum + (r.amountPhp || 0), 0);
    const spendCurrent = current30.reduce((sum, r) => sum + (r.amountPhp || 0), 0);
    const spendPrevious = previous30.reduce((sum, r) => sum + (r.amountPhp || 0), 0);
    const expiringDocs = documents.filter((doc) => {
      const due = daysUntil(doc.expiryDate);
      return due !== null && due >= 0 && due <= 30;
    }).length;
    const expiredDocs = documents.filter((doc) => {
      const due = daysUntil(doc.expiryDate);
      return due !== null && due < 0;
    }).length;
    const mileageItems = smartMaintenance.filter((item) => item.remainingKm !== undefined);
    const overdueMaintenance = mileageItems.filter((item) => (item.remainingKm || 0) <= 0).length;
    const dueSoonMaintenance = mileageItems.filter((item) => (item.remainingKm || 0) > 0 && (item.remainingKm || 0) <= 1000).length;

    return {
      ordered,
      lastPms,
      lastTire,
      lastBattery,
      fuelCurrent,
      fuelTrend: trend(fuelCurrent, fuelPrevious),
      spendCurrent,
      spendTrend: trend(spendCurrent, spendPrevious),
      expiringDocs,
      expiredDocs,
      overdueMaintenance,
      dueSoonMaintenance,
    };
  }, [documents, records, smartMaintenance]);

  const pmsKm = distanceSince(bike.odometerKm, data.lastPms);
  const tireKm = distanceSince(bike.odometerKm, data.lastTire);
  const batteryKm = distanceSince(bike.odometerKm, data.lastBattery);
  const tireMonths = ageInMonths(data.lastTire?.date);
  const batteryMonths = ageInMonths(data.lastBattery?.date);
  const trendLabel = (value?: number) => value === undefined ? "No prior 30-day baseline" : `${value >= 0 ? "+" : ""}${value.toFixed(0)}% vs previous 30 days`;

  return <section style={s.wrap} aria-label="Garage ownership signals">
    <div style={s.head}>
      <div><span style={s.kicker}>Ownership signals</span><h2 style={s.title}>What needs attention next</h2></div>
      <p style={s.intro}>Derived only from the service, fuel and document records you have saved. MotoIndex does not turn incomplete records into a made-up health score.</p>
    </div>

    <div style={s.grid}>
      <Reveal>
        <span style={s.label}>Last PMS</span>
        <strong style={s.value}>{data.lastPms ? data.lastPms.title : "No PMS logged"}</strong>
        <small style={s.note}>{data.lastPms ? `${data.lastPms.date}${pmsKm !== undefined ? ` · ${pmsKm.toLocaleString()} km ago` : ""}` : "Log your next service to start a service baseline."}</small>
        <span style={s.signal}>{data.overdueMaintenance ? `${data.overdueMaintenance} schedule item(s) overdue` : data.dueSoonMaintenance ? `${data.dueSoonMaintenance} due within 1,000 km` : "No mileage alert from exact schedule"}</span>
      </Reveal>

      <Reveal delay={50}>
        <span style={s.label}>Tires</span>
        <strong style={s.value}>{data.lastTire ? (tireMonths !== undefined ? `${tireMonths} mo` : "Recorded") : "No change logged"}</strong>
        <small style={s.note}>{data.lastTire ? `${data.lastTire.title}${tireKm !== undefined ? ` · ${tireKm.toLocaleString()} km since record` : ""}` : "Save tire replacements or inspections to track age and mileage."}</small>
        <span style={s.signal}>{data.lastTire?.date || "Waiting for first tire record"}</span>
      </Reveal>

      <Reveal delay={100}>
        <span style={s.label}>Battery</span>
        <strong style={s.value}>{data.lastBattery ? (batteryMonths !== undefined ? `${batteryMonths} mo` : "Recorded") : "No change logged"}</strong>
        <small style={s.note}>{data.lastBattery ? `${data.lastBattery.title}${batteryKm !== undefined ? ` · ${batteryKm.toLocaleString()} km since record` : ""}` : "A battery replacement record gives you a useful age baseline."}</small>
        <span style={s.signal}>{data.lastBattery?.date || "Waiting for first battery record"}</span>
      </Reveal>

      <Reveal delay={150}>
        <span style={s.label}>Document wallet</span>
        <strong style={s.value}>{documents.length} tracked</strong>
        <small style={s.note}>{data.expiredDocs ? `${data.expiredDocs} expired record(s)` : data.expiringDocs ? `${data.expiringDocs} expire within 30 days` : "No saved document expiry needs attention."}</small>
        <span style={s.signal}>{data.expiredDocs ? "Review expired documents" : data.expiringDocs ? "Renewal window open" : "Document dates look clear"}</span>
      </Reveal>

      <Reveal delay={200}>
        <span style={s.label}>Fuel · last 30 days</span>
        <strong style={s.value}>{money(data.fuelCurrent)}</strong>
        <small style={s.note}>{trendLabel(data.fuelTrend)}</small>
        <span style={s.signal}>From logged fuel costs only</span>
      </Reveal>

      <Reveal delay={250}>
        <span style={s.label}>Ownership spend · 30 days</span>
        <strong style={s.value}>{money(data.spendCurrent)}</strong>
        <small style={s.note}>{trendLabel(data.spendTrend)}</small>
        <span style={s.signal}>All logged Garage categories</span>
      </Reveal>
    </div>

    {data.ordered.length > 0 && <div style={s.timeline}>
      <div style={{ padding: "16px 17px 11px" }}><span style={s.label}>Recent service timeline</span></div>
      {data.ordered.slice(0, 6).map((record, index) => <div key={record.id} style={{ ...s.timelineRow, borderTop: index === 0 ? 0 : s.timelineRow.borderTop }}>
        <span style={s.badge}>{record.category}</span>
        <div><strong style={s.rowTitle}>{record.title}</strong><small style={s.rowMeta}>{record.date}{record.odometerKm !== undefined ? ` · ${record.odometerKm.toLocaleString()} km` : ""}</small></div>
        <strong style={s.amount}>{record.amountPhp !== undefined ? money(record.amountPhp) : "—"}</strong>
      </div>)}
    </div>}
  </section>;
}
