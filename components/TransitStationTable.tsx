import type { TransitStationGuide } from "@/lib/transitStationGuides2026";
import styles from "./TransportGuideExtras.module.css";

export function TransitStationTable({ guide }: { guide: TransitStationGuide }) {
  return <section className={styles.stationSection} aria-labelledby="transit-station-list" data-transit-station-list>
    <div className="section-head compact"><div>
      <span className="section-kicker">Official operator station order</span>
      <h2 id="transit-station-list">{guide.title}</h2>
      <p>{guide.direction}. Read the list in reverse for the opposite direction. Check the operator for service and fare changes.</p>
    </div></div>
    <div className={styles.tableScroll} role="region" aria-label={guide.line + " complete station table"} tabIndex={0}>
      <table className={styles.stationTable}>
        <caption>All {guide.stations.length} {guide.line} stations and transfer information</caption>
        <thead><tr><th scope="col">#</th><th scope="col">Station</th><th scope="col">City / area</th><th scope="col">Transfer / station note</th></tr></thead>
        <tbody>{guide.stations.map((station, index) => <tr key={station.name}>
          <td className={styles.stationIndex}>{index + 1}</td>
          <th scope="row">{station.name}</th>
          <td>{station.area}</td>
          <td>{station.transfer && <strong className={styles.transfer}>{station.transfer}<span className={styles.dot}> · </span></strong>}{station.note}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <p className={styles.stationSource}>Station sequence: <a href={guide.sourceUrl} target="_blank" rel="noopener noreferrer">official {guide.line} operator reference</a>. Walking transfers and payment are subject to current station arrangements.</p>
  </section>;
}
