"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { observedMarketPriceLabel, planningPurchasePrice } from "@/lib/marketChecks";
import { EntityMedia } from "@/components/EntityMedia";
import { SaveToShortlistButton } from "@/components/SaveToShortlistButton";
import { CompareButton } from "@/components/CompareButton";
import { trackEvent } from "@/lib/track";
import { rankMotorcycles, type DecisionUseCase, type TrafficLevel } from "@/lib/decisionEngine";
// commuteMonthlyCosts is applied inside the shared decision engine so finder and commute tools use one running-cost model.

export type FinderInitialFilters = {
  budget?: string;
  make?: string;
  transmission?: string;
  useCase?: DecisionUseCase;
  abs?: string;
  maxSeat?: string;
  maxWeight?: string;
  category?: string;
  inseam?: number;
  passenger?: boolean;
  highway?: boolean;
  expresswayClass?: boolean;
  luggage?: boolean;
  traffic?: string;
  dailyKm?: number;
  monthlyBudget?: number;
  downPaymentPct?: number;
  termMonths?: number;
  annualRatePct?: number;
};

function absAvailable(model: Motorcycle) {
  return /\bABS\b/i.test(model.abs) && !/^No ABS/i.test(model.abs);
}
function peso(value: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(value);
}
function compactPeso(value: number) {
  if (value >= 1_000_000) return `₱${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  return `₱${Math.round(value / 1000)}K`;
}

export function MotorcycleFinder({ models, initialFilters = {} }: { models: Motorcycle[]; initialFilters?: FinderInitialFilters }) {
  const [budget, setBudget] = useState(initialFilters.budget || "150000");
  const [make, setMake] = useState(initialFilters.make || "any");
  const [transmission, setTransmission] = useState(initialFilters.transmission || "any");
  const [useCase, setUseCase] = useState<DecisionUseCase>(initialFilters.useCase || "city");
  const [abs, setAbs] = useState(initialFilters.abs || "any");
  const [maxSeat, setMaxSeat] = useState(initialFilters.maxSeat || "any");
  const [maxWeight, setMaxWeight] = useState(initialFilters.maxWeight || "any");
  const [category, setCategory] = useState(initialFilters.category || "any");
  const [inseam, setInseam] = useState(initialFilters.inseam || 30);
  const [passenger, setPassenger] = useState(Boolean(initialFilters.passenger));
  const [highway, setHighway] = useState(Boolean(initialFilters.highway));
  const [expresswayClass, setExpresswayClass] = useState(Boolean(initialFilters.expresswayClass));
  const [luggage, setLuggage] = useState(Boolean(initialFilters.luggage));
  const [traffic, setTraffic] = useState<TrafficLevel>((initialFilters.traffic as TrafficLevel) || "heavy");
  const [dailyKm, setDailyKm] = useState(initialFilters.dailyKm || 20);
  const [monthlyBudget, setMonthlyBudget] = useState(initialFilters.monthlyBudget || 0);
  const [downPaymentPct, setDownPaymentPct] = useState(initialFilters.downPaymentPct || 20);
  const [termMonths, setTermMonths] = useState(initialFilters.termMonths || 36);
  const [annualRatePct, setAnnualRatePct] = useState(initialFilters.annualRatePct || 12);
  const [copied, setCopied] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const analyticsReady = useRef(false);
  const previousFilterSnapshot = useRef("");
  const previousResultsSnapshot = useRef("");

  const makes = [...new Set(models.map((m) => m.make))].sort();
  const categories = [...new Set(models.map((m) => m.category))].sort();

  const profile = useMemo(() => ({
    useCase,
    inseamIn: inseam,
    passenger,
    highway,
    expresswayClass,
    luggage,
    traffic,
    dailyKm,
    monthlyBudgetPhp: monthlyBudget || undefined,
    downPaymentPct,
    termMonths,
    annualRatePct,
  }), [useCase, inseam, passenger, highway, expresswayClass, luggage, traffic, dailyKm, monthlyBudget, downPaymentPct, termMonths, annualRatePct]);

  const results = useMemo(() => {
    const filtered = models
      .filter((m) => {
        const max = budget === "any" ? Infinity : Number(budget);
        return planningPurchasePrice(m).price <= max;
      })
      .filter((m) => make === "any" || m.make === make)
      .filter((m) => transmission === "any" || m.transmission === transmission)
      .filter((m) => abs === "any" || (abs === "yes" ? absAvailable(m) : !absAvailable(m)))
      .filter((m) => maxSeat === "any" || m.seatHeightMm <= Number(maxSeat))
      .filter((m) => maxWeight === "any" || m.curbWeightKg <= Number(maxWeight))
      .filter((m) => category === "any" || m.category === category)
      .filter((m) => !expresswayClass || m.engineCc >= 400);
    return rankMotorcycles(filtered, profile);
  }, [models, budget, make, transmission, abs, maxSeat, maxWeight, category, expresswayClass, profile]);

  const top = results[0];
  const second = results[1];
  const compareTopHref = top && second ? `/compare/${top.model.slug}-vs-${second.model.slug}` : "/compare";

  useEffect(() => {
    trackEvent("finder_view", { initial_results: results.length });
    analyticsReady.current = true;
  }, []); // Intentional once-per-view event.

  useEffect(() => {
    const snapshot = JSON.stringify({ budget, make, transmission, useCase, abs, maxSeat, maxWeight, category, inseam, passenger, highway, expresswayClass, luggage, traffic, dailyKm, monthlyBudget, downPaymentPct, termMonths, annualRatePct });
    if (!analyticsReady.current) { previousFilterSnapshot.current = snapshot; return; }
    if (!previousFilterSnapshot.current) { previousFilterSnapshot.current = snapshot; return; }
    if (previousFilterSnapshot.current === snapshot) return;
    previousFilterSnapshot.current = snapshot;
    const timer = window.setTimeout(() => trackEvent("finder_filter_change", {
      results: results.length, use_case: useCase, traffic, passenger, luggage, highway, expressway_class: expresswayClass, monthly_ceiling_set: monthlyBudget > 0,
    }), 350);
    return () => window.clearTimeout(timer);
  }, [budget, make, transmission, useCase, abs, maxSeat, maxWeight, category, inseam, passenger, highway, expresswayClass, luggage, traffic, dailyKm, monthlyBudget, downPaymentPct, termMonths, annualRatePct, results.length]);

  useEffect(() => {
    if (!top) return;
    const snapshot = `${top.model.id}:${top.decision.score}:${results.length}`;
    if (previousResultsSnapshot.current === snapshot) return;
    previousResultsSnapshot.current = snapshot;
    const timer = window.setTimeout(() => trackEvent("finder_results_generated", {
      results: results.length, top_model_id: top.model.id, top_score: top.decision.score, use_case: useCase,
    }), 450);
    return () => window.clearTimeout(timer);
  }, [top, results.length, useCase]);

  useEffect(() => {
    if (results.length) return;
    const timer = window.setTimeout(() => trackEvent("finder_zero_results", {
      budget, make, transmission, use_case: useCase, abs, max_seat: maxSeat, max_weight: maxWeight, category,
      inseam, passenger, highway, expressway_class: expresswayClass, luggage, traffic, daily_km: dailyKm, monthly_budget: monthlyBudget,
    }), 700);
    return () => window.clearTimeout(timer);
  }, [results.length, budget, make, transmission, useCase, abs, maxSeat, maxWeight, category, inseam, passenger, highway, expresswayClass, luggage, traffic, dailyKm, monthlyBudget]);

  useEffect(() => {
    const p = new URLSearchParams();
    if (budget !== "150000") p.set("budget", budget);
    if (make !== "any") p.set("make", make);
    if (transmission !== "any") p.set("transmission", transmission);
    if (useCase !== "city") p.set("use", useCase);
    if (abs !== "any") p.set("abs", abs);
    if (maxSeat !== "any") p.set("seat", maxSeat);
    if (maxWeight !== "any") p.set("weight", maxWeight);
    if (category !== "any") p.set("type", category);
    if (inseam !== 30) p.set("inseam", String(inseam));
    if (passenger) p.set("passenger", "1");
    if (highway) p.set("highway", "1");
    if (expresswayClass) p.set("expressway", "1");
    if (luggage) p.set("luggage", "1");
    if (traffic !== "heavy") p.set("traffic", traffic);
    if (dailyKm !== 20) p.set("km", String(dailyKm));
    if (monthlyBudget) p.set("monthly", String(monthlyBudget));
    if (downPaymentPct !== 20) p.set("down", String(downPaymentPct));
    if (termMonths !== 36) p.set("term", String(termMonths));
    if (annualRatePct !== 12) p.set("rate", String(annualRatePct));
    window.history.replaceState(null, "", `${window.location.pathname}${p.size ? `?${p.toString()}` : ""}`);
  }, [budget, make, transmission, useCase, abs, maxSeat, maxWeight, category, inseam, passenger, highway, expresswayClass, luggage, traffic, dailyKm, monthlyBudget, downPaymentPct, termMonths, annualRatePct]);

  function reset() {
    trackEvent("finder_reset", { results_before_reset: results.length });
    setBudget("150000"); setMake("any"); setTransmission("any"); setUseCase("city"); setAbs("any"); setMaxSeat("any"); setMaxWeight("any"); setCategory("any");
    setInseam(30); setPassenger(false); setHighway(false); setExpresswayClass(false); setLuggage(false); setTraffic("heavy"); setDailyKm(20); setMonthlyBudget(0); setDownPaymentPct(20); setTermMonths(36); setAnnualRatePct(12);
  }
  async function share() {
    await navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
    trackEvent("finder_share", { results: results.length });
  }

  return <div className="decision-finder">
    <section className="decision-profile-panel">
      <div className="decision-profile-copy">
        <span>PH decision engine</span>
        <h2>Tell MotoIndex how you actually ride.</h2>
        <p>Results are ranked against your budget, rider-fit starting point, traffic, use case, passenger/luggage needs and a transparent monthly planning estimate. A score is a shortlist aid, not a substitute for a test ride or dealer quote.</p>
      </div>
      <div className="finder-toolbar"><button type="button" className="button ghost small" onClick={reset}>Reset</button><button type="button" className="button small" onClick={share}>{copied ? "Copied ✓" : "Copy finder link"}</button></div>
      <div className="decision-filter-grid primary">
        <label><span>Purchase budget</span><select value={budget} onChange={(e) => setBudget(e.target.value)}><option value="80000">₱80K</option><option value="100000">₱100K</option><option value="125000">₱125K</option><option value="150000">₱150K</option><option value="200000">₱200K</option><option value="300000">₱300K</option><option value="500000">₱500K</option><option value="any">No limit</option></select></label>
        <label><span>Main use</span><select value={useCase} onChange={(e) => setUseCase(e.target.value as DecisionUseCase)}><option value="city">Daily city commute</option><option value="short">Lower / easier bike</option><option value="work">Work / utility</option><option value="performance">Performance</option><option value="touring">Longer rides / touring</option></select></label>
        <label><span>Inseam</span><select value={inseam} onChange={(e) => setInseam(Number(e.target.value))}>{[26,27,28,29,30,31,32,33,34,35,36,37,38].map((v) => <option value={v} key={v}>{v} in</option>)}</select></label>
        <label><span>Traffic</span><select value={traffic} onChange={(e) => setTraffic(e.target.value as TrafficLevel)}><option value="heavy">Heavy stop-go</option><option value="mixed">Mixed</option><option value="light">Mostly open</option></select></label>
        <label><span>Daily round trip</span><select value={dailyKm} onChange={(e) => setDailyKm(Number(e.target.value))}><option value="10">10 km</option><option value="20">20 km</option><option value="30">30 km</option><option value="40">40 km</option><option value="60">60 km</option><option value="80">80 km</option></select></label>
      </div>
      <div className="decision-toggle-row">
        <label><input type="checkbox" checked={passenger} onChange={(e) => setPassenger(e.target.checked)} /> Regular passenger</label>
        <label><input type="checkbox" checked={luggage} onChange={(e) => setLuggage(e.target.checked)} /> Need luggage</label>
        <label><input type="checkbox" checked={highway} onChange={(e) => setHighway(e.target.checked)} /> Faster provincial / national roads</label>
        <label><input type="checkbox" checked={expresswayClass} onChange={(e) => setExpresswayClass(e.target.checked)} /> 400cc+ expressway-planning class</label>
      </div>
      <div className="finder-more-row"><button type="button" className="button ghost small" aria-expanded={showMoreFilters} aria-controls="finder-more-filters" onClick={() => setShowMoreFilters((v) => { const next = !v; trackEvent("finder_advanced_filters_toggle", { open: next }); return next; })}>{showMoreFilters ? "Fewer filters" : "More filters"}</button><span>Brand, transmission, ABS, physical limits and monthly ownership planning</span></div>
      {showMoreFilters && <div className="decision-filter-grid secondary" id="finder-more-filters">
        <label><span>Make</span><select value={make} onChange={(e) => setMake(e.target.value)}><option value="any">Any make</option>{makes.map((v) => <option key={v} value={v}>{v}</option>)}</select></label>
        <label><span>Category</span><select value={category} onChange={(e) => setCategory(e.target.value)}><option value="any">Any category</option>{categories.map((v) => <option key={v} value={v}>{v}</option>)}</select></label>
        <label><span>Transmission</span><select value={transmission} onChange={(e) => setTransmission(e.target.value)}><option value="any">Any</option><option value="Automatic">Automatic</option><option value="Manual">Manual</option></select></label>
        <label><span>ABS listing</span><select value={abs} onChange={(e) => setAbs(e.target.value)}><option value="any">Any</option><option value="yes">ABS listed</option><option value="no">No ABS listed</option></select></label>
        <label><span>Maximum seat</span><select value={maxSeat} onChange={(e) => setMaxSeat(e.target.value)}><option value="any">No limit</option><option value="760">760 mm</option><option value="780">780 mm</option><option value="800">800 mm</option><option value="820">820 mm</option></select></label>
        <label><span>Maximum weight</span><select value={maxWeight} onChange={(e) => setMaxWeight(e.target.value)}><option value="any">No limit</option><option value="110">110 kg</option><option value="120">120 kg</option><option value="140">140 kg</option><option value="180">180 kg</option></select></label>
        <label><span>Monthly ownership ceiling</span><select value={monthlyBudget} onChange={(e) => setMonthlyBudget(Number(e.target.value))}><option value="0">Not set</option><option value="4000">₱4K/mo</option><option value="6000">₱6K/mo</option><option value="8000">₱8K/mo</option><option value="10000">₱10K/mo</option><option value="15000">₱15K/mo</option><option value="25000">₱25K/mo</option></select></label>
        <label><span>Down payment</span><select value={downPaymentPct} onChange={(e) => setDownPaymentPct(Number(e.target.value))}><option value="10">10%</option><option value="20">20%</option><option value="30">30%</option><option value="40">40%</option></select></label>
        <label><span>Planning term</span><select value={termMonths} onChange={(e) => setTermMonths(Number(e.target.value))}><option value="12">12 mo</option><option value="24">24 mo</option><option value="36">36 mo</option><option value="48">48 mo</option><option value="60">60 mo</option></select></label>
        <label><span>Planning APR</span><select value={annualRatePct} onChange={(e) => setAnnualRatePct(Number(e.target.value))}><option value="0">0%</option><option value="8">8%</option><option value="12">12%</option><option value="18">18%</option><option value="24">24%</option></select></label>
      </div>}
      {expresswayClass && <p className="finder-legal-note">The 400cc+ control is only an engine-displacement research filter. Confirm the motorcycle&apos;s registration classification and current tollway rules before relying on it for expressway access.</p>}
    </section>

    {top ? <>
      <section className="decision-winner" aria-live="polite">
        <div className="decision-winner-score"><span>Top match</span><strong>{top.decision.score}<small>/100</small></strong><b>{top.decision.label}</b></div>
        <div className="decision-winner-copy"><span>{top.model.make}</span><h2>{top.model.model}</h2><p>{top.decision.reasons.length ? top.decision.reasons.join(" · ") : "Highest score against the current profile."}</p><div className="decision-winner-cost"><span><small>Observed market</small><b>{observedMarketPriceLabel(top.model)}</b></span><span><small>Loan planning</small><b>{peso(top.decision.estimatedLoanMonthlyPhp)}/mo</b></span><span><small>Ownership running</small><b>{peso(top.decision.estimatedRunningMonthlyPhp)}/mo</b></span><span><small>Estimated ownership</small><b>{peso(top.decision.estimatedTotalMonthlyPhp)}/mo</b></span></div></div>
        <div className="decision-winner-actions"><Link className="button" href={`/motorcycles/${top.model.makeSlug}/${top.model.slug}`} onClick={() => trackEvent("finder_top_match_click", { model_id: top.model.id, score: top.decision.score })}>Open model page</Link>{second && <Link className="button ghost on-light" href={compareTopHref} onClick={() => trackEvent("finder_compare_top_two", { a: top.model.id, b: second.model.id })}>Compare top two</Link>}<small>Loan planning uses a verified manufacturer/catalog basis when available, otherwise the median observed starting price. Ownership running includes commute costs plus monthly reserves for insurance, registration and tires.</small></div>
      </section>

      <div className="decision-results-head"><div><span>{results.length} matching motorcycles</span><h2>Ranked for your profile</h2></div><p>Scores are relative to the selected criteria. Open the factor breakdown to see where each motorcycle gains or loses points.</p></div>
      <div className="decision-result-list">{results.slice(0, 18).map(({ model, decision }, index) => {
        const href = `/motorcycles/${model.makeSlug}/${model.slug}`;
        return <article className="decision-result-card" key={model.id}>
          <div className="decision-rank"><span>#{index + 1}</span><strong>{decision.score}</strong><small>{decision.label}</small></div>
          <div className="decision-result-media"><EntityMedia entityType="motorcycle" entityId={model.id} linkHref={href} showCredit={false} fallback={<Link href={href} className="decision-media-fallback"><span>{model.make}</span><strong>{model.model}</strong><small>{model.engineCc} cc · {model.curbWeightKg} kg</small></Link>} /></div>
          <div className="decision-result-main"><div className="decision-title-row"><div><span>{model.make} · {model.category}</span><h3><Link href={href} onClick={() => trackEvent("finder_result_click", { model_id: model.id, rank: index + 1, score: decision.score, surface: "title" })}>{model.model}</Link></h3></div><strong>{observedMarketPriceLabel(model)}</strong></div>
            <div className="decision-chips"><span>{model.engineCc} cc</span><span>{model.seatHeightMm} mm seat</span><span>{model.curbWeightKg} kg</span><span>{model.transmission || "—"}</span>{absAvailable(model) && <span>ABS listed</span>}</div>
            <div className="decision-reason-grid"><div><span>Why it fits</span><ul>{decision.reasons.slice(0, 3).map((reason) => <li key={reason}>{reason}</li>)}{decision.reasons.length === 0 && <li>Best available score on the selected measurable factors.</li>}</ul></div><div><span>Watch-outs</span><ul>{decision.cautions.slice(0, 3).map((reason) => <li key={reason}>{reason}</li>)}{decision.cautions.length === 0 && <li>No major score penalty under the selected profile.</li>}</ul></div></div>
            <details className="decision-breakdown" onToggle={(e) => { if (e.currentTarget.open) trackEvent("finder_score_breakdown_open", { model_id: model.id, rank: index + 1, score: decision.score }); }}><summary>Show score breakdown</summary><div>{decision.factors.map((factor) => <div key={factor.key} className={`decision-factor ${factor.tone}`}><span>{factor.label}<small>{factor.detail}</small></span><b>{factor.score}/{factor.maxScore}</b></div>)}</div></details>
            <div className="decision-cost-strip finder-commute-cost"><span><small>Planning price</small><b>{compactPeso(decision.purchasePricePhp)}</b></span><span><small>Loan plan</small><b>{peso(decision.estimatedLoanMonthlyPhp)}</b></span><span><small>Ownership running</small><b>{peso(decision.estimatedRunningMonthlyPhp)}</b></span><span><small>Est. ownership / mo</small><b>{peso(decision.estimatedTotalMonthlyPhp)}</b></span>{monthlyBudget > 0 && <span className={decision.affordabilityGapPhp && decision.affordabilityGapPhp >= 0 ? "within" : "over"}><small>Vs ceiling</small><b>{decision.affordabilityGapPhp && decision.affordabilityGapPhp >= 0 ? "+" : ""}{peso(decision.affordabilityGapPhp || 0)}</b></span>}</div>
            <div className="decision-card-actions"><Link href={href} className="button small" onClick={() => trackEvent("finder_result_click", { model_id: model.id, rank: index + 1, score: decision.score, surface: "cta" })}>Full research</Link><CompareButton modelId={model.id} compact /><SaveToShortlistButton modelId={model.id} compact /></div>
          </div>
        </article>;
      })}</div>
    </> : <div className="decision-empty"><span>No exact match</span><h2>Those filters are too restrictive for the current catalog.</h2><p>Raise the purchase budget, remove the 400cc+ class requirement or relax a physical/brand filter. MotoIndex does not invent a recommendation when the current data does not contain a match.</p><button type="button" className="button" onClick={reset}>Reset filters</button></div>}
  </div>;
}
