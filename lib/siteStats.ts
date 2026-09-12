import { accessoryCategories, helmetBrands, publicMotorcycles } from "./data";
import { helmetProducts } from "./catalog";

export const siteStats = {
  currentMotorcycles: publicMotorcycles.length,
  verifiedHelmets: helmetProducts.filter((product) => product.status === "verified").length,
  helmetBrands: helmetBrands.length,
  accessoryCategories: accessoryCategories.length,
};

export function verifiedHelmetProducts() {
  return helmetProducts.filter((product) => product.status === "verified");
}
