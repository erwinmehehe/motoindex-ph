import { describe, expect, it } from "vitest";
import { serviceCapabilitiesForSeller, serviceProviderKind, toServiceProvider } from "../lib/serviceCenterPolicy";
import type { SellerProfile } from "../lib/types";

function seller(overrides:Partial<SellerProfile>={}):SellerProfile{
  return {
    id:"seller-1",
    name:"Example Motors",
    slug:"example-motors",
    type:"dealer",
    city:"Angeles City",
    province:"Pampanga",
    region:"Central Luzon",
    addressLabel:"MacArthur Highway",
    description:"Checked motorcycle business record.",
    brands:["Honda"],
    categories:["Motorcycles"],
    isDemo:false,
    status:"verified",
    lastChecked:"2026-10-04",
    sourceLabel:"Official source",
    sourceUrl:"https://example.com",
    ...overrides
  };
}

describe("service center policy",()=>{
  it("requires explicit service or parts scope before treating a dealer as a service center",()=>{
    expect(serviceCapabilitiesForSeller(seller())).toEqual([]);
    expect(toServiceProvider(seller())).toBeNull();

    const dealer=seller({categories:["Motorcycles","Parts and service"]});
    expect(serviceCapabilitiesForSeller(dealer)).toContain("authorized-dealer");
    expect(serviceCapabilitiesForSeller(dealer)).toContain("general-service");
    expect(serviceProviderKind(dealer)).toBe("Authorized dealer");
  });

  it("supports independently verified service businesses without calling them authorized dealers",()=>{
    const shop=seller({
      type:"service",
      name:"Independent Moto Works",
      brands:[],
      categories:["Motorcycle repair","Tires","Suspension"],
      description:"Independent motorcycle repair workshop."
    });
    const caps=serviceCapabilitiesForSeller(shop);
    expect(caps).toContain("general-service");
    expect(caps).toContain("tires");
    expect(caps).toContain("suspension");
    expect(caps).not.toContain("authorized-dealer");
    expect(serviceProviderKind(shop)).toBe("Independent service shop");
  });

  it("supports specialty retailers only for explicitly checked categories",()=>{
    const retailer=seller({
      type:"retailer",
      categories:["Accessories"],
      description:"Motorcycle accessories retailer."
    });
    expect(serviceCapabilitiesForSeller(retailer)).toEqual(["accessories"]);
    expect(serviceProviderKind(retailer)).toBe("Specialty retailer");
  });

  it("does not infer a specialty from the business name or motorcycle brands",()=>{
    const misleading=seller({
      name:"Battery Tire Suspension Center",
      brands:["BatteryPro","TireBrand"],
      categories:["Motorcycles"],
      description:"Motorcycle sales location."
    });
    expect(serviceCapabilitiesForSeller(misleading)).toEqual([]);
  });

  it("recognizes detailing and battery scope only when explicit in checked fields",()=>{
    const shop=seller({
      type:"service",
      categories:["Battery service","Motorcycle detailing"],
      description:"Workshop with ceramic coating."
    });
    const caps=serviceCapabilitiesForSeller(shop);
    expect(caps).toContain("batteries");
    expect(caps).toContain("detailing");
  });
});
