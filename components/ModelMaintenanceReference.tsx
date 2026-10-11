import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import type { MaintenanceSchedule } from "@/lib/maintenance";
import styles from "./ModelMaintenanceReference.module.css";

/**
 * Server-rendered, source-backed maintenance information on the canonical
 * motorcycle page. Do not emit a new indexable URL per specification.
 */
export function ModelMaintenanceReference({
  model,
  schedule
}: {
  model: Motorcycle;
  schedule: MaintenanceSchedule;
}) {
  const specs = schedule.serviceSpecs;
  if (!specs) return null;

  const modelName = model.make + " " + model.model;
  const exactPhilippinesManual = specs.sourceMarket === "Philippines";
  const tirePressure = schedule.tirePressure;
  const samePressureWithPassenger = tirePressure
    ? tirePressure.soloFrontPsi === tirePressure.passengerFrontPsi &&
      tirePressure.soloRearPsi === tirePressure.passengerRearPsi
    : false;

  return <section id="maintenance" className={"motorcycle-entity-section " + styles.root} aria-labelledby="service-specifications-heading">
    <div className={styles.heading}>
      <div>
        <h2 id="service-specifications-heading">{modelName} maintenance and service specifications</h2>
        <p>Engine and transmission oil, spark plug, tire pressure and servicing intervals—kept with the exact model-manual reference.</p>
      </div>
      <span className={exactPhilippinesManual ? styles.sourceStatus : styles.sourceStatusRegional}>
        {exactPhilippinesManual ? "Philippines manual" : "Regional manual reference"}
      </span>
    </div>

    <div className={styles.specGrid} aria-label={modelName + " quick service specifications"}>
      <div className={styles.specCard}>
        <span>Engine oil refill</span>
        <strong>{specs.engineOilAfterDrainL.toFixed(2)} <small>L</small></strong>
        <p>After normal draining</p>
      </div>
      <div className={styles.specCard}>
        <span>Final-drive oil refill</span>
        <strong>{specs.finalDriveOilAfterDrainL.toFixed(2)} <small>L</small></strong>
        <p>After normal draining</p>
      </div>
      <div className={styles.specCard}>
        <span>Spark plug</span>
        <strong className={styles.partCode}>{specs.sparkPlugCode}</strong>
        <p>Gap: {specs.sparkPlugGapMm}</p>
      </div>
      <div className={styles.specCard}>
        <span>Engine-oil viscosity</span>
        <strong className={styles.oilGrade}>{specs.engineOilViscosity}</strong>
        <p>{specs.engineOilStandard}</p>
      </div>
    </div>
    <p className={styles.fillingNote}>Refill amounts are for an ordinary oil change after draining—not a dry-fill specification. Use the dipstick/inspection procedure in the owner's manual and confirm the exact motorcycle generation.</p>

    <div className={styles.contentGrid}>
      <div className={styles.serviceTableWrap}>
        <div className={styles.serviceTableHeading}>
          <h3>Owner-manual service intervals</h3>
          <p>{schedule.items.length} referenced service items. Inspection and replacement are different actions.</p>
        </div>
        <div className={styles.tableScroll}>
          <table className={styles.serviceTable}>
            <thead><tr><th scope="col">Service item</th><th scope="col">Action</th><th scope="col">When</th></tr></thead>
            <tbody>{schedule.items.map((entry) => <tr key={entry.item}>
              <td><strong>{entry.item}</strong>{entry.note ? <small>{entry.note}</small> : null}</td>
              <td><span className={entry.action === "Replace" ? styles.replace : styles.inspect}>{entry.action}</span></td>
              <td>{entry.interval}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </div>
      <aside className={styles.evidenceCard}>
        <h3>Reference and applicability</h3>
        <dl>
          <div><dt>Model / manual</dt><dd>{specs.manualModelCode}</dd></div>
          <div><dt>Market evidence</dt><dd>{specs.sourceMarket}</dd></div>
          <div><dt>Source checked</dt><dd>{schedule.lastChecked}</dd></div>
        </dl>
        <p>{specs.applicability}</p>
        <a className={styles.manualLink} href={schedule.sourceUrl} rel="noreferrer" target="_blank">Open manufacturer manual <span aria-hidden="true">↗</span></a>
        <div className={styles.sourceCaution}>
          <strong>Important service note</strong>
          <p>{specs.serviceNote}</p>
        </div>
      </aside>
    </div>

    {tirePressure && <div className={styles.pressureSection}>
      <div>
        <h3>Cold tire-pressure reference</h3>
        <p>Front and rear pressure from the cited model manual; check your own motorcycle's label.</p>
      </div>
      <div className={styles.pressureStats}>
        <div><span>Rider only</span><strong>{tirePressure.soloFrontPsi} / {tirePressure.soloRearPsi} <small>psi</small></strong><small>Front / rear</small></div>
        {!samePressureWithPassenger && <div><span>Rider + passenger</span><strong>{tirePressure.passengerFrontPsi} / {tirePressure.passengerRearPsi} <small>psi</small></strong><small>Front / rear</small></div>}
      </div>
    </div>}

    <div className={styles.footerNav}>
      <Link href="/maintenance">Explore maintenance topics →</Link>
      <Link href="/tires">Check tire-size guides →</Link>
    </div>
  </section>;
}
