import { describe, expect, it } from "vitest";
import { deriveOwnerIntelligenceSnapshot, summarizeOwnerIntelligence } from "../lib/ownerIntelligence";

describe("owner intelligence privacy and aggregation",()=>{
  it("derives sanitized Garage metrics without raw record content",()=>{
    const bike={
      id:"bike-1",catalogModelId:"model-1",make:"Honda",model:"Test",purchaseDate:"2026-01-01",
      purchaseOdometerKm:1000,odometerKm:11000,createdAt:"2026-01-01",updatedAt:"2026-10-01"
    };
    const records=[
      {id:"f1",motorcycleId:"bike-1",category:"FUEL" as const,date:"2026-01-10",title:"Fuel",amountPhp:500,odometerKm:1000,liters:10,fullTank:true},
      {id:"f2",motorcycleId:"bike-1",category:"FUEL" as const,date:"2026-02-10",title:"Fuel",amountPhp:500,odometerKm:1400,liters:10,fullTank:true},
      {id:"p1",motorcycleId:"bike-1",category:"PMS" as const,date:"2026-03-01",title:"Service at Secret Shop",amountPhp:1500,odometerKm:5000,serviceProvider:"Secret Shop"},
      {id:"t1",motorcycleId:"bike-1",category:"TIRE" as const,date:"2026-04-01",title:"Tire replacement",amountPhp:3000,odometerKm:3000},
      {id:"t2",motorcycleId:"bike-1",category:"TIRE" as const,date:"2026-09-01",title:"Tire replacement",amountPhp:3200,odometerKm:10000},
      {id:"r1",motorcycleId:"bike-1",category:"REPAIR" as const,date:"2026-08-01",title:"Repair",amountPhp:900,odometerKm:9000},
      {id:"o1",motorcycleId:"bike-1",category:"ODOMETER" as const,date:"2026-06-01",title:"Odometer",odometerKm:7000},
      {id:"o2",motorcycleId:"bike-1",category:"ODOMETER" as const,date:"2026-07-01",title:"Odometer",odometerKm:8000}
    ];
    const snapshot=deriveOwnerIntelligenceSnapshot(bike,records,new Date("2026-10-01T00:00:00Z"));
    expect(snapshot.fuelEconomyKmpl).toBe(40);
    expect(snapshot.tireLifeKm).toBe(7000);
    expect(snapshot.repairsPer10kKm).toBe(1);
    expect(snapshot.eventCounts.PMS).toBe(1);
    expect(JSON.stringify(snapshot)).not.toContain("Secret Shop");
  });

  it("hides intelligence until five consented contributors",()=>{
    const rows=Array.from({length:4},()=>({
      intelligenceConsentedAt:new Date(),
      intelligenceMonthlyRunningCostPhp:3000,
      intelligenceAnnualMaintenancePhp:9000,
      intelligenceFuelEconomyKmpl:42,
      intelligenceTireLifeKm:12000,
      intelligenceMaintenanceEventsPer10kKm:2,
      intelligenceRepairsPer10kKm:.5,
      intelligenceTrackedDistanceKm:10000,
      intelligenceEventCounts:{PMS:2}
    }));
    const summary=summarizeOwnerIntelligence(rows);
    expect(summary.ready).toBe(false);
    expect(summary.monthlyRunningCostPhp).toBeNull();
    expect(summary.commonMaintenance).toEqual([]);
  });

  it("publishes aggregates only at five consented contributors",()=>{
    const rows=Array.from({length:5},()=>({
      intelligenceConsentedAt:new Date(),
      intelligenceMonthlyRunningCostPhp:3000,
      intelligenceAnnualMaintenancePhp:9000,
      intelligenceFuelEconomyKmpl:42,
      intelligenceTireLifeKm:12000,
      intelligenceMaintenanceEventsPer10kKm:2,
      intelligenceRepairsPer10kKm:.5,
      intelligenceTrackedDistanceKm:10000,
      intelligenceEventCounts:{PMS:2,TIRE:1}
    }));
    const summary=summarizeOwnerIntelligence(rows);
    expect(summary.ready).toBe(true);
    expect(summary.monthlyRunningCostPhp).toBe(3000);
    expect(summary.fuelEconomyKmpl).toBe(42);
    expect(summary.commonMaintenance.map(item=>item.category)).toEqual(["PMS","TIRE"]);
  });

  it("ignores rows without explicit intelligence consent",()=>{
    const rows=Array.from({length:6},(_,index)=>({
      intelligenceConsentedAt:index<4?new Date():null,
      intelligenceMonthlyRunningCostPhp:3000,
      intelligenceAnnualMaintenancePhp:9000,
      intelligenceFuelEconomyKmpl:42,
      intelligenceTireLifeKm:12000,
      intelligenceMaintenanceEventsPer10kKm:2,
      intelligenceRepairsPer10kKm:.5,
      intelligenceTrackedDistanceKm:10000,
      intelligenceEventCounts:{PMS:2}
    }));
    expect(summarizeOwnerIntelligence(rows).contributorCount).toBe(4);
    expect(summarizeOwnerIntelligence(rows).ready).toBe(false);
  });
});
