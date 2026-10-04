import { describe, expect, it } from "vitest";
import { summarizeOwnerReviews, type PublicOwnerReview } from "../lib/ownerReviewPolicy";

function review(id:string,overrides:Partial<PublicOwnerReview>={}):PublicOwnerReview{
  return {
    id,modelExternalId:"model-1",variantLabel:null,modelYear:2026,ownershipMonths:12,odometerKm:5000,
    comfortRating:4,cityTrafficRating:4,maintenanceRating:4,passengerRating:4,highwayRating:4,
    fuelEconomyKmpl:42,annualMaintenancePhp:8000,unscheduledRepairsCount:0,
    summary:"A useful owner summary that is long enough for testing.",
    likes:"Comfortable and easy to use.",dislikes:"Storage could be better.",
    publishedAt:"2026-10-04T00:00:00.000Z",...overrides
  };
}

describe("owner review aggregation privacy",()=>{
  it("does not publish rating averages from fewer than three owners",()=>{
    const summary=summarizeOwnerReviews([review("1"),review("2")]);
    expect(summary.ratingSampleReady).toBe(false);
    expect(summary.ratings).toBeNull();
  });

  it("publishes rating averages at three but keeps cost metrics hidden until five reports",()=>{
    const summary=summarizeOwnerReviews([review("1"),review("2"),review("3")]);
    expect(summary.ratingSampleReady).toBe(true);
    expect(summary.ratings?.comfort).toBe(4);
    expect(summary.fuelEconomyKmpl).toBeNull();
    expect(summary.annualMaintenancePhp).toBeNull();
  });

  it("publishes aggregate fuel and maintenance only from five reports",()=>{
    const summary=summarizeOwnerReviews([review("1"),review("2"),review("3"),review("4"),review("5")]);
    expect(summary.fuelEconomyKmpl).toBe(42);
    expect(summary.annualMaintenancePhp).toBe(8000);
  });
});
