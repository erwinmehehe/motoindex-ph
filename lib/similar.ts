import type { Motorcycle } from "./types";
import { publicMotorcycles } from "./data";
import { observedMarketRange } from "./marketChecks";

function distance(a: Motorcycle, b: Motorcycle) {
  const priceA = observedMarketRange(a).from;
  const priceB = observedMarketRange(b).from;
  let score = Math.abs(priceA-priceB)/5000 + Math.abs(a.engineCc-b.engineCc)/20 + Math.abs(a.seatHeightMm-b.seatHeightMm)/20;
  if (a.category === b.category) score -= 5;
  if (a.transmission === b.transmission) score -= 2;
  return score;
}

export function similarMotorcycles(model: Motorcycle) {
  const others = publicMotorcycles.filter((candidate) => candidate.id !== model.id);
  const similar = [...others].sort((a,b)=>distance(model,a)-distance(model,b)).slice(0,3);
  const currentPrice = observedMarketRange(model).from;
  const cheaper = others.filter((candidate)=>observedMarketRange(candidate).from < currentPrice).sort((a,b)=>Math.abs(currentPrice-observedMarketRange(a).from)-Math.abs(currentPrice-observedMarketRange(b).from)).slice(0,3);
  const lowerSeat = others.filter((candidate)=>{const price=observedMarketRange(candidate).from;return candidate.category===model.category&&candidate.seatHeightMm<model.seatHeightMm&&price>=currentPrice*.7&&price<=currentPrice*1.3;}).sort((a,b)=>Math.abs(model.seatHeightMm-a.seatHeightMm)-Math.abs(model.seatHeightMm-b.seatHeightMm)||Math.abs(currentPrice-observedMarketRange(a).from)-Math.abs(currentPrice-observedMarketRange(b).from)).slice(0,3);
  return { similar, cheaper, lowerSeat };
}
