"use client";

import { FormEvent, useMemo } from "react";
import {
  GARAGE_COMPONENT_CATEGORIES,
  daysUntil,
  money,
  type GarageComponentCategory,
  type GarageRecord,
} from "@/lib/garage";

export type GarageComponentRecordInput = {
  category: GarageComponentCategory;
  date: string;
  title: string;
  amountPhp?: number;
  odometerKm?: number;
  nextDueKm?: number;
  brand?: string;
  partNumber?: string;
  supplier?: string;
  quantity?: number;
  warrantyExpiry?: string;
  notes?: string;
};

function numberValue(value: FormDataEntryValue | null) {
  if (value === null || String(value).trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function textValue(value: FormDataEntryValue | null) {
  const valueText = String(value || "").trim();
  return valueText || undefined;
}

function componentKey(record: Pick<GarageRecord, "category" | "title">) {
  return `${record.category}:${record.title.trim().toLowerCase().replace(/\s+/g, " ")}`;
}

function formatDate(value?: string) {
  if (!value) return "Not set";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.valueOf())) return value;
  return date.toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
}

function warrantyLabel(expiry?: string) {
  const days = daysUntil(expiry);
  if (days === null) return "No warranty date";
  if (days < 0) return `Expired ${Math.abs(days)}d ago`;
  if (days === 0) return "Expires today";
  return `${days}d warranty left`;
}

