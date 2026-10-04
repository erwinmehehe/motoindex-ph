import { getModelById } from "@/lib/data";
import type { Motorcycle } from "@/lib/types";

export type GenerationChangeCategory =
  | "engine"
  | "electronics"
  | "dimensions"
  | "storage"
  | "suspension"
  | "features"
  | "price";

export type GenerationChangeNote = {
  category: GenerationChangeCategory;
  title: string;
  from?: string;
  to?: string;
  impact: string;
  sourceLabel: string;
  sourceUrl: string;
};

export type UpgradeVerdict = "Meaningful upgrade" | "Targeted upgrade" | "Mostly incremental";

export type CuratedGenerationTransition = {
  fromModelId: string;
  toModelId: string;
  summary: string;
  notes: GenerationChangeNote[];
  upgrade: {
    verdict: UpgradeVerdict;
    bestReasons: string[];
    keepPreviousIf: string[];
    bottomLine: string;
  };
};

export type MeasurableGenerationDelta = {
  key: "engine" | "power" | "torque" | "weight" | "seat" | "tank" | "clearance" | "price";
  label: string;
  from: string;
  to: string;
  delta: string;
  tone: "positive" | "neutral" | "tradeoff";
};

export type GenerationTransition = {
  id: string;
  from: Motorcycle;
  to: Motorcycle;
  summary: string;
  notes: GenerationChangeNote[];
  measurable: MeasurableGenerationDelta[];
  upgrade: CuratedGenerationTransition["upgrade"];
  curated: boolean;
};

export type ModelYearUpdate = {
  id: string;
  modelId: string;
  fromYear: number;
  toYear: number;
  headline: string;
  summary: string;
  verdict: "Feature refresh" | "Mostly cosmetic" | "Mechanical update";
  notes: GenerationChangeNote[];
};

