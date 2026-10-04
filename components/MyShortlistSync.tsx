"use client";

import { useEffect } from "react";
import { SHORTLIST_KEY } from "@/components/SaveToShortlistButton";

function readLocal() {
  try {
    const value = JSON.parse(window.localStorage.getItem(SHORTLIST_KEY) || "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").slice(0, 8) : [];
  } catch {
    return [];
  }
}

export function MyShortlistSync() {
  useEffect(() => {
    let cancelled = false;
    async function sync() {
      const response = await fetch("/api/my/shortlist", { cache: "no-store" });
      if (!response.ok || cancelled) return;
      const data = await response.json();
      const cloud = Array.isArray(data.modelIds) ? data.modelIds.filter((item: unknown): item is string => typeof item === "string") : [];
      const local = readLocal();
      const merged = [...new Set([...cloud, ...local])].slice(0, 8);
      window.localStorage.setItem(SHORTLIST_KEY, JSON.stringify(merged));
      window.dispatchEvent(new CustomEvent("motoindex-shortlist"));
      if (merged.join("|") !== cloud.join("|")) {
        await fetch("/api/my/shortlist", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ modelIds: merged }),
        }).catch(() => {});
      }
    }
    void sync();
    return () => { cancelled = true; };
  }, []);
  return null;
}
