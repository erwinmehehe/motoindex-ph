import { describe, expect, it } from "vitest";
import { estimateUsedMotorcycleValue } from "../lib/usedValuation";
import type { PublicUsedListing } from "../lib/persistentUsedListings";

function listing(id:string,overrides:Partial<PublicUsedListing>={}):PublicUsedListing{
  return {
    id,
    modelExternalId:"model-1",
    title:"2025 Honda Test",
    modelYear:2025,
    mileageKm:10000,
    askingPricePhp:100000,
    condition:"good",
    sellerType:"private owner",
    location:"Quezon City",
    sourceLabel:"MotoIndex verified listing",
    contactAvailable:false,
    postedAt:"2026-10-01T00:00:00.000Z",
    ...overrides
  };
}

const input={
  modelId:"model-1",
  modelYear:2025,
  mileageKm:10000,
  condition:"good" as const,
  location:"Quezon City",
  currentSrpPhp:130000,
  currentYear:2026
};

describe("used motorcycle valuation",()=>{
  it("anchors a high-confidence estimate to five verified comparables",()=>{
    const valuation=estimateUsedMotorcycleValue([
      listing("1",{askingPricePhp:95000}),
      listing("2",{askingPricePhp:98000,mileageKm:12000}),
      listing("3",{askingPricePhp:100000}),
      listing("4",{askingPricePhp:102000,mileageKm:8000}),
      listing("5",{askingPricePhp:105000})
    ],input,new Date("2026-10-04T00:00:00Z"));
    expect(valuation.confidence).toBe("high");
    expect(valuation.comparableCount).toBe(5);
    expect(valuation.privateSale.lowPhp).toBeLessThan(valuation.privateSale.midpointPhp);
    expect(valuation.privateSale.highPhp).toBeGreaterThan(valuation.privateSale.midpointPhp);
    expect(valuation.dealerTrade.midpointPhp).toBeLessThan(valuation.privateSale.midpointPhp);
  });

  it("removes extreme asking-price outliers before estimating",()=>{
    const valuation=estimateUsedMotorcycleValue([
      listing("1",{askingPricePhp:95000}),
      listing("2",{askingPricePhp:98000}),
      listing("3",{askingPricePhp:100000}),
      listing("4",{askingPricePhp:102000}),
      listing("5",{askingPricePhp:105000}),
      listing("outlier",{askingPricePhp:500000})
    ],input);
    expect(valuation.comparableCount).toBe(5);
    expect(valuation.comparableIds).not.toContain("outlier");
  });

  it("uses region only when enough same-region comparables exist",()=>{
    const valuation=estimateUsedMotorcycleValue([
      listing("1",{location:"Cebu City",askingPricePhp:110000}),
      listing("2",{location:"Cebu City",askingPricePhp:112000}),
      listing("3",{location:"Makati City",askingPricePhp:100000}),
      listing("4",{location:"Makati City",askingPricePhp:100000}),
      listing("5",{location:"Pasig City",askingPricePhp:100000})
    ],{...input,location:"Cebu City"});
    expect(valuation.sameRegionComparableCount).toBe(2);
    expect(valuation.adjustments.some(item=>item.label==="Region")).toBe(true);
  });

  it("changes the estimate for seller-selected condition",()=>{
    const comps=[listing("1"),listing("2"),listing("3"),listing("4"),listing("5")];
    const fair=estimateUsedMotorcycleValue(comps,{...input,condition:"fair"});
    const excellent=estimateUsedMotorcycleValue(comps,{...input,condition:"excellent"});
    expect(excellent.privateSale.midpointPhp).toBeGreaterThan(fair.privateSale.midpointPhp);
  });

  it("falls back conservatively when no verified comparables exist",()=>{
    const valuation=estimateUsedMotorcycleValue([],{...input,modelYear:2022,mileageKm:30000});
    expect(valuation.confidence).toBe("low");
    expect(valuation.comparableCount).toBe(0);
    expect(valuation.privateSale.midpointPhp).toBeGreaterThan(0);
    expect(valuation.assumptions.join(" ")).toContain("Fewer than three");
  });
});