export function GaragePartsPanel({
  records,
  currentOdometerKm,
  onAddRecord,
}: {
  records: GarageRecord[];
  currentOdometerKm: number;
  onAddRecord: (input: GarageComponentRecordInput) => void;
}) {
  const componentRecords = useMemo(
    () => records
      .filter((record) => GARAGE_COMPONENT_CATEGORIES.includes(record.category as GarageComponentCategory))
      .sort((a, b) => b.date.localeCompare(a.date) || (b.odometerKm || 0) - (a.odometerKm || 0)),
    [records],
  );

  const currentItems = useMemo(() => {
    const seen = new Set<string>();
    return componentRecords.filter((record) => {
      const key = componentKey(record);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [componentRecords]);

  const totalSpend = componentRecords.reduce((sum, record) => sum + (record.amountPhp || 0), 0);
  const warrantyDue = currentItems.filter((record) => {
    const days = daysUntil(record.warrantyExpiry);
    return days !== null && days >= 0 && days <= 30;
  }).length;
  const warrantyExpired = currentItems.filter((record) => {
    const days = daysUntil(record.warrantyExpiry);
    return days !== null && days < 0;
  }).length;
  const replacementDue = currentItems.filter((record) => record.nextDueKm !== undefined && record.nextDueKm <= currentOdometerKm).length;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    if (!title) return;

    onAddRecord({
      category: String(form.get("category")) as GarageComponentCategory,
      date: String(form.get("date") || new Date().toISOString().slice(0, 10)),
      title,
      amountPhp: numberValue(form.get("amountPhp")),
      odometerKm: numberValue(form.get("odometerKm")),
      nextDueKm: numberValue(form.get("nextDueKm")),
      brand: textValue(form.get("brand")),
      partNumber: textValue(form.get("partNumber")),
      supplier: textValue(form.get("supplier")),
      quantity: numberValue(form.get("quantity")),
      warrantyExpiry: textValue(form.get("warrantyExpiry")),
      notes: textValue(form.get("notes")),
    });

    event.currentTarget.reset();
  }

  return <section className="section" aria-label="Parts and consumables">
    <div className="section-head">
      <div>
        <span className="field-label">Parts & consumables</span>
        <h2>What is currently on the bike</h2>
        <p>Track replacements by install date and odometer, not just as expenses.</p>
      </div>
    </div>

    <div className="spec-grid">
      <div><span>Current tracked items</span><strong>{currentItems.length}</strong><small>Latest tire, battery, oil, CVT and part records</small></div>
      <div><span>Parts spend</span><strong>{money(totalSpend)}</strong><small>Across all tracked component replacements</small></div>
      <div><span>Warranty attention</span><strong>{warrantyExpired + warrantyDue}</strong><small>{warrantyExpired ? `${warrantyExpired} expired` : "None expired"} · {warrantyDue ? `${warrantyDue} due within 30 days` : "none due soon"}</small></div>
      <div><span>Replacement due</span><strong>{replacementDue}</strong><small>Based only on mileage due points you saved</small></div>
    </div>

    {currentItems.length > 0 ? <div className="buyer-quote-list">
      {currentItems.map((record) => {
        const installedKm = record.odometerKm;
        const usedKm = installedKm !== undefined && currentOdometerKm >= installedKm ? currentOdometerKm - installedKm : undefined;
        const previousCount = componentRecords.filter((candidate) => componentKey(candidate) === componentKey(record)).length - 1;
        const dueKm = record.nextDueKm;
        const remainingKm = dueKm !== undefined ? dueKm - currentOdometerKm : undefined;

        return <article className="buyer-quote-card" key={record.id}>
          <div>
            <span className="field-label">{record.category}</span>
            <strong>{record.title}</strong>
            <p>
              {[record.brand, record.partNumber ? `P/N ${record.partNumber}` : undefined, record.supplier].filter(Boolean).join(" · ") || "No brand or supplier details saved"}
            </p>
            <small>
              Installed {formatDate(record.date)}
              {installedKm !== undefined ? ` · ${installedKm.toLocaleString()} km` : ""}
              {usedKm !== undefined ? ` · ${usedKm.toLocaleString()} km used` : ""}
            </small>
          </div>
          <div className="buyer-quote-meta">
            {record.amountPhp !== undefined && <strong>{money(record.amountPhp)}</strong>}
            {record.quantity !== undefined && <small>Qty {record.quantity}</small>}
            <small>{warrantyLabel(record.warrantyExpiry)}</small>
            {remainingKm !== undefined && <small>{remainingKm <= 0 ? `${Math.abs(remainingKm).toLocaleString()} km past saved replacement point` : `${remainingKm.toLocaleString()} km to saved replacement point`}</small>}
            {previousCount > 0 && <small>{previousCount} previous replacement{previousCount === 1 ? "" : "s"} in history</small>}
          </div>
        </article>;
      })}
    </div> : <div className="note-box">
      <strong>No parts or consumables tracked yet.</strong>
      <p>Add your current tires, battery, engine oil, CVT components or installed parts to start a replacement history.</p>
    </div>}

    <div className="split section">
      <section className="garage-panel">
        <div className="section-head"><div><h2>Add installed item</h2><p>Use the same item name on future replacements so MotoIndex can build its history.</p></div></div>
        <form className="lead-form" onSubmit={submit}>
          <div className="lead-form-grid">
            <label>Type
              <select name="category" defaultValue="TIRE">
                {GARAGE_COMPONENT_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
            <label>Install date<input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} /></label>
            <label className="lead-form-wide">Item / position<input name="title" required placeholder="Rear tire, battery, engine oil, CVT belt" /></label>
            <label>Brand<input name="brand" placeholder="Michelin, Yuasa, Motul" /></label>
            <label>Part number<input name="partNumber" placeholder="Optional SKU / part no." /></label>
            <label>Supplier / shop<input name="supplier" placeholder="Dealer or shop" /></label>
            <label>Quantity<input name="quantity" type="number" min="0" step="0.01" defaultValue="1" /></label>
            <label>Cost (₱)<input name="amountPhp" type="number" min="0" step="0.01" /></label>
            <label>Installed at (km)<input name="odometerKm" type="number" min="0" step="1" defaultValue={currentOdometerKm} /></label>
            <label>Replace / inspect at (km)<input name="nextDueKm" type="number" min="0" step="1" /></label>
            <label>Warranty expiry<input name="warrantyExpiry" type="date" /></label>
            <label className="lead-form-wide">Notes<input name="notes" placeholder="Size, spec, compound, warranty terms, install notes" /></label>
          </div>
          <button className="button small" type="submit">Save installed item</button>
        </form>
      </section>

      <section className="garage-panel">
        <div className="section-head"><div><h2>Replacement history</h2><p>Latest component activity, including previous replacements.</p></div></div>
        {componentRecords.length > 0 ? <div className="buyer-quote-list">
          {componentRecords.slice(0, 12).map((record) => <div className="buyer-quote-card" key={record.id}>
            <div>
              <span className="field-label">{record.category}</span>
              <strong>{record.title}</strong>
              <p>{formatDate(record.date)}{record.odometerKm !== undefined ? ` · ${record.odometerKm.toLocaleString()} km` : ""}</p>
              {(record.brand || record.partNumber) && <small>{[record.brand, record.partNumber ? `P/N ${record.partNumber}` : undefined].filter(Boolean).join(" · ")}</small>}
            </div>
            <div className="buyer-quote-meta">
              {record.amountPhp !== undefined && <strong>{money(record.amountPhp)}</strong>}
              {record.warrantyExpiry && <small>Warranty {formatDate(record.warrantyExpiry)}</small>}
            </div>
          </div>)}
        </div> : <div className="note-box"><p>Your replacement history will appear here after the first item is saved.</p></div>}
      </section>
    </div>
  </section>;
}
