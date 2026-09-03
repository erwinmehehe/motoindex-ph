export type RepoObservation = {
  id: string;
  label: string;
  advertisedPricePhp: number;
  sourceName: string;
  sourceUrl: string;
  checkedAt: string;
  researchHref?: string;
  note?: string;
};

export const REPO_MARKET_CHECKED_AT = "2026-08-26";
export const SB_FINANCE_REPO_CENTRAL_URL = "https://www.sbfinance.com.ph/repo-central-catalogue/";
export const SB_FINANCE_REPO_WAREHOUSE_URL = "https://www.sbfinance.com.ph/motorcycle-repo-warehouse/";

// Source-checked advertised repo-unit prices. These are snapshots from the source page,
// not MotoIndex valuations, appraisals, or guarantees of current stock/condition.
export const repoObservations: RepoObservation[] = [
  { id:"sbf-adv160", label:"Honda ADV 160", advertisedPricePhp:134320, sourceName:"SB Finance Repo Central", sourceUrl:SB_FINANCE_REPO_CENTRAL_URL, checkedAt:REPO_MARKET_CHECKED_AT, researchHref:"/motorcycles/honda/adv-160" },
  { id:"sbf-beat", label:"Honda BeAT", advertisedPricePhp:57920, sourceName:"SB Finance Repo Central", sourceUrl:SB_FINANCE_REPO_CENTRAL_URL, checkedAt:REPO_MARKET_CHECKED_AT, researchHref:"/motorcycles/honda/beat" },
  { id:"sbf-click125-se", label:"Honda Click 125 — Special Edition", advertisedPricePhp:67920, sourceName:"SB Finance Repo Central", sourceUrl:SB_FINANCE_REPO_CENTRAL_URL, checkedAt:REPO_MARKET_CHECKED_AT, researchHref:"/motorcycles/honda/click-125i", note:"Source labels this unit as Click 125 Special Edition; generation/model year is not stated on the price card." },
  { id:"sbf-click125-standard", label:"Honda Click 125 — Standard", advertisedPricePhp:65920, sourceName:"SB Finance Repo Central", sourceUrl:SB_FINANCE_REPO_CENTRAL_URL, checkedAt:REPO_MARKET_CHECKED_AT, researchHref:"/motorcycles/honda/click-125i", note:"Source labels this unit as Click 125 Standard; generation/model year is not stated on the price card." },
  { id:"sbf-nmax-abs", label:"Yamaha NMAX ABS", advertisedPricePhp:121520, sourceName:"SB Finance Repo Central", sourceUrl:SB_FINANCE_REPO_CENTRAL_URL, checkedAt:REPO_MARKET_CHECKED_AT, researchHref:"/motorcycles/yamaha/nmax", note:"Use the NMAX family page for research because the repo price card does not state model year/generation." },
  { id:"sbf-nmax-techmax", label:"Yamaha NMAX Tech Max", advertisedPricePhp:141680, sourceName:"SB Finance Repo Central", sourceUrl:SB_FINANCE_REPO_CENTRAL_URL, checkedAt:REPO_MARKET_CHECKED_AT, researchHref:"/motorcycles/yamaha/nmax", note:"Use the NMAX family page for research because the repo price card does not state model year/generation." },
  { id:"sbf-raider-r150-fi", label:"Suzuki Raider R150 FI", advertisedPricePhp:91520, sourceName:"SB Finance Repo Central", sourceUrl:SB_FINANCE_REPO_CENTRAL_URL, checkedAt:REPO_MARKET_CHECKED_AT, researchHref:"/motorcycles/suzuki/raider-r150" },
  { id:"sbf-raider-r150-carb", label:"Suzuki Raider R150 Carburetor", advertisedPricePhp:83600, sourceName:"SB Finance Repo Central", sourceUrl:SB_FINANCE_REPO_CENTRAL_URL, checkedAt:REPO_MARKET_CHECKED_AT, note:"MotoIndex does not map this price card to the current FI model because the carbureted variant is distinct." },
  { id:"sbf-fazzio", label:"Yamaha Mio Fazzio", advertisedPricePhp:75280, sourceName:"SB Finance Repo Central", sourceUrl:SB_FINANCE_REPO_CENTRAL_URL, checkedAt:REPO_MARKET_CHECKED_AT, researchHref:"/motorcycles/yamaha/fazzio" },
  { id:"sbf-burgman-ex", label:"Suzuki Burgman Street 125 EX", advertisedPricePhp:74400, sourceName:"SB Finance Repo Central", sourceUrl:SB_FINANCE_REPO_CENTRAL_URL, checkedAt:REPO_MARKET_CHECKED_AT, researchHref:"/motorcycles/suzuki/burgman-street-ex" },
  { id:"sbf-burgman", label:"Suzuki Burgman Street", advertisedPricePhp:67680, sourceName:"SB Finance Repo Central", sourceUrl:SB_FINANCE_REPO_CENTRAL_URL, checkedAt:REPO_MARKET_CHECKED_AT, researchHref:"/motorcycles/suzuki/burgman-street" },
  { id:"sbf-avenis", label:"Suzuki Avenis", advertisedPricePhp:65120, sourceName:"SB Finance Repo Central", sourceUrl:SB_FINANCE_REPO_CENTRAL_URL, checkedAt:REPO_MARKET_CHECKED_AT, researchHref:"/motorcycles/suzuki/avenis" },
  { id:"sbf-pcx160-abs", label:"Honda PCX160 ABS", advertisedPricePhp:120720, sourceName:"SB Finance Repo Central", sourceUrl:SB_FINANCE_REPO_CENTRAL_URL, checkedAt:REPO_MARKET_CHECKED_AT, researchHref:"/motorcycles/honda/pcx-160" },
  { id:"sbf-pcx160-cbs", label:"Honda PCX160 CBS", advertisedPricePhp:102320, sourceName:"SB Finance Repo Central", sourceUrl:SB_FINANCE_REPO_CENTRAL_URL, checkedAt:REPO_MARKET_CHECKED_AT, researchHref:"/motorcycles/honda/pcx-160" },
  { id:"sbf-click160", label:"Honda Click 160", advertisedPricePhp:99280, sourceName:"SB Finance Repo Central", sourceUrl:SB_FINANCE_REPO_CENTRAL_URL, checkedAt:REPO_MARKET_CHECKED_AT, researchHref:"/motorcycles/honda/click-160" }
];

export function repoPriceRange(){
  const values=repoObservations.map(x=>x.advertisedPricePhp).sort((a,b)=>a-b);
  return { low:values[0]||0, high:values.at(-1)||0, count:values.length };
}
