"use client";

import { useMemo } from "react";
import {
  daysUntil,
  type GarageDocument,
  type GarageMotorcycle,
  type GarageRecord,
  type SmartMaintenanceDue,
} from "@/lib/garage";

type ReminderItem = {
  id: string;
  source: "smart" | "record" | "bike" | "document" | "warranty";
  label: string;
  detail: string;
  days?: number | null;
  remainingKm?: number;
  smart?: SmartMaintenanceDue;
  record?: GarageRecord;
};

function dateLabel(value?: string) {
  if (!value) return "Date not set";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.valueOf())) return value;
  return parsed.toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
}

function urgency(item: ReminderItem) {
  if (item.days !== undefined && item.days !== null && item.days < 0) return -100000 + item.days;
  if (item.remainingKm !== undefined && item.remainingKm <= 0) return -90000 + item.remainingKm;
  if (item.days !== undefined && item.days !== null) return item.days * 100;
  if (item.remainingKm !== undefined) return item.remainingKm;
  return 999999;
}

function state(item: ReminderItem) {
  const overdue = (item.days !== undefined && item.days !== null && item.days < 0) || (item.remainingKm !== undefined && item.remainingKm <= 0);
  const soon = (item.days !== undefined && item.days !== null && item.days >= 0 && item.days <= 30)
    || (item.remainingKm !== undefined && item.remainingKm > 0 && item.remainingKm <= 1000);
  if (overdue) return { label: "Overdue", className: "buyer-decision declined" };
  if (soon) return { label: "Due soon", className: "buyer-decision" };
  return { label: "Scheduled", className: "buyer-decision interested" };
}

