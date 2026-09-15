import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { getModelById } from "@/lib/data";

type GrowthBrief = {
  fit: string[];
  check: string[];
  ownership: string;
  alternatives: string[];
  guideHref: string;
  guideLabel: string;
};

const growthBriefs: Record<string, GrowthBrief> = {
  "yamaha-lexi-155": {
    fit: [
      "You want a 155cc automatic near the ₱100K price point rather than moving straight to a premium NMAX-class budget.",
      "A 770 mm seat, 116 kg curb weight and 14-inch wheels suit your city-use priorities."
    ],
    check: [
      "Treat the ₱99,900 figure as the current Philippine launch/reference price and confirm the actual dealer quote before reserving.",
      "The stored Philippine record does not claim ABS, so compare braking hardware deliberately against higher-priced 155–160cc scooters."
    ],
    ownership: "Compare the final cash price, financing, CVT service, tire sizes and nearby Yamaha support with Aerox V3 and smaller 125cc commuters. The Lexi's value case is strongest when you want 155cc output without paying for the more expensive sport/premium scooter package.",
    alternatives: ["yamaha-aerox-v3", "yamaha-fazzio", "honda-click-160"],
    guideHref: "/recommendations#scooters",
    guideLabel: "Scooter buying guide"
  },
  "suzuki-burgman-400": {
    fit: [
      "You want a full-size automatic maxi scooter with a low 755 mm seat and a 13.5 L tank for longer rides.",
      "ABS, traction control and relaxed scooter ergonomics matter more than minimum curb weight."
    ],
    check: [
      "At 218 kg, test parking, U-turns and stop-go balance before choosing it only from seat-height figures.",
      "Compare the ₱566,000 published price with the total ownership cost of smaller maxi scooters, including insurance, large tires and CVT service."
    ],
    ownership: "The Burgman 400 sits above 300cc-class maxi scooters in purchase price and mass. Verify Suzuki big-bike service access, replacement tire availability and your real touring/storage needs before paying for the larger platform.",
    alternatives: ["yamaha-xmax", "bmw-c-400-gt", "honda-adv-350"],
    guideHref: "/recommendations#long-rides",
    guideLabel: "Long-ride buying guide"
  },
  "yamaha-yzf-r3": {
    fit: [
      "You want a 321cc twin-cylinder sport bike with a 780 mm seat and full-size 17-inch sport-bike chassis.",
      "You are ready for manual-clutch ownership and sport-bike insurance, tire and bodywork costs."
    ],
    check: [
      "Compare the current ₱294,000 Philippine price with RC 390 and newer 400–500cc alternatives rather than comparing displacement alone.",
      "Test the riding position in traffic and confirm current dealer stock, color and model year before placing a reservation."
    ],
    ownership: "Budget the R3 as a sport bike, not as a 150cc commuter: include insurance, 17-inch tires, chain and sprockets, scheduled service and potential fairing repair in the ownership comparison.",
    alternatives: ["ktm-rc-390", "kawasaki-ninja-500", "cfmoto-450sr"],
    guideHref: "/recommendations#explore",
    guideLabel: "Motorcycle buying guide"
  },
  "honda-airblade-160": {
    fit: [
      "You are specifically researching the 157cc AirBlade160 package, including its light 114 kg curb weight and front ABS.",
      "A compact automatic sport scooter matters more to you than a large tank or maxi-scooter bodywork."
    ],
    check: [
      "MotoIndex currently keeps this model out of public discovery because current official Philippine lineup availability still needs confirmation.",
      "Do not treat comparison-site availability alone as proof that a brand-new official Philippine unit is currently orderable; confirm with Honda or an authorized dealer."
    ],
    ownership: "If you find verified new local stock, compare the final quote, warranty status and parts support with current Click160, Aerox V3 and ADV160 listings before buying.",
    alternatives: ["honda-click-160", "yamaha-aerox-v3", "honda-adv-160"],
    guideHref: "/recommendations#scooters",
    guideLabel: "Scooter buying guide"
  }
};

export function GrowthModelBrief({ model }: { model: Motorcycle }) {
  const brief = growthBriefs[model.id];
  if (!brief) return null;
  const alternatives = brief.alternatives.map(getModelById).filter((item): item is Motorcycle => Boolean(item));
  const headingId = `growth-model-brief-${model.id}`;

  return <section className="priority-model-brief shell" aria-labelledby={headingId}>
    <div className="priority-model-brief-head">
      <span>Buyer brief</span>
      <h2 id={headingId}>What to check before buying the {model.make} {model.model}</h2>
      <p>Model-specific Philippine buying context built from the price, fit and equipment record on this page.</p>
    </div>
    <div className="priority-model-brief-grid">
      <article><span>Strong fit if</span><ul>{brief.fit.map((item) => <li key={item}>{item}</li>)}</ul></article>
      <article><span>Check before buying</span><ul>{brief.check.map((item) => <li key={item}>{item}</li>)}</ul></article>
      <article><span>Ownership question</span><p>{brief.ownership}</p></article>
    </div>
    {alternatives.length > 0 && <div className="priority-model-alternatives">
      <strong>Compare before committing</strong>
      {alternatives.map((alt) => <Link key={alt.id} href={`/motorcycles/${alt.makeSlug}/${alt.slug}`}>{alt.make} {alt.model} →</Link>)}
    </div>}
    <div className="priority-model-alternatives">
      <strong>Research next</strong>
      <Link href={brief.guideHref}>{brief.guideLabel} →</Link>
      <Link href={`/ownership/cost-calculator?bike=${model.id}`}>3-year ownership cost →</Link>
      <Link href={`/commute/cost-calculator?bike=${model.id}`}>Commute cost →</Link>
      <Link href="/compare">Compare motorcycles →</Link>
      <Link href="/dealers">Dealer directory →</Link>
    </div>
  </section>;
}
