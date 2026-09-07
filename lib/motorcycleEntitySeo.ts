import type { Motorcycle } from "./types";
import type { FaqItem } from "@/components/FaqSection";
import { RELEASE_DATE } from "./site";
import { observedMarketPriceLabel } from "./marketChecks";
import { efficiencyEvidence } from "./efficiency";
import { maintenanceForModel } from "./maintenance";
import { priceFaqsForModel } from "./priceSeo";
import { modelAuthorityProfile } from "./modelAuthority";

const releaseYear = RELEASE_DATE.slice(0, 4);

function categoryUse(model: Motorcycle) {
  const category = model.category.toLowerCase();
  if (/scooter|maxi/.test(category)) return "automatic commuting, traffic-heavy daily use and practical urban riding";
  if (/underbone|moped/.test(category)) return "light everyday transport, fuel-conscious commuting and simple daily use";
  if (/adventure|dual|trail|off-road/.test(category)) return "mixed-road riding, taller-road-clearance needs and riders who want more versatility";
  if (/sport|naked|street/.test(category)) return "riders comparing stronger performance, road-focused handling and everyday usability";
  if (/business|utility|standard/.test(category)) return "daily utility, work use and straightforward transport";
  return `${model.category.toLowerCase()} buyers comparing price, fit, running cost and everyday usability`;
}

export function motorcycleEntityEditorial(model: Motorcycle) {
  const authority = modelAuthorityProfile(model.id);
  const strengths: string[] = authority ? authority.buyIf.slice(0, 2) : [];
  const watchOuts: string[] = authority ? authority.skipIf.slice(0, 2) : [];

  if (model.transmission === "Automatic") strengths.push("Automatic transmission keeps stop-go operation simple.");
  if (model.curbWeightKg <= 125) strengths.push(`${model.curbWeightKg} kg curb weight is relatively light within the current MotoIndex catalog.`);
  if (model.fuelConsumptionKmL && model.fuelConsumptionKmL >= 40) strengths.push(`${model.fuelConsumptionKmL} km/L is the listed fuel-economy basis in this record.`);
  if (/abs/i.test(model.abs)) strengths.push(`${model.abs} is listed in the braking specification; verify the exact local variant.`);
  if (model.fuelTankL >= 8) strengths.push(`${model.fuelTankL} L tank capacity gives more range headroom than very small-tank commuters.`);
  if (!strengths.length) strengths.push(`${model.engineCc} cc engine, ${model.curbWeightKg} kg curb weight and ${model.seatHeightMm} mm seat height are clearly documented for comparison.`);

  if (model.seatHeightMm >= 800) watchOuts.push(`${model.seatHeightMm} mm seat height can make actual foot reach worth testing in person.`);
  if (model.curbWeightKg >= 165) watchOuts.push(`${model.curbWeightKg} kg curb weight deserves extra attention for parking, reversing and low-speed maneuvering.`);
  if (!model.fuelConsumptionKmL) watchOuts.push("Fuel economy on this page starts from a clearly labeled planning estimate because a model-specific listed figure is not stored yet.");
  if (!/abs/i.test(model.abs)) watchOuts.push(`The braking field is listed as “${model.abs}”; confirm the exact trim before assuming ABS equipment.`);
  if (model.marketStatus === "previous") watchOuts.push("This is a previous-generation record, so launch price is historical context rather than a current new-bike quote.");
  if (!watchOuts.length) watchOuts.push("Dealer price, rider fit, real-world fuel use and accessory fitment still need confirmation for the exact unit and use case.");

  return {
    bestFor: authority ? authority.verdict : categoryUse(model),
    strengths: strengths.slice(0, 4),
    watchOuts: watchOuts.slice(0, 4),
  };
}

