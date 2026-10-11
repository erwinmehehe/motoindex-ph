import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import type { MaintenanceSchedule } from "@/lib/maintenance";
import { DataTable, SectionHeader } from "@/components/ui";

// Share the model page's existing responsive cards, editorial columns and
// data-table styles. A separate page-wide stylesheet exceeded the CSS budget.
const serviceColumns = {
  gridTemplateColumns: "minmax(150px, 1fr) minmax(96px, .5fr) minmax(220px, 1.5fr)"
};

/**
 * Manufacturer-referenced service information beside the motorcycle's details.
 * The model and manual edition must match before applying any specifications.
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

  return <section id="maintenance" className="motorcycle-entity-section" aria-labelledby="service-specifications-heading">
    <SectionHeader
      kicker="Manufacturer reference"
      title={modelName + " maintenance and service specifications"}
      titleId="service-specifications-heading"
      description="Engine and final-drive oil, spark-plug code, cold tire pressures and service intervals, with the cited model-manual edition."
      aside={<span className="ui-section-count">{exactPhilippinesManual ? "Philippines manual" : "Regional manual reference"}</span>}
    />

    <div className="entity-fit-kpis" aria-label={modelName + " quick service specifications"}>
      <div><span>Engine oil refill</span><strong>{specs.engineOilAfterDrainL.toFixed(2)} L</strong><small>After normal draining</small></div>
      <div><span>Final-drive oil refill</span><strong>{specs.finalDriveOilAfterDrainL.toFixed(2)} L</strong><small>After normal draining</small></div>
      <div><span>Spark plug</span><strong>{specs.sparkPlugCode}</strong><small>Gap: {specs.sparkPlugGapMm}</small></div>
      <div><span>Engine-oil viscosity</span><strong>{specs.engineOilViscosity}</strong><small>{specs.engineOilStandard}</small></div>
    </div>
    <p className="entity-section-note">These are ordinary oil-change refill amounts, not dry-engine capacities. Verify the exact year and variant, and follow the manual's oil-level inspection procedure.</p>

    <div className="motorcycle-editorial-grid">
      <article className="editorial-best">
        <span>Owner's manual</span>
        <h3>Service intervals</h3>
        <p>{schedule.items.length} referenced service items. An inspection interval does not automatically require replacement.</p>
        <DataTable label={modelName + " maintenance intervals"}>
          <div role="row" className="head" style={serviceColumns}>
            <span role="columnheader">Service item</span>
            <span role="columnheader">Action</span>
            <span role="columnheader">When</span>
          </div>
          {schedule.items.map((item) => <div role="row" style={serviceColumns} key={item.item}>
            <span role="cell"><strong>{item.item}</strong>{item.note && <small>{item.note}</small>}</span>
            <span role="cell">{item.action}</span>
            <span role="cell">{item.interval}</span>
          </div>)}
        </DataTable>
      </article>

      <article>
        <span>Model evidence</span>
        <h3>Reference and applicability</h3>
        <ul>
          <li>Model / manual: <strong>{specs.manualModelCode}</strong></li>
          <li>Market: <strong>{specs.sourceMarket}</strong></li>
          <li>Specifications checked: <strong>{specs.checkedAt}</strong></li>
        </ul>
        <p>{specs.applicability}</p>
        <p><a className="button secondary" href={schedule.sourceUrl} target="_blank" rel="noreferrer">Open manufacturer manual ↗</a></p>
        <p><strong>Important service note:</strong> {specs.serviceNote}</p>
      </article>

      {tirePressure && <article>
        <span>Cold tire pressure</span>
        <h3>Front / rear pressure</h3>
        <p>Verify against the label on your motorcycle and the cited manual.</p>
        <ul>
          <li><strong>Rider only:</strong> {tirePressure.soloFrontPsi} / {tirePressure.soloRearPsi} psi</li>
          {!samePressureWithPassenger && <li><strong>Rider + passenger:</strong> {tirePressure.passengerFrontPsi} / {tirePressure.passengerRearPsi} psi</li>}
        </ul>
      </article>}
    </div>

    <p className="entity-section-note">
      <Link href="/maintenance">Explore motorcycle maintenance topics →</Link>
      {" · "}
      <Link href="/tires">Check tire-size guides →</Link>
    </p>
  </section>;
}
