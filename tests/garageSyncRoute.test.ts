import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks=vi.hoisted(()=>({
  session:vi.fn(),
  snapshotFind:vi.fn(),
  snapshotCreate:vi.fn(),
  snapshotUpdateMany:vi.fn(),
  reminderSync:vi.fn()
}));
vi.mock("@/lib/db",()=>({prisma:{garageSnapshot:{findUnique:mocks.snapshotFind,create:mocks.snapshotCreate,updateMany:mocks.snapshotUpdateMany}}}));
vi.mock("@/lib/ownerAuth",()=>({
  ownerAuthConfigured:()=>true,
  ownerRequestOriginAllowed:()=>true,
  getOwnerSession:mocks.session
}));
vi.mock("@/lib/garage",()=>({parseGarageState:()=>({motorcycles:[],records:[],documents:[]})}));
vi.mock("@/lib/garageReminders",()=>({syncOwnerGarageReminders:mocks.reminderSync}));

import { GET, PUT } from "../app/api/garage/sync/route";

beforeEach(()=>{vi.clearAllMocks();mocks.reminderSync.mockResolvedValue(0);});

describe("Garage cloud sync",()=>{
  it("requires an authenticated owner",async()=>{
    mocks.session.mockResolvedValue(null);
    const response=await GET();
    expect(response.status).toBe(401);
  });

  it("rejects stale revision writes instead of overwriting another device",async()=>{
    mocks.session.mockResolvedValue({ownerId:"owner-1"});
    mocks.snapshotFind.mockResolvedValue({revision:3,updatedAt:new Date(),payload:{}});
    const request=new Request("http://localhost/api/garage/sync",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify({
      revision:2,payload:{motorcycles:[],records:[],documents:[]}
    })});
    const response=await PUT(request);
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ok:false,conflict:true,revision:3});
    expect(mocks.snapshotUpdateMany).not.toHaveBeenCalled();
  });

  it("creates the first private cloud snapshot at revision one",async()=>{
    mocks.session.mockResolvedValue({ownerId:"owner-1"});
    mocks.snapshotFind.mockResolvedValue(null);
    mocks.snapshotCreate.mockResolvedValue({revision:1,updatedAt:new Date()});
    const request=new Request("http://localhost/api/garage/sync",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify({
      revision:0,payload:{motorcycles:[],records:[],documents:[]}
    })});
    const response=await PUT(request);
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ok:true,revision:1});
    expect(mocks.snapshotCreate).toHaveBeenCalled();
  });
});