const curatedTransitions: CuratedGenerationTransition[] = [
  {
    fromModelId: "yamaha-nmax-v2",
    toModelId: "yamaha-nmax-v3",
    summary: "NMAX V3 keeps the same 155-class premium-scooter formula, while the current range moves the meaningful technology jump into the higher-spec Tech MAX trim.",
    notes: [
      {
        category: "electronics",
        title: "YECVT becomes the headline Tech MAX upgrade",
        from: "Conventional automatic CVT; V2 ABS versions added Y-Connect, traction control and Smart Key equipment.",
        to: "Current NMAX Tech MAX adds Yamaha Electric CVT with Sport/Touring modes and rider-triggered downshift control.",
        impact: "This is the strongest reason to move from a V2 to the higher-spec V3 Tech MAX. It changes rider control more than the small recorded engine-output difference does.",
        sourceLabel: "Yamaha Motor Philippines YECVT reference",
        sourceUrl: "https://www.yamaha-motor.com.ph/yecvt"
      },
      {
        category: "features",
        title: "Core equipment changes are trim-sensitive",
        from: "Philippine V2 launch offered base and ABS variants; the ABS/Y-Connect package carried more of the electronics.",
        to: "The current line separates the regular NMAX from the higher-priced Tech MAX, so compare the exact trim rather than the generation label alone.",
        impact: "A V2 ABS owner should compare against the exact V3 trim. Moving to a regular V3 is a different proposition from moving to Tech MAX.",
        sourceLabel: "MotoPinas 2020 Philippine NMAX launch",
        sourceUrl: "https://www.motopinas.com/motorcycle-news/yamaha-officially-launches-the-new-nmax-starting-at-php119-900.html"
      },
      {
        category: "price",
        title: "Do not compare launch SRP as if both are current dealer prices",
        from: "V2 record uses historical Philippine launch pricing.",
        to: "V3 record uses current-model price context, with Tech MAX priced above the regular current line.",
        impact: "Use current used-market condition for V2 and a current dealer quote for V3. The raw SRP gap is not a depreciation or upgrade-cost calculation.",
        sourceLabel: "MotoIndex generation-specific price records",
        sourceUrl: "/motorcycles/yamaha/nmax"
      }
    ],
    upgrade: {
      verdict: "Targeted upgrade",
      bestReasons: [
        "You specifically want the Tech MAX YECVT ride modes and downshift control.",
        "You are buying new and value the current-generation warranty, electronics and current parts/support path.",
        "Your existing V2 is already due for replacement rather than being upgraded solely for small spec-number changes."
      ],
      keepPreviousIf: [
        "Your V2 ABS is in strong condition and its current equipment already covers your daily use.",
        "You are comparing a regular V3 rather than Tech MAX and expect a dramatic performance jump.",
        "The real cash difference is large after valuing your V2 on the used market."
      ],
      bottomLine: "For most V2 owners, V3 is not an automatic upgrade. The case becomes much stronger when the target is Tech MAX and the YECVT/electronics package is something you will actually use."
    }
  },
  {
    fromModelId: "yamaha-aerox-v2",
    toModelId: "yamaha-aerox-v3",
    summary: "Aerox V3 preserves much of the proven 155cc sport-scooter package. The larger experiential jump is concentrated in the higher-spec SP/YECVT configuration.",
    notes: [
      {
        category: "engine",
        title: "Core engine numbers remain close",
        from: "V2 uses a 155cc VVA Blue Core engine with 15.4 PS and 13.9 Nm in the stored Philippine record.",
        to: "V3 remains 155cc with very similar recorded peak output; the current record shows slightly higher torque.",
        impact: "Do not expect the generation change alone to transform straight-line performance on the base configuration.",
        sourceLabel: "MotoIndex verified Aerox generation records",
        sourceUrl: "/motorcycles/yamaha/aerox"
      },
      {
        category: "electronics",
        title: "SP trim adds the major transmission-control change",
        from: "V2 added Y-Connect availability and retained a conventional automatic CVT.",
        to: "Current Aerox SP uses YECVT with Sport/Touring modes and downshift control.",
        impact: "The upgrade is most meaningful for riders deliberately choosing the SP/YECVT trim rather than simply replacing V2 with the base V3.",
        sourceLabel: "Yamaha Motor Philippines YECVT reference",
        sourceUrl: "https://www.yamaha-motor.com.ph/yecvt"
      },
      {
        category: "storage",
        title: "V2 already had practical under-seat capacity",
        from: "The Philippine V2/Y-Connect launch described 24.5 L under-seat storage.",
        to: "MotoIndex does not assert a V3 storage increase without a checked comparable Philippine figure.",
        impact: "Storage should not be used as an upgrade reason until the exact V3 trim is confirmed against a current source.",
        sourceLabel: "MotoPinas 2021 Aerox Y-Connect launch",
        sourceUrl: "https://www.motopinas.com/motorcycle-news/yamaha-ph-launches-y-connect-enabled-2021-aerox.html"
      }
    ],
    upgrade: {
      verdict: "Targeted upgrade",
      bestReasons: [
        "You want the current Aerox SP and its YECVT control package.",
        "You prefer buying new/current rather than refreshing an older V2.",
        "Your V2 condition, maintenance needs or resale timing already support changing motorcycles."
      ],
      keepPreviousIf: [
        "Your V2 is healthy and you are considering only the base V3.",
        "You expect a large displacement or peak-power increase.",
        "The V3 price premium matters more to you than the SP/YECVT features."
      ],
      bottomLine: "V2 to base V3 is relatively incremental on the stored core specs. V2 to V3 SP is the more distinct technology upgrade."
    }
  },
  {
    fromModelId: "honda-click-150i",
    toModelId: "honda-click-160",
    summary: "Click160 is a clearer mechanical and platform step from Click150i: more displacement and output, a new-generation eSP+ engine and newer chassis/convenience features.",
    notes: [
      {
        category: "engine",
        title: "150cc generation moves to 157cc 4-valve eSP+",
        from: "Click150i uses the previous 150cc generation.",
        to: "Click160 launched with a 157cc, 4-valve, liquid-cooled eSP+ engine rated at 11.3 kW and 13.8 Nm.",
        impact: "This is a genuine engine-generation change rather than a styling-only refresh.",
        sourceLabel: "Honda Philippines 2022 Click160 launch",
        sourceUrl: "https://www.hondaph.com/motorcycle/news/experience-brand-new-perfection-with-the-all-new-click160"
      },
      {
        category: "features",
        title: "New chassis and daily-use equipment",
        from: "Click150i belongs to the prior platform generation.",
        to: "Click160 introduced Honda's Enhanced Smart Architecture Frame, USB charging, full-digital meter, LED lighting and Smart Key equipment.",
        impact: "The newer model improves the ownership experience as well as the powertrain.",
        sourceLabel: "Honda Philippines 2022 Click160 launch",
        sourceUrl: "https://www.hondaph.com/motorcycle/news/experience-brand-new-perfection-with-the-all-new-click160"
      },
      {
        category: "storage",
        title: "Current Click160 storage is explicitly documented",
        from: "MotoIndex does not use an unverified Click150i luggage-volume figure for this comparison.",
        to: "Honda's 2024 Philippine Click160 reference specifies an 18 L luggage box.",
        impact: "Treat the current 18 L figure as a verified current-model fact, not as a claimed exact liter increase over Click150i.",
        sourceLabel: "Honda Philippines 2024 Click160 reference",
        sourceUrl: "https://www.hondaph.com/motorcycle/news/ready-to-take-on-the-world-step-up-your-game-with-a-sportier-and-more-stylish-the-new-click160"
      }
    ],
    upgrade: {
      verdict: "Meaningful upgrade",
      bestReasons: [
        "You want the stronger 157cc eSP+ engine and newer chassis generation.",
        "USB charging, Smart Key and newer daily-use equipment matter to your commute.",
        "You are moving from an aging Click150i whose maintenance or resale timing already favors replacement."
      ],
      keepPreviousIf: [
        "Your Click150i is inexpensive to keep and already meets your city-use needs.",
        "You are choosing strictly on purchase price and a good used 150i is materially cheaper.",
        "The newer convenience features do not change how you use the motorcycle."
      ],
      bottomLine: "Click150i to Click160 is one of the stronger generation changes in the current MotoIndex family set because both the engine platform and convenience package move forward."
    }
  },
  {
    fromModelId: "honda-adv-150",
    toModelId: "honda-adv-160",
    summary: "ADV160 is a substantial successor to ADV150, adding the 157cc 4-valve eSP+ engine, HSTC, revised suspension/features, lower seat height and larger documented storage.",
    notes: [
      {
        category: "engine",
        title: "ADV moves to the 157cc 4-valve eSP+ engine",
        from: "ADV150 belongs to Honda's previous 150cc adventure-scooter generation.",
        to: "ADV160 launched with a 157cc 4-valve liquid-cooled eSP+ engine producing 11.8 kW and 14.7 Nm.",
        impact: "The successor changes the powertrain, not just styling.",
        sourceLabel: "Honda Philippines 2022 ADV160 launch",
        sourceUrl: "https://www.hondaph.com/motorcycle/news/discover-new-excitement-with-the-all-new-adv160"
      },
      {
        category: "features",
        title: "HSTC and newer safety/convenience equipment",
        from: "ADV150's Philippine launch already included Smart Key, LED lighting, digital instrumentation and adjustable windscreen.",
        to: "ADV160 adds Honda Selectable Torque Control, updated ABS/wavy-disc context, USB charging and newer controls/equipment.",
        impact: "Traction control is a meaningful functional addition for riders who value electronic rider aids.",
        sourceLabel: "Honda Philippines ADV150 and ADV160 launch references",
        sourceUrl: "https://www.hondaph.com/motorcycle/news/discover-new-excitement-with-the-all-new-adv160"
      },
      {
        category: "dimensions",
        title: "Seat height drops while utility increases",
        from: "Honda documented a 795 mm seat on the prior ADV150 context.",
        to: "ADV160 lowered the seat to 780 mm and increased the fuel tank from 8.0 L to 8.1 L.",
        impact: "The lower seat can improve ground reach even though the overall adventure-scooter role remains.",
        sourceLabel: "Honda Philippines 2022 ADV160 launch",
        sourceUrl: "https://www.hondaph.com/motorcycle/news/discover-new-excitement-with-the-all-new-adv160"
      },
      {
        category: "storage",
        title: "Under-seat luggage grows from 28 L to 30 L",
        from: "ADV150 launched with a 28 L utility box.",
        to: "ADV160 increased the documented luggage box to 30 L.",
        impact: "The storage increase is modest but directly verified.",
        sourceLabel: "Honda Philippines ADV150/ADV160 launch references",
        sourceUrl: "https://www.hondaph.com/motorcycle/news/discover-new-excitement-with-the-all-new-adv160"
      },
      {
        category: "suspension",
        title: "ADV160 documents Showa subtank rear suspension",
        from: "Previous generation used the ADV150 suspension package.",
        to: "ADV160 launch material specifies twin rear Showa subtank suspension.",
        impact: "This is a chassis/ride-control change worth considering for rough-road and longer-ride use.",
        sourceLabel: "Honda Philippines 2022 ADV160 launch",
        sourceUrl: "https://www.hondaph.com/motorcycle/news/discover-new-excitement-with-the-all-new-adv160"
      }
    ],
    upgrade: {
      verdict: "Meaningful upgrade",
      bestReasons: [
        "You want the 157cc eSP+ engine and HSTC rider aid.",
        "Lower seat height, slightly larger storage and updated suspension matter to your daily/longer rides.",
        "You are replacing an older ADV150 rather than upgrading solely for cosmetics."
      ],
      keepPreviousIf: [
        "Your ADV150 is in excellent condition and already fits your comfort/utility needs.",
        "The used-market value gap makes the upgrade expensive relative to the features you care about.",
        "You do not value HSTC or the newer engine/chassis package enough to justify changing units."
      ],
      bottomLine: "ADV150 to ADV160 is a meaningful generation upgrade with verified powertrain, rider-aid, seating, storage and suspension changes."
    }
  }
];

