import type { CorridorExitGuide } from "@/lib/transportWave3/corridorExits";
import styles from "./TransportGuideExtras.module.css";

/** Ordered reference to documented tollway access points, not live ramp directions. */
export function CorridorExitTable({ guide }: { guide: CorridorExitGuide }) {
  return <section className={styles.stationSection} aria-labelledby="expressway-exit-table" data-expressway-exit-table>
    <div className="section-head compact"><div>
      <span className="section-kicker">Expressway access guide · Checked October 30, 2026</span>
      <h2 id="expressway-exit-table">{guide.title}</h2>
      <p>{guide.direction}. {guide.disclaimer}</p>
    </div></div>
    <div className={styles.tableScroll} role="region" aria-label={guide.title} tabIndex={0}>
      <table className={styles.stationTable}>
        <caption>{guide.label}: {guide.exits.length} named exit and access areas</caption>
        <thead><tr><th scope="col">#</th><th scope="col">Exit or access</th><th scope="col">Area</th><th scope="col">Why it matters</th></tr></thead>
        <tbody>{guide.exits.map((exit,i)=><tr key={exit.name}>
          <td className={styles.stationIndex}>{i+1}</td>
          <th scope="row">{exit.name}</th>
          <td>{exit.area}</td>
          <td>{exit.note}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <p className={styles.stationSource}>Route source: <a href={guide.sourceUrl} target="_blank" rel="noopener noreferrer">{guide.sourceLabel}</a>. Check the current operator's signposted ramps and closures.</p>
  </section>;
}
