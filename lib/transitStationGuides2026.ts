import { absoluteUrl } from "./site";

export type TransitStation = { name: string; area: string; transfer: string; note: string };
export type TransitStationGuide = { line: string; title: string; direction: string; sourceUrl: string; sourceLabel?: string; stations: TransitStation[] };

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
  },
  "lrt-1-fare-philippines": {
  "line": "LRT-1",
  "title": "All 25 LRT-1 stations from Fernando Poe Jr. to Dr. Santos",
  "direction": "Fernando Poe Jr. → Dr. Santos (north to south)",
  "sourceUrl": "https://www.lrta.gov.ph/railway-operations/",
  "sourceLabel": "LRTA official railway operations",
  "stations": [
    {
      "name": "Fernando Poe Jr.",
      "area": "Quezon City",
      "transfer": "",
      "note": "Northern terminal"
    },
    {
      "name": "Balintawak",
      "area": "Quezon City",
      "transfer": "",
      "note": "LRT-1 corridor stop"
    },
    {
      "name": "Monumento",
      "area": "Caloocan City",
      "transfer": "",
      "note": "LRT-1 corridor stop"
    },
    {
      "name": "5th Avenue",
      "area": "Caloocan City",
      "transfer": "",
      "note": "LRT-1 corridor stop"
    },
    {
      "name": "R. Papa",
      "area": "Caloocan City",
      "transfer": "",
      "note": "LRT-1 corridor stop"
    },
    {
      "name": "Abad Santos",
      "area": "Caloocan City",
      "transfer": "",
      "note": "LRT-1 corridor stop"
    },
    {
      "name": "Blumentritt",
      "area": "Manila",
      "transfer": "",
      "note": "LRT-1 corridor stop"
    },
    {
      "name": "Tayuman",
      "area": "Manila",
      "transfer": "",
      "note": "LRT-1 corridor stop"
    },
    {
      "name": "Bambang",
      "area": "Manila",
      "transfer": "",
      "note": "LRT-1 corridor stop"
    },
    {
      "name": "Doroteo Jose",
      "area": "Manila",
      "transfer": "LRT-2 Recto",
      "note": "Pedestrian transfer to LRT-2"
    },
    {
      "name": "Carriedo",
      "area": "Manila",
      "transfer": "",
      "note": "LRT-1 corridor stop"
    },
    {
      "name": "Central Terminal",
      "area": "Manila",
      "transfer": "",
      "note": "LRT-1 corridor stop"
    },
    {
      "name": "United Nations Avenue",
      "area": "Manila",
      "transfer": "",
      "note": "LRT-1 corridor stop"
    },
    {
      "name": "Pedro Gil",
      "area": "Manila",
      "transfer": "",
      "note": "LRT-1 corridor stop"
    },
    {
      "name": "Quirino",
      "area": "Manila",
      "transfer": "",
      "note": "LRT-1 corridor stop"
    },
    {
      "name": "Vito Cruz",
      "area": "Manila",
      "transfer": "",
      "note": "LRT-1 corridor stop"
    },
    {
      "name": "Gil Puyat",
      "area": "Pasay City",
      "transfer": "",
      "note": "LRT-1 corridor stop"
    },
    {
      "name": "Libertad",
      "area": "Pasay City",
      "transfer": "",
      "note": "LRT-1 corridor stop"
    },
    {
      "name": "EDSA",
      "area": "Pasay City",
      "transfer": "MRT-3 Taft Avenue",
      "note": "Pedestrian transfer to MRT-3"
    },
    {
      "name": "Baclaran",
      "area": "Pasay City",
      "transfer": "",
      "note": "LRT-1 corridor stop"
    },
    {
      "name": "Redemptorist-Aseana",
      "area": "Parañaque City",
      "transfer": "",
      "note": "LRT-1 corridor stop"
    },
    {
      "name": "MIA Road",
      "area": "Parañaque City",
      "transfer": "",
      "note": "LRT-1 corridor stop"
    },
    {
      "name": "PITX",
      "area": "Parañaque City",
      "transfer": "PITX bus terminal",
      "note": "Southern extension station"
    },
    {
      "name": "Ninoy Aquino Avenue",
      "area": "Parañaque City",
      "transfer": "",
      "note": "LRT-1 corridor stop"
    },
    {
      "name": "Dr. Santos",
      "area": "Parañaque City",
      "transfer": "",
      "note": "Southern terminal"
    }
  ]
},
  "edsa-carousel-stations-fare": {
  "line": "EDSA Carousel",
  "title": "EDSA Carousel southbound stops: Monumento to PITX",
  "direction": "Monumento → PITX (southbound route reference)",
  "sourceUrl": "https://edsacarousel.com/bus-route",
  "sourceLabel": "EDSA Busway published route listing",
  "stations": [
    {
      "name": "Monumento",
      "area": "Caloocan City",
      "transfer": "LRT-1 Monumento",
      "note": "Northern terminal"
    },
    {
      "name": "Bagong Barrio",
      "area": "Caloocan City",
      "transfer": "",
      "note": "Check exact platform entrance and travel direction"
    },
    {
      "name": "Balintawak",
      "area": "Quezon City",
      "transfer": "LRT-1 Balintawak",
      "note": "Check exact platform entrance and travel direction"
    },
    {
      "name": "Kaingin",
      "area": "Quezon City",
      "transfer": "",
      "note": "Check exact platform entrance and travel direction"
    },
    {
      "name": "Fernando Poe Jr. / Roosevelt",
      "area": "Quezon City",
      "transfer": "LRT-1 Fernando Poe Jr.",
      "note": "Check exact platform entrance and travel direction"
    },
    {
      "name": "SM North EDSA",
      "area": "Quezon City",
      "transfer": "",
      "note": "Busy Quezon City boarding area"
    },
    {
      "name": "North Avenue",
      "area": "Quezon City",
      "transfer": "MRT-3 North Avenue",
      "note": "Check exact platform entrance and travel direction"
    },
    {
      "name": "Philam Q.C.",
      "area": "Quezon City",
      "transfer": "",
      "note": "Check exact platform entrance and travel direction"
    },
    {
      "name": "Quezon Avenue",
      "area": "Quezon City",
      "transfer": "MRT-3 Quezon Avenue",
      "note": "Check exact platform entrance and travel direction"
    },
    {
      "name": "Kamuning",
      "area": "Quezon City",
      "transfer": "",
      "note": "Check exact platform entrance and travel direction"
    },
    {
      "name": "Nepa Q. Mart",
      "area": "Quezon City",
      "transfer": "",
      "note": "Check exact platform entrance and travel direction"
    },
    {
      "name": "Main Avenue",
      "area": "Quezon City",
      "transfer": "Cubao rail district",
      "note": "Check exact platform entrance and travel direction"
    },
    {
      "name": "Santolan",
      "area": "Quezon City",
      "transfer": "MRT-3 Santolan",
      "note": "Check exact platform entrance and travel direction"
    },
    {
      "name": "Ortigas",
      "area": "Mandaluyong / Pasig",
      "transfer": "MRT-3 Ortigas",
      "note": "Check exact platform entrance and travel direction"
    },
    {
      "name": "Guadalupe",
      "area": "Makati City",
      "transfer": "MRT-3 Guadalupe",
      "note": "Check exact platform entrance and travel direction"
    },
    {
      "name": "Buendia",
      "area": "Makati City",
      "transfer": "MRT-3 Buendia",
      "note": "Check exact platform entrance and travel direction"
    },
    {
      "name": "Ayala",
      "area": "Makati City",
      "transfer": "MRT-3 Ayala",
      "note": "Check exact platform entrance and travel direction"
    },
    {
      "name": "Tramo",
      "area": "Pasay City",
      "transfer": "",
      "note": "Southbound-specific stop"
    },
    {
      "name": "Taft Avenue",
      "area": "Pasay City",
      "transfer": "MRT-3 Taft / LRT-1 EDSA",
      "note": "Check exact platform entrance and travel direction"
    },
    {
      "name": "Roxas Boulevard",
      "area": "Pasay City",
      "transfer": "",
      "note": "Check exact platform entrance and travel direction"
    },
    {
      "name": "SM Mall of Asia",
      "area": "Pasay City",
      "transfer": "",
      "note": "Check exact platform entrance and travel direction"
    },
    {
      "name": "BVA",
      "area": "Parañaque City",
      "transfer": "",
      "note": "Check exact platform entrance and travel direction"
    },
    {
      "name": "Macapagal / Aseana",
      "area": "Parañaque City",
      "transfer": "",
      "note": "Check exact platform entrance and travel direction"
    },
    {
      "name": "PITX",
      "area": "Parañaque City",
      "transfer": "LRT-1 PITX",
      "note": "Southern terminal"
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