export const modelYearUpdates: ModelYearUpdate[] = [
  {
    id:"honda-adv-160-2022-2026",
    modelId:"honda-adv-160",
    fromYear:2022,
    toYear:2026,
    headline:"ADV160 2022 → 2026: technology refresh on the same 157cc platform",
    summary:"The 2026 Philippine ADV160 keeps the 157cc eSP+ powertrain figures while adding a more modern cockpit/connectivity package and a new RoadSync trim.",
    verdict:"Feature refresh",
    notes:[
      {
        category:"electronics",
        title:"5-inch TFT and RoadSync arrive on the 2026 RoadSync type",
        from:"2022 ADV160 launched with a full-digital LCD meter and the earlier control package.",
        to:"2026 adds a 5-inch TFT meter, with Honda RoadSync navigation/call/notification connectivity exclusive to the RoadSync type.",
        impact:"This is the clearest reason to distinguish a 2026 RoadSync unit from an earlier ADV160 even though both are ADV160.",
        sourceLabel:"Honda Philippines 2026 ADV160 launch",
        sourceUrl:"https://www.hondaph.com/motorcycle/news/experience-the-suv-pride-with-the-adv160"
      },
      {
        category:"features",
        title:"Charging and control hardware are updated",
        from:"2022 launch material documented a USB charging port and the original switch layout.",
        to:"2026 documents USB Type-C charging, a new multi-function switch and passing-light switch.",
        impact:"The update is convenience-led rather than a displacement or peak-output change.",
        sourceLabel:"Honda Philippines 2026 ADV160 launch",
        sourceUrl:"https://www.hondaph.com/motorcycle/news/experience-the-suv-pride-with-the-adv160"
      },
      {
        category:"storage",
        title:"30 L under-seat storage remains, Smart Top Box support expands utility",
        from:"2022 ADV160 increased under-seat luggage capacity to 30 L.",
        to:"2026 retains the 30 L luggage box and adds compatibility with a Smart Top Box operated through the Smart Key System.",
        impact:"The built-in storage figure is not a new increase, but the accessory integration changes the current ownership package.",
        sourceLabel:"Honda Philippines 2026 ADV160 launch",
        sourceUrl:"https://www.hondaph.com/motorcycle/news/experience-the-suv-pride-with-the-adv160"
      }
    ]
  },
  {
    id:"honda-click-160-2022-2024",
    modelId:"honda-click-160",
    fromYear:2022,
    toYear:2024,
    headline:"Click160 2022 → 2024: styling refresh with core mechanical continuity",
    summary:"Honda's 2024 Philippine Click160 update emphasizes new two-tone styling while retaining the same documented 157cc eSP+ output, CBS, digital meter, LED lighting, Idling Stop and Smart Key package.",
    verdict:"Mostly cosmetic",
    notes:[
      {
        category:"engine",
        title:"157cc eSP+ output remains the same in Honda's 2024 reference",
        from:"2022 launch: 157cc 4-valve eSP+, 11.3 kW and 13.8 Nm.",
        to:"2024 reference repeats the 157cc 4-valve eSP+ engine, 11.3 kW and 13.8 Nm.",
        impact:"Do not treat a 2024 Click160 as a new engine generation solely because it is a newer model year.",
        sourceLabel:"Honda Philippines 2024 Click160 reference",
        sourceUrl:"https://www.hondaph.com/motorcycle/news/ready-to-take-on-the-world-step-up-your-game-with-a-sportier-and-more-stylish-the-new-click160"
      },
      {
        category:"features",
        title:"The 2024 update centers on sportier two-tone styling",
        from:"2022 introduced the all-new Click160 platform and equipment set.",
        to:"2024 launch highlights a sportier two-tone color treatment while retaining CBS, digital meter, LED lighting, Idling Stop, USB charging and Smart Key.",
        impact:"For a clean 2022 Click160 owner, the 2024 refresh alone is a weak mechanical reason to change bikes.",
        sourceLabel:"Honda Philippines 2024 Click160 reference",
        sourceUrl:"https://www.hondaph.com/motorcycle/news/ready-to-take-on-the-world-step-up-your-game-with-a-sportier-and-more-stylish-the-new-click160"
      },
      {
        category:"storage",
        title:"2024 source explicitly documents the luggage-box volume",
        from:"The 2022 launch described a large luggage box without the same explicit liter figure in the stored change note.",
        to:"Honda's 2024 reference specifies an 18 L luggage box.",
        impact:"MotoIndex treats 18 L as a verified 2024/current-model fact, not as proof that storage volume increased between 2022 and 2024.",
        sourceLabel:"Honda Philippines 2024 Click160 reference",
        sourceUrl:"https://www.hondaph.com/motorcycle/news/ready-to-take-on-the-world-step-up-your-game-with-a-sportier-and-more-stylish-the-new-click160"
      }
    ]
  }
];

