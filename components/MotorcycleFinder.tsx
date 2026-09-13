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

const finderSteps = ["Budget", "Riding use", "Rider fit", "Passenger", "Transmission", "Road use"] as const;
const budgetChoices = [["80000","Up to ₱80K"],["100000","Up to ₱100K"],["150000","Up to ₱150K"],["200000","Up to ₱200K"],["300000","Up to ₱300K"],["any","No fixed limit"]] as const;
const useChoices: Array<[DecisionUseCase,string,string]> = [
  ["city","City commute","Traffic, errands and daily riding"],
  ["short","Easy to handle","Lower, lighter and confidence-friendly"],
  ["work","Work / utility","Frequent riding, cargo and practicality"],
  ["performance","Performance","Acceleration and stronger engine performance"],
  ["touring","Longer rides","Comfort and open-road use"]
];

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
  const [step, setStep] = useState(0);
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
  }, []);

  useEffect(() => {
    const snapshot = JSON.stringify({ budget, make, transmission, useCase, abs, maxSeat, maxWeight, category, inseam, passenger, highway, expresswayClass, luggage, traffic, dailyKm, monthlyBudget, downPaymentPct, termMonths, annualRatePct });
    if (!analyticsReady.current) { previousFilterSnapshot.current = snapshot; return; }
    if (!previousFilterSnapshot.current) { previousFilterSnapshot.current = snapshot; return; }
    if (previousFilterSnapshot.current === snapshot) return;
    previousFilterSnapshot.current = snapshot;
    const timer = window.setTimeout(() => trackEvent("finder_filter_change", { results: results.length, use_case: useCase, traffic, passenger, luggage, highway, expressway_class: expresswayClass, monthly_ceiling_set: monthlyBudget > 0 }), 350);
    return () => window.clearTimeout(timer);
  }, [budget, make, transmission, useCase, abs, maxSeat, maxWeight, category, inseam, passenger, highway, expresswayClass, luggage, traffic, dailyKm, monthlyBudget, downPaymentPct, termMonths, annualRatePct, results.length]);

  useEffect(() => {
    if (!top) return;
    const snapshot = `${top.model.id}:${top.decision.score}:${results.length}`;
    if (previousResultsSnapshot.current === snapshot) return;
    previousResultsSnapshot.current = snapshot;
    const timer = window.setTimeout(() => trackEvent("finder_results_generated", { results: results.length, top_model_id: top.model.id, top_score: top.decision.score, use_case: useCase }), 450);
    return () => window.clearTimeout(timer);
  }, [top, results.length, useCase]);

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
    setInseam(30); setPassenger(false); setHighway(false); setExpresswayClass(false); setLuggage(false); setTraffic("heavy"); setDailyKm(20); setMonthlyBudget(0); setDownPaymentPct(20); setTermMonths(36); setAnnualRatePct(12); setStep(0);
  }
  async function share() {
    await navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
    trackEvent("finder_share", { results: results.length });
  }

  function nextStep(){setStep((value)=>Math.min(value+1, finderSteps.length-1));}
  function prevStep(){setStep((value)=>Math.max(value-1, 0));}

  return <div className="decision-finder finder-v4">
    <section className="finder-stage-shell">
      <div className="finder-stage-main">
        <div className="finder-progress" aria-label="Finder progress">{finderSteps.map((label,index)=><button type="button" key={label} className={index===step?"active":index<step?"done":""} onClick={()=>setStep(index)}><span>{index<step?"✓":index+1}</span><b>{label}</b></button>)}</div>
        <div className="finder-stage-card">
          <div className="finder-stage-kicker">Step {step+1} of {finderSteps.length}</div>
          {step===0&&<><h2>What is your purchase budget?</h2><p>Start with the amount you are comfortable spending on the motorcycle itself.</p><div className="finder-choice-grid budget">{budgetChoices.map(([value,label])=><button type="button" key={value} className={budget===value?"selected":""} onClick={()=>{setBudget(value);window.setTimeout(nextStep,120);}}><span>{label}</span><small>{value==="any"?"Show the full current catalog":`Motorcycles priced at or below ${label.replace("Up to ","")}`}</small></button>)}</div></>}
          {step===1&&<><h2>What will the motorcycle do most often?</h2><p>This changes how the Finder scores weight, comfort, engine performance and day-to-day usability.</p><div className="finder-choice-grid">{useChoices.map(([value,label,copy])=><button type="button" key={value} className={useCase===value?"selected":""} onClick={()=>{setUseCase(value);window.setTimeout(nextStep,120);}}><span>{label}</span><small>{copy}</small></button>)}</div></>}
          {step===2&&<><h2>How should the motorcycle fit you?</h2><p>Inseam is more useful than total height for estimating low-speed confidence and foot reach.</p><div className="finder-fit-stage"><label><span>Your inseam</span><select value={inseam} onChange={(e)=>setInseam(Number(e.target.value))}>{[26,27,28,29,30,31,32,33,34,35,36,37,38].map((v)=><option value={v} key={v}>{v} inches</option>)}</select><small>Measure from the floor to the top of your inner leg while standing.</small></label><label><span>Maximum seat height</span><select value={maxSeat} onChange={(e)=>setMaxSeat(e.target.value)}><option value="any">Let MotoIndex score the fit</option><option value="760">760 mm</option><option value="780">780 mm</option><option value="800">800 mm</option><option value="820">820 mm</option></select><small>Optional hard limit if you already know your preference.</small></label></div></>}
          {step===3&&<><h2>Will you regularly carry someone or something?</h2><p>Passenger and luggage needs change the usefulness of weight, power and storage-friendly motorcycles.</p><div className="finder-choice-grid toggles"><button type="button" className={passenger?"selected":""} onClick={()=>setPassenger((v)=>!v)}><span>{passenger?"✓ ":""}Regular passenger</span><small>Score two-up practicality more strongly.</small></button><button type="button" className={luggage?"selected":""} onClick={()=>setLuggage((v)=>!v)}><span>{luggage?"✓ ":""}Need luggage</span><small>Favor utility and practical everyday use.</small></button><button type="button" className={!passenger&&!luggage?"selected":""} onClick={()=>{setPassenger(false);setLuggage(false);}}><span>Mostly solo</span><small>Keep the shortlist focused on your own ride.</small></button></div></>}
          {step===4&&<><h2>Automatic or manual?</h2><p>Choose your preference, then tell us what traffic you actually face.</p><div className="finder-choice-grid compact">{[["any","Either"],["Automatic","Automatic"],["Manual","Manual"]].map(([value,label])=><button type="button" key={value} className={transmission===value?"selected":""} onClick={()=>setTransmission(value)}><span>{label}</span></button>)}</div><div className="finder-traffic-row"><span>Typical traffic</span>{(["heavy","mixed","light"] as TrafficLevel[]).map((value)=><button type="button" key={value} className={traffic===value?"selected":""} onClick={()=>setTraffic(value)}>{value==="heavy"?"Heavy stop-go":value==="mixed"?"Mixed":"Mostly open"}</button>)}</div></>}
          {step===5&&<><h2>Where will you ride?</h2><p>Use these only when they reflect your real riding. A 400cc+ filter is not a guarantee of tollway eligibility.</p><div className="finder-choice-grid toggles"><button type="button" className={highway?"selected":""} onClick={()=>setHighway((v)=>!v)}><span>{highway?"✓ ":""}Faster provincial / national roads</span><small>Give more weight to open-road performance.</small></button><button type="button" className={expresswayClass?"selected":""} onClick={()=>setExpresswayClass((v)=>!v)}><span>{expresswayClass?"✓ ":""}Only show 400cc+</span><small>Engine-displacement research filter only.</small></button></div><label className="finder-distance"><span>Daily round trip</span><select value={dailyKm} onChange={(e)=>setDailyKm(Number(e.target.value))}>{[10,20,30,40,60,80].map((v)=><option key={v} value={v}>{v} km</option>)}</select></label></>}
          <div className="finder-stage-actions"><button type="button" className="button ghost on-light" onClick={prevStep} disabled={step===0}>Back</button>{step<finderSteps.length-1?<button type="button" className="button" onClick={nextStep}>Continue</button>:<a className="button" href="#finder-results">See my matches ↓</a>}</div>
        </div>
        <div className="finder-advanced-row"><button type="button" onClick={()=>setShowMoreFilters((v)=>!v)} aria-expanded={showMoreFilters}>{showMoreFilters?"Hide advanced filters":"Advanced filters"}</button><span>Brand, category, ABS, weight and monthly ownership planning</span></div>
        {showMoreFilters&&<div className="finder-advanced-panel">
          <label><span>Make</span><select value={make} onChange={(e)=>setMake(e.target.value)}><option value="any">Any make</option>{makes.map((v)=><option key={v} value={v}>{v}</option>)}</select></label>
          <label><span>Category</span><select value={category} onChange={(e)=>setCategory(e.target.value)}><option value="any">Any category</option>{categories.map((v)=><option key={v} value={v}>{v}</option>)}</select></label>
          <label><span>ABS listing</span><select value={abs} onChange={(e)=>setAbs(e.target.value)}><option value="any">Any</option><option value="yes">ABS listed</option><option value="no">No ABS listed</option></select></label>
          <label><span>Maximum weight</span><select value={maxWeight} onChange={(e)=>setMaxWeight(e.target.value)}><option value="any">No limit</option><option value="110">110 kg</option><option value="120">120 kg</option><option value="140">140 kg</option><option value="180">180 kg</option></select></label>
          <label><span>Monthly ownership ceiling</span><select value={monthlyBudget} onChange={(e)=>setMonthlyBudget(Number(e.target.value))}><option value="0">Not set</option><option value="4000">₱4K/mo</option><option value="6000">₱6K/mo</option><option value="8000">₱8K/mo</option><option value="10000">₱10K/mo</option><option value="15000">₱15K/mo</option><option value="25000">₱25K/mo</option></select></label>
          <label><span>Down payment</span><select value={downPaymentPct} onChange={(e)=>setDownPaymentPct(Number(e.target.value))}><option value="10">10%</option><option value="20">20%</option><option value="30">30%</option><option value="40">40%</option></select></label>
          <label><span>Planning term</span><select value={termMonths} onChange={(e)=>setTermMonths(Number(e.target.value))}><option value="12">12 mo</option><option value="24">24 mo</option><option value="36">36 mo</option><option value="48">48 mo</option><option value="60">60 mo</option></select></label>
          <label><span>Planning APR</span><select value={annualRatePct} onChange={(e)=>setAnnualRatePct(Number(e.target.value))}><option value="0">0%</option><option value="8">8%</option><option value="12">12%</option><option value="18">18%</option><option value="24">24%</option></select></label>
        </div>}
        <div className="finder-utility-row"><button type="button" onClick={reset}>Start over</button><button type="button" onClick={share}>{copied?"Link copied ✓":"Copy finder link"}</button></div>
      </div>

      <aside className="finder-live-preview" aria-live="polite">
        <span>Live best match</span>
        {top?<><div className="finder-preview-media"><EntityMedia entityType="motorcycle" entityId={top.model.id} showCredit={false} fallback={<div className="decision-media-fallback"><strong>{top.model.make} {top.model.model}</strong></div>} /></div><small>{top.model.make} · {top.model.category}</small><h3>{top.model.model}</h3><strong>{observedMarketPriceLabel(top.model)}</strong><div className="finder-preview-score"><b>{top.decision.score}</b><span>/100<br/>{top.decision.label}</span></div><p>{top.decision.reasons.slice(0,2).join(" · ") || "Current highest score for your answers."}</p></>:<><h3>No exact match yet</h3><p>Relax one hard filter or increase the purchase budget.</p></>}
      </aside>
    </section>

    {expresswayClass&&<p className="finder-legal-note">The 400cc+ control is only an engine-displacement research filter. Confirm the motorcycle&apos;s registration classification and current tollway rules before relying on it for expressway access.</p>}

    <section id="finder-results" className="finder-results-section">
      {top ? <>
        <section className="decision-winner" aria-live="polite">
          <div className="decision-winner-score"><span>Top match</span><strong>{top.decision.score}<small>/100</small></strong><b>{top.decision.label}</b></div>
          <div className="decision-winner-copy"><span>{top.model.make}</span><h2>{top.model.model}</h2><p>{top.decision.reasons.length ? top.decision.reasons.join(" · ") : "Highest score against the current profile."}</p><div className="decision-winner-cost"><span><small>Published price</small><b>{observedMarketPriceLabel(top.model)}</b></span><span><small>Estimated loan</small><b>{peso(top.decision.estimatedLoanMonthlyPhp)}/mo</b></span><span><small>Running costs</small><b>{peso(top.decision.estimatedRunningMonthlyPhp)}/mo</b></span><span><small>Estimated total</small><b>{peso(top.decision.estimatedTotalMonthlyPhp)}/mo</b></span></div></div>
          <div className="decision-winner-actions"><Link className="button" href={`/get-quote/${top.model.makeSlug}/${top.model.slug}`}>Get dealer price</Link><Link className="button ghost on-light" href={`/motorcycles/${top.model.makeSlug}/${top.model.slug}`}>Open model</Link>{second&&<Link className="button ghost on-light" href={compareTopHref}>Compare top two</Link>}<small>Loan and ownership figures are planning estimates. Replace them with actual dealer and lender amounts before buying.</small></div>
        </section>
        <div className="decision-results-head"><div><span>{results.length} matching motorcycles</span><h2>Why these motorcycles fit your answers</h2></div><p>Scores use the measurable fit, road-use and cost inputs you selected.</p></div>
        <div className="decision-result-list">{results.slice(0,18).map(({model,decision},index)=>{const href=`/motorcycles/${model.makeSlug}/${model.slug}`;return <article className="decision-result-card" key={model.id}>
          <div className="decision-rank"><span>#{index+1}</span><strong>{decision.score}</strong><small>{decision.label}</small></div>
          <div className="decision-result-media"><EntityMedia entityType="motorcycle" entityId={model.id} linkHref={href} showCredit={false} fallback={<Link href={href} className="decision-media-fallback"><span>{model.make}</span><strong>{model.model}</strong><small>{model.engineCc} cc · {model.curbWeightKg} kg</small></Link>} /></div>
          <div className="decision-result-main"><div className="decision-title-row"><div><span>{model.make} · {model.category}</span><h3><Link href={href}>{model.model}</Link></h3></div><strong>{observedMarketPriceLabel(model)}</strong></div><div className="decision-chips"><span>{model.engineCc} cc</span><span>{model.seatHeightMm} mm seat</span><span>{model.curbWeightKg} kg</span><span>{model.transmission||"—"}</span>{absAvailable(model)&&<span>ABS listed</span>}</div><div className="decision-reason-grid"><div><span>Why it fits</span><ul>{decision.reasons.slice(0,3).map((reason)=><li key={reason}>{reason}</li>)}{decision.reasons.length===0&&<li>Best available score on the selected measurable factors.</li>}</ul></div><div><span>Watch-outs</span><ul>{decision.cautions.slice(0,3).map((reason)=><li key={reason}>{reason}</li>)}{decision.cautions.length===0&&<li>No major score penalty under the selected profile.</li>}</ul></div></div><details className="decision-breakdown"><summary>Show score breakdown</summary><div>{decision.factors.map((factor)=><div key={factor.key} className={`decision-factor ${factor.tone}`}><span>{factor.label}<small>{factor.detail}</small></span><b>{factor.score}/{factor.maxScore}</b></div>)}</div></details><div className="decision-cost-strip finder-commute-cost"><span><small>Published price</small><b>{compactPeso(decision.purchasePricePhp)}</b></span><span><small>Estimated loan</small><b>{peso(decision.estimatedLoanMonthlyPhp)}</b></span><span><small>Running costs</small><b>{peso(decision.estimatedRunningMonthlyPhp)}</b></span><span><small>Est. ownership / mo</small><b>{peso(decision.estimatedTotalMonthlyPhp)}</b></span>{monthlyBudget>0&&<span className={decision.affordabilityGapPhp&&decision.affordabilityGapPhp>=0?"within":"over"}><small>Vs ceiling</small><b>{decision.affordabilityGapPhp&&decision.affordabilityGapPhp>=0?"+":""}{peso(decision.affordabilityGapPhp||0)}</b></span>}</div><div className="decision-card-actions"><Link href={`/get-quote/${model.makeSlug}/${model.slug}`} className="button small">Dealer price</Link><Link href={href} className="button ghost small">Model details</Link><CompareButton modelId={model.id} compact/><SaveToShortlistButton modelId={model.id} compact/></div></div>
        </article>})}</div>
      </> : <div className="decision-empty"><span>No exact match</span><h2>Those answers do not match a current motorcycle yet.</h2><p>Raise the purchase budget, remove the 400cc+ requirement or relax an advanced filter.</p><button type="button" className="button" onClick={reset}>Start over</button></div>}
    </section>
  </div>;
}
