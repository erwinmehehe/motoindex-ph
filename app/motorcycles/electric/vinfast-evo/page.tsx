import type { Metadata } from "next";
import ElectricModelPage, { generateMetadata as generateElectricMetadata } from "../[slug]/page";

function evoParams() {
  return Promise.resolve({ slug: "vinfast-evo" });
}

export function generateMetadata(): Promise<Metadata> {
  return generateElectricMetadata({ params: evoParams() });
}

export default function VinFastEvoPage() {
  return ElectricModelPage({ params: evoParams() });
}
