"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";

export type HomeSearchModel = {
  id: string;
  make: string;
  makeSlug: string;
  model: string;
  slug: string;
  category: string;
  engineCc: number;
  priceLabel: string;
};

const CATEGORY_OPTIONS = ["All", "Scooter", "Underbone", "Naked", "Sports", "Adventure", "Big Bike"] as const;
type CategoryOption = (typeof CATEGORY_OPTIONS)[number];

function matchesCategory(model: HomeSearchModel, category: CategoryOption) {
  if (category === "All") return true;
  if (category === "Big Bike") return model.engineCc >= 400;
  const haystack = model.category.toLowerCase();
  if (category === "Sports") return haystack.includes("sport");
  return haystack.includes(category.toLowerCase());
}

export function HomeMotoSearch({ models }: { models: HomeSearchModel[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryOption>("All");
  const [focused, setFocused] = useState(false);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return models
      .filter((model) => matchesCategory(model, category))
      .filter((model) => !needle || `${model.make} ${model.model} ${model.category}`.toLowerCase().includes(needle))
      .slice(0, 6);
  }, [category, models, query]);

  function submit(event: FormEvent<HTMLFormElement>) {
    if (query.trim() || category === "All") return;
    event.preventDefault();
    const first = models.find((model) => matchesCategory(model, category));
    if (first) window.location.assign(`/motorcycles/${first.makeSlug}/${first.slug}`);
  }

  return <div className="wire-home-search">
    <form className="mi-search wire-search-form" action="/motorcycles" method="get" role="search" onSubmit={submit}>
      <label className="sr-only" htmlFor="mi-home-search">Search motorcycles by brand or model</label>
      <span className="wire-search-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="m20 20-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      </span>
      <input
        id="mi-home-search"
        type="search"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => window.setTimeout(() => setFocused(false), 120)}
        placeholder="Search NMAX, ADV, Click, Honda..."
        autoComplete="off"
        aria-autocomplete="list"
        aria-controls="mi-home-search-results"
      />
      {category !== "All" && <input type="hidden" name="type" value={category} />}
      <button type="submit" aria-label="Search motorcycles">
        Search
        <span aria-hidden="true">→</span>
      </button>
    </form>

    {focused && matches.length > 0 && <div id="mi-home-search-results" className="wire-search-results" role="listbox" aria-label="Motorcycle search suggestions">
      {matches.map((model) => <Link key={model.id} href={`/motorcycles/${model.makeSlug}/${model.slug}`} role="option">
        <span><strong>{model.make} {model.model}</strong><small>{model.category} · {model.engineCc} cc</small></span>
        <b>{model.priceLabel}</b>
      </Link>)}
    </div>}

    <div className="wire-category-pills" aria-label="Quick motorcycle categories">
      {CATEGORY_OPTIONS.slice(1).map((option) => <button
        key={option}
        type="button"
        className={category === option ? "active" : ""}
        aria-pressed={category === option}
        onClick={() => setCategory((current) => current === option ? "All" : option)}
      >{option}</button>)}
    </div>
  </div>;
}
