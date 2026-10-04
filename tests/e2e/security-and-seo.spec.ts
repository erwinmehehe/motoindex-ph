import { test, expect } from "@playwright/test";

test("filtered motorcycle catalog is server-side noindex",async({request})=>{
  const filtered=await request.get("/motorcycles?make=honda");
  expect(filtered.ok()).toBeTruthy();
  expect(filtered.headers()["x-robots-tag"]).toContain("noindex");

  const clean=await request.get("/motorcycles");
  expect(clean.ok()).toBeTruthy();
  expect(clean.headers()["x-robots-tag"]||"").not.toContain("noindex");
});

test("dealer portal is private and no-store",async({request})=>{
  const response=await request.get("/dealer-portal");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["x-robots-tag"]).toContain("noindex");
  expect(response.headers()["cache-control"]).toContain("no-store");
});

test("Cloudflare Access mode rejects missing identity",async({request})=>{
  const response=await request.get("/admin");
  expect(response.status()).toBe(401);
});

test("Cloudflare Access mode accepts allowlisted edge identity",async({request})=>{
  const response=await request.get("/admin",{
    headers:{
      "cf-access-authenticated-user-email":"admin@example.com",
      "cf-access-jwt-assertion":"edge-assertion"
    }
  });
  expect(response.status()).not.toBe(401);
  expect(response.status()).not.toBe(403);
});
