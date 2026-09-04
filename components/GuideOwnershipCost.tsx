import Link from "next/link";
import { php } from "@/lib/utils";
import { ownershipDefaults } from "@/lib/ownership";
import { observedMarketRange } from "@/lib/marketChecks";
import type { Motorcycle } from "@/lib/types";

// Running-cost context for recommendation guides.
//
// Guides compare purchase price well, but purchase price is not what a rider
// actually pays each month. This computes a monthly running-cost estimate for the
// models in each guide from lib/ownership defaults, so every guide gets numbers
// derived from its own shortlist rather than a shared block of prose.
//
// These are planning estimates built on stated assumptions, not quotes. The
// assumptions are printed on the page so a reader can disagree with them.

type Props = { models: Motorcycle[]; guideTitle: string };

type Row = {
  model: Motorcycle;
  monthly: number;
  fuel: number;
  maintenance: number;
  fixed: number;
  buy?: number;
};

function monthlyRunningCost(model: Motorcycle): Row {
  const d = ownershipDefaults(model);
  const fuel = (d.kmPerMonth / d.estimatedKmPerL) * d.fuelPricePerL;
  const fixed = (d.annualInsurance + d.annualRegistration + d.tiresPerYear) / 12;
  const monthly = fuel + d.maintenancePerMonth + fixed;
  return { model, monthly, fuel, maintenance: d.maintenancePerMonth, fixed, buy: observedMarketRange(model).from };
}

export function GuideOwnershipCost({ models, guideTitle }: Props) {
  if (models.length < 2) return null;

  const rows = models.map(monthlyRunningCost).sort((a, b) => a.monthly - b.monthly);
  const cheapestToRun = rows[0];
  const dearestToRun = rows[rows.length - 1];
  const spread = Math.round(dearestToRun.monthly - cheapestToRun.monthly);

  const priced = rows.filter(r => typeof r.buy === "number") as (Row & { buy: number })[];
  const cheapestToBuy = priced.length ? priced.reduce((a, b) => (a.buy <= b.buy ? a : b)) : undefined;
  const buyAndRunDiffer = cheapestToBuy && cheapestToBuy.model.id !== cheapestToRun.model.id;

  const sample = ownershipDefaults(models[0]);
  const yearOne = Math.round(cheapestToRun.monthly * 12);
  const yearOneHigh = Math.round(dearestToRun.monthly * 12);

  return <div className="guide-running-cost">
    <div className="section-head inline-head"><div>
      <h2>What these actually cost to run each month</h2>
      <p>Purchase price is the number everyone compares, but it is not the number you pay every month. Below is a running-cost estimate for the models in this guide, built from the same assumptions for all of them so the comparison is fair.</p>
    </div></div>

    <div className="fitment-grid">
      <div>
        <span>Cheapest to run</span>
        <strong>{php(Math.round(cheapestToRun.monthly))}</strong>
        <small>{cheapestToRun.model.make} {cheapestToRun.model.model} · per month</small>
      </div>
      <div>
        <span>Most expensive to run</span>
        <strong>{php(Math.round(dearestToRun.monthly))}</strong>
        <small>{dearestToRun.model.make} {dearestToRun.model.model} · per month</small>
      </div>
    </div>

    <div className="split section">
      <div>
        <h3>Cheapest to buy is not always cheapest to keep</h3>
        <p>
          Across the {models.length} motorcycles in this guide, the estimated monthly running cost spans about
          {" "}{php(Math.round(cheapestToRun.monthly))} to {php(Math.round(dearestToRun.monthly))} — a difference of
          roughly {php(spread)} a month, or {php(spread * 12)} over a year. On a five-year ownership horizon that
          gap matters more than most buyers expect when they are comparing showroom prices.
        </p>
        {buyAndRunDiffer && cheapestToBuy ? <p>
          Worth noting: the cheapest motorcycle to buy here is the {cheapestToBuy.model.make}{" "}
          {cheapestToBuy.model.model} at {php(cheapestToBuy.buy)}, but the cheapest to run is the{" "}
          {cheapestToRun.model.make} {cheapestToRun.model.model}. Those are different motorcycles, which is the
          whole reason to look past the purchase price.
        </p> : <p>
          In this particular guide the cheapest motorcycle to buy is also the cheapest to run, which is not
          always the case — heavier or larger-displacement models often reverse that once fuel and consumables
          are counted.
        </p>}
        <p>
          Fuel is the part riders feel first, but it is rarely the biggest line. For the{" "}
          {cheapestToRun.model.make} {cheapestToRun.model.model}, the estimate splits roughly into{" "}
          {php(Math.round(cheapestToRun.fuel))} of fuel, {php(Math.round(cheapestToRun.maintenance))} of routine
          maintenance and {php(Math.round(cheapestToRun.fixed))} of insurance, registration and tyre reserve
          spread across the month.
        </p>
        <p>
          On that basis, budget somewhere between {php(yearOne)} and {php(yearOneHigh)} for a first year of
          running costs, before financing. If you are buying on installment, add the monthly amortisation on
          top — that is a separate number, and the two together are what your actual budget has to absorb.
        </p>
      </div>

      <div className="info-card">
        <h3>Assumptions behind these numbers</h3>
        <ul className="checklist">
          <li>{sample.kmPerMonth.toLocaleString()} km ridden per month</li>
          <li>Fuel at {php(sample.fuelPricePerL)} per litre</li>
          <li>Manufacturer or category fuel economy per model</li>
          <li>Registration reserve of {php(sample.annualRegistration)} per year</li>
          <li>Insurance and tyre reserves scaled to model class</li>
        </ul>
        <p>
          Change any of these and the ranking can change. The calculators below take your own numbers instead
          of these defaults.
        </p>
        <Link href="/ownership/cost-calculator">Run your own cost estimate →</Link>
      </div>
    </div>

    <div className="list-cards">
      <Link href="/tools/motorcycle-loan-calculator">
        <span><strong>Estimate a monthly amortisation</strong><small>Cash price, down payment, term and rate for anything in this guide</small></span>
        <b>Open →</b>
      </Link>
      <Link href="/commute/cost-calculator">
        <span><strong>Cost your actual commute</strong><small>Fuel, maintenance reserve and parking for your real route</small></span>
        <b>Open →</b>
      </Link>
      <Link href="/tools/lto-registration-fee-calculator">
        <span><strong>LTO registration budget</strong><small>Source-dated registration and renewal cost guidance</small></span>
        <b>Open →</b>
      </Link>
    </div>

    <p className="guide-cost-note">
      These figures are planning estimates for comparing the motorcycles in {guideTitle.toLowerCase()} on the
      same basis. They are not quotes, and they exclude financing interest, helmet and gear, accessories and
      the cost of any accident or repair outside routine maintenance.
    </p>
  </div>;
}
