export type MaintenanceSeoSource = {
  label: string;
  publisher: string;
  url: string;
  checkedAt: string;
};

export type MaintenanceSeoFaq = { question: string; answer: string };
export type MaintenanceSeoSection = { heading: string; body: string; bullets?: string[] };

export type MaintenanceSeoTopic = {
  slug: string;
  title: string;
  description: string;
  lastChecked: string;
  volume: number;
  primaryKeyword: string;
  sections: MaintenanceSeoSection[];
  faqs: MaintenanceSeoFaq[];
  sources: MaintenanceSeoSource[];
};

const checked = "2026-08-26";

const hondaPlanner: MaintenanceSeoSource = {
  label: "Honda Philippines Maintenance Planner",
  publisher: "Honda Philippines",
  url: "https://www.hondaph.com/service-calculator",
  checkedAt: checked,
};

const yamahaAfterSales: MaintenanceSeoSource = {
  label: "Yamaha Philippines After Sales and maintenance parts",
  publisher: "Yamaha Motor Philippines",
  url: "https://aftersales.yamaha-motor.com.ph/",
  checkedAt: checked,
};

const suzukiAfterSales: MaintenanceSeoSource = {
  label: "Suzuki Philippines After Sales, oils, coolant and genuine parts",
  publisher: "Suzuki Philippines",
  url: "https://mc.suzuki.com.ph/after-sales/",
  checkedAt: checked,
};

