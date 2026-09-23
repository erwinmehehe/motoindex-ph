"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  GARAGE_DOCUMENT_TYPES,
  GARAGE_RECORD_CATEGORIES,
  GARAGE_STORAGE_KEY,
  GarageCatalogMotorcycle,
  GarageDocument,
  GarageDocumentType,
  GarageMotorcycle,
  GarageRecord,
  GarageRecordCategory,
  GarageState,
  actualFuelEconomy,
  daysUntil,
  emptyGarageState,
  estimatedGarageResaleValue,
  guessedCatalogModelId,
  maintenanceReferenceForBike,
  money,
  parseGarageState,
  smartMaintenanceTasks,
  tireFactsForBike,
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

function dueClass(days: number | null | undefined) {
  if (days === null || days === undefined || days > 30) return "buyer-decision interested";
  if (days >= 0) return "buyer-decision";
  return "buyer-decision declined";
}

function dueLabel(days: number | null | undefined) {
  if (days === null || days === undefined) return "Date not set";
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue`;
  if (days === 0) return "Due today";
  return `${days} day${days === 1 ? "" : "s"} left`;
}

function maintenanceStatusLabel(status: "overdue" | "due-soon" | "upcoming") {
  if (status === "overdue") return "Overdue";
  if (status === "due-soon") return "Due soon";
  return "Upcoming";
}

export function GarageWorkspace({ catalog }: { catalog: GarageCatalogMotorcycle[] }) {
  const [state, setState] = useState<GarageState>(emptyGarageState);
  const [hydrated, setHydrated] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [showBikeForm, setShowBikeForm] = useState(false);
  const [newBikeCatalogId, setNewBikeCatalogId] = useState(catalog[0]?.id || "other");
  const backupInput = useRef<HTMLInputElement>(null);

  const catalogById = useMemo(() => new Map(catalog.map((model) => [model.id, model])), [catalog]);
  const groupedCatalog = useMemo(() => {
    const groups = new Map<string, GarageCatalogMotorcycle[]>();
    for (const model of catalog) groups.set(model.make, [...(groups.get(model.make) || []), model]);
    return [...groups.entries()];
  }, [catalog]);

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

  const selectedBike = state.motorcycles.find((bike) => bike.id === selectedId) || state.motorcycles[0];
  const selectedCatalog = selectedBike
    ? catalogById.get(selectedBike.catalogModelId || guessedCatalogModelId(selectedBike))
    : undefined;
  const bikeRecords = useMemo(() => state.records
    .filter((record) => record.motorcycleId === selectedBike?.id)
    .sort((a, b) => b.date.localeCompare(a.date)), [state.records, selectedBike?.id]);
  const bikeDocuments = useMemo(() => state.documents
    .filter((document) => document.motorcycleId === selectedBike?.id), [state.documents, selectedBike?.id]);

  const totalSpend = bikeRecords.reduce((sum, record) => sum + (record.amountPhp || 0), 0);
  const fuelRecords = bikeRecords.filter((record) => record.category === "FUEL");
  const liters = fuelRecords.reduce((sum, record) => sum + (record.liters || 0), 0);
  const fuelSpend = fuelRecords.reduce((sum, record) => sum + (record.amountPhp || 0), 0);
  const actualKmL = actualFuelEconomy(bikeRecords);
  const autoResaleValue = selectedBike ? estimatedGarageResaleValue(selectedBike, selectedCatalog) : undefined;
  const displayResaleValue = selectedBike?.estimatedResaleValuePhp ?? autoResaleValue;
  const maintenanceReference = selectedBike ? maintenanceReferenceForBike(selectedBike) : null;
  const maintenanceTasks = selectedBike ? smartMaintenanceTasks(selectedBike, bikeRecords) : [];
  const tireFacts = selectedBike ? tireFactsForBike(selectedBike, selectedCatalog) : null;

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
    const catalogModelId = String(form.get("catalogModelId") || "");
    const linkedModel = catalogById.get(catalogModelId);
    const now = new Date().toISOString();
    const bike: GarageMotorcycle = {
      id: id("bike"),
      catalogModelId: linkedModel?.id,
      make: linkedModel?.make || String(form.get("make") || "").trim(),
      model: linkedModel?.model || String(form.get("model") || "").trim(),
      variant: s(form.get("variant")),
      year: n(form.get("year")),
      plate: s(form.get("plate")),
      purchaseDate: s(form.get("purchaseDate")),
      purchasePricePhp: n(form.get("purchasePricePhp")),
      odometerKm: n(form.get("odometerKm")) || 0,
      registrationExpiry: s(form.get("registrationExpiry")),
      insuranceExpiry: s(form.get("insuranceExpiry")),
      estimatedResaleValuePhp: n(form.get("estimatedResaleValuePhp")),
      createdAt: now,
      updatedAt: now,
    };
    if (!bike.make || !bike.model) return;
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
      nextDueKm: n(form.get("nextDueKm")),
      nextDueDate: s(form.get("nextDueDate")),
      notes: s(form.get("notes")),
    };
    if (!record.title) return;
    setState((current) => ({
      ...current,
      records: [record, ...current.records],
      motorcycles: current.motorcycles.map((bike) => bike.id === selectedBike.id && record.odometerKm !== undefined && record.odometerKm > bike.odometerKm
        ? { ...bike, odometerKm: record.odometerKm, updatedAt: new Date().toISOString() }
        : bike),
    }));
    event.currentTarget.reset();
  }

  function updateBike(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedBike) return;
    const form = new FormData(event.currentTarget);
    const linkedModel = catalogById.get(String(form.get("catalogModelId") || ""));
    setState((current) => ({
      ...current,
      motorcycles: current.motorcycles.map((bike) => bike.id === selectedBike.id ? {
        ...bike,
        catalogModelId: linkedModel?.id,
        make: linkedModel?.make || bike.make,
        model: linkedModel?.model || bike.model,
        plate: s(form.get("plate")),
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

  function removeDocument(documentId: string) {
    setState((current) => ({ ...current, documents: current.documents.filter((document) => document.id !== documentId) }));
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

  function removeBike() {
    if (!selectedBike || !window.confirm(`Remove ${selectedBike.make} ${selectedBike.model} and all of its local Garage records?`)) return;
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
    setState(imported);
    setSelectedId(imported.motorcycles[0]?.id || "");
    setShowBikeForm(imported.motorcycles.length === 0);
    event.target.value = "";
  }

  if (!hydrated) return <section className="note-box"><strong>Opening My Garage</strong><p>Loading the ownership records stored in this browser.</p></section>;

  return <section className="garage-workspace">
    <div className="note-box">
      <strong>Local-first privacy</strong>
      <p>Garage records stay in this browser. Link a motorcycle to the MotoIndex catalog to use verified maintenance guidance, tire specifications and a model-based resale estimate without uploading your private ownership history.</p>
    </div>

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
      <div className="section-head"><div><h2>Add a motorcycle</h2><p>Choose a MotoIndex model to use model-specific maintenance and ownership data.</p></div></div>
      <div className="lead-form-grid">
        <label className="lead-form-wide">MotoIndex motorcycle
          <select name="catalogModelId" value={newBikeCatalogId} onChange={(event) => setNewBikeCatalogId(event.target.value)}>
            {groupedCatalog.map(([make, models]) => <optgroup label={make} key={make}>{models.map((model) => <option value={model.id} key={model.id}>{model.model} · {money(model.srp)}</option>)}</optgroup>)}
            <option value="other">Other / not listed</option>
          </select>
        </label>
        {newBikeCatalogId === "other" && <>
          <label>Make<input name="make" required placeholder="Honda" /></label>
          <label>Model<input name="model" required placeholder="Click 160" /></label>
        </>}
        <label>Variant<input name="variant" placeholder="ABS / trim" /></label>
        <label>Model year<input name="year" type="number" min="1950" max="2100" /></label>
        <label>Plate number<input name="plate" autoComplete="off" /></label>
        <label>Current odometer (km)<input name="odometerKm" type="number" min="0" step="1" defaultValue="0" /></label>
        <label>Purchase date<input name="purchaseDate" type="date" /></label>
        <label>Purchase price<input name="purchasePricePhp" type="number" min="0" step="1" /></label>
        <label>LTO registration expiry<input name="registrationExpiry" type="date" /></label>
        <label>Insurance expiry<input name="insuranceExpiry" type="date" /></label>
        <label>Manual resale value override<input name="estimatedResaleValuePhp" type="number" min="0" step="1" /></label>
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
            <span className="field-label">{selectedCatalog ? "Linked MotoIndex motorcycle" : "Unlinked motorcycle"}</span>
            <strong>{selectedBike.make} {selectedBike.model}{selectedBike.variant ? ` ${selectedBike.variant}` : ""}</strong>
          </div>
          <div className="hero-actions">
            {selectedCatalog && <Link className="button small ghost" href={selectedCatalog.href}>View model</Link>}
            <button className="button small ghost" type="button" onClick={removeBike}>Remove motorcycle</button>
          </div>
        </div>

        <div className="spec-grid">
          <div className="garage-summary-item"><span>Odometer</span><strong>{selectedBike.odometerKm.toLocaleString()} km</strong><small>Current saved reading</small></div>
          <div className="garage-summary-item"><span>Total logged spend</span><strong>{money(totalSpend)}</strong><small>Fuel, PMS, repairs, parts and other recorded costs</small></div>
          <div className="garage-summary-item"><span>Actual fuel economy</span><strong>{actualKmL ? `${actualKmL.toFixed(1)} km/L` : "Not enough data"}</strong><small>{selectedCatalog?.fuelConsumptionKmL ? `MotoIndex reference: ${selectedCatalog.fuelConsumptionKmL} km/L` : liters ? `${liters.toFixed(1)} L logged` : "Log two full fill-ups with odometer readings"}</small></div>
          <div className="garage-summary-item"><span>Estimated resale</span><strong>{money(displayResaleValue)}</strong><small>{selectedBike.estimatedResaleValuePhp !== undefined ? "Manual owner estimate" : selectedCatalog ? "MotoIndex depreciation estimate" : "Link a MotoIndex model to estimate"}</small></div>
        </div>

        <form className="lead-form" onSubmit={updateBike} key={selectedBike.id}>
          <div className="section-head"><div><h2>Update current motorcycle</h2><p>Link older Garage records to a MotoIndex model and refresh mileage or renewal dates.</p></div></div>
          <div className="lead-form-grid">
            <label className="lead-form-wide">Linked MotoIndex model
              <select name="catalogModelId" defaultValue={selectedCatalog?.id || ""}>
                <option value="">Keep unlinked</option>
                {groupedCatalog.map(([make, models]) => <optgroup label={make} key={make}>{models.map((model) => <option value={model.id} key={model.id}>{model.model} · {money(model.srp)}</option>)}</optgroup>)}
              </select>
            </label>
            <label>Plate number<input name="plate" autoComplete="off" defaultValue={selectedBike.plate || ""} /></label>
            <label>Current odometer (km)<input name="odometerKm" type="number" min="0" step="1" defaultValue={selectedBike.odometerKm} /></label>
            <label>LTO registration expiry<input name="registrationExpiry" type="date" defaultValue={selectedBike.registrationExpiry || ""} /></label>
            <label>Insurance expiry<input name="insuranceExpiry" type="date" defaultValue={selectedBike.insuranceExpiry || ""} /></label>
            <label>Manual resale value override<input name="estimatedResaleValuePhp" type="number" min="0" step="1" defaultValue={selectedBike.estimatedResaleValuePhp ?? ""} /></label>
          </div>
          <button className="button small" type="submit">Update motorcycle</button>
        </form>

        {selectedCatalog && tireFacts && <div className="info-card">
          <span className="field-label">Model-aware ownership data</span>
          <strong>{selectedCatalog.make} {selectedCatalog.model}</strong>
          <p>Front tire: <b>{tireFacts.frontTire}</b> · Rear tire: <b>{tireFacts.rearTire}</b>{tireFacts.tirePressure ? ` · Solo pressure: ${tireFacts.tirePressure.soloFrontPsi} PSI front / ${tireFacts.tirePressure.soloRearPsi} PSI rear` : ""}</p>
          <Link href={selectedCatalog.href}>Open full model specifications →</Link>
        </div>}

        {maintenanceReference && <div className="info-card">
          <span className="field-label">{maintenanceReference.level} maintenance source</span>
          <strong>{maintenanceReference.label}</strong>
          <p>{maintenanceReference.summary}</p>
          <a href={maintenanceReference.sourceUrl} target="_blank" rel="noreferrer">Open verified maintenance source ↗</a>
        </div>}

        <div className="split section">
          <section className="garage-panel">
            <div className="section-head"><div><h2>Smart maintenance</h2><p>Automatic due calculations only appear where MotoIndex has structured verified maintenance evidence.</p></div></div>
            {maintenanceTasks.length ? <div className="buyer-quote-list">{maintenanceTasks.map((task) => <div className="buyer-quote-card" key={task.item}>
              <div><span className="field-label">{task.sourceLevel}</span><strong>{task.item}</strong><p>{task.action}{task.nextDueKm !== undefined ? ` · due at ${task.nextDueKm.toLocaleString()} km` : ""}{task.nextDueDate ? ` · ${dateLabel(task.nextDueDate)}` : ""}</p></div>
              <div className="buyer-quote-meta">
                <strong className={task.status === "overdue" ? "buyer-decision declined" : task.status === "due-soon" ? "buyer-decision" : "buyer-decision interested"}>{maintenanceStatusLabel(task.status)}</strong>
                {task.kmRemaining !== undefined && <small>{task.kmRemaining < 0 ? `${Math.abs(task.kmRemaining).toLocaleString()} km overdue` : `${task.kmRemaining.toLocaleString()} km remaining`}</small>}
                {task.daysRemaining !== undefined && <small>{dueLabel(task.daysRemaining)}</small>}
              </div>
            </div>)}</div> : <div className="note-box"><p>No automatic schedule is published for this exact model yet. Use the verified source above and add manual due dates to PMS records rather than relying on guessed intervals.</p></div>}
          </section>

          <section className="garage-panel">
            <div className="section-head"><div><h2>Renewals</h2><p>LTO, insurance and manually saved due dates.</p></div></div>
            {upcoming.length ? <div className="buyer-quote-list">{upcoming.map((item, index) => <div className="buyer-quote-card" key={`${item.label}-${item.value}-${index}`}>
              <div><strong>{item.label}</strong><p>{dateLabel(item.value)}</p></div>
              <div className="buyer-quote-meta"><strong className={dueClass(item.days)}>{dueLabel(item.days)}</strong></div>
            </div>)}</div> : <div className="note-box"><p>No renewal or service due dates saved yet.</p></div>}
          </section>
        </div>

        <div className="split section">
          <section className="garage-panel">
            <div className="section-head"><div><h2>Add ownership record</h2><p>For automatic PMS matching, use the maintenance item name, such as “Engine oil”.</p></div></div>
            <form className="lead-form" onSubmit={addRecord}>
              <div className="lead-form-grid">
                <label>Type<select name="category" defaultValue="PMS">{GARAGE_RECORD_CATEGORIES.map((category) => <option value={category} key={category}>{category}</option>)}</select></label>
                <label>Date<input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} /></label>
                <label className="lead-form-wide">What happened?<input name="title" required placeholder="Engine oil" /></label>
                <label>Amount (₱)<input name="amountPhp" type="number" min="0" step="0.01" /></label>
                <label>Odometer (km)<input name="odometerKm" type="number" min="0" step="1" defaultValue={selectedBike.odometerKm} /></label>
                <label>Fuel liters<input name="liters" type="number" min="0" step="0.01" /></label>
                <label>Fuel price/L<input name="pricePerLiterPhp" type="number" min="0" step="0.01" /></label>
                <label>Manual next due (km)<input name="nextDueKm" type="number" min="0" step="1" /></label>
                <label>Manual next due date<input name="nextDueDate" type="date" /></label>
                <label className="lead-form-wide">Notes<input name="notes" placeholder="Shop, parts used, warranty details or repair notes" /></label>
              </div>
              <button className="button small" type="submit">Add record</button>
            </form>
          </section>

          <section className="garage-panel">
            <div className="section-head"><div><h2>Ownership history</h2><p>Your most recent activity for this motorcycle.</p></div></div>
            {bikeRecords.length ? <div className="buyer-quote-list">{bikeRecords.slice(0, 20).map((record) => <div className="buyer-quote-card" key={record.id}>
              <div><span className="field-label">{record.category}</span><strong>{record.title}</strong><p>{dateLabel(record.date)}{record.odometerKm !== undefined ? ` · ${record.odometerKm.toLocaleString()} km` : ""}{record.notes ? ` · ${record.notes}` : ""}</p></div>
              <div className="buyer-quote-meta">{record.amountPhp !== undefined && <strong>{money(record.amountPhp)}</strong>}{record.nextDueKm !== undefined && <small>Next at {record.nextDueKm.toLocaleString()} km</small>}{record.nextDueDate && <small>Next {dateLabel(record.nextDueDate)}</small>}<button className="button small ghost" type="button" onClick={() => removeRecord(record.id)}>Delete</button></div>
            </div>)}</div> : <div className="note-box"><p>No ownership records yet.</p></div>}
          </section>
        </div>

        <section className="section">
          <div className="section-head"><div><h2>Document wallet</h2><p>OR/CR, CTPL, insurance, warranty, receipts and resale paperwork metadata.</p></div></div>
          <form className="lead-form" onSubmit={addDocument}>
            <p className="muted-note">Document metadata remains local. Do not paste scans or full document contents into notes.</p>
            <div className="lead-form-grid">
              <label>Document<select name="type" defaultValue="OR">{GARAGE_DOCUMENT_TYPES.map((type) => <option value={type} key={type}>{type.replaceAll("_", " ")}</option>)}</select></label>
              <label>Label<input name="label" required placeholder="2026 Official Receipt" /></label>
              <label>Reference / last digits<input name="reference" autoComplete="off" placeholder="Optional" /></label>
              <label>Expiry date<input name="expiryDate" type="date" /></label>
              <label className="lead-form-wide">Notes<input name="notes" placeholder="Where the original is kept, renewal notes, buyer transfer checklist" /></label>
            </div>
            <button className="button small" type="submit">Save document record</button>
          </form>
          {bikeDocuments.length > 0 && <div className="buyer-quote-list">{bikeDocuments.map((document) => <div className="buyer-quote-card" key={document.id}>
            <div><span className="field-label">{document.type.replaceAll("_", " ")}</span><strong>{document.label}</strong><p>{document.reference ? `Reference: ${document.reference}` : "No reference saved"}{document.notes ? ` · ${document.notes}` : ""}</p></div>
            <div className="buyer-quote-meta">{document.expiryDate && <><strong className={dueClass(daysUntil(document.expiryDate))}>{dateLabel(document.expiryDate)}</strong><small>{dueLabel(daysUntil(document.expiryDate))}</small></>}<button className="button small ghost" type="button" onClick={() => removeDocument(document.id)}>Delete</button></div>
          </div>)}</div>}
        </section>
      </>}
    </>}
  </section>;
}
