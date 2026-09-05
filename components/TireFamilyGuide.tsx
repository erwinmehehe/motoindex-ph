import Link from "next/link";
import { maintenanceForModel } from "@/lib/maintenance";
import type { Motorcycle } from "@/lib/types";

// Buying guidance for the tire-size family hubs.
//
// The hubs listed stock sizes but stopped there, which left them thin on the
// highest-demand tire queries. Everything below is derived from the models in
// each hub — their actual front and rear sizes, whether the generations differ,
// and any recorded pressure figures — so the three hubs do not repeat the same
// text.

type Props = { models: Motorcycle[]; shortName: string };

function parseSize(size: string) {
  const m = size.match(/^(\d+)\s*\/\s*(\d+)\s*-\s*(\d+)/);
  if (!m) return undefined;
  return { width: Number(m[1]), aspect: Number(m[2]), rim: Number(m[3]) };
}

export function TireFamilyGuide({ models, shortName }: Props) {
  if (!models.length) return null;

  const fronts = [...new Set(models.map(m => m.frontTire))];
  const rears = [...new Set(models.map(m => m.rearTire))];
  const sameAcrossGenerations = fronts.length === 1 && rears.length === 1;
  const sample = parseSize(models[0].frontTire);
  const rearSample = parseSize(models[0].rearTire);
  const widerRear = sample && rearSample ? rearSample.width > sample.width : false;
  const rimSizes = [...new Set(models.flatMap(m => [parseSize(m.frontTire)?.rim, parseSize(m.rearTire)?.rim]).filter(Boolean))] as number[];
  const mixedRims = rimSizes.length > 1;

  const withPressure = models
    .map(m => ({ model: m, maintenance: maintenanceForModel(m.id) }))
    .filter(x => x.maintenance?.tirePressure);

  return <div className="tire-guide">
    <div className="section-head inline-head"><div><h2>Reading a {shortName} tire size</h2></div></div>

    <div className="split section">
      <div>
        {sample && <p>
          The stock front size on the {shortName} reads {models[0].frontTire}. The first number,{" "}
          {sample.width}, is the nominal section width in millimetres. The second, {sample.aspect}, is the
          aspect ratio — the sidewall height as a percentage of that width, so roughly{" "}
          {Math.round(sample.width * sample.aspect / 100)} mm here. The last number, {sample.rim}, is the rim
          diameter in inches, and it is the one figure you cannot change without changing the wheel.
        </p>}
        {widerRear && rearSample && sample && <p>
          The rear runs wider at {models[0].rearTire} — {rearSample.width} mm against {sample.width} mm at the
          front. That is normal: the rear carries more load and puts the power down, while a narrower front
          keeps steering light. Fitting the rear size to the front because it looks better is a common and bad
          idea; it changes steering feel and may not clear the mudguard.
        </p>}
        {mixedRims && <p>
          Note that this family does not use one rim size front and rear ({rimSizes.sort((a, b) => b - a).join(" and ")} inch),
          so you cannot buy a matched pair. Order each end by its own size.
        </p>}

        <h3>What the printed size does not tell you</h3>
        <p>
          Matching {models[0].frontTire} is only the starting point. A tire that shares the printed size can
          still be wrong for the bike if the load index or speed rating is lower than standard, if it is a
          tube-type carcass on a tubeless rim, or if the tread pattern is meant for a different use. Those
          markings sit next to the size on the sidewall, and they are what separates two tires that look
          identical on a listing.
        </p>
        <p>
          Rim width matters too. Every size has an approved rim-width range, and a tire mounted on a rim
          outside that range changes profile in ways that affect grip and wear, even when it physically fits.
        </p>
      </div>

      <div className="info-card">
        <h3>Before you order</h3>
        <ul className="checklist">
          <li>Read the size off your own sidewall, not from a listing</li>
          <li>Match the load index and speed rating, not just the size</li>
          <li>Confirm tube or tubeless matches your rim</li>
          <li>Check the four-digit date code — tires age on the shelf</li>
          <li>Replace front and rear as a pair where wear allows</li>
        </ul>
        <Link href="/tires">Match a motorcycle to tire sizes →</Link>
      </div>
    </div>

    <div className="split section">
      <div>
        <h3>{sameAcrossGenerations ? "The generations share a size" : "The generations do not share a size"}</h3>
        {sameAcrossGenerations ? <p>
          Every {shortName} generation MotoIndex records here uses {models[0].frontTire} front and{" "}
          {models[0].rearTire} rear, so a size quoted for one generation is safe to use for the others. That
          is not true of most families, which is exactly why MotoIndex keeps each generation on its own page
          rather than publishing one size for the model name.
        </p> : <p>
          The {shortName} generations recorded here do not use the same sizes — {fronts.join(" and ")} at the
          front, and {rears.join(" and ")} at the rear. This is the trap with searching by model name alone:
          a size that is correct for one year is wrong for another. Open the generation that matches your own
          bike before ordering.
        </p>}
        <ul className="tire-generation-list">
          {models.map(m => <li key={m.id}>
            <strong>{m.make} {m.model}</strong>
            <span>{m.generation}</span>
            <em>{m.frontTire} front · {m.rearTire} rear</em>
          </li>)}
        </ul>
      </div>

      <div>
        <h3>Pressure, and why it matters more than brand</h3>
        {withPressure.length ? <>
          <p>
            Where a model-specific figure has been recorded, MotoIndex publishes it rather than a generic
            number. {withPressure.map(x => `${x.model.model} runs ${x.maintenance!.tirePressure!.soloFrontPsi}/${x.maintenance!.tirePressure!.soloRearPsi} psi solo`).join(", and ")}.
          </p>
          <p>
            Those figures assume cold tires. Checking pressure after a ride reads high and will leave you
            under-inflated once they cool, which is the single most common cause of uneven wear and vague
            steering in city traffic.
          </p>
        </> : <p>
          MotoIndex only publishes a pressure figure when a model-specific source has been recorded, and
          there is not one for every generation here yet. Use the placard on the swingarm or the owner&apos;s
          manual for your exact bike, and check it cold.
        </p>}
        <h3>When to replace</h3>
        <p>
          Replace at the tread wear indicators moulded into the grooves, not when the tire looks bald — by
          then you have been riding on a compromised tire for a while. Age matters independently of tread:
          rubber hardens over years, and a five-year-old tire with plenty of tread grips noticeably worse in
          the wet, which for Philippine riding is the condition that matters.
        </p>
      </div>
    </div>
  </div>;
}
