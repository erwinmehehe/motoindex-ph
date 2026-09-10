"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type MatchModel = {
  id: string;
  make: string;
  model: string;
  makeSlug: string;
  slug: string;
  srp: number;
  category: string;
  engineCc: number;
  powerHp: number;
  seatHeightMm: number;
  transmission?: "Automatic" | "Manual";
};

type Answers = {
  budget: "under100" | "100to175" | "175plus" | null;
  ride: "commute" | "tour" | "sport" | "trail" | null;
  trans: "Automatic" | "Manual" | "Either" | null;
};

const budgetOptions = [
  { id: "under100" as const, label: "Under ₱100K", sub: "Starters and frugal commuters" },
  { id: "100to175" as const, label: "₱100K to ₱175K", sub: "A common everyday sweet spot" },
  { id: "175plus" as const, label: "₱175K+", sub: "Big bikes and premium machines" },
];

const rideOptions = [
  { id: "commute" as const, label: "Daily city commute", sub: "Traffic, queues and rain", terms: ["scooter", "underbone", "commuter"] },
  { id: "tour" as const, label: "Open roads and touring", sub: "Provinces, passengers and luggage", terms: ["adventure", "tour", "scooter"] },
  { id: "sport" as const, label: "Weekend fun and sport", sub: "Twisties, pace and presence", terms: ["sport", "naked"] },
  { id: "trail" as const, label: "Trails and off-road", sub: "Fire roads, farms and highlands", terms: ["off-road", "dual", "adventure"] },
];

const knowledgeGroups = [
  {
    id: "buy",
    label: "Buying",
    blurb: "Start with practical shortlists, category guides and model research.",
    archive: "/recommendations",
    cards: [
      ["Best daily commuters", "/recommendations/best-motorcycles-for-daily-commute-philippines", "Shortlist motorcycles for frequent traffic and everyday Philippine road use."],
      ["Beginner-friendly motorcycles", "/recommendations/beginner-friendly-motorcycles-philippines", "Approachable choices with price, fit and ownership context."],
      ["400cc and above", "/recommendations/motorcycles-400cc-plus-philippines", "Compare bigger-displacement options with the important trade-offs visible."],
      ["Electric motorcycles", "/recommendations/electric-motorcycles-philippines", "Battery, range, charging and registration research for Philippine buyers."],
      ["Used and repo motorcycles", "/used-motorcycles/repo", "Understand asking prices, inspection checks and seller-published repo listings."],
      ["All motorcycles", "/motorcycles", "Browse the current MotoIndex catalog by brand, budget and model."],
    ],
  },
  {
    id: "compare",
    label: "Compare",
    blurb: "Put competing motorcycles next to each other instead of juggling tabs.",
    archive: "/compare",
    cards: [
      ["Compare motorcycles", "/compare", "Compare price, engine, dimensions, power and rider-fit details side by side."],
      ["Rider fit check", "/fitment", "Use seat height and fitment context before adding a bike to the shortlist."],
      ["Find my motorcycle", "/finder", "Narrow the current catalog around your budget and use case."],
      ["Motorcycles under ₱100K", "/motorcycles?budget=under100", "See current entry-budget models without digging through the whole catalog."],
      ["₱100K to ₱150K", "/motorcycles?budget=100to150", "Compare a popular Philippine-market price range."],
      ["₱150K to ₱200K", "/motorcycles?budget=150to200", "Browse upper mid-range motorcycles with ownership cost in view."],
    ],
  },
  {
    id: "ownership",
    label: "Ownership",
    blurb: "Check financing, recurring costs and paperwork before a monthly payment looks cheap.",
    archive: "/ownership",
    cards: [
      ["Cost to own", "/ownership/cost-calculator", "Estimate fuel, maintenance, insurance, registration and financing."],
      ["Loan calculator", "/tools/motorcycle-loan-calculator", "Model down payment, term and estimated monthly payment."],
      ["Registration fees", "/tools/lto-registration-fee-calculator", "Plan current registration costs and common paperwork."],
      ["Insurance calculator", "/tools/motorcycle-insurance-calculator", "Create a planning estimate for motorcycle insurance."],
      ["Daily commute cost", "/commute/cost-calculator", "Estimate the recurring cost of the route you actually ride."],
      ["Affordability", "/commute/affordability", "Set a monthly cap and compare it with realistic ownership costs."],
    ],
  },
  {
    id: "gear",
    label: "Gear",
    blurb: "Research the gear that matters after the motorcycle itself.",
    archive: "/gear/helmets",
    cards: [
      ["Helmet catalog", "/gear/helmets", "Browse verified helmet records, types, fit details and price context."],
      ["Tires", "/tires", "Research tire sizes, use cases and fitment before buying replacements."],
      ["Accessories", "/accessories", "Explore top boxes and useful motorcycle accessories."],
      ["Maintenance", "/maintenance", "Keep common service items and model-specific maintenance in view."],
      ["Corrections", "/corrections", "Found a changed price or specification? Send MotoIndex a correction."],
      ["All tools", "/tools", "Open the full set of MotoIndex ownership and planning tools."],
    ],
  },
] as const;

