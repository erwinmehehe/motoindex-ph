"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { COMPARE_KEY } from "@/components/CompareButton";

function readCount() {
  try {
    const parsed = JSON.parse(localStorage.getItem(COMPARE_KEY) || "[]");
    return Array.isArray(parsed) ? Math.min(parsed.length, 3) : 0;
  } catch {
    return 0;
  }
}

export function CompareNavBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(readCount());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("motoindex-compare", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("motoindex-compare", sync as EventListener);
    };
  }, []);

  return <Link className="nav-compare-badge" href="/compare">
    <span>Compare</span>
    <b aria-label={`${count} motorcycles selected for comparison`}>{count}</b>
  </Link>;
}
