"use client";

import { useEffect, useMemo, useState } from "react";

type ModelRef = { id: string; category: string };

const GROUPS = [
  ["Scooters", /scooter/i],
  ["Underbone", /underbone/i],
  ["Naked", /naked|standard/i],
  ["Sports", /sport|supersport/i],
  ["Adventure", /adventure|dual.?sport/i]
] as const;

export function BrandCategoryTabs({ models }: { models: ModelRef[] }) {
  const [active, setActive] = useState("All");
  const groups = useMemo(() => GROUPS
    .map(([label, pattern]) => ({ label, pattern, count: models.filter((model) => pattern.test(model.category)).length }))
    .filter((group) => group.count > 0), [models]);

  useEffect(() => {
    const selected = groups.find((group) => group.label === active);
    document.querySelectorAll<HTMLElement>("[data-brand-model-category]").forEach((element) => {
      const category = element.dataset.brandModelCategory || "";
      element.hidden = active !== "All" && !(selected?.pattern.test(category));
    });
  }, [active, groups]);

  return <div className="wire-filter-tabs" aria-label="Filter motorcycle models by category">
    <button type="button" className={active === "All" ? "active" : ""} aria-pressed={active === "All"} onClick={() => setActive("All")}>All <span>{models.length}</span></button>
    {groups.map((group) => <button key={group.label} type="button" className={active === group.label ? "active" : ""} aria-pressed={active === group.label} onClick={() => setActive(group.label)}>{group.label} <span>{group.count}</span></button>)}
  </div>;
}
