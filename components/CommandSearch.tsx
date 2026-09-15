"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchItem } from "@/lib/searchQuery";
import { searchItemMatches, searchItemScore } from "@/lib/searchQuery";
import styles from "./CommandSearch.module.css";

const intents = ["Aerox", "under 100k", "160cc scooter", "low seat", "ABS", "heavy traffic"];

export function CommandSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(value => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => inputRef.current?.focus(), 0);
    if (!items.length && !loading) {
      setLoading(true);
      fetch("/api/search-index")
        .then(response => response.ok ? response.json() : Promise.reject(new Error("search index unavailable")))
        .then((data: SearchItem[]) => setItems(Array.isArray(data) ? data : []))
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    }
    return () => { document.body.style.overflow = ""; };
  }, [open, items.length, loading]);

  const matches = useMemo(() => {
    const term = query.trim();
    if (!term) return [];
    return items
      .filter(item => searchItemMatches(item, term))
      .sort((a, b) => searchItemScore(b, term) - searchItemScore(a, term))
      .slice(0, 9);
  }, [items, query]);

  useEffect(() => setActive(0), [query]);

  function navigate(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  function submitSearch() {
    const term = query.trim();
    if (!term) return;
    if (matches[active]) navigate(matches[active].href);
    else navigate(`/search?q=${encodeURIComponent(term.slice(0, 160))}`);
  }

  return <>
    <button type="button" className={`${styles.trigger} nav-search`} onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
      <span>Search</span><kbd>⌘K</kbd>
    </button>
    {open && <div className={styles.backdrop} role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setOpen(false); }}>
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-label="Search MotoIndex">
        <div className={styles.searchRow}>
          <span className={styles.icon} aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            className={styles.input}
            value={query}
            onChange={event => setQuery(event.target.value)}
            onKeyDown={event => {
              if (event.key === "ArrowDown") { event.preventDefault(); setActive(value => Math.min(value + 1, Math.max(matches.length - 1, 0))); }
              if (event.key === "ArrowUp") { event.preventDefault(); setActive(value => Math.max(value - 1, 0)); }
              if (event.key === "Enter") { event.preventDefault(); submitSearch(); }
            }}
            placeholder="Search Aerox, Honda under 100k, low seat, ABS..."
            aria-label="Search motorcycles, gear, guides and tools"
            autoComplete="off"
          />
          <button type="button" className={styles.esc} onClick={() => setOpen(false)}>ESC</button>
        </div>
        <div className={styles.hint}>{intents.map(intent => <button type="button" key={intent} onClick={() => { setQuery(intent); inputRef.current?.focus(); }}>{intent}</button>)}</div>
        <div className={styles.results} role="listbox" aria-label="Search suggestions">
          {loading && <div className={styles.loading}>Loading MotoIndex search…</div>}
          {!loading && !query.trim() && <div className={styles.empty}><strong>Search by model, budget or riding need.</strong><p>Try a motorcycle name or a decision such as “automatic under 120k”.</p><Link href="/search" onClick={() => setOpen(false)}>Open full search →</Link></div>}
          {!loading && query.trim() && matches.map((item, index) => <button
            type="button"
            role="option"
            aria-selected={index === active}
            className={`${styles.result} ${index === active ? styles.active : ""}`}
            key={`${item.category}-${item.href}`}
            onMouseEnter={() => setActive(index)}
            onClick={() => navigate(item.href)}
          >
            <span><strong>{item.title}</strong><small>{item.meta}</small></span><span className={styles.category}>{item.category}</span>
          </button>)}
          {!loading && query.trim() && !matches.length && <div className={styles.empty}><strong>No instant match.</strong><p>Run the query through the full MotoIndex search for a broader result.</p><button type="button" className={styles.result} onClick={() => navigate(`/search?q=${encodeURIComponent(query.trim().slice(0, 160))}`)}><span><strong>Search for “{query.trim().slice(0, 60)}”</strong><small>Open full search results</small></span><span className={styles.category}>Search</span></button></div>}
        </div>
        <div className={styles.footer}><span>↑ ↓ choose · Enter open</span><span>Search loads only when opened</span></div>
      </div>
    </div>}
  </>;
}
