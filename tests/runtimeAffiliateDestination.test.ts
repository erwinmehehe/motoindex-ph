import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks=vi.hoisted(()=>({ findUnique:vi.fn() }));
vi.mock("@/lib/db",()=>({
  databaseConfigured:()=>true,
  prisma:{affiliateProductLink:{findUnique:mocks.findUnique}}
}));

import { getRuntimeAffiliateLinks } from "../lib/runtimeAffiliate";

const productId="gille-kerena-ff007";
const source="https://shopee.ph/product/505955057/25840894725";

beforeEach(()=>{vi.clearAllMocks();});

describe("safe runtime affiliate destination precedence",()=>{
  it("blocks an old active merchant shortlink with no product proof",async()=>{
    mocks.findUnique.mockResolvedValue({productId,merchant:"shopee",status:"active",url:"https://invl.me/clo1b14",destinationUrl:null});
    expect(await getRuntimeAffiliateLinks(productId)).toEqual([]);
  });

  it("blocks an unknown network shortlink without item evidence",async()=>{
    mocks.findUnique.mockResolvedValue({productId,merchant:"shopee",status:"active",url:"https://invl.me/some-opaque-short",destinationUrl:null});
    expect(await getRuntimeAffiliateLinks(productId)).toEqual([]);
  });

  it("honors explicit admin disable records",async()=>{
    mocks.findUnique.mockResolvedValue({productId,merchant:"shopee",status:"disabled",url:source,destinationUrl:source});
    expect(await getRuntimeAffiliateLinks(productId)).toEqual([]);
  });

  it("accepts an Involve Asia tracked link with an exact inspected source",async()=>{
    mocks.findUnique.mockResolvedValue({productId,merchant:"shopee",status:"active",url:"https://invl.me/checked-gille-link",destinationUrl:source});
    const offers=await getRuntimeAffiliateLinks(productId);
    expect(offers).toHaveLength(1);
    expect(offers[0].network).toBe("involve_asia");
    expect(offers[0].destinationUrl).toBe(source);
  });
});
