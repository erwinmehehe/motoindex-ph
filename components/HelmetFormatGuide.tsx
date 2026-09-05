import Link from "next/link";
import { php } from "@/lib/utils";
import type { HelmetProduct } from "@/lib/types";

// Format-level buying guidance for the helmet category hubs.
//
// The three category pages shared one short tradeoff paragraph, which left
// half-face at 375 words against 3,500 monthly searches. Each format gets its
// own argument here, plus figures pulled from the products actually listed on
// that page, so the three hubs do not read as the same article.
//
// ECE 22.06 P/J marking: P approves a chin bar as protective, J approves the
// helmet open like a jet, and P/J means it passed both series of tests — so a
// modular is only safe to ride with the bar raised if it carries J or P/J.

type Format = "half-face" | "modular" | "full-face";
type Props = { format: Format; products: HelmetProduct[] };

export function HelmetFormatGuide({ format, products }: Props) {
  const prices = products.map(p => p.priceFromPhp).filter((v): v is number => typeof v === "number");
  const min = prices.length ? Math.min(...prices) : undefined;
  const max = prices.length ? Math.max(...prices) : undefined;
  const brands = [...new Set(products.map(p => p.brand))];
  const certs = products.map(p => p.certification || "").filter(Boolean);
  const anyIcc = certs.some(c => /ICC|PS/i.test(c));
  const anyEce = certs.some(c => /ECE/i.test(c));
  const intercom = products.filter(p => p.intercomReady).length;
  const sunVisor = products.filter(p => /sun visor|internal visor/i.test(p.visor || "")).length;

  return <div className="format-guide">
    <div className="split section">
      <div>
        {format === "half-face" && <>
          <h2>What an open-face actually gives up</h2>
          <p>
            The trade is straightforward and worth being blunt about: an open-face leaves your chin and jaw
            exposed. The chin bar on a full-face is not decoration — it is structure covering the part of the
            face that meets the road first in a forward fall. Choosing open-face means accepting that.
          </p>
          <p>
            What you get back is real too, especially here. Airflow at low speed makes a genuine difference in
            Manila traffic, where a full-face turns into an oven at a standstill. Visibility is wider,
            conversation and paying at a toll booth are easier, and the helmet is lighter on your neck through
            a long stop-go commute.
          </p>
          <p>
            The honest framing is by use, not by budget. Short urban trips at city speeds are where an
            open-face makes sense. Highway and provincial riding is where the missing chin bar costs the most,
            because impact energy scales with speed. Plenty of riders own both and pick per trip.
          </p>
          <h3>If you go open-face, get the details right</h3>
          <p>
            Eye protection stops being optional — a visor or goggles handles rain, grit and insects that a
            full-face shell would have taken. {sunVisor > 0 && `${sunVisor} of the models listed here include an internal sun visor, which is worth having for glare on afternoon rides. `}
            Retention matters more, not less: an open-face has less shell to stay put, so the strap has to be
            correctly tensioned every single time.
          </p>
        </>}

        {format === "modular" && <>
          <h2>The marking that decides whether you can ride with it open</h2>
          <p>
            The single most useful thing to know about modular helmets is the ECE 22.06 P/J marking.
            <strong> P</strong> means the chin bar is homologated as protective. <strong>J</strong> means the
            helmet is approved open, like a jet. <strong>P/J</strong> means it passed both series of tests and
            is approved in either position.
          </p>
          <p>
            That matters in practice: a modular marked P only is homologated with the chin bar down. Riding it
            flipped up is outside what it was tested for, even though the mechanism physically allows it. If
            you bought a flip-up specifically so you could ride with it open in traffic, P/J is the marking to
            look for — not just the word &ldquo;modular&rdquo; on the box.
          </p>
          <h3>What the hinge costs you</h3>
          <p>
            A modular carries a chin bar, a hinge, a lock and usually an internal sun visor, so it is heavier
            than an equivalent full-face and has more moving parts to wear or rattle. Check the lock engages
            with a definite click and that the bar does not shift when you push up on it closed. Wind noise is
            typically higher too, because there are more shell joins for air to catch.
          </p>
          <p>
            The convenience is genuine: fuel stops, checkpoints, drinking water and talking to someone without
            removing the helmet and re-seating your glasses. For touring and long commutes that adds up.
          </p>
        </>}

        {format === "full-face" && <>
          <h2>The most coverage, and the thing to actually compare</h2>
          <p>
            A fixed chin bar gives the most complete coverage of the common road formats, with no hinge or
            lock to fail. That part is settled. What is worth comparing between full-faces is not whether they
            protect, but ventilation, weight and visor quality — because those decide whether you keep wearing
            it properly on a hot day.
          </p>
          <p>
            Ventilation deserves more weight in Philippine conditions than in the European reviews most specs
            are written for. A helmet that flows well at 20 km/h in traffic is doing something different from
            one designed to be quiet at highway speed. Look for chin-bar intakes and rear exhaust vents, not
            just a count of holes in the shell.
          </p>
          <h3>Shell sizes, not just helmet sizes</h3>
          <p>
            Better full-faces are built in two or three shell sizes across the size range. A brand using one
            shell for every size fits small heads with thicker padding, which makes an XS heavier and bulkier
            than it needs to be. If you take a small or a large, the shell count is one of the most useful
            specs on the page.
          </p>
          <p>
            Pinlock readiness is worth checking as well. Visor fogging in the rain here is constant, and an
            anti-fog insert works far better than cracking the visor open in traffic.
          </p>
        </>}
      </div>

      <div className="info-card">
        <h3>What this page lists</h3>
        <p>
          {products.length} {format === "half-face" ? "open-face and half-face" : format} model
          {products.length === 1 ? "" : "s"} with checked MotoIndex records
          {brands.length > 1 && `, across ${brands.length} brands`}.
          {min && max && ` Observed starting prices run ${min === max ? php(min) : `${php(min)} to ${php(max)}`}.`}
        </p>
        <ul className="checklist">
          {format === "modular" && <li>Look for P/J if you want to ride with the bar up</li>}
          {format === "half-face" && <li>Plan for eye protection — visor or goggles</li>}
          {format === "full-face" && <li>Check shell-size count, not just helmet size</li>}
          <li>Find the PS or ICC mark on the shell, not the box</li>
          <li>Match the size chart for the model, not the brand</li>
          <li>Check the strap tension every ride</li>
        </ul>
        <Link href="/gear/helmets/finder">Filter helmets by type and size →</Link>
      </div>
    </div>

    <div className="split section">
      <div>
        <h3>Certification still works the same way</h3>
        <p>
          Whichever format you choose, Philippine law asks the same thing. Under RA 10054 the helmet needs a
          PS mark or an ICC sticker from the DTI Bureau of Philippine Standards, and a helmet carrying one is
          treated as prima facie compliant.
          {anyEce && !anyIcc && " Several models here cite ECE homologation, which is a real safety standard but is not the local marking — an imported helmet still needs the ICC sticker."}
          {anyIcc && " Some models here record a PS or ICC marking directly, which is the one enforcement looks for."}
        </p>
        <p>
          Format does not change that requirement. An open-face with a valid ICC mark is legal; a full-face
          without one is not, however well made it is.
        </p>
      </div>
      <div>
        <h3>Fit beats format</h3>
        <p>
          A correctly fitted open-face will do more for you than a loose full-face. Padding should press
          evenly, move the skin on your cheeks when you rotate the helmet, and leave no hot spot on your
          forehead after ten minutes. Liners compress with use, so buy on the tight side of comfortable.
        </p>
        {intercom > 0 && <p>
          {intercom} of the models listed here are noted as intercom-ready, which is worth factoring in before
          you buy a separate mount — retrofitting speakers into cheek pads that were not designed for them is
          how helmets end up uncomfortable.
        </p>}
      </div>
    </div>
  </div>;
}
