import type { MarketPriceCheck, Motorcycle } from "./types";
import { phpRange } from "./utils";

const checkedAt = "2026-08-25";

export const marketPriceChecks: MarketPriceCheck[] = [
  // Manufacturer variant references anchor trim-aware pricing where a current primary-source record is available.
  { modelId:"honda-pcx-160", sourceName:"Honda Philippines", sourceType:"manufacturer", sourceUrl:"https://www.hondaph.com/motorcycle/news/elevate-your-riding-experience-where-elegance-meets-truly-exceptional-with-the-all-new-pcx160", priceFromPhp:133400, priceToPhp:154900, checkedAt, note:"Current Standard to RoadSync SRP range" },

  // Zigwheels Philippines competitor/reference pages.
  { modelId:"yamaha-aerox-v3", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/yamaha/mio-aerox/price", priceFromPhp:125900, priceToPhp:163900, checkedAt, note:"Standard to SP variant range" },
  { modelId:"yamaha-nmax-v3", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/yamaha/nmax", priceFromPhp:155900, priceToPhp:175900, checkedAt, note:"Standard to Tech Max variant range" },
  { modelId:"honda-adv-160", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/honda/adv-160", priceFromPhp:166900, checkedAt, note:"Generic comparison-site figure is below the current 2026 Honda ABS/RoadSync SRPs; disagreement retained for transparency" },
  { modelId:"honda-click-160", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/honda/click-160", priceFromPhp:116900, checkedAt },
  { modelId:"honda-pcx-160", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/honda/pcx160", priceFromPhp:133400, priceToPhp:154900, checkedAt, note:"Standard to RoadSync range" },
  { modelId:"yamaha-fazzio", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/yamaha/mio-fazzio", priceFromPhp:93900, checkedAt },
  { modelId:"honda-click-125i", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/honda/click-125i", priceFromPhp:81900, checkedAt },
  { modelId:"yamaha-mio-gear", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/yamaha/mio-gear", priceFromPhp:79400, priceToPhp:82400, checkedAt },
  { modelId:"suzuki-burgman-street-ex", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/suzuki/burgman-street-125-ex", priceFromPhp:92400, checkedAt },
  { modelId:"yamaha-sniper-155", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/yamaha/sniper-155", priceFromPhp:125900, priceToPhp:145900, checkedAt },
  { modelId:"suzuki-raider-r150", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/suzuki/raider-r150-fi", priceFromPhp:121900, checkedAt },
  { modelId:"kawasaki-barako-ii", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/kawasaki/barako-ii", priceFromPhp:91500, checkedAt },
  { modelId:"honda-winner-x", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/honda/winner-x", priceFromPhp:123900, priceToPhp:131900, checkedAt },
  { modelId:"honda-wave-rsx", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/honda/wave-rsx", priceFromPhp:62900, priceToPhp:64900, checkedAt },
  { modelId:"honda-tmx125-alpha", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/honda/tmx125-alpha", priceFromPhp:56900, checkedAt },
  { modelId:"yamaha-ytx-125", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/yamaha/ytx-125", priceFromPhp:57900, checkedAt },
  { modelId:"honda-cb150x", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/honda/cb150x", priceFromPhp:173900, checkedAt },
  { modelId:"yamaha-xsr155", sourceName:"Zigwheels Philippines", sourceType:"comparison-site", sourceUrl:"https://www.zigwheels.ph/new-motorcycles/yamaha/xsr155", priceFromPhp:182000, checkedAt },

  // Motortrade dealer listings used as a second live-market cross-check where a matching current model/trim was found.
  { modelId:"yamaha-aerox-v3", sourceName:"Motortrade", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/make/yamaha/?maker=yamaha", priceFromPhp:125900, checkedAt, note:"New Aerox base listing" },
  { modelId:"yamaha-nmax-v3", sourceName:"Motortrade", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/yamaha-new-nmax/", priceFromPhp:155900, priceToPhp:175900, checkedAt, note:"New NMAX to Techmax" },
  { modelId:"honda-adv-160", sourceName:"Motortrade", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/honda-adv160-roadsync-type/", priceFromPhp:176000, checkedAt, note:"RoadSync indicative dealer listing; page also quotes Honda suggested prices for ABS/RoadSync" },
  { modelId:"honda-click-160", sourceName:"Motortrade", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/honda-click-160/", priceFromPhp:116900, checkedAt },
  { modelId:"honda-pcx-160", sourceName:"Motortrade", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycle-category/automatic/", priceFromPhp:133400, priceToPhp:154900, checkedAt, note:"CBS to ABS listings" },
  { modelId:"yamaha-fazzio", sourceName:"Motortrade", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/page/8/?motorcycle-type=regular-bike%2F", priceFromPhp:92900, checkedAt },
  { modelId:"honda-click-125i", sourceName:"Motortrade", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/vehicle-promo-blue-tag/", priceFromPhp:81900, checkedAt },
  { modelId:"yamaha-mio-gear", sourceName:"Motortrade", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/vehicle_promo/top-pick/", priceFromPhp:79400, checkedAt },
  { modelId:"yamaha-sniper-155", sourceName:"Motortrade", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycle-category/underbone/", priceFromPhp:125900, priceToPhp:145900, checkedAt, note:"Sniper155 to Sniper155R" },
  { modelId:"honda-winner-x", sourceName:"Motortrade", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/model/honda_winnerx-2/", priceFromPhp:123900, priceToPhp:131900, checkedAt },
  { modelId:"honda-wave-rsx", sourceName:"Motortrade", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycle-category/pang-araw-araw/", priceFromPhp:62900, priceToPhp:64900, checkedAt, note:"Drum to Disc" },
  { modelId:"honda-tmx125-alpha", sourceName:"Motortrade", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/honda-tmx-125-alpha-motortrade-honda-motorcycles-philippines/", priceFromPhp:56900, checkedAt },
  { modelId:"yamaha-ytx-125", sourceName:"Motortrade", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/vehicle_promo/top-pick/", priceFromPhp:57900, checkedAt },
  { modelId:"honda-cb150x", sourceName:"Motortrade", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/vehicle-promo-blue-tag/", priceFromPhp:174900, checkedAt, note:"Dealer listing is ₱1,000 above Zigwheels snapshot" },

  // Wheeltek: independent third live-market/dealer source. Prices are indicative branch observations, not manufacturer truth.
  { modelId:"honda-giorno-plus", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/motorcycles/giorno/", priceFromPhp:101900, checkedAt, note:"Indicative dealer price; branch pricing can differ" },
  { modelId:"honda-xrm125", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/products/regular-bikes/", priceFromPhp:71900, priceToPhp:76900, checkedAt, note:"Model-level range across current XRM125 configurations; MotoIndex does not create trim pages" },
  { modelId:"honda-tmx-supremo", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/motorcycles/tmx-supremo/", priceFromPhp:78900, checkedAt },
  { modelId:"yamaha-pg-1", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/vehicles/pg-1/", priceFromPhp:96400, checkedAt, note:"Wheeltek indicative price; compare with Motortrade observation" },
  { modelId:"yamaha-wr155r", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/motorcycles/wr-155r/", priceFromPhp:180900, checkedAt },
  { modelId:"yamaha-xmax", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/motorcycles/xmax/", priceFromPhp:311000, checkedAt },
  { modelId:"honda-adv-160", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/motorcycles/adv160/", priceFromPhp:166900, checkedAt, note:"Generic dealer page appears below the 2026 Honda ABS/RoadSync suggested-retail range; retained as an observed disagreement" },
  { modelId:"yamaha-fazzio", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/motorcycles/mio-fazzio/", priceFromPhp:92400, priceToPhp:95400, checkedAt, note:"Current Wheeltek observations differ by connectivity configuration; kept as one MotoIndex model page" },
  { modelId:"yamaha-ytx-125", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/motorcycles/ytx-125/", priceFromPhp:57900, checkedAt },
  { modelId:"yamaha-xsr155", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/products/regular-bikes/page/5/", priceFromPhp:184500, checkedAt },
  { modelId:"yamaha-sniper-155", sourceName:"Wheeltek", sourceType:"dealer", sourceUrl:"https://wheeltek.com.ph/products/regular-bikes/page/5/", priceFromPhp:128400, priceToPhp:148400, checkedAt, note:"Model-level observations across Sniper 155 configurations" },

  // Additional second-source observations for new v1.7 models where current Motortrade pages were available.
  { modelId:"yamaha-pg-1", sourceName:"Motortrade", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/yamaha-pg-1/", priceFromPhp:82900, checkedAt, note:"Large live dealer-price disagreement versus Wheeltek is intentionally exposed rather than averaged away" },
  { modelId:"yamaha-wr155r", sourceName:"Motortrade", sourceType:"dealer", sourceUrl:"https://motortrade.com.ph/motorcycles/page/8/?motorcycle-type=regular-bike%2F", priceFromPhp:180000, checkedAt },

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
