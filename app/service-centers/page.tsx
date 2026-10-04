import type { Metadata } from "next";
import Link from "next/link";
import { ServiceCenterFinder } from "@/components/ServiceCenterFinder";
import { InfoPanel, PageHero, SectionHeader, StatRow } from "@/components/ui";
import { SERVICE_CAPABILITIES, serviceCoverageCounts } from "@/lib/serviceCenterPolicy";
import { allVerifiedServiceProviders } from "@/lib/serviceCenters";
import { pageMetadata } from "@/lib/site";
import styles from "../styles/hub-index.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Service Centers Philippines: Checked Shops",
  description: "Find checked motorcycle service centers, authorized dealer service locations and specialty shops in the Philippines by area, brand and verified service capability.",
  path: "/service-centers",
  index: true,
});

export default async function ServiceCentersPage() {
  const providers = await allVerifiedServiceProviders();
  const counts = serviceCoverageCounts(providers);
  const authorized = providers.filter(provider => provider.providerKind === "Authorized dealer").length;
  const independent = providers.filter(provider => provider.providerKind === "Independent service shop").length;
  const areas = new Set(providers.map(provider => provider.province || provider.city).filter(Boolean)).size;
  const activeCapabilities = SERVICE_CAPABILITIES.filter(item => counts[item.id] > 0).length;

  return <main className="page shell service-centers-page">
    <PageHero
      kicker="Service center & shop finder"
      title="Find checked motorcycle service providers."
      description="Search MotoIndex business records by area, motorcycle brand and explicitly checked service capability. Authorized dealer service locations are available now; independent and specialty shops appear only after their own records pass the same verification gate."
      actions={<>
        <a className="button" href="#service-center-search">Find a service center</a>
        <Link className="button secondary" href="/garage">Open My Garage</Link>
      </>}
    />

    <StatRow items={[
      { label:"Checked service providers", value:String(providers.length), note:"Published records with a current source" },
      { label:"Authorized dealer service", value:String(authorized), note:"Dealer / 3S records with service coverage" },
      { label:"Independent shops", value:String(independent), note:"Published only after individual verification" },
      { label:"Covered areas", value:String(areas), note:"Province or city coverage in current data" },
    ]} />

    <section id="service-center-search" className={styles.section}>
      <SectionHeader
        kicker="Search checked service records"
        title="Filter by the work you actually need"
        description="MotoIndex shows a service tag only when that capability is explicit in the checked business record. A general dealer relationship is not treated as proof of suspension, detailing, tire or battery work."
      />
      <ServiceCenterFinder providers={providers} />
    </section>

    <section className={styles.section}>
      <SectionHeader
        kicker="Current capability coverage"
        title="What MotoIndex can verify today"
        description="Zero is intentional when the current checked records do not support a specialty. Coverage can grow without weakening the standard."
      />
      <div className={styles.decisionList}>
        {SERVICE_CAPABILITIES.map(item => <div className={styles.decisionRow} key={item.id}>
          <span className={styles.decisionLabel}>{counts[item.id]} checked</span>
          <span className={styles.decisionCopy}><h3>{item.label}</h3><p>{item.description}</p></span>
          <span className={styles.decisionMeta}>{counts[item.id] > 0 ? "Available now" : "Awaiting verified providers"}</span>
        </div>)}
      </div>
      <p className="muted-note">{activeCapabilities} of {SERVICE_CAPABILITIES.length} service categories currently have checked provider coverage.</p>
    </section>

    <section className={styles.section}>
      <InfoPanel subtle>
        <span className="section-kicker">What “checked” means</span>
        <h2>Business identity and service scope are checked separately from workmanship</h2>
        <p>MotoIndex requires a current source for the published business record and only displays service capabilities supported by that record. This does not certify repair quality, mechanic credentials, quoted prices, parts availability, warranty approval or appointment availability. Confirm the exact work and total price directly with the provider before authorizing service.</p>
      </InfoPanel>
    </section>

    <section className={styles.section}>
      <SectionHeader
        kicker="Ownership workflow"
        title="Use the service finder with My Garage"
        description="Check upcoming maintenance in My Garage first, then use the finder to identify checked providers for the service you need."
      />
      <div className="hero-actions">
        <Link className="button" href="/garage">Review Garage maintenance</Link>
        <Link className="button secondary" href="/maintenance">Open maintenance guides</Link>
        <Link className="button secondary" href="/dealers">Browse dealer directory</Link>
      </div>
    </section>
  </main>;
}
