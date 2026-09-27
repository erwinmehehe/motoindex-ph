"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { GARAGE_RECORD_CATEGORIES, money, type GarageDocument, type GarageRecord, type GarageRecordCategory } from "@/lib/garage";

const s = {
  toolbar: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,170px),1fr))", gap: 10, marginBottom: 14 },
  field: { display: "grid", gap: 6, color: "var(--muted)", fontSize: 11, fontWeight: 800 },
  summary: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,130px),1fr))", gap: 8, marginBottom: 14 },
  summaryCard: { minWidth: 0, padding: 12, borderRadius: 14, background: "var(--paper)" },
  label: { display: "block", color: "var(--muted)", fontSize: 9, fontWeight: 800, letterSpacing: ".07em", textTransform: "uppercase" },
  value: { display: "block", marginTop: 4, fontSize: 16, lineHeight: 1.2, letterSpacing: "-.02em" },
  footer: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 12 },
  muted: { color: "var(--muted)", fontSize: 11, lineHeight: 1.45 },
} satisfies Record<string, CSSProperties>;

function dateLabel(value?: string) {
  if (!value) return "Not set";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.valueOf())) return value;
  return parsed.toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
}

type SortMode = "newest" | "oldest" | "mileage";

export function GarageHistoryPanel({
  records,
  documents,
  onAddEvidence,
  onDeleteRecord,
}: {
  records: GarageRecord[];
  documents: GarageDocument[];
  onAddEvidence: (record: GarageRecord) => void;
  onDeleteRecord: (recordId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"ALL" | GarageRecordCategory>("ALL");
  const [sort, setSort] = useState<SortMode>("newest");
  const [limit, setLimit] = useState(20);

  const evidenceCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const document of documents) {
      if (!document.linkedRecordId) continue;
      counts.set(document.linkedRecordId, (counts.get(document.linkedRecordId) || 0) + 1);
    }
    return counts;
  }, [documents]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const next = records.filter((record) => {
      if (category !== "ALL" && record.category !== category) return false;
      if (!needle) return true;
      const haystack = [
        record.category,
        record.title,
        record.notes,
        record.brand,
        record.partNumber,
        record.supplier,
        record.serviceProvider,
        record.serviceLocation,
        record.invoiceReference,
        record.date,
        record.odometerKm?.toString(),
      ].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(needle);
    });

    return next.sort((a, b) => {
      if (sort === "oldest") return a.date.localeCompare(b.date) || (a.odometerKm || 0) - (b.odometerKm || 0);
      if (sort === "mileage") return (b.odometerKm || -1) - (a.odometerKm || -1) || b.date.localeCompare(a.date);
      return b.date.localeCompare(a.date) || (b.odometerKm || 0) - (a.odometerKm || 0);
    });
  }, [category, query, records, sort]);

  const visible = filtered.slice(0, limit);
  const matchedSpend = filtered.reduce((sum, record) => sum + (record.amountPhp || 0), 0);
  const matchedEvidence = filtered.filter((record) => (evidenceCounts.get(record.id) || 0) > 0).length;

  return <section className="garage-panel">
    <div className="section-head">
      <div>
        <h2>Ownership history</h2>
        <p>Search every saved PMS, fuel, repair, part, renewal and mileage entry instead of losing older records below the latest 20.</p>
      </div>
    </div>

    <div style={s.toolbar}>
      <label style={s.field}>Search history
        <input value={query} onChange={(event) => { setQuery(event.target.value); setLimit(20); }} placeholder="Oil change, tire brand, workshop, 15,000 km..." />
      </label>
      <label style={s.field}>Record type
        <select value={category} onChange={(event) => { setCategory(event.target.value as "ALL" | GarageRecordCategory); setLimit(20); }}>
          <option value="ALL">All records</option>
          {GARAGE_RECORD_CATEGORIES.map((item) => <option value={item} key={item}>{item}</option>)}
        </select>
      </label>
      <label style={s.field}>Sort
        <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="mileage">Highest mileage</option>
        </select>
      </label>
    </div>

    <div style={s.summary}>
      <span style={s.summaryCard}><small style={s.label}>Matched records</small><strong style={s.value}>{filtered.length} / {records.length}</strong></span>
      <span style={s.summaryCard}><small style={s.label}>Matched spend</small><strong style={s.value}>{money(matchedSpend)}</strong></span>
      <span style={s.summaryCard}><small style={s.label}>With evidence</small><strong style={s.value}>{matchedEvidence}</strong></span>
    </div>

    {visible.length ? <div className="buyer-quote-list">
      {visible.map((record) => {
        const evidenceCount = evidenceCounts.get(record.id) || 0;
        return <div className="buyer-quote-card" key={record.id}>
          <div>
            <span className="field-label">{record.category}</span>
            <strong>{record.title}</strong>
            <p>{dateLabel(record.date)}{record.odometerKm !== undefined ? ` · ${record.odometerKm.toLocaleString()} km` : ""}{record.notes ? ` · ${record.notes}` : ""}</p>
            {(record.brand || record.partNumber || record.supplier) && <small>{[record.brand, record.partNumber, record.supplier].filter(Boolean).join(" · ")}</small>}
            {(record.serviceProvider || record.serviceLocation) && <small>Serviced by {[record.serviceProvider, record.serviceLocation].filter(Boolean).join(" · ")}</small>}
            {record.invoiceReference && <small>Invoice / receipt ref: {record.invoiceReference}</small>}
            {evidenceCount > 0 && <small>{evidenceCount} supporting document record{evidenceCount === 1 ? "" : "s"} tracked</small>}
          </div>
          <div className="buyer-quote-meta">
            {record.amountPhp !== undefined && <strong>{money(record.amountPhp)}</strong>}
            {record.nextDueKm !== undefined && <small>Next at {record.nextDueKm.toLocaleString()} km</small>}
            {record.nextDueDate && <small>Next {dateLabel(record.nextDueDate)}</small>}
            {record.category !== "ODOMETER" && <button className="button small ghost" type="button" onClick={() => onAddEvidence(record)}>{evidenceCount ? "Add more evidence" : "Add evidence"}</button>}
            <button className="button small ghost" type="button" onClick={() => onDeleteRecord(record.id)}>Delete</button>
          </div>
        </div>;
      })}
    </div> : <div className="note-box"><p>{records.length ? "No ownership records match those filters." : "No ownership records yet."}</p></div>}

    <div style={s.footer}>
      <small style={s.muted}>Showing {Math.min(visible.length, filtered.length)} of {filtered.length} matching records.</small>
      <div className="hero-actions">
        {limit < filtered.length && <button className="button small ghost" type="button" onClick={() => setLimit((value) => value + 20)}>Show 20 more</button>}
        {(query || category !== "ALL" || sort !== "newest") && <button className="button small ghost" type="button" onClick={() => { setQuery(""); setCategory("ALL"); setSort("newest"); setLimit(20); }}>Reset history</button>}
      </div>
    </div>
  </section>;
}
