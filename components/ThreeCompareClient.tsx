"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { DetailedMotorcycleCompare } from "@/components/DetailedMotorcycleCompare";
import { ThreeWayHighlights } from "@/components/ThreeWayHighlights";

export function ThreeCompareClient({ models }: { models: Motorcycle[] }) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("bikes") || "";
    setSlugs([...new Set(value.split(",").filter(Boolean))].slice(0, 3));
  }, []);

  const selected = useMemo(
    () => slugs.map(slug => models.find(model => model.slug === slug)).filter((model): model is Motorcycle => Boolean(model)),
    [models, slugs]
  );

  if (selected.length !== 3) {
    return <div className="note-box"><h2>Choose three current motorcycles</h2><p>Use the comparison builder or your shortlist to create this page.</p><Link className="button small" href="/compare">Open comparison builder</Link></div>;
  }

  return <><ThreeWayHighlights models={selected}/><DetailedMotorcycleCompare models={selected}/></>;
}
