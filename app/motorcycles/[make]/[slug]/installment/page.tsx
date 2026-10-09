import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DealerFinancingSnapshot } from "@/components/DealerFinancingSnapshot";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { FinancingSnapshot } from "@/components/FinancingSnapshot";
import { InstallmentCalculator } from "@/components/InstallmentCalculator";
import { JsonLd } from "@/components/JsonLd";
import { CTAGroup, SectionHeader } from "@/components/ui";
import { dealerFinancingObservationsFor } from "@/lib/dealerFinancing";
import { financingScenario } from "@/lib/financing";
import { getModel, getModelById, isIndexableModel } from "@/lib/data";
import { installmentLandingProfile, installmentLandingProfiles } from "@/lib/modelIntentLandingPages";
import { observedMarketRange, priceChecksForModel } from "@/lib/marketChecks";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { php } from "@/lib/utils";
import { variantPriceOptions } from "@/lib/variants";

export function generateStaticParams() {
  return installmentLandingProfiles.flatMap(profile => {
    const model = getModelById(profile.modelId);
    return model ? [{ make: model.makeSlug, slug: model.slug }] : [];
  });
}

export async function generateMetadata({ params }: { params: Promise<{ make: string; slug: string }> }): Promise<Metadata> {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return {};
  const profile = installmentLandingProfile(model.id);
  if (!profile) return {};
  return pageMetadata({
    title: profile.title,
    description: profile.description,
    path: "/motorcycles/" + model.makeSlug + "/" + model.slug + "/installment",
    index: isIndexableModel(model)
  });
}

