"use client";

import { useMemo, useState } from "react";
import type { Motorcycle } from "@/lib/types";
import { evaluateMotorcycle, type DecisionProfile, type DecisionUseCase, type TrafficLevel } from "@/lib/decisionEngine";
import { estimatedUsedValue } from "@/lib/ownership";
import { php } from "@/lib/utils";
import styles from "./ComparisonDecisionWorkbench.module.css";

const useCases: Array<[DecisionUseCase,string]> = [
  ["city","Daily city riding"],
  ["short","Easy handling / rider fit"],
  ["work","Work and utility"],
  ["performance","Performance"],
  ["touring","Longer rides"]
];

function threeYearNet(model: Motorcycle, decision: ReturnType<typeof evaluateMotorcycle>, downPct: number, termMonths: number) {
  const down = decision.purchasePricePhp * downPct / 100;
  const acquisition = down + decision.estimatedLoanMonthlyPhp * termMonths;
  const running = decision.estimatedRunningMonthlyPhp * 36;
  const resale = estimatedUsedValue(model, 3, "good");
  return Math.max(0, acquisition + running - resale);
}

export function ComparisonDecisionWorkbench({ a, b }: { a: Motorcycle; b: Motorcycle }) {
  const [useCase,setUseCase]=useState<DecisionUseCase>("city");
  const [inseam,setInseam]=useState(30);
  const [traffic,setTraffic]=useState<TrafficLevel>("heavy");
  const [passenger,setPassenger]=useState(false);
  const [luggage,setLuggage]=useState(false);
  const [highway,setHighway]=useState(false);
  const [dailyKm,setDailyKm]=useState(20);
  const [monthlyBudget,setMonthlyBudget]=useState(0);
  const [downPct,setDownPct]=useState(20);
  const [termMonths,setTermMonths]=useState(36);
  const [apr,setApr]=useState(12);

  const profile: DecisionProfile = useMemo(()=>({
    useCase,
    inseamIn: inseam,
    passenger,
    highway,
    expresswayClass:false,
    luggage,
    traffic,
    dailyKm,
    monthlyBudgetPhp:monthlyBudget||undefined,
    downPaymentPct:downPct,
    termMonths,
    annualRatePct:apr,
  }),[useCase,inseam,passenger,highway,luggage,traffic,dailyKm,monthlyBudget,downPct,termMonths,apr]);

  const rows=useMemo(()=>[a,b].map(model=>{
    const decision=evaluateMotorcycle(model,profile);
    return {model,decision,threeYear:threeYearNet(model,decision,downPct,termMonths)};
  }),[a,b,profile,downPct,termMonths]);

  const winner=rows[0].decision.score===rows[1].decision.score?null:rows[0].decision.score>rows[1].decision.score?rows[0].model.id:rows[1].model.id;
  const cheaperThreeYear=rows[0].threeYear===rows[1].threeYear?null:rows[0].threeYear<rows[1].threeYear?rows[0].model.id:rows[1].model.id;
  const difference=Math.abs(rows[0].threeYear-rows[1].threeYear);

  return <section className={styles.workbench} aria-labelledby="personal-compare-title">
    <div className={styles.head}><div><span>Personalized decision</span><h2 id="personal-compare-title">Which motorcycle fits your use better?</h2></div><p>Change your priorities and MotoIndex recalculates rider fit, use-case score, monthly ownership planning and a three-year ownership estimate.</p></div>

    <div className={styles.controls}>
      <label>Primary use<select value={useCase} onChange={e=>setUseCase(e.target.value as DecisionUseCase)}>{useCases.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
      <label>Inseam<select value={inseam} onChange={e=>setInseam(Number(e.target.value))}>{[26,27,28,29,30,31,32,33,34,35,36,37,38].map(v=><option key={v} value={v}>{v} in</option>)}</select></label>
      <label>Traffic<select value={traffic} onChange={e=>setTraffic(e.target.value as TrafficLevel)}><option value="heavy">Heavy stop-go</option><option value="mixed">Mixed</option><option value="light">Mostly open</option></select></label>
      <label>Daily round trip<select value={dailyKm} onChange={e=>setDailyKm(Number(e.target.value))}>{[10,20,30,40,60,80].map(v=><option key={v} value={v}>{v} km</option>)}</select></label>
      <label>Monthly ceiling<select value={monthlyBudget} onChange={e=>setMonthlyBudget(Number(e.target.value))}><option value="0">Not set</option><option value="4000">₱4K</option><option value="6000">₱6K</option><option value="8000">₱8K</option><option value="10000">₱10K</option><option value="15000">₱15K</option><option value="25000">₱25K</option></select></label>
      <label>Down payment<select value={downPct} onChange={e=>setDownPct(Number(e.target.value))}><option value="10">10%</option><option value="20">20%</option><option value="30">30%</option><option value="40">40%</option></select></label>
      <label>Loan term<select value={termMonths} onChange={e=>setTermMonths(Number(e.target.value))}><option value="12">12 months</option><option value="24">24 months</option><option value="36">36 months</option></select></label>
      <label>APR assumption<select value={apr} onChange={e=>setApr(Number(e.target.value))}><option value="0">0%</option><option value="8">8%</option><option value="12">12%</option><option value="18">18%</option><option value="24">24%</option></select></label>
      <label className={styles.toggle}><input type="checkbox" checked={passenger} onChange={e=>setPassenger(e.target.checked)}/> Regular passenger</label>
      <label className={styles.toggle}><input type="checkbox" checked={luggage} onChange={e=>setLuggage(e.target.checked)}/> Need luggage</label>
      <label className={styles.toggle}><input type="checkbox" checked={highway} onChange={e=>setHighway(e.target.checked)}/> Faster open roads</label>
    </div>

    <div className={styles.results}>{rows.map(({model,decision,threeYear})=><article key={model.id} className={`${styles.result} ${winner===model.id?styles.winner:""}`}>
      <div className={styles.resultTop}><div><span>{model.make}</span><h3>{model.model}</h3>{winner===model.id&&<b className={styles.winnerTag}>Best fit for these priorities</b>}</div><div className={styles.score}><strong>{decision.score}</strong><small>{decision.label}</small></div></div>
      <div className={styles.metrics}><span><small>Loan estimate</small><b>{php(decision.estimatedLoanMonthlyPhp)}/mo</b></span><span><small>Total monthly</small><b>{php(decision.estimatedTotalMonthlyPhp)}/mo</b></span><span><small>3-year net</small><b>{php(threeYear)}</b></span></div>
      <ul className={styles.reasons}>{decision.reasons.slice(0,3).map(reason=><li key={reason}>{reason}</li>)}{decision.reasons.length===0&&<li>Highest available score on the measurable factors selected.</li>}</ul>
      <div className={styles.foot}><strong>{cheaperThreeYear===model.id?`Lower 3-year estimate by ${php(difference)}`:"Decision score reflects your selected priorities"}</strong><span>{decision.cautions[0]||"No major scoring caution for this profile."}</span></div>
    </article>)}</div>
    <p className={styles.disclaimer}>Planning estimates only. Financing uses the APR, down payment and term above. Running costs use MotoIndex defaults and the selected riding distance. Three-year net subtracts an estimated resale value and is not a dealer, lender or resale quote.</p>
  </section>;
}
