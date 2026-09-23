import type { Metadata } from "next";
import Link from "next/link";
import { GarageResalePack } from "@/components/GarageResalePack";
import { PageHero } from "@/components/ui";
import { publicMotorcycles } from "@/lib/data";
import { maintenanceSchedules } from "@/lib/maintenance";
import type { GarageCatalogModel } from "@/lib/garage";

export const metadata: Metadata = {
  title: "Resale Pack | MotoIndex My Garage",
  description: "Prepare a private motorcycle ownership-history report and seller listing draft from MotoIndex My Garage records.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function GarageResalePage() {
  const catalog: GarageCatalogModel[] = publicMotorcycles
    .map((model) => {
      const schedule = maintenanceSchedules.find((item) => item.modelId === model.id);
      return {
        id: model.id,
        make: model.make,
        model: model.model,
        slug: model.slug,
        makeSlug: model.makeSlug,
        marketStatus: model.marketStatus,
        srp: model.srp,
        frontTire: model.frontTire,
        rearTire: model.rearTire,
        sourceLabel: model.sourceLabel,
        sourceUrl: model.sourceUrl,
        exactMaintenance: Boolean(schedule?.exact),
        maintenanceSourceLabel: schedule?.sourceLabel,
        maintenanceSourceUrl: schedule?.sourceUrl,
        maintenanceCheckedAt: schedule?.lastChecked,
        maintenanceItems: schedule?.items || [],
        tirePressure: schedule?.tirePressure,
      };
    })
    .sort((a,b) => a.make.localeCompare(b.make) || a.model.localeCompare(b.model));

  return <main className="page shell">
    <PageHero
      kicker="MotoIndex My Garage"
      title="Prepare your motorcycle for resale."
      description="Turn the records already in My Garage into a seller-ready ownership history and listing draft. Private plate and document references stay hidden unless you explicitly include them."
      actions={<Link className="button ghost" href="/garage">Back to My Garage</Link>}
    />
    <GarageResalePack catalog={catalog} />
  </main>;
}
