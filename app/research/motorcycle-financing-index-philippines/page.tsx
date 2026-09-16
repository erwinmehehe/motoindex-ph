import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AuthorBox } from "@/components/AuthorBox";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { latestResearchCheck, median, researchFinancingRows } from "@/lib/researchData";
import { php } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Downpayment & Monthly Philippines 2026",
  description: "Compare motorcycle down payments and monthly estimates in the Philippines using one consistent 20% down, 36-month, 12% annual-rate scenario.",
  path: "/research/motorcycle-financing-index-philippines"
});

export default function MotorcycleFinancingIndexPage() {
  const rows = researchFinancingRows();
  const monthlyValues = rows.map((row) => row.scenario.monthlyPhp);
  const medianMonthly = Math.round(median(monthlyValues));
  const checkedAt = latestResearchCheck();
  const lowest = rows[0];
  const path = "/research/motorcycle-financing-index-philippines";
  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "MotoIndex Philippine Motorcycle Financing Comparison Index",
    description: "Planning estimates for current MotoIndex motorcycles using published starting prices, 20% down, 36 months and a 12% annual amortizing-rate assumption.",
    url: absoluteUrl(path),
    dateModified: checkedAt,
    creator: { "@type": "Organization", name: "MotoIndex PH", url: absoluteUrl("/") },
    spatialCoverage: { "@type": "Place", name: "Philippines" },
    variableMeasured: ["Published starting price", "20% down payment", "Estimated monthly payment", "36-month term", "12% annual interest assumption"]
  };

  return <section className="page shell">
    <Breadcrumbs items={[{ label: "Research", href: "/research" }, { label: "Financing index" }]} />
    <div className="page-head">
      <span className="entity-kicker">Financing comparison</span>
      <h1>Motorcycle downpayment and monthly payment Philippines</h1>
      <p>Compare one standardized financing scenario across current motorcycles tracked by MotoIndex. Every row uses the model&apos;s published starting-price reference, 20% down, 36 months and a 12% annual amortizing-rate assumption.</p>
    </div>

    <div className="entity-price-grid">
      <article><span>Current models compared</span><strong>{rows.length}</strong><small>Current, indexable motorcycle records</small></article>
      <article><span>Standard down payment</span><strong>20%</strong><small>Applied to each published starting price</small></article>
      <article><span>Standard term</span><strong>36 months</strong><small>12% annual amortizing-rate assumption</small></article>
      <article><span>Median monthly estimate</span><strong>{php(medianMonthly)}</strong><small>Median across the standardized scenarios</small></article>
    </div>

    <section className="section split" aria-labelledby="financing-index-method">
      <div><span className="section-kicker">One formula, every model</span><h2 id="financing-index-method">Why standardize the financing assumptions?</h2><p>Dealer advertisements can use different down payments, terms, fees and rate methods. Holding the assumptions constant makes purchase prices easier to compare without pretending these are real dealer offers.</p>{lowest && <p>Under this scenario, the lowest monthly estimate in the current dataset is about <strong>{php(Math.round(lowest.scenario.monthlyPhp))}</strong> for the {lowest.model.make} {lowest.model.model}, before insurance, registration, processing fees or lender-specific charges.</p>}</div>
      <div className="info-card"><h3>Important limitations</h3><ul className="checklist"><li>Planning estimate only, not a lender quotation</li><li>Uses an amortizing-loan formula</li><li>Does not include insurance or processing fees</li><li>Dealer add-on interest can produce a different payment</li><li>Approval and final rates depend on the lender and borrower</li></ul></div>
    </section>

    <section className="section" aria-labelledby="financing-index-table">
      <div className="section-head compact"><div><span className="section-kicker">Standardized comparison</span><h2 id="financing-index-table">Down payment and monthly estimates by motorcycle</h2><p>Open the calculator from any row to change the down payment, term or rate for that exact published starting price.</p></div><Link href="/tools/motorcycle-loan-calculator">Open full loan calculator →</Link></div>
      <div className="ph-brand-price-table" role="table" aria-label="Motorcycle downpayment and monthly payment estimates in the Philippines">
        <div className="head" role="row"><span>Motorcycle</span><span>Starting price</span><span>20% down</span><span>Monthly estimate</span><span>Calculator</span></div>
        {rows.map(({ model, pricePhp, scenario }) => <Link role="row" href={{ pathname: "/tools/motorcycle-loan-calculator", query: { price: pricePhp, down: 20, term: 36, rate: 12, model: `${model.make} ${model.model}` } }} key={model.id}>
          <strong>{model.make} {model.model}<small>{model.engineCc} cc · {model.category}</small></strong><span>{php(pricePhp)}</span><span>{php(Math.round(scenario.downPaymentPhp))}</span><span>{php(Math.round(scenario.monthlyPhp))}/mo</span><span>Adjust →</span>
        </Link>)}
      </div>
    </section>

    <div className="note-box"><h2>Compare total cost, not only the advertised monthly payment</h2><p>A longer term can lower the monthly amount while increasing total repayment. Ask for the cash price, financed principal, rate basis, term, fees, insurance and total amount payable before accepting a financing offer.</p><Link className="text-link" href="/ownership/cost-calculator">Add ownership costs →</Link></div>
    <AuthorBox />
    <JsonLd data={dataset} />
  </section>;
}