export const maintenanceSeoTopics: MaintenanceSeoTopic[] = [
  {
    slug: "parts-of-motorcycle",
    title: "Parts of a motorcycle: the basic systems every rider should know",
    description: "A practical guide to the main motorcycle parts and systems, what they do, and which items need model-specific maintenance or fitment checks.",
    lastChecked: checked,
    volume: 2400,
    primaryKeyword: "parts of motorcycle",
    sections: [
      {
        heading: "Controls and rider interface",
        body: "The handlebar area typically includes the throttle, front-brake control, switches, mirrors and—on manual motorcycles—the clutch lever. The exact control layout varies by model, so the owner's manual remains the final reference.",
        bullets: ["Throttle and switches", "Front brake lever", "Clutch lever where fitted", "Mirrors and instruments"],
      },
      {
        heading: "Engine, intake, exhaust and cooling",
        body: "The engine converts fuel into motion. Supporting systems can include the air cleaner, fuel injection or carburetion, exhaust, engine oil circuit and—on liquid-cooled motorcycles—a radiator and coolant circuit. Fluids and replacement parts are not universal between models.",
      },
      {
        heading: "Drivetrain: chain, sprockets or CVT",
        body: "Manual and many underbone motorcycles transfer power through a chain and sprockets. Automatic scooters commonly use a CVT with a V-belt and pulleys. These systems require different inspection and replacement procedures.",
      },
      {
        heading: "Chassis, suspension, wheels and brakes",
        body: "The frame, fork, rear suspension, wheels, tires and brakes control how the motorcycle supports load, changes direction and stops. Tire size, pressure, brake parts and torque values should be checked against the exact model and year.",
      },
      {
        heading: "Electrical and service items",
        body: "The battery, charging system, lights, fuses, spark plug and sensors support starting, ignition and electrical functions. Manufacturers treat many of these as inspection or replacement items during periodic maintenance.",
      },
    ],
    faqs: [
      { question: "What are the main parts of a motorcycle?", answer: "At a high level: controls, engine and fuel system, drivetrain, frame and suspension, wheels and brakes, electrical system, and bodywork. The exact components depend on whether the motorcycle is manual, underbone, scooter, air-cooled or liquid-cooled." },
      { question: "Are motorcycle parts interchangeable between models?", answer: "Do not assume so. Fitment, dimensions, electrical ratings, fluid specifications and mounting points can differ even within the same brand or model family." },
      { question: "Where should I check the correct replacement part?", answer: "Start with the owner's manual, the manufacturer's parts catalogue or an authorized service/parts source for the exact model and year." },
    ],
    sources: [hondaPlanner, yamahaAfterSales, suzukiAfterSales],
  },
  {
    slug: "motorcycle-battery",
    title: "Motorcycle battery guide: fitment, warning signs and replacement checks",
    description: "How to check a motorcycle battery safely, what to verify before replacement, and why battery fitment must match the exact motorcycle model.",
    lastChecked: checked,
    volume: 1200,
    primaryKeyword: "motorcycle battery",
    sections: [
      { heading: "Match the exact battery specification", body: "Battery size, terminal position, voltage, capacity and battery type must match the motorcycle's specification. A physically similar battery is not automatically a correct substitute." },
      { heading: "Watch for starting and charging symptoms", body: "Slow cranking, repeated no-start events, dimming during start or a battery that will not hold charge can point to a battery or charging-system issue. Diagnose the system rather than replacing parts by guesswork." },
      { heading: "Storage and charging matter", body: "Long periods without riding can discharge a battery. Manufacturer guidance commonly recommends periodic charging during storage and checking terminals for cleanliness and corrosion." },
      { heading: "Treat lifespan claims as model and use dependent", body: "Heat, storage, short trips, accessories and charging-system condition affect battery life. Use the motorcycle's maintenance guidance instead of treating one lifespan number as universal." },
    ],
    faqs: [
      { question: "Can I use any 12V battery on a motorcycle?", answer: "No. Voltage is only one requirement. Physical size, terminal orientation, capacity and the manufacturer's specification still need to match the motorcycle." },
      { question: "How do I know if my motorcycle battery needs replacement?", answer: "Repeated starting weakness or failure to retain charge deserves a battery and charging-system check. Confirm the diagnosis before replacing the battery." },
      { question: "Should a stored motorcycle battery be charged?", answer: "Manufacturer manuals commonly recommend periodic charging during storage. Follow the battery and motorcycle manufacturer's charging instructions." },
    ],
    sources: [yamahaAfterSales, suzukiAfterSales],
  },
  {
    slug: "coolant-for-motorcycle",
    title: "Coolant for motorcycles: what to check before topping up or replacing it",
    description: "A Philippines-focused motorcycle coolant guide covering liquid-cooled bikes, correct specification checks, service intervals and common mistakes to avoid.",
    lastChecked: checked,
    volume: 900,
    primaryKeyword: "coolant for motorcycle",
    sections: [
      { heading: "First confirm that the motorcycle is liquid-cooled", body: "Not every motorcycle uses radiator coolant. Air-cooled models do not have the same coolant service requirement, while liquid-cooled models use a specified coolant circuit." },
      { heading: "Use the specification in the exact owner's manual", body: "Coolant chemistry and mixing instructions can vary. Do not choose coolant only by color or by a generic 'motorcycle' label; check the manufacturer's specification first." },
      { heading: "Do not open a hot cooling system", body: "Cooling systems can be pressurized when hot. Follow the owner's manual procedure and let the motorcycle cool before inspecting a radiator cap or pressurized reservoir system." },
      { heading: "Replacement intervals are model specific", body: "Some manufacturers publish time- or mileage-based replacement intervals. MotoIndex only shows an exact interval on a model page when it has been transcribed from a source for that motorcycle." },
    ],
    faqs: [
      { question: "Can I put car coolant in a motorcycle?", answer: "Do not assume compatibility. Use coolant that meets the exact specification in the motorcycle owner's manual or manufacturer service information." },
      { question: "Can I mix different motorcycle coolants?", answer: "Mixing incompatible coolant types can create problems. If the existing coolant specification is unknown, follow the manufacturer's service procedure rather than guessing by color." },
      { question: "How often should motorcycle coolant be changed?", answer: "There is no universal interval. Follow the exact model's owner manual or official maintenance planner." },
    ],
    sources: [hondaPlanner, yamahaAfterSales, suzukiAfterSales],
  },
  {
    slug: "sprocket-motorcycle",
    title: "Motorcycle sprockets: wear, chain matching and replacement basics",
    description: "What motorcycle sprockets do, how they work with the drive chain, what wear can look like, and why gearing changes need model-specific checks.",
    lastChecked: checked,
    volume: 800,
    primaryKeyword: "sprocket motorcycle",
    sections: [
      { heading: "Sprockets and the drive chain work as one system", body: "On chain-driven motorcycles, the front and rear sprockets transfer engine power through the drive chain. Wear in one component can accelerate wear in the others." },
      { heading: "Inspect condition, tension and lubrication together", body: "The owner's manual normally defines chain slack, adjustment points and inspection guidance. Excessive wear, damaged teeth, stiff links or repeated adjustment can justify a closer service inspection." },
      { heading: "Replacement sizing affects gearing", body: "Changing sprocket tooth counts changes final-drive gearing and can alter acceleration, engine speed and speedometer behavior on some motorcycles. Stock sizing is the safest baseline unless a qualified source confirms the change." },
      { heading: "Use model-correct parts", body: "Pitch, tooth count, mounting pattern, alignment and chain specification must be compatible. Do not buy a sprocket from diameter or appearance alone." },
    ],
    faqs: [
      { question: "Should motorcycle chain and sprockets be replaced together?", answer: "They wear as a system. Whether all components need replacement depends on condition and manufacturer guidance, but fitting a new component against badly worn mating parts can shorten service life." },
      { question: "Does a bigger rear sprocket make a motorcycle faster?", answer: "A larger rear sprocket usually shortens gearing rather than increasing top speed. It can increase engine rpm at a given road speed. Any gearing change should be evaluated for the exact motorcycle." },
      { question: "How do I know the correct sprocket size?", answer: "Use the owner's manual, parts catalogue or manufacturer/dealer specification for the exact model and year." },
    ],
    sources: [yamahaAfterSales, suzukiAfterSales],
  },
  {
    slug: "change-oil-motorcycle",
    title: "Motorcycle change oil guide: interval, oil type and checks before service",
    description: "A practical motorcycle oil-change guide for Philippine riders, with model-specific interval warnings and official manufacturer maintenance resources.",
    lastChecked: checked,
    volume: 700,
    primaryKeyword: "change oil motorcycle",
    sections: [
      { heading: "There is no single oil-change interval for every motorcycle", body: "Oil-change timing varies by motorcycle, engine, oil system and manufacturer schedule. Use the exact owner's manual or maintenance planner for the model and year." },
      { heading: "Oil grade and specification matter", body: "Viscosity is only part of the requirement. The owner manual can also specify oil performance standards, wet-clutch compatibility where applicable, and the correct fill quantity." },
      { heading: "Do not confuse engine oil with gear or final-drive oil", body: "Automatic scooters can have separate engine-oil and final-drive or gear-oil service items. Treat them as separate fluids unless the manufacturer says otherwise." },
      { heading: "Record the service", body: "Keep the date, odometer reading, oil specification and any filter or washer replaced. A simple service record makes the next interval easier to verify and helps when selling the motorcycle." },
    ],
    faqs: [
      { question: "How many kilometers before changing motorcycle oil?", answer: "It depends on the exact motorcycle. Manufacturer schedules differ, so use the owner's manual or official maintenance planner rather than a universal kilometer rule." },
      { question: "Can I use car engine oil in a motorcycle?", answer: "Only if it meets the motorcycle manufacturer's required specification. Some motorcycles use a wet clutch and specify motorcycle-specific friction characteristics." },
      { question: "Does a scooter need gear oil too?", answer: "Many scooters have a separate final-drive or gear-oil service item, but the interval and fluid specification must come from the exact model's manual." },
    ],
    sources: [hondaPlanner, yamahaAfterSales, suzukiAfterSales],
  },
  {
    slug: "cvt-motorcycle",
    title: "Motorcycle CVT guide: V-belt, rollers and scooter maintenance basics",
    description: "How a scooter CVT works, what the V-belt does, why inspection intervals are model specific, and what to verify before buying replacement parts.",
    lastChecked: checked,
    volume: 500,
    primaryKeyword: "cvt motorcycle",
    sections: [
      { heading: "CVT is common on automatic scooters", body: "A continuously variable transmission uses pulleys and a V-belt to vary the effective drive ratio without manual gear shifts. The exact layout and service parts vary by model." },
      { heading: "The V-belt is a scheduled wear item", body: "Manufacturers publish inspection and replacement guidance for the belt and related transmission parts. Use the exact motorcycle schedule rather than a generic replacement mileage." },
      { heading: "Rollers, clutch and pulleys should be inspected as a system", body: "Acceleration changes, abnormal noise or vibration can have several causes. A service inspection can distinguish belt wear from roller, clutch, bearing or engine problems." },
      { heading: "Avoid unverified fitment", body: "CVT belts and rollers can look similar while differing in dimensions, weight and material. Match the exact part number or manufacturer-approved specification for the model." },
    ],
    faqs: [
      { question: "What does CVT mean on a motorcycle?", answer: "CVT means continuously variable transmission. On scooters it automatically changes drive ratio through a belt-and-pulley system instead of manual gear selection." },
      { question: "When should a scooter V-belt be replaced?", answer: "Use the exact model's maintenance schedule. Belt replacement intervals are not universal across scooter models." },
      { question: "Can changing roller weights affect performance?", answer: "Yes. Roller weight changes CVT behavior and can affect acceleration and engine rpm. Use stock specification unless a qualified source supports the change for the exact model." },
    ],
    sources: [yamahaAfterSales, hondaPlanner],
  },
  {
    slug: "motorcycle-oil",
    title: "Motorcycle oil guide: viscosity, specifications and model matching",
    description: "How to choose motorcycle engine oil by the exact owner's-manual specification instead of brand, price or viscosity alone.",
    lastChecked: checked,
    volume: 450,
    primaryKeyword: "motorcycle oil",
    sections: [
      { heading: "Start with the owner's-manual oil specification", body: "The required viscosity range, performance standard and oil quantity can vary by engine and market. Match those requirements before comparing brands or prices." },
      { heading: "Wet-clutch and scooter requirements can differ", body: "Some motorcycles share engine oil with a wet clutch, while many scooters use engine oil separately from the final drive. Do not assume one oil specification fits both systems." },
      { heading: "More expensive does not mean more correct", body: "A premium oil that does not meet the required specification is not a better choice for that motorcycle. Correct specification and service interval come first." },
      { heading: "Use verified sources when shopping", body: "Manufacturer parts and after-sales portals can help confirm genuine oil lines and model guidance. Be cautious with listings that do not clearly show specification, packaging source or seller identity." },
    ],
    faqs: [
      { question: "What is the best oil for a motorcycle?", answer: "The best starting point is the oil specification required by the exact motorcycle's owner manual. Brand preference comes after viscosity and performance requirements are matched." },
      { question: "Is 10W-40 good for every motorcycle?", answer: "No. 10W-40 is common, but not universal. Check the viscosity range and performance standard specified for the exact motorcycle." },
      { question: "Can scooter engine oil and gear oil be the same?", answer: "Do not assume so. Many scooters specify separate engine and final-drive oils. Follow the model's manual for each fluid." },
    ],
    sources: [yamahaAfterSales, suzukiAfterSales, hondaPlanner],
  },
];

export function getMaintenanceSeoTopic(slug: string) {
  return maintenanceSeoTopics.find((topic) => topic.slug === slug);
}
