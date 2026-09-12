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
  "yamaha-aerox-v3": {
    fit: ["You want a light 155cc automatic with a sport-scooter riding position.", "You are comparing stronger acceleration and lower weight against more comfort-led premium scooters."],
    check: ["Compare Standard and SP equipment before comparing prices.", "Test the 790 mm seat and rear suspension with your normal passenger or luggage load."],
    ownership: "Price the exact variant, insurance, tires and CVT service together. A low monthly payment can hide a more expensive trim or financing package.",
    alternatives: ["yamaha-nmax-v3", "honda-click-160", "honda-adv-160"]
  },
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
  "ktm-rc-390": {
    fit: ["You want a lightweight single-cylinder sport bike and are comfortable with a more committed riding position.", "Handling focus matters more than relaxed commuting ergonomics."],
    check: ["Confirm the exact generation and Philippine model-year specification because RC 390 equipment changes across generations.", "Check KTM service access and sport-tire costs before choosing it on performance alone."],
    ownership: "Budget for premium tires, insurance and scheduled service, then compare the ownership picture with Ninja 500 and 450SR.",
    alternatives: ["kawasaki-ninja-500", "cfmoto-450sr", "ktm-390-duke"]
  }
};

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
  </section>;
}
