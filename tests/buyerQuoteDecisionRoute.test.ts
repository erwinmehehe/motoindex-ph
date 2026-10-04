import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks=vi.hoisted(()=>({
  leadFind:vi.fn(), quoteFind:vi.fn(), transaction:vi.fn(), quoteUpdate:vi.fn(), leadUpdate:vi.fn()
}));
vi.mock("@/lib/db",()=>({
  databaseConfigured:()=>true,
  prisma:{
    dealerLead:{findFirst:mocks.leadFind,update:mocks.leadUpdate},
    dealerQuoteResponse:{findFirst:mocks.quoteFind,update:mocks.quoteUpdate},
    $transaction:mocks.transaction
  }
}));
vi.mock("@/lib/actionTokens",()=>({hashActionToken:(token:string)=>"hash:"+token}));

import { PATCH } from "../app/api/quote-status/[token]/quotes/[quoteId]/route";

beforeEach(()=>{
  vi.clearAllMocks();
  mocks.leadFind.mockResolvedValue({id:"lead-1",buyerAccessExpiresAt:new Date(Date.now()+86400000)});
  mocks.quoteFind.mockResolvedValue({id:"quote-1"});
  mocks.transaction.mockResolvedValue([]);
});

describe("buyer quote decisions",()=>{
  it("looks up the private buyer link by hash and records an interested signal",async()=>{
    const request=new Request("http://localhost/api/quote-status/raw/quotes/quote-1",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({decision:"interested"})});
    const response=await PATCH(request,{params:Promise.resolve({token:"raw",quoteId:"quote-1"})});
    expect(response.status).toBe(200);
    expect(mocks.leadFind).toHaveBeenCalledWith({where:{OR:[{buyerAccessTokenHash:"hash:raw"},{buyerAccessToken:"raw"}]},select:{id:true,buyerAccessExpiresAt:true}});
    expect(mocks.transaction).toHaveBeenCalled();
  });

  it("rejects a quote that is not part of the buyer's lead",async()=>{
    mocks.quoteFind.mockResolvedValue(null);
    const request=new Request("http://localhost/api/quote-status/raw/quotes/other",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({decision:"interested"})});
    const response=await PATCH(request,{params:Promise.resolve({token:"raw",quoteId:"other"})});
    expect(response.status).toBe(404);
    expect(mocks.transaction).not.toHaveBeenCalled();
  });
});
