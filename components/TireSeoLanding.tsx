import Link from "next/link";
import { AuthorBox } from "@/components/AuthorBox";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EntityMedia } from "@/components/EntityMedia";
import { EntityVerificationFallback } from "@/components/EntityVerificationFallback";
import { FaqSection } from "@/components/FaqSection";
import { ProductCard } from "@/components/ProductCard";
import { CTAGroup, ProductGrid, SectionHeader, StatRow } from "@/components/ui";
import { getModelById, publicMotorcycles } from "@/lib/data";
import { getTireProductsForModel } from "@/lib/catalog";
import { maintenanceForModel } from "@/lib/maintenance";
import { getMotorcyclesUsingTireSize, getTireFamilyModels, type TireFamilyHub, type TireModelSeoHub } from "@/lib/tireSeo";
import type { Motorcycle, TireProduct } from "@/lib/types";
import styles from "@/app/styles/tire-seo.module.css";

type Props =
  | { family: TireFamilyHub; modelHub?: never }
  | { modelHub: TireModelSeoHub; family?: never };

function parseMetricSize(value: string) {
  const match = value.match(/^(\d+)\s*\/\s*(\d+)\s*[-R]\s*(\d+)/i);
  if (!match) return undefined;
  return { width: Number(match[1]), aspect: Number(match[2]), rim: Number(match[3]) };
}