function readableDate(date: string) {
  const parsed = new Date(date + "T00:00:00Z");
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString("en-PH", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export default async function ModelInstallmentPage({ params }: { params: Promise<{ make: string; slug: string }> }) {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return notFound();
  const profile = installmentLandingProfile(model.id);
  if (!profile) permanentRedirect(`/motorcycles/${model.makeSlug}/${model.slug}#installment`);
  if (!isIndexableModel(model)) return notFound();

  const modelName = model.make + " " + model.model;
  const modelHref = "/motorcycles/" + model.makeSlug + "/" + model.slug;
  const canonicalPath = `/motorcycles/${model.makeSlug}/${model.slug}/installment`;
  const range = observedMarketRange(model);
  const priceOptions = variantPriceOptions(model.id);
  const examples = [10, 20, 30].map(down => financingScenario(range.from, down, 36, 12));
  const baseline = examples[1];
  const baselineTotal = baseline.downPaymentPhp + baseline.monthlyPhp * 36;
  const dealerRows = dealerFinancingObservationsFor(model.id);
  const latestPriceCheck = priceChecksForModel(model.id).map(row => row.checkedAt).sort().at(-1) || model.marketPriceCheckedAt || model.verifiedAt;

  const faqs: FaqItem[] = [
    {
      question: "How much is the " + modelName + " downpayment in the Philippines?",
      answer: "A 20% planning downpayment on the published " + php(range.from) + " starting-price reference is about " + php(Math.round(baseline.downPaymentPhp)) + ". A dealer may set a different minimum downpayment, financing term or fee arrangement."
    },
    {
      question: "How much is the " + modelName + " monthly installment?",
      answer: "At " + php(range.from) + ", 20% down, 36 months and a 12% annual amortizing rate, the calculated monthly estimate is about " + php(Math.round(baseline.monthlyPhp)) + ". It is a planning illustration, not a branch quotation or approval."
    },
    {
      question: "How much would the " + modelName + " cost in total on installment?",
      answer: "With those same assumptions and no additional fees, total estimated cash paid is " + php(Math.round(baselineTotal)) + ", including the downpayment and 36 monthly payments. Dealer fees, insurance and other charges can increase the amount."
    },
    {
      question: "Are the dealer monthly figures the same as the MotoIndex calculator?",
      answer: "No. Dealer observations are dated advertised figures, often without a published rate method, full repayment schedule or identical variant names. The MotoIndex example assumes an annual amortizing interest rate, so the figures cannot be compared directly without matching every term."
    },
    {
      question: "Which " + modelName + " price should I use in the installment calculator?",
      answer: priceOptions.length > 1
        ? "Use your exact chosen variant or the dealer's written cash price. MotoIndex lists " + priceOptions.map(option => option.label + " at " + php(option.price)).join("; ") + " as separate published variant references."
        : "Start with the published " + php(range.from) + " price reference, then replace it with the dealer's written cash price."
    },
    {
      question: "What should I ask before agreeing to a motorcycle installment plan?",
      answer: "Request the full cash price, cash due at signing, number of payments, the lender's interest-rate method, total repayment, processing fees, insurance costs and any penalties in writing. Check whether fees are financed or paid separately."
    }
  ];

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: profile.heading,
    url: absoluteUrl(canonicalPath),
    description: profile.description,
    about: { "@type": "Product", name: modelName, brand: { "@type": "Brand", name: model.make }, category: "Motorcycle" }
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: absoluteUrl(canonicalPath + "#faq"),
    mainEntity: faqs.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } }))
  };

  return <main className="shell installment-landing" data-installment-page={model.id}>
    <JsonLd data={[webPageSchema, faqSchema]} />
    <Breadcrumbs items={[
      { label: "Motorcycles", href: "/motorcycles" },
      { label: model.make, href: "/motorcycles/" + model.makeSlug },
      { label: model.model, href: modelHref },
      { label: "Installment" }
    ]} />

    <header className="installment-hero">
      <div className="installment-hero-copy">
        <span className="installment-eyebrow">Motorcycle financing · Philippines</span>
        <h1>{profile.heading}</h1>
        <p>{profile.intro}</p>
        <div className="installment-hero-actions">
          <a className="button" href="#calculator">Calculate my payment <span aria-hidden="true">→</span></a>
          <a className="button ghost" href="#dealer-evidence">See dealer observations</a>
        </div>
        <div className="installment-reference-line">
          <span>Published price basis: <strong>{php(range.from)}{range.to && range.to > range.from ? "–" + php(range.to) : ""}</strong></span>
          <span>Latest source check: <strong>{readableDate(latestPriceCheck)}</strong></span>
        </div>
      </div>
      <aside className="installment-hero-estimate" aria-label="Illustrative financing summary">
        <span className="installment-hero-estimate-tag">Quick planning snapshot</span>
        <span className="installment-hero-estimate-label">Estimated monthly from</span>
        <strong className="installment-hero-monthly">{php(Math.round(baseline.monthlyPhp))}<small>/mo</small></strong>
        <div className="installment-hero-metrics">
          <div><span>20% downpayment</span><strong>{php(Math.round(baseline.downPaymentPhp))}</strong></div>
          <div><span>Loan term</span><strong>36 months</strong></div>
          <div><span>Cash price basis</span><strong>{php(range.from)}</strong></div>
        </div>
        <p>Illustration only: 12% annual amortizing interest, before taxes, insurance and extra fees. Adjust every assumption below.</p>
      </aside>
    </header>

    <nav className="installment-jump-nav" aria-label="Installment page sections">
      <a href="#calculator">Payment calculator</a>
      <a href="#compare">Compare scenarios</a>
      <a href="#dealer-evidence">Dealer observations</a>
      <a href="#finance-checklist">Before you sign</a>
      <a href="#faq">FAQs</a>
    </nav>

    <section className="installment-page-section installment-calculator-section" id="calculator" aria-labelledby="installment-calculator-heading">
      <SectionHeader
        kicker="Make the numbers yours"
        titleId="installment-calculator-heading"
        title={modelName + " installment calculator"}
        description="The monthly estimate is not a dealer offer. Update the actual motorcycle price and ask the lender how its rate and fees are calculated."
      />
      <InstallmentCalculator price={range.from} priceOptions={priceOptions} />
    </section>

    <section className="installment-page-section" id="compare" aria-labelledby="downpayment-scenarios-heading">
      <SectionHeader
        kicker="Side-by-side"
        titleId="downpayment-scenarios-heading"
        title="What changes when you pay more upfront?"
        description="Only the downpayment changes in these examples. All use the same published starting price, 36 months, and 12% annual amortizing interest; fees are excluded."
      />
      <div className="installment-scenario-grid">
        {examples.map(example => <article className="installment-scenario-card" key={example.downPaymentPct}>
          <span className="installment-scenario-tag">{example.downPaymentPct}% downpayment</span>
          <strong>{php(Math.round(example.monthlyPhp))}<small>/mo</small></strong>
          <dl>
            <div><dt>Cash down</dt><dd>{php(Math.round(example.downPaymentPhp))}</dd></div>
            <div><dt>Amount financed</dt><dd>{php(Math.round(example.financedPhp))}</dd></div>
            <div><dt>Total paid, no fees</dt><dd>{php(Math.round(example.downPaymentPhp + example.monthlyPhp * 36))}</dd></div>
          </dl>
        </article>)}
      </div>
      {priceOptions.length > 1 && <FinancingSnapshot modelName={modelName} price={range.from} priceOptions={priceOptions} />}
    </section>

    <section className="installment-page-section installment-dealer-section" id="dealer-evidence" aria-label="Dated dealer financing observations">
      <DealerFinancingSnapshot modelId={model.id} modelName={modelName} />
    </section>

    <section className="installment-page-section installment-guidance" id="finance-checklist" aria-labelledby="finance-assumptions-heading">
      <div className="installment-guidance-copy">
        <span className="installment-eyebrow">Read this before comparing offers</span>
        <h2 id="finance-assumptions-heading">The cheapest monthly payment is not always the cheapest motorcycle loan.</h2>
        <p>A lower advertised downpayment, longer term, or flat-rate calculation can change what you pay in total. MotoIndex models a standard amortizing rate, while a dealer may advertise different financing terms.</p>
        <p>Compare the <strong>full repayment amount</strong>, the cash required on release day and the exact motorcycle variant. Never assume a published dealer monthly figure is an approval.</p>
        <div className="installment-guidance-actions">
          <Link className="button" href="/dealers">Browse checked dealers <span aria-hidden="true">→</span></Link>
          <Link className="button ghost" href={{ pathname: "/tools/motorcycle-loan-calculator", query: { model: modelName, price: range.from } }}>Open full loan tool</Link>
        </div>
      </div>
      <aside className="installment-guidance-checklist">
        <h3>Ask the branch for these six items</h3>
        <ol>
          <li>Exact variant, model year and cash selling price</li>
          <li>Amount you must pay before release</li>
          <li>Monthly amount, number of payments and due dates</li>
          <li>Rate method: amortizing, add-on or flat</li>
          <li>Insurance, registration and processing fees</li>
          <li>Total amount payable and any early-payment charges</li>
        </ol>
        <small>Keep the written quote. MotoIndex does not approve loans or guarantee inventory.</small>
      </aside>
    </section>

    <section className="installment-page-section" id="faq">
      <FaqSection title={modelName + " installment FAQs"} items={faqs} />
    </section>

    <section className="installment-page-section installment-next-steps">
      <SectionHeader
        kicker="Make an informed purchase"
        title="Choose the right motorcycle before choosing the loan"
        description="Review the bike's specifications, fit, variants and published prices, then confirm the total financing amount with a checked dealer."
      />
      <CTAGroup>
        <Link className="button" href={modelHref}>View full {model.model} guide</Link>
        <Link className="button secondary" href="/dealers">Find checked dealers</Link>
      </CTAGroup>
    </section>
  </main>;
}
