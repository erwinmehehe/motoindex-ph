import type { Metadata } from "next";
import Link from "next/link";
import { GarageWorkspace } from "@/components/GarageWorkspace";
import { PageHero } from "@/components/ui";
import { publicMotorcycles } from "@/lib/data";
import { maintenanceSchedules } from "@/lib/maintenance";
import type { GarageCatalogModel } from "@/lib/garage";

export const metadata: Metadata = {
  title: "My Garage | MotoIndex Philippines",
  description: "Track motorcycle renewals, PMS, fuel, repairs, actual ownership costs, fuel economy and resale value in MotoIndex My Garage.",
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
        engineCc: model.engineCc,
        powerHp: model.powerHp,
        torqueNm: model.torqueNm,
        curbWeightKg: model.curbWeightKg,
        seatHeightMm: model.seatHeightMm,
        fuelTankL: model.fuelTankL,
        fuelConsumptionKmL: model.fuelConsumptionKmL,
        groundClearanceMm: model.groundClearanceMm,
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
      description="Keep renewals, service history, fuel, repairs and resale records together, then turn those logs into actual monthly spend, cost per kilometer and full-tank fuel economy. Garage data stays on this browser in this first release."
      actions={<Link className="button ghost" href="/ownership">Ownership guides</Link>}
    />
    <GarageWorkspace catalog={catalog} />
  </main>;
}
