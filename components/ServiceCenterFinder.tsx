"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  SERVICE_CAPABILITIES,
  serviceCapabilityLabel,
  serviceCoverageCounts,
  type ServiceCapability,
  type ServiceProviderProfile,
} from "@/lib/serviceCenters";

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

export function ServiceCenterFinder({ providers }: { providers: ServiceProviderProfile[] }) {
  const [query, setQuery] = useState("");
  const [capability, setCapability] = useState<"all" | ServiceCapability>("all");
  const [brand, setBrand] = useState("all");
  const [area, setArea] = useState("all");

  const counts = useMemo(() => serviceCoverageCounts(providers), [providers]);
  const brands = useMemo(
    () => [...new Set(providers.flatMap(provider => provider.brands))].sort((a,b)=>a.localeCompare(b)),
    [providers],
  );
  const areas = useMemo(
    () => [...new Set(providers.map(provider => provider.province || provider.city).filter(Boolean))].sort((a,b)=>a.localeCompare(b)),
    [providers],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return providers.filter(provider => {
      if (capability !== "all" && !provider.capabilities.includes(capability)) return false;
      if (brand !== "all" && !provider.brands.some(item => item.toLowerCase() === brand.toLowerCase())) return false;
      if (area !== "all" && (provider.province || provider.city) !== area) return false;
      if (!needle) return true;
      return [
        provider.name,
        provider.city,
        provider.province || "",
        provider.region,
        provider.addressLabel,
        provider.providerKind,
        ...provider.brands,
        ...provider.categories,
        ...provider.capabilities.map(serviceCapabilityLabel),
      ].join(" ").toLowerCase().includes(needle);
    });
  }, [providers, query, capability, brand, area]);

  function reset() {
    setQuery("");
    setCapability("all");
    setBrand("all");
    setArea("all");
  }

  return <section className="service-center-finder">
    <form className="lead-form" onSubmit={event => event.preventDefault()}>
      <div className="lead-form-grid">
        <label className="lead-form-wide">Search service centers
          <input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Shop name, city, province, brand or service" />
        </label>
        <label>Service
          <select value={capability} onChange={event=>setCapability(event.target.value as "all" | ServiceCapability)}>
            <option value="all">All checked services ({providers.length})</option>
            {SERVICE_CAPABILITIES.map(item=><option key={item.id} value={item.id}>{item.label} ({counts[item.id]})</option>)}
          </select>
        </label>
        <label>Motorcycle brand
          <select value={brand} onChange={event=>setBrand(event.target.value)}>
            <option value="all">All brands</option>
            {brands.map(item=><option value={item} key={item}>{item}</option>)}
          </select>
        </label>
        <label>Province / area
          <select value={area} onChange={event=>setArea(event.target.value)}>
            <option value="all">All covered areas</option>
            {areas.map(item=><option value={item} key={item}>{item}</option>)}
          </select>
        </label>
      </div>
    </form>

    <div className="section-head compact">
      <div>
        <span className="section-kicker">Checked service records</span>
        <h2>{filtered.length} service provider{filtered.length === 1 ? "" : "s"} match</h2>
        <p>Capabilities appear only when the checked business record explicitly supports them. MotoIndex does not infer specialty work from a dealer name or brand relationship.</p>
      </div>
      {(query || capability !== "all" || brand !== "all" || area !== "all") && <button className="button small secondary" type="button" onClick={reset}>Reset filters</button>}
    </div>

    {filtered.length ? <div className="dealer-results">
      {filtered.map(provider => <article className="dealer-result-card" key={provider.slug}>
        <div className="dealer-card-top">
          <span className="dealer-brand">{provider.providerKind}</span>
          <span className="dealer-checked">Checked listing</span>
        </div>
        <h3>{provider.name}</h3>
        <p>{provider.addressLabel}</p>
        <div className="seller-tags">
          {provider.capabilities.map(item=><span key={item}>{serviceCapabilityLabel(item)}</span>)}
        </div>
        <div className="dealer-card-meta">
          <span>{provider.city}{provider.province ? `, ${provider.province}` : ""}</span>
          {provider.brands.length ? <span>{provider.brands.join(" · ")}</span> : null}
        </div>
        <div className="dealer-card-actions">
          <Link href={`/sellers/${provider.slug}`}>View checked profile</Link>
          {provider.phoneLabel ? <a href={phoneHref(provider.phoneLabel)}>Call</a> : null}
        </div>
        <small>Checked {provider.lastChecked || "source date unavailable"} · Service scope, pricing and appointment availability must be confirmed directly with the business.</small>
      </article>)}
    </div> : <div className="empty-state large">
      <strong>No checked provider matches these filters yet.</strong>
      <p>MotoIndex leaves unsupported specialty categories empty rather than guessing a shop&apos;s capabilities. Try a broader service or area.</p>
      <button className="button small" type="button" onClick={reset}>Show all checked providers</button>
    </div>}
  </section>;
}
