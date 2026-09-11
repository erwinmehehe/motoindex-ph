import type { ReactNode } from "react";
import { motorcycles } from "@/lib/data";

export function generateStaticParams() {
  return [...new Set(motorcycles.map((m) => m.makeSlug))].map((make) => ({ make }));
}

export default function MotorcycleMakeLayout({ children }: { children: ReactNode }) {
  return children;
}
