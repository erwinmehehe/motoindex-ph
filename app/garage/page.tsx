import type { Metadata } from "next";
import Link from "next/link";
import { GarageWorkspace } from "@/components/GarageWorkspace";
import { PageHero } from "@/components/ui";
import { publicMotorcycles } from "@/lib/data";
import { maintenanceSchedules } from "@/lib/maintenance";
import type { GarageCatalogModel } from "@/lib/garage";

export const metadata: Metadata = {
  title: "My Garage | MotoIndex Philippines",
  description: "Track your motorcycle odometer, registration, insurance, PMS, fuel, repairs, parts, expenses and resale records in MotoIndex My Garage.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function GaragePage() {
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
      title="Own the motorcycle, not the paperwork."
      description="Keep your motorcycle, renewal dates, service history, fuel, repairs, parts, expenses and resale records together. Garage data stays on this browser in this first release."
      actions={<Link className="button ghost" href="/ownership">Ownership guides</Link>}
    />
    <GarageWorkspace catalog={catalog} />
  </main>;
}
