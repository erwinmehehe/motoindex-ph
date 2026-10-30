import { absoluteUrl } from "./site";

export type TransitStation = { name: string; area: string; transfer: string; note: string };
export type TransitStationGuide = { line: string; title: string; direction: string; sourceUrl: string; stations: TransitStation[] };

/** Official DOTr-MRT3 / LRTA station sequences checked 2026-10-30. */
const stationGuides: Record<string,TransitStationGuide> = {
  "mrt-3-stations-philippines": {
    "line": "MRT-3",
    "title": "Complete MRT-3 station list in order",
    "direction": "North Avenue → Taft Avenue (north to south)",
    "sourceUrl": "https://www.dotrmrt3.gov.ph/station-map.pdf",
    "stations": [
      {
        "name": "North Avenue",
        "area": "Quezon City",
        "transfer": "Northern terminal",
        "note": "Northern terminus; check exit signs for connections"
      },
      {
        "name": "Quezon Avenue",
        "area": "Quezon City",
        "transfer": "",
        "note": "Quezon Avenue and EDSA corridor"
      },
      {
        "name": "GMA Kamuning",
        "area": "Quezon City",
        "transfer": "",
        "note": "Kamuning area"
      },
      {
        "name": "Araneta-Cubao",
        "area": "Quezon City",
        "transfer": "LRT-2 Araneta Center-Cubao",
        "note": "Walk toward LRT-2 using official signs"
      },
      {
        "name": "Santolan-Annapolis",
        "area": "Quezon City",
        "transfer": "",
        "note": "Santolan–Annapolis corridor"
      },
      {
        "name": "Ortigas",
        "area": "Pasig City",
        "transfer": "",
        "note": "Ortigas business area"
      },
      {
        "name": "Shaw Boulevard",
        "area": "Mandaluyong City",
        "transfer": "",
        "note": "Shaw Boulevard commercial corridor"
      },
      {
        "name": "Boni",
        "area": "Mandaluyong City",
        "transfer": "",
        "note": "Boni Avenue corridor"
      },
      {
        "name": "Guadalupe",
        "area": "Makati City",
        "transfer": "",
        "note": "Guadalupe area"
      },
      {
        "name": "Buendia",
        "area": "Makati City",
        "transfer": "",
        "note": "Sen. Gil Puyat / Buendia"
      },
      {
        "name": "Ayala",
        "area": "Makati City",
        "transfer": "",
        "note": "Ayala Avenue business district"
      },
      {
        "name": "Magallanes",
        "area": "Makati City",
        "transfer": "",
        "note": "Magallanes interchange area"
      },
      {
        "name": "Taft Avenue",
        "area": "Pasay City",
        "transfer": "LRT-1 EDSA",
        "note": "Southern terminal; pedestrian link toward LRT-1"
      }
    ]
  },
  "lrt-2-stations-philippines": {
    "line": "LRT-2",
    "title": "Complete LRT-2 station list in order",
    "direction": "Recto → Antipolo (west to east)",
    "sourceUrl": "https://www.lrta.gov.ph/railway-operations/",
    "stations": [
      {
        "name": "Recto",
        "area": "Manila",
        "transfer": "LRT-1 Doroteo Jose",
        "note": "Western terminal; transfer is on foot"
      },
      {
        "name": "Legarda",
        "area": "Manila",
        "transfer": "",
        "note": "Legarda corridor"
      },
      {
        "name": "Pureza",
        "area": "Manila",
        "transfer": "",
        "note": "Pureza corridor"
      },
      {
        "name": "V. Mapa",
        "area": "Manila",
        "transfer": "",
        "note": "V. Mapa area"
      },
      {
        "name": "J. Ruiz",
        "area": "San Juan City",
        "transfer": "",
        "note": "J. Ruiz area"
      },
      {
        "name": "Gilmore",
        "area": "Quezon City",
        "transfer": "",
        "note": "Gilmore corridor"
      },
      {
        "name": "Betty Go-Belmonte",
        "area": "Quezon City",
        "transfer": "",
        "note": "Betty Go-Belmonte area"
      },
      {
        "name": "Araneta Center-Cubao",
        "area": "Quezon City",
        "transfer": "MRT-3 Araneta-Cubao",
        "note": "Walk toward MRT-3 using official signs"
      },
      {
        "name": "Anonas",
        "area": "Quezon City",
        "transfer": "",
        "note": "Anonas corridor"
      },
      {
        "name": "Katipunan",
        "area": "Quezon City",
        "transfer": "",
        "note": "Underground station; Katipunan corridor"
      },
      {
        "name": "Santolan",
        "area": "Pasig City",
        "transfer": "",
        "note": "Marcos Highway area"
      },
      {
        "name": "Marikina-Pasig",
        "area": "Eastern Metro Manila",
        "transfer": "",
        "note": "Marikina–Pasig corridor"
      },
      {
        "name": "Antipolo",
        "area": "Antipolo City, Rizal",
        "transfer": "",
        "note": "Eastern terminal; Masinag area"
      }
    ]
  }
};

export function transitStationGuide(slug: string): TransitStationGuide | undefined { return stationGuides[slug]; }

/** ListItem markup reflects the actual ordered station table rendered on the page. */
export function transitStationListSchema(slug: string) {
  const guide = transitStationGuide(slug);
  if (!guide) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: guide.title,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: guide.stations.length,
    url: absoluteUrl(`/guides/${slug}`),
    itemListElement: guide.stations.map((station, index) => ({ "@type": "ListItem", position: index + 1, name: station.name }))
  };
}
