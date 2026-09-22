import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { getModelById } from "@/lib/data";

type Brief = {
  fit: string[];
  check: string[];
  ownership: string;
  alternatives: string[];
};

const briefs: Record<string, Brief> = {

  "yamaha-nmax-v3": {
    fit: ["You want a premium 155cc automatic with a lower 770 mm published seat and larger 7.1 L tank.", "Comfort, weather protection and longer daily rides matter more than minimum weight."],
    check: ["Confirm Standard versus Tech Max pricing and equipment.", "At 131 kg curb weight, test parking and U-turn confidence rather than judging fit from seat height alone."],
    ownership: "Compare the final on-road price and financing terms with PCX 160 and Aerox V3, then budget for CVT consumables and model-specific tires.",
    alternatives: ["honda-pcx-160", "yamaha-aerox-v3", "honda-adv-160"]
  },
  "honda-adv-160": {
    fit: ["You want an automatic scooter with more ground clearance and an 8.1 L tank for mixed city and provincial use.", "You value the ADV layout and current ABS/HSTC equipment more than minimum purchase price."],
    check: ["Confirm the exact ABS/RoadSync variant and current dealer price.", "Test the 780 mm seat and 133 kg curb weight with your normal footwear and luggage plans."],
    ownership: "Budget for the exact tire sizes, body panels and routine CVT service, then compare dealer support along the routes you actually use.",
    alternatives: ["honda-pcx-160", "yamaha-nmax-v3", "yamaha-aerox-v3"]
  },
  "honda-click-160": {
    fit: ["You want a compact 157cc automatic that stays lighter than many premium 160cc scooters.", "City maneuverability and purchase price matter more than a large fuel tank or touring bodywork."],
    check: ["The stored braking record is CBS rather than ABS, so compare braking equipment deliberately.", "Confirm current dealer price, color and stock instead of relying on an old marketplace listing."],
    ownership: "Its 14-inch tire sizes and 5.5 L tank are straightforward commuter considerations. Compare fuel, CVT service and insurance with the Click 125i before paying more for the larger engine.",
    alternatives: ["honda-click-125i", "yamaha-aerox-v3", "honda-pcx-160"]
  },
  "honda-pcx-160": {
    fit: ["You want a comfort-led 160cc-class automatic with a larger tank than a basic commuter scooter.", "You are shopping against NMAX rather than only smaller Click/Mio commuters."],
    check: ["Compare exact trim and braking equipment rather than treating every PCX 160 listing as identical.", "Test low-speed weight, seat width and passenger space in person."],
    ownership: "Compare the final dealer price, financing and insurance with NMAX V3, then include tires and CVT service in the monthly ownership estimate.",
    alternatives: ["yamaha-nmax-v3", "honda-adv-160", "honda-click-160"]
  },
  "yamaha-fazzio": {
    fit: ["You want a small automatic commuter with retro styling and a purchase price below the premium 155–160cc class.", "Ease of daily city use matters more than high output or long-distance bodywork."],
    check: ["Confirm current variant pricing and color availability.", "Compare storage, braking equipment and actual rider fit with other small automatic scooters."],
    ownership: "Use the lower purchase price as a starting point, then compare fuel, tires, CVT maintenance and resale expectations with Mio Gear and Click 125i.",
    alternatives: ["yamaha-mio-gear", "honda-click-125i", "honda-giorno-plus"]
  },
  "honda-click-125i": {
    fit: ["You want a widely used automatic commuter without paying for 160cc-class performance.", "Low daily running cost and simple city use are higher priorities than touring equipment."],
    check: ["Confirm the exact current generation and dealer price before comparing with used or older listings.", "Compare braking equipment, storage and seat fit rather than looking only at engine size."],
    ownership: "This is the kind of model where fuel, routine CVT service, tires and dealer convenience can matter more over time than a small difference in purchase price.",
    alternatives: ["yamaha-mio-gear", "yamaha-fazzio", "honda-click-160"]
  },
  "yamaha-mio-gear": {
    fit: ["You want an affordable automatic for short daily trips and stop-go traffic.", "A lighter, simpler commuter is more useful to you than premium scooter features."],
    check: ["Confirm the exact variant because pricing and equipment can differ.", "Compare seat reach, under-seat storage and braking equipment with Click 125i and Fazzio."],
    ownership: "Keep the comparison practical: final cash price, fuel, CVT service, tire availability and nearby Yamaha service matter more than cosmetic differences.",
    alternatives: ["honda-click-125i", "yamaha-fazzio", "suzuki-burgman-street"]
  },
  "suzuki-raider-r150": {
    fit: ["You want a light manual underbone with substantially more performance focus than a basic commuter.", "You prefer manual control and low mass over automatic traffic convenience."],
    check: ["Compare braking equipment and exact variant before buying.", "Insurance, riding experience and theft/security planning deserve attention on a performance-oriented underbone."],
    ownership: "Compare tires, chain/sprocket service, insurance and fuel with Sniper 155 and Winner X instead of judging the bikes only by horsepower.",
    alternatives: ["yamaha-sniper-155", "honda-winner-x"]
  },
  "yamaha-sniper-155": {
    fit: ["You want a manual sport underbone with a 155cc engine for mixed commuting and spirited road use.", "You prefer a clutch and underbone layout to an automatic scooter."],
    check: ["Verify current variant equipment and braking package.", "Test the riding position and low-speed clutch control in the traffic conditions you actually face."],
    ownership: "Price chain/sprocket maintenance, tires, insurance and final dealer fees alongside the purchase price when comparing Raider R150 Fi and Winner X.",
    alternatives: ["suzuki-raider-r150", "honda-winner-x"]
  },
  "kawasaki-ninja-500": {
    fit: ["You want a current middleweight twin-cylinder sport bike with full fairings and ABS context.", "You are ready to budget beyond commuter-bike running costs for tires, insurance and bodywork."],
    check: ["Confirm the exact Philippine trim and current price.", "Test the sport-bike ergonomics and parking weight before treating engine displacement as the only step up from a smaller bike."],
    ownership: "Run the full cost with insurance, larger tires, service and potential fairing repair. Compare it with 450SR and RC 390 on total ownership, not just purchase price.",
    alternatives: ["cfmoto-450sr", "ktm-rc-390"]
  },
  "kawasaki-ninja-400": {
    fit: ["You are researching a previous-generation Ninja 400 for used-bike ownership rather than assuming its historical new-bike price is still current.", "You want a lightweight faired twin and are willing to inspect condition and history carefully."],
    check: ["Confirm model year, mileage, service history and any applicable recall or service-campaign status for the exact unit.", "Inspect tires, chain and sprockets, fairing condition and evidence of crash repairs before comparing asking prices."],
    ownership: "Treat the asking price as only the start. Add transfer and registration costs, insurance, tires, chain/sprocket wear and near-term service, then compare the result with the current Ninja 500 and other sport-bike alternatives.",
    alternatives: ["kawasaki-ninja-500", "cfmoto-450sr", "ktm-rc-390"]
  },
  "ktm-rc-390": {
    fit: ["You want a lightweight single-cylinder sport bike and are comfortable with a more committed riding position.", "Handling focus matters more than relaxed commuting ergonomics."],
    check: ["Confirm the exact generation and Philippine model-year specification because RC 390 equipment changes across generations.", "Check KTM service access and sport-tire costs before choosing it on performance alone."],
    ownership: "Budget for premium tires, insurance and scheduled service, then compare the ownership picture with Ninja 500 and 450SR.",
    alternatives: ["kawasaki-ninja-500", "cfmoto-450sr", "ktm-390-duke"]
  },
  "cfmoto-450mt": {
    fit: ["You want a 449cc twin-cylinder adventure bike with 21/18-inch wheels and more off-road-oriented geometry than a road-biased tourer.", "Longer rides, luggage and rougher provincial roads matter enough to justify a taller and heavier motorcycle."],
    check: ["Test the 820 mm seat and 175 kg curb weight at walking pace, especially with luggage.", "Confirm current CFMOTO dealer and service access along the routes where you expect to travel."],
    ownership: "Price adventure-size tires, insurance, scheduled service and accessories before comparing the 450MT with lighter or more road-focused alternatives.",
    alternatives: ["royal-enfield-himalayan-450", "honda-adv-350"]
  },
  "cfmoto-450sr": {
    fit: ["You want a fully faired 449.5cc parallel-twin sport bike with a lower purchase price than some established middleweight alternatives.", "You are comfortable prioritizing sport-bike bodywork and riding position over commuter practicality."],
    check: ["Confirm the current Philippine price and exact model-year equipment.", "Compare dealer coverage, parts access, insurance and fairing-repair cost before choosing on specification value alone."],
    ownership: "Run the real quote with 17-inch sport tires, insurance and scheduled service, then compare the total against Ninja 500 and RC 390.",
    alternatives: ["kawasaki-ninja-500", "ktm-rc-390"]
  },
  "honda-adv-150": {
    fit: [
      "You are researching a previous-generation ADV150 for used-bike ownership and want Honda adventure-scooter ergonomics at a lower entry price than a new ADV160.",
      "An automatic 150cc scooter with an 8 L tank, 165 mm ground clearance and single-channel ABS fits your city and provincial-road use."
    ],
    check: [
      "Treat the ₱149,000 figure as historical Philippine launch pricing, not a current new-bike quote.",
      "Inspect CVT service history, tires, brakes, body panels, mileage and registration before comparing used asking prices."
    ],
    ownership: "Price transfer costs, insurance, near-term CVT service, 14/13-inch tires and any deferred maintenance, then compare the total with a current ADV160 rather than looking only at the used-bike asking price.",
    alternatives: ["honda-adv-160", "honda-pcx-160", "yamaha-nmax-v3"]
  },
  "kawasaki-ninja-zx-4rr": {
    fit: [
      "You specifically want a current 401cc inline-four supersport rather than a twin-cylinder middleweight.",
      "You are comfortable budgeting for a high-output faired motorcycle, 17-inch sport tires and manual-clutch ownership."
    ],
    check: [
      "Confirm the exact current dealer quote and model-year stock before comparing it with older ZX-4RR listings.",
      "Test the 800 mm seat and 188 kg curb weight in traffic and parking, not only at speed."
    ],
    ownership: "Include insurance, sport tires, chain and sprockets, scheduled service, premium consumables and fairing exposure when comparing the ZX-4RR with Ninja 500, ZX-25R and R7.",
    alternatives: ["kawasaki-ninja-500", "kawasaki-ninja-zx-25r", "yamaha-yzf-r7"]
  },
  "honda-x-adv": {
    fit: [
      "You want a 745cc DCT motorcycle with scooter practicality and premium long-distance capability.",
      "A 13.2 L tank, 2-channel ABS and automatic DCT matter more than minimum curb weight or low purchase price."
    ],
    check: [
      "At 237 kg with an 820 mm seat, test parking, U-turns and low-speed footing before treating the DCT as automatically easy.",
      "Confirm the exact current Honda big-bike quote and included equipment before comparing financing."
    ],
    ownership: "Budget premium insurance, 17/15-inch tires, DCT service, body panels, touring accessories and Honda big-bike service access together with the ₱1.17M purchase reference.",
    alternatives: ["honda-adv-350", "suzuki-burgman-400", "zontes-400g"]
  },
  "cfmoto-300sr": {
    fit: [
      "You want a current fully faired sport bike around the ₱165K level with a 780 mm seat and dual-channel ABS.",
      "A 292.4cc single and lower entry price suit your needs more than moving directly to a 400–500cc twin."
    ],
    check: [
      "Confirm current stock, model year and dealer quote because market pricing can move independently of the specification source.",
      "Compare local CFMOTO service access, parts lead times and fairing-repair cost before buying only on specification value."
    ],
    ownership: "Price insurance, 17-inch tires, chain and sprocket service, scheduled maintenance and fairing exposure, then compare the full ownership cost with R3, RC 390 and 450SR.",
    alternatives: ["yamaha-yzf-r3", "ktm-rc-390", "cfmoto-450sr"]
  },
  "cfmoto-400nk": {
    fit: [
      "You want a 400cc parallel-twin naked motorcycle with ABS and a large 17 L tank near the ₱219K recorded price.",
      "You value engine size and road-bike versatility more than minimum curb weight."
    ],
    check: [
      "At 206 kg with an 815 mm seat, test low-speed handling and parking confidence before choosing from the spec sheet.",
      "Confirm current dealer stock, final price and model year because the stored price reference comes from a Philippine comparison listing."
    ],
    ownership: "Compare 17-inch tire costs, chain and sprockets, insurance, scheduled service, parts access and dealer coverage with 390 Duke, Z500 and MT-07 before choosing on acquisition price alone.",
    alternatives: ["ktm-390-duke", "kawasaki-z500", "yamaha-mt-07"]
  },
  "yamaha-yzf-r15m": {
    fit: [
      "You want a lightweight manual sport bike and specifically value the R-series riding position, ABS and traction control.",
      "A 155cc engine, 140 kg curb weight and 815 mm seat fit your intended mix of city riding and sport-bike ownership."
    ],
    check: [
      "Confirm the current dealer quote, color and model year before comparing it with older R15 listings.",
      "Test the 815 mm seat and forward riding position in traffic before choosing from price and styling alone."
    ],
    ownership: "Include insurance, 17-inch tires, chain and sprockets, scheduled service and fairing exposure when comparing the R15M with the R3, RC 390 and 300SR.",
    alternatives: ["yamaha-yzf-r3", "ktm-rc-390", "cfmoto-300sr"]
  },
  "honda-cbr650r": {
    fit: [
      "You want an inline-four middleweight sport bike with 2-channel ABS and a full-fairing road-bike package.",
      "You are comfortable with 208 kg curb weight and want to compare Standard and E-Clutch variants rather than one generic CBR650R price."
    ],
    check: [
      "Confirm the exact current variant, dealer quote and included E-Clutch equipment before comparing payments.",
      "Test the riding position and low-speed weight, especially if most of your riding is urban."
    ],
    ownership: "Budget insurance, 17-inch sport tires, chain and sprockets, bodywork exposure and Honda Big Wing service together with the purchase price.",
    alternatives: ["honda-cb650r", "yamaha-yzf-r7", "kawasaki-ninja-500"]
  },
  "yamaha-yzf-r7": {
    fit: [
      "You want a 689cc twin-cylinder sport bike with a focused R-series riding position and full-size 17-inch chassis.",
      "You are comfortable with an 855 mm seat and are prioritizing sport-road use over relaxed commuting ergonomics."
    ],
    check: [
      "Test seat reach, wrist load and low-speed control before choosing it from engine size and styling alone.",
      "Confirm the current Philippine dealer quote and model-year stock before comparing financing."
    ],
    ownership: "Price insurance, sport tires, chain and sprockets, scheduled service and fairing exposure before comparing the R7 with CBR650R, Ninja 500 and 450SR.",
    alternatives: ["honda-cbr650r", "kawasaki-ninja-500", "cfmoto-450sr"]
  },
  "kawasaki-ninja-zx-25r": {
    fit: [
      "You specifically want a small-displacement inline-four supersport rather than a conventional single or twin-cylinder entry sport bike.",
      "A 785 mm seat, ABS and current Standard/SE model range fit your sport-bike priorities."
    ],
    check: [
      "Confirm Standard versus SE pricing and exact model-year equipment before treating every ZX-25R listing as equivalent.",
      "Compare the ownership cost with larger-displacement alternatives instead of assuming 250cc automatically means cheaper to run."
    ],
    ownership: "Budget high-performance tires, chain and sprockets, insurance, fairing exposure and Kawasaki service access, then compare the total with ZX-4RR, R3 and 450SR.",
    alternatives: ["kawasaki-ninja-zx-4rr", "yamaha-yzf-r3", "cfmoto-450sr"]
  },
  "bajaj-dominar-400": {
    fit: [
      "You want a 373.3cc sport-touring motorcycle with twin-channel ABS, an upright road-biased package and a 13 L tank.",
      "You value purchase price and touring utility more than minimum curb weight."
    ],
    check: [
      "At 192 kg, test parking and low-speed balance before choosing from price and engine size alone.",
      "Confirm the exact registration details and current tollway rules instead of assuming the Dominar 400 name guarantees expressway access."
    ],
    ownership: "Price 17-inch tires, chain and sprockets, insurance, scheduled service and TriMotors support before comparing it with 390 Duke, Speed 400 and Z500.",
    alternatives: ["ktm-390-duke", "triumph-speed-400", "kawasaki-z500"]
  },
  "kawasaki-ninja-h2": {
    fit: [
      "You specifically want a current supercharged flagship hypersport rather than a conventional litre-class sport bike.",
      "You are prepared for premium insurance, high-performance consumables and the ownership demands that come with 231 hp."
    ],
    check: [
      "Confirm the exact H2 Carbon model year, dealer quote and included equipment before comparing it with older H2 listings.",
      "Test the 825 mm seat and 238 kg curb weight at parking speed; the headline power figure says very little about low-speed usability."
    ],
    ownership: "Budget 200-section rear tires, chain and sprockets, insurance, scheduled service, battery/electronics care and bodywork exposure before comparing the H2 with R1M or Z H2.",
    alternatives: ["yamaha-yzf-r1m", "kawasaki-z-h2"]
  },
  "honda-rebel-1100": {
    fit: [
      "You want a large-displacement cruiser with a low 709 mm published seat and DCT convenience.",
      "You are comfortable managing a 237 kg motorcycle and want substantially more torque than the Rebel 500."
    ],
    check: [
      "Test low-speed balance and parking confidence; a low seat does not erase the motorcycle's curb weight.",
      "Confirm the current Philippine dealer quote, exact variant and DCT equipment before comparing monthly payments."
    ],
    ownership: "Include 18/16-inch tire costs, insurance, DCT service, battery care and Honda big-bike service access when comparing the Rebel 1100 with the Rebel 500 and other large road bikes.",
    alternatives: ["honda-rebel-500", "triumph-speed-twin-900", "royal-enfield-super-meteor-650"]
  }
};

