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

function RecentlyViewedMediaFallback({ make, model }: Pick<ViewedModel, "make" | "model">) {
  return <div
    role="img"
    aria-label={`${make} ${model} image being verified`}
    style={{
      display: "grid",
      placeItems: "center",
      width: "100%",
      height: "100%",
      padding: 18,
      background: "linear-gradient(145deg,#ffffff,#f8faff)",
      textAlign: "center"
    }}
  >
    <div style={{ display: "grid", justifyItems: "center", gap: 4 }}>
      <span aria-hidden="true" style={{ color: "#444CE7", fontSize: 18, lineHeight: 1 }}>◇</span>
      <strong style={{ color: "#101828", fontSize: 13, lineHeight: 1.2 }}>{make} {model}</strong>
      <small style={{ color: "#98A2B3", fontSize: 9, fontWeight: 700 }}>Image being verified</small>
    </div>
  </div>;
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
        <div className="recently-viewed-media"><EntityMedia entityType="motorcycle" entityId={model.id} sizes="(max-width: 700px) 78vw, 230px" showCredit={false} fallback={<RecentlyViewedMediaFallback make={model.make} model={model.model} />} /></div>
        <span>{model.make}</span><strong>{model.model}</strong><small>Continue →</small>
      </Link>;
    })}</div>
  </section>;
}
