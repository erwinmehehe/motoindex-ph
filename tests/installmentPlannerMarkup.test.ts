import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { InstallmentCalculator } from "../components/InstallmentCalculator";

describe("installment buyer-facing planner markup", () => {
  const html = renderToStaticMarkup(createElement(InstallmentCalculator, {
    price: 133400,
    priceOptions: [{ label: "Standard", price: 133400 }, { label: "RoadSync", price: 154900 }]
  }));

  it("shows the monthly figure and full estimated cash paid together", () => {
    expect(html).toContain('data-calculator="installment"');
    expect(html).toContain("Estimated monthly payment");
    expect(html).toContain("Total estimated cash paid");
    expect(html).toContain("Cash to prepare upfront");
    expect(html).toContain("Estimated interest");
  });

  it("includes six keyboard-operable quick financing presets", () => {
    expect((html.match(/aria-pressed=/g) || []).length).toBe(6);
    expect(html).toContain("Quick loan terms");
    expect(html).toContain("Quick downpayment percentages");
  });

  it("labels the annual amortizing rate and fee assumptions rather than promising approval", () => {
    expect(html).toContain("Annual amortizing interest");
    expect(html).toContain("Fees paid upfront");
    expect(html).toContain("not a dealer offer or approval");
    expect(html).toContain('aria-label="Editable motorcycle installment estimate"');
  });

  it("offers source-model variants without equating them with verified dealer quotes", () => {
    expect(html).toContain("Standard");
    expect(html).toContain("RoadSync");
    expect(html).toContain("not guaranteed dealer cash prices");
  });
});
