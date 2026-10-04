import { test, expect } from "@playwright/test";

test("clean motorcycle hub remains indexable while filtered states are server-side noindex",async({request})=>{
  const clean=await request.get("/motorcycles");
  expect(clean.ok()).toBeTruthy();
  expect(clean.headers()["x-robots-tag"]||"").not.toContain("noindex");

  const filtered=await request.get("/motorcycles?make=honda");
  expect(filtered.ok()).toBeTruthy();
  expect(filtered.headers()["x-robots-tag"]).toContain("noindex");
  expect(filtered.headers()["x-robots-tag"]).toContain("follow");
});

test("dealer portal is private even when the feature is disabled",async({request})=>{
  const response=await request.get("/dealer-portal");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(response.headers()["x-robots-tag"]).toContain("noindex");
});

test("admin surface fails closed when production credentials are absent",async({request})=>{
  const response=await request.get("/admin");
  expect([401,403,503]).toContain(response.status());
  expect(response.headers()["x-robots-tag"]).toContain("noindex");
});
