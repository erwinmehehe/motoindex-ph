import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks=vi.hoisted(()=>({
  session:vi.fn(),
  snapshotFind:vi.fn(),
  reviewFindMany:vi.fn(),
  reviewUpsert:vi.fn(),
  reviewDeleteMany:vi.fn()
}));

vi.mock("@/lib/db",()=>({
  databaseConfigured:()=>true,
  prisma:{
    garageSnapshot:{findUnique:mocks.snapshotFind},
    ownerReview:{findMany:mocks.reviewFindMany,upsert:mocks.reviewUpsert,deleteMany:mocks.reviewDeleteMany}
  }
}));
vi.mock("@/lib/ownerAuth",()=>({
  ownerRequestOriginAllowed:()=>true,
  getOwnerSession:mocks.session
}));
vi.mock("@/lib/data",()=>({
  getModelById:(id:string)=>id==="model-1"?{id:"model-1",make:"Honda",model:"Test"}:undefined
}));

import { DELETE, GET, POST } from "../app/api/owner-reviews/route";

beforeEach(()=>{
  vi.clearAllMocks();
  process.env.OWNER_REVIEWS_ENABLED="true";
  mocks.session.mockResolvedValue({ownerId:"owner-1"});
  mocks.reviewFindMany.mockResolvedValue([]);
});

describe("owner review route",()=>{
  it("requires an authenticated Garage account",async()=>{
    mocks.session.mockResolvedValue(null);
    const response=await GET();
    expect(response.status).toBe(401);
  });

  it("rejects a review for a motorcycle not present in the synced Garage",async()=>{
    mocks.snapshotFind.mockResolvedValue({payload:{version:1,motorcycles:[],records:[],documents:[]}});
    const response=await POST(new Request("http://localhost/api/owner-reviews",{
      method:"POST",headers:{"content-type":"application/json"},
      body:JSON.stringify({garageMotorcycleLocalId:"bike-1"})
    }));
    expect(response.status).toBe(400);
    expect(mocks.reviewUpsert).not.toHaveBeenCalled();
  });

  it("lets the owner delete a review by review ID even after Garage membership changes",async()=>{
    mocks.reviewDeleteMany.mockResolvedValue({count:1});
    const response=await DELETE(new Request("http://localhost/api/owner-reviews",{
      method:"DELETE",headers:{"content-type":"application/json"},
      body:JSON.stringify({reviewId:"review-1"})
    }));
    expect(response.status).toBe(200);
    expect(mocks.reviewDeleteMany).toHaveBeenCalledWith({
      where:{ownerId:"owner-1",id:"review-1"}
    });
  });

  it("creates a pending review from the synced Garage motorcycle and trusted odometer",async()=>{
    mocks.snapshotFind.mockResolvedValue({payload:{version:1,motorcycles:[{
      id:"bike-1",catalogModelId:"model-1",make:"Honda",model:"Test",variant:"ABS",year:2026,
      purchaseDate:"2026-01-01",odometerKm:4321,createdAt:"2026-01-01",updatedAt:"2026-10-01"
    }],records:[],documents:[]}});
    mocks.reviewUpsert.mockResolvedValue({id:"review-1"});
    const response=await POST(new Request("http://localhost/api/owner-reviews",{
      method:"POST",headers:{"content-type":"application/json"},
      body:JSON.stringify({
        garageMotorcycleLocalId:"bike-1",
        comfortRating:4,cityTrafficRating:5,maintenanceRating:4,passengerRating:3,highwayRating:4,
        fuelEconomyKmpl:42,annualMaintenancePhp:9000,unscheduledRepairsCount:1,publishConsent:"yes",
        summary:"After several months of daily use, this motorcycle has been predictable in traffic and straightforward to maintain.",
        likes:"Easy low-speed control and practical fuel use.",
        dislikes:"Storage and passenger space could be better.",
        odometerKm:999999
      })
    }));
    expect(response.status).toBe(201);
    expect(mocks.reviewUpsert).toHaveBeenCalledWith(expect.objectContaining({
      where:{ownerId_modelExternalId:{ownerId:"owner-1",modelExternalId:"model-1"}},
      create:expect.objectContaining({
        modelExternalId:"model-1",garageMotorcycleLocalId:"bike-1",odometerKm:4321,status:"pending",
        intelligenceConsentedAt:null,
        intelligenceMonthlyRunningCostPhp:null,
        intelligenceAnnualMaintenancePhp:null
      })
    }));
  });
});
