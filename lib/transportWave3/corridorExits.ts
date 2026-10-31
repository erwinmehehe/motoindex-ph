import { absoluteUrl } from "../site";

/** Date-labeled route references; not navigation instructions or a live exit feed. */
export type CorridorExit = { name: string; area: string; note: string };
export type CorridorExitGuide = {
 label: string; title: string; direction: string; sourceUrl: string;
 sourceLabel: string; disclaimer: string; exits: CorridorExit[];
};
const guideData: Record<string, CorridorExitGuide> = {
  "cavite-laguna-expressway-calax": {
    "label": "CALAX",
    "title": "CALAX open interchange reference from Laguna to Cavite",
    "direction": "Greenfield–Mamplasan toward Governor's Drive, based on August 2026 operator release",
    "sourceUrl": "https://calax.com.ph/news-and-events/2026/trb-approves-toll-collection-calax-subsection-3?page=4",
    "sourceLabel": "MPT South August 2026 CALAX subsection opening notice",
    "disclaimer": "The operator reported 26 km open through Governor's Drive in August 2026. This is an interchange reference, not a claim that the full 45-km Kawit connection is open.",
    "exits": [
      {
        "name": "Greenfield–Mamplasan",
        "area": "Biñan, Laguna",
        "note": "Gateway toward SLEX via Mamplasan; verify access ramp"
      },
      {
        "name": "Laguna Technopark",
        "area": "Biñan / Santa Rosa area",
        "note": "Industrial park access"
      },
      {
        "name": "Laguna Boulevard",
        "area": "Laguna",
        "note": "Business and residential corridor"
      },
      {
        "name": "Santa Rosa–Tagaytay Road",
        "area": "Santa Rosa, Laguna",
        "note": "Route toward Santa Rosa and Tagaytay"
      },
      {
        "name": "Silang East",
        "area": "Silang, Cavite",
        "note": "Tibig Road area and onward Silang routes"
      },
      {
        "name": "Silang (Aguinaldo Highway)",
        "area": "Silang, Cavite",
        "note": "Beginning of the separately charged 2026 subsection"
      },
      {
        "name": "Governor's Drive",
        "area": "General Trias, Cavite",
        "note": "Western end of the 26-km operational section reported August 2026"
      }
    ]
  },
  "tplex-exits-and-route": {
    "label": "TPLEX",
    "title": "11 TPLEX access areas from La Paz to Rosario",
    "direction": "La Paz, Tarlac toward Rosario, La Union (south to north)",
    "sourceUrl": "https://toll.ph/matrix/tplex",
    "sourceLabel": "TRB-attributed TPLEX toll matrix updated July 27, 2026",
    "disclaimer": "Toll-matrix exit labels identify the general access sequence. Exact entry/exit availability and direction must be checked with the operator.",
    "exits": [
      {
        "name": "La Paz",
        "area": "Tarlac City, Tarlac",
        "note": "Southern SCTEX connection"
      },
      {
        "name": "Victoria",
        "area": "Victoria, Tarlac",
        "note": "Victoria municipality access"
      },
      {
        "name": "Gerona",
        "area": "Gerona, Tarlac",
        "note": "Tarlac northern corridor"
      },
      {
        "name": "Paniqui",
        "area": "Paniqui, Tarlac",
        "note": "Paniqui town approach"
      },
      {
        "name": "Moncada",
        "area": "Moncada, Tarlac",
        "note": "Moncada area"
      },
      {
        "name": "Carmen",
        "area": "Carmen, Pangasinan",
        "note": "Possible onward approach toward Dagupan area"
      },
      {
        "name": "Urdaneta",
        "area": "Urdaneta City, Pangasinan",
        "note": "Major Pangasinan commercial access"
      },
      {
        "name": "Binalonan",
        "area": "Binalonan, Pangasinan",
        "note": "Binalonan town and nearby corridors"
      },
      {
        "name": "Pozorrubio",
        "area": "Pozorrubio, Pangasinan",
        "note": "Roads toward eastern Pangasinan and Baguio approach"
      },
      {
        "name": "Sison",
        "area": "Sison, Pangasinan",
        "note": "Sison area"
      },
      {
        "name": "Rosario/Baguio",
        "area": "Rosario, La Union",
        "note": "Current northern terminus in the operator overview"
      }
    ]
  },
  "sctex-route-and-exits": {
    "label": "SCTEX",
    "title": "12 SCTEX exit/access areas from Subic to Tarlac",
    "direction": "Tipo/Subic toward the Tarlac connection, with directional junctions near Clark",
    "sourceUrl": "https://www.expressway.ph/guides/sctex-exits",
    "sourceLabel": "2026 SCTEX exit and corridor reference; verify with NLEX",
    "disclaimer": "SCTEX junctions and ramps can branch; the listed order is a broad corridor reference, not a guarantee every stop lies on one uninterrupted driving direction.",
    "exits": [
      {
        "name": "Tipo/Subic",
        "area": "Subic, Zambales / Olongapo access",
        "note": "Western Subic Bay gateway"
      },
      {
        "name": "Dinalupihan",
        "area": "Dinalupihan, Bataan",
        "note": "Access toward Bataan"
      },
      {
        "name": "Floridablanca",
        "area": "Floridablanca, Pampanga",
        "note": "Pampanga corridor"
      },
      {
        "name": "Porac",
        "area": "Porac, Pampanga",
        "note": "Porac and Angeles-area approaches"
      },
      {
        "name": "Clark South",
        "area": "Clark Freeport Zone",
        "note": "Southern access toward Clark"
      },
      {
        "name": "Mabalacat (Mabiga)",
        "area": "Mabalacat, Pampanga",
        "note": "NLEX integration area"
      },
      {
        "name": "Clark North",
        "area": "Clark Freeport Zone",
        "note": "Northern Clark access"
      },
      {
        "name": "Dolores",
        "area": "Pampanga / Tarlac corridor",
        "note": "Regional access near north of Clark"
      },
      {
        "name": "Bamban / New Clark City",
        "area": "Bamban, Tarlac",
        "note": "New Clark City access roads"
      },
      {
        "name": "Concepcion",
        "area": "Concepcion, Tarlac",
        "note": "Concepcion local roads"
      },
      {
        "name": "Hacienda Luisita",
        "area": "Tarlac City, Tarlac",
        "note": "Hacienda Luisita area"
      },
      {
        "name": "Tarlac / La Paz",
        "area": "Tarlac City, Tarlac",
        "note": "TPLEX continuation point"
      }
    ]
  },
  "nlex-connector-road-philippines": {
    "label": "NLEX Connector",
    "title": "NLEX Connector ramp and plaza reference",
    "direction": "C-3/Fifth Avenue toward España and Magsaysay in Manila (north to south)",
    "sourceUrl": "https://pia.gov.ph/news/nlex-urges-motorists-to-use-connector-road-to-ease-post-undas-traffic/",
    "sourceLabel": "Philippine Information Agency report on operating Connector access points",
    "disclaimer": "Open-ramp movements depend on current signage. An eventual Skyway Stage 3 link is not treated as operational without an official opening notice.",
    "exits": [
      {
        "name": "C-3 Road / Fifth Avenue",
        "area": "Caloocan City",
        "note": "North-side access toward NLEX Harbor Link"
      },
      {
        "name": "España Boulevard",
        "area": "Sampaloc, Manila",
        "note": "Manila access toward España and nearby streets"
      },
      {
        "name": "Magsaysay Boulevard",
        "area": "Sta. Mesa, Manila",
        "note": "Access toward Nagtahan and Sta. Mesa"
      }
    ]
  }
};
export function corridorExitGuide(slug: string): CorridorExitGuide | undefined {
  return guideData[slug];
}
export function corridorExitSchema(slug: string) {
  const guide = corridorExitGuide(slug);
  if (!guide) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: guide.title,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: guide.exits.length,
    url: absoluteUrl(`/guides/${slug}`),
    itemListElement: guide.exits.map((exit, index) => ({
      "@type": "ListItem", position: index + 1, name: exit.name
    }))
  };
}
