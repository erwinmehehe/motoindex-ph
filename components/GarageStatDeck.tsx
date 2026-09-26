"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  daysUntil,
  money,
  type GarageCatalogModel,
  type GarageMotorcycle,
  type GarageOwnershipAnalytics,
  type SmartMaintenanceDue,
} from "@/lib/garage";

const ui = {
  deck: { margin: "24px 0 36px", overflow: "hidden", border: "1px solid rgba(16,19,23,.13)", borderRadius: 30, background: "radial-gradient(circle at 9% 8%,rgba(240,84,45,.18),transparent 26%),linear-gradient(145deg,#111519 0%,#171d22 54%,#0f1215 100%)", color: "#fff", boxShadow: "0 28px 80px rgba(16,19,23,.16)" },
  top: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, padding: "28px 30px 22px", borderBottom: "1px solid rgba(255,255,255,.09)", flexWrap: "wrap" },
  eyebrow: { color: "#ff9c80", fontSize: 10, fontWeight: 850, letterSpacing: ".12em", textTransform: "uppercase" },
  title: { margin: "7px 0 0", fontSize: "clamp(28px,4vw,46px)", lineHeight: .98, letterSpacing: "-.05em" },
  pills: { display: "flex", gap: 8, flexWrap: "wrap" },
  pill: { padding: "8px 10px", border: "1px solid rgba(255,255,255,.13)", borderRadius: 999, fontSize: 10, fontWeight: 800, color: "#d7dde1", background: "rgba(255,255,255,.05)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,390px),1fr))", gap: 1, background: "rgba(255,255,255,.08)" },
  panel: { minWidth: 0, background: "#12171b", padding: 30 },
  ownerPanel: { minWidth: 0, padding: 30, background: "linear-gradient(150deg,rgba(255,207,63,.07),transparent 40%),#151b20" },
  label: { color: "#929da5", fontSize: 9, fontWeight: 850, letterSpacing: ".1em", textTransform: "uppercase" },
  heroNumber: { display: "block", margin: "5px 0 4px", fontSize: "clamp(52px,7vw,88px)", lineHeight: .9, letterSpacing: "-.07em" },
  odoNumber: { display: "block", margin: "5px 0", fontSize: "clamp(40px,5vw,64px)", lineHeight: .95, letterSpacing: "-.06em" },
  muted: { color: "#8f9aa2", fontSize: 10, lineHeight: 1.45 },
  meters: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 22, padding: "22px 0 26px", borderTop: "1px solid rgba(255,255,255,.08)" },
  metricHead: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14 },
  track: { height: 5, margin: "11px 0 8px", overflow: "hidden", borderRadius: 999, background: "#2c343a" },
  facts: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 8 },
  fact: { padding: 14, border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, background: "rgba(255,255,255,.035)" },
  factValue: { display: "block", marginTop: 5, fontSize: 15, letterSpacing: "-.02em" },
  ownerGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 },
  ownerCard: { minHeight: 132, padding: 17, borderRadius: 18, background: "#f8f7f2", color: "#101317", transition: "opacity .45s ease,transform .45s ease" },
  ownerValue: { display: "block", margin: "9px 0 6px", fontSize: 23, lineHeight: 1, letterSpacing: "-.04em" },
  rail: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", background: "#f6f4ed", color: "#101317" },
  railItem: { minWidth: 0, padding: "20px 22px", borderRight: "1px solid #dde0dc", borderBottom: "1px solid #dde0dc" },
  railValue: { display: "block", margin: "6px 0 4px", fontSize: 17, letterSpacing: "-.025em" },
} satisfies Record<string, CSSProperties>;

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function AnimatedNumber({ value, decimals = 0, prefix = "", suffix = "" }: { value?: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value ?? 0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || value === undefined) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(value);
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: .25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  useEffect(() => {
    if (!visible || value === undefined) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = clamp((now - started) / 720, 0, 1);
      setDisplay(value * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, visible]);

  if (value === undefined) return <span ref={ref}>Not available</span>;
  return <span ref={ref}>{prefix}{new Intl.NumberFormat("en-PH", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(display)}{suffix}</span>;
}

function Meter({ label, value, caption, percent }: { label: string; value: ReactNode; caption: string; percent: number }) {
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFilled(true);
      return;
    }
    const frame = requestAnimationFrame(() => setFilled(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return <div>
    <div style={ui.metricHead}><span style={ui.label}>{label}</span><strong>{value}</strong></div>
    <div style={ui.track} aria-hidden="true">
      <i style={{ display: "block", width: filled ? `${clamp(percent)}%` : "0%", height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#f0542d,#ffcf3f)", transition: "width .9s cubic-bezier(.2,.8,.2,1)" }} />
    </div>
    <small style={ui.muted}>{caption}</small>
  </div>;
}

function RevealCard({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const timer = window.setTimeout(() => setShown(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);
  return <article style={{ ...ui.ownerCard, opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(8px)" }}>{children}</article>;
}

export function GarageStatDeck({ bike, catalog, analytics, smartMaintenance, effectiveResale }: {
  bike: GarageMotorcycle;
  catalog?: GarageCatalogModel;
  analytics: GarageOwnershipAnalytics | null;
  smartMaintenance: SmartMaintenanceDue[];
  effectiveResale?: number;
}) {
  const powerToWeight = catalog?.powerHp && catalog?.curbWeightKg ? (catalog.powerHp / catalog.curbWeightKg) * 1000 : undefined;
  const claimedRange = catalog?.fuelTankL && catalog?.fuelConsumptionKmL ? catalog.fuelTankL * catalog.fuelConsumptionKmL : undefined;
  const economyDelta = analytics?.fuelEconomyKmL !== undefined && catalog?.fuelConsumptionKmL
    ? ((analytics.fuelEconomyKmL - catalog.fuelConsumptionKmL) / catalog.fuelConsumptionKmL) * 100
    : undefined;
  const nextMaintenance = useMemo(() => smartMaintenance
    .filter((item) => item.remainingKm !== undefined)
    .sort((a, b) => (a.remainingKm ?? Number.POSITIVE_INFINITY) - (b.remainingKm ?? Number.POSITIVE_INFINITY))[0], [smartMaintenance]);
  const registrationDays = daysUntil(bike.registrationExpiry);
  const insuranceDays = daysUntil(bike.insuranceExpiry);
  const renewalDays = [registrationDays, insuranceDays].filter((value): value is number => value !== null);
  const nearestRenewal = renewalDays.length ? Math.min(...renewalDays) : null;

  return <section style={ui.deck} aria-label="Motorcycle performance and ownership dashboard">
    <div style={ui.top}>
      <div>
        <span style={ui.eyebrow}>MotoIndex Garage · live ownership view</span>
        <h2 style={ui.title}>{bike.make} {bike.model}{bike.variant ? ` ${bike.variant}` : ""}</h2>
      </div>
      <div style={ui.pills}>
        <span style={ui.pill}>● Catalog linked</span>
        {nearestRenewal !== null && <span style={{ ...ui.pill, color: nearestRenewal < 0 ? "#ff9a84" : nearestRenewal <= 30 ? "#ffd677" : "#9ce5bb" }}>
          {nearestRenewal < 0 ? "Renewal overdue" : nearestRenewal <= 30 ? "Renewal due soon" : "Renewals tracked"}
        </span>}
      </div>
    </div>

    <div style={ui.grid}>
      <div style={ui.panel}>
        <div style={{ paddingBottom: 26 }}>
          <span style={ui.label}>Engine</span>
          <strong style={ui.heroNumber}><AnimatedNumber value={catalog?.engineCc} suffix=" cc" /></strong>
          <small style={ui.muted}>{catalog?.sourceLabel || "MotoIndex catalog data"}</small>
        </div>
        <div style={ui.meters}>
          <Meter label="Catalog power" value={<AnimatedNumber value={catalog?.powerHp} decimals={1} suffix=" hp" />} percent={catalog?.powerHp ? catalog.powerHp / 1.2 : 0} caption="Manufacturer/reference specification" />
          <Meter label="Power-to-weight" value={<AnimatedNumber value={powerToWeight} decimals={1} suffix=" hp/t" />} percent={powerToWeight ? powerToWeight / 2.3 : 0} caption="Calculated from catalog power and curb weight" />
        </div>
        <div style={ui.facts}>
          {[
            ["Torque", <AnimatedNumber key="torque" value={catalog?.torqueNm} decimals={1} suffix=" Nm" />],
            ["Curb weight", <AnimatedNumber key="weight" value={catalog?.curbWeightKg} suffix=" kg" />],
            ["Seat", <AnimatedNumber key="seat" value={catalog?.seatHeightMm} suffix=" mm" />],
            ["Tank", <AnimatedNumber key="tank" value={catalog?.fuelTankL} decimals={1} suffix=" L" />],
          ].map(([label, value]) => <span key={String(label)} style={ui.fact}><small style={ui.label}>{label}</small><b style={ui.factValue}>{value}</b></span>)}
        </div>
      </div>

      <div style={ui.ownerPanel}>
        <div style={{ padding: "2px 0 24px" }}>
          <span style={ui.label}>Current odometer</span>
          <strong style={ui.odoNumber}><AnimatedNumber value={bike.odometerKm} suffix=" km" /></strong>
          <small style={ui.muted}>Your latest saved Garage reading</small>
        </div>
        <div style={ui.ownerGrid}>
          <RevealCard><span style={{ ...ui.label, color: "#737d84" }}>Actual economy</span><strong style={ui.ownerValue}><AnimatedNumber value={analytics?.fuelEconomyKmL} decimals={1} suffix=" km/L" /></strong><small style={{ ...ui.muted, color: "#737d84" }}>{economyDelta === undefined ? "Log two full-tank fills to compare" : `${economyDelta >= 0 ? "+" : ""}${economyDelta.toFixed(1)}% vs catalog figure`}</small></RevealCard>
          <RevealCard delay={60}><span style={{ ...ui.label, color: "#737d84" }}>Estimated range</span><strong style={ui.ownerValue}><AnimatedNumber value={claimedRange} suffix=" km" /></strong><small style={{ ...ui.muted, color: "#737d84" }}>Tank × catalog fuel-economy estimate</small></RevealCard>
          <RevealCard delay={120}><span style={{ ...ui.label, color: "#737d84" }}>Logged cost / km</span><strong style={ui.ownerValue}><AnimatedNumber value={analytics?.costPerKmPhp} decimals={2} prefix="₱" /></strong><small style={{ ...ui.muted, color: "#737d84" }}>Based only on costs recorded in Garage</small></RevealCard>
          <RevealCard delay={180}><span style={{ ...ui.label, color: "#737d84" }}>Current value</span><strong style={ui.ownerValue}>{effectiveResale !== undefined ? money(effectiveResale) : "Not set"}</strong><small style={{ ...ui.muted, color: "#737d84" }}>Owner override or MotoIndex depreciation estimate</small></RevealCard>
        </div>
      </div>
    </div>

    <div style={ui.rail}>
      {[
        ["Next maintenance", nextMaintenance?.item || "No mileage-based item due", nextMaintenance?.remainingKm !== undefined ? nextMaintenance.remainingKm <= 0 ? `${Math.abs(nextMaintenance.remainingKm).toLocaleString()} km overdue` : `${nextMaintenance.remainingKm.toLocaleString()} km remaining` : "Add mileage and exact-model schedule data"],
        ["Total logged spend", money(analytics?.totalSpendPhp), "Fuel, maintenance, repairs, parts and other saved costs"],
        ["Registration", registrationDays === null ? "Not set" : registrationDays < 0 ? "Overdue" : `${registrationDays} days`, bike.registrationExpiry || "Add expiry date"],
        ["Insurance", insuranceDays === null ? "Not set" : insuranceDays < 0 ? "Expired" : `${insuranceDays} days`, bike.insuranceExpiry || "Add expiry date"],
      ].map(([label, value, note]) => <div key={label} style={ui.railItem}><span style={{ ...ui.label, color: "#737d84" }}>{label}</span><strong style={ui.railValue}>{value}</strong><small style={{ ...ui.muted, color: "#737d84" }}>{note}</small></div>)}
    </div>
  </section>;
}
