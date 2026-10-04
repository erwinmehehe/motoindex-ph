import { test, expect } from "@playwright/test";

test("filtered motorcycle catalog is server-side noindex",async({request})=>{
  const filtered=await request.get("/motorcycles?make=honda");
  expect(filtered.ok()).toBeTruthy();
  expect(filtered.headers()["x-robots-tag"]).toContain("noindex");

  const clean=await request.get("/motorcycles");
  expect(clean.ok()).toBeTruthy();
  expect(clean.headers()["x-robots-tag"]||"").not.toContain("noindex");
});

test("Dealer Portal is private even when disabled",async({page})=>{
  const response=await page.goto("/dealer-portal");
  expect(response).not.toBeNull();
  expect(response!.headers()["x-robots-tag"]).toContain("noindex");
  await expect(page.getByRole("heading",{name:/Manage dealer inventory and buyer requests/i})).toBeVisible();
});

test("quote page fails closed without an approved receiver",async({page})=>{
  await page.goto("/get-quote/honda/adv-160");
  await expect(page.getByText(/No approved quote receiver is active/i)).toBeVisible();
  await expect(page.getByRole("link",{name:/Browse Honda dealers/i})).toBeVisible();
});
