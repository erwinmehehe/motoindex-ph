import fs from "node:fs";
import { describe, expect, it } from "vitest";

const dealerComponent = fs.readFileSync("components/DealerFinancingSnapshot.tsx", "utf8");
const installmentPage = fs.readFileSync("app/motorcycles/[make]/[slug]/installment/page.tsx", "utf8");
const modelDetail = fs.readFileSync("components/MotorcycleEntityPage.tsx", "utf8");

describe("dealer financing empty-state compatibility", () => {
  it("preserves the old no-data behavior for ordinary motorcycle model pages", () => {
    expect(dealerComponent).toContain("showEmptyState = false");
    expect(dealerComponent).toContain("if (!observations.length && !showEmptyState) return null;");
    expect(modelDetail).toContain("<DealerFinancingSnapshot modelId={model.id}");
  });

  it("makes missing dealer observations explicit on dedicated installment pages", () => {
    expect(installmentPage).toContain('modelName={modelName} showEmptyState');
    expect(dealerComponent).toContain("No complete dealer financing observations on file");
  });

  it("retains dealer source and caveats for published observations", () => {
    expect(dealerComponent).toContain("row.sourceUrl");
    expect(dealerComponent).toContain("row.checkedAt");
    expect(dealerComponent).toContain("Dealer figures are indicative observations");
  });
});
