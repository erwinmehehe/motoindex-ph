import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks=vi.hoisted(()=>({
  upsert:vi.fn(), update:vi.fn(), findUnique:vi.fn(), transaction:vi.fn()
}));
vi.mock("@/lib/db",()=>({
  databaseConfigured:()=>true,
  prisma:{
    affiliateProductLink:{upsert:mocks.upsert,update:mocks.update,findUnique:mocks.findUnique},
    $transaction:mocks.transaction
  }
}));

import { PUT } from "../app/api/admin/affiliate-links/[productId]/route";
import { POST } from "../app/api/admin/affiliate-links/bulk/route";

const target="https://shopee.ph/product/505955057/25840894725";
const short="https://invl.me/custom-gille-ff007-short";
const request=(body:object)=>new Request("https://motoindexph.com/api/admin/affiliate-links/gille-kerena-ff007",{
  method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify(body)
});

beforeEach(()=>{
  vi.clearAllMocks();
  mocks.findUnique.mockResolvedValue(null);
  mocks.upsert.mockImplementation(async(args:any)=>({productId:args.where.productId,merchant:"shopee",network:"involve_asia",status:"active",approvedAt:new Date()}));
  mocks.transaction.mockResolvedValue([]);
});

describe("exact-item affiliate admin approval",()=>{
  it("rejects a new opaque tracked link when its item destination is absent",async()=>{
    const res=await PUT(request({url:short,status:"active",reviewNote:"Checked exact FF007 item"}),{params:Promise.resolve({productId:"gille-kerena-ff007"})});
    expect(res.status).toBe(400);
    expect(mocks.upsert).not.toHaveBeenCalled();
  });
  it("persists reviewed exact product destinations for active shortlinks",async()=>{
    const res=await PUT(request({url:short,destinationUrl:target,status:"active",reviewNote:"Checked exact FF007 item"}),{params:Promise.resolve({productId:"gille-kerena-ff007"})});
    expect(res.status).toBe(200);
    expect(mocks.upsert).toHaveBeenCalledOnce();
    const args=mocks.upsert.mock.calls[0][0];
    expect(args.create.destinationUrl).toBe(target);
    expect(args.update.destinationUrl).toBe(target);
  });
  it("allows an obsolete generic tracking link to be disabled without reapproval",async()=>{
    mocks.findUnique.mockResolvedValue({productId:"gille-kerena-ff007",url:"https://invl.me/clo1b14",network:"involve_asia",merchant:"shopee",status:"active"});
    mocks.update.mockResolvedValue({productId:"gille-kerena-ff007",merchant:"shopee",network:"involve_asia",status:"disabled"});
    const res=await PUT(request({url:"https://invl.me/clo1b14",status:"disabled",reviewNote:"Disable old generic shortcut"}),{params:Promise.resolve({productId:"gille-kerena-ff007"})});
    expect(res.status).toBe(200);
    expect(mocks.update.mock.calls[0][0].data.status).toBe("disabled");
  });
  it("rejects bulk tracked links without an exact verified item URL",async()=>{
    const res=await POST(new Request("https://motoindexph.com/api/admin/affiliate-links/bulk",{
      method:"POST",headers:{"content-type":"application/json"},
      body:JSON.stringify({rows:[{productId:"gille-kerena-ff007",url:short,reviewNote:"Checked shortlink"}]})
    }));
    expect(res.status).toBe(400);
    expect(mocks.transaction).not.toHaveBeenCalled();
  });
  it("allows bulk tracked URLs after a verified destination is recorded",async()=>{
    const res=await POST(new Request("https://motoindexph.com/api/admin/affiliate-links/bulk",{
      method:"POST",headers:{"content-type":"application/json"},
      body:JSON.stringify({rows:[{productId:"gille-kerena-ff007",url:short,destinationUrl:target,reviewNote:"Checked Gille item"}]})
    }));
    expect(res.status).toBe(200);
    expect(mocks.transaction).toHaveBeenCalledOnce();
  });
});
