import Link from "next/link";
import { php } from "@/lib/utils";
import { observedMarketRange } from "@/lib/marketChecks";
import { ownershipDefaults, estimatedUsedValue } from "@/lib/ownership";
import type { Motorcycle } from "@/lib/types";

// Generation-comparison content for the model family hubs.
//
// These hubs answer the highest-volume queries on the site — "nmax price
// philippines", "aerox price philippines" — where the searcher has not said
// which generation they mean. That is the question the page should answer, so
// everything here is a comparison across the family's own generations rather
// than a repeat of the current model's spec sheet.

type Props = { family: { make: string; name: string }; models: Motorcycle[] };


export function ModelFamilyGuide({ family, models }: Props) {
  if (models.length < 2) return null;

  const current = models.find(m => m.marketStatus !== "previous") || models[0];
  const previous = models.filter(m => m !== current);
  const older = previous[0];

  const curFrom = observedMarketRange(current).from;
  const oldFrom = older ? observedMarketRange(older).from : undefined;
  const gap = curFrom && oldFrom ? curFrom - oldFrom : undefined;

  const cc = current.engineCc - (older?.engineCc ?? current.engineCc);
  const hp = Number((current.powerHp - (older?.powerHp ?? current.powerHp)).toFixed(1));
  const kg = current.curbWeightKg - (older?.curbWeightKg ?? current.curbWeightKg);
  const seat = current.seatHeightMm - (older?.seatHeightMm ?? current.seatHeightMm);
  const sameTires = older ? current.frontTire === older.frontTire && current.rearTire === older.rearTire : true;

  const d = ownershipDefaults(current);
  const monthlyFuel = Math.round((d.kmPerMonth / d.estimatedKmPerL) * d.fuelPricePerL);
  const usedThree = curFrom ? estimatedUsedValue(current, 3) : undefined;

  return <div className="family-guide">
    <div className="section-head inline-head"><div>
      <span className="section-kicker">Generation buying guide</span><h2>What actually changed between {family.name} generations?</h2>
      <p>Once you know the exact generation, compare the differences that can change the buying decision: purchase price, dimensions, tires, condition and ownership stage.</p>
    </div></div>

    <div className="split section">
      <div>
        <h3>Price and mechanical changes</h3>
        <p>
          MotoIndex records {models.length} {family.name} generations
          {models.map(m => ` ${m.model} (${m.generation})`).join(",").replace(/,([^,]*)$/, " and$1")}.
          {" "}{gap && gap > 0
            ? `On observed prices the current ${current.model} sits about ${php(gap)} above the ${older!.model}, which is the number most people are really weighing when they search.`
            : "Observed prices for the generations are close enough that the decision usually comes down to condition and availability rather than list price."}
        </p>
        <p>
          {cc === 0 && hp === 0
            ? `Mechanically the two are closer than the model names suggest — same ${current.engineCc} cc engine and the same claimed ${current.powerHp} hp. `
            : `The current bike moves to ${current.engineCc} cc and ${current.powerHp} hp${cc !== 0 ? ` (${cc > 0 ? "+" : ""}${cc} cc` : " ("}${hp !== 0 ? `, ${hp > 0 ? "+" : ""}${hp} hp` : ""}) against the ${older?.model}. `}
          {kg !== 0 && `It is ${Math.abs(kg)} kg ${kg > 0 ? "heavier" : "lighter"}, `}
          {seat !== 0 && `the seat sits ${Math.abs(seat)} mm ${seat > 0 ? "higher" : "lower"}, `}
          {sameTires
            ? `and both run the same ${current.frontTire} front and ${current.rearTire} rear, so tires and fitment carry across.`
            : `and the tire sizes differ, so do not carry a size from one generation to the other.`}
        </p>

        <h3>New or used?</h3>
        <p>
          {curFrom && <>The current {current.model} starts around {php(curFrom)} on the sources MotoIndex checks. </>}
          {usedThree && <>A three-year-old example in good condition models out near {php(usedThree)} on the same basis, so the first years carry most of the depreciation — which is the argument for buying the outgoing generation used rather than new. </>}
          Against that, the older bike is closer to its service milestones and may need consumables sooner, so the saving is smaller than the sticker gap implies.
        </p>
        <p>
          Running cost barely separates them. At {d.kmPerMonth.toLocaleString()} km a month and{" "}
          {php(d.fuelPricePerL)} a litre, the current {current.model} burns roughly {php(monthlyFuel)} of fuel a
          month. A generation gap of this size does not change that materially, so choose on condition,
          paperwork and price rather than on expected fuel savings.
        </p>
      </div>

      <div className="info-card">
        <h3>Spot the difference quickly</h3>
        <ul className="checklist">
          <li>Check the OR/CR for the model year, not the seller&apos;s description</li>
          {!sameTires && <li>Tire sizes differ between generations — check the sidewall</li>}
          {seat !== 0 && <li>Seat height differs by {Math.abs(seat)} mm — worth sitting on both</li>}
          <li>Frame and engine numbers should match the papers exactly</li>
          <li>Ask which generation a quoted price refers to</li>
        </ul>
        <Link href="/compare">Compare these side by side →</Link>
      </div>
    </div>

  </div>;
}