function dedupeProducts(models: Motorcycle[]) {
  const map = new Map<string, TireProduct>();
  for (const model of models) {
    for (const product of getTireProductsForModel(model.id)) map.set(product.id, product);
  }
  return [...map.values()];
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

function pressureCopy(model: Motorcycle) {
  const maintenance = maintenanceForModel(model.id);
  if (!maintenance?.tirePressure) return undefined;
  const p = maintenance.tirePressure;
  const sameLoaded = p.soloFrontPsi === p.passengerFrontPsi && p.soloRearPsi === p.passengerRearPsi;
  return {
    label: `${p.soloFrontPsi} / ${p.soloRearPsi} psi`,
    note: sameLoaded ? "Front / rear, cold tire reference" : `Solo front / rear; passenger rear ${p.passengerRearPsi} psi`,
    sourceLabel: maintenance.sourceLabel,
    sourceUrl: maintenance.sourceUrl
  };
}

function modelHref(model: Motorcycle) {
  return `/motorcycles/${model.makeSlug}/${model.slug}`;
}

function sharedSizeModels(models: Motorcycle[]) {
  const own = new Set(models.map(model => model.id));
  const rows = new Map<string, { model: Motorcycle; positions: string[] }>();
  for (const size of unique(models.flatMap(model => [model.frontTire, model.rearTire]))) {
    for (const match of getMotorcyclesUsingTireSize(size)) {
      if (own.has(match.model.id)) continue;
      const current = rows.get(match.model.id) || { model: match.model, positions: [] };
      current.positions.push(`${size} ${match.front ? "front" : ""}${match.front && match.rear ? "/" : ""}${match.rear ? "rear" : ""}`.trim());
      rows.set(match.model.id, current);
    }
  }
  return [...rows.values()].slice(0, 8);
}

function modelFaqs(model: Motorcycle, pressure?: ReturnType<typeof pressureCopy>) {
  return [
    {
      question: `What is the ${model.make} ${model.model} tire size?`,
      answer: `The recorded stock tire sizes are ${model.frontTire} at the front and ${model.rearTire} at the rear. Match the exact model and generation before ordering because tire sizes can change between generations.`
    },
    {
      question: `Can I install a wider tire on the ${model.model}?`,
      answer: "A wider tire is not automatically an upgrade. Rim width, clearance, load index, speed rating and front/rear application all matter. Use the stock size as the baseline and confirm any alternative size with the tire manufacturer or a qualified installer."
    },
    {
      question: `Are the front and rear ${model.model} tires interchangeable?`,
      answer: `No. The recorded stock sizes are ${model.frontTire} front and ${model.rearTire} rear, and front/rear tire construction or tread direction can also differ even when a size appears similar.`
    },
    pressure ? {
      question: `What tire pressure should I use on the ${model.model}?`,
      answer: `MotoIndex records ${pressure.label} from the model-specific maintenance source. Check pressure cold and follow the owner manual or motorcycle placard if your exact year, load or market specification differs.`
    } : {
      question: `What tire pressure should I use on the ${model.model}?`,
      answer: "MotoIndex does not publish a generic pressure when a model-specific source has not been recorded. Use the owner manual or tire-pressure placard for your exact motorcycle and check pressure when the tires are cold."
    },
    {
      question: "Is matching the tire size enough to confirm fitment?",
      answer: "No. Also confirm load index, speed rating, tube or tubeless construction, approved rim width, front or rear application and physical clearance before buying."
    }
  ];
}

function familyFaqs(family: TireFamilyHub, models: Motorcycle[]) {
  const fronts = unique(models.map(model => model.frontTire));
  const rears = unique(models.map(model => model.rearTire));
  return [
    {
      question: `What is the ${family.shortName} tire size?`,
      answer: models.map(model => `${model.model}: ${model.frontTire} front and ${model.rearTire} rear`).join(". ") + "."
    },
    {
      question: `Do all ${family.shortName} generations use the same tire size?`,
      answer: fronts.length === 1 && rears.length === 1
        ? `The generations currently recorded by MotoIndex share ${fronts[0]} front and ${rears[0]} rear sizes. Still confirm the exact model year before ordering.`
        : `No. MotoIndex records ${fronts.join(" and ")} front sizes and ${rears.join(" and ")} rear sizes across these generations. Open the exact generation before buying.`
    },
    {
      question: `Can I use a tire listed for another ${family.shortName} generation?`,
      answer: "Only after confirming the exact size, rim width, load index, speed rating, construction and physical clearance. A matching model name is not enough when generations use different wheels or tire specifications."
    },
    {
      question: "Why does MotoIndex keep generations separate?",
      answer: "Generation-specific pages reduce the risk of mixing specifications from older and current motorcycles. The family guide is for comparison; the exact model page remains the best place to confirm that motorcycle's full specification record."
    },
    {
      question: "Should I choose a replacement tire by brand or by specification?",
      answer: "Start with the complete specification and intended use. Brand comes after size, load and speed ratings, construction, approved rim width, axle application and riding conditions."
    }
  ];
}

export function TireSeoLanding(props: Props) {
  const family = props.family;
  const modelHub = props.modelHub;
  const models = family
    ? getTireFamilyModels(family)
    : [getModelById(modelHub.modelId)].filter((model): model is Motorcycle => Boolean(model));

  if (!models.length) return null;

  const primary = models[0];
  const pageTitle = family ? family.title : modelHub.title;
  const description = family ? family.description : modelHub.description;
  const products = dedupeProducts(models);
  const pressure = !family ? pressureCopy(primary) : undefined;
  const shared = sharedSizeModels(models);
  const fronts = unique(models.map(model => model.frontTire));
  const rears = unique(models.map(model => model.rearTire));
  const frontParsed = parseMetricSize(primary.frontTire);
  const rearParsed = parseMetricSize(primary.rearTire);
  const sameSize = primary.frontTire === primary.rearTire;
  const keywordLabel = family ? family.aliases[0] : modelHub.keywordLabel;
  const faqs = family ? familyFaqs(family, models) : modelFaqs(primary, pressure);

  return <article className={styles.page}>
    <div className="shell">
      <Breadcrumbs items={[
        { label: "Tires", href: "/tires" },
        { label: family ? family.shortName : `${primary.make} ${primary.model}` }
      ]} />

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>Stock tire size and fitment guide</span>
          <h1>{pageTitle}</h1>
          <p>{description}</p>
          <CTAGroup className={styles.heroActions}>
            <a className="button" href="#stock-size">See stock sizes</a>
            <Link className="button secondary" href={modelHref(primary)}>Open motorcycle guide</Link>
          </CTAGroup>
          <div className={styles.trustRow}>
            <span>Philippine model data</span>
            <span>Generation-aware</span>
            <span>Fitment cautions included</span>
          </div>
        </div>

        <div className={styles.heroStage}>
          <EntityMedia
            entityType="motorcycle"
            entityId={primary.id}
            className={styles.heroMedia}
            priority
            showCredit={false}
            forceFill
            sizes="(max-width: 900px) 100vw, 44vw"
            fallback={<EntityVerificationFallback brand={primary.make} model={primary.model} />}
          />
          <div className={styles.sizePlate}>
            <div><span>Front</span><strong>{primary.frontTire}</strong></div>
            <div><span>Rear</span><strong>{primary.rearTire}</strong></div>
          </div>
        </div>
      </header>

      <nav className={styles.jumpNav} aria-label="Tire guide sections">
        <a href="#stock-size">Stock size</a>
        {family && <a href="#generations">Generations</a>}
        <a href="#read-size">Read the size</a>
        <a href="#pressure">Pressure</a>
        <a href="#replacement">Replacement tires</a>
        <a href="#fitment">Fitment checks</a>
        <a href="#faq">FAQ</a>
      </nav>

      <section id="stock-size" className={styles.section}>
        <SectionHeader
          kicker="Direct answer"
          title={family ? `${family.shortName} front and rear tire sizes` : `What tire size does the ${primary.make} ${primary.model} use?`}
          description={family
            ? "Use the exact generation row below. Similar model names do not guarantee the same front and rear tire sizes."
            : `The recorded stock setup is ${primary.frontTire} at the front and ${primary.rearTire} at the rear. Keep those two positions separate when shopping.`}
        />

        {!family && <StatRow items={[
          { label: "Front tire", value: primary.frontTire, note: "Stock recorded size" },
          { label: "Rear tire", value: primary.rearTire, note: "Stock recorded size" },
          { label: "Front rim", value: frontParsed ? `${frontParsed.rim} in` : "Check marking", note: frontParsed ? `${frontParsed.width} mm nominal width` : "Confirm wheel specification" },
          { label: "Rear rim", value: rearParsed ? `${rearParsed.rim} in` : "Check marking", note: rearParsed ? `${rearParsed.width} mm nominal width` : "Confirm wheel specification" }
        ]} />}

        <div className={styles.answerGrid}>
          <article className={styles.answerCard}>
            <span>Quick answer</span>
            <h2>{family ? `Do not mix ${family.shortName} generations` : `${primary.frontTire} front · ${primary.rearTire} rear`}</h2>
            <p>{family
              ? `MotoIndex keeps ${models.length} ${family.shortName} records together here so you can see exactly where stock sizes change by generation.`
              : sameSize
                ? `The ${primary.model} uses the same printed size at both ends, but front and rear tire application can still differ. Confirm the tire is approved for the correct axle.`
                : `The ${primary.model} uses different front and rear sizes. The rear is not a substitute for the front, even if a wider tire physically appears to fit.`}</p>
          </article>
          <article className={styles.answerCard}>
            <span>Why this guide is separate</span>
            <h2>{keywordLabel}</h2>
            <p>This page stays focused on tire size, pressure and fitment. Price, performance and ownership details stay in the full motorcycle guide so the information is easier to use.</p>
          </article>
        </div>
      </section>

      {family && <section id="generations" className={styles.section}>
        <SectionHeader
          kicker="Generation comparison"
          title={`Compare ${family.shortName} tire sizes`}
          description="The exact motorcycle generation controls the answer. Use the row that matches your bike, then open its full motorcycle guide for the complete specification record."
        />
        <div className={styles.generationTable} role="table" aria-label={`${family.shortName} tire size comparison`}>
          <div className={styles.tableHead} role="row">
            <span role="columnheader">Model</span><span role="columnheader">Front</span><span role="columnheader">Rear</span><span role="columnheader">Status</span>
          </div>
          {models.map(model => <Link key={model.id} href={modelHref(model)} className={styles.tableRow} role="row">
            <span role="cell"><strong>{model.make} {model.model}</strong><small>{model.generation}</small></span>
            <b role="cell">{model.frontTire}</b>
            <b role="cell">{model.rearTire}</b>
            <span role="cell">{model.marketStatus === "previous" ? "Previous generation" : "Current"}</span>
          </Link>)}
        </div>
      </section>}

      <section id="read-size" className={styles.section}>
        <SectionHeader
          kicker="Understand the marking"
          title={`How to read ${primary.frontTire} and ${primary.rearTire}`}
          description="The printed tire size tells you width, sidewall ratio and rim diameter. It does not, by itself, confirm that a replacement tire is safe for the motorcycle."
        />
        <div className={styles.explainerGrid}>
          <article className={styles.sizeExplainer}>
            <span>Front</span><strong>{primary.frontTire}</strong>
            {frontParsed ? <ul>
              <li><b>{frontParsed.width}</b><span>Nominal width in millimetres</span></li>
              <li><b>{frontParsed.aspect}</b><span>Sidewall height as a percentage of width</span></li>
              <li><b>{frontParsed.rim}</b><span>Wheel diameter in inches</span></li>
            </ul> : <p>Use the complete sidewall marking and owner documentation for this tire format.</p>}
          </article>
          <article className={styles.sizeExplainer}>
            <span>Rear</span><strong>{primary.rearTire}</strong>
            {rearParsed ? <ul>
              <li><b>{rearParsed.width}</b><span>Nominal width in millimetres</span></li>
              <li><b>{rearParsed.aspect}</b><span>Sidewall height as a percentage of width</span></li>
              <li><b>{rearParsed.rim}</b><span>Wheel diameter in inches</span></li>
            </ul> : <p>Use the complete sidewall marking and owner documentation for this tire format.</p>}
          </article>
        </div>
        <div className={styles.editorialNote}>
          <strong>Why the numbers are only the starting point</strong>
          <p>Two tires with the same printed size can have different load indexes, speed ratings, approved rim-width ranges, tube or tubeless construction and front/rear applications. Confirm the full specification before ordering.</p>
        </div>
      </section>

      <section id="pressure" className={styles.section}>
        <SectionHeader
          kicker="Cold tire pressure"
          title={family ? `Pressure references for ${family.shortName} generations` : `${primary.make} ${primary.model} tire pressure`}
          description="MotoIndex only shows model-specific pressure values when a source has been recorded. We do not substitute a generic PSI figure."
        />
        {family ? <div className={styles.pressureGrid}>
          {models.map(model => {
            const item = pressureCopy(model);
            return <article key={model.id} className={styles.pressureCard}>
              <span>{model.model}</span>
              <strong>{item?.label || "Use exact owner manual"}</strong>
              <p>{item?.note || "No model-specific pressure figure is published here yet. Check the motorcycle placard or owner manual when the tires are cold."}</p>
              {item && <a href={item.sourceUrl} target="_blank" rel="noreferrer">Owner-manual source ↗</a>}
            </article>;
          })}
        </div> : pressure ? <div className={styles.pressureFeature}>
          <div><span>Cold pressure reference</span><strong>{pressure.label}</strong><small>{pressure.note}</small></div>
          <p>This figure comes from the model-specific maintenance record. Recheck the motorcycle placard or owner manual if your exact year, passenger load or market specification differs.</p>
          <a href={pressure.sourceUrl} target="_blank" rel="noreferrer">{pressure.sourceLabel} ↗</a>
        </div> : <div className={styles.editorialNote}>
          <strong>No generic PSI guess</strong>
          <p>MotoIndex has not recorded a model-specific pressure source for this motorcycle yet. Use the tire-pressure label or the exact owner manual and measure pressure cold.</p>
        </div>}
      </section>

      <section id="replacement" className={styles.section}>
        <SectionHeader
          kicker="Replacement options"
          title="Verified tire families with a matching listed size"
          description="These are size matches from manufacturer-published tire-family catalogs, not automatic fitment approvals. Confirm front/rear application, load index, speed rating, rim width and exact size before purchase."
          aside={<Link href="/tires">Browse the full tire guide →</Link>}
        />
        {products.length ? <ProductGrid density="compact">{products.slice(0,6).map(product =>
          <ProductCard key={product.id} item={{
            entityId: product.id,
            href: `/tires/${product.brandSlug}/${product.slug}`,
            category: "Tire",
            brand: product.brand,
            model: product.model,
            meta: `${product.useCase} · ${product.knownSizes.filter(size => fronts.includes(size) || rears.includes(size)).join(", ") || "matching listed size"}`,
            status: product.status,
            priceFromPhp: product.priceFromPhp
          }} />
        )}</ProductGrid> : <div className={styles.editorialNote}>
          <strong>No verified replacement family is shown yet</strong>
          <p>MotoIndex will not invent a product match from size alone. Use the stock sizes above as the baseline and confirm a replacement tire against the manufacturer&apos;s current size catalog.</p>
        </div>}
      </section>

      {shared.length > 0 && <section className={styles.section}>
        <SectionHeader
          kicker="Same-size discovery"
          title="Other motorcycles using one of these stock sizes"
          description="Sharing a printed tire size does not make tires interchangeable, but it is useful for discovering which motorcycles use the same nominal dimensions."
        />
        <div className={styles.sharedGrid}>
          {shared.map(({model,positions}) => <Link key={model.id} href={modelHref(model)} className={styles.sharedCard}>
            <span>{model.make}</span>
            <strong>{model.model}</strong>
            <small>{positions.join(" · ")}</small>
          </Link>)}
        </div>
      </section>}

      <section id="fitment" className={styles.section}>
        <SectionHeader
          kicker="Before you order"
          title="Tire fitment checks that matter beyond size"
          description="A correct-looking size can still be the wrong tire. Use this checklist before paying for a replacement."
        />
        <div className={styles.checkGrid}>
          <article><span>01</span><h3>Axle application</h3><p>Confirm the tire is approved for front or rear use. Do not assume one product works at both ends.</p></article>
          <article><span>02</span><h3>Load and speed rating</h3><p>Meet or exceed the motorcycle&apos;s required ratings. The size marking alone does not include the full load and speed requirement.</p></article>
          <article><span>03</span><h3>Rim and construction</h3><p>Check approved rim width plus tube or tubeless construction. A tire can mount physically and still sit on the wrong rim profile.</p></article>
          <article><span>04</span><h3>Clearance and alternatives</h3><p>Wider or taller alternatives can affect steering, speedometer reading, mudguard clearance and suspension space. Treat non-stock sizing as a fitment change.</p></article>
        </div>
        <CTAGroup className={styles.bottomActions}>
          <Link className="button" href="/fitment">Open fitment finder</Link>
          <Link className="button secondary" href={modelHref(primary)}>View full {primary.model} specs</Link>
        </CTAGroup>
      </section>

      <section id="faq" className={styles.section}>
        <FaqSection title={family ? `${family.shortName} tire size FAQ` : `${primary.make} ${primary.model} tire size FAQ`} items={faqs} />
      </section>

      <section className={styles.sources}>
        <div>
          <span>Model specification source</span>
          <strong>{primary.sourceLabel}</strong>
          <small>Checked {primary.verifiedAt}</small>
        </div>
        <a href={primary.sourceUrl} target="_blank" rel="noreferrer">Open source ↗</a>
      </section>

      <AuthorBox />
    </div>
  </article>;
}
