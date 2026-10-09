import { expect, test } from "@playwright/test";

const modelPath = "/motorcycles/yamaha/nmax-v3";

test("NMAX V3 redesign keeps canonical SEO, product schema, FAQ and research sections", async ({ page }) => {
  const response = await page.goto(modelPath);
  expect(response?.status()).toBe(200);
  await expect(page.locator(".nmax-v3-showcase")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("NMAX V3");

  await expect(page).toHaveTitle(/NMAX V3/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/motorcycles\/yamaha\/nmax-v3\/?$/);
  const meta = await page.locator('meta[name="description"]').getAttribute("content");
  expect(meta).toMatch(/NMAX V3/i);

  for (const section of ["overview", "price", "specs", "installment", "rider-fit", "ownership", "alternatives", "faq"]) {
    await expect(page.locator(`#${section}`), `Missing indexed section ${section}`).toHaveCount(1);
  }
  await expect(page.locator(".reviewed-model-intro .breadcrumbs a")).toHaveCount(3);
  await expect(page.locator(".motorcycle-entity-nav-wrap a[href='#price']")).toBeVisible();
  await expect(page.locator(".motorcycle-entity-nav-wrap a[href='#installment']")).toBeVisible();
  await expect(page.locator(".reviewed-model-stage .reviewed-model-photo")).toBeVisible();

  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  const records = schemas.flatMap((value) => {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [];
    }
  });
  expect(records.some((item) => item?.["@type"] === "Product" && /NMAX V3/.test(String(item.name)))).toBe(true);
  expect(records.some((item) => item?.["@type"] === "FAQPage")).toBe(true);
  expect(records.some((item) => item?.["@type"] === "BreadcrumbList")).toBe(true);
});

for (const width of [390, 768, 1440]) {
  test(`NMAX V3 redesign displays at ${width}px without clipping model imagery or the page`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(modelPath);
    expect(response?.status()).toBe(200);
    await expect(page.locator(".nmax-v3-showcase .reviewed-model-hero")).toBeVisible();
    await expect(page.locator(".nmax-v3-showcase .reviewed-model-stage .reviewed-model-photo")).toBeVisible();
    const result = await page.evaluate(() => {
      const stage = document.querySelector(".nmax-v3-showcase .reviewed-model-stage");
      const image = stage?.querySelector<HTMLImageElement>(".reviewed-model-photo");
      const root = document.documentElement;
      return {
        overflow: Math.max(0, root.scrollWidth - root.clientWidth),
        stageWidth: stage?.getBoundingClientRect().width || 0,
        stageHeight: stage?.getBoundingClientRect().height || 0,
        imageFit: image ? getComputedStyle(image).objectFit : "",
        imageLoaded: Boolean(image?.complete && image.naturalWidth > 0),
        navCount: document.querySelectorAll(".nmax-v3-showcase .product-entity-nav a").length
      };
    });
    expect(result.overflow).toBeLessThanOrEqual(4);
    expect(result.stageWidth).toBeGreaterThan(250);
    expect(result.stageHeight).toBeGreaterThan(210);
    expect(result.imageFit).toBe("contain");
    expect(result.imageLoaded).toBe(true);
    expect(result.navCount).toBeGreaterThan(5);
  });
}

test("NMAX redesign does not change the Aerox V3 shared model template", async ({ page }) => {
  await page.goto("/motorcycles/yamaha/aerox-v3");
  await expect(page.locator(".nmax-v3-showcase")).toHaveCount(0);
  await expect(page.locator(".reviewed-model-hero")).toBeVisible();
});
