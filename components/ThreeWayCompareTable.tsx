import type { Motorcycle } from "@/lib/types";
import { observedMarketPriceLabel } from "@/lib/marketChecks";

export function ThreeWayCompareTable({models}:{models:Motorcycle[]}){
  const rows:[string,(m:Motorcycle)=>string][]=[
    ["Market price",observedMarketPriceLabel],["Engine",m=>`${m.engineCc} cc`],["Power",m=>`${m.powerHp} hp`],["Torque",m=>`${m.torqueNm} Nm`],["Weight",m=>`${m.curbWeightKg} kg`],["Seat height",m=>`${m.seatHeightMm} mm`],["Fuel tank",m=>`${m.fuelTankL} L`],["Fuel economy",m=>m.fuelConsumptionKmL?`${m.fuelConsumptionKmL} km/L listed`:"Planning estimate only"],["Transmission",m=>m.transmission||"—"],["Front tire",m=>m.frontTire],["Rear tire",m=>m.rearTire],["Brakes / ABS",m=>m.abs]
  ];
  return <div className="compare-wrap" tabIndex={0} aria-label="Scrollable three-motorcycle comparison table"><table className="compare-table three"><thead><tr><th scope="col">Spec</th>{models.map(m=><th scope="col" key={m.id}>{m.make} {m.model}</th>)}</tr></thead><tbody>{rows.map(([label,get])=><tr key={label}><th scope="row">{label}</th>{models.map(m=><td key={m.id}>{get(m)}</td>)}</tr>)}</tbody></table></div>;
}
