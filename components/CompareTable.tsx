import type { Motorcycle } from "@/lib/types";
import { observedMarketPriceLabel } from "@/lib/marketChecks";

export function CompareTable({ a, b }: { a: Motorcycle; b: Motorcycle }) {
  const rows = [
    ["Market price", observedMarketPriceLabel(a), observedMarketPriceLabel(b)],
    ["Engine", `${a.engineCc} cc`, `${b.engineCc} cc`],
    ["Power", `${a.powerHp} hp`, `${b.powerHp} hp`],
    ["Torque", `${a.torqueNm} Nm`, `${b.torqueNm} Nm`],
    ["Weight", `${a.curbWeightKg} kg`, `${b.curbWeightKg} kg`],
    ["Seat height", `${a.seatHeightMm} mm`, `${b.seatHeightMm} mm`],
    ["Fuel tank", `${a.fuelTankL} L`, `${b.fuelTankL} L`],
    ["Transmission", a.transmission || "—", b.transmission || "—"],
    ["Front tire", a.frontTire, b.frontTire],
    ["Rear tire", a.rearTire, b.rearTire],
    ["Brakes / ABS", a.abs, b.abs]
  ];
  return <div className="compare-wrap" tabIndex={0} aria-label={`Scrollable comparison table for ${a.model} and ${b.model}`}><table className="compare-table"><thead><tr><th scope="col">Spec</th><th scope="col">{a.make} {a.model}</th><th scope="col">{b.make} {b.model}</th></tr></thead><tbody>{rows.map(r=><tr key={r[0]}><th scope="row">{r[0]}</th><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody></table></div>;
}
