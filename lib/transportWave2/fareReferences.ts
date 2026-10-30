/** Small, deliberately partial and dated sample fare tables. Do not interpolate a live rate. */
export type FareReferenceTable = {
  title: string;
  caption: string;
  effective: string;
  sourceUrl: string;
  sourceLabel: string;
  headers: string[];
  rows: string[][];
};
const fareTables: Record<string,FareReferenceTable> = {
  "skyway-philippines-routes-toll-fees": {
    "title": "Skyway Stage 3 example tolls, Class 1",
    "caption": "Selected published February 2026 toll-matrix reference amounts. Not live fares.",
    "effective": "February 2026 reference matrix",
    "sourceUrl": "https://toll.ph/matrix",
    "sourceLabel": "TRB-based Skyway matrix compilation",
    "headers": [
      "Entry",
      "Exit",
      "Class 1 toll"
    ],
    "rows": [
      [
        "Buendia",
        "Quirino",
        "₱105"
      ],
      [
        "Buendia",
        "Nagtahan",
        "₱105"
      ],
      [
        "Quezon Avenue",
        "Balintawak",
        "₱129"
      ],
      [
        "Buendia",
        "Balintawak",
        "₱264"
      ],
      [
        "Buendia",
        "NLEX-Skyway ramp",
        "₱264"
      ]
    ]
  },
  "slex-toll-fee-philippines": {
    "title": "SLEX tolls from Magallanes, Class 1",
    "caption": "Selected rates from a published SLEX/Skyway matrix effective July 1, 2026. Not live fares.",
    "effective": "July 1, 2026",
    "sourceUrl": "https://parkinganph.com/guides/toll-matrix",
    "sourceLabel": "Dated SLEX toll matrix compilation",
    "headers": [
      "Entry",
      "Exit",
      "Class 1 toll"
    ],
    "rows": [
      [
        "Magallanes",
        "Bicutan",
        "₱49"
      ],
      [
        "Magallanes",
        "Sucat",
        "₱84"
      ],
      [
        "Magallanes",
        "Alabang",
        "₱118"
      ],
      [
        "Magallanes",
        "Santa Rosa",
        "₱199"
      ],
      [
        "Magallanes",
        "Calamba",
        "₱255"
      ],
      [
        "Magallanes",
        "Sto. Tomas",
        "₱292"
      ]
    ]
  },
  "nlex-toll-fee-philippines": {
    "title": "NLEX tolls from Balintawak, Class 1",
    "caption": "Selected entry–exit rates after the January 20, 2026 adjustment. Not live fares.",
    "effective": "January 20, 2026",
    "sourceUrl": "https://parkinganph.com/guides/toll-matrix",
    "sourceLabel": "NLEX January 2026 TRB-based matrix compilation",
    "headers": [
      "Entry",
      "Exit",
      "Class 1 toll"
    ],
    "rows": [
      [
        "Balintawak",
        "Marilao",
        "₱85"
      ],
      [
        "Balintawak",
        "Bocaue",
        "₱105"
      ],
      [
        "Balintawak",
        "San Fernando",
        "₱314"
      ],
      [
        "Balintawak",
        "Angeles",
        "₱399"
      ],
      [
        "Balintawak",
        "Dau",
        "₱411"
      ],
      [
        "Balintawak",
        "Sta. Ines",
        "₱440"
      ]
    ]
  },
  "lrt-1-fare-philippines": {
    "title": "Selected LRT-1 beep and single-journey fares",
    "caption": "Published station-pair examples under the fare matrices effective April 2, 2025. Not a live fare engine.",
    "effective": "April 2, 2025",
    "sourceUrl": "https://lrmc.ph/our-business-featured/fare-matrix/",
    "sourceLabel": "LRMC official fare matrix",
    "headers": [
      "From",
      "To",
      "Beep card",
      "Single journey"
    ],
    "rows": [
      [
        "Fernando Poe Jr.",
        "Dr. Santos",
        "₱52",
        "₱55"
      ],
      [
        "Fernando Poe Jr.",
        "PITX",
        "₱48",
        "₱50"
      ],
      [
        "EDSA",
        "PITX",
        "₱22",
        "₱25"
      ],
      [
        "PITX",
        "Dr. Santos",
        "₱20",
        "₱20"
      ],
      [
        "Monumento",
        "PITX",
        "₱42",
        "₱45"
      ]
    ]
  },
  "edsa-carousel-stations-fare": {
    "title": "EDSA Busway 2026 fare reference",
    "caption": "LTFRB approved base rate effective September 28, 2026; full-route example from a dated fare compilation.",
    "effective": "September 28, 2026",
    "sourceUrl": "https://pia.gov.ph/news/luzon/ncr/ltfrb-reminds-puv-operators-drivers-to-display-updated-fare-matrix",
    "sourceLabel": "PIA/LTFRB September 2026 fare notice",
    "headers": [
      "Trip or component",
      "Passenger",
      "Reference fare"
    ],
    "rows": [
      [
        "First 5 km",
        "Regular passenger",
        "₱18 minimum"
      ],
      [
        "Each succeeding km",
        "Regular passenger",
        "₱2.98 per km"
      ],
      [
        "Monumento to PITX",
        "Regular passenger, compiled matrix",
        "₱85"
      ]
    ]
  }
};
export function transportFareTable(slug: string): FareReferenceTable | undefined { return fareTables[slug]; }
