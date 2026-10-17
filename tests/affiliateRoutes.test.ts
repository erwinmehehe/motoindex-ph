import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/runtimeAffiliate",()=>({
  getRuntimeAffiliateLink:vi.fn().mockResolvedValue(null),
  getRuntimeShopeeAffiliateLink:vi.fn().mockResolvedValue(null),
  getRuntimeAffiliateLinks:vi.fn().mockResolvedValue([])
}));
vi.mock("@/lib/db",()=>({databaseConfigured:()=>false,prisma:{outboundClickEvent:{create:vi.fn()}}}));

import { GET as affiliate } from "../app/go/affiliate/[productId]/route";
import { GET as shopee } from "../app/go/shopee/[productId]/route";
import { GET as marketplace } from "../app/go/affiliate/[productId]/[merchant]/route";
import { GET as publicStatus } from "../app/api/affiliate-links/[productId]/route";

const request = (path: string) => new Request("http://localhost" + path);

describe("catalog product destinations",()=>{
  it("never invents a destination for an unknown catalog product",async()=>{
    const response=await affiliate(request("/go/affiliate/missing"),{params:Promise.resolve({productId:"missing"})});
    expect(response.status).toBe(404);
    expect(response.headers.get("location")).toBeNull();
  });

  it("keeps old FF007 Shopee redirect bookmarks working as direct product-source links",async()=>{
    const result=await marketplace(request("/go/affiliate/gille-kerena-ff007/shopee"),{params:Promise.resolve({productId:"gille-kerena-ff007",merchant:"shopee"})});
    expect(result.status).toBe(302);
    expect(result.headers.get("location")).toContain("-i.505955057.25840894725");
    expect(result.headers.get("X-MotoIndex-Link-Type")).toBe("non-affiliate-product-source");
    expect(result.headers.get("Cache-Control")).toBe("no-store");
  });

  it("does not pretend a missing Lazada product link points to the item",async()=>{
    const result=await marketplace(request("/go/affiliate/gille-kerena-ff007/lazada"),{params:Promise.resolve({productId:"gille-kerena-ff007",merchant:"lazada"})});
    expect(result.status).toBe(404);
    expect(result.headers.get("location")).toBeNull();
  });

  it("also preserves the legacy Shopee and generic affiliate paths",async()=>{
    const a=await affiliate(request("/go/affiliate/gille-kerena-ff007"),{params:Promise.resolve({productId:"gille-kerena-ff007"})});
    const b=await shopee(request("/go/shopee/gille-kerena-ff007"),{params:Promise.resolve({productId:"gille-kerena-ff007"})});
    expect(a.status).toBe(302);
    expect(b.status).toBe(302);
    expect(a.headers.get("location")).toBe(b.headers.get("location"));
  });

  it("describes an exact editorial source, not a commission link, through the public status API",async()=>{
    const response=await publicStatus(request("/api/affiliate-links/gille-kerena-ff007"),{params:Promise.resolve({productId:"gille-kerena-ff007"})});
    expect(response.status).toBe(200);
    const body=await response.json();
    expect(body.active).toBe(false);
    expect(body.sourceListing.url).toContain("-i.505955057.25840894725");
    expect(body.sourceListing.merchant).toBe("shopee");
  });
});
