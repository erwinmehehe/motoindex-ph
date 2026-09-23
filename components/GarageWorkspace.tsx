"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  GARAGE_DOCUMENT_TYPES,
  GARAGE_RECORD_CATEGORIES,
  GARAGE_STORAGE_KEY,
  GarageDocument,
  GarageDocumentType,
  GarageMotorcycle,
  GarageRecord,
  GarageRecordCategory,
  GarageReminder,
  GarageState,
  advanceGarageReminder,
  daysUntil,
  emptyGarageState,
  maintenanceReferenceForBike,
  money,
  parseGarageState,
  verifiedMaintenanceRemindersForBike,
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
  const bikeReminders = useMemo(() => state.reminders
    .filter((reminder) => reminder.motorcycleId === selectedBike?.id), [state.reminders, selectedBike?.id]);

  const totalSpend = bikeRecords.reduce((sum, record) => sum + (record.amountPhp || 0), 0);
  const currentYear = new Date().getFullYear();
  const spendThisYear = bikeRecords
    .filter((record) => record.date.startsWith(`${currentYear}-`))
    .reduce((sum, record) => sum + (record.amountPhp || 0), 0);
  const fuelRecords = bikeRecords.filter((record) => record.category === "FUEL");
  const liters = fuelRecords.reduce((sum, record) => sum + (record.liters || 0), 0);
  const fuelSpend = fuelRecords.reduce((sum, record) => sum + (record.amountPhp || 0), 0);
  const fuelEconomy = useMemo(() => {
    const readings = fuelRecords
      .filter((record) => record.odometerKm !== undefined && record.liters !== undefined && record.liters > 0)
      .sort((a, b) => (a.odometerKm || 0) - (b.odometerKm || 0));
    if (readings.length < 2) return null;
    let distanceKm = 0;
    let litersUsed = 0;
    for (let index = 1; index < readings.length; index += 1) {
      const previous = readings[index - 1];
      const current = readings[index];
      const distance = (current.odometerKm || 0) - (previous.odometerKm || 0);
      if (distance <= 0 || !current.liters) continue;
      distanceKm += distance;
      litersUsed += current.liters;
    }
    return distanceKm > 0 && litersUsed > 0 ? distanceKm / litersUsed : null;
  }, [fuelRecords]);
  const maintenanceReference = selectedBike ? maintenanceReferenceForBike(selectedBike) : null;
  const verifiedSuggestions = useMemo(() => selectedBike
    ? verifiedMaintenanceRemindersForBike(selectedBike)
      .filter((suggestion) => !bikeReminders.some((reminder) => reminder.scheduleKey === suggestion.scheduleKey))
    : [], [selectedBike, bikeReminders]);

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
      ...bikeReminders.filter((reminder) => reminder.dueDate).map((reminder) => ({
        label: `${reminder.action}: ${reminder.title}`,
        value: reminder.dueDate,
        days: daysUntil(reminder.dueDate),
      })),
      ...bikeDocuments.filter((document) => document.expiryDate).map((document) => ({
        label: document.label,
        value: document.expiryDate,
        days: daysUntil(document.expiryDate),
      })),
    ].filter((item) => item.value) as { label: string; value: string; days: number | null }[];
    return items.sort((a, b) => (a.days ?? 999999) - (b.days ?? 999999)).slice(0, 8);
  }, [selectedBike, bikeRecords, bikeDocuments, bikeReminders]);

  const upcomingMileage = useMemo(() => {
    if (!selectedBike) return [] as { label: string; dueKm: number; remainingKm: number }[];
    return [
      ...bikeRecords
        .filter((record) => record.nextDueKm !== undefined)
        .map((record) => ({
          label: record.title,
          dueKm: record.nextDueKm as number,
          remainingKm: (record.nextDueKm as number) - selectedBike.odometerKm,
        })),
      ...bikeReminders
        .filter((reminder) => reminder.dueKm !== undefined)
        .map((reminder) => ({
          label: `${reminder.action}: ${reminder.title}`,
          dueKm: reminder.dueKm as number,
          remainingKm: (reminder.dueKm as number) - selectedBike.odometerKm,
        })),
    ]
      .sort((a, b) => a.remainingKm - b.remainingKm)
      .slice(0, 8);
  }, [selectedBike, bikeRecords, bikeReminders]);

  const attentionCount = upcoming.filter((item) => item.days !== null && item.days <= 30).length
    + upcomingMileage.filter((item) => item.remainingKm <= 500).length;

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
        odometerKm: n(form.get("odometerKm")) ?? bike.odometerKm,
        registrationExpiry: s(form.get("registrationExpiry")),
        insuranceExpiry: s(form.get("insuranceExpiry")),
        estimatedResaleValuePhp: n(form.get("estimatedResaleValuePhp")),
        updatedAt: new Date().toISOString(),
      } : bike),
    }));
  }

  function addVerifiedReminders() {
    if (!selectedBike || verifiedSuggestions.length === 0) return;
    setState((current) => ({
      ...current,
      reminders: [
        ...verifiedSuggestions.map((suggestion) => ({
          ...suggestion,
          id: id("reminder"),
          motorcycleId: selectedBike.id,
        })),
        ...current.reminders,
      ],
    }));
  }

  function completeReminder(reminder: GarageReminder) {
    if (!selectedBike) return;
    const completedDate = new Date().toISOString().slice(0, 10);
    const nextReminder = advanceGarageReminder(reminder, selectedBike.odometerKm, completedDate);
    const record: GarageRecord = {
      id: id("record"),
      motorcycleId: selectedBike.id,
      category: "PMS",
      date: completedDate,
      title: `${reminder.action}: ${reminder.title}`,
      odometerKm: selectedBike.odometerKm,
      nextDueKm: nextReminder?.dueKm,
      nextDueDate: nextReminder?.dueDate,
      notes: `Completed from MotoIndex verified schedule · ${reminder.sourceLabel}`,
    };
    setState((current) => ({
      ...current,
      records: [record, ...current.records],
      reminders: current.reminders.flatMap((item) => item.id === reminder.id
        ? (nextReminder ? [nextReminder] : [])
        : [item]),
    }));
  }

  function removeReminder(reminderId: string) {
    setState((current) => ({ ...current, reminders: current.reminders.filter((reminder) => reminder.id !== reminderId) }));
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
      reminders: current.reminders.filter((reminder) => reminder.motorcycleId !== selectedBike.id),
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
      <p>Garage records are stored only in this browser in V1. MotoIndex does not upload your plate, document references or ownership history. Export a backup before clearing browser data or changing devices. Scanned OR/CR files are intentionally not stored until secure MotoIndex accounts and private file storage are available.</p>
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
      <div className="section-head"><div><h2>Add a motorcycle</h2><p>Start with the bike and the dates you do not want to miss.</p></div></div>
      <div className="lead-form-grid">
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
          <button className="button small ghost" type="button" onClick={removeBike}>Remove motorcycle</button>
        </div>

        <div className="spec-grid">
          <div className="garage-summary-item"><span>Odometer</span><strong>{selectedBike.odometerKm.toLocaleString()} km</strong><small>Updates when a higher log reading is saved</small></div>
          <div className="garage-summary-item"><span>Needs attention</span><strong>{attentionCount}</strong><small>Due within 30 days or 500 km, including overdue items</small></div>
          <div className="garage-summary-item"><span>Spend this year</span><strong>{money(spendThisYear)}</strong><small>{currentYear} fuel, PMS, repairs, parts and other logged costs</small></div>
          <div className="garage-summary-item"><span>Total logged spend</span><strong>{money(totalSpend)}</strong><small>All ownership costs saved for this motorcycle</small></div>
          <div className="garage-summary-item"><span>Fuel economy</span><strong>{fuelEconomy ? `${fuelEconomy.toFixed(1)} km/L` : "Not enough data"}</strong><small>{fuelEconomy ? `${liters.toFixed(1)} L across comparable fuel readings` : "Log fuel with odometer readings at two fill-ups"}</small></div>
          <div className="garage-summary-item"><span>Estimated resale</span><strong>{money(selectedBike.estimatedResaleValuePhp)}</strong><small>{selectedBike.purchasePricePhp ? `Bought for ${money(selectedBike.purchasePricePhp)}` : "Add purchase price for context"}</small></div>
        </div>

        {upcomingMileage.length > 0 && <section className="garage-panel section">
          <div className="section-head"><div><h2>Maintenance by mileage</h2><p>Service and replacement items tied to the odometer, not just a calendar date.</p></div></div>
          <div className="buyer-quote-list">
            {upcomingMileage.map((item, index) => <div className="buyer-quote-card" key={`${item.label}-${item.dueKm}-${index}`}>
              <div><strong>{item.label}</strong><p>Due at {item.dueKm.toLocaleString()} km</p></div>
              <div className="buyer-quote-meta">
                <strong className={item.remainingKm < 0 ? "buyer-decision declined" : item.remainingKm <= 500 ? "buyer-decision" : "buyer-decision interested"}>
                  {item.remainingKm < 0 ? `${Math.abs(item.remainingKm).toLocaleString()} km overdue` : item.remainingKm === 0 ? "Due now" : `${item.remainingKm.toLocaleString()} km left`}
                </strong>
              </div>
            </div>)}
          </div>
        </section>}

        <form className="lead-form" onSubmit={updateBike} key={selectedBike.id}>
          <div className="section-head"><div><h2>Update current motorcycle</h2><p>Refresh mileage and renewal dates after every PMS or renewal.</p></div></div>
          <div className="lead-form-grid">
            <label>Plate number<input name="plate" autoComplete="off" defaultValue={selectedBike.plate || ""} /></label>
            <label>Current odometer (km)<input name="odometerKm" type="number" min="0" step="1" defaultValue={selectedBike.odometerKm} /></label>
            <label>LTO registration expiry<input name="registrationExpiry" type="date" defaultValue={selectedBike.registrationExpiry || ""} /></label>
            <label>Insurance expiry<input name="insuranceExpiry" type="date" defaultValue={selectedBike.insuranceExpiry || ""} /></label>
            <label>Estimated resale value<input name="estimatedResaleValuePhp" type="number" min="0" step="1" defaultValue={selectedBike.estimatedResaleValuePhp ?? ""} /></label>
          </div>
          <button className="button small" type="submit">Update motorcycle</button>
        </form>

        {maintenanceReference && <div className="info-card">
          <span className="field-label">{maintenanceReference.level} maintenance source</span>
          <strong>{maintenanceReference.label}</strong>
          <p>{maintenanceReference.summary}</p>
          <div className="hero-actions">
            <a href={maintenanceReference.sourceUrl} target="_blank" rel="noreferrer">Open verified maintenance source ↗</a>
            {verifiedSuggestions.length > 0 && <button className="button small" type="button" onClick={addVerifiedReminders}>Add {verifiedSuggestions.length} verified reminder{verifiedSuggestions.length === 1 ? "" : "s"}</button>}
          </div>
        </div>}

        {bikeReminders.length > 0 && <section className="garage-panel section">
          <div className="section-head"><div><h2>Verified maintenance reminders</h2><p>Generated from the exact model schedule MotoIndex has verified. Mark an item done to add it to ownership history and advance recurring intervals.</p></div></div>
          <div className="buyer-quote-list">
            {bikeReminders.map((reminder) => <div className="buyer-quote-card" key={reminder.id}>
              <div>
                <span className="field-label">{reminder.action}</span>
                <strong>{reminder.title}</strong>
                <p>{reminder.intervalText}{reminder.note ? ` · ${reminder.note}` : ""}</p>
                <a href={reminder.sourceUrl} target="_blank" rel="noreferrer">{reminder.sourceLabel} ↗</a>
              </div>
              <div className="buyer-quote-meta">
                {reminder.dueKm !== undefined && <strong className={reminder.dueKm < selectedBike.odometerKm ? "buyer-decision declined" : reminder.dueKm - selectedBike.odometerKm <= 500 ? "buyer-decision" : "buyer-decision interested"}>{reminder.dueKm < selectedBike.odometerKm ? `${(selectedBike.odometerKm - reminder.dueKm).toLocaleString()} km overdue` : `Due at ${reminder.dueKm.toLocaleString()} km`}</strong>}
                {reminder.dueDate && <small>{dateLabel(reminder.dueDate)} · {dueLabel(daysUntil(reminder.dueDate))}</small>}
                <button className="button small" type="button" onClick={() => completeReminder(reminder)}>Mark done</button>
                <button className="button small ghost" type="button" onClick={() => removeReminder(reminder.id)}>Remove</button>
              </div>
            </div>)}
          </div>
        </section>}

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
              <p className="muted-note">This V1 stores document metadata only. Do not paste scans or full document contents into notes. Secure file uploads will be added with authenticated accounts and private storage.</p>
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
        </div>
      </>}
    </>}
  </section>;
}
