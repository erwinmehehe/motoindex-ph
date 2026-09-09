import Link from "next/link";
import { php } from "@/lib/utils";
import type { HelmetProduct } from "@/lib/types";

// Brand-level buying guidance for helmet hub pages.
//
// Every paragraph is driven by what is actually recorded for that brand — price
// band, helmet types, certification strings, shell materials, intercom readiness —
// so the 19 brand pages do not ship the same block of boilerplate. The Philippine
// regulatory facts are from RA 10054 (Motorcycle Helmet Act of 2009) and its
// implementing rules, DOTC-DTI Joint Administrative Order 2011-01.

type Props = {
  brand: string;
  verified: HelmetProduct[];
  types: string[];
  minPrice?: number;
  maxPrice?: number;
  trackedCount: number;
};

function priceBand(min?: number, max?: number) {
  if (!min) return undefined;
  if (max && max <= 3500) return "budget";
  if (min >= 12000) return "premium";
  if (min >= 6000) return "upper-mid";
  return "mainstream";
}

export function HelmetBrandGuide({ brand, verified, types, minPrice, maxPrice, trackedCount }: Props) {
  const band = priceBand(minPrice, maxPrice);
  const certStrings = verified.map(p => p.certification || "").filter(Boolean);
  const mentionsPsIcc = certStrings.some(c => /PS|ICC|BPS/i.test(c));
  const mentionsEce = certStrings.some(c => /ECE/i.test(c));
  const mentionsDot = certStrings.some(c => /DOT/i.test(c));
  const needsLocalCheck = certStrings.some(c => /verify|confirm|varies/i.test(c));
  const shells = [...new Set(verified.map(p => p.shell || "").filter(Boolean))];
  const composite = shells.some(s => /composite|fibre|fiber|carbon/i.test(s));
  const thermoplastic = shells.some(s => /thermoplastic|ABS|polycarbonate/i.test(s));
  const intercomReady = verified.filter(p => p.intercomReady).length;
  const hasModular = types.some(t => /modular|flip/i.test(t));
  const hasHalf = types.some(t => /half|open/i.test(t));
  const hasFull = types.some(t => /full/i.test(t));

  const marks: string[] = [];
  if (mentionsEce) marks.push("ECE");
  if (mentionsDot) marks.push("DOT");
  if (mentionsPsIcc) marks.push("PS/ICC");

  return <div className="brand-guide">
    <div className="section-head inline-head"><div><h2>Buying a {brand} helmet in the Philippines</h2></div></div>

    <div className="split section">
      <div>
        <h3>What moves the price</h3>
        {minPrice && maxPrice ? <p>
          The {brand} models documented here start between {php(minPrice)} and {php(maxPrice)}. Those are
          {" "}observed seller prices at the time each listing was checked, not a manufacturer SRP, so treat
          them as a starting band rather than a quote.
          {band === "budget" && " At this level you are usually looking at thermoplastic shells and simpler visor hardware, which is normal for the price and not automatically a safety problem — the certification marking matters more than the price tag."}
          {band === "mainstream" && " This is the range most Philippine commuters shop in, where you start seeing better visor mechanisms, removable liners and more size options."}
          {band === "upper-mid" && " At this level you are typically paying for shell material, ventilation design, visor optics and liner quality rather than a jump in the legal certification itself."}
          {band === "premium" && " At this level the spend goes into shell construction, multiple shell sizes, aerodynamics and finishing — the legal requirement to ride in the Philippines is unchanged, so buy this tier for fit and comfort, not to satisfy the law."}
        </p> : <p>
          Seller pricing is limited for the {brand} models currently covered. Open the individual model guide and compare the exact size, graphic and seller before buying.
        </p>}
        <p>
          The same model can carry different prices for reasons that have nothing to do with safety: a graphic
          or replica colourway usually costs more than a plain finish, some sellers bundle a spare or tinted
          visor into the price, and the smallest and largest sizes often move on different discount cycles.
          Always confirm which variant a listing is actually selling.
        </p>

        <h3>Certification, and what the law actually asks for</h3>
        <p>
          Under RA 10054, the Motorcycle Helmet Act of 2009, riders and passengers must wear a standard
          protective helmet. In practice that means the helmet carries a PS (Philippine Standard) mark or an
          ICC (Import Commodity Clearance) sticker issued by the DTI Bureau of Philippine Standards. A helmet
          bearing a PS or ICC mark is treated as prima facie compliant, and the BPS uses UNECE protocols as the
          basis for approving helmets sold here.
        </p>
        <p>
          {marks.length
            ? <>Across the {brand} models recorded here, the certification text cites {marks.join(", ")}. </>
            : <>Certification text has not been recorded for every {brand} model here yet. </>}
          {mentionsEce && !mentionsPsIcc && <>An ECE homologation is a meaningful safety standard, but it is not the same thing as the PS or ICC mark that Philippine enforcement looks for — an imported helmet still needs the local clearance sticker. </>}
          {needsLocalCheck && <>Several entries note that the marking varies by batch or market, so the exact local helmet should be checked before purchase. </>}
          Check the sticker on the actual unit in front of you, not the box art or the listing photo.
        </p>
      </div>

      <div className="info-card">
        <h3>Before you pay</h3>
        <ul className="checklist">
          <li>Find the PS or ICC mark on the shell or strap, not just the packaging</li>
          <li>Confirm the listing is the plain or graphic version you think it is</li>
          <li>Check whether a spare or tinted visor is included or sold separately</li>
          <li>Ask what sizes are actually in stock, not what the range covers</li>
          <li>Inspect the strap retention and visor latch before leaving the store</li>
        </ul>
        <Link href="/gear/helmets/finder">Compare helmets by type and size →</Link>
      </div>
    </div>

    <div className="split section">
      <div>
        <h3>Getting the size right</h3>
        <p>
          Measure the widest part of your head, roughly a centimetre above the eyebrows, and read that against
          the size chart for the specific model rather than the brand. A {brand} medium in one shell family can
          fit differently from a {brand} medium in another, because internal shape and cheek pad thickness change
          between models.
        </p>
        <p>
          A correctly fitted helmet is snug enough that the cheek pads move the skin on your face when you
          rotate it, with no pressure point on the forehead after ten minutes. Padding compresses with use, so a
          helmet that feels merely comfortable in the shop is often too loose within a few weeks of daily riding.
        </p>
      </div>
      <div>
        <h3>What {brand}&apos;s range covers here</h3>
        <p>
          {types.length
            ? <>The current {brand} model guides include {types.join(", ").toLowerCase()}. </>
            : <>The current {brand} range includes multiple helmet families and should be compared model by model. </>}
          {hasFull && hasHalf && "Full-face models give the most coverage for highway and provincial riding, while open-face options trade that for airflow in stop-go city traffic. "}
          {hasModular && "Modular or flip-up models are convenient at checkpoints and fuel stops, at the cost of extra weight and a chin bar hinge. "}
          {composite && thermoplastic && "Shell materials recorded across the range include both thermoplastic and composite construction, which is usually where the price steps up. "}
          {!composite && thermoplastic && "Shells recorded across the range are thermoplastic, which is the common construction at this price level. "}
          {intercomReady > 0 && `${intercomReady} of the documented models are noted as intercom-ready, which matters if you ride with a pillion or navigate by audio. `}
        </p>
        <p>
          This brand page combines detailed product records with current catalog model guides so you can move through the range without running into placeholder research cards. Exact price, sizing and certification should still be checked on the model and on the helmet sold locally.
        </p>
        <h3>When to replace it</h3>
        <p>
          Replace a helmet after any impact, even one that leaves no visible crack, because the liner is designed
          to crush once. Beyond that, liners and shells degrade with sweat, UV and time, and most manufacturers
          give a service life in years from the date of manufacture — which is stamped inside the shell, not on
          the receipt.
        </p>
      </div>
    </div>
  </div>;
}
