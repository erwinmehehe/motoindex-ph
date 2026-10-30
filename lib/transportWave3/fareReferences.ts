import type { FareReferenceTable } from "../transportWave2/fareReferences";
/** Published reference fares only; the app never computes a live toll. */
const references: Record<string,FareReferenceTable> = {
  "cavite-laguna-expressway-calax": {
    "title": "CALAX subsection tolls announced August 2026",
    "caption": "Only two published route pairs and the three official vehicle classes; not a live toll calculator.",
    "effective": "August 9, 2026",
    "sourceUrl": "https://calax.com.ph/news-and-events/2026/trb-approves-toll-collection-calax-subsection-3?page=4",
    "sourceLabel": "MPT South operator notice, rates effective August 9, 2026",
    "headers": [
      "Entry–exit pair",
      "Class 1",
      "Class 2",
      "Class 3"
    ],
    "rows": [
      [
        "Silang Aguinaldo ↔ Governor's Drive",
        "₱35",
        "₱70",
        "₱106"
      ],
      [
        "Governor's Drive ↔ Greenfield",
        "₱117",
        "₱234",
        "₱351"
      ]
    ]
  },
  "tplex-exits-and-route": {
    "title": "Selected TPLEX Class 1 tolls from La Paz",
    "caption": "Partial TRB-attributed toll-matrix examples last updated July 27, 2026; not live fares.",
    "effective": "July 27, 2026 published matrix update",
    "sourceUrl": "https://toll.ph/matrix/tplex",
    "sourceLabel": "TPLEX TRB-attributed toll matrix, checked Oct 30 2026",
    "headers": [
      "Entry",
      "Exit",
      "Class 1 example"
    ],
    "rows": [
      [
        "La Paz",
        "Gerona",
        "₱58"
      ],
      [
        "La Paz",
        "Carmen",
        "₱164"
      ],
      [
        "La Paz",
        "Urdaneta",
        "₱216"
      ],
      [
        "La Paz",
        "Pozorrubio",
        "₱270"
      ],
      [
        "La Paz",
        "Rosario/Baguio",
        "₱311"
      ]
    ]
  },
  "nlex-connector-road-philippines": {
    "title": "NLEX Connector Class 1 fare reference",
    "caption": "TRB-attributed third-party matrix viewed Oct 30, 2026. The excerpt does not give an effective date; verify current operator rate.",
    "effective": "Checked October 30, 2026; effective date not stated",
    "sourceUrl": "https://toll.ph/matrix",
    "sourceLabel": "NLEX Connector toll matrix attributed to TRB",
    "headers": [
      "Entry",
      "Exit",
      "Published Class 1 example"
    ],
    "rows": [
      [
        "C-3 Road / Fifth Avenue",
        "España Boulevard",
        "₱119"
      ],
      [
        "C-3 Road / Fifth Avenue",
        "Magsaysay Boulevard",
        "₱119"
      ]
    ]
  }
};
export function transportWave3FareTable(slug: string): FareReferenceTable | undefined { return references[slug]; }
