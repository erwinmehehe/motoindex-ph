import type { Metadata } from "next";
import Link from "next/link";
import { GarageWorkspace } from "@/components/GarageWorkspace";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "My Garage | MotoIndex Philippines",
  description: "Track your motorcycle odometer, registration, insurance, PMS, fuel, repairs, parts, expenses and resale records in MotoIndex My Garage.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function GaragePage() {
  return <main className="page shell">
    <PageHero
      kicker="MotoIndex My Garage"
      title="Own the motorcycle, not the paperwork."
      description="Keep your motorcycle, renewal dates, service history, fuel, repairs, parts, expenses and resale records together. Garage data stays on this browser in this first release."
      actions={<Link className="button ghost" href="/ownership">Ownership guides</Link>}
    />
    <GarageWorkspace />
  </main>;
}
