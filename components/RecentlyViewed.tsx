"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EntityMedia } from "@/components/EntityMedia";

const KEY = "motoindex-recently-viewed-v1";

type ViewedModel = {
  id: string;
  make: string;
  model: string;
  makeSlug: string;
  slug: string;
};

function readIds() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function RecentlyViewedTracker({ model }: { model: ViewedModel }) {
  useEffect(() => {
    const ids = readIds().filter((id) => id !== model.id);
    const next = [model.id, ...ids].slice(0, 8);
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("motoindex-recently-viewed"));
  }, [model.id]);
  return null;
}

export function RecentlyViewedRail({ models }: { models: ViewedModel[] }) {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setIds(readIds());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("motoindex-recently-viewed", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("motoindex-recently-viewed", sync as EventListener);
    };
  }, []);

  const rows = useMemo(() => ids.map((id) => models.find((model) => model.id === id)).filter((model): model is ViewedModel => Boolean(model)), [ids, models]);
  if (!rows.length) return null;

  return <section className="recently-viewed" aria-labelledby="recently-viewed-title">
    <div className="recently-viewed-head"><div><span>Continue researching</span><h2 id="recently-viewed-title">Recently viewed motorcycles</h2></div><button type="button" onClick={() => { localStorage.removeItem(KEY); setIds([]); }}>Clear</button></div>
    <div className="recently-viewed-rail">{rows.map((model) => {
      const href = `/motorcycles/${model.makeSlug}/${model.slug}`;
      return <Link href={href} key={model.id} className="recently-viewed-card">
        <div className="recently-viewed-media"><EntityMedia entityType="motorcycle" entityId={model.id} showCredit={false} fallback={<div className="recently-viewed-fallback">{model.make.slice(0, 2).toUpperCase()}</div>} /></div>
        <span>{model.make}</span><strong>{model.model}</strong><small>Continue →</small>
      </Link>;
    })}</div>
  </section>;
}
