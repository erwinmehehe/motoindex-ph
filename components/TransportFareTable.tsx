import type { FareReferenceTable } from "@/lib/transportWave2/fareReferences";
import styles from "./TransportGuideExtras.module.css";

/** Visible, date-stamped source table. No calculated or interpolated toll quote. */
export function TransportFareTable({ table }: { table: FareReferenceTable }) {
  return <section className={styles.stationSection} aria-labelledby="transport-fare-table" data-transport-reference-fares>
    <div className="section-head compact"><div>
      <span className="section-kicker">Fare reference · Effective {table.effective}</span>
      <h2 id="transport-fare-table">{table.title}</h2>
      <p>{table.caption} Confirm an approved rate or current station fare before paying.</p>
    </div></div>
    <div className={styles.tableScroll} role="region" aria-label={table.title} tabIndex={0}>
      <table className={styles.stationTable}>
        <caption>{table.caption}</caption>
        <thead><tr>{table.headers.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
        <tbody>{table.rows.map((row,i) => <tr key={i}>{row.map((cell,j) =>
          j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>
        )}</tr>)}</tbody>
      </table>
    </div>
    <p className={styles.stationSource}>Reference: <a href={table.sourceUrl} target="_blank" rel="noopener noreferrer">{table.sourceLabel}</a>. Fares are date-specific, not live.</p>
  </section>;
}