export function motorcycleEntityFaqs(model: Motorcycle): FaqItem[] {
  const priceLabel = observedMarketPriceLabel(model);
  const efficiency = efficiencyEvidence(model);
  const maintenance = maintenanceForModel(model.id);
  const authority = modelAuthorityProfile(model.id);
  const name = `${model.make} ${model.model}`;

  const authorityFaqs: FaqItem[] = authority ? [
    { question: `Who should buy the ${name} in the Philippines?`, answer: `${authority.verdict} It makes the strongest case if ${authority.buyIf.slice(0, 2).map((item) => item.replace(/\.$/, "").toLowerCase()).join(" and ")}.` },
    { question: `What should I check before buying a ${name}?`, answer: authority.phContext.join(" ") },
    { question: `What are the main reasons to skip the ${name}?`, answer: authority.skipIf.join(" ") },
  ] : [];

  const extra: FaqItem[] = [
    {
      question: `What are the ${name} engine, seat height and weight?`,
      answer: `This MotoIndex record lists a ${model.engineCc} cc engine, ${model.seatHeightMm} mm seat height and ${model.curbWeightKg} kg curb weight. Use the exact model year and variant when checking a dealer unit.`
    },
    {
      question: `What tire size does the ${name} use?`,
      answer: `The stored stock sizes are ${model.frontTire} front and ${model.rearTire} rear. A printed size match alone is not a complete fitment approval; load index, speed rating, rim, construction and clearance still matter.`
    },
    {
      question: `What is the fuel consumption of the ${name}?`,
      answer: efficiency.status === "listed"
        ? `The model record lists ${efficiency.kmPerL} km/L as its fuel-economy basis. Real-world consumption varies with traffic, speed, load, weather, tire pressure and maintenance.`
        : `MotoIndex does not currently store a model-specific listed consumption figure for this record. The page uses a ${efficiency.kmPerL} km/L planning estimate and labels it as an estimate rather than measured consumption.`
    },
    {
      question: `Is there a ${name} maintenance schedule?`,
      answer: maintenance
        ? `Yes. MotoIndex has ${maintenance.items.length} maintenance items transcribed from the linked official owner-manual source for this model record. Always confirm the schedule for your exact year and market unit.`
        : `An exact model-specific interval table is not stored yet. Use the official manufacturer service resource linked on the page instead of applying a generic oil, belt or valve schedule.`
    },
    {
      question: `Will the ${name} fit my height?`,
      answer: `Seat height is ${model.seatHeightMm} mm, but inseam, seat width, suspension sag, footwear and technique affect real foot reach. Use the rider-fit tool on this page as a planning aid and sit on the exact motorcycle before buying.`
    },
  ];

  return [...authorityFaqs, ...priceFaqsForModel(model, priceLabel), ...extra].slice(0, 10);
}

export function motorcycleEntitySeo(model: Motorcycle) {
  const current = model.marketStatus !== "previous";
  const authority = modelAuthorityProfile(model.id);
  const name = `${model.make} ${model.model}`;
  const title = current
    ? `${name} Price Philippines ${releaseYear}: Specs & Installment`
    : `${name} Historical Price, Specs & Used Value Philippines`;
  const description = current
    ? `${name} Philippines buyer guide with dated price references, ${model.engineCc}cc specs, rider fit, ownership costs${authority ? ", a unique buyer verdict and local after-sales context" : ""}.`
    : `${name} Philippines guide with historical price context, ${model.engineCc}cc specs, tire sizes, rider fit, maintenance references and used-value planning.`;
  const aliasNote = model.alsoKnownAs?.length
    ? ` Also listed as ${model.alsoKnownAs.slice(0, 2).join(" and ")}.`
    : "";
  const heading = current
    ? `${name}: price, specs and ownership guide`
    : `${name}: historical price, specs and ownership guide`;
  const intro = current
    ? authority ? `A decision-first ${name} Philippines guide with a model-specific buyer verdict, price evidence, direct alternatives, rider fit, ownership tools, after-sales links and transparent research gaps.` : `One complete ${name} research page for Philippine buyers: price sources, variants, financing, specifications, rider fit, tire sizes, fuel range, maintenance, safety, ownership cost and used-value context.`
    : `One complete ${name} reference page for owners and used-bike shoppers, keeping historical launch price separate from current market value while preserving specs, fitment and ownership information.`;
  const keywordBase = name.toLowerCase();
  const keywords = [
    `${keywordBase} price philippines`,
    `${keywordBase} price philippines ${releaseYear}`,
    `${keywordBase} specs`,
    `${keywordBase} installment`,
    `${keywordBase} tire size`,
    `${keywordBase} seat height`,
    `${keywordBase} fuel consumption`,
    `${keywordBase} maintenance schedule`,
    `${keywordBase} review`,
    `${keywordBase} ownership cost`,
    // Riders search the names they actually use, not the official ones: "PG1"
    // without the hyphen, "Winner X 150" with the displacement appended. These
    // are the same motorcycle, so they belong on this page rather than on a
    // near-duplicate built for the alias.
    ...(model.alsoKnownAs || []).flatMap((alias) => [
      `${alias.toLowerCase()} price philippines`,
      `${alias.toLowerCase()} specs`
    ]),
  ];
  return { title, description: description + aliasNote, heading, intro, keywords };
}
