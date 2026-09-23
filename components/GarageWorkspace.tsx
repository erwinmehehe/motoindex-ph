"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import styles from "@/app/styles/garage.module.css";
import {
  GARAGE_DOCUMENT_TYPES,
  GARAGE_RECORD_CATEGORIES,
  GARAGE_STORAGE_KEY,
  GarageDocument,
  GarageDocumentType,
  GarageMotorcycle,
  GarageRecord,
  GarageRecordCategory,
  GarageState,
  daysUntil,
  emptyGarageState,
  maintenanceReferenceForBike,
  money,
  parseGarageState,
} from "@/lib/garage";

function id(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function n(value: FormDataEntryValue | null) {
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
  if (days === null || days > 30) return styles.statusGood;
  if (days >= 0) return styles.statusSoon;
  return styles.statusLate;
}

function dueLabel(days: number | null) {
  if (days === null) return "Date not set";
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue`;
  if (days === 0) return "Due today";
  return `${days} day${days === 1 ? "" : "s"} left`;
}

export function GarageWorkspace() {
  const [state, setState] = useState<GarageState>(emptyGarageState);
  const [hydrated, setHydrated] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [showBikeForm, setShowBikeForm] = useState(false);
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

  const selectedBike = state.motorcycles.find((bike) => bike.id === selectedId) || state.motorcycles[0];
  const bikeRecords = useMemo(() => state.records
    .filter((record) => record.motorcycleId === selectedBike?.id)
    .sort((a, b) => b.date.localeCompare(a.date)), [state.records, selectedBike?.id]);
  const bikeDocuments = useMemo(() => state.documents
    .filter((document) => document.motorcycleId === selectedBike?.id), [state.documents, selectedBike?.id]);

  const totalSpend = bikeRecords.reduce((sum, record) => sum + (record.amountPhp || 0), 0);
  const fuelRecords = bikeRecords.filter((record) => record.category === "FUEL");
  const liters = fuelRecords.reduce((sum, record) => sum + (record.liters || 0), 0);
  const fuelSpend = fuelRecords.reduce((sum, record) => sum + (record.amountPhp || 0), 0);
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
    const bike: GarageMotorcycle = {
      id: id("bike"),
      make: String(form.get("make") || "").trim(),
      model: String(form.get("model") || "").trim(),
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
    const record: GarageRecord = {
      id: id("record"),
      motorcycleId: selectedBike.id,
      category: String(form.get("category")) as GarageRecordCategory,
      date: String(form.get("date") || new Date().toISOString().slice(0, 10)),
      title: String(form.get("title") || "").trim(),
      amountPhp: n(form.get("amountPhp")),
      odometerKm: n(form.get("odometerKm")),
      liters: n(form.get("liters")),
      pricePerLiterPhp: n(form.get("pricePerLiterPhp")),
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

  if (!hydrated) return <section className={styles.notice}><strong>Opening My Garage</strong><p>Loading the ownership records stored in this browser.</p></section>;

  return <section className={styles.workspace}>
    <div className={styles.notice}>
      <strong>Local-first privacy</strong>
      <p>Garage records are stored only in this browser in V1. MotoIndex does not upload your plate, document references or ownership history. Export a backup before clearing browser data or changing devices. Scanned OR/CR files are intentionally not stored until secure MotoIndex accounts and private file storage are available.</p>
    </div>

    <div className={styles.toolbar}>
      <div>
        <span className={styles.metaLabel}>Ownership workspace</span>
        <strong>{state.motorcycles.length} motorcycle{state.motorcycles.length === 1 ? "" : "s"} saved on this device</strong>
      </div>
      <div className={styles.toolbarActions}>
        <button className={styles.button} type="button" onClick={() => setShowBikeForm((value) => !value)}>Add motorcycle</button>
        <button className={`${styles.button} ${styles.buttonSecondary}`} type="button" onClick={exportBackup} disabled={state.motorcycles.length === 0}>Export backup</button>
        <button className={`${styles.button} ${styles.buttonSecondary}`} type="button" onClick={() => backupInput.current?.click()}>Import backup</button>
        <input ref={backupInput} type="file" accept="application/json" hidden onChange={importBackup} />
      </div>
    </div>

    {showBikeForm && <form className={styles.form} onSubmit={addBike}>
      <div className={styles.panelHead}><div><h2>Add a motorcycle</h2><p>Start with the bike and the dates you do not want to miss.</p></div></div>
      <div className={styles.formGrid}>
        <label>Make<input name="make" required placeholder="Honda" /></label>
        <label>Model<input name="model" required placeholder="Click 160" /></label>
        <label>Variant<input name="variant" placeholder="ABS" /></label>
        <label>Model year<input name="year" type="number" min="1950" max="2100" /></label>
        <label>Plate number<input name="plate" autoComplete="off" /></label>
        <label>Current odometer (km)<input name="odometerKm" type="number" min="0" step="1" defaultValue="0" /></label>
        <label>Purchase date<input name="purchaseDate" type="date" /></label>
        <label>Purchase price<input name="purchasePricePhp" type="number" min="0" step="1" /></label>
        <label>LTO registration expiry<input name="registrationExpiry" type="date" /></label>
        <label>Insurance expiry<input name="insuranceExpiry" type="date" /></label>
        <label>Estimated resale value<input name="estimatedResaleValuePhp" type="number" min="0" step="1" /></label>
      </div>
      <div className={styles.toolbarActions}><button className={styles.button} type="submit">Save motorcycle</button>{state.motorcycles.length > 0 && <button className={`${styles.button} ${styles.buttonSecondary}`} type="button" onClick={() => setShowBikeForm(false)}>Cancel</button>}</div>
    </form>}

    {state.motorcycles.length === 0 ? <div className={styles.empty}>
      <h2>Your Garage is empty.</h2>
      <p>Add your motorcycle to start tracking registration, insurance, PMS, fuel, tires, battery, repairs, parts, warranties, parking, tolls and resale records.</p>
    </div> : <>
      <div className={styles.bikeTabs} aria-label="Saved motorcycles">
        {state.motorcycles.map((bike) => <button key={bike.id} type="button" onClick={() => setSelectedId(bike.id)} className={`${styles.bikeTab} ${bike.id === selectedBike?.id ? styles.bikeTabActive : ""}`}>
          {bike.make} {bike.model}{bike.year ? ` · ${bike.year}` : ""}
        </button>)}
      </div>

      {selectedBike && <>
        <div className={styles.toolbar}>
          <div>
            <span className={styles.metaLabel}>Current motorcycle</span>
            <strong>{selectedBike.make} {selectedBike.model}{selectedBike.variant ? ` ${selectedBike.variant}` : ""}</strong>
          </div>
          <button className={`${styles.button} ${styles.buttonDanger}`} type="button" onClick={removeBike}>Remove motorcycle</button>
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryItem}><span>Odometer</span><strong>{selectedBike.odometerKm.toLocaleString()} km</strong><small>Updates when a higher log reading is saved</small></div>
          <div className={styles.summaryItem}><span>Total logged spend</span><strong>{money(totalSpend)}</strong><small>Fuel, PMS, repairs, parts and other recorded costs</small></div>
          <div className={styles.summaryItem}><span>Fuel</span><strong>{money(fuelSpend)}</strong><small>{liters ? `${liters.toFixed(1)} L logged` : "No fuel volume logged yet"}</small></div>
          <div className={styles.summaryItem}><span>Estimated resale</span><strong>{money(selectedBike.estimatedResaleValuePhp)}</strong><small>{selectedBike.purchasePricePhp ? `Bought for ${money(selectedBike.purchasePricePhp)}` : "Add purchase price for context"}</small></div>
        </div>

        {maintenanceReference && <div className={styles.reference}>
          <span className={styles.metaLabel}>{maintenanceReference.level} maintenance source</span>
          <strong>{maintenanceReference.label}</strong>
          <p>{maintenanceReference.summary}</p>
          <a href={maintenanceReference.sourceUrl} target="_blank" rel="noreferrer">Open verified maintenance source ↗</a>
        </div>}

        <div className={styles.grid}>
          <section className={styles.panel}>
            <div className={styles.panelHead}><div><h2>Upcoming</h2><p>Renewals and service dates that need attention.</p></div></div>
            {upcoming.length ? <div className={styles.list}>{upcoming.map((item, index) => <div className={styles.row} key={`${item.label}-${item.value}-${index}`}>
              <div><strong>{item.label}</strong><p>{dateLabel(item.value)}</p></div>
              <div className={styles.rowMeta}><strong className={dueClass(item.days)}>{dueLabel(item.days)}</strong></div>
            </div>)}</div> : <div className={styles.empty}><p>No renewal or service due dates saved yet.</p></div>}
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHead}><div><h2>Add ownership record</h2><p>PMS, fuel, tires, battery, repairs, accidents, parts and expenses.</p></div></div>
            <form className={styles.form} onSubmit={addRecord}>
              <div className={styles.formGrid}>
                <label>Type<select name="category" defaultValue="PMS">{GARAGE_RECORD_CATEGORIES.map((category) => <option value={category} key={category}>{category}</option>)}</select></label>
                <label>Date<input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} /></label>
                <label className={styles.full}>What happened?<input name="title" required placeholder="Engine oil change" /></label>
                <label>Amount (₱)<input name="amountPhp" type="number" min="0" step="0.01" /></label>
                <label>Odometer (km)<input name="odometerKm" type="number" min="0" step="1" defaultValue={selectedBike.odometerKm} /></label>
                <label>Fuel liters<input name="liters" type="number" min="0" step="0.01" /></label>
                <label>Fuel price/L<input name="pricePerLiterPhp" type="number" min="0" step="0.01" /></label>
                <label>Next due (km)<input name="nextDueKm" type="number" min="0" step="1" /></label>
                <label>Next due date<input name="nextDueDate" type="date" /></label>
                <label className={styles.full}>Notes<textarea name="notes" placeholder="Shop, parts used, warranty details or repair notes" /></label>
              </div>
              <button className={styles.button} type="submit">Add record</button>
            </form>
          </section>
        </div>

        <div className={styles.grid}>
          <section className={styles.panel}>
            <div className={styles.panelHead}><div><h2>Ownership history</h2><p>Your most recent activity for this motorcycle.</p></div></div>
            {bikeRecords.length ? <div className={styles.list}>{bikeRecords.slice(0, 20).map((record) => <div className={styles.row} key={record.id}>
              <div><span className={styles.metaLabel}>{record.category}</span><strong>{record.title}</strong><p>{dateLabel(record.date)}{record.odometerKm !== undefined ? ` · ${record.odometerKm.toLocaleString()} km` : ""}{record.notes ? ` · ${record.notes}` : ""}</p></div>
              <div className={styles.rowMeta}>{record.amountPhp !== undefined && <strong>{money(record.amountPhp)}</strong>}{record.nextDueKm !== undefined && <small>Next at {record.nextDueKm.toLocaleString()} km</small>}{record.nextDueDate && <small>Next {dateLabel(record.nextDueDate)}</small>}</div>
            </div>)}</div> : <div className={styles.empty}><p>No ownership records yet.</p></div>}
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHead}><div><h2>Document wallet</h2><p>Track OR/CR, CTPL, insurance, warranty, receipts and resale paperwork.</p></div></div>
            <form className={styles.form} onSubmit={addDocument}>
              <p className={styles.documentWarning}>This V1 stores document metadata only. Do not paste scans or full document contents into notes. Secure file uploads will be added with authenticated accounts and private storage.</p>
              <div className={styles.formGrid}>
                <label>Document<select name="type" defaultValue="OR">{GARAGE_DOCUMENT_TYPES.map((type) => <option value={type} key={type}>{type.replaceAll("_", " ")}</option>)}</select></label>
                <label>Label<input name="label" required placeholder="2026 Official Receipt" /></label>
                <label>Reference / last digits<input name="reference" autoComplete="off" placeholder="Optional" /></label>
                <label>Expiry date<input name="expiryDate" type="date" /></label>
                <label className={styles.full}>Notes<textarea name="notes" placeholder="Where the original is kept, renewal notes, buyer transfer checklist" /></label>
              </div>
              <button className={styles.button} type="submit">Save document record</button>
            </form>
            {bikeDocuments.length > 0 && <div className={styles.list}>{bikeDocuments.map((document) => <div className={styles.row} key={document.id}>
              <div><span className={styles.metaLabel}>{document.type.replaceAll("_", " ")}</span><strong>{document.label}</strong><p>{document.reference ? `Reference: ${document.reference}` : "No reference saved"}{document.notes ? ` · ${document.notes}` : ""}</p></div>
              <div className={styles.rowMeta}>{document.expiryDate && <><strong className={dueClass(daysUntil(document.expiryDate))}>{dateLabel(document.expiryDate)}</strong><small>{dueLabel(daysUntil(document.expiryDate))}</small></>}</div>
            </div>)}</div>}
          </section>
        </div>
      </>}
    </>}
  </section>;
}
