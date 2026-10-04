import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks=vi.hoisted(()=>({
  findMany:vi.fn(), updateMany:vi.fn(), update:vi.fn()
}));
vi.mock("@/lib/db",()=>({
  databaseConfigured:()=>true,
  prisma:{priceAlertSubscription:{findMany:mocks.findMany,updateMany:mocks.updateMany,update:mocks.update}}
}));
vi.mock("@/lib/data",()=>({getModelById:()=>({id:"honda-adv-160",make:"Honda",model:"ADV160",makeSlug:"honda",slug:"adv-160",verifiedAt:"2026-10-01",marketStatus:"current"})}));
vi.mock("@/lib/marketChecks",()=>({observedMarketRange:()=>({from:155000})}));
vi.mock("@/lib/site",()=>({absoluteUrl:(path:string)=>"https://motoindex.test"+path}));
vi.mock("@/lib/utils",()=>({php:(value:number)=>"PHP "+value}));

import { runPriceAlertCheck } from "../lib/priceAlerts";

beforeEach(()=>{
  vi.clearAllMocks();
  process.env.PRICE_ALERTS_ENABLED="true";
  process.env.PRICE_ALERT_CRON_CONFIGURED="true";
  process.env.RESEND_API_KEY="test";
  process.env.PRICE_ALERT_FROM_EMAIL="alerts@example.com";
  process.env.PRICE_ALERT_CRON_SECRET="secret";
  process.env.DATABASE_URL="postgres://test";
  mocks.findMany.mockResolvedValue([{
    id:"sub-1",entityId:"honda-adv-160",email:"buyer@example.com",targetPricePhp:160000,
    thresholdWasMet:false,unsubscribeToken:null,status:"active",confirmedAt:new Date(),updatedAt:new Date()
  }]);
  mocks.updateMany.mockResolvedValue({count:1});
  mocks.update.mockResolvedValue({});
  vi.stubGlobal("fetch",vi.fn().mockResolvedValue(new Response("",{status:200})));
});

describe("price-alert threshold checker",()=>{
  it("atomically claims the threshold and stores only a hashed unsubscribe token",async()=>{
    const result=await runPriceAlertCheck(10);
    expect(result).toMatchObject({checked:1,sent:1,errors:0});
    const claim=mocks.updateMany.mock.calls[0][0];
    expect(claim.where).toMatchObject({id:"sub-1",status:"active",thresholdWasMet:false});
    expect(claim.data.unsubscribeToken).toBeNull();
    expect(claim.data.unsubscribeTokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(mocks.update).toHaveBeenCalledWith({where:{id:"sub-1"},data:expect.objectContaining({lastSentAt:expect.any(Date)})});
  });
});