export function modelYearUpdatesForIds(generationIds:string[]){
  const allowed=new Set(generationIds);
  return modelYearUpdates.filter(update=>allowed.has(update.modelId));
}

function signed(value: number, suffix = "") {
  if (value === 0) return "No change";
  return `${value > 0 ? "+" : ""}${Number(value.toFixed(1))}${suffix}`;
}

function measurableDeltas(from: Motorcycle, to: Motorcycle): MeasurableGenerationDelta[] {
  const priceDelta = to.srp - from.srp;
  const entries: MeasurableGenerationDelta[] = [
    { key:"engine", label:"Engine", from:`${from.engineCc} cc`, to:`${to.engineCc} cc`, delta:signed(to.engineCc-from.engineCc," cc"), tone:to.engineCc>from.engineCc?"positive":"neutral" },
    { key:"power", label:"Power", from:`${from.powerHp} hp`, to:`${to.powerHp} hp`, delta:signed(to.powerHp-from.powerHp," hp"), tone:to.powerHp>from.powerHp?"positive":to.powerHp<from.powerHp?"tradeoff":"neutral" },
    { key:"torque", label:"Torque", from:`${from.torqueNm} Nm`, to:`${to.torqueNm} Nm`, delta:signed(to.torqueNm-from.torqueNm," Nm"), tone:to.torqueNm>from.torqueNm?"positive":to.torqueNm<from.torqueNm?"tradeoff":"neutral" },
    { key:"weight", label:"Curb weight", from:`${from.curbWeightKg} kg`, to:`${to.curbWeightKg} kg`, delta:signed(to.curbWeightKg-from.curbWeightKg," kg"), tone:to.curbWeightKg<from.curbWeightKg?"positive":to.curbWeightKg>from.curbWeightKg?"tradeoff":"neutral" },
    { key:"seat", label:"Seat height", from:`${from.seatHeightMm} mm`, to:`${to.seatHeightMm} mm`, delta:signed(to.seatHeightMm-from.seatHeightMm," mm"), tone:"neutral" },
    { key:"tank", label:"Fuel tank", from:`${from.fuelTankL} L`, to:`${to.fuelTankL} L`, delta:signed(to.fuelTankL-from.fuelTankL," L"), tone:to.fuelTankL>from.fuelTankL?"positive":"neutral" },
    { key:"price", label:"Recorded SRP", from:`₱${from.srp.toLocaleString("en-PH")}`, to:`₱${to.srp.toLocaleString("en-PH")}`, delta:signed(priceDelta,""), tone:"neutral" },
  ];
  if (from.groundClearanceMm !== undefined && to.groundClearanceMm !== undefined) {
    entries.splice(5,0,{ key:"clearance", label:"Ground clearance", from:`${from.groundClearanceMm} mm`, to:`${to.groundClearanceMm} mm`, delta:signed(to.groundClearanceMm-from.groundClearanceMm," mm"), tone:to.groundClearanceMm>from.groundClearanceMm?"positive":"neutral" });
  }
  return entries;
}

