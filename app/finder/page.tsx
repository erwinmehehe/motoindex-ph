import type { Metadata } from "next";
import { publicMotorcycles } from "@/lib/data";
import { MotorcycleFinderFromQuery } from "@/components/MotorcycleFinderFromQuery";
import { pageMetadata } from "@/lib/site";
import { forClient } from "@/lib/competitors";

const models = publicMotorcycles;
export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Finder Philippines",
  description: "Find motorcycles in the Philippines by budget, inseam, use case, passenger needs, traffic, highway use, transmission, ABS, seat height and weight.",
  path: "/finder",
  index: models.length >= 3,
});

export default function FinderPage() {
  return <section className="page shell">
    <div className="page-head"><h1>Find the motorcycle that fits your actual life.</h1><p>Rank the current Philippine catalog against budget, rider fit, traffic, daily distance, passenger and luggage needs, open-road use and a transparent monthly ownership-planning estimate.</p></div>
    <MotorcycleFinderFromQuery models={forClient(models)} />
  </section>;
}