function normalized(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function GarageReminderCenter({
  bike,
  records,
  documents,
  smartMaintenance,
  onLogSmart,
  onLogRecord,
  onEditRenewals,
}: {
  bike: GarageMotorcycle;
  records: GarageRecord[];
  documents: GarageDocument[];
  smartMaintenance: SmartMaintenanceDue[];
  onLogSmart: (item: SmartMaintenanceDue) => void;
  onLogRecord: (record: GarageRecord) => void;
  onEditRenewals: () => void;
}) {
  const reminders = useMemo(() => {
    const items: ReminderItem[] = [];
    const smartTitles = new Set(smartMaintenance.map((item) => normalized(item.item)));

    if (bike.registrationExpiry) {
      items.push({
        id: "registration",
        source: "bike",
        label: "LTO registration renewal",
        detail: dateLabel(bike.registrationExpiry),
        days: daysUntil(bike.registrationExpiry),
      });
    }
    if (bike.insuranceExpiry) {
      items.push({
        id: "insurance",
        source: "bike",
        label: "Insurance renewal",
        detail: dateLabel(bike.insuranceExpiry),
        days: daysUntil(bike.insuranceExpiry),
      });
    }

    for (const item of smartMaintenance) {
      if (item.nextDueKm === undefined || item.remainingKm === undefined) continue;
      items.push({
        id: `smart:${item.item}`,
        source: "smart",
        label: item.item,
        detail: `${item.nextDueKm.toLocaleString()} km due point · ${item.interval}`,
        remainingKm: item.remainingKm,
        smart: item,
      });
    }

    for (const record of records) {
      if (record.warrantyExpiry) {
        items.push({
          id: `warranty:${record.id}`,
          source: "warranty",
          label: `${record.title} warranty`,
          detail: `${dateLabel(record.warrantyExpiry)} · ${record.category}`,
          days: daysUntil(record.warrantyExpiry),
        });
      }
      if (!record.nextDueDate && record.nextDueKm === undefined) continue;
      const duplicateSmartMileage = record.nextDueKm !== undefined && smartTitles.has(normalized(record.title));
      if (record.nextDueDate) {
        items.push({
          id: `record-date:${record.id}`,
          source: "record",
          label: record.title,
          detail: `${dateLabel(record.nextDueDate)} · ${record.category}`,
          days: daysUntil(record.nextDueDate),
          record,
        });
      }
      if (record.nextDueKm !== undefined && !duplicateSmartMileage) {
        items.push({
          id: `record-km:${record.id}`,
          source: "record",
          label: record.title,
          detail: `${record.nextDueKm.toLocaleString()} km due point · ${record.category}`,
          remainingKm: record.nextDueKm - bike.odometerKm,
          record,
        });
      }
    }

    for (const document of documents) {
      if (!document.expiryDate) continue;
      items.push({
        id: `document:${document.id}`,
        source: "document",
        label: document.label,
        detail: `${dateLabel(document.expiryDate)} · ${document.type.replaceAll("_", " ")}`,
        days: daysUntil(document.expiryDate),
      });
    }

    return items.sort((a, b) => urgency(a) - urgency(b));
  }, [bike.insuranceExpiry, bike.odometerKm, bike.registrationExpiry, documents, records, smartMaintenance]);

  const counts = reminders.reduce((summary, item) => {
    const status = state(item).label;
    if (status === "Overdue") summary.overdue += 1;
    else if (status === "Due soon") summary.soon += 1;
    else summary.scheduled += 1;
    return summary;
  }, { overdue: 0, soon: 0, scheduled: 0 });

  return <section className="garage-panel">
    <div className="section-head">
      <div>
        <span className="field-label">Reminder center</span>
        <h2>What is due next</h2>
        <p>Date and mileage reminders from your Garage, exact-model maintenance schedule and document wallet.</p>
      </div>
    </div>

    <div className="spec-grid">
      <div><span>Overdue</span><strong>{counts.overdue}</strong><small>Needs attention now</small></div>
      <div><span>Due soon</span><strong>{counts.soon}</strong><small>Within 30 days or 1,000 km</small></div>
      <div><span>Scheduled</span><strong>{counts.scheduled}</strong><small>Tracked beyond the current reminder window</small></div>
      <div><span>Total tracked</span><strong>{reminders.length}</strong><small>Email alerts use your latest cloud-synced copy</small></div>
    </div>

    {reminders.length ? <div className="buyer-quote-list">
      {reminders.slice(0, 12).map((item) => {
        const status = state(item);
        return <div className="buyer-quote-card" key={item.id}>
          <div>
            <span className="field-label">{item.source === "smart" ? "Verified schedule" : item.source === "bike" ? "Renewal" : item.source === "document" ? "Document" : item.source === "warranty" ? "Warranty" : "Saved reminder"}</span>
            <strong>{item.label}</strong>
            <p>{item.detail}</p>
            {item.remainingKm !== undefined && <small>{item.remainingKm <= 0 ? `${Math.abs(item.remainingKm).toLocaleString()} km overdue` : `${item.remainingKm.toLocaleString()} km remaining`}</small>}
            {item.days !== undefined && item.days !== null && <small>{item.days < 0 ? `${Math.abs(item.days)} day${Math.abs(item.days) === 1 ? "" : "s"} overdue` : item.days === 0 ? "Due today" : `${item.days} day${item.days === 1 ? "" : "s"} remaining`}</small>}
          </div>
          <div className="buyer-quote-meta">
            <strong className={status.className}>{status.label}</strong>
            {item.smart && <button className="button small ghost" type="button" onClick={() => onLogSmart(item.smart!)}>Log completed</button>}
            {item.record && <button className="button small ghost" type="button" onClick={() => onLogRecord(item.record!)}>Log again</button>}
            {item.source === "bike" && <button className="button small ghost" type="button" onClick={onEditRenewals}>Update renewal</button>}
            {item.source === "document" && <a className="button small ghost" href="#garage-document-wallet">Open wallet</a>}
          </div>
        </div>;
      })}
    </div> : <div className="note-box"><p>No reminders yet. Add renewal dates, due mileage, document expiries or an exact-model maintenance schedule to start tracking them.</p></div>}
  </section>;
}
