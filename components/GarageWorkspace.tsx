"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { GarageAccountPanel } from "@/components/GarageAccountPanel";
import { GarageStatDeck } from "@/components/GarageStatDeck";
import { GarageLifecyclePanel } from "@/components/GarageLifecyclePanel";
import {
  GARAGE_DOCUMENT_ATTACHMENT_ACCEPT_ATTR,
  deleteGarageDocumentAttachment,
  deleteGarageDocumentAttachments,
  formatGarageDocumentAttachmentBytes,
  getGarageDocumentAttachment,
  listGarageDocumentAttachments,
  pruneGarageDocumentAttachments,
  saveGarageDocumentAttachment,
  type GarageDocumentAttachmentSummary,
} from "@/lib/garageDocumentStore";
import {
  GARAGE_DOCUMENT_TYPES,
  GARAGE_RECORD_CATEGORIES,
  GARAGE_STORAGE_KEY,
  GarageCatalogModel,
  GarageDocument,
  GarageDocumentType,
  GarageMotorcycle,
  GarageRecord,
  GarageRecordCategory,
  GarageState,
  daysUntil,
  emptyGarageState,
  estimatedGarageResale,
  garageOwnershipAnalytics,
  maintenanceReferenceForBike,
  money,
  parseGarageState,
  smartMaintenanceDue,
} from "@/lib/garage";