function genericUpgrade(from: Motorcycle, to: Motorcycle): CuratedGenerationTransition["upgrade"] {
  const meaningful =
    Math.abs(to.engineCc-from.engineCc) >= 5 ||
    Math.abs(to.powerHp-from.powerHp) >= 1 ||
    Math.abs(to.torqueNm-from.torqueNm) >= 1;
  return {
    verdict: meaningful ? "Meaningful upgrade" : "Mostly incremental",
    bestReasons: [
      "You prefer the newer generation's verified dimensions/spec package.",
      "The older motorcycle's condition or maintenance needs already favor replacement.",
      "A current new-bike warranty/support path is important to you."
    ],
    keepPreviousIf: [
      "The older generation is in strong condition and already fits your use.",
      "The measurable spec differences are small for your priorities.",
      "A current used-value estimate shows a large real cash gap to change units."
    ],
    bottomLine: meaningful
      ? `${to.model} makes measurable powertrain changes over ${from.model}, but compare exact condition, trim and real transaction cost before upgrading.`
      : `${to.model} is not automatically a better ownership decision than a healthy ${from.model}; the stored core-spec changes are relatively modest.`
  };
}

export function generationTransition(fromModelId: string, toModelId: string): GenerationTransition | null {
  const from = getModelById(fromModelId);
  const to = getModelById(toModelId);
  if (!from || !to) return null;
  const curated = curatedTransitions.find(item => item.fromModelId === fromModelId && item.toModelId === toModelId);
  return {
    id: `${fromModelId}--${toModelId}`,
    from,
    to,
    summary: curated?.summary || `Compare the recorded specifications and market context for ${from.make} ${from.model} and ${to.model}.`,
    notes: curated?.notes || [],
    measurable: measurableDeltas(from,to),
    upgrade: curated?.upgrade || genericUpgrade(from,to),
    curated: Boolean(curated)
  };
}

export function generationTransitionsForIds(generationIds: string[]) {
  const ordered = [...generationIds].reverse();
  const transitions: GenerationTransition[] = [];
  for (let index=0; index<ordered.length-1; index+=1) {
    const transition = generationTransition(ordered[index],ordered[index+1]);
    if (transition) transitions.push(transition);
  }
  return transitions;
}

export function latestGenerationTransition(generationIds: string[]) {
  const transitions = generationTransitionsForIds(generationIds);
  return transitions[transitions.length-1];
}
