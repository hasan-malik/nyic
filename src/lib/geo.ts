// Shared geography: origin countries (lat/long), NYC boroughs + neighborhoods,
// and New York State cities. Used by the synthetic data generator and the
// Leaflet maps (Boroughs, State-wide, Origins).

export const NYC_COORD: [number, number] = [40.71, -74.01];

// ---------------------------------------------------------------------------
// Countries of origin. NYC is home to immigrants from ~150+ countries; this
// covers the largest communities plus a long, realistic tail. Coordinates are
// approximate country centroids.
// ---------------------------------------------------------------------------
export const COUNTRY_COORDS: Record<string, [number, number]> = {
  // Latin America & Caribbean
  "Dominican Republic": [18.74, -70.16],
  Mexico: [23.63, -102.55],
  Jamaica: [18.11, -77.3],
  Ecuador: [-1.83, -78.18],
  Haiti: [18.97, -72.29],
  "Trinidad & Tobago": [10.69, -61.22],
  Guyana: [4.86, -58.93],
  Colombia: [4.57, -74.3],
  "El Salvador": [13.79, -88.9],
  Guatemala: [15.78, -90.23],
  Honduras: [15.2, -86.24],
  Peru: [-9.19, -75.02],
  Brazil: [-14.24, -51.93],
  Argentina: [-38.42, -63.62],
  Venezuela: [6.42, -66.59],
  Cuba: [21.52, -77.78],
  "Puerto Rico": [18.22, -66.59],
  Panama: [8.54, -80.78],
  "Costa Rica": [9.75, -83.75],
  Nicaragua: [12.87, -85.21],
  Bolivia: [-16.29, -63.59],
  Chile: [-35.68, -71.54],
  Paraguay: [-23.44, -58.44],
  Uruguay: [-32.52, -55.77],
  Belize: [17.19, -88.5],
  Barbados: [13.19, -59.54],
  Grenada: [12.12, -61.68],
  "St. Lucia": [13.91, -60.98],
  Dominica: [15.41, -61.37],

  // South Asia
  India: [20.59, 78.96],
  Bangladesh: [23.68, 90.36],
  Pakistan: [30.38, 69.35],
  Nepal: [28.39, 84.12],
  "Sri Lanka": [7.87, 80.77],
  Afghanistan: [33.94, 67.71],
  Bhutan: [27.51, 90.43],

  // East & Southeast Asia
  China: [35.86, 104.2],
  Philippines: [12.88, 121.77],
  Korea: [35.91, 127.77],
  Vietnam: [14.06, 108.28],
  Japan: [36.2, 138.25],
  Indonesia: [-0.79, 113.92],
  Thailand: [15.87, 100.99],
  Myanmar: [21.91, 95.96],
  Malaysia: [4.21, 101.98],
  Cambodia: [12.57, 104.99],
  Taiwan: [23.7, 120.96],
  "Hong Kong": [22.32, 114.17],
  Mongolia: [46.86, 103.85],
  Laos: [19.86, 102.5],
  Singapore: [1.35, 103.82],
  Tibet: [31.0, 88.0],

  // Middle East & North Africa
  Yemen: [15.55, 48.52],
  Egypt: [26.82, 30.8],
  Lebanon: [33.85, 35.86],
  Syria: [34.8, 38.99],
  Iran: [32.43, 53.69],
  Iraq: [33.22, 43.68],
  Israel: [31.05, 34.85],
  Jordan: [30.59, 36.24],
  "Saudi Arabia": [23.89, 45.08],
  Morocco: [31.79, -7.09],
  Algeria: [28.03, 1.66],
  Tunisia: [33.89, 9.54],
  Turkey: [38.96, 35.24],
  Palestine: [31.95, 35.23],
  Kuwait: [29.31, 47.48],

  // Sub-Saharan Africa
  Nigeria: [9.08, 8.68],
  Ghana: [7.95, -1.02],
  Senegal: [14.5, -14.45],
  Liberia: [6.43, -9.43],
  Ethiopia: [9.15, 40.49],
  Kenya: [-0.02, 37.91],
  "Ivory Coast": [7.54, -5.55],
  Guinea: [9.95, -9.7],
  Mali: [17.57, -4.0],
  Cameroon: [7.37, 12.35],
  "Sierra Leone": [8.46, -11.78],
  Gambia: [13.44, -15.31],
  Sudan: [12.86, 30.22],
  Somalia: [5.15, 46.2],
  Uganda: [1.37, 32.29],
  Tanzania: [-6.37, 34.89],
  "South Africa": [-30.56, 22.94],
  Zimbabwe: [-19.02, 29.15],
  Congo: [-0.23, 15.83],
  Eritrea: [15.18, 39.78],
  Togo: [8.62, 0.82],
  "Burkina Faso": [12.24, -1.56],
  Rwanda: [-1.94, 29.87],
  Angola: [-11.2, 17.87],

  // Europe
  Italy: [41.87, 12.56],
  Ireland: [53.41, -8.24],
  Poland: [51.92, 19.15],
  Russia: [61.52, 105.32],
  Ukraine: [48.38, 31.17],
  Albania: [41.15, 20.17],
  "United Kingdom": [55.38, -3.44],
  Greece: [39.07, 21.82],
  Germany: [51.17, 10.45],
  France: [46.23, 2.21],
  Spain: [40.46, -3.75],
  Portugal: [39.4, -8.22],
  Romania: [45.94, 24.97],
  Serbia: [44.02, 21.01],
  Bosnia: [43.92, 17.68],
  Bulgaria: [42.73, 25.49],
  Hungary: [47.16, 19.5],
  Georgia: [42.32, 43.36],
  Armenia: [40.07, 45.04],
  Azerbaijan: [40.14, 47.58],
  Uzbekistan: [41.38, 64.59],
  Kazakhstan: [48.02, 66.92],
  Moldova: [47.41, 28.37],
  "Czech Republic": [49.82, 15.47],
  Croatia: [45.1, 15.2],
  Lithuania: [55.17, 23.88],
  Sweden: [60.13, 18.64],
  Netherlands: [52.13, 5.29],

  // Oceania
  Australia: [-25.27, 133.78],
  Fiji: [-17.71, 178.07],
};

