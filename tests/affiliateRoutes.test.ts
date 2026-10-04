import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/runtimeAffiliate",()=>({
  getRuntimeAffiliateLink:vi.fn().mockResolvedValue(null),
  getRuntimeShopeeAffiliateLink:vi.fn().mockResolvedValue(null)
}));
vi.mock("@/lib/db",()=>({databaseConfigured:()=>false,prisma:{outboundClickEvent:{create:vi.fn()}}}));

import { GET as affiliate } from "../app/go/affiliate/[productId]/route";
import { GET as shopee } from "../app/go/shopee/[productId]/route";

describe("affiliate redirects fail closed",()=>{
  it("returns 404 instead of inventing a generic affiliate destination",async()=>{
    const response=await affiliate(new Request("http://localhost/go/affiliate/missing"),{params:Promise.resolve({productId:"missing"})});
    expect(response.status).toBe(404);
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
  });

  it("returns 404 when a Shopee affiliate link is not explicitly configured",async()=>{
    const response=await shopee(new Request("http://localhost/go/shopee/missing"),{params:Promise.resolve({productId:"missing"})});
    expect(response.status).toBe(404);
    expect(response.headers.get("location")).toBeNull();
  });
});