function buyingGuideHref(model: Motorcycle) {
  if (/scooter|underbone/i.test(model.category)) return "/recommendations#commuting";
  if (model.engineCc >= 400) return "/recommendations#400cc";
  return "/recommendations";
}

export function PriorityModelBrief({ model }: { model: Motorcycle }) {
  const brief = briefs[model.id];
  if (!brief) return null;
  const alternatives = brief.alternatives.map(getModelById).filter((item): item is Motorcycle => Boolean(item));
  return <section className="priority-model-brief shell" aria-labelledby="priority-model-brief-heading">
    <div className="priority-model-brief-head"><span>Buyer brief</span><h2 id="priority-model-brief-heading">Before you decide on the {model.make} {model.model}</h2><p>A focused checklist for this specific model, using the price/spec context already documented on MotoIndex rather than adding another thin guide URL.</p></div>
    <div className="priority-model-brief-grid">
      <article><span>Strong fit if</span><ul>{brief.fit.map((item) => <li key={item}>{item}</li>)}</ul></article>
      <article><span>Check before buying</span><ul>{brief.check.map((item) => <li key={item}>{item}</li>)}</ul></article>
      <article><span>Ownership question</span><p>{brief.ownership}</p></article>
    </div>
    {alternatives.length > 0 && <div className="priority-model-alternatives"><strong>Compare before committing</strong>{alternatives.map((alt) => <Link key={alt.id} href={`/motorcycles/${alt.makeSlug}/${alt.slug}`}>{alt.make} {alt.model} →</Link>)}</div>}
    <div className="priority-model-alternatives"><strong>Research next</strong><Link href={buyingGuideHref(model)}>Buying guide →</Link><Link href={`/ownership/cost-calculator?bike=${model.id}`}>3-year ownership cost →</Link><Link href={`/commute/cost-calculator?bike=${model.id}`}>Commute cost →</Link><Link href="/compare">Compare motorcycles →</Link><Link href="/dealers">Dealer directory →</Link></div>
  </section>;
}
