import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks=vi.hoisted(()=>({
  find:vi.fn(), update:vi.fn()
}));
vi.mock("@/lib/db",()=>({
  databaseConfigured:()=>true,
  prisma:{priceAlertSubscription:{findFirst:mocks.find,update:mocks.update}}
}));
vi.mock("@/lib/actionTokens",()=>({hashActionToken:(token:string)=>"hash:"+token}));

import { POST as confirm } from "../app/api/price-alerts/confirm/[token]/route";
import { POST as unsubscribe } from "../app/api/price-alerts/unsubscribe/[token]/route";

beforeEach(()=>vi.clearAllMocks());

describe("price-alert action lifecycle",()=>{
  it("confirms through the hashed token and clears the confirmation secret",async()=>{
    mocks.find.mockResolvedValue({id:"sub-1",status:"pending",updatedAt:new Date()});
    mocks.update.mockResolvedValue({});
    const response=await confirm(new Request("http://localhost/api/price-alerts/confirm/raw",{method:"POST"}),{params:Promise.resolve({token:"raw"})});
    expect(response.status).toBe(200);
    expect(mocks.find).toHaveBeenCalledWith({where:{OR:[{confirmTokenHash:"hash:raw"},{confirmToken:"raw"}]}});
    expect(mocks.update).toHaveBeenCalledWith({where:{id:"sub-1"},data:expect.objectContaining({status:"active",confirmToken:null,confirmTokenHash:null})});
  });

  it("unsubscribes through the hash and destroys all action-token material",async()=>{
    mocks.find.mockResolvedValue({id:"sub-1",status:"active"});
    mocks.update.mockResolvedValue({});
    const response=await unsubscribe(new Request("http://localhost/api/price-alerts/unsubscribe/raw",{method:"POST"}),{params:Promise.resolve({token:"raw"})});
    expect(response.status).toBe(200);
    expect(mocks.find).toHaveBeenCalledWith({where:{OR:[{unsubscribeTokenHash:"hash:raw"},{unsubscribeToken:"raw"}]}});
    expect(mocks.update).toHaveBeenCalledWith({where:{id:"sub-1"},data:expect.objectContaining({
      status:"unsubscribed",confirmToken:null,confirmTokenHash:null,unsubscribeToken:null,unsubscribeTokenHash:null
    })});
  });
});
