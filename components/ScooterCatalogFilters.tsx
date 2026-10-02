"use client";

import { useEffect, useMemo, useState } from "react";

type ScooterRef = { id: string; make: string; model: string; engineCc: number; price: number };

export function ScooterCatalogFilters({ models }: { models: ScooterRef[] }) {
  const [brand, setBrand] = useState("All");
  const [price, setPrice] = useState("All");
  const [engine, setEngine] = useState("All");
  const [sort, setSort] = useState("price-asc");
  const [shown, setShown] = useState(models.length);
  const brands = useMemo(() => [...new Set(models.map((model) => model.make))].sort(), [models]);

  useEffect(() => {
    let count = 0;
    document.querySelectorAll<HTMLElement>("[data-scooter-catalog-item]").forEach((element) => {
      const itemBrand = element.dataset.brand || "";
      const itemPrice = Number(element.dataset.price || 0);
      const itemCc = Number(element.dataset.cc || 0);

      const brandMatch = brand === "All" || itemBrand === brand;
      const priceMatch =
        price === "All" ||
        (price === "under-100" && itemPrice < 100000) ||
        (price === "100-150" && itemPrice >= 100000 && itemPrice < 150000) ||
        (price === "150-plus" && itemPrice >= 150000);
      const engineMatch =
        engine === "All" ||
        (engine === "125" && itemCc <= 125) ||
        (engine === "126-155" && itemCc >= 126 && itemCc <= 155) ||
        (engine === "156-plus" && itemCc >= 156);

      const visible = brandMatch && priceMatch && engineMatch;
      element.hidden = !visible;
      if (visible) count += 1;

      const name = element.dataset.name || "";
      const order = sort === "price-desc" ? -itemPrice : sort === "name" ? name.charCodeAt(0) * 100000 + itemPrice : itemPrice;
      element.style.order = String(order);
    });
    setShown(count);
  }, [brand, engine, price, sort]);

  return <div className="wire-catalog-controls">
    <label><span>All Brands</span><select value={brand} onChange={(event) => setBrand(event.target.value)}><option>All</option>{brands.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label><span>Price Range</span><select value={price} onChange={(event) => setPrice(event.target.value)}><option value="All">All prices</option><option value="under-100">Under ₱100K</option><option value="100-150">₱100K–₱150K</option><option value="150-plus">₱150K+</option></select></label>
    <label><span>Engine CC</span><select value={engine} onChange={(event) => setEngine(event.target.value)}><option value="All">All engines</option><option value="125">125cc & below</option><option value="126-155">126–155cc</option><option value="156-plus">156cc+</option></select></label>
    <label><span>Sort By</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Brand & model</option></select></label>
    <strong>{shown} models</strong>
  </div>;
}