function budgetMatches(model: MatchModel, budget: NonNullable<Answers["budget"]>) {
  if (budget === "under100") return model.srp < 100000;
  if (budget === "100to175") return model.srp >= 100000 && model.srp <= 175000;
  return model.srp > 175000;
}

function scoreModel(model: MatchModel, answers: Answers) {
  let score = 0;
  if (answers.budget && budgetMatches(model, answers.budget)) score += 45;
  if (answers.trans === "Either" || !answers.trans || model.transmission === answers.trans) score += 20;
  const ride = rideOptions.find((item) => item.id === answers.ride);
  if (ride) {
    const haystack = model.category.toLowerCase();
    if (ride.terms.some((term) => haystack.includes(term))) score += 35;
  }
  return score;
}

export function HomeDecisionEngine({ models }: { models: MatchModel[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ budget: null, ride: null, trans: null });
  const [done, setDone] = useState(false);

  const results = useMemo(() => {
    if (!done) return [];
    return models
      .map((model) => ({ model, score: scoreModel(model, answers) }))
      .sort((a, b) => b.score - a.score || a.model.srp - b.model.srp)
      .slice(0, 3);
  }, [answers, done, models]);

  const choose = <K extends keyof Answers>(key: K, value: NonNullable<Answers[K]>) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    window.setTimeout(() => {
      if (step < 2) setStep((current) => current + 1);
      else setDone(true);
    }, 180);
  };

  const restart = () => {
    setStep(0);
    setAnswers({ budget: null, ride: null, trans: null });
    setDone(false);
  };

  return (
    <section className="mi-match" id="match">
      <div className="mi-grid-bg" aria-hidden="true" />
      <div className="shell mi-match-layout">
        <div className="mi-match-story">
          <span className="mi-dark-pill">✦ Decision engine</span>
          <h2>Don&apos;t start with a list.<br />Start with <em>your life.</em></h2>
          <p>Set budget, traffic and transmission needs, then see which current motorcycles fit those constraints before you fall in love with a spec sheet.</p>
          <ol>
            <li><b>01</b><div><strong>Set your constraints</strong><span>Budget, daily use and transmission.</span></div></li>
            <li><b>02</b><div><strong>See why each bike ranks</strong><span>Visible fit factors instead of a mystery score.</span></div></li>
            <li><b>03</b><div><strong>Check monthly reality</strong><span>Move straight into ownership and loan planning.</span></div></li>
          </ol>
          <div className="mi-score-card">
            <span>Example fit factors</span>
            {[["Budget fit", 94], ["City ergonomics", 88], ["Fuel economy", 91], ["Seat-height fit", 82]].map(([label, value]) => (
              <div key={String(label)}><p><b>{label}</b><span>{value}</span></p><i><em style={{ width: `${value}%` }} /></i></div>
            ))}
          </div>
        </div>

        <div className="mi-match-panel">
          {!done ? (
            <>
              <div className="mi-match-top"><span>Find My Match · Step {step + 1} of 3</span>{step > 0 && <button type="button" onClick={() => setStep((current) => current - 1)}>← Back</button>}</div>
              <div className="mi-step-progress">{[0, 1, 2].map((index) => <i key={index} className={index <= step ? "active" : ""} />)}</div>
              {step === 0 && <div className="mi-quiz-step"><h3>What&apos;s your budget?</h3><p>Use the purchase price first. Financing comes next.</p>{budgetOptions.map((option) => <button key={option.id} type="button" onClick={() => choose("budget", option.id)}><span><b>{option.label}</b><small>{option.sub}</small></span><i /></button>)}</div>}
              {step === 1 && <div className="mi-quiz-step"><h3>What will you ride most?</h3><p>Pick the everyday job the bike needs to do.</p><div className="mi-ride-grid">{rideOptions.map((option) => <button key={option.id} type="button" onClick={() => choose("ride", option.id)}><b>{option.label}</b><small>{option.sub}</small></button>)}</div></div>}
              {step === 2 && <div className="mi-quiz-step"><h3>Automatic or manual?</h3><p>Choose the transmission you want to live with in real traffic.</p>{([["Automatic", "Twist-and-go and stop-go friendly"], ["Manual", "Gears and rider engagement"], ["Either", "Show me both"]] as const).map(([id, sub]) => <button key={id} type="button" onClick={() => choose("trans", id)}><span><b>{id === "Either" ? "No preference" : id}</b><small>{sub}</small></span><i /></button>)}</div>}
            </>
          ) : (
            <div className="mi-match-results">
              <div className="mi-results-head"><span>Your starting shortlist</span><button type="button" onClick={restart}>Start over</button></div>
              <h3>Three current models worth opening next.</h3>
              <p>These are ranked from the answers you chose. Open a model to verify the latest price context and full specs.</p>
              <div className="mi-result-list">{results.map(({ model, score }, index) => <Link key={model.id} href={`/motorcycles/${model.makeSlug}/${model.slug}`}><span className="rank">0{index + 1}</span><div><strong>{model.make} {model.model}</strong><small>₱{model.srp.toLocaleString("en-PH")} · {model.engineCc} cc · {model.seatHeightMm} mm seat</small></div><b>{score}% fit</b></Link>)}</div>
              <div className="mi-result-actions"><Link href="/finder">Open full Finder</Link><Link href="/compare">Compare motorcycles</Link></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function HomeLoanPlanner() {
  const [price, setPrice] = useState(125900);
  const [dpPct, setDpPct] = useState(30);
  const [term, setTerm] = useState(36);
  const monthlyRate = 0.012;
  const fees = 3500;
  const down = price * (dpPct / 100);
  const financed = price - down;
  const factor = Math.pow(1 + monthlyRate, term);
  const monthly = (financed * monthlyRate * factor) / (factor - 1 || 1);
  const total = down + monthly * term + fees;
  const php = (value: number) => `₱${Math.round(value).toLocaleString("en-PH")}`;

  const tools = [
    ["Compare motorcycles", "/compare", "Price, specs and rider fit side by side."],
    ["Cost to own", "/ownership/cost-calculator", "Plan fuel, maintenance, insurance, registration and financing."],
    ["Registration fees", "/tools/lto-registration-fee-calculator", "Estimate LTO registration costs and common paperwork."],
    ["Commute cost", "/commute/cost-calculator", "Estimate the recurring cost of the route you actually ride."],
  ] as const;

  return (
    <section className="mi-tools mi-tools-full" id="tools">
      <div className="mi-grid-bg" aria-hidden="true" />
      <div className="shell">
        <div className="mi-section-head dark-head"><div><span className="mi-eyebrow">Cost and ownership tools</span><h2>Know the monthly reality <em>before you sign.</em></h2><p>A low monthly number without its term and down payment hides the real commitment. Keep the assumptions visible.</p></div><Link href="/tools">View all tools →</Link></div>
        <div className="mi-tools-layout">
          <div className="mi-tool-list">{tools.map(([title, href, copy], index) => <Link key={href} href={href}><span>0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div><b>↗</b></Link>)}</div>
          <div className="mi-loan-card">
            <div className="mi-loan-title"><h3>Motorcycle loan planner</h3><span>Estimate</span></div>
            <label><span>Cash price (SRP)</span><b>{php(price)}</b><input type="range" min="60000" max="400000" step="1000" value={price} onChange={(event) => setPrice(Number(event.target.value))} /></label>
            <label><span>Down payment</span><b>{dpPct}% · {php(down)}</b><input type="range" min="10" max="60" step="5" value={dpPct} onChange={(event) => setDpPct(Number(event.target.value))} /></label>
            <div className="mi-term"><span>Term</span><div>{[12, 24, 36, 48].map((months) => <button type="button" key={months} className={term === months ? "active" : ""} onClick={() => setTerm(months)}>{months} mo</button>)}</div></div>
            <div className="mi-payment"><span>Estimated monthly payment</span><strong>{php(monthly)} <small>/ month</small></strong><dl><div><dt>Down payment</dt><dd>{php(down)}</dd></div><div><dt>Amount financed</dt><dd>{php(financed)}</dd></div><div><dt>One-time fees (est.)</dt><dd>{php(fees)}</dd></div><div><dt>Total amount payable</dt><dd>{php(total)}</dd></div></dl></div>
            <p className="mi-loan-note">Illustrative planning estimate at 1.2% monthly on a diminishing balance. It is not a lender offer. Actual rates, promos and fees vary.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeKnowledgeHub() {
  const [active, setActive] = useState(knowledgeGroups[0].id);
  const group = knowledgeGroups.find((item) => item.id === active) ?? knowledgeGroups[0];
  return (
    <section className="mi-section mi-library" id="library">
      <div className="shell">
        <div className="mi-section-head"><div><span className="mi-eyebrow">Rider knowledge library</span><h2>Research the decision, <em>not just the motorcycle.</em></h2><p>Move from buying guides to comparison, ownership, commuting and gear without leaving the same research system.</p></div><Link href="/guides">Explore all guides →</Link></div>
        <div className="mi-library-tabs" role="group" aria-label="Rider knowledge sections">{knowledgeGroups.map((item) => <button key={item.id} type="button" className={active === item.id ? "active" : ""} aria-pressed={active === item.id} onClick={() => setActive(item.id)}>{item.label}<span>{item.cards.length}</span></button>)}</div>
        <p className="mi-library-blurb">{group.blurb}</p>
        <div className="mi-library-grid">{group.cards.map(([title, href, copy]) => <Link key={href} href={href}><span>↗</span><h3>{title}</h3><p>{copy}</p><b>Open guide →</b></Link>)}</div>
        <div className="mi-trust-strip"><div><h3>Trust is a product feature</h3><p>Methodology, source context and corrections are visible so riders can judge the research, not just the conclusion.</p></div><div><Link href="/corrections">Corrections</Link><Link href="/about">About MotoIndex</Link><Link href="/sitemap.xml">Sitemap</Link><Link href={group.archive}>Explore this section</Link></div></div>
      </div>
    </section>
  );
}
