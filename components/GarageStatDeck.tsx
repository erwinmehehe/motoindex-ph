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
import styles from "./GarageStatDeck.module.css";

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value ?? 0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || value === undefined) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
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
    const duration = 720;
    let frame = 0;

    const tick = (now: number) => {
      const progress = clamp((now - started) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, visible]);

  if (value === undefined) return <span ref={ref}>Not available</span>;

  const formatted = new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(display);

  return <span ref={ref}>{prefix}{formatted}{suffix}</span>;
}

function Meter({
  label,
  value,
  caption,
  percent,
}: {
  label: string;
  value: ReactNode;
  caption: string;
  percent: number;
}) {
  return <div className={styles.meter}>
    <div className={styles.metricHead}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
    <div className={styles.track} aria-hidden="true">
      <i style={{ "--meter": `${clamp(percent)}%` } as CSSProperties} />
    </div>
    <small>{caption}</small>
  </div>;
}

export function GarageStatDeck({
  bike,
  catalog,
  analytics,
  smartMaintenance,
  effectiveResale,
}: {
  bike: GarageMotorcycle;
  catalog?: GarageCatalogModel;
  analytics: GarageOwnershipAnalytics | null;
  smartMaintenance: SmartMaintenanceDue[];
  effectiveResale?: number;
}) {
  const powerToWeight = catalog?.powerHp && catalog?.curbWeightKg
    ? (catalog.powerHp / catalog.curbWeightKg) * 1000
    : undefined;
  const claimedRange = catalog?.fuelTankL && catalog?.fuelConsumptionKmL
    ? catalog.fuelTankL * catalog.fuelConsumptionKmL
    : undefined;
  const economyDelta = analytics?.fuelEconomyKmL !== undefined && catalog?.fuelConsumptionKmL
    ? ((analytics.fuelEconomyKmL - catalog.fuelConsumptionKmL) / catalog.fuelConsumptionKmL) * 100
    : undefined;

  const nextMaintenance = useMemo(
    () => smartMaintenance
      .filter((item) => item.remainingKm !== undefined)
      .sort((a, b) => (a.remainingKm ?? Number.POSITIVE_INFINITY) - (b.remainingKm ?? Number.POSITIVE_INFINITY))[0],
    [smartMaintenance],
  );

  const registrationDays = daysUntil(bike.registrationExpiry);
  const insuranceDays = daysUntil(bike.insuranceExpiry);
  const renewalStatus = [registrationDays, insuranceDays].filter((value): value is number => value !== null);
  const nearestRenewal = renewalStatus.length ? Math.min(...renewalStatus) : null;

  return <section className={styles.deck} aria-label="Motorcycle performance and ownership dashboard">
    <div className={styles.topline}>
      <div>
        <span className={styles.eyebrow}>MotoIndex Garage · live ownership view</span>
        <h2>{bike.make} {bike.model}{bike.variant ? ` ${bike.variant}` : ""}</h2>
      </div>
      <div className={styles.statusRow}>
        <span className={styles.statusDot}>Catalog linked</span>
        {nearestRenewal !== null && <span className={nearestRenewal < 0 ? styles.alert : nearestRenewal <= 30 ? styles.warn : styles.ok}>
          {nearestRenewal < 0 ? "Renewal overdue" : nearestRenewal <= 30 ? "Renewal due soon" : "Renewals tracked"}
        </span>}
      </div>
    </div>

    <div className={styles.instrumentGrid}>
      <div className={styles.instrument}>
        <div className={styles.engineBlock}>
          <span>Engine</span>
          <strong><AnimatedNumber value={catalog?.engineCc} suffix=" cc" /></strong>
          <small>{catalog?.sourceLabel || "MotoIndex catalog data"}</small>
        </div>

        <div className={styles.powerRow}>
          <Meter
            label="Catalog power"
            value={<AnimatedNumber value={catalog?.powerHp} decimals={1} suffix=" hp" />}
            percent={catalog?.powerHp ? catalog.powerHp / 1.2 : 0}
            caption="Manufacturer/reference specification"
          />
          <Meter
            label="Power-to-weight"
            value={<AnimatedNumber value={powerToWeight} decimals={1} suffix=" hp/t" />}
            percent={powerToWeight ? powerToWeight / 2.3 : 0}
            caption="Calculated from catalog power and curb weight"
          />
        </div>

        <div className={styles.quickFacts}>
          <span><small>Torque</small><b><AnimatedNumber value={catalog?.torqueNm} decimals={1} suffix=" Nm" /></b></span>
          <span><small>Curb weight</small><b><AnimatedNumber value={catalog?.curbWeightKg} suffix=" kg" /></b></span>
          <span><small>Seat</small><b><AnimatedNumber value={catalog?.seatHeightMm} suffix=" mm" /></b></span>
          <span><small>Tank</small><b><AnimatedNumber value={catalog?.fuelTankL} decimals={1} suffix=" L" /></b></span>
        </div>
      </div>

      <div className={styles.ownership}>
        <div className={styles.bigStat}>
          <span>Current odometer</span>
          <strong><AnimatedNumber value={bike.odometerKm} suffix=" km" /></strong>
          <small>Your latest saved Garage reading</small>
        </div>

        <div className={styles.ownerGrid}>
          <article>
            <span>Actual economy</span>
            <strong><AnimatedNumber value={analytics?.fuelEconomyKmL} decimals={1} suffix=" km/L" /></strong>
            <small>{economyDelta === undefined ? "Log two full-tank fills to compare" : `${economyDelta >= 0 ? "+" : ""}${economyDelta.toFixed(1)}% vs catalog figure`}</small>
          </article>
          <article>
            <span>Estimated range</span>
            <strong><AnimatedNumber value={claimedRange} suffix=" km" /></strong>
            <small>Tank × catalog fuel-economy estimate</small>
          </article>
          <article>
            <span>Logged cost / km</span>
            <strong><AnimatedNumber value={analytics?.costPerKmPhp} decimals={2} prefix="₱" /></strong>
            <small>Based only on costs recorded in Garage</small>
          </article>
          <article>
            <span>Current value</span>
            <strong>{effectiveResale !== undefined ? money(effectiveResale) : "Not set"}</strong>
            <small>Owner override or MotoIndex depreciation estimate</small>
          </article>
        </div>
      </div>
    </div>

    <div className={styles.bottomRail}>
      <div>
        <span>Next maintenance</span>
        <strong>{nextMaintenance?.item || "No mileage-based item due"}</strong>
        <small>{nextMaintenance?.remainingKm !== undefined
          ? nextMaintenance.remainingKm <= 0
            ? `${Math.abs(nextMaintenance.remainingKm).toLocaleString()} km overdue`
            : `${nextMaintenance.remainingKm.toLocaleString()} km remaining`
          : "Add mileage and exact-model schedule data"}
        </small>
      </div>
      <div>
        <span>Total logged spend</span>
        <strong>{money(analytics?.totalSpendPhp)}</strong>
        <small>Fuel, maintenance, repairs, parts and other saved costs</small>
      </div>
      <div>
        <span>Registration</span>
        <strong>{registrationDays === null ? "Not set" : registrationDays < 0 ? "Overdue" : `${registrationDays} days`}</strong>
        <small>{bike.registrationExpiry || "Add expiry date"}</small>
      </div>
      <div>
        <span>Insurance</span>
        <strong>{insuranceDays === null ? "Not set" : insuranceDays < 0 ? "Expired" : `${insuranceDays} days`}</strong>
        <small>{bike.insuranceExpiry || "Add expiry date"}</small>
      </div>
    </div>
  </section>;
}
