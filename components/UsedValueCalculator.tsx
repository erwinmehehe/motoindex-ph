"use client";
import { useMemo, useState } from "react";
import type { Motorcycle } from "@/lib/types";
import type { ConditionBand } from "@/lib/ownership";
import { estimatedUsedValue } from "@/lib/ownership";
import { php } from "@/lib/utils";

export function UsedValueCalculator({ model }: { model: Motorcycle }) {
  const [age, setAge] = useState(3);
  const [condition, setCondition] = useState<ConditionBand>("good");
  const estimate = useMemo(()=>estimatedUsedValue(model, age, condition), [model, age, condition]);
  const lost = Math.max(0, model.srp-estimate);
  return <div className="used-calculator">
    <div><h2>Estimate a used {model.model} value</h2><p>This estimate starts from the listed new-price reference and applies a simple depreciation curve. It is not a market appraisal or live asking price.</p></div>
    <div className="used-controls"><label>Bike age <b>{age} year{age===1?"":"s"}</b><input type="range" min="1" max="8" value={age} onChange={e=>setAge(Number(e.target.value))}/></label><label>Condition<select value={condition} onChange={e=>setCondition(e.target.value as ConditionBand)}><option value="fair">Fair</option><option value="good">Good</option><option value="excellent">Excellent</option></select></label></div>
    <div className="used-estimate"><small>Estimated used value</small><strong>{php(estimate)}</strong><span>Approx. {Math.round(lost/model.srp*100)}% below the new-price reference</span></div>
  </div>;
}
