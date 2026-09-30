import type { MarketPriceCheck, Motorcycle } from "./types";
import { phpRange } from "./utils";

const checkedAt = "2026-08-25";

export const marketPriceChecks: MarketPriceCheck[] = [
  // Manufacturer variant references anchor trim-aware pricing where a current primary-source record is available.
  { modelId:"honda-pcx-160", sourceName:"Honda Philippines", sourceType:"manufacturer", sourceUrl:"https://www.hondaph.com/motorcycle/news/filipino-urban-professionals-are-now-choosing-motorcycles-heres-why", priceFromPhp:133500, priceToPhp:155000, checkedAt:"2026-09-19", note:"Current 2026 Standard to RoadSync SRP range" },
  { modelId:"honda-click-125i", sourceName:"Honda Philippines", sourceType:"manufacturer", sourceUrl:"https://www.hondaph.com/motorcycle/list", priceFromPhp:83000, priceToPhp:87700, checkedAt:"2026-09-19", note:"Current Click125 Standard to Smart Edition SRP range" },
  { modelId:"honda-click-160", sourceName:"Honda Philippines", sourceType:"manufacturer", sourceUrl:"https://www.hondaph.com/motorcycle/news/ready-to-take-on-the-world-step-up-your-game-with-a-sportier-and-more-stylish-the-new-click160", priceFromPhp:116900, checkedAt:"2026-09-19", note:"Official Click160 published SRP" },
  { modelId:"suzuki-raider-r150", sourceName:"Suzuki Motorcycles Philippines", sourceType:"manufacturer", sourceUrl:"https://mc.suzuki.com.ph/motorcycles/underbone/raider-r150-blade/", priceFromPhp:130000, checkedAt:"2026-09-19", note:"Current official Philippine Raider R150 SRP" },

  { modelId:"suzuki-burgman-400", sourceName:"Suzuki Motorcycles Philippines", sourceType:"manufacturer", sourceUrl:"https://mc.suzuki.com.ph/motorcycles/big-bike/burgman-400/", priceFromPhp:566000, checkedAt:"2026-09-08", note:"Current official Philippine SRP" },
  { modelId:"honda-airblade-160", sourceName:"Honda Philippines", sourceType:"manufacturer", sourceUrl:"https://www.hondaph.com/motorcycle/news/step-up-your-cutting-edge-with-the-all-new-airblade160", priceFromPhp:125900, checkedAt:"2026-09-19", note:"Historical official 2022 Philippine launch SRP; not a current 2026 dealer quote and model remains uncertain" },
  { modelId:"yamaha-lexi-155", sourceName:"Yamaha Motor Philippines", sourceType:"manufacturer", sourceUrl:"https://www.yamaha-motor.com.ph/", priceFromPhp:99900, checkedAt:"2026-09-19", note:"Current Yamaha Philippines 2026 lineup price reference" },
  { modelId:"yamaha-lexi-155", sourceName:"Motortrade Philippines", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/yamaha-the-new-lexi/", priceFromPhp:99900, checkedAt:"2026-09-19", note:"Current detailed Lexi 155 dealer listing" },
  { modelId:"bmw-c-400-gt", sourceName:"BMW Motorrad Philippines", sourceType:"manufacturer", sourceUrl:"https://www.bmwmotorrad.com.ph/en/models/modeloverview.html", priceFromPhp:625000, checkedAt:"2026-09-08", note:"Current BMW Motorrad Philippines model-overview SRP" },
  { modelId:"bmw-g-310-r", sourceName:"BMW Motorrad Philippines", sourceType:"manufacturer", sourceUrl:"https://www.bmwmotorrad.com.ph/en/models/modeloverview.html", priceFromPhp:300000, checkedAt:"2026-09-08", note:"Current BMW Motorrad Philippines model-overview SRP" },
  { modelId:"bmw-r-1300-gs", sourceName:"BMW Motorrad Philippines", sourceType:"manufacturer", sourceUrl:"https://www.bmwmotorrad.com.ph/en/models/modeloverview.html", priceFromPhp:1675000, checkedAt:"2026-09-08", note:"Current BMW Motorrad Philippines model-overview SRP" },
  { modelId:"cfmoto-450nk", sourceName:"CFMOTO Philippines", sourceType:"manufacturer", sourceUrl:"https://www.cfmotoph.com/motorcycle/450nk", priceFromPhp:275900, checkedAt:"2026-09-08", note:"Current official Philippine SRP" },
  { modelId:"cfmoto-300nk", sourceName:"CFMOTO Philippines", sourceType:"manufacturer", sourceUrl:"https://www.cfmotoph.com/motorcycle/300nk", priceFromPhp:146900, checkedAt:"2026-09-19", note:"Current official Philippine SRP" },
  { modelId:"cfmoto-675sr-r", sourceName:"CFMOTO Philippines", sourceType:"manufacturer", sourceUrl:"https://www.cfmotoph.com/motorcycle/675sr", priceFromPhp:438900, checkedAt:"2026-09-08", note:"Current official Philippine SRP" },
  { modelId:"triumph-trident-660", sourceName:"Triumph Motorcycles Philippines", sourceType:"manufacturer", sourceUrl:"https://www.triumphmotorcycles.ph/bikes/previous-model-year/models/trident-660-2025", priceFromPhp:524000, checkedAt:"2026-09-08", note:"Official Philippine published price reference" },
  { modelId:"triumph-street-triple-765-rs", sourceName:"Triumph Motorcycles Philippines", sourceType:"manufacturer", sourceUrl:"https://www.triumphmotorcycles.ph/bikes/roadsters/street-triple/street-triple-765-rs", priceFromPhp:870000, checkedAt:"2026-09-08", note:"Current official Philippine SRP" },
  { modelId:"royal-enfield-guerrilla-450", sourceName:"Royal Enfield Philippines", sourceType:"manufacturer", sourceUrl:"https://www.royalenfield.com/ph/en/support/owners-manual/", priceFromPhp:289000, checkedAt:"2026-09-08", note:"Official Philippine support pricing reference" },
  { modelId:"royal-enfield-classic-350", sourceName:"Royal Enfield Philippines", sourceType:"manufacturer", sourceUrl:"https://www.royalenfield.com/ph/en/support/owners-manual/", priceFromPhp:230000, checkedAt:"2026-09-08", note:"Official Philippine support pricing reference" },
  { modelId:"vespa-gts-supersport-300", sourceName:"Vespa Philippines", sourceType:"manufacturer", sourceUrl:"https://www.vespa.com/ph_EN/models/gts/gts-supersport-300-hpe-2025/", priceFromPhp:375000, checkedAt:"2026-09-08", note:"Current official Philippine SRP" },
  { modelId:"vespa-gtv-300", sourceName:"Vespa Philippines", sourceType:"manufacturer", sourceUrl:"https://www.vespa.com/ph_EN/models/gtv/gtv-300-hpe-2025/", priceFromPhp:425000, checkedAt:"2026-09-08", note:"Current official Philippine SRP" },
  { modelId:"aprilia-rs-660", sourceName:"Aprilia Philippines", sourceType:"manufacturer", sourceUrl:"https://www.aprilia.com/ph_EN/models/rs-660/", priceFromPhp:660000, checkedAt:"2026-09-08", note:"Current official Philippine SRP" },

  { modelId:"yamaha-mio-gravis", sourceName:"Yamaha Motor Philippines", sourceType:"manufacturer", sourceUrl:"https://www.yamaha-motor.com.ph/motorcycles/personal-commuter/mio-series/mio-gravis", priceFromPhp:84900, checkedAt:"2026-09-19", note:"Current Yamaha Philippines product page; current official-site listing and dealer network show ₱84,900" },
  { modelId:"yamaha-mio-gravis", sourceName:"Motortrade Philippines", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/mio-gravis-b3u1/", priceFromPhp:84900, checkedAt:"2026-09-19", note:"Current dealer listing and specification cross-check" },
  { modelId:"yamaha-mio-i-125", sourceName:"Motortrade Philippines", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/yamaha-mio-i-125/", priceFromPhp:75900, checkedAt:"2026-09-19", note:"Current dealer listing; Yamaha Philippines still exposes the Mio i125 product and aftersales pages" },
  { modelId:"yamaha-tmax", sourceName:"Motortrade Philippines", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/yamaha-tmax-tech-max/", priceFromPhp:859000, checkedAt:"2026-09-19", note:"Current TMAX Tech Max listing; Yamaha Philippines currently exposes the 560-class TMAX product page" },

  { modelId:"yamaha-yzf-r1m", sourceName:"Motortrade Philippines", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/yamaha-yzf-r1/", priceFromPhp:1689000, checkedAt:"2026-09-19", note:"Current detailed Philippine dealer listing; Yamaha Philippines currently exposes the YZF-R1M product page" },
  { modelId:"yamaha-yzf-r1m", sourceName:"Motortrade Philippines category index", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycle-type/big-bike/page/3/", priceFromPhp:1799000, checkedAt:"2026-09-19", note:"Motortrade category index still surfaces ₱1,799,000, creating a live dealer-price disagreement that should be confirmed before purchase" },

  { modelId:"honda-crf300-rally", sourceName:"Honda Philippines", sourceType:"manufacturer", sourceUrl:"https://www.hondaph.com/motorcycle/news/honda-philippines-unleashes-power-and-innovation-at-the-action-packed-inside-racing-bikefest-2025", priceFromPhp:309900, checkedAt:"2026-09-19", note:"Honda Philippines 2025 CRF300 Rally price reference; CRF300 Rally is the current successor-generation target for CRF250 Rally search intent" },

  { modelId:"motorstar-cafe-400", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/motorstar/cafe-400/price", priceFromPhp:140000, checkedAt:"2026-09-19", note:"Current 2026 Philippine market listing; no model-level MotorStar manufacturer page was located in this verification pass" },
  { modelId:"motorstar-cafe-400", sourceName:"Carmudi Philippines", sourceType:"comparison-site", sourceUrl:"https://www.carmudi.com.ph/new-motorcycles/motorstar/cafe-400/price/pasig/", priceFromPhp:140000, checkedAt:"2026-09-19", note:"Independent current Philippine price cross-check" },
  { modelId:"kawasaki-z1000-r-edition", sourceName:"Kawasaki Leisure Bikes Philippines", sourceType:"manufacturer", sourceUrl:"https://www.kawasakileisurebikes.ph/motorcycles/sports/z100r/", priceFromPhp:710000, checkedAt:"2026-09-19", note:"Historical 2017 official Philippine MSRP; do not present as a current 2026 dealer quote" },
  { modelId:"vespa-gts-supersport-300", sourceName:"Vespa Philippines", sourceType:"manufacturer", sourceUrl:"https://www.vespa.com/ph_EN/models/gts/gts-supersport-300-hpe-2025/", priceFromPhp:375000, checkedAt:"2026-09-19", note:"Current Vespa Philippines recommended retail price" },
  { modelId:"vespa-gtv-300", sourceName:"Vespa Philippines", sourceType:"manufacturer", sourceUrl:"https://www.vespa.com/ph_EN/models/gtv/gtv-300-hpe-2025/", priceFromPhp:425000, checkedAt:"2026-09-19", note:"Current Vespa Philippines recommended retail price; official page notes accessories are included" },
  { modelId:"vespa-primavera-150", sourceName:"Carmudi Philippines", sourceType:"comparison-site", sourceUrl:"https://www.carmudi.com.ph/new-motorcycles/vespa/primavera/price/pasig/", priceFromPhp:210000, priceToPhp:235000, checkedAt:"2026-09-19", note:"Current Philippine Primavera price range; technical specification now anchored to Vespa official product data" },
  { modelId:"vespa-sprint-150", sourceName:"Carmudi Philippines", sourceType:"comparison-site", sourceUrl:"https://www.carmudi.com.ph/new-motorcycles/vespa/sprint/specifications/", priceFromPhp:230000, priceToPhp:275000, checkedAt:"2026-09-19", note:"Current Philippine Sprint price/specification reference; technical specification now anchored to Vespa official product data" },

  // Philippine comparison site competitor/reference pages.
  { modelId:"yamaha-yzf-r3", sourceName:"Motortrade Philippines", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/yamaha-yzf-r3/", priceFromPhp:299000, checkedAt:"2026-09-19", note:"Current detailed YZF-R3 dealer listing; older archive indexes may still show ₱294,000" },
  { modelId:"yamaha-aerox-v3", sourceName:"Philippine comparison site", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/yamaha/mio-aerox/price", priceFromPhp:125900, priceToPhp:163900, checkedAt, note:"Standard to SP variant range" },
  { modelId:"yamaha-nmax-v3", sourceName:"Philippine comparison site", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/yamaha/nmax", priceFromPhp:155900, priceToPhp:175900, checkedAt, note:"Standard to Tech Max variant range" },
  { modelId:"honda-adv-160", sourceName:"Philippine comparison site", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/honda/adv-160", priceFromPhp:166900, checkedAt, note:"Generic comparison-site figure is below the current 2026 Honda ABS/RoadSync SRPs; disagreement retained for transparency" },
  { modelId:"honda-click-160", sourceName:"Philippine comparison site", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/honda/click-160", priceFromPhp:116900, checkedAt },
  { modelId:"honda-pcx-160", sourceName:"Philippine comparison site", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/honda/pcx160", priceFromPhp:133400, priceToPhp:154900, checkedAt, note:"Standard to RoadSync range" },
  { modelId:"yamaha-fazzio", sourceName:"Motortrade Philippines", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/yamaha-new-mio-fazzio/", priceFromPhp:93900, checkedAt:"2026-09-19", note:"Current New Mio Fazzio BRV5 dealer listing" },
  { modelId:"yamaha-mio-gear", sourceName:"Motortrade Philippines", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/yamaha-mio-gear/", priceFromPhp:79400, checkedAt:"2026-09-30", note:"Current direct dealer listing" },
  { modelId:"suzuki-burgman-street-ex", sourceName:"Suzuki Motorcycles Philippines", sourceType:"manufacturer", sourceUrl:"https://mc.suzuki.com.ph/motorcycles/scooter/burgman-street-125-ex/", priceFromPhp:93400, checkedAt:"2026-09-30", note:"Current official Philippine SRP" },
  { modelId:"suzuki-burgman-street-ex", sourceName:"Motortrade Philippines", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/suzuki-burgman-street-125-ex/", priceFromPhp:93400, checkedAt:"2026-09-30", note:"Current direct dealer listing" },
  { modelId:"yamaha-sniper-155", sourceName:"Motortrade Philippines", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/page/8/?motorcycle-type=regular-bike%2F", priceFromPhp:125900, priceToPhp:145900, checkedAt:"2026-09-30", note:"Current Sniper155 to Sniper155R dealer observations" },
  { modelId:"kawasaki-barako-ii", sourceName:"Kawasaki Philippines", sourceType:"manufacturer", sourceUrl:"https://www.kawasaki.ph/motorcycles/show/32", priceFromPhp:91500, priceToPhp:95500, checkedAt:"2026-09-30", note:"Current official Kick to Electric model range" },
  { modelId:"honda-winner-x", sourceName:"Honda Philippines", sourceType:"manufacturer", sourceUrl:"https://www.hondaph.com/motorcycle/promotions/winner-x-prime-rainy-deals", priceFromPhp:123900, priceToPhp:131900, checkedAt:"2026-09-30", note:"Current 2026 nationwide promo confirms the active model; official published variant SRPs retained" },
  { modelId:"honda-wave-rsx", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/honda/wave-rsx/price", priceFromPhp:62900, priceToPhp:64900, checkedAt:"2026-09-30", note:"Current 2026 Drum to Disc price range" },
  { modelId:"honda-tmx125-alpha", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/motorcycles/tmx125-alpha/", priceFromPhp:56900, checkedAt:"2026-09-30", note:"Current indicative dealer price" },
  { modelId:"yamaha-ytx-125", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/yamaha/ytx-125/price", priceFromPhp:57900, checkedAt:"2026-09-30", note:"Current 2026 price listing" },
  { modelId:"honda-cb150x", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/honda/cb150x/price", priceFromPhp:173900, checkedAt:"2026-09-30", note:"Current 2026 Philippine price listing" },
  { modelId:"yamaha-xsr155", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/yamaha/xsr155/price", priceFromPhp:182000, checkedAt:"2026-09-30", note:"Current 2026 Philippine price listing" },

  // Philippine dealer network dealer listings used as a second live-market cross-check where a matching current model/trim was found.
  { modelId:"yamaha-aerox-v3", sourceName:"Motortrade Philippines", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/yamaha-new-aerox/", priceFromPhp:125900, checkedAt:"2026-09-19", note:"Current New Aerox base listing" },
  { modelId:"yamaha-aerox-v3", sourceName:"Motortrade Philippines", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/yamaha-aerox-sp/", priceFromPhp:163900, checkedAt:"2026-09-19", note:"Current Aerox SP listing" },
  { modelId:"yamaha-nmax-v3", sourceName:"Motortrade Philippines", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/yamaha-new-nmax/", priceFromPhp:155900, checkedAt:"2026-09-19", note:"Current New NMAX base listing" },
  { modelId:"yamaha-nmax-v3", sourceName:"Motortrade Philippines", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/yamaha-nmax-techmax/", priceFromPhp:178400, checkedAt:"2026-09-19", note:"Current NMAX Techmax listing" },
  { modelId:"honda-adv-160", sourceName:"Philippine dealer network", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/honda-adv160-roadsync-type/", priceFromPhp:176000, checkedAt, note:"RoadSync indicative dealer listing; page also quotes Honda suggested prices for ABS/RoadSync" },
  { modelId:"honda-click-160", sourceName:"Motortrade Philippines", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/honda-click-160/", priceFromPhp:116900, checkedAt:"2026-09-19" },
  { modelId:"honda-pcx-160", sourceName:"Philippine dealer network", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycle-category/automatic/", priceFromPhp:133400, priceToPhp:154900, checkedAt, note:"CBS to ABS listings" },
  { modelId:"yamaha-fazzio", sourceName:"Philippine dealer network", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/page/8/?motorcycle-type=regular-bike%2F", priceFromPhp:92900, checkedAt },
  { modelId:"honda-click-125i", sourceName:"Philippine dealer network", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/vehicle-promo-blue-tag/", priceFromPhp:81900, checkedAt },
  { modelId:"yamaha-mio-gear", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/motorcycles/mio-gear/", priceFromPhp:81900, priceToPhp:86900, checkedAt:"2026-09-30", note:"Current Mio Gear to Mio Gear S indicative dealer range" },







  // Wheeltek: independent third live-market/dealer source. Prices are indicative branch observations, not manufacturer truth.
  { modelId:"honda-giorno-plus", sourceName:"Honda Philippines", sourceType:"manufacturer", sourceUrl:"https://www.hondaph.com/motorcycle/news/modern-classic-is-the-new-street-style", priceFromPhp:102900, checkedAt:"2026-09-30", note:"Current official Philippine SRP for the updated colorways" },
  { modelId:"honda-xrm125", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/motorcycles/xrm125-ds/", priceFromPhp:71900, priceToPhp:76900, checkedAt:"2026-09-30", note:"Current DS to Motard model-family range; MotoIndex does not create trim pages" },
  { modelId:"honda-tmx-supremo", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/motorcycles/tmx-supremo/", priceFromPhp:78900, checkedAt:"2026-09-30", note:"Current indicative dealer price" },
  { modelId:"yamaha-pg-1", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/vehicles/pg-1/", priceFromPhp:96400, checkedAt:"2026-09-30", note:"Current indicative dealer price" },
  { modelId:"yamaha-wr155r", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/motorcycles/wr-155r/", priceFromPhp:180900, checkedAt:"2026-09-30", note:"Current indicative dealer price" },
  { modelId:"yamaha-xmax", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/motorcycles/xmax/", priceFromPhp:311000, checkedAt:"2026-09-30", note:"Current indicative dealer price" },
  { modelId:"yamaha-xmax", sourceName:"Motortrade Philippines", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/page/8/?motorcycle-type=regular-bike%2F", priceFromPhp:311000, checkedAt:"2026-09-30", note:"Current dealer listing" },
  { modelId:"honda-adv-160", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/motorcycles/adv160/", priceFromPhp:166900, checkedAt, note:"Generic dealer page appears below the 2026 Honda ABS/RoadSync suggested-retail range; retained as an observed disagreement" },
  { modelId:"yamaha-fazzio", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/motorcycles/mio-fazzio/", priceFromPhp:92400, priceToPhp:95400, checkedAt, note:"Current Wheeltek observations differ by connectivity configuration; kept as one MotoIndex model page" },
  { modelId:"yamaha-ytx-125", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/motorcycles/ytx-125/", priceFromPhp:57900, checkedAt:"2026-09-30", note:"Current indicative dealer price" },
  { modelId:"yamaha-xsr155", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/motorcycles/xsr-155/", priceFromPhp:184500, checkedAt:"2026-09-30", note:"Current indicative dealer price" },
  { modelId:"yamaha-sniper-155", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/motorcycles/sniper-155/", priceFromPhp:128400, priceToPhp:148400, checkedAt:"2026-09-30", note:"Current Sniper 155 to Sniper 155R indicative dealer range" },

  // Additional second-source observations for new v1.7 models where current Philippine dealer network pages were available.
  { modelId:"yamaha-pg-1", sourceName:"Motortrade Philippines", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/page/8/?motorcycle-type=regular-bike%2F", priceFromPhp:92900, checkedAt:"2026-09-30", note:"Current dealer listing; live dealer-price disagreement is exposed rather than averaged away" },
  { modelId:"yamaha-wr155r", sourceName:"Motortrade Philippines", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/page/8/?motorcycle-type=regular-bike%2F", priceFromPhp:180900, checkedAt:"2026-09-30", note:"Current dealer listing" },

];

export function priceChecksForModel(modelId: string) {
  return marketPriceChecks.filter((row) => row.modelId === modelId);
}

export function observedMarketRange(model: Motorcycle) {
  const checks = priceChecksForModel(model.id);
  if (!checks.length) return { from: model.srp, to: model.marketPriceHighPhp };
  const from = Math.min(...checks.map((row) => row.priceFromPhp));
  const to = Math.max(...checks.map((row) => row.priceToPhp || row.priceFromPhp));
  return { from, to: to > from ? to : undefined };
}


export type PlanningPurchasePrice = {
  price: number;
  basis: "manufacturer" | "catalog-srp" | "median-observed";
};

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (!sorted.length) return 0;
  return sorted.length % 2 ? sorted[middle] : Math.round((sorted[middle - 1] + sorted[middle]) / 2);
}

/**
 * Conservative planning price for financing/affordability.
 * Prefer a current manufacturer observation, then a catalog SRP that sits inside
 * the observed market range, then the median independent observed starting price.
 * This avoids financing every bike from the single cheapest live observation.
 */
export function planningPurchasePrice(model: Motorcycle): PlanningPurchasePrice {
  const checks = priceChecksForModel(model.id);
  const manufacturer = checks.filter((row) => row.sourceType === "manufacturer");
  if (manufacturer.length) {
    return { price: median(manufacturer.map((row) => row.priceFromPhp)), basis: "manufacturer" };
  }

  if (checks.length) {
    const observed = observedMarketRange(model);
    if (model.srp > 0 && model.srp >= observed.from && model.srp <= (observed.to ?? observed.from)) {
      return { price: model.srp, basis: "catalog-srp" };
    }
    return { price: median(checks.map((row) => row.priceFromPhp)), basis: "median-observed" };
  }

  return { price: model.srp, basis: "catalog-srp" };
}

export function observedMarketPriceLabel(model: Motorcycle) {
  const range = observedMarketRange(model);
  return phpRange(range.from, range.to);
}
