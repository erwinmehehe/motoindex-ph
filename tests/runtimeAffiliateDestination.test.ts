import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks=vi.hoisted(()=>({ findUnique:vi.fn(), findFirst:vi.fn() }));
vi.mock("@/lib/db",()=>({
  databaseConfigured:()=>true,
  prisma:{affiliateProductLink:{findUnique:mocks.findUnique,findFirst:mocks.findFirst}}
}));

import { getRuntimeAffiliateLinks } from "../lib/runtimeAffiliate";

const productId="gille-kerena-ff007";
const source="https://shopee.ph/product/505955057/25840894725";

beforeEach(()=>{vi.clearAllMocks();mocks.findFirst.mockResolvedValue(null);});
afterEach(()=>vi.unstubAllEnvs());

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

  it("refuses a pre-existing duplicate active item URL at runtime",async()=>{
    mocks.findUnique.mockResolvedValue({productId,merchant:"shopee",status:"active",url:"https://invl.me/checked-gille-link",destinationUrl:source});
    mocks.findFirst.mockResolvedValue({productId:"spyder-surge-v2"});
    expect(await getRuntimeAffiliateLinks(productId)).toEqual([]);
  });
  it("queries both DB columns with tracking and exact-item values before publishing an offer",async()=>{
    const tracked="https://invl.me/checked-gille-link";
    mocks.findUnique.mockResolvedValue({productId,merchant:"shopee",status:"active",url:tracked,destinationUrl:source});
    expect(await getRuntimeAffiliateLinks(productId)).toHaveLength(1);
    expect(mocks.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where:expect.objectContaining({
        OR:[{url:{in:[tracked,source]}},{destinationUrl:{in:[tracked,source]}}]
      })
    }));
  });

  it("accepts an Involve Asia tracked link with an exact inspected source",async()=>{
    mocks.findUnique.mockResolvedValue({productId,merchant:"shopee",status:"active",url:"https://invl.me/checked-gille-link",destinationUrl:source});
    const offers=await getRuntimeAffiliateLinks(productId);
    expect(offers).toHaveLength(1);
    expect(offers[0].network).toBe("involve_asia");
    expect(offers[0].destinationUrl).toBe(source);
  });
  it("rejects a database offer colliding with another product in configured fallbacks", async () => {
    vi.stubEnv("AFFILIATE_LINKS_JSON", JSON.stringify({
      "spyder-surge-v2": {
        merchant: "shopee", network: "involve_asia",
        url: "https://invl.me/spider-unique-token",
        destinationUrl: source
      }
    }));
    mocks.findUnique.mockResolvedValue({
      productId, merchant: "shopee", status: "active",
      url: "https://invl.me/database-gille-token", destinationUrl: source
    });
    expect(await getRuntimeAffiliateLinks(productId)).toEqual([]);
    expect(mocks.findFirst).not.toHaveBeenCalled();
  });

});
