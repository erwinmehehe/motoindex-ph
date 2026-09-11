import type { ReactNode } from "react";
import { motorcycles } from "@/lib/data";
import { modelFamilies } from "@/lib/families";

export function generateStaticParams() {
  return [
    ...motorcycles.map((m) => ({ make: m.makeSlug, slug: m.slug })),
    ...modelFamilies.map((f) => ({ make: f.makeSlug, slug: f.slug }))
  ];
}

export default function MotorcycleModelLayout({ children }: { children: ReactNode }) {
  return children;
}
