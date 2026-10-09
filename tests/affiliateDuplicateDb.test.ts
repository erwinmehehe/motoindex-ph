import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks=vi.hoisted(()=>({
  findUnique:vi.fn(),findFirst:vi.fn(),findMany:vi.fn(),upsert:vi.fn(),transaction:vi.fn()
}));
vi.mock("@/lib/db",()=>({
  databaseConfigured:()=>true,
  prisma:{
    affiliateProductLink:{
      findUnique:mocks.findUnique,findFirst:mocks.findFirst,findMany:mocks.findMany,upsert:mocks.upsert
    },
    $transaction:mocks.transaction
  }
}));

import { getRuntimeAffiliateLinks } from "../lib/runtimeAffiliate";
import { PUT } from "../app/api/admin/affiliate-links/[productId]/route";
import { POST } from "../app/api/admin/affiliate-links/bulk/route";

const id="gille-kerena-ff007";
const exact="https://shopee.ph/product/505955057/25840894725";
const asPut=(url:string)=>new Request("https://motoindexph.com/api/admin/affiliate-links/"+id,{
  method:"PUT",headers:{"content-type":"application/json"},
  body:JSON.stringify({url,status:"active",reviewNote:"Checked exact Gille model and seller"})
});
const asBulk=(rows:object[])=>new Request("https://motoindexph.com/api/admin/affiliate-links/bulk",{
  method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({rows})
});

beforeEach(()=>{
  vi.clearAllMocks();
  mocks.findFirst.mockResolvedValue(null);
  mocks.findUnique.mockResolvedValue(null);
  mocks.findMany.mockResolvedValue([]);
  mocks.upsert.mockImplementation(async (args)=>({productId:args.where.productId,merchant:"shopee",network:"shopee_direct",status:"active",approvedAt:new Date()}));
  mocks.transaction.mockResolvedValue([]);
});

describe("database-backed affiliate mapping uniqueness",()=>{
  it("does not redirect with an active reused network or item URL",async()=>{
    mocks.findUnique.mockResolvedValue({productId:id,url:exact,merchant:"shopee",status:"active"});
    mocks.findFirst.mockResolvedValue({productId:"spyder-surge-v2"});
    expect(await getRuntimeAffiliateLinks(id)).toEqual([]);
  });

  it("refuses an admin mapping already assigned to another product",async()=>{
    mocks.findFirst.mockResolvedValue({productId:"spyder-surge-v2"});
    const response=await PUT(asPut(exact),{params:Promise.resolve({productId:id})});
    expect(response.status).toBe(409);
    expect(mocks.upsert).not.toHaveBeenCalled();
  });

  it("refuses the same URL for two different products within one bulk import",async()=>{
    const response=await POST(asBulk([
      {productId:id,url:exact,reviewNote:"Checked exact Gille item"},
      {productId:"spyder-surge-v2",url:exact,reviewNote:"Checked wrong duplicate"}
    ]));
    expect(response.status).toBe(400);
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("refuses a bulk import conflicting with an existing active product",async()=>{
    mocks.findMany.mockResolvedValue([{productId:"spyder-surge-v2",url:exact}]);
    const response=await POST(asBulk([{productId:id,url:exact,reviewNote:"Reviewed Gille source"}]));
    expect(response.status).toBe(409);
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("accepts a distinct direct Shopee item only when no other product uses it",async()=>{
    const response=await PUT(asPut(exact),{params:Promise.resolve({productId:id})});
    expect(response.status).toBe(200);
    expect(mocks.upsert).toHaveBeenCalledOnce();
  });
});
