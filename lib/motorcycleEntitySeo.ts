import type { Motorcycle } from "./types";
import type { FaqItem } from "@/components/FaqSection";
import { RELEASE_DATE } from "./site";
import { observedMarketPriceLabel } from "./marketChecks";
import { efficiencyEvidence } from "./efficiency";
import { maintenanceForModel } from "./maintenance";
import { priceFaqsForModel } from "./priceSeo";
import { modelAuthorityProfile } from "./modelAuthority";
import { isGlobalDemandModel } from "./globalDemandExpansion2026";

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

function firstTitleThatFits(options: string[], limit = 60) {
  return options.find((option) => option.length <= limit) || options[options.length - 1];
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

function modelSpecificFaqs(model: Motorcycle): FaqItem[] {
  if (model.id === "honda-beat") {
    return [
      {
        question: "How much is the Honda BeAT in the Philippines?",
        answer: "Honda Philippines currently lists the BeAT Playful at ₱72,500 and BeAT Premium at ₱74,700 before temporary promotions or dealer-specific charges. Confirm the exact variant and branch quote before financing."
      },
      {
        question: "What is the difference between Honda BeAT Playful and Premium?",
        answer: "MotoIndex keeps both current BeAT configurations on one canonical page. The published starting prices differ, so compare the exact trim, colors and dealer equipment rather than treating every BeAT listing as the same unit."
      }
    ];
  }
  if (model.id === "honda-crf150l") {
    return [
      {
        question: "How much is the Honda CRF150L in the Philippines?",
        answer: "The latest official Honda Philippines CRF150L SRP MotoIndex located is ₱147,900 from June 2023. Current 2026 availability and dealer pricing are not confirmed, so treat that figure as a historical official reference rather than a current guaranteed quote."
      },
      {
        question: "Is the Honda CRF150L still available new in 2026?",
        answer: "MotoIndex has not confirmed current 2026 Philippine catalog availability for the CRF150L. Check an authorized Honda dealer for current stock, model year and pricing before planning a new-bike purchase."
      }
    ];
  }
  if (model.id === "yamaha-mio-i-125") {
    return [
      {
        question: "How much is the Yamaha Mio i 125 in the Philippines?",
        answer: "MotoIndex currently stores a ₱75,900 Philippine dealer reference for the Mio i 125. Final cash price, registration, promotions and financing can differ by branch, so confirm the exact unit and quote."
      },
      {
        question: "Is Mio Sporty the same as Mio i 125?",
        answer: "No. Mio Sporty is an older 114cc carbureted Mio generation. MotoIndex keeps legacy Mio Sporty search context on the current Mio i 125 research page without presenting an old Sporty price as a current new-bike quote."
      }
    ];
  }
  if (model.id === "suzuki-raider-r150") {
    return [
      {
        question: "How much is the Suzuki Raider R150 in the Philippines?",
        answer: "Suzuki Motorcycles Philippines currently provides a ₱130,000 price reference for the Raider R150 in MotoIndex's source set. Confirm the exact dealer quote, registration and financing before purchase."
      },
      {
        question: "Does the Suzuki Raider R150 have ABS?",
        answer: "The current MotoIndex Raider R150 record does not list ABS. If ABS is a requirement, confirm the exact dealer unit and compare it with other sport-underbone alternatives before buying."
      }
    ];
  }
  if (model.id === "yamaha-xmax") {
    return [
      {
        question: "How much is the Yamaha XMAX in the Philippines?",
        answer: "Current Philippine dealer references in MotoIndex list the Yamaha XMAX at ₱311,000. Treat that as a dated market reference and confirm the exact branch cash price, registration, insurance and financing."
      },
      {
        question: "Does the Yamaha XMAX have ABS?",
        answer: "Yes. The current MotoIndex XMAX record lists dual-channel ABS. Verify the exact model year and dealer unit before purchase if equipment changes."
      }
    ];
  }

  if (model.id === "honda-giorno-plus") {
    return [
      {
        question: "How much is the Honda Giorno in the Philippines?",
        answer: "MotoIndex maps Honda Giorno searches to the current Giorno+ canonical. Current Philippine dealer references include ₱101,900 for the All-New Giorno+ and ₱106,000 on a newer Motortrade Giorno+ listing. Confirm the exact model code, color and branch quote because dealer listings can differ."
      },
      {
        question: "Is Honda Giorno the same as Honda Giorno+?",
        answer: "For current Philippine shopping intent, MotoIndex consolidates broad Honda Giorno searches on the Giorno+ page instead of creating a duplicate Giorno URL. Dealer naming may shorten Giorno+ to Giorno, so verify the exact model code on the unit."
      }
    ];
  }
  if (model.id === "yamaha-mio-gear") {
    return [
      {
        question: "How much is the Yamaha Mio Gear downpayment and monthly?",
        answer: "Motortrade currently shows the Mio Gear at ₱79,400 with an indicative ₱4,000 downpayment and ₱4,000 monthly figure. The dealer states that prices are indicative and branch-dependent, so ask for the full financed amount, term, rate method and fees before comparing loans."
      },
      {
        question: "Does the Yamaha Mio Gear have ABS?",
        answer: "The current MotoIndex Mio Gear record does not list ABS. Compare the exact dealer unit and braking specification before buying if ABS is a requirement."
      }
    ];
  }
  if (model.id === "kawasaki-ninja-400") {
    return [
      {
        question: "How much is a Kawasaki Ninja 400 in the Philippines?",
        answer: "MotoIndex keeps ₱340,900 as a historical Philippine Ninja 400 price reference for this previous generation. Current used prices depend on year, mileage, condition, registration and modifications, so it should not be treated as a current new-bike MSRP."
      },
      {
        question: "Is the Ninja 400 still the current Kawasaki model in the Philippines?",
        answer: "Kawasaki Philippines currently lists the 451cc Ninja 500 as the current successor, with an MSRP of ₱353,800 for the standard model. Use the Ninja 400 page for historical and used-bike research and the Ninja 500 page for current new-bike research."
      }
    ];
  }
  if (model.id === "yamaha-aerox-v3") {
    return [
      {
        question: "How much is the Yamaha Aerox SP in the Philippines?",
        answer: "The current Motortrade Aerox SP listing shows ₱163,900 SRP. Dealer pricing is indicative and can change, so confirm the exact SP model code, cash price and branch quote before reserving."
      },
      {
        question: "What is the difference between Aerox Standard and Aerox SP?",
        answer: "MotoIndex keeps both on the Aerox V3 canonical. The SP is the higher-spec current variant and is associated with Yamaha's YECVT package plus ABS and traction-control equipment on current references, while the Standard is the lower-price current configuration."
      }
    ];
  }

  if (model.id === "honda-click-125i") {
    return [
      {
        question: "What is the difference between Honda Click125 Standard and Smart Edition?",
        answer: "Honda's 2026 Philippine Click125 reference lists both Standard and Smart Edition variants. Smart Edition adds the Smart Key System and Idling Stop System. Both use the 125cc liquid-cooled PGM-FI eSP engine, Combined Brake System, USB Type-C charging and 18 L luggage box; colors and trim details also differ."
      },
      {
        question: "Does the Honda Click125 have ABS?",
        answer: "Honda's 2026 Philippine specification lists the Click125 with Combined Brake System (CBS), not ABS. The Smart Edition adds convenience features such as Smart Key and Idling Stop, but the current official specification still identifies CBS as the braking system."
      }
    ];
  }
  if (model.id === "honda-pcx-160") {
    return [
      {
        question: "What is the difference between Honda PCX160 Standard and RoadSync?",
        answer: "The current Philippine PCX160 Standard uses CBS, while the RoadSync trim adds Honda RoadSync, a 5-inch TFT display, ABS and Honda Selectable Torque Control (HSTC). Both use the same 157cc eSP+ platform, so the decision is mainly price, braking/electronics and connectivity."
      },
      {
        question: "Does the Honda PCX160 have ABS?",
        answer: "ABS depends on the variant. MotoIndex's current Honda Philippines variant record lists CBS on PCX160 Standard and ABS plus HSTC on PCX160 RoadSync. Confirm the exact trim on the dealer unit before buying."
      }
    ];
  }
  return [];
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

  return [...authorityFaqs, ...priceFaqsForModel(model, priceLabel), ...modelSpecificFaqs(model), ...extra].slice(0, 10);
}

export function motorcycleEntitySeo(model: Motorcycle) {
  const current = model.marketStatus !== "previous" && model.marketStatus !== "uncertain" && model.marketStatus !== "discontinued";
  const uncertain = model.marketStatus === "uncertain";
  const globalDemand = isGlobalDemandModel(model);
  const authority = modelAuthorityProfile(model.id);
  const name = `${model.make} ${model.model}`;
  const title = globalDemand && current
    ? firstTitleThatFits([
        `${name} Specs, Price & Ownership Guide ${releaseYear}`,
        `${name} Specs, Price & Review Guide`,
        `${name} Specs & Price`,
      ])
    : current
      ? firstTitleThatFits([
          `${name} Price Philippines ${releaseYear}: Specs & Installment`,
          `${name} Price Philippines ${releaseYear} | Specs`,
          `${name} Price Philippines ${releaseYear}`,
        ])
      : uncertain
        ? firstTitleThatFits([
            `${name} Price Philippines: Specs & Availability`,
            `${name} Price Philippines | Availability`,
            `${name} Price Philippines`,
          ])
        : firstTitleThatFits([
            `${name} Historical Price & Specs Philippines`,
            `${name} Used Price & Specs Philippines`,
            `${name} Specs & Used Value Philippines`,
          ]);
  const description = globalDemand && current
    ? `${name} specs, price reference, seat height, weight, tire sizes, rider fit and ownership research. Philippine pricing is shown when a current source is available.`
    : current
      ? `${name} price in the Philippines, ${model.engineCc}cc specs, rider fit, installment planning and ownership costs${authority ? ", plus buyer advice and local after-sales context" : ""}.`
      : uncertain
        ? `${name} price and specs in the Philippines, with financing tools and a clear note to confirm current dealer availability.`
        : `${name} Philippines guide with historical price context, ${model.engineCc}cc specs, tire sizes, rider fit, maintenance references and used-value planning.`;
  const aliasNote = model.alsoKnownAs?.length
    ? ` Also listed as ${model.alsoKnownAs.slice(0, 2).join(" and ")}.`
    : "";
  const heading = globalDemand && current
    ? `${name}: specs, price and ownership guide`
    : current
      ? `${name}: price, specs and ownership guide`
      : uncertain
        ? `${name}: price, specs and availability guide`
        : `${name}: historical price, specs and ownership guide`;
  const intro = globalDemand && current
    ? `Compare the ${name} specifications, price reference, rider fit, tires, fuel use and ownership details in one place. Market availability and pricing vary by country, so the dated source stays attached to the record.`
    : current
      ? authority ? `Compare the ${name} price, specs, rider fit and ownership costs, with clear reasons to buy or skip it, direct alternatives and Philippine after-sales links.` : `Compare the ${name} price, variants, financing, specs, rider fit, tires, fuel use, maintenance, ownership cost and used-value estimates in one place.`
      : uncertain
        ? `Check the ${name} price, specifications and financing tools, then confirm current dealer stock and the exact model year before buying.`
        : `Use this ${name} page for historical launch pricing, specifications, fitment and used-bike ownership research without confusing the old SRP with today's market value.`;
  const keywordBase = name.toLowerCase();
  const phKeywords = [
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
    ...(model.alsoKnownAs || []).flatMap((alias) => [
      `${alias.toLowerCase()} price philippines`,
      `${alias.toLowerCase()} specs`
    ]),
  ];
  const globalKeywords = [
    `${keywordBase} specs`,
    `${keywordBase} price`,
    `${keywordBase} review`,
    `${keywordBase} top speed`,
    `${keywordBase} horsepower`,
    `${keywordBase} weight`,
    `${keywordBase} seat height`,
    `${keywordBase} tire size`,
    `${keywordBase} fuel consumption`,
    `${keywordBase} maintenance`,
    `${keywordBase} price philippines`,
    ...(model.alsoKnownAs || []).flatMap((alias) => [
      `${alias.toLowerCase()} specs`,
      `${alias.toLowerCase()} price`,
      `${alias.toLowerCase()} review`
    ]),
  ];
  return { title, description: description + aliasNote, heading, intro, keywords: globalDemand ? globalKeywords : phKeywords };
}
