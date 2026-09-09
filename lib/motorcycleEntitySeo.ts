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
  if (model.curbWeightKg <= 125) strengths.push(`${model.curbWeightKg} kg curb weight keeps it relatively light compared with many motorcycles on this site.`);
  if (model.fuelConsumptionKmL && model.fuelConsumptionKmL >= 40) strengths.push(`${model.fuelConsumptionKmL} km/L is the published fuel-economy figure available for this model.`);
  if (/abs/i.test(model.abs)) strengths.push(`${model.abs} is listed in the braking specification; verify the exact local variant.`);
  if (model.fuelTankL >= 8) strengths.push(`${model.fuelTankL} L tank capacity gives more range headroom than very small-tank commuters.`);
  if (!strengths.length) strengths.push(`${model.engineCc} cc engine, ${model.curbWeightKg} kg curb weight and ${model.seatHeightMm} mm seat height are clearly documented for comparison.`);

  if (model.seatHeightMm >= 800) watchOuts.push(`${model.seatHeightMm} mm seat height can make actual foot reach worth testing in person.`);
  if (model.curbWeightKg >= 165) watchOuts.push(`${model.curbWeightKg} kg curb weight deserves extra attention for parking, reversing and low-speed maneuvering.`);
  if (!model.fuelConsumptionKmL) watchOuts.push("Fuel economy starts with a clearly labeled planning estimate because we do not have a published model-specific figure yet.");
  if (!/abs/i.test(model.abs)) watchOuts.push(`Braking is listed as “${model.abs}”; confirm the exact trim before assuming ABS equipment.`);
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
    {
      question: `Who should buy the ${name} in the Philippines?`,
      answer: `${authority.verdict} It is a better match if ${authority.buyIf.slice(0, 2).map((item) => item.replace(/\.$/, "").toLowerCase()).join(" and ")}.`
    },
    {
      question: `What should I check before buying a ${name}?`,
      answer: authority.phContext.join(" ")
    },
    {
      question: `What are the main reasons to skip the ${name}?`,
      answer: authority.skipIf.join(" ")
    },
  ] : [];

  const extra: FaqItem[] = [
    {
      question: `What are the ${name} engine, seat height and weight?`,
      answer: `The ${name} has a ${model.engineCc} cc engine, a ${model.seatHeightMm} mm seat height and a ${model.curbWeightKg} kg curb weight. Check the exact model year and variant if a dealer unit differs.`
    },
    {
      question: `What tire size does the ${name} use?`,
      answer: `Stock tire sizes are ${model.frontTire} at the front and ${model.rearTire} at the rear. When replacing tires, match the full size plus the correct load rating, speed rating, rim and front/rear application.`
    },
    {
      question: `What is the fuel consumption of the ${name}?`,
      answer: efficiency.status === "listed"
        ? `Listed fuel consumption is ${efficiency.kmPerL} km/L. Actual fuel economy can be lower or higher depending on traffic, speed, load, tire pressure, maintenance and riding style.`
        : `A model-specific published fuel-consumption figure is not available in the current source set. The calculator uses ${efficiency.kmPerL} km/L as a clearly labeled estimate for planning only.`
    },
    {
      question: `Is there a ${name} maintenance schedule?`,
      answer: maintenance
        ? `Yes. The maintenance section includes ${maintenance.items.length} service items taken from the linked owner-manual source. Follow the schedule for your exact model year and market version.`
        : `A model-specific service-interval table is not available yet. Use the manufacturer's service schedule for your exact model year instead of relying on a generic oil, belt or valve interval.`
    },
    {
      question: `Will the ${name} fit my height?`,
      answer: `The seat height is ${model.seatHeightMm} mm. Whether it fits you comfortably also depends on your inseam, seat width, suspension sag, footwear and riding technique, so sit on the motorcycle before buying if possible.`
    },
  ];

  return [...authorityFaqs, ...priceFaqsForModel(model, priceLabel), ...extra].slice(0, 10);
}

export function motorcycleEntitySeo(model: Motorcycle) {
  const current = model.marketStatus !== "previous" && model.marketStatus !== "uncertain" && model.marketStatus !== "discontinued";
  const uncertain = model.marketStatus === "uncertain";
  const authority = modelAuthorityProfile(model.id);
  const name = `${model.make} ${model.model}`;
  const title = current
    ? `${name} Price Philippines ${releaseYear}: Specs & Installment`
    : uncertain
      ? `${name} Price Philippines: Specs & Availability`
      : `${name} Historical Price, Specs & Used Value Philippines`;
  const description = current
    ? `${name} price in the Philippines, ${model.engineCc}cc specs, rider fit, installment planning and ownership costs${authority ? ", plus buyer advice and local after-sales context" : ""}.`
    : uncertain
      ? `${name} price and specs in the Philippines, with financing tools and a clear note to confirm current dealer availability.`
      : `${name} Philippines guide with historical price context, ${model.engineCc}cc specs, tire sizes, rider fit, maintenance references and used-value planning.`;
  const aliasNote = model.alsoKnownAs?.length
    ? ` Also listed as ${model.alsoKnownAs.slice(0, 2).join(" and ")}.`
    : "";
  const heading = current
    ? `${name}: price, specs and ownership guide`
    : uncertain
      ? `${name}: price, specs and availability guide`
      : `${name}: historical price, specs and ownership guide`;
  const intro = current
    ? authority ? `Compare the ${name} price, specs, rider fit and ownership costs, with clear reasons to buy or skip it, direct alternatives and Philippine after-sales links.` : `Compare the ${name} price, variants, financing, specs, rider fit, tires, fuel use, maintenance, ownership cost and used-value estimates in one place.`
    : uncertain
      ? `Check the ${name} price, specifications and financing tools, then confirm current dealer stock and the exact model year before buying.`
      : `Use this ${name} page for historical launch pricing, specifications, fitment and used-bike ownership research without confusing the old SRP with today&apos;s market value.`;
  const keywordBase = name.toLowerCase();
  const keywords = [
    `${keywordBase} price philippines`,
    `${keywordBase} price philippines ${releaseYear}`,
    `${keywordBase} specs`,
    `${keywordBase} installment`,
    `${keywordBase} downpayment`,
    `${keywordBase} down payment`,
    `${keywordBase} monthly payment`,
    `${keywordBase} monthly installment`,
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
