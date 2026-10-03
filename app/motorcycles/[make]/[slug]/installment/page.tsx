import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DealerFinancingSnapshot } from "@/components/DealerFinancingSnapshot";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { FinancingSnapshot } from "@/components/FinancingSnapshot";
import { InstallmentCalculator } from "@/components/InstallmentCalculator";
import { JsonLd } from "@/components/JsonLd";
import { CTAGroup, PageHero, SectionHeader, StatRow } from "@/components/ui";
import { dealerFinancingObservationsFor } from "@/lib/dealerFinancing";
import { financingScenario } from "@/lib/financing";
import { getModel, getModelById, isIndexableModel } from "@/lib/data";
import { installmentLandingProfile, installmentLandingProfiles } from "@/lib/modelIntentLandingPages";
import { observedMarketRange } from "@/lib/marketChecks";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { php } from "@/lib/utils";
import { variantPriceOptions } from "@/lib/variants";

export function generateStaticParams() {
  return installmentLandingProfiles.flatMap((profile) => {
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
    path: `/motorcycles/${model.makeSlug}/${model.slug}/installment`,
    index: isIndexableModel(model)
  });
}

export default async function ModelInstallmentPage({ params }: { params: Promise<{ make: string; slug: string }> }) {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return notFound();
  const profile = installmentLandingProfile(model.id);
  if (!profile || !isIndexableModel(model)) return notFound();

  const modelName = `${model.make} ${model.model}`;
  const canonicalPath = `/motorcycles/${model.makeSlug}/${model.slug}/installment`;
  const range = observedMarketRange(model);
  const priceOptions = variantPriceOptions(model.id);
  const examples = [10, 20, 30].map((down) => financingScenario(range.from, down, 36, 12));
  const baseline = examples[1];
  const dealerRows = dealerFinancingObservationsFor(model.id);
  const publishedDealerLoans = dealerRows.filter((row) => row.downPaymentPhp && row.monthlyPhp);

  const faqs: FaqItem[] = [
    {
      question: `How much is the ${modelName} downpayment in the Philippines?`,
      answer: `A 20% planning downpayment on the current ${php(range.from)} starting-price reference is about ${php(Math.round(baseline.downPaymentPhp))}. Actual dealer minimum downpayment, fees and lender approval rules can be different, so replace this assumption with the exact branch quote.`
    },
    {
      question: `How much is the ${modelName} monthly installment?`,
      answer: `Using ${php(range.from)}, 20% down, 36 months and 12% annual amortizing interest, the MotoIndex planning estimate is about ${php(Math.round(baseline.monthlyPhp))} per month. This is not a dealer or lender quotation.`
    },
    {
      question: `Are the dealer monthly figures the same as the MotoIndex calculator?`,
      answer: `No. MotoIndex shows dated dealer observations separately from its standardized calculator. Dealer cards can use different downpayments, terms, rate methods, fees and financed amounts, so the monthly figures are not directly comparable unless the assumptions match.`
    },
    {
      question: `Which ${modelName} price should I use in the installment calculator?`,
      answer: priceOptions.length > 1
        ? `Use the exact variant price or, better, the dealer's actual cash price for the unit you plan to buy. MotoIndex currently has ${priceOptions.map((option) => `${option.label} at ${php(option.price)}`).join("; ")} as verified shortcuts.`
        : `Start with the current ${php(range.from)} published reference, then replace it with the dealer's actual cash price before comparing loan options.`
    }
  ];

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: profile.heading,
    url: absoluteUrl(canonicalPath),
    description: profile.description,
    about: {
      "@type": "Product",
      name: modelName,
      brand: { "@type": "Brand", name: model.make },
      category: "Motorcycle"
    }
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: absoluteUrl(`${canonicalPath}#faq`),
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    }))
  };

  return <main className="shell">
    <JsonLd data={[webPageSchema, faqSchema]} />
    <Breadcrumbs items={[
      { label: "Motorcycles", href: "/motorcycles" },
      { label: model.make, href: `/motorcycles/${model.makeSlug}` },
      { label: model.model, href: `/motorcycles/${model.makeSlug}/${model.slug}` },
      { label: "Installment" }
    ]} />

    <PageHero
      kicker="Philippines installment guide"
      title={profile.heading}
      description={profile.intro}
      actions={<CTAGroup>
        <a className="button" href="#calculator">Calculate monthly payment</a>
        <Link className="button secondary" href={`/motorcycles/${model.makeSlug}/${model.slug}`}>Full {model.model} guide</Link>
      </CTAGroup>}
    />

    <StatRow items={[
      { label: "Starting price", value: php(range.from), note: range.to && range.to > range.from ? `Up to ${php(range.to)} in current references` : "Current published reference" },
      { label: "20% planning down", value: php(Math.round(baseline.downPaymentPhp)), note: "Editable below" },
      { label: "36-month estimate", value: `${php(Math.round(baseline.monthlyPhp))}/mo`, note: "20% down · 12% annual rate" },
      { label: "Dealer observations", value: String(dealerRows.length), note: publishedDealerLoans.length ? `${publishedDealerLoans.length} with published down + monthly` : "No complete dealer financing card stored" }
    ]} />

    <section className="section" id="calculator" aria-labelledby="installment-calculator-heading">
      <SectionHeader
        kicker="Editable estimate"
        titleId="installment-calculator-heading"
        title={`${modelName} installment calculator`}
        description="Change the price, downpayment, loan term and annual rate. Use the exact dealer cash price and lender terms when you have them."
      />
      <InstallmentCalculator price={range.from} priceOptions={priceOptions} />
    </section>

    <section className="section" aria-labelledby="downpayment-scenarios-heading">
      <SectionHeader
        kicker="Like-for-like scenarios"
        titleId="downpayment-scenarios-heading"
        title="How downpayment changes the monthly estimate"
        description="These three examples keep the same 36-month term and 12% annual amortizing rate so only the downpayment changes."
      />
      <StatRow items={examples.map((example) => ({
        label: `${example.downPaymentPct}% down`,
        value: `${php(Math.round(example.monthlyPhp))}/mo`,
        note: `${php(Math.round(example.downPaymentPhp))} cash down · ${php(Math.round(example.financedPhp))} financed`
      }))} />
    </section>

    <section className="section">
      <FinancingSnapshot modelName={modelName} price={range.from} priceOptions={priceOptions} />
    </section>

    <section className="section">
      <DealerFinancingSnapshot modelId={model.id} modelName={modelName} />
    </section>

    <section className="section split" aria-labelledby="finance-assumptions-heading">
      <div>
        <span className="section-kicker">What changes the answer</span>
        <h2 id="finance-assumptions-heading">Why your real monthly payment can be different</h2>
        <p>The cash price, downpayment, financed principal, loan term, rate method, registration, insurance, lender fees and dealer add-ons can all change the final payment. A lower advertised downpayment does not automatically mean a cheaper loan.</p>
        <p>Use the dealer snapshot as dated evidence of what was advertised and the calculator as a like-for-like planning tool. Ask for the complete repayment schedule before signing.</p>
      </div>
      <div className="info-card">
        <h3>Before you reserve</h3>
        <ul className="checklist">
          <li>Confirm exact variant and model year.</li>
          <li>Get the actual cash price before financing.</li>
          <li>Ask for downpayment, term and rate method in writing.</li>
          <li>Separate registration, insurance and add-on fees.</li>
          <li>Compare total repayment, not monthly payment alone.</li>
        </ul>
      </div>
    </section>

    <section id="faq" className="section">
      <FaqSection title={`${modelName} installment FAQs`} items={faqs} />
    </section>

    <section className="section">
      <SectionHeader
        kicker="Continue researching"
        title="Check the motorcycle itself before choosing the loan"
        description="Financing should follow the motorcycle decision, not replace it. Confirm price, fit, specifications, variants and ownership needs on the main model page."
      />
      <CTAGroup>
        <Link className="button" href={`/motorcycles/${model.makeSlug}/${model.slug}`}>Open full {model.model} guide</Link>
        <Link className="button secondary" href={{ pathname: "/tools/motorcycle-loan-calculator", query: { price: range.from, model: modelName } }}>Open full loan calculator</Link>
      </CTAGroup>
    </section>
  </main>;
}
