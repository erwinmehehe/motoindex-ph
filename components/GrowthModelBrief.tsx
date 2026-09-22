import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { getModelById, isIndexableModel } from "@/lib/data";

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
    ownership: "Compare the final cash price, financing, CVT service, tire sizes and nearby Yamaha support with Aerox V3, NMAX V3 and Click 160. The Lexi's value case is strongest when you want 155cc output without paying for the more expensive sport or premium scooter package.",
    alternatives: ["yamaha-aerox-v3", "yamaha-nmax-v3", "honda-click-160"],
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
  "honda-rebel-500": {
    fit: [
      "You want a 471cc parallel-twin cruiser with a very low 690 mm published seat.",
      "You are comfortable managing 191 kg at parking speed in exchange for a larger road-bike platform and dual-channel ABS."
    ],
    check: [
      "Do not equate a low seat with a light motorcycle; sit on the bike, lift it off the side stand and test slow-speed balance before buying.",
      "Compare the ₱399,000 published price with insurance, 16-inch tire replacement, chain and sprocket service and the larger Rebel 1100."
    ],
    ownership: "The Rebel 500 can be approachable in seat height while still carrying big-bike running costs. Price insurance, tires, scheduled service, chain wear and Honda big-bike support together with the purchase price.",
    alternatives: ["honda-rebel-1100", "royal-enfield-hunter-350", "triumph-speed-400"],
    guideHref: "/recommendations#400cc",
    guideLabel: "400cc+ buying guide"
  },
  "zontes-400g": {
    fit: [
      "You want a 400cc automatic with a 770 mm seat, 17.5 L tank and adventure-style chassis rather than a conventional road maxi scooter.",
      "Dual-channel ABS, traction control and long-distance fuel capacity matter more than minimum curb weight."
    ],
    check: [
      "At 203 kg, test U-turns, parking and uneven-ground confidence before choosing it only from the low published seat height.",
      "Verify local Zontes/Bristol service access, replacement 17/14-inch tires, CVT parts and body-panel lead times before paying a reservation."
    ],
    ownership: "Compare the ₱408,800 Philippine launch price with Burgman 400, XMAX and C 400 GT on insurance, service access, tire availability, touring accessories and resale depth, not only standard equipment.",
    alternatives: ["suzuki-burgman-400", "yamaha-xmax", "bmw-c-400-gt"],
    guideHref: "/recommendations#long-rides",
    guideLabel: "Long-ride buying guide"
  },
  "honda-gold-wing": {
    fit: [
      "You want a flagship 1833cc flat-six tourer with seven-speed DCT, integrated luggage and very high long-distance comfort priorities.",
      "A 745 mm seat is attractive to you, but you are experienced and comfortable managing a 385 kg touring motorcycle at low speed."
    ],
    check: [
      "Compare the ₱2.05M–₱2.10M published variant range by exact equipment, including airbag availability, before treating the models as interchangeable.",
      "Test parking, reversing, passenger loading and garage access because curb weight and overall size matter more here than seat height alone."
    ],
    ownership: "Budget premium touring tires, insurance, Honda big-bike service, battery and electronics care, registration and long-distance consumables before comparing the Gold Wing with less complex touring motorcycles.",
    alternatives: ["honda-rebel-1100", "triumph-tiger-sport-660", "bmw-f-900-gs"],
    guideHref: "/recommendations#long-rides",
    guideLabel: "Long-distance buying guide"
  },
  "honda-crf150l": {
    fit: [
      "You specifically want a lightweight road-and-trail motorcycle with a 21-inch front wheel, 18-inch rear wheel and 285 mm ground clearance.",
      "An 863 mm seat works for your inseam and you are comfortable with tall dual-sport low-speed technique."
    ],
    check: [
      "Treat ₱147,900 as Honda Philippines' last official SRP MotoIndex located from June 2023, not as a confirmed 2026 dealer price.",
      "Honda first-party CRF150L materials publish different fuel-consumption figures, so verify real-world fuel use instead of buying from one headline km/L number."
    ],
    ownership: "Confirm current dealer availability first, then budget 21/18-inch trail tires, chain and sprocket wear, fork and suspension service, brake consumables and protection for off-road use. Compare those costs and the tall-seat fit with KLX150, WR155R and CRF300 Rally.",
    alternatives: ["kawasaki-klx150", "yamaha-wr155r", "honda-crf300-rally"],
    guideHref: "/recommendations#categories",
    guideLabel: "Dual-sport buying guide"
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
  const alternatives = brief.alternatives
    .map(getModelById)
    .filter((item): item is Motorcycle => Boolean(item && isIndexableModel(item)));
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
      <Link href={`/motorcycles/${model.makeSlug}`}>All {model.make} models →</Link>
      <Link href={`/ownership/cost-calculator?bike=${model.id}`}>3-year ownership cost →</Link>
      <Link href={`/commute/cost-calculator?bike=${model.id}`}>Commute cost →</Link>
      <Link href="/compare">Compare motorcycles →</Link>
      <Link href="/dealers">Dealer directory →</Link>
    </div>
  </section>;
}
