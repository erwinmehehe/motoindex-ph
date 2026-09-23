import type { Metadata } from "next";
import Link from "next/link";
import { GarageWorkspace } from "@/components/GarageWorkspace";
import { PageHero } from "@/components/ui";
import { publicMotorcycles } from "@/lib/data";
import type { GarageCatalogMotorcycle } from "@/lib/garage";

export const metadata: Metadata = {
  title: "My Garage | MotoIndex Philippines",
  description: "Track your motorcycle odometer, registration, insurance, PMS, fuel, repairs, parts, expenses and resale records in MotoIndex My Garage.",
  robots: { index: false, follow: false, noarchive: true },
};

const garageCatalog: GarageCatalogMotorcycle[] = publicMotorcycles
  .map((model) => ({
    id: model.id,
    make: model.make,
    makeSlug: model.makeSlug,
    model: model.model,
    slug: model.slug,
    generation: model.generation,
    srp: model.srp,
    frontTire: model.frontTire,
    rearTire: model.rearTire,
    fuelConsumptionKmL: model.fuelConsumptionKmL,
    href: `/motorcycles/${model.makeSlug}/${model.slug}`,
  }))
  .sort((a, b) => a.make.localeCompare(b.make) || a.model.localeCompare(b.model));

export default function GaragePage() {
  return <main className="page shell">
    <PageHero
      kicker="MotoIndex My Garage"
      title="Own the motorcycle, not the paperwork."
      description="Link your bike to the MotoIndex catalog to track renewals, service history, real fuel use, verified maintenance schedules, tire fitment and estimated resale value."
      actions={<Link className="button ghost" href="/ownership">Ownership guides</Link>}
    />
    <GarageWorkspace catalog={garageCatalog} />
  </main>;
}
