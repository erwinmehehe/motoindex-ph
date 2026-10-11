import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { AuthorBox } from "@/components/AuthorBox";
import { CTAGroup, PageHero, SectionHeader, StatRow } from "@/components/ui";
import { getModelById, isIndexableModel } from "@/lib/data";
import { modelSparkPlugGuide } from "@/lib/modelSparkPlugGuides";
import { pageMetadata } from "@/lib/site";
import { articleSchema } from "@/lib/articleSchema";

const modelId = "suzuki-raider-r150";
const canonicalPath = "/motorcycles/suzuki/raider-r150/spark-plug";
const parentPath = "/motorcycles/suzuki/raider-r150";

function evidence() {
  const model = getModelById(modelId);
  const guide = modelSparkPlugGuide(modelId);
  return model && isIndexableModel(model) && guide ? { model, guide } : undefined;
}


export function generateMetadata(): Metadata {
  const data = evidence();
  if (!data) return pageMetadata({
    title: "Suzuki Raider R150 FI Spark Plug Reference",
    description: "Model-specific spark plug reference for Suzuki Raider R150 FI.",
    path: canonicalPath,
    index: false
  });
  return pageMetadata({
    title: "Raider 150 FI Spark Plug: NGK Code & Gap | MotoIndex PH",
    description: "Check the Suzuki Raider R150 FI spark plug code, NGK MR8E-9, and 0.8–0.9 mm gap from Suzuki's owner manual. Includes model-fitment cautions.",
    path: canonicalPath,
    index: true
  });
}

export default function RaiderSparkPlugPage() {
  const data = evidence();
  if (!data) notFound();
  const { guide } = data!;
  const faqs = [
    {
      question: "What spark plug does the Raider R150 FI use?",
      answer: "The Suzuki Raider R150 FI (FU150MF) owner's manual specifies NGK MR8E-9. Confirm the engine designation and model year before buying; this does not establish fitment for carbureted Raider models."
    },
    {
      question: "What is the Raider R150 FI spark plug gap?",
      answer: "Suzuki's R150 FI manual lists a 0.8–0.9 mm gap. Use the manual's inspection and installation instructions or an authorized mechanic; do not force or modify a plug that is not suitable for the engine."
    },
    {
      question: "Does NGK MR8E-9 fit every Raider 150?",
      answer: "No universal fitment is claimed. Suzuki has sold different Raider 150 variants and generations. Match the exact fuel-injected FU150MF manual or confirm with Suzuki before purchasing."
    },
    {
      question: "When should the spark plug be replaced?",
      answer: "Check the correct owner's manual service schedule and the plug's condition. MotoIndex does not publish a universal change interval for all Raider 150 variants."
    }
  ];
  const article = articleSchema({
    headline: "Suzuki Raider R150 FI spark plug: NGK code, gap and fitment",
    description: "Verified Raider R150 FI spark plug specification from Suzuki's FU150MF manual.",
    path: canonicalPath,
    about: guide.primaryKeyword,
    keywords: ["Suzuki Raider R150 FI spark plug", "Raider 150 spark plug gap", "NGK MR8E-9"],
    checkedDates: [guide.checkedAt]
  });
  return <main className="shell">
    <Breadcrumbs items={[
      { label: "Motorcycles", href: "/motorcycles" },
      { label: "Suzuki", href: "/motorcycles/suzuki" },
      { label: "Raider R150", href: parentPath },
      { label: "Spark plug" }
    ]} />
    <PageHero
      kicker="Verified service specification"
      title="Raider R150 FI spark plug: code and gap"
      description="For the fuel-injected Suzuki Raider R150 with the FU150MF owner's manual, Suzuki specifies NGK MR8E-9 with a 0.8–0.9 mm plug gap. Confirm your exact model before ordering."
      actions={<CTAGroup>
        <a className="button" href="#manufacturer-reference">Check the source</a>
        <Link className="button secondary" href={parentPath}>Full Raider R150 guide</Link>
      </CTAGroup>}
    />
    <StatRow items={[
      { label: "Spark plug", value: guide.partCode, note: guide.manufacturer },
      { label: "Specified gap", value: "0.8–0.9 mm", note: "Suzuki owner's manual" },
      { label: "Manual version", value: "FU150MF", note: "Fuel-injected R150" },
      { label: "Verified", value: guide.checkedAt, note: "Official manufacturer PDF" }
    ]} />
    <section className="section" id="manufacturer-reference">
      <SectionHeader
        title="What the Suzuki owner's manual specifies"
        description="This page reports one manufacturer-backed reference, not a universal spark-plug catalog."
      />
      <div className="spec-table">
        <div className="spec-row"><span>Motorcycle</span><strong>{guide.appliesTo}</strong></div>
        <div className="spec-row"><span>Spark-plug manufacturer</span><strong>{guide.manufacturer}</strong></div>
        <div className="spec-row"><span>Plug code</span><strong>{guide.partCode}</strong></div>
        <div className="spec-row"><span>Electrode gap</span><strong>{guide.gapMinMm}–{guide.gapMaxMm} mm</strong></div>
      </div>
      <p><a className="text-link" href={guide.sourceUrl} target="_blank" rel="noreferrer">Read Suzuki's official Raider R150 FI owner manual (PDF) →</a></p>
      <p>Source section: {guide.sourceLabel}. Source checked {guide.checkedAt}.</p>
    </section>
    <section className="section">
      <SectionHeader title="Check the exact Raider variant before buying" description={guide.applicabilityNote} />
      <div className="info-card">
        <h3>FI and carbureted variants are not interchangeable by name alone</h3>
        <p>Identify your motorcycle's exact model designation and generation before ordering a replacement spark plug. A plug can look similar while having a different heat range, reach, seat, or terminal arrangement. Do not assume that a listing labeled “Raider 150” matches every version.</p>
        <p>For replacement, use the model-correct Suzuki manual and follow its safety, inspection, and installation instructions. Avoid guessing tightening torque or extending a service interval from another motorcycle.</p>
      </div>
    </section>
    <section className="section">
      <SectionHeader title="Related Raider R150 information" description="Continue to the MotoIndex model profile for stock specifications, tire sizes and other ownership details." />
      <p><Link className="text-link" href={parentPath}>Suzuki Raider R150 specifications and ownership →</Link></p>
      <p><Link className="text-link" href="/maintenance">Motorcycle maintenance reference →</Link></p>
    </section>
    <FaqSection items={faqs} title="Raider 150 spark plug questions" />
    <AuthorBox />
    <JsonLd data={article}/>
  </main>;
}
