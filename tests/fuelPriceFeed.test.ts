import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import seed from "../data/fuel-price-adjustments.seed.json";
import { fuelAmount, fuelDirection, fuelRange, parseFuelFeed, summarizeFuelCompanies } from "../lib/fuelPriceFeed";

describe("DOE weekly fuel price feed", () => {
  it("accepts the source-verified seed and preserves unreported kerosene", () => {
    const parsed = parseFuelFeed(seed);
    expect(parsed).not.toBeNull();
    expect(parsed?.weeks[0].weekStart).toBe("2026-10-20");
    expect(parsed?.weeks[0].companies).toHaveLength(15);
    expect(parsed?.weeks[0].summary.gasoline).toEqual({ min: -4.3, max: -4.3, reportingCompanies: 15 });
    expect(parsed?.weeks[0].summary.kerosene?.reportingCompanies).toBe(6);
    expect(parsed?.weeks[0].companies.find((row) => row.company === "Petro Gazz")?.kerosene).toBeNull();
  });

  it("rejects corrupted company data and non-DOE source URLs", () => {
    const swapped = structuredClone(seed);
    swapped.weeks[0].sourceUrl = "https://attacker.example/notice.pdf";
    expect(parseFuelFeed(swapped)).toBeNull();

    const corrupted = structuredClone(seed);
    corrupted.weeks[0].companies[0].gasoline = 999;
    expect(parseFuelFeed(corrupted)).toBeNull();
  });

  it("rejects rollover-invalid DOE week dates and future feed timestamps", () => {
    const wrongDate = structuredClone(seed);
    wrongDate.weeks[0].weekStart = "2026-02-30";
    expect(parseFuelFeed(wrongDate)).toBeNull();

    const futureTimestamp = structuredClone(seed);
    futureTimestamp.updatedAt = "2099-01-01T00:00:00Z";
    expect(parseFuelFeed(futureTimestamp)).toBeNull();
  });

  it("prevents unreviewed feature branches publishing live DOE data and avoids stale price examples", () => {
    const workflow = readFileSync(new URL("../.github/workflows/doe-fuel-prices.yml", import.meta.url), "utf8");
    expect(workflow).toContain("github.event_name != 'pull_request' && github.ref == 'refs/heads/main'");
    const page = readFileSync(new URL("../app/gas-price-philippines/page.tsx", import.meta.url), "utf8");
    expect(page).toContain("hypothetical ₱1.00-per-liter gasoline change");
    expect(page).not.toContain("a ₱4.30/L gasoline decrease");
    const wrangler = JSON.parse(readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8"));
    expect(wrangler.assets.run_worker_first).toContain("/gas-price-philippines");
  });

  it("represents ranges and directions instead of inventing one national value", () => {
    const summary = summarizeFuelCompanies([
      { company: "Shell", gasoline: 1.5, diesel: -3, kerosene: null },
      { company: "Seaoil", gasoline: 1.56, diesel: -3.01, kerosene: null }
    ]);
    expect(fuelRange(summary.gasoline)).toBe("+₱1.50 to +₱1.56");
    expect(fuelDirection(summary.diesel)).toBe("down");
    expect(fuelDirection(summary.kerosene)).toBe("missing");
    expect(fuelAmount(-4.3)).toBe("−₱4.30");
  });
});
