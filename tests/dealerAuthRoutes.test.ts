import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks=vi.hoisted(()=>({
  accountFind:vi.fn(), linkCount:vi.fn(), linkDeleteMany:vi.fn(), linkCreate:vi.fn(), linkFind:vi.fn(), transaction:vi.fn(), send:vi.fn(), setCookie:vi.fn()
}));
vi.mock("@/lib/db",()=>({prisma:{
  dealerAccount:{findUnique:mocks.accountFind},
  dealerMagicLink:{count:mocks.linkCount,deleteMany:mocks.linkDeleteMany,create:mocks.linkCreate,delete:vi.fn(),findUnique:mocks.linkFind},
  $transaction:mocks.transaction
}}));
vi.mock("@/lib/dealerAuth",()=>({
  dealerAuthConfigured:()=>true,
  dealerRequestOriginAllowed:()=>true,
  dealerMagicLinkExpiry:()=>new Date(Date.now()+1200000),
  dealerToken:()=> "dealer-raw-token-abcdefghijklmnopqrstuvwxyz123456",
  hashDealerToken:(value:string)=>"hash:"+value,
  normalizeDealerEmail:(value:unknown)=>String(value||"").trim().toLowerCase(),
  validDealerEmail:(value:string)=>value.includes("@"),
  sendDealerMagicLink:mocks.send,
  dealerSessionExpiry:()=>new Date(Date.now()+86400000),
  setDealerSessionCookie:mocks.setCookie
}));

import { POST as requestLink } from "../app/api/dealer-portal/auth/request/route";
import { POST as verifyLink } from "../app/api/dealer-portal/auth/verify/[token]/route";

beforeEach(()=>{vi.clearAllMocks();mocks.linkCount.mockResolvedValue(0);mocks.linkDeleteMany.mockResolvedValue({count:0});mocks.send.mockResolvedValue(undefined);});

describe("dealer magic-link auth",()=>{
  it("does not reveal whether an unknown dealer email exists",async()=>{
    mocks.accountFind.mockResolvedValue(null);
    const response=await requestLink(new Request("http://localhost/api/dealer-portal/auth/request",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:"unknown@example.com"})}));
    expect(response.status).toBe(201);
    expect(await response.json()).toMatchObject({ok:true});
    expect(mocks.linkCreate).not.toHaveBeenCalled();
  });

  it("stores a hash, not the raw magic-link token",async()=>{
    mocks.accountFind.mockResolvedValue({id:"acct-1",memberships:[{id:"m-1"}]});
    mocks.linkCreate.mockResolvedValue({id:"link-1"});
    const response=await requestLink(new Request("http://localhost/api/dealer-portal/auth/request",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:"dealer@example.com"})}));
    expect(response.status).toBe(201);
    expect(mocks.linkCreate).toHaveBeenCalledWith({data:expect.objectContaining({accountId:"acct-1",tokenHash:"hash:dealer-raw-token-abcdefghijklmnopqrstuvwxyz123456"})});
    expect(mocks.send).toHaveBeenCalledWith("dealer@example.com","dealer-raw-token-abcdefghijklmnopqrstuvwxyz123456");
  });

  it("consumes a magic link once and creates a hashed session",async()=>{
    mocks.linkFind.mockResolvedValue({id:"link-1",accountId:"acct-1",usedAt:null,expiresAt:new Date(Date.now()+60000)});
    const sessionCreate=vi.fn().mockResolvedValue({});
    mocks.transaction.mockImplementation(async(fn:(tx:any)=>Promise<any>)=>fn({
      dealerMagicLink:{updateMany:vi.fn().mockResolvedValue({count:1})},
      dealerAccount:{update:vi.fn().mockResolvedValue({})},
      dealerSession:{create:sessionCreate}
    }));
    const response=await verifyLink(new Request("http://localhost/api/dealer-portal/auth/verify/token",{method:"POST"}),{params:Promise.resolve({token:"magic-token"})});
    expect(response.status).toBe(200);
    expect(sessionCreate).toHaveBeenCalledWith({data:expect.objectContaining({accountId:"acct-1",tokenHash:"hash:dealer-raw-token-abcdefghijklmnopqrstuvwxyz123456"})});
    expect(mocks.setCookie).toHaveBeenCalled();
  });
});
