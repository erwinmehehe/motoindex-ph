import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks=vi.hoisted(()=>({
  findFirst:vi.fn(), create:vi.fn(), update:vi.fn(), send:vi.fn()
}));
vi.mock("@/lib/db",()=>({
  databaseConfigured:()=>true,
  prisma:{priceAlertSubscription:{findFirst:mocks.findFirst,create:mocks.create,update:mocks.update}}
}));
vi.mock("@/lib/priceAlerts",()=>({
  priceAlertsConfigured:()=>true,
  currentModelAlertPrice:()=>({model:{id:"honda-adv-160",make:"Honda",model:"ADV160",makeSlug:"honda",slug:"adv-160"},pricePhp:165000,checkedAt:"2026-10-01"}),
  sendPriceAlertConfirmation:mocks.send
}));

import { POST } from "../app/api/price-alerts/route";

beforeEach(()=>{vi.clearAllMocks();mocks.findFirst.mockResolvedValue(null);mocks.create.mockImplementation(async({data}:any)=>({id:"sub-1",...data}));mocks.send.mockResolvedValue(undefined);});

describe("price-alert subscription",()=>{
  it("creates a pending subscription with a hash-only confirmation token",async()=>{
    const request=new Request("http://localhost/api/price-alerts",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({
      entityType:"motorcycle",entityId:"honda-adv-160",email:"buyer@example.com",targetPricePhp:160000,consent:true
    })});
    const response=await POST(request);
    expect(response.status).toBe(201);
    const createArg=mocks.create.mock.calls[0][0].data;
    expect(createArg.confirmToken).toBeNull();
    expect(createArg.confirmTokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(createArg.unsubscribeToken).toBeNull();
    expect(mocks.send).toHaveBeenCalledOnce();
  });
});
