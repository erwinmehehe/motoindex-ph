"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  GARAGE_STORAGE_KEY,
  GarageCatalogModel,
  GarageRecord,
  GarageState,
  emptyGarageState,
  estimatedGarageResale,
  money,
  parseGarageState,
} from "@/lib/garage";

type SellerCondition = "fair" | "good" | "excellent";
type OwnerListingStatus = {
  id: string;
  garageMotorcycleLocalId?: string | null;
  title: string;
  status: string;
  askingPricePhp: number;
  mileageKm: number;
  location: string;
  publicUrl?: string | null;
};

function dateLabel(value?: string) {
  if (!value) return "Not recorded";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.valueOf())) return value;
  return parsed.toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
}

function recordLine(record: GarageRecord, includeAmounts: boolean, includeNotes: boolean) {
  const parts = [dateLabel(record.date), record.title];
  if (record.odometerKm !== undefined) parts.push(`${record.odometerKm.toLocaleString()} km`);
  if (includeAmounts && record.amountPhp !== undefined) parts.push(money(record.amountPhp));
  if (includeNotes && record.notes) parts.push(record.notes);
  return parts.join(" · ");
}

function shareableRecord(record: GarageRecord, includeAmounts: boolean, includeNotes: boolean) {
  return {
    category: record.category,
    date: record.date,
    title: record.title,
    odometerKm: record.odometerKm,
    nextDueKm: record.nextDueKm,
    nextDueDate: record.nextDueDate,
    amountPhp: includeAmounts ? record.amountPhp : undefined,
    notes: includeNotes ? record.notes : undefined,
  };
}

function documentStatus(state: GarageState, bikeId: string, types: string[]) {
  return state.documents.some((document) => document.motorcycleId === bikeId && types.includes(document.type));
}

function reportSection(title: string, records: GarageRecord[], includeAmounts: boolean, includeNotes: boolean) {
  if (!records.length) return `${title}\n- No records logged in My Garage\n`;
  return `${title}\n${records.map((record) => `- ${recordLine(record, includeAmounts, includeNotes)}`).join("\n")}\n`;
}