export const COUNTRIES = Object.keys(COUNTRY_COORDS);

// Relative weights so the synthetic archive mirrors NYC's actual largest
// foreign-born communities (everything else defaults to weight 1 — the tail).
export const ORIGIN_WEIGHTS: Record<string, number> = {
  "Dominican Republic": 42,
  China: 40,
  Mexico: 26,
  Jamaica: 18,
  Guyana: 14,
  Ecuador: 14,
  Haiti: 12,
  India: 12,
  Bangladesh: 11,
  "Trinidad & Tobago": 10,
  Korea: 8,
  Philippines: 8,
  Colombia: 8,
  Russia: 7,
  Ukraine: 7,
  Italy: 6,
  Pakistan: 6,
  Poland: 6,
  Nigeria: 5,
  Ghana: 5,
  "El Salvador": 5,
  Guatemala: 5,
  Honduras: 5,
  Yemen: 4,
  Egypt: 4,
  Nepal: 4,
  Vietnam: 4,
  Peru: 4,
  Senegal: 3,
  Ireland: 3,
};

// Weighted pool used by the generator: high-frequency countries repeated,
// every other country present once so the long tail still shows up.
export const ORIGIN_POOL: string[] = COUNTRIES.flatMap((c) =>
  Array.from({ length: ORIGIN_WEIGHTS[c] ?? 1 }, () => c)
);

// ---------------------------------------------------------------------------
// New York City — five boroughs (centroids) + neighborhoods.
// ---------------------------------------------------------------------------
export const BOROUGHS = [
  "Manhattan",
  "Brooklyn",
  "Queens",
  "The Bronx",
  "Staten Island",
] as const;

export const BOROUGH_COORD: Record<string, [number, number]> = {
  Manhattan: [40.79, -73.96],
  Brooklyn: [40.65, -73.95],
  Queens: [40.73, -73.79],
  "The Bronx": [40.85, -73.88],
  "Staten Island": [40.58, -74.15],
};

export const NEIGHBORHOODS: Record<string, string[]> = {
  Manhattan: [
    "Washington Heights",
    "Inwood",
    "Chinatown",
    "Harlem",
    "East Harlem",
    "Lower East Side",
  ],
  Brooklyn: [
    "Sunset Park",
    "Flatbush",
    "Bensonhurst",
    "Bay Ridge",
    "Brighton Beach",
    "Bushwick",
    "Crown Heights",
    "East Flatbush",
  ],
  Queens: [
    "Jackson Heights",
    "Flushing",
    "Elmhurst",
    "Corona",
    "Astoria",
    "Richmond Hill",
    "Jamaica",
    "Woodside",
  ],
  "The Bronx": [
    "Grand Concourse",
    "Fordham",
    "Morris Heights",
    "Parkchester",
    "Soundview",
  ],
  "Staten Island": [
    "Park Hill",
    "Tompkinsville",
    "St. George",
    "Port Richmond",
  ],
};

