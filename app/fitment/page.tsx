import type { Metadata } from "next";
import Link from "next/link";
import { publicMotorcycles } from "@/lib/data";
import { pageMetadata } from "@/lib/site";
import { FitmentExplorer } from "@/components/FitmentExplorer";
import { CTAGroup, InfoPanel, PageHero, SectionHeader, StatRow } from "@/components/ui";
import styles from "../styles/hub-index.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Accessory Fitment Finder Philippines",
  description: "Search Philippine motorcycle models, check stock front and rear tire sizes, and open exact fitment records before buying tires or accessories.",
  path: "/fitment",
  index: publicMotorcycles.length > 0
});

export default function FitmentPage() {
  const models = publicMotorcycles.map(({ id, make, makeSlug, model, slug, category, frontTire, rearTire }) => ({
    id, make, makeSlug, model, slug, category, frontTire, rearTire
  }));

  return <section className="page shell fitment-hub-page">
    <PageHero
      kicker="Motorcycle fitment finder"
      title="Check what actually fits your motorcycle"
      description="Start with the exact motorcycle and its stock tire sizes. For accessories, verify the model-specific bracket, mounting record or manufacturer fitment reference before ordering."
      actions={<CTAGroup><Link className="button" href="/tires">Tire size guide</Link><Link className="button secondary" href="/motorcycles">Browse motorcycles</Link></CTAGroup>}
    />

    <StatRow items={[
      {label:"Step 1",value:"Exact model",note:"Generation and variant matter"},
      {label:"Step 2",value:"Stock dimensions",note:"Confirm full tire specification"},
      {label:"Step 3",value:"Fitment evidence",note:"Check the actual mount or bracket"}
    ]}/>

    <section className={styles.section} data-fitment-explorer-section>
      <SectionHeader
        kicker="Search the catalog"
        title="Find the exact motorcycle first"
        description={`Search ${models.length} current motorcycle records by model, brand or stock tire size, then open the canonical fitment section.`}
      />
      {models.length ? <FitmentExplorer models={models} /> : <InfoPanel subtle><h3>Fitment records are being updated</h3><p>Motorcycle specifications still need checking before the fitment directory is published.</p></InfoPanel>}
    </section>

    <InfoPanel subtle className={styles.notice}>
      <h3>Matching a size is not the same as complete fitment</h3>
      <p>For tires, confirm the full specification and motorcycle manufacturer guidance. For boxes, racks, mounts and other accessories, confirm the exact bracket or mounting system for your motorcycle.</p>
    </InfoPanel>
  </section>;
}
