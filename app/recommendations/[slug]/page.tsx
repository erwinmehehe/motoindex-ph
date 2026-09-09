import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { comparisons, getRecommendationGuide, getRecommendationModels, recommendationGuides, isIndexableRecommendation } from "@/lib/data";
import { GuideModelAnalysisCard } from "@/components/GuideModelAnalysisCard";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { pageMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { observedMarketPriceLabel, observedMarketRange, priceChecksForModel } from "@/lib/marketChecks";
import type { Motorcycle, RecommendationGuide, RecommendationQuickPickMetric, RecommendationTableColumn } from "@/lib/types";
import { evaluateMotorcycle } from "@/lib/decisionEngine";
import { GuideOwnershipCost } from "@/components/GuideOwnershipCost";
import { JsonLd } from "@/components/JsonLd";
import { RELEASE_DATE, absoluteUrl } from "@/lib/site";
import { articleSchema } from "@/lib/articleSchema";
import { AuthorBox } from "@/components/AuthorBox";

export function generateStaticParams(){return recommendationGuides.map(g=>({slug:g.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  const guide=getRecommendationGuide(slug);
  return guide?pageMetadata({title:guide.seoTitle||guide.title,description:guide.description,path:`/recommendations/${guide.slug}`,index:isIndexableRecommendation(slug)}):{};
}

const hasAbs=(m:Motorcycle)=>/\bABS\b/i.test(m.abs)&&!/^No ABS/i.test(m.abs);
const theoryRange=(m:Motorcycle)=>m.fuelConsumptionKmL?Math.round(m.fuelConsumptionKmL*m.fuelTankL):undefined;
const val=(n:number|undefined,suffix:string)=>typeof n==="number"?`${n.toLocaleString("en-PH")} ${suffix}`:"—";
const modelHref=(m:Motorcycle)=>`/motorcycles/${m.makeSlug}/${m.slug}`;

const label:Record<RecommendationTableColumn,string>={
  price:"Published price",engine:"Engine",transmission:"Transmission",weight:"Weight",seat:"Seat height",abs:"ABS configuration",economy:"Published km/L",tank:"Fuel tank",range:"Theoretical range",power:"Power",torque:"Torque",clearance:"Ground clearance",context:"Use context"
};

function contextLabel(m:Motorcycle){
  if(/business|utility/i.test(m.category))return "Utility / business";
  if(/underbone/i.test(m.category))return "Underbone / daily transport";
  if(/maxi/i.test(m.category))return "Maxi-scooter";
  if(/scooter/i.test(m.category))return "Automatic commuter";
  if(/adventure/i.test(m.category))return "Adventure-oriented";
  if(/sport/i.test(m.category))return "Sport-oriented";
  return m.category;
}

function cell(m:Motorcycle,key:RecommendationTableColumn){
  switch(key){
    case"price":return observedMarketPriceLabel(m);
    case"engine":return `${m.engineCc} cc`;
    case"power":return `${m.powerHp} hp`;
    case"torque":return `${m.torqueNm} Nm`;
    case"weight":return `${m.curbWeightKg} kg`;
    case"seat":return `${m.seatHeightMm} mm`;
    case"tank":return `${m.fuelTankL} L`;
    case"economy":return m.fuelConsumptionKmL?`${m.fuelConsumptionKmL} km/L`:"—";
    case"range":return val(theoryRange(m),"km theoretical");
    case"abs":return m.abs;
    case"transmission":return m.transmission||"—";
    case"clearance":return val(m.groundClearanceMm,"mm");
    case"context":return contextLabel(m);
  }
}

function metricModel(models:Motorcycle[],metric:RecommendationQuickPickMetric){
  if(!models.length)return undefined;
  if(metric==="price")return [...models].sort((a,b)=>observedMarketRange(a).from-observedMarketRange(b).from)[0];
  if(metric==="weight")return [...models].sort((a,b)=>a.curbWeightKg-b.curbWeightKg)[0];
  if(metric==="seat")return [...models].sort((a,b)=>a.seatHeightMm-b.seatHeightMm)[0];
  if(metric==="engine")return [...models].sort((a,b)=>b.engineCc-a.engineCc)[0];
  if(metric==="power")return [...models].sort((a,b)=>b.powerHp-a.powerHp)[0];
  if(metric==="tank")return [...models].sort((a,b)=>b.fuelTankL-a.fuelTankL)[0];
  if(metric==="economy")return [...models].filter(m=>m.fuelConsumptionKmL).sort((a,b)=>(b.fuelConsumptionKmL||0)-(a.fuelConsumptionKmL||0))[0];
  return [...models].filter(m=>theoryRange(m)).sort((a,b)=>(theoryRange(b)||0)-(theoryRange(a)||0))[0];
}

function quickPickDetail(m:Motorcycle,metric:RecommendationQuickPickMetric){
  if(metric==="price")return observedMarketPriceLabel(m);
  if(metric==="weight")return `${m.curbWeightKg} kg`;
  if(metric==="seat")return `${m.seatHeightMm} mm seat`;
  if(metric==="engine")return `${m.engineCc} cc`;
  if(metric==="power")return `${m.powerHp} hp`;
  if(metric==="tank")return `${m.fuelTankL} L tank`;
  if(metric==="economy")return `${m.fuelConsumptionKmL} km/L published`;
  return `${theoryRange(m)} km theoretical range`;
}

function positionReason(guide:RecommendationGuide,m:Motorcycle,index:number){
  const pos=index+1;
  if(guide.slug==="fuel-efficient-motorcycles-philippines")return `Position ${pos} follows the page rule because its sourced published fuel-economy figure is ${m.fuelConsumptionKmL} km/L${pos===1?", the highest in the current qualifying set":""}.`;
  if(guide.slug==="best-motorcycles-for-short-riders")return `Seat order ${pos} is based on its ${m.seatHeightMm} mm published seat height, with curb weight used only when seat heights tie.`;
  if(guide.slug==="best-motorcycles-for-long-rides")return `Tank order ${pos} is based on its ${m.fuelTankL} L recorded fuel-tank capacity within the current touring-oriented set.`;
  if(guide.slug==="lightweight-motorcycles-philippines")return `Weight order ${pos} is based on its ${m.curbWeightKg} kg published curb weight, with seat height used as the tie-breaker.`;
  if(guide.slug==="best-motorcycles-for-daily-commute-philippines"){const score=evaluateMotorcycle(m,{useCase:"city",inseamIn:30,passenger:false,highway:false,expresswayClass:false,luggage:false,traffic:"heavy",dailyKm:20,downPaymentPct:20,termMonths:36,annualRatePct:12}).score;return `Position ${pos} follows the fixed city-commute decision profile; this model scores ${score}/100 on the stored fit, traffic, use and ownership-planning factors.`;}
  if(guide.slug==="beginner-friendly-motorcycles-philippines")return `Position ${pos} follows the stated beginner-starting method using published curb weight (${m.curbWeightKg} kg), seat height (${m.seatHeightMm} mm), recorded output (${m.powerHp} hp) and ABS context.`;
  if(guide.slug==="motorcycles-400cc-plus-philippines")return `Price order ${pos} is based on its published starting price at ${observedMarketPriceLabel(m)} within the current 400cc+ recorded-displacement set.`;
  return `${guide.orderLabel} ${pos}: ${observedMarketPriceLabel(m)}. This position follows the price order used for this guide.`;
}

function considerReason(guide:RecommendationGuide,m:Motorcycle){
  if(guide.slug==="fuel-efficient-motorcycles-philippines")return `published fuel economy is a priority and you want to compare its ${m.fuelConsumptionKmL} km/L figure with a ${m.fuelTankL} L tank.`;
  if(guide.slug==="best-motorcycles-for-short-riders")return `a lower published seat (${m.seatHeightMm} mm) and known curb weight (${m.curbWeightKg} kg) are useful starting points for an in-person fit check.`;
  if(guide.slug==="best-motorcycles-for-long-rides")return `tank capacity (${m.fuelTankL} L) and its ${contextLabel(m).toLowerCase()} classification match the measurable priorities you want to shortlist.`;
  if(guide.slug==="lightweight-motorcycles-philippines")return `low curb weight (${m.curbWeightKg} kg) is one of your main measurable priorities.`;
  if(guide.slug==="motorcycles-with-abs-philippines")return `you want a current record that explicitly lists ${m.abs} and you are comfortable checking the exact trim before purchase.`;
  if(guide.slug==="best-underbone-motorcycles-philippines")return `you want an underbone with ${m.engineCc} cc, ${m.powerHp} hp and ${m.curbWeightKg} kg of published curb weight at ${observedMarketPriceLabel(m)}.`;
  if(guide.slug==="best-scooters-philippines")return `its ${m.engineCc} cc engine, ${m.curbWeightKg} kg curb weight and ${m.seatHeightMm} mm seat fit the scooter trade-offs you want to compare.`;
  if(guide.slug==="best-motorcycles-for-daily-commute-philippines")return `the fixed commute profile rewards its combination of ${m.curbWeightKg} kg curb weight, ${m.transmission?.toLowerCase()||"recorded transmission"} and ${m.seatHeightMm} mm published seat${m.fuelConsumptionKmL?`, with ${m.fuelConsumptionKmL} km/L published fuel data`:""}.`;
  if(guide.slug==="beginner-friendly-motorcycles-philippines")return `you want a first-bike shortlist grounded in published weight (${m.curbWeightKg} kg), seat (${m.seatHeightMm} mm), output (${m.powerHp} hp) and braking equipment rather than engine size alone.`;
  if(guide.slug==="motorcycles-400cc-plus-philippines")return `you are researching the 400cc+ class and want to compare its ${m.engineCc} cc engine, ${m.curbWeightKg} kg curb weight, ${m.seatHeightMm} mm seat and ${observedMarketPriceLabel(m)} published starting price.`;
  return `its ${m.transmission?.toLowerCase()||"recorded"} configuration, ${m.engineCc} cc engine and ${observedMarketPriceLabel(m)} published price match your budget priorities.`;
}

function alternativeReason(guide:RecommendationGuide,m:Motorcycle,models:Motorcycle[]){
  const lowestPrice=metricModel(models,"price");
  const lightest=metricModel(models,"weight");
  const lowestSeat=metricModel(models,"seat");
  const bestEconomy=metricModel(models,"economy");
  const largestTank=metricModel(models,"tank");
  const highestPower=metricModel(models,"power");
  const alternatives:[Motorcycle|undefined,string][] = guide.slug==="fuel-efficient-motorcycles-philippines"
    ? [[largestTank,"a larger tank matters more than the highest published km/L"],[lowestPrice,"lower published price matters more"]]
    : guide.slug==="best-motorcycles-for-long-rides"
      ? [[bestEconomy,"a higher published km/L figure matters more"],[lowestPrice,"lower published price matters more"]]
      : guide.slug==="best-underbone-motorcycles-philippines"
        ? [[highestPower,"higher recorded power matters more"],[lowestPrice,"lower published price matters more"]]
        : guide.slug==="best-motorcycles-for-short-riders"
          ? [[lightest,"lower curb weight matters more"],[lowestPrice,"lower published price matters more"]]
          : [[lightest,"lower curb weight matters more"],[lowestSeat,"a lower published seat matters more"],[lowestPrice,"lower published price matters more"]];
  const choice=alternatives.find(([candidate])=>candidate&&candidate.id!==m.id);
  return choice&&choice[0]?`${choice[0].make} ${choice[0].model} is the clearer checked alternative when ${choice[1]}.`:`Compare the table for a model that better matches your next-highest measurable priority.`;
}

function comparisonFor(m:Motorcycle,models:Motorcycle[]){
  const ids=new Set(models.map(row=>row.id));
  const pair=comparisons.find(c=>(c.a===m.id&&ids.has(c.b))||(c.b===m.id&&ids.has(c.a)));
  if(!pair)return undefined;
  const otherId=pair.a===m.id?pair.b:pair.a;
  const other=models.find(row=>row.id===otherId);
  return other?{href:`/compare/${pair.slug}`,label:`Compare with ${other.make} ${other.model}`}:undefined;
}

function modelNames(models:Motorcycle[],max=4){return models.slice(0,max).map(m=>`${m.make} ${m.model}`).join(", ");}

function sectionSummary(title:string,models:Motorcycle[]){
  if(!models.length)return "No current motorcycles qualify for this section.";
  const lower=title.toLowerCase();
  const price=[...models].sort((a,b)=>observedMarketRange(a).from-observedMarketRange(b).from);
  const weight=[...models].sort((a,b)=>a.curbWeightKg-b.curbWeightKg);
  const seat=[...models].sort((a,b)=>a.seatHeightMm-b.seatHeightMm);
  const engine=[...models].sort((a,b)=>b.engineCc-a.engineCc);
  const power=[...models].sort((a,b)=>b.powerHp-a.powerHp);
  const tank=[...models].sort((a,b)=>b.fuelTankL-a.fuelTankL);
  const economy=models.filter(m=>m.fuelConsumptionKmL).sort((a,b)=>(b.fuelConsumptionKmL||0)-(a.fuelConsumptionKmL||0));
  const range=models.filter(m=>theoryRange(m)).sort((a,b)=>(theoryRange(b)||0)-(theoryRange(a)||0));
  const abs=models.filter(hasAbs);
  const automatic=models.filter(m=>m.transmission==="Automatic");
  const manual=models.filter(m=>m.transmission!=="Automatic");
  const scooters=models.filter(m=>/scooter/i.test(m.category));
  const underbones=models.filter(m=>/underbone/i.test(m.category));
  if(lower.includes("strong city-commute")){const ranked=[...models].sort((a,b)=>evaluateMotorcycle(b,{useCase:"city",inseamIn:30,passenger:false,highway:false,expresswayClass:false,luggage:false,traffic:"heavy",dailyKm:20,downPaymentPct:20,termMonths:36,annualRatePct:12}).score-evaluateMotorcycle(a,{useCase:"city",inseamIn:30,passenger:false,highway:false,expresswayClass:false,luggage:false,traffic:"heavy",dailyKm:20,downPaymentPct:20,termMonths:36,annualRatePct:12}).score);return `${modelNames(ranked,3)} lead the fixed city-commute profile in the current comparison. The profile rewards measurable fit, stop-go usability and ownership factors rather than a subjective road-test score.`;}
  if(lower.includes("stop-go traffic"))return automatic.length?`${automatic.length} automatic model${automatic.length===1?"":"s"} are in this set, including ${modelNames(automatic)}. Automatic transmission reduces clutch/shift workload, but weight, seat height, wheel size and actual traffic conditions still matter.`:"No current automatic model qualifies in this set.";
  if(lower.includes("daily use"))return `${weight[0].make} ${weight[0].model} is the lightest option here at ${weight[0].curbWeightKg} kg. Lower weight can help during parking and repeated low-speed stops, but it does not measure balance or handlebar width.`;
  if(lower.includes("commute score cannot"))return `The score cannot measure lane-filtering width, heat management, suspension comfort, dealer proximity, parts delays, rider skill or the exact traffic pattern on your route. Use it to shortlist, then test fit and verify ownership support.`;
  if(lower.includes("lower-weight starting"))return `${weight[0].make} ${weight[0].model} is the lightest starting point at ${weight[0].curbWeightKg} kg. The page still keeps seat height, power and braking context visible because low weight alone does not make a motorcycle beginner-safe.`;
  if(lower.includes("engine size alone"))return `Engine displacement is not a beginner-suitability score. Curb weight, seat height, throttle response, gearing, brakes, rider training and the roads you will use can matter more than the cc figure by itself.`;
  if(lower.includes("training matters"))return `A database shortlist cannot replace rider education. Practical training, emergency braking practice, low-speed control and a motorcycle you can confidently support at a stop should take priority over rank position.`;
  if(lower.includes("lowest-priced 400cc"))return `${price[0].make} ${price[0].model} has the lowest published starting price in the current 400cc+ set at ${observedMarketPriceLabel(price[0])}. This is a price distinction only, not a declaration of legal tollway access or overall value.`;
  if(lower.includes("lighter 400cc"))return `${weight[0].make} ${weight[0].model} is the lightest checked 400cc+ model here at ${weight[0].curbWeightKg} kg. Compare seat height, output and intended road use before treating low weight as an automatic advantage.`;
  if(lower.includes("expressway planning"))return `Treat 400cc+ as a research filter only. Before buying for tollway use, verify current rules, the exact unit's OR/CR classification and displacement entry, and any route-specific restrictions.`;
  if(lower.includes("cheapest")||lower.includes("affordable"))return `${price[0].make} ${price[0].model} starts the comparison at ${observedMarketPriceLabel(price[0])}. Other low-price entries include ${modelNames(price.slice(1),3)||"no additional checked models"}. Separate utility/business motorcycles from scooters and underbones when the intended use differs.`;
  if(lower.includes("lightest")||lower.includes("lightweight"))return `${weight[0].make} ${weight[0].model} is the lightest checked model here at ${weight[0].curbWeightKg} kg. Lower weight can help at parking and low speeds, but it does not settle rider fit by itself.`;
  if(lower.includes("lower seat")||lower.includes("lowest published seat")||lower.includes("low seat"))return `${seat[0].make} ${seat[0].model} has the lowest published seat in this set at ${seat[0].seatHeightMm} mm. Seat width, suspension sag and rider proportions still affect actual ground reach.`;
  if(lower.includes("largest engine")||lower.includes("largest-engine"))return `${engine[0].make} ${engine[0].model} has the largest recorded displacement in this set at ${engine[0].engineCc} cc. That is an engine-size distinction, not an overall quality score.`;
  if(lower.includes("powerful")||lower.includes("most powerful"))return `${power[0].make} ${power[0].model} has the highest recorded output here at ${power[0].powerHp} hp. Compare curb weight and intended use alongside peak output.`;
  if(lower.includes("fuel-efficient")||lower.includes("fuel economy")||lower.includes("published fuel-economy")||lower.includes("published km/l"))return economy.length?`${economy[0].make} ${economy[0].model} has the highest published figure in this set at ${economy[0].fuelConsumptionKmL} km/L. Test methods can differ, so this is a sourced reference rather than a controlled real-world ranking.`:"No current model in this section has a checked published fuel-economy figure.";
  if(lower.includes("largest fuel tanks")||lower==="largest fuel tanks")return `${tank[0].make} ${tank[0].model} has the largest recorded tank in this set at ${tank[0].fuelTankL} L. Tank capacity affects refueling frequency but does not determine comfort or real-world range on its own.`;
  if(lower.includes("theoretical fuel range")||lower.includes("estimated theoretical")||lower.includes("longest theoretical"))return range.length?`${range[0].make} ${range[0].model} produces the longest calculated figure here at about ${theoryRange(range[0])} km using published km/L × tank capacity. It is a theoretical calculation, not an expected road range.`:"There are not enough checked fuel-economy figures to calculate a theoretical-range leader for this set.";
  if(lower.includes("abs"))return abs.length?`${abs.length} checked model${abs.length===1?"":"s"} here list ABS on at least one current configuration: ${modelNames(abs)}${abs.length>4?" and others":""}. The exact ABS wording and trim still need to be checked on the model page.`:"No checked model in this set currently records ABS on a verified configuration.";
  if(lower.includes("automatic"))return `${automatic.length} checked model${automatic.length===1?"":"s"} use an automatic transmission${automatic.length?`: ${modelNames(automatic)}`:""}. Compare weight and seat height alongside transmission type for stop-and-go use.`;
  if(lower.includes("manual"))return `${manual.length} checked model${manual.length===1?"":"s"} in this set are not recorded as automatic${manual.length?`: ${modelNames(manual)}`:""}. Use the full table for engine, weight and equipment differences.`;
  if(lower.includes("scooter"))return scooters.length?`${scooters.length} scooter${scooters.length===1?"":"s"} qualify in this comparison: ${modelNames(scooters)}${scooters.length>4?" and others":""}. Compare price, engine, weight, seat height and equipment rather than assuming one scooter format suits everyone.`:"No current scooter qualifies for this section.";
  if(lower.includes("underbone"))return underbones.length?`${underbones.length} underbone${underbones.length===1?"":"s"} qualify here: ${modelNames(underbones)}${underbones.length>4?" and others":""}. The useful differences are price, output, weight, seat height, transmission and brakes.`:"No current underbone qualifies for this section.";
  if(lower.includes("what do you give up"))return `The records expose the trade-offs directly: ABS availability, engine size, transmission, tank capacity, curb weight and published fuel economy vary independently. A lower price does not imply the same compromise on every model.`;
  if(lower.includes("city commuting"))return `For city use, start with the measurable constraint that matters most to you: published price, curb weight, seat height, transmission or published fuel economy. Then use the individual model pages to verify dimensions, variants and current price sources.`;
  if(lower.includes("size changes"))return `Scooter size changes several measurable things at once: curb weight, seat height, engine class and tank capacity. Those fields affect how much motorcycle you are moving and how often you may refuel, but they do not establish handling or comfort by themselves.`;
  if(lower.includes("seat height isn't")||lower.includes("seat height isn’t"))return `Published seat height is only one fit measure. Seat width, suspension sag, rider inseam, footwear and weight distribution can materially change how easy the motorcycle is to support at a stop.`;
  if(lower.includes("physical fit checklist"))return `Before buying, check whether you can put one foot down confidently, lift the motorcycle from its side stand, push it backward, turn it at walking speed and comfortably reach the bars and controls.`;
  if(lower.includes("cannot determine")||lower.includes("comfort"))return `The current structured fields do not objectively measure seat comfort after hours of riding, wind buffeting, vibration, luggage usability, passenger comfort or suspension quality. Use this page to shortlist measurable candidates, then verify those factors in person or with credible ride testing.`;
  if(lower.includes("what changes"))return `Moving above ₱100K can change engine size, ABS availability, tank capacity, curb weight, power and equipment, but the exact trade-off is model-specific. The table is designed to show those published differences instead of assuming higher price always buys the same upgrade.`;
  if(lower.includes("fuel economy vs"))return `Published km/L and tank capacity answer different questions. A motorcycle with higher km/L can still have a shorter theoretical fuel range than one with a larger tank, so compare both rather than treating efficiency and refueling frequency as the same thing.`;
  if(lower.includes("real-world fuel")||lower.includes("affects real-world"))return `Traffic, load, throttle use, speed, tire pressure, terrain and maintenance can all change real-world fuel consumption. Published figures are useful reference points, not guarantees.`;
  if(lower.includes("lightweight does not"))return `Low curb weight does not necessarily mean a small engine, low seat or compact dimensions. Compare weight with engine displacement, seat height and the model's category before drawing a fit or performance conclusion.`;
  return `${modelNames(price,3)} show the main price and specification trade-offs in this section. Use the comparison table to narrow the shortlist, then open the model page for the exact variant and source.`;
}

function faqAnswer(question:string,models:Motorcycle[],guide:RecommendationGuide){
  const lower=question.toLowerCase();
  if(!models.length)return "No current models are available for this question.";
  const price=[...models].sort((a,b)=>observedMarketRange(a).from-observedMarketRange(b).from);
  const seat=[...models].sort((a,b)=>a.seatHeightMm-b.seatHeightMm);
  const weight=[...models].sort((a,b)=>a.curbWeightKg-b.curbWeightKg);
  const economy=models.filter(m=>m.fuelConsumptionKmL).sort((a,b)=>(b.fuelConsumptionKmL||0)-(a.fuelConsumptionKmL||0));
  const brandMatch=["honda","yamaha","suzuki","kawasaki"].find(brand=>lower.includes(brand));
  if(lower.startsWith("does ")&&lower.includes(" abs")){
    const named=models.find(m=>lower.includes(m.model.toLowerCase().replace(/\bv\d+\b/g,"").trim())||lower.includes(`${m.make} ${m.model}`.toLowerCase()));
    if(named)return `${named.make} ${named.model} is recorded as: ${named.abs}. ABS can vary by trim, so open its model page before assuming every configuration is identical.`;
  }
  if(brandMatch&&lower.includes("automatic")){
    const rows=models.filter(m=>m.make.toLowerCase()===brandMatch&&m.transmission==="Automatic");
    return rows.length?`${rows.length} checked ${rows.length===1?"model qualifies":"models qualify"}: ${modelNames(rows,6)}. Use the table for price, weight and seat-height differences.`:`No current ${brandMatch[0].toUpperCase()+brandMatch.slice(1)} automatic model qualifies in this checked guide set.`;
  }
  if(lower.includes("cheapest")||lower.includes("lowest observed"))return `${price[0].make} ${price[0].model} has the lowest published starting price in this guide at ${observedMarketPriceLabel(price[0])}. Check its model page for dated price sources and variant notes.`;
  if(lower.includes("lowest seat"))return `${seat[0].make} ${seat[0].model} has the lowest published seat height in this guide at ${seat[0].seatHeightMm} mm. Published seat height alone does not guarantee rider fit.`;
  if(lower.includes("lightest"))return `${weight[0].make} ${weight[0].model} is the lightest checked model in this guide at ${weight[0].curbWeightKg} kg.`;
  if(lower.includes("best published fuel")||lower.includes("highest published fuel"))return economy.length?`${economy[0].make} ${economy[0].model} has the highest sourced published figure in this set at ${economy[0].fuelConsumptionKmL} km/L. Different test methods can limit direct real-world comparability.`:"No qualifying model currently has a checked published fuel-economy figure.";
  if(lower.includes("how far")||lower.includes("theoretical fuel range"))return `Where both fields exist, theoretical range is calculated as published km/L × tank capacity. Use it for planning only, not as a real-world range estimate.`;
  if(lower.includes("how does motoindex rank motorcycles for daily commuting"))return `This guide applies the same commuting profile to every model: 30-inch inseam, heavy stop-go traffic, 20 km daily round trip and solo-first use. The score is a shortlist tool, not a road-test verdict.`;
  if(lower.includes("automatic motorcycle always better in traffic"))return `No. Automatic transmission can reduce clutch and shifting workload in stop-go traffic, but curb weight, seat height, heat, wheel size, controls, rider preference and the actual route also affect commuting suitability.`;
  if(lower.includes("lighter motorcycle make commuting easier"))return `Lower curb weight can help with parking, backing up and repeated low-speed stops, but it does not measure balance, steering lock, handlebar width or rider confidence. Treat weight as one factor.`;
  if(lower.includes("fuel-economy figures be used"))return `Use published km/L as a sourced planning reference, not a guarantee. Test method, traffic, load, throttle use, tire pressure and maintenance can materially change real-world fuel consumption.`;
  if(lower.includes("personalized finder"))return `Yes. This guide uses one fixed profile so the ordering is reproducible. The finder lets you change budget, inseam, traffic, passenger and luggage needs, road use and monthly ownership ceiling, which can produce a different shortlist.`;
  if(lower.includes("what makes a motorcycle beginner-friendly"))return `This guide uses curb weight, published seat height, power and ABS as starting factors. Training, controls familiarity, road conditions and an in-person fit check matter more than the list position.`;
  if(lower.includes("low seat always better for beginners"))return `No. A lower published seat can improve reach for some riders, but seat width, suspension sag, motorcycle weight and rider proportions change the real fit. The better choice is the motorcycle you can support and control confidently.`;
  if(lower.includes("lighter motorcycle easier to learn"))return `Often it can be easier to move and recover at low speed, but weight is not the whole learning curve. Control layout, throttle response, seat height, rider training and practice environment also matter.`;
  if(lower.includes("do beginners need abs"))return `ABS can be a valuable braking aid, but it is not a substitute for training or correct braking technique. Check the exact trim because ABS equipment can vary by variant.`;
  if(lower.includes("scooter or manual"))return `Neither transmission type is universally better for a beginner. Automatic scooters remove clutch and shift workload; manuals teach clutch and gear control. Physical fit, weight, training goals and intended roads should decide the shortlist.`;
  if(lower.includes("does 400cc automatically mean expressway legal"))return `No. This guide uses 400cc+ only as a recorded-displacement research filter. Confirm current tollway rules, the motorcycle's registration classification and the exact unit's documents before relying on it for expressway access.`;
  if(lower.includes("verify before buying for expressway"))return `Verify the current tollway rules, the exact motorcycle's OR/CR classification and displacement entry, dealer documentation and any route-specific restrictions. Do not assume legal access from a catalog displacement figure alone.`;
  if(lower.includes("abs"))return `${models.filter(hasAbs).length} current model${models.filter(hasAbs).length===1?"":"s"} in this guide list ABS on at least one configuration. Exact trim wording is shown in the comparison table and model pages.`;
  if(lower.includes("automatic"))return `${models.filter(m=>m.transmission==="Automatic").length} current model${models.filter(m=>m.transmission==="Automatic").length===1?"":"s"} in this guide are recorded as automatic.`;
  if(lower.includes("all variants")||lower.includes("every variant"))return `No. This guide qualifies a model using its published starting price, and equipment such as ABS can differ by trim. Always check the exact variant on the model page.`;
  if(lower.includes("dealer prices")||lower.includes("srp"))return `Not necessarily. This page keeps manufacturer, comparison-site and dealer prices separate and may show a published price range when sources disagree.`;
  if(lower.includes("single-channel")||lower.includes("dual-channel"))return `The recorded ABS wording can distinguish which wheel or channels are covered when the source provides that detail. Use the exact model/variant record rather than a generic ABS badge.`;
  if(lower.includes("seat height the same")||lower.includes("shorter riders"))return `No. Seat height is only one input. Seat width, suspension sag, inseam, footwear and motorcycle weight distribution also affect actual foot reach and low-speed confidence.`;
  if(lower.includes("lower weight always"))return `No. Lower curb weight can help with parking and low-speed movement, but seat height, seat width, balance and rider technique still matter.`;
  if(lower.includes("horsepower per 100"))return `Horsepower per 100 kg can help compare power-to-weight, but it is not the primary ordering factor on this page.`;
  return `Use the comparison table and the guide rules: ${guide.orderingRule} ${guide.tieBreakers.length?`Tie-breaker: ${guide.tieBreakers.join(", ")}.`:""}`;
}

function friendlyRule(rule:string){
  return rule
    .replace("Current, indexable Philippine-market motorcycle record","Current Philippine-market motorcycle")
    .replace(/Observed/g,"Published")
    .replace(/observed/g,"published");
}

function decisionCards(guide:RecommendationGuide,models:Motorcycle[]){
  const seen = new Set<string>();
  return guide.quickPicks.map(pick=>{
    const model=metricModel(models,pick.metric);
    if(!model || seen.has(model.id))return null;
    seen.add(model.id);
    const prompt=pick.metric==="price"?"If keeping the starting price down matters most":pick.metric==="weight"?"If lower curb weight matters most":pick.metric==="seat"?"If published seat height is your main fit filter":pick.metric==="economy"?"If published fuel economy is your priority":pick.metric==="tank"?"If tank capacity is your priority":pick.metric==="power"?"If recorded power matters most":pick.metric==="range"?"If theoretical fuel range is your planning priority":"If engine size is your priority";
    return {prompt,model,detail:quickPickDetail(model,pick.metric)};
  }).filter(Boolean).slice(0,4) as {prompt:string;model:Motorcycle;detail:string}[];
}

export default async function RecommendationPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const guide=getRecommendationGuide(slug);
  if(!guide)return notFound();
  const models=getRecommendationModels(slug);
  const specDates=models.map(m=>m.verifiedAt).filter(Boolean).sort();
  const priceDates=models.flatMap(m=>priceChecksForModel(m.id).map(row=>row.checkedAt)).sort();
  const lastSpecUpdated=specDates.at(-1);
  const lastPriceUpdated=priceDates.at(-1);
  const faqItems:FaqItem[]=guide.faqQuestions.map(question=>({question,answer:faqAnswer(question,models,guide)}));
  const related=guide.relatedGuideSlugs.map(relatedSlug=>recommendationGuides.find(g=>g.slug===relatedSlug)).filter((g):g is RecommendationGuide=>Boolean(g&&isIndexableRecommendation(g.slug)));
  const decisions=decisionCards(guide,models);
  const quickPicks = guide.quickPicks
    .map((pick)=>({pick,model:metricModel(models,pick.metric)}))
    .filter((item)=>Boolean(item.model)) as {pick:RecommendationGuide["quickPicks"][number];model:Motorcycle}[];
  const uniqueQuickPicks = quickPicks.filter((item,index,all)=>all.findIndex((other)=>other.model.id===item.model.id)===index);
  const editorialSummaries = guide.editorialSections
    .map((title)=>({title,summary:sectionSummary(title,models)}))
    .filter((item,index,all)=>all.findIndex((other)=>other.summary===item.summary)===index);
  // Article + ItemList for the buying guides. dateModified uses the newest source
  // check across the models in the guide, so it reflects a real verification date
  // rather than a build timestamp. keywords carries the page title alongside the
  // record's own primary/secondary keywords.
  const newestCheck = models
    .map(m => m.marketPriceCheckedAt || m.verifiedAt)
    .filter(Boolean)
    .sort()
    .at(-1) || RELEASE_DATE;
  const guideSchema = [
    articleSchema({
      headline: guide.title,
      description: guide.description,
      path: `/recommendations/${guide.slug}`,
      about: guide.primaryKeyword,
      keywords: [guide.title, guide.primaryKeyword, ...(guide.secondaryKeywords || [])],
      checkedDates: [...specDates, ...priceDates, newestCheck]
    }),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: guide.title,
      description: guide.orderingRule,
      numberOfItems: models.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: models.map((m, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${m.make} ${m.model}`,
        url: absoluteUrl(`/motorcycles/${m.makeSlug}/${m.slug}`)
      }))
    }
  ];

  return <section className="page shell">
    <Breadcrumbs items={[{label:"Buying guides",href:"/recommendations"},{label:guide.title}]} />
    <div className="page-head guide-page-head"><span className="guide-kicker">{guide.kicker}</span><h1>{guide.title}</h1></div>
    <div className="guide-direct-answer"><p>{guide.directAnswer}</p><strong>Compare {models.length} motorcycle{models.length===1?"":"s"} that match this guide.</strong></div>
    {!isIndexableRecommendation(slug)&&<div className="note-box"><h2>Some entries need a fresh check</h2><p>Open the individual model pages before buying to confirm the latest price and exact variant.</p></div>}

    <div className="guide-quick-picks">
      <div className="section-head compact"><div><h2>Quick picks</h2><p>Useful shortcuts based on the prices and specifications in this comparison.</p></div></div>
      <div className="guide-pick-grid">{uniqueQuickPicks.map(({pick,model:m})=><Link key={pick.label + "-" + m.id} href={modelHref(m)}><span>{pick.label}</span><strong>{m.make} {m.model}</strong><small>{quickPickDetail(m,pick.metric)}</small></Link>)}</div>
    </div>

    <div className="section-head compact"><div><h2>Full comparison table</h2><p>Compare price, engine, fit and equipment side by side. On smaller screens, swipe the table horizontally.</p></div></div>
    <div className="guide-table-wrap" role="region" aria-label={guide.title + " comparison table"} tabIndex={0}>
      <table className="guide-comparison-table guide-comparison-table-wide">
        <thead><tr><th scope="col">{guide.orderLabel}</th><th scope="col">Model</th>{guide.tableColumns.map(col=><th scope="col" key={col}>{label[col]}</th>)}<th scope="col" className="guide-why-col">Why it&apos;s here</th></tr></thead>
        <tbody>{models.map((m,index)=><tr key={m.id}><td className="guide-order-cell">{index+1}</td><th scope="row"><Link href={modelHref(m)}>{m.make} {m.model}</Link></th>{guide.tableColumns.map(col=><td key={col}>{cell(m,col)}</td>)}<td className="guide-why-cell">{positionReason(guide,m,index)}</td></tr>)}</tbody>
      </table>
    </div>

    <section className="method-card guide-method guide-method-detailed">
      <div><span>How this guide works</span><h2>What qualifies for this comparison</h2><p>{friendlyRule(guide.orderingRule)}</p></div>
      <div className="guide-method-grid">
        <div><strong>What qualifies</strong><ul>{guide.inclusionRules.map(rule=><li key={rule}>{friendlyRule(rule)}</li>)}</ul></div>
        <div><strong>If two models tie</strong><ul>{guide.tieBreakers.map(rule=><li key={rule}>{rule}</li>)}</ul></div>
        <div><strong>Prices and specs</strong><p>Prices and specifications come from the sources linked on each motorcycle page. Confirm the exact variant and current dealer quote before buying.</p></div>
        <div><strong>Latest checks</strong><p>Prices: {lastPriceUpdated||"see model pages"}<br/>Specifications: {lastSpecUpdated||"see model pages"}</p></div>
      </div>
    </section>

    <div className="section-head compact"><div><h2>Model-by-model breakdown</h2><p>See why each motorcycle appears here, who it suits, and the main tradeoff to consider.</p></div></div>
    <div className="guide-model-analysis-list">{models.map((m,index)=><GuideModelAnalysisCard key={m.id} model={m} orderLabel={guide.orderLabel} position={index+1} why={positionReason(guide,m,index)} consider={considerReason(guide,m)} alternative={alternativeReason(guide,m,models)} comparison={comparisonFor(m,models)}/>)}</div>

    {editorialSummaries.length>0&&<div className="guide-topic-grid">{editorialSummaries.map(({title,summary})=><article key={title}><h2>{title}</h2><p>{summary}</p></article>)}</div>}

    <section className="guide-decision-section">
      <div className="section-head compact"><div><h2>Which one should you choose?</h2><p>Start with the budget, fit or use-case factor that matters most, then check the exact variant.</p></div></div>
      <div className="guide-decision-grid">{decisions.map(({prompt,model,detail})=><article key={prompt + "-" + model.id}><span>{prompt}</span><h3>{model.make} {model.model}</h3><p>{detail}</p><Link href={modelHref(model)}>Check the model →</Link></article>)}</div>
    </section>

    <GuideOwnershipCost models={models} guideTitle={guide.title} />
    <div className="note-box guide-caveat"><h2>Before you buy</h2><ul>{guide.caveats.map(caveat=><li key={caveat}>{caveat}</li>)}</ul></div>
    <JsonLd data={guideSchema} />
    {faqItems.length>0&&<FaqSection title="Questions about this guide" items={faqItems}/>}
    <AuthorBox />

    {related.length>0&&<><div className="section-head compact"><div><h2>Related motorcycle guides</h2><p>Compare nearby budgets, categories and rider-fit options.</p></div></div><div className="guide-related-grid">{related.map(g=><Link key={g.slug} href={"/recommendations/" + g.slug}><strong>{g.title}</strong><small>{g.description}</small></Link>)}</div></>}
  </section>;
}
