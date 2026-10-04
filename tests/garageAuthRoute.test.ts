import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks=vi.hoisted(()=>({
  ownerUpsert:vi.fn(), count:vi.fn(), deleteMany:vi.fn(), create:vi.fn(), send:vi.fn()
}));
vi.mock("@/lib/db",()=>({prisma:{
  ownerAccount:{upsert:mocks.ownerUpsert},
  ownerMagicLink:{count:mocks.count,deleteMany:mocks.deleteMany,create:mocks.create,delete:vi.fn()}
}}));
vi.mock("@/lib/ownerAuth",()=>({
  ownerAuthConfigured:()=>true,
  ownerRequestOriginAllowed:()=>true,
  normalizeOwnerEmail:(value:unknown)=>String(value||"").trim().toLowerCase(),
  validOwnerEmail:(value:string)=>value.includes("@"),
  ownerToken:()=> "owner-raw-token-abcdefghijklmnopqrstuvwxyz123456",
  hashOwnerToken:(value:string)=>"hash:"+value,
  ownerMagicLinkExpiry:()=>new Date(Date.now()+1200000),
  sendOwnerMagicLink:mocks.send
}));

import { POST } from "../app/api/garage/auth/request/route";

beforeEach(()=>{
  vi.clearAllMocks();
  mocks.ownerUpsert.mockResolvedValue({id:"owner-1"});
  mocks.count.mockResolvedValue(0);
  mocks.deleteMany.mockResolvedValue({count:0});
  mocks.create.mockResolvedValue({id:"link-1"});
  mocks.send.mockResolvedValue(undefined);
});

describe("Garage magic-link auth",()=>{
  it("persists only the token hash before emailing the raw one",async()=>{
    const request=new Request("http://localhost/api/garage/auth/request",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:"Owner@Example.com"})});
    const response=await POST(request);
    expect(response.status).toBe(201);
    expect(mocks.create).toHaveBeenCalledWith({data:expect.objectContaining({
      ownerId:"owner-1",tokenHash:"hash:owner-raw-token-abcdefghijklmnopqrstuvwxyz123456"
    })});
    expect(mocks.send).toHaveBeenCalledWith("owner@example.com","owner-raw-token-abcdefghijklmnopqrstuvwxyz123456");
  });

  it("rate-limits repeated sign-in email requests",async()=>{
    mocks.count.mockResolvedValue(3);
    const request=new Request("http://localhost/api/garage/auth/request",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:"owner@example.com"})});
    const response=await POST(request);
    expect(response.status).toBe(429);
    expect(mocks.create).not.toHaveBeenCalled();
  });
});
