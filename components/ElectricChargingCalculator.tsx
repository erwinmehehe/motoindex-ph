"use client";

import { useMemo, useState } from "react";

export function ElectricChargingCalculator() {
  const [batteryKwh, setBatteryKwh] = useState(3);
  const [rangeKm, setRangeKm] = useState(145);
  const [rate, setRate] = useState(12);
  const [distance, setDistance] = useState(30);

  const result = useMemo(() => {
    const fullCharge = batteryKwh * rate;
    const costPer100 = rangeKm > 0 ? (fullCharge / rangeKm) * 100 : 0;
    const monthly = rangeKm > 0 ? (distance * 30 / rangeKm) * fullCharge : 0;
    return { fullCharge, costPer100, monthly };
  }, [batteryKwh, rangeKm, rate, distance]);

  return <div className="calculator-shell">
    <div className="calculator-inputs">
      <label>Battery capacity (kWh)<input type="number" min="0.1" step="0.1" value={batteryKwh} onChange={e=>setBatteryKwh(Math.max(.1,Number(e.target.value)||.1))}/></label>
      <label>Claimed range (km)<input type="number" min="1" value={rangeKm} onChange={e=>setRangeKm(Math.max(1,Number(e.target.value)||1))}/></label>
      <label>Electricity rate (₱/kWh)<input type="number" min="0" step="0.1" value={rate} onChange={e=>setRate(Math.max(0,Number(e.target.value)||0))}/></label>
      <label>Distance per day (km)<input type="number" min="0" value={distance} onChange={e=>setDistance(Math.max(0,Number(e.target.value)||0))}/></label>
    </div>
    <div className="calculator-results" aria-live="polite">
      <div><span>Full charge</span><strong>₱{result.fullCharge.toFixed(2)}</strong></div>
      <div><span>Electricity per 100 km</span><strong>₱{result.costPer100.toFixed(2)}</strong></div>
      <div><span>30-day charging estimate</span><strong>₱{result.monthly.toFixed(2)}</strong></div>
    </div>
    <p className="muted-copy">This uses battery capacity and your electricity rate. Charging losses, battery condition, traffic, speed, payload and weather can change the actual cost and range.</p>
  </div>;
}
