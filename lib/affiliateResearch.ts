import candidateData from "../data/affiliate-research-candidates.json";
import { allCatalogProducts } from "./catalog";
import { isExactShopeeProductUrl, isSpecificRetailerProductUrl } from "./affiliateDestinations";

/**
 * An editorial research candidate is NOT an approved live offer. Research
 * candidates must never feed public purchase buttons or affiliate redirects.
 * The protected admin workbench uses them solely for review and source QA.
 */
export type AffiliateResearchCandidate = {
  productId: string;
  category: string;
  brand: string;
  model: string;
  sourceUrl: string;
  sourceKind: "shopee" | "retailer";
  researchedAt: string;
  reviewStatus: "needs_live_browser_review";
  reviewNote: string;
};

const catalogIds = new Set(allCatalogProducts().map((product) => product.id));

function validCandidate(input: unknown): input is AffiliateResearchCandidate {
  if (!input || typeof input !== "object" || Array.isArray(input)) return false;
  const item = input as Partial<AffiliateResearchCandidate>;
  if (typeof item.productId !== "string" || !catalogIds.has(item.productId)) return false;
  if (typeof item.brand !== "string" || typeof item.model !== "string" || typeof item.category !== "string") return false;
  if (typeof item.sourceUrl !== "string" || typeof item.researchedAt !== "string" || typeof item.reviewNote !== "string") return false;
  if (item.reviewStatus !== "needs_live_browser_review") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.researchedAt)) return false;
  if (item.sourceKind === "shopee") return isExactShopeeProductUrl(item.sourceUrl);
  if (item.sourceKind === "retailer") return isSpecificRetailerProductUrl(item.sourceUrl);
  return false;
}

const candidates = candidateData.entries.filter(validCandidate);
const candidatesById = new Map(candidates.map((candidate) => [candidate.productId, candidate]));

export function getAffiliateResearchCandidate(productId: string): AffiliateResearchCandidate | undefined {
  return candidatesById.get(productId);
}

export function listAffiliateResearchCandidates(): AffiliateResearchCandidate[] {
  return candidates.slice();
}