function id(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function n(value: FormDataEntryValue | null) {
  if (value === null || String(value).trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function s(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return text || undefined;
}

function dateLabel(value?: string) {
  if (!value) return "Not set";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.valueOf())) return value;
  return parsed.toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
}

function dueClass(days: number | null) {
  if (days === null || days > 30) return "buyer-decision interested";
  if (days >= 0) return "buyer-decision";
  return "buyer-decision declined";
}

function dueLabel(days: number | null) {
  if (days === null) return "Date not set";
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue`;
  if (days === 0) return "Due today";
  return `${days} day${days === 1 ? "" : "s"} left`;
}

export function GarageWorkspace({ catalog }: { catalog: GarageCatalogModel[] }) {
  const [state, setState] = useState<GarageState>(emptyGarageState);
  const [hydrated, setHydrated] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [showBikeForm, setShowBikeForm] = useState(false);
  const [documentAttachments, setDocumentAttachments] = useState<Record<string, GarageDocumentAttachmentSummary>>({});
  const [documentFileMessage, setDocumentFileMessage] = useState("");
  const backupInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loaded = parseGarageState(window.localStorage.getItem(GARAGE_STORAGE_KEY));
    setState(loaded);
    setSelectedId(loaded.motorcycles[0]?.id || "");
    setShowBikeForm(loaded.motorcycles.length === 0);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(GARAGE_STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    listGarageDocumentAttachments(state.documents.map((item) => item.id))
      .then((items) => {
        if (cancelled) return;
        setDocumentAttachments(Object.fromEntries(items.map((item) => [item.documentId, item])));
      })
      .catch(() => {
        if (!cancelled) setDocumentFileMessage("Private document files are unavailable in this browser.");
      });
    return () => { cancelled = true; };
  }, [hydrated, state.documents]);

  const selectedBike = state.motorcycles.find((bike) => bike.id === selectedId) || state.motorcycles[0];
  const selectedCatalog = selectedBike ? catalog.find((model) => model.id === (selectedBike.catalogModelId || `${selectedBike.make.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${selectedBike.model.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`)) : undefined;
  const smartMaintenance = selectedCatalog?.exactMaintenance ? smartMaintenanceDue(selectedCatalog.maintenanceItems, selectedBike?.odometerKm || 0) : [];
  const calculatedResale = selectedCatalog && selectedBike ? estimatedGarageResale(selectedCatalog.srp, selectedBike.year, selectedBike.purchaseDate) : undefined;
  const effectiveResale = selectedBike?.estimatedResaleValuePhp ?? calculatedResale;
  const bikeRecords = useMemo(() => state.records
    .filter((record) => record.motorcycleId === selectedBike?.id)
    .sort((a, b) => b.date.localeCompare(a.date)), [state.records, selectedBike?.id]);
  const bikeDocuments = useMemo(() => state.documents
    .filter((document) => document.motorcycleId === selectedBike?.id), [state.documents, selectedBike?.id]);

  const analytics = selectedBike ? garageOwnershipAnalytics(selectedBike, bikeRecords, effectiveResale) : null;
  const maintenanceReference = selectedBike ? maintenanceReferenceForBike(selectedBike) : null;

  const upcoming = useMemo(() => {
    if (!selectedBike) return [] as { label: string; value: string; days: number | null }[];
    const items = [
      { label: "LTO registration", value: selectedBike.registrationExpiry, days: daysUntil(selectedBike.registrationExpiry) },
      { label: "Insurance", value: selectedBike.insuranceExpiry, days: daysUntil(selectedBike.insuranceExpiry) },
      ...bikeRecords.filter((record) => record.nextDueDate).map((record) => ({
        label: record.title,
        value: record.nextDueDate,
        days: daysUntil(record.nextDueDate),
      })),
      ...bikeDocuments.filter((document) => document.expiryDate).map((document) => ({
        label: document.label,
        value: document.expiryDate,
        days: daysUntil(document.expiryDate),
      })),
    ].filter((item) => item.value) as { label: string; value: string; days: number | null }[];
    return items.sort((a, b) => (a.days ?? 999999) - (b.days ?? 999999)).slice(0, 8);
  }, [selectedBike, bikeRecords, bikeDocuments]);

  function addBike(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const now = new Date().toISOString();
    const catalogModelId = String(form.get("catalogModelId") || "");
    const catalogModel = catalog.find((model) => model.id === catalogModelId);
    if (!catalogModel) return;
    const year = n(form.get("year"));
    const purchaseDate = s(form.get("purchaseDate"));
    const bike: GarageMotorcycle = {
      id: id("bike"),
      catalogModelId: catalogModel.id,
      make: catalogModel.make,
      model: catalogModel.model,
      variant: s(form.get("variant")),
      year,
      plate: s(form.get("plate")),
      purchaseDate,
      purchasePricePhp: n(form.get("purchasePricePhp")),
      purchaseOdometerKm: n(form.get("purchaseOdometerKm")),
      odometerKm: n(form.get("odometerKm")) || 0,
      registrationExpiry: s(form.get("registrationExpiry")),
      insuranceExpiry: s(form.get("insuranceExpiry")),
      estimatedResaleValuePhp: n(form.get("estimatedResaleValuePhp")),
      createdAt: now,
      updatedAt: now,
    };
    setState((current) => ({ ...current, motorcycles: [...current.motorcycles, bike] }));
    setSelectedId(bike.id);
    setShowBikeForm(false);
    event.currentTarget.reset();
  }

  function addRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedBike) return;
    const form = new FormData(event.currentTarget);
    const category = String(form.get("category")) as GarageRecordCategory;
    const litersValue = n(form.get("liters"));
    const pricePerLiterValue = n(form.get("pricePerLiterPhp"));
    const enteredAmount = n(form.get("amountPhp"));
    const record: GarageRecord = {
      id: id("record"),
      motorcycleId: selectedBike.id,
      category,
      date: String(form.get("date") || new Date().toISOString().slice(0, 10)),
      title: String(form.get("title") || "").trim(),
      amountPhp: enteredAmount ?? (category === "FUEL" && litersValue !== undefined && pricePerLiterValue !== undefined ? litersValue * pricePerLiterValue : undefined),
      odometerKm: n(form.get("odometerKm")),
      liters: litersValue,
      pricePerLiterPhp: pricePerLiterValue,
      fullTank: form.get("fullTank") === "on",
      nextDueKm: n(form.get("nextDueKm")),
      nextDueDate: s(form.get("nextDueDate")),
      notes: s(form.get("notes")),
    };
    if (!record.title) return;
    setState((current) => ({
      ...current,
      records: [record, ...current.records],
      motorcycles: current.motorcycles.map((bike) => bike.id === selectedBike.id && record.odometerKm && record.odometerKm > bike.odometerKm
        ? { ...bike, odometerKm: record.odometerKm, updatedAt: new Date().toISOString() }
        : bike),
    }));
    event.currentTarget.reset();
  }

  function updateBike(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedBike) return;
    const form = new FormData(event.currentTarget);
    setState((current) => ({
      ...current,
      motorcycles: current.motorcycles.map((bike) => bike.id === selectedBike.id ? {
        ...bike,
        plate: s(form.get("plate")),
        purchaseOdometerKm: n(form.get("purchaseOdometerKm")),
        odometerKm: n(form.get("odometerKm")) ?? bike.odometerKm,
        registrationExpiry: s(form.get("registrationExpiry")),
        insuranceExpiry: s(form.get("insuranceExpiry")),
        estimatedResaleValuePhp: n(form.get("estimatedResaleValuePhp")),
        updatedAt: new Date().toISOString(),
      } : bike),
    }));
  }

  function removeRecord(recordId: string) {
    setState((current) => ({ ...current, records: current.records.filter((record) => record.id !== recordId) }));
  }

  async function removeDocument(documentId: string) {
    await deleteGarageDocumentAttachment(documentId).catch(() => {});
    setDocumentAttachments((current) => {
      const next = { ...current };
      delete next[documentId];
      return next;
    });
    setState((current) => ({ ...current, documents: current.documents.filter((document) => document.id !== documentId) }));
  }

  async function attachDocumentFile(documentId: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const saved = await saveGarageDocumentAttachment(documentId, file);
      setDocumentAttachments((current) => ({ ...current, [documentId]: saved }));
      setDocumentFileMessage(`${file.name} saved privately on this device.`);
    } catch (error) {
      setDocumentFileMessage(error instanceof Error ? error.message : "The document file could not be saved.");
    }
  }

  async function openDocumentFile(documentId: string) {
    try {
      const attachment = await getGarageDocumentAttachment(documentId);
      if (!attachment) {
        setDocumentFileMessage("That file is not stored on this device.");
        return;
      }
      const url = URL.createObjectURL(attachment.blob);
      const anchor = window.document.createElement("a");
      anchor.href = url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      setDocumentFileMessage("The document file could not be opened.");
    }
  }

  async function removeDocumentFile(documentId: string) {
    if (!window.confirm("Remove the attached file from this device? The document record will stay.")) return;
    try {
      await deleteGarageDocumentAttachment(documentId);
      setDocumentAttachments((current) => {
        const next = { ...current };
        delete next[documentId];
        return next;
      });
      setDocumentFileMessage("Attached file removed from this device.");
    } catch {
      setDocumentFileMessage("The attached file could not be removed.");
    }
  }

  function addDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedBike) return;
    const form = new FormData(event.currentTarget);
    const document: GarageDocument = {
      id: id("document"),
      motorcycleId: selectedBike.id,
      type: String(form.get("type")) as GarageDocumentType,
      label: String(form.get("label") || "").trim(),
      reference: s(form.get("reference")),
      expiryDate: s(form.get("expiryDate")),
      notes: s(form.get("notes")),
    };
    if (!document.label) return;
    setState((current) => ({ ...current, documents: [document, ...current.documents] }));
    event.currentTarget.reset();
  }

  async function removeBike() {
    if (!selectedBike || !window.confirm(`Remove ${selectedBike.make} ${selectedBike.model} and all of its local Garage records?`)) return;
    const removedDocumentIds = state.documents.filter((item) => item.motorcycleId === selectedBike.id).map((item) => item.id);
    await deleteGarageDocumentAttachments(removedDocumentIds).catch(() => {});
    setDocumentAttachments((current) => Object.fromEntries(Object.entries(current).filter(([documentId]) => !removedDocumentIds.includes(documentId))));
    const nextBikes = state.motorcycles.filter((bike) => bike.id !== selectedBike.id);
    setState((current) => ({
      ...current,
      motorcycles: nextBikes,
      records: current.records.filter((record) => record.motorcycleId !== selectedBike.id),
      documents: current.documents.filter((document) => document.motorcycleId !== selectedBike.id),
    }));
    setSelectedId(nextBikes[0]?.id || "");
    setShowBikeForm(nextBikes.length === 0);
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `motoindex-garage-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function importBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const imported = parseGarageState(await file.text());
    if (!window.confirm(`Replace this browser's Garage with ${imported.motorcycles.length} motorcycle${imported.motorcycles.length === 1 ? "" : "s"} from the backup?`)) {
      event.target.value = "";
      return;
    }
    await pruneGarageDocumentAttachments(imported.documents.map((item) => item.id)).catch(() => {});
    setState(imported);
    setSelectedId(imported.motorcycles[0]?.id || "");
    setShowBikeForm(imported.motorcycles.length === 0);
    event.target.value = "";
  }

  if (!hydrated) return <section className="note-box"><strong>Opening My Garage</strong><p>Loading the ownership records stored in this browser.</p></section>;

  return <section className="garage-workspace">
    <div className="note-box">
      <strong>Local-first privacy</strong>
      <p>My Garage still works without an account. Records stay on this browser unless you explicitly save a private cloud copy after signing in. Document scans stay only in private browser storage on this device and are never included in cloud sync or JSON backups.</p>
    </div>

    <GarageAccountPanel
      garageState={state}
      onRestore={(restored) => {
        void pruneGarageDocumentAttachments(restored.documents.map((item) => item.id)).catch(() => {});
        setState(restored);
        setSelectedId(restored.motorcycles[0]?.id || "");
        setShowBikeForm(restored.motorcycles.length === 0);
      }}
    />

    <div className="section-head">
      <div>
        <span className="field-label">Ownership workspace</span>
        <strong>{state.motorcycles.length} motorcycle{state.motorcycles.length === 1 ? "" : "s"} saved on this device</strong>
      </div>
      <div className="hero-actions">
        <button className="button small" type="button" onClick={() => setShowBikeForm((value) => !value)}>Add motorcycle</button>
        <button className="button small ghost" type="button" onClick={exportBackup} disabled={state.motorcycles.length === 0}>Export backup</button>
        <button className="button small ghost" type="button" onClick={() => backupInput.current?.click()}>Import backup</button>
        <input ref={backupInput} type="file" accept="application/json" hidden onChange={importBackup} />
      </div>
    </div>

    {showBikeForm && <form className="lead-form" onSubmit={addBike}>
      <div className="section-head"><div><h2>Add a motorcycle</h2><p>Start with the bike and the dates you do not want to miss.</p></div></div>
      <div className="lead-form-grid">
        <label className="lead-form-wide">MotoIndex motorcycle
          <select name="catalogModelId" required defaultValue="">
            <option value="" disabled>Select your exact model</option>
            {catalog.map((model) => <option value={model.id} key={model.id}>{model.make} {model.model}{model.marketStatus === "previous" ? " · previous generation" : ""}</option>)}
          </select>
        </label>
        <label>Variant<input name="variant" placeholder="ABS" /></label>
        <label>Model year<input name="year" type="number" min="1950" max="2100" /></label>
        <label>Plate number<input name="plate" autoComplete="off" /></label>
        <label>Current odometer (km)<input name="odometerKm" type="number" min="0" step="1" defaultValue="0" /></label>
        <label>Purchase date<input name="purchaseDate" type="date" /></label>
        <label>Purchase price<input name="purchasePricePhp" type="number" min="0" step="1" /></label>
        <label>Odometer when purchased<input name="purchaseOdometerKm" type="number" min="0" step="1" placeholder="0 for brand new" /></label>
        <label>LTO registration expiry<input name="registrationExpiry" type="date" /></label>
        <label>Insurance expiry<input name="insuranceExpiry" type="date" /></label>
        <label>Resale value override<input name="estimatedResaleValuePhp" type="number" min="0" step="1" placeholder="Leave blank for MotoIndex estimate" /></label>
      </div>
      <div className="hero-actions"><button className="button small" type="submit">Save motorcycle</button>{state.motorcycles.length > 0 && <button className="button small ghost" type="button" onClick={() => setShowBikeForm(false)}>Cancel</button>}</div>
    </form>}

    {state.motorcycles.length === 0 ? <div className="note-box">
      <h2>Your Garage is empty.</h2>
      <p>Add your motorcycle to start tracking registration, insurance, PMS, fuel, tires, battery, repairs, parts, warranties, parking, tolls and resale records.</p>
    </div> : <>
      <div className="hero-actions" aria-label="Saved motorcycles">
        {state.motorcycles.map((bike) => <button key={bike.id} type="button" onClick={() => setSelectedId(bike.id)} className={bike.id === selectedBike?.id ? "button small" : "button small ghost"}>
          {bike.make} {bike.model}{bike.year ? ` · ${bike.year}` : ""}
        </button>)}
      </div>

      {selectedBike && <>
        <div className="section-head">
          <div>
            <span className="field-label">Current motorcycle</span>
            <strong>{selectedBike.make} {selectedBike.model}{selectedBike.variant ? ` ${selectedBike.variant}` : ""}</strong>
          </div>
          <div className="hero-actions">
            <a className="button small" href={`/garage/resale?bike=${encodeURIComponent(selectedBike.id)}`}>Prepare resale pack</a>
            <button className="button small ghost" type="button" onClick={removeBike}>Remove motorcycle</button>
          </div>
        </div>

        <GarageStatDeck
          key={selectedBike.id}
          bike={selectedBike}
          catalog={selectedCatalog}
          analytics={analytics}
          smartMaintenance={smartMaintenance}
          effectiveResale={effectiveResale}
        />

        <GarageLifecyclePanel
          bike={selectedBike}
          records={bikeRecords}
          documents={bikeDocuments}
          smartMaintenance={smartMaintenance}
        />

        {analytics && <section className="section">
          <div className="section-head"><div><h2>Ownership analytics</h2><p>Calculated from the records you log in My Garage.</p></div></div>
          <div className="spec-grid">
            <div><span>This month</span><strong>{money(analytics.currentMonthSpendPhp)}</strong><small>Logged ownership spend this calendar month</small></div>
            <div><span>Average / month</span><strong>{money(analytics.averageMonthlySpendPhp)}</strong><small>Since purchase date or first logged record</small></div>
            <div><span>Logged cost / km</span><strong>{analytics.costPerKmPhp !== undefined ? `₱${analytics.costPerKmPhp.toFixed(2)}` : "Need mileage"}</strong><small>{analytics.distanceBasis === "purchase" ? "Since purchase odometer" : analytics.distanceBasis === "first-log" ? "Since first logged odometer" : "Add purchase odometer or mileage records"}</small></div>
            <div><span>Actual fuel economy</span><strong>{analytics.fuelEconomyKmL !== undefined ? `${analytics.fuelEconomyKmL.toFixed(1)} km/L` : "Need 2 fills"}</strong><small>{analytics.fuelEconomyKmL !== undefined ? `${analytics.fuelEconomyDistanceKm?.toLocaleString()} km across full-tank fills` : "Mark two consecutive fuel entries as full tank"}</small></div>
          </div>

          <div className="split section">
            <section className="garage-panel">
              <div className="section-head"><div><h2>Where the money goes</h2><p>Logged spending by ownership category.</p></div></div>
              {analytics.categorySpend.length ? <div className="buyer-quote-list">{analytics.categorySpend.map((item) => <div className="buyer-quote-card" key={item.category}>
                <div><strong>{item.category}</strong><p>{(item.share * 100).toFixed(0)}% of logged spend</p></div>
                <div className="buyer-quote-meta"><strong>{money(item.amountPhp)}</strong></div>
              </div>)}</div> : <div className="note-box"><p>Add expenses to see your ownership cost breakdown.</p></div>}
            </section>

            <section className="garage-panel">
              <div className="section-head"><div><h2>Value & depreciation</h2><p>Purchase price compared with the current Garage value estimate.</p></div></div>
              <div className="buyer-quote-list">
                <div className="buyer-quote-card"><div><strong>Purchase price</strong></div><div className="buyer-quote-meta"><strong>{selectedBike.purchasePricePhp !== undefined ? money(selectedBike.purchasePricePhp) : "Not set"}</strong></div></div>
                <div className="buyer-quote-card"><div><strong>Current estimated value</strong></div><div className="buyer-quote-meta"><strong>{effectiveResale !== undefined ? money(effectiveResale) : "Not set"}</strong></div></div>
                <div className="buyer-quote-card"><div><strong>Estimated depreciation</strong><p>Purchase price minus current estimated value</p></div><div className="buyer-quote-meta"><strong>{analytics.depreciationPhp !== undefined ? money(analytics.depreciationPhp) : "Need purchase price"}</strong>{analytics.depreciationPct !== undefined && <small>{(analytics.depreciationPct * 100).toFixed(1)}%</small>}</div></div>
                <div className="buyer-quote-card"><div><strong>Net ownership cost</strong><p>Purchase price + logged spend − estimated current value</p></div><div className="buyer-quote-meta"><strong>{analytics.netOwnershipCostPhp !== undefined ? money(analytics.netOwnershipCostPhp) : "Need purchase price"}</strong></div></div>
              </div>
            </section>
          </div>
        </section>}

        <form className="lead-form" onSubmit={updateBike} key={selectedBike.id}>
          <div className="section-head"><div><h2>Update current motorcycle</h2><p>Refresh mileage and renewal dates after every PMS or renewal.</p></div></div>
          <div className="lead-form-grid">
            <label>Plate number<input name="plate" autoComplete="off" defaultValue={selectedBike.plate || ""} /></label>
            <label>Current odometer (km)<input name="odometerKm" type="number" min="0" step="1" defaultValue={selectedBike.odometerKm} /></label>
            <label>Odometer when purchased<input name="purchaseOdometerKm" type="number" min="0" step="1" defaultValue={selectedBike.purchaseOdometerKm ?? ""} placeholder="0 for brand new" /></label>
            <label>LTO registration expiry<input name="registrationExpiry" type="date" defaultValue={selectedBike.registrationExpiry || ""} /></label>
            <label>Insurance expiry<input name="insuranceExpiry" type="date" defaultValue={selectedBike.insuranceExpiry || ""} /></label>
            <label>Resale value override<input name="estimatedResaleValuePhp" type="number" min="0" step="1" defaultValue={selectedBike.estimatedResaleValuePhp ?? ""} placeholder={calculatedResale ? String(calculatedResale) : ""} /></label>
          </div>
          <button className="button small" type="submit">Update motorcycle</button>
        </form>

        {selectedCatalog && <div className="spec-grid">
          <div><span>Catalog model</span><strong>{selectedCatalog.make} {selectedCatalog.model}</strong><small><a href={`/motorcycles/${selectedCatalog.makeSlug}/${selectedCatalog.slug}`}>Open model page →</a></small></div>
          <div><span>Stock tires</span><strong>{selectedCatalog.frontTire}</strong><small>Front · Rear {selectedCatalog.rearTire}</small></div>
          <div><span>Tire pressure</span><strong>{selectedCatalog.tirePressure ? `${selectedCatalog.tirePressure.soloFrontPsi} / ${selectedCatalog.tirePressure.soloRearPsi} psi` : "Verify manual"}</strong><small>{selectedCatalog.tirePressure ? "Solo front / rear" : "No exact pressure record in MotoIndex yet"}</small></div>
          <div><span>Maintenance data</span><strong>{selectedCatalog.exactMaintenance ? "Exact model" : "Brand guidance only"}</strong><small>{selectedCatalog.exactMaintenance ? "Owner-manual schedule available" : "MotoIndex will not invent model-specific intervals"}</small></div>
        </div>}

        {selectedCatalog?.exactMaintenance && smartMaintenance.length > 0 && <section className="section">
          <div className="section-head"><div><h2>Smart maintenance</h2><p>Calculated from the verified model schedule and your current odometer.</p></div></div>
          <div className="buyer-quote-list">
            {smartMaintenance.map((item) => <div className="buyer-quote-card" key={item.item}>
              <div><span className="field-label">{item.action}</span><strong>{item.item}</strong><p>{item.interval}{item.note ? ` · ${item.note}` : ""}</p></div>
              <div className="buyer-quote-meta">
                {item.nextDueKm !== undefined ? <>
                  <strong className={item.remainingKm !== undefined && item.remainingKm <= 0 ? "buyer-decision declined" : item.remainingKm !== undefined && item.remainingKm <= 1000 ? "buyer-decision" : "buyer-decision interested"}>{item.nextDueKm.toLocaleString()} km</strong>
                  <small>{item.remainingKm !== undefined && item.remainingKm <= 0 ? `${Math.abs(item.remainingKm).toLocaleString()} km overdue` : `${item.remainingKm?.toLocaleString()} km remaining`}</small>
                </> : <small>Time-based or manual inspection interval. Follow the source schedule.</small>}
              </div>
            </div>)}
          </div>
        </section>}

        {maintenanceReference && <div className="info-card">
          <span className="field-label">{maintenanceReference.level} maintenance source</span>
          <strong>{maintenanceReference.label}</strong>
          <p>{maintenanceReference.summary}</p>
          <a href={maintenanceReference.sourceUrl} target="_blank" rel="noreferrer">Open verified maintenance source ↗</a>
        </div>}

        <div className="split section">
          <section className="garage-panel">
            <div className="section-head"><div><h2>Upcoming</h2><p>Renewals and service dates that need attention.</p></div></div>
            {upcoming.length ? <div className="buyer-quote-list">{upcoming.map((item, index) => <div className="buyer-quote-card" key={`${item.label}-${item.value}-${index}`}>
              <div><strong>{item.label}</strong><p>{dateLabel(item.value)}</p></div>
              <div className="buyer-quote-meta"><strong className={dueClass(item.days)}>{dueLabel(item.days)}</strong></div>
            </div>)}</div> : <div className="note-box"><p>No renewal or service due dates saved yet.</p></div>}
          </section>

          <section className="garage-panel">
            <div className="section-head"><div><h2>Add ownership record</h2><p>PMS, fuel, tires, battery, repairs, accidents, parts and expenses.</p></div></div>
            <form className="lead-form" onSubmit={addRecord}>
              <div className="lead-form-grid">
                <label>Type<select name="category" defaultValue="PMS">{GARAGE_RECORD_CATEGORIES.map((category) => <option value={category} key={category}>{category}</option>)}</select></label>
                <label>Date<input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} /></label>
                <label className="lead-form-wide">What happened?<input name="title" required placeholder="Engine oil change" /></label>
                <label>Amount (₱)<input name="amountPhp" type="number" min="0" step="0.01" /></label>
                <label>Odometer (km)<input name="odometerKm" type="number" min="0" step="1" defaultValue={selectedBike.odometerKm} /></label>
                <label>Fuel liters<input name="liters" type="number" min="0" step="0.01" /></label>
                <label>Fuel price/L<input name="pricePerLiterPhp" type="number" min="0" step="0.01" /></label>
                <label>Full-tank fill-up<select name="fullTank" defaultValue=""><option value="">No / not sure</option><option value="on">Yes, filled to full</option></select></label>
                <label>Next due (km)<input name="nextDueKm" type="number" min="0" step="1" /></label>
                <label>Next due date<input name="nextDueDate" type="date" /></label>
                <label className="lead-form-wide">Notes<input name="notes" placeholder="Shop, parts used, warranty details or repair notes" /></label>
              </div>
              <button className="button small" type="submit">Add record</button>
            </form>
          </section>
        </div>

        <div className="split section">
          <section className="garage-panel">
            <div className="section-head"><div><h2>Ownership history</h2><p>Your most recent activity for this motorcycle.</p></div></div>
            {bikeRecords.length ? <div className="buyer-quote-list">{bikeRecords.slice(0, 20).map((record) => <div className="buyer-quote-card" key={record.id}>
              <div><span className="field-label">{record.category}</span><strong>{record.title}</strong><p>{dateLabel(record.date)}{record.odometerKm !== undefined ? ` · ${record.odometerKm.toLocaleString()} km` : ""}{record.notes ? ` · ${record.notes}` : ""}</p></div>
              <div className="buyer-quote-meta">{record.amountPhp !== undefined && <strong>{money(record.amountPhp)}</strong>}{record.nextDueKm !== undefined && <small>Next at {record.nextDueKm.toLocaleString()} km</small>}{record.nextDueDate && <small>Next {dateLabel(record.nextDueDate)}</small>}<button className="button small ghost" type="button" onClick={() => removeRecord(record.id)}>Delete</button></div>
            </div>)}</div> : <div className="note-box"><p>No ownership records yet.</p></div>}
          </section>

          <section className="garage-panel">
            <div className="section-head"><div><h2>Document wallet</h2><p>Track OR/CR, CTPL, insurance, warranty, receipts and resale paperwork.</p></div></div>
            <form className="lead-form" onSubmit={addDocument}>
              <p className="muted-note">Attach an optional PDF, JPG, PNG or WebP scan up to 10 MB. Files stay only in private browser storage on this device. Cloud sync and JSON backups include the document record, not the scan.</p>{documentFileMessage && <p className="muted-note" role="status">{documentFileMessage}</p>}
              <div className="lead-form-grid">
                <label>Document<select name="type" defaultValue="OR">{GARAGE_DOCUMENT_TYPES.map((type) => <option value={type} key={type}>{type.replaceAll("_", " ")}</option>)}</select></label>
                <label>Label<input name="label" required placeholder="2026 Official Receipt" /></label>
                <label>Reference / last digits<input name="reference" autoComplete="off" placeholder="Optional" /></label>
                <label>Expiry date<input name="expiryDate" type="date" /></label>
                <label className="lead-form-wide">Notes<input name="notes" placeholder="Where the original is kept, renewal notes, buyer transfer checklist" /></label>
              </div>
              <button className="button small" type="submit">Save document record</button>
            </form>
            {bikeDocuments.length > 0 && <div className="buyer-quote-list">{bikeDocuments.map((document) => { const attachment = documentAttachments[document.id]; return <div className="buyer-quote-card" key={document.id}>
              <div><span className="field-label">{document.type.replaceAll("_", " ")}</span><strong>{document.label}</strong><p>{document.reference ? `Reference: ${document.reference}` : "No reference saved"}{document.notes ? ` · ${document.notes}` : ""}</p>{attachment && <small>{attachment.name} · {formatGarageDocumentAttachmentBytes(attachment.size)} · stored on this device</small>}</div>
              <div className="buyer-quote-meta">{document.expiryDate && <><strong className={dueClass(daysUntil(document.expiryDate))}>{dateLabel(document.expiryDate)}</strong><small>{dueLabel(daysUntil(document.expiryDate))}</small></>}{attachment ? <><button className="button small ghost" type="button" onClick={() => openDocumentFile(document.id)}>Open file</button><button className="button small ghost" type="button" onClick={() => removeDocumentFile(document.id)}>Remove file</button></> : <label className="button small ghost">Attach file<input type="file" hidden accept={GARAGE_DOCUMENT_ATTACHMENT_ACCEPT_ATTR} onChange={(event) => attachDocumentFile(document.id, event)} /></label>}<button className="button small ghost" type="button" onClick={() => removeDocument(document.id)}>Delete record</button></div>
            </div>; })}</div>}
          </section>
        </div>
      </>}
    </>}
  </section>;
}
