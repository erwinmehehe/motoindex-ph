"use client";

import { useEffect, useState } from "react";
import { ModelExplorer } from "@/components/ModelExplorer";
import type { Motorcycle } from "@/lib/types";

const allowedBudgets = new Set(["all", "under100", "100to150", "150to200", "over200"]);

export function ModelExplorerFromQuery({ models }: { models: Motorcycle[] }) {
  const [initialFilters, setInitialFilters] = useState<{ q: string; make: string; category: string; budget: string } | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const make = query.get("make") || "all";
    const category = query.get("type") || "all";
    const budget = query.get("budget") || "all";
    const makes = new Set(models.map((model) => model.make));
    const categories = new Set(models.map((model) => model.category));
    setInitialFilters({
      q: (query.get("q") || "").slice(0, 80),
      make: make === "all" || makes.has(make) ? make : "all",
      category: category === "all" || categories.has(category) ? category : "all",
      budget: allowedBudgets.has(budget) ? budget : "all",
    });
  }, [models]);

  if (!initialFilters) return <div className="model-explorer-v300" aria-busy="true" />;
  return <ModelExplorer models={models} initialFilters={initialFilters} />;
}