export function GarageResalePack({ catalog }: { catalog: GarageCatalogModel[] }) {
  const [state, setState] = useState<GarageState>(emptyGarageState);
  const [hydrated, setHydrated] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [condition, setCondition] = useState<SellerCondition>("good");
  const [askingPrice, setAskingPrice] = useState("");
  const [location, setLocation] = useState("");
  const [includePlate, setIncludePlate] = useState(false);
  const [includeDocumentRefs, setIncludeDocumentRefs] = useState(false);
  const [includeAmounts, setIncludeAmounts] = useState(false);
  const [includeNotes, setIncludeNotes] = useState(false);
  const [message, setMessage] = useState("");
  const [listingMessage, setListingMessage] = useState("");
  const [ownerListings, setOwnerListings] = useState<OwnerListingStatus[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    const loaded = parseGarageState(window.localStorage.getItem(GARAGE_STORAGE_KEY));
    const requestedId = new URL(window.location.href).searchParams.get("bike") || "";
    const selected = loaded.motorcycles.find((bike) => bike.id === requestedId) || loaded.motorcycles[0];
    setState(loaded);
    setSelectedId(selected?.id || "");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    void refreshOwnerListings();
  }, [hydrated]);

  async function refreshOwnerListings() {
    const response = await fetch("/api/garage/listings", { cache: "no-store" }).catch(() => null);
    if (!response?.ok) {
      setOwnerListings([]);
      return;
    }
    const data = await response.json().catch(() => ({}));
    setOwnerListings(Array.isArray(data.listings) ? data.listings : []);
  }

  const bike = state.motorcycles.find((item) => item.id === selectedId) || state.motorcycles[0];
  const model = bike ? catalog.find((item) => item.id === bike.catalogModelId) : undefined;
  const records = useMemo(() => state.records
    .filter((record) => record.motorcycleId === bike?.id)
    .sort((a,b) => b.date.localeCompare(a.date)), [state.records, bike?.id]);
  const documents = useMemo(() => state.documents.filter((document) => document.motorcycleId === bike?.id), [state.documents, bike?.id]);

  const effectiveValue = bike
    ? bike.estimatedResaleValuePhp ?? (model ? estimatedGarageResale(model.srp, bike.year, bike.purchaseDate) : undefined)
    : undefined;

  useEffect(() => {
    setAskingPrice(effectiveValue ? String(effectiveValue) : "");
  }, [bike?.id, effectiveValue]);

  if (!hydrated) return <section className="note-box"><strong>Opening Resale Pack</strong><p>Loading the ownership records stored in this browser.</p></section>;
  if (!bike) return <section className="note-box"><h2>No motorcycle to prepare yet.</h2><p>Add a motorcycle and ownership records in My Garage first.</p><a className="button small" href="/garage">Open My Garage</a></section>;

  const service = records.filter((record) => record.category === "PMS");
  const tires = records.filter((record) => record.category === "TIRE");
  const battery = records.filter((record) => record.category === "BATTERY");
  const repairs = records.filter((record) => record.category === "REPAIR");
  const accidents = records.filter((record) => record.category === "ACCIDENT");
  const parts = records.filter((record) => record.category === "PART");
  const warranty = records.filter((record) => record.category === "WARRANTY");
  const registration = records.filter((record) => record.category === "REGISTRATION");
  const insurance = records.filter((record) => record.category === "INSURANCE");
  const mileageRecords = records.filter((record) => record.odometerKm !== undefined).sort((a,b) => (a.odometerKm || 0) - (b.odometerKm || 0));

  const checklist = [
    { label: "Official Receipt (OR)", present: documentStatus(state, bike.id, ["OR"]) },
    { label: "Certificate of Registration (CR)", present: documentStatus(state, bike.id, ["CR"]) },
    { label: "CTPL / insurance record", present: documentStatus(state, bike.id, ["CTPL", "INSURANCE"]) },
    { label: "Warranty record", present: documentStatus(state, bike.id, ["WARRANTY"]) || warranty.length > 0 },
    { label: "Receipts / service paperwork", present: documentStatus(state, bike.id, ["RECEIPT"]) || service.length > 0 },
    { label: "Deed of sale", present: documentStatus(state, bike.id, ["DEED_OF_SALE"]) },
    { label: "Transfer paperwork", present: documentStatus(state, bike.id, ["TRANSFER"]) },
  ];

  const title = `${bike.year ? `${bike.year} ` : ""}${bike.make} ${bike.model}${bike.variant ? ` ${bike.variant}` : ""}`;
  const price = Number(askingPrice);
  const listingPrice = Number.isFinite(price) && price > 0 ? price : effectiveValue;
  const historySummary = [
    `${service.length} PMS/service record${service.length === 1 ? "" : "s"} logged`,
    `${repairs.length} repair record${repairs.length === 1 ? "" : "s"} logged`,
    `${parts.length} parts/modification record${parts.length === 1 ? "" : "s"} logged`,
    accidents.length ? `${accidents.length} accident record${accidents.length === 1 ? "" : "s"} logged` : "No accident records logged in My Garage",
  ].join(" · ");
  const currentListing = ownerListings.find((item) => item.garageMotorcycleLocalId === bike.id);

  async function submitListing() {
    if (!model || !bike.catalogModelId) {
      setListingMessage("Match this motorcycle to a MotoIndex catalog model in My Garage before submitting.");
      return;
    }
    if (!bike.year) {
      setListingMessage("Add the motorcycle model year in My Garage before submitting.");
      return;
    }
    if (!listingPrice || listingPrice < 3000) {
      setListingMessage("Add a realistic asking price before submitting.");
      return;
    }
    if (location.trim().length < 2) {
      setListingMessage("Add the city or province where buyers can inspect the motorcycle.");
      return;
    }

    setSubmitting(true);
    setListingMessage("");
    const response = await fetch("/api/garage/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        garageMotorcycleLocalId: bike.id,
        askingPricePhp: listingPrice,
        condition,
        location: location.trim(),
      }),
    });
    const data = await response.json().catch(() => ({}));
    setSubmitting(false);

    if (!response.ok) {
      if (response.status === 401) {
        setListingMessage("Sign in from My Garage, save this bike to the private cloud, then submit again.");
        return;
      }
      setListingMessage(data.error || "Listing submission failed.");
      return;
    }

    await refreshOwnerListings();
    setListingMessage("Submitted for MotoIndex review. It stays private until an admin verifies it for publication.");
  }

  async function withdrawListing() {
    if (!currentListing) return;
    if (!window.confirm("Withdraw this listing from MotoIndex? Buyers will no longer be able to open or inquire about it.")) return;

    setWithdrawing(true);
    setListingMessage("");
    const response = await fetch("/api/garage/listings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: currentListing.id }),
    });
    const data = await response.json().catch(() => ({}));
    setWithdrawing(false);

    if (!response.ok) {
      setListingMessage(data.error || "Listing could not be withdrawn.");
      return;
    }

    await refreshOwnerListings();
    setListingMessage("Listing withdrawn from MotoIndex.");
  }

  function buildReportText() {
    const lines = [
      "MOTOINDEX RESALE PACK",
      title,
      "",
      `Current odometer: ${bike.odometerKm.toLocaleString()} km`,
      `Condition selected by seller: ${condition}`,
      listingPrice ? `Seller asking price: ${money(listingPrice)}` : "Seller asking price: Not set",
      effectiveValue ? `MotoIndex / owner current value reference: ${money(effectiveValue)}` : "Current value reference: Not available",
      location.trim() ? `Seller location: ${location.trim()}` : "Seller location: Not set",
      includePlate && bike.plate ? `Plate: ${bike.plate}` : "Plate: Hidden from this report",
      "",
      "OWNERSHIP SUMMARY",
      historySummary,
      "",
      reportSection("PMS / SERVICE HISTORY", service, includeAmounts, includeNotes),
      reportSection("TIRE HISTORY", tires, includeAmounts, includeNotes),
      reportSection("BATTERY HISTORY", battery, includeAmounts, includeNotes),
      reportSection("REPAIRS", repairs, includeAmounts, includeNotes),
      reportSection("PARTS / MODIFICATIONS", parts, includeAmounts, includeNotes),
      reportSection("ACCIDENT RECORDS", accidents, includeAmounts, includeNotes),
      reportSection("REGISTRATION HISTORY", registration, includeAmounts, includeNotes),
      reportSection("INSURANCE HISTORY", insurance, includeAmounts, includeNotes),
      "DOCUMENT CHECKLIST",
      ...checklist.map((item) => `- ${item.present ? "Tracked" : "Not tracked"}: ${item.label}`),
      "",
      "DOCUMENT REFERENCES",
      includeDocumentRefs && documents.length
        ? documents.map((document) => `- ${document.type}: ${document.label}${document.reference ? ` · ${document.reference}` : ""}`).join("\n")
        : "Private references hidden from this report",
      "",
      "MILEAGE HISTORY",
      mileageRecords.length
        ? mileageRecords.map((record) => `- ${dateLabel(record.date)} · ${record.odometerKm?.toLocaleString()} km · ${record.title}`).join("\n")
        : "- No mileage-linked records logged",
      "",
      "DISCLOSURE",
      "This report is generated from owner-maintained MotoIndex My Garage records. Buyers should verify original documents, identity, registration status, physical condition, mileage and service evidence before purchase.",
      `Generated: ${new Date().toLocaleString("en-PH")}`,
    ];
    return lines.join("\n");
  }

  function buildListingText() {
    return [
      title,
      listingPrice ? `Asking price: ${money(listingPrice)}` : "",
      `Mileage: ${bike.odometerKm.toLocaleString()} km`,
      `Condition: ${condition}`,
      location.trim() ? `Location: ${location.trim()}` : "",
      historySummary,
      service.length ? `Recent service: ${service.slice(0, 3).map((record) => record.title).join(", ")}` : "",
      model ? `MotoIndex model: /motorcycles/${model.makeSlug}/${model.slug}` : "",
      "Original documents and motorcycle condition should be verified in person before sale.",
    ].filter(Boolean).join("\n");
  }

  async function copyText(value: string, success: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(success);
    } catch {
      setMessage("Clipboard access was blocked. Use Export seller pack instead.");
    }
  }

  function exportPack() {
    const payload = {
      exportedAt: new Date().toISOString(),
      motorcycle: {
        catalogModelId: bike.catalogModelId,
        make: bike.make,
        model: bike.model,
        variant: bike.variant,
        year: bike.year,
        odometerKm: bike.odometerKm,
        plate: includePlate ? bike.plate : undefined,
      },
      listingDraft: {
        title,
        askingPricePhp: listingPrice,
        condition,
        location: location.trim() || undefined,
      },
      history: {
        service: service.map((record) => shareableRecord(record, includeAmounts, includeNotes)),
        tires: tires.map((record) => shareableRecord(record, includeAmounts, includeNotes)),
        battery: battery.map((record) => shareableRecord(record, includeAmounts, includeNotes)),
        repairs: repairs.map((record) => shareableRecord(record, includeAmounts, includeNotes)),
        parts: parts.map((record) => shareableRecord(record, includeAmounts, includeNotes)),
        accidents: accidents.map((record) => shareableRecord(record, includeAmounts, includeNotes)),
        registration: registration.map((record) => shareableRecord(record, includeAmounts, includeNotes)),
        insurance: insurance.map((record) => shareableRecord(record, includeAmounts, includeNotes)),
      },
      documents: documents.map((document) => ({
        type: document.type,
        label: document.label,
        expiryDate: document.expiryDate,
        reference: includeDocumentRefs ? document.reference : undefined,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `motoindex-resale-pack-${bike.make.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${bike.model.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage("Seller pack exported.");
  }

  function printPack() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setMessage("Your browser blocked the print window.");
      return;
    }
    printWindow.opener = null;
    printWindow.document.title = `${title} - MotoIndex Resale Pack`;
    const style = printWindow.document.createElement("style");
    style.textContent = "body{font-family:system-ui,-apple-system,sans-serif;max-width:820px;margin:40px auto;padding:0 24px;color:#171a1d}pre{white-space:pre-wrap;font:14px/1.6 system-ui,-apple-system,sans-serif} @media print{body{margin:0;max-width:none}}";
    const pre = printWindow.document.createElement("pre");
    pre.textContent = buildReportText();
    printWindow.document.head.appendChild(style);
    printWindow.document.body.appendChild(pre);
    printWindow.focus();
    printWindow.print();
  }

  function selectBike(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedId(event.target.value);
    const url = new URL(window.location.href);
    url.searchParams.set("bike", event.target.value);
    window.history.replaceState(null, "", url);
  }

  return <section className="garage-workspace">
    <div className="note-box">
      <strong>Private by default</strong>
      <p>The resale report shows document availability, not private document numbers. Plate number, document references, logged expense amounts and internal record notes are excluded unless you explicitly switch them on below.</p>
    </div>

    {state.motorcycles.length > 1 && <form className="lead-form">
      <div className="lead-form-grid">
        <label className="lead-form-wide">Motorcycle
          <select value={bike.id} onChange={selectBike}>
            {state.motorcycles.map((item) => <option value={item.id} key={item.id}>{item.make} {item.model}{item.year ? ` · ${item.year}` : ""}</option>)}
          </select>
        </label>
      </div>
    </form>}

    <div className="spec-grid">
      <div><span>Motorcycle</span><strong>{title}</strong><small>{bike.odometerKm.toLocaleString()} km</small></div>
      <div><span>Service records</span><strong>{service.length}</strong><small>PMS entries logged</small></div>
      <div><span>Repairs / accidents</span><strong>{repairs.length} / {accidents.length}</strong><small>Owner-maintained records</small></div>
      <div><span>Documents tracked</span><strong>{checklist.filter((item) => item.present).length} / {checklist.length}</strong><small>Checklist only, not verification</small></div>
    </div>

    <section className="section">
      <div className="section-head"><div><h2>Seller listing</h2><p>Prepare the public listing fields, then submit them for MotoIndex review. Your plate, Garage documents, expense history and private notes are not included in the marketplace submission.</p></div></div>
      <form className="lead-form" onSubmit={(event) => event.preventDefault()}>
        <div className="lead-form-grid">
          <label>Asking price<input value={askingPrice} onChange={(event) => setAskingPrice(event.target.value)} type="number" min="0" step="1" placeholder={effectiveValue ? String(effectiveValue) : ""} /></label>
          <label>Condition<select value={condition} onChange={(event) => setCondition(event.target.value as SellerCondition)}><option value="excellent">Excellent</option><option value="good">Good</option><option value="fair">Fair</option></select></label>
          <label className="lead-form-wide">Location<input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="City / province" /></label>
        </div>
      </form>
      <div className="info-card">
        <span className="field-label">Listing preview</span>
        <strong>{title}</strong>
        <p>{listingPrice ? `${money(listingPrice)} · ` : ""}{bike.odometerKm.toLocaleString()} km · {condition}{location.trim() ? ` · ${location.trim()}` : ""}</p>
        <p>{historySummary}</p>
        {currentListing && <p><strong>Marketplace status: {currentListing.status.replaceAll("_", " ")}</strong>{currentListing.publicUrl ? <> · <a href={currentListing.publicUrl}>View public listing →</a></> : " · Not public yet"}</p>}
        <div className="hero-actions">
          <button className="button small" type="button" onClick={submitListing} disabled={submitting}>{submitting ? "Submitting…" : "Submit for MotoIndex review"}</button>
          <button className="button small ghost" type="button" onClick={() => copyText(buildListingText(), "Listing draft copied.")}>Copy listing draft</button>
          {currentListing && currentListing.status !== "expired" && <button className="button small ghost" type="button" onClick={withdrawListing} disabled={withdrawing}>{withdrawing ? "Withdrawing…" : "Withdraw listing"}</button>}
          {model && <a className="button small ghost" href={`/used-motorcycles/${model.makeSlug}/${model.slug}`}>Check used market</a>}
        </div>
      </div>
      {listingMessage && <p className="muted-note" role="status">{listingMessage}</p>}
    </section>

    <section className="section">
      <div className="section-head"><div><h2>Buyer-facing ownership history</h2><p>Choose what the buyer-facing report is allowed to reveal.</p></div></div>
      <form className="lead-form" onSubmit={(event) => event.preventDefault()}>
        <div className="lead-form-grid">
          <label>Plate number<select value={includePlate ? "yes" : "no"} onChange={(event) => setIncludePlate(event.target.value === "yes")}><option value="no">Hide</option><option value="yes">Include</option></select></label>
          <label>Document references<select value={includeDocumentRefs ? "yes" : "no"} onChange={(event) => setIncludeDocumentRefs(event.target.value === "yes")}><option value="no">Hide</option><option value="yes">Include</option></select></label>
          <label>Expense amounts<select value={includeAmounts ? "yes" : "no"} onChange={(event) => setIncludeAmounts(event.target.value === "yes")}><option value="no">Hide</option><option value="yes">Include</option></select></label>
          <label>Internal record notes<select value={includeNotes ? "yes" : "no"} onChange={(event) => setIncludeNotes(event.target.value === "yes")}><option value="no">Hide</option><option value="yes">Include</option></select></label>
        </div>
      </form>

      <div className="split section">
        <section className="garage-panel">
          <div className="section-head"><div><h2>Document checklist</h2><p>Tracked in Garage does not mean MotoIndex has verified the original.</p></div></div>
          <div className="buyer-quote-list">
            {checklist.map((item) => <div className="buyer-quote-card" key={item.label}><div><strong>{item.label}</strong></div><div className="buyer-quote-meta"><strong className={item.present ? "buyer-decision interested" : "buyer-decision"}>{item.present ? "Tracked" : "Not tracked"}</strong></div></div>)}
          </div>
        </section>

        <section className="garage-panel">
          <div className="section-head"><div><h2>Disclosure summary</h2><p>What your current Garage history can support.</p></div></div>
          <div className="buyer-quote-list">
            <div className="buyer-quote-card"><div><strong>PMS / service</strong></div><div className="buyer-quote-meta"><strong>{service.length}</strong></div></div>
            <div className="buyer-quote-card"><div><strong>Tires / battery</strong></div><div className="buyer-quote-meta"><strong>{tires.length} / {battery.length}</strong></div></div>
            <div className="buyer-quote-card"><div><strong>Repairs / parts</strong></div><div className="buyer-quote-meta"><strong>{repairs.length} / {parts.length}</strong></div></div>
            <div className="buyer-quote-card"><div><strong>Accident records</strong><p>{accidents.length ? "Review each logged accident before sharing." : "No accident records are logged. This is not a claim that the motorcycle is accident-free."}</p></div><div className="buyer-quote-meta"><strong>{accidents.length}</strong></div></div>
          </div>
        </section>
      </div>

      <div className="hero-actions">
        <button className="button small" type="button" onClick={printPack}>Print / save PDF</button>
        <button className="button small ghost" type="button" onClick={() => copyText(buildReportText(), "Ownership report copied.")}>Copy report</button>
        <button className="button small ghost" type="button" onClick={exportPack}>Export seller pack</button>
      </div>
      {message && <p className="muted-note" role="status">{message}</p>}
    </section>

    <section className="section">
      <div className="section-head"><div><h2>History included in the pack</h2><p>Review the records before sharing anything with a buyer.</p></div></div>
      <div className="buyer-quote-list">
        {records.filter((record) => ["PMS","TIRE","BATTERY","REPAIR","ACCIDENT","PART","WARRANTY","REGISTRATION","INSURANCE"].includes(record.category)).slice(0, 30).map((record) => <div className="buyer-quote-card" key={record.id}>
          <div><span className="field-label">{record.category}</span><strong>{record.title}</strong><p>{dateLabel(record.date)}{record.odometerKm !== undefined ? ` · ${record.odometerKm.toLocaleString()} km` : ""}</p></div>
          <div className="buyer-quote-meta">{includeAmounts && record.amountPhp !== undefined && <strong>{money(record.amountPhp)}</strong>}</div>
        </div>)}
      </div>
    </section>
  </section>;
}