// ---------------------------------------------------------------------------
// New York STATE — NYIC serves the whole state, not just the five boroughs.
// Cities outside NYC, grouped by region, for the State-wide constellation.
// ---------------------------------------------------------------------------
export type NyCity = {
  name: string;
  region: string;
  coord: [number, number];
  weight: number;
};

export const NY_CITIES: NyCity[] = [
  // Long Island
  { name: "Hempstead", region: "Long Island", coord: [40.71, -73.62], weight: 6 },
  { name: "Brentwood", region: "Long Island", coord: [40.78, -73.25], weight: 5 },
  { name: "Long Beach", region: "Long Island", coord: [40.59, -73.66], weight: 3 },
  // Lower Hudson Valley / Westchester
  { name: "Yonkers", region: "Hudson Valley", coord: [40.93, -73.9], weight: 7 },
  { name: "New Rochelle", region: "Hudson Valley", coord: [40.91, -73.78], weight: 4 },
  { name: "White Plains", region: "Hudson Valley", coord: [41.03, -73.76], weight: 3 },
  { name: "Newburgh", region: "Hudson Valley", coord: [41.5, -74.01], weight: 3 },
  { name: "Poughkeepsie", region: "Hudson Valley", coord: [41.7, -73.92], weight: 3 },
  { name: "Spring Valley", region: "Hudson Valley", coord: [41.11, -74.04], weight: 2 },
  // Capital Region
  { name: "Albany", region: "Capital Region", coord: [42.65, -73.75], weight: 5 },
  { name: "Schenectady", region: "Capital Region", coord: [42.81, -73.94], weight: 3 },
  { name: "Troy", region: "Capital Region", coord: [42.73, -73.69], weight: 2 },
  // Central NY
  { name: "Syracuse", region: "Central NY", coord: [43.05, -76.15], weight: 5 },
  { name: "Utica", region: "Central NY", coord: [43.1, -75.23], weight: 4 },
  { name: "Binghamton", region: "Southern Tier", coord: [42.1, -75.91], weight: 2 },
  { name: "Ithaca", region: "Southern Tier", coord: [42.44, -76.5], weight: 2 },
  // Finger Lakes / Western NY
  { name: "Rochester", region: "Finger Lakes", coord: [43.16, -77.61], weight: 6 },
  { name: "Buffalo", region: "Western NY", coord: [42.89, -78.88], weight: 7 },
  { name: "Niagara Falls", region: "Western NY", coord: [43.09, -79.06], weight: 2 },
  // North Country
  { name: "Watertown", region: "North Country", coord: [43.97, -75.91], weight: 1 },
];

// Weighted pool of statewide cities for the generator.
export const NY_CITY_POOL: NyCity[] = NY_CITIES.flatMap((c) =>
  Array.from({ length: c.weight }, () => c)
);

// Fast lookup from a "City, NY" location string back to its coord/region.
const NY_CITY_BY_NAME = new Map(NY_CITIES.map((c) => [c.name, c]));

// Match a location string to a borough (handles "Bronx" vs "The Bronx", etc.).
const BOROUGH_MATCH: [string, RegExp][] = [
  ["Manhattan", /manhattan|harlem|chinatown|inwood|washington heights|lower east/i],
  ["Brooklyn", /brooklyn|flatbush|bushwick|crown heights|bensonhurst|bay ridge|sunset park|brighton/i],
  ["Queens", /queens|astoria|jackson heights|flushing|elmhurst|corona|woodside|richmond hill|jamaica/i],
  ["The Bronx", /bronx|fordham|parkchester|soundview|grand concourse|morris heights/i],
  ["Staten Island", /staten|park hill|tompkinsville|st\.? george|port richmond/i],
];

/** Borough a story belongs to (NYC only), or null for statewide/upstate. */
export function boroughOf(location: string): string | null {
  for (const [name, re] of BOROUGH_MATCH) {
    if (re.test(location)) return name;
  }
  return null;
}

/**
 * Where a story sits on the State-wide map: its borough centroid (NYC) or its
 * upstate/LI city. Returns a stable key, label, region, and coordinate.
 */
export function statePlaceOf(
  location: string
): { key: string; label: string; region: string; coord: [number, number] } | null {
  const borough = boroughOf(location);
  if (borough) {
    return {
      key: borough,
      label: borough,
      region: "New York City",
      coord: BOROUGH_COORD[borough],
    };
  }
  const cityName = location.split(",")[0].trim();
  const city = NY_CITY_BY_NAME.get(cityName);
  if (city) {
    return { key: city.name, label: city.name, region: city.region, coord: city.coord };
  }
  return null;
}
