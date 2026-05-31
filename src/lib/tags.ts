import type { StoryTag } from "./types";
import { statePlaceOf } from "./geo";

// Rich, multi-dimensional tag taxonomy. In LIVE mode Claude Sonnet produces
// these from the transcript (see supabase/functions/process-story); in DEMO
// mode the synthetic generator samples from the same pools so the analytics,
// filters, and Threads galaxy feel real and varied.

export const THEME_TAGS = [
  "Belonging",
  "Family",
  "Community",
  "Resilience",
  "Motherhood",
  "Fatherhood",
  "Legacy",
  "Work",
  "Faith",
  "Education",
  "Language",
  "Food",
  "Home",
  "Identity",
  "Tradition",
  "Friendship",
  "Generations",
  "Dreams",
  "Sacrifice",
  "Celebration",
];

export const TOPIC_TAGS = [
  "Small business",
  "Education",
  "Healthcare",
  "Housing",
  "Food & cuisine",
  "Faith community",
  "Arts & music",
  "Labor & unions",
  "Mutual aid",
  "Language access",
  "Civic life",
  "Youth programs",
];

export const STRUGGLE_TAGS = [
  "Starting over",
  "Language barrier",
  "Detention",
  "Family separation",
  "Fear of deportation",
  "Finding housing",
  "Healthcare access",
  "Workplace exploitation",
  "Discrimination",
  "Seeking asylum",
  "Documentation",
  "Loneliness",
  "Sending money home",
];

export const EMOTION_TAGS = [
  "Hopeful",
  "Uplifting",
  "Bittersweet",
  "Somber",
  "Proud",
  "Nostalgic",
  "Grateful",
  "Resolute",
];

export const LIFE_STAGES = ["Youth", "Young adult", "Middle age", "Elder"];

// Country → cultural / diaspora heritage. Built from groups so the long tail
// of 120+ countries all resolve to a meaningful background.
const HERITAGE_GROUPS: Record<string, string[]> = {
  Caribbean: [
    "Jamaica",
    "Haiti",
    "Trinidad & Tobago",
    "Guyana",
    "Cuba",
    "Puerto Rico",
    "Dominican Republic",
    "Barbados",
    "Grenada",
    "St. Lucia",
    "Dominica",
  ],
  "Mexican & Central American": [
    "Mexico",
    "El Salvador",
    "Guatemala",
    "Honduras",
    "Nicaragua",
    "Costa Rica",
    "Panama",
    "Belize",
  ],
  "South American": [
    "Ecuador",
    "Colombia",
    "Peru",
    "Bolivia",
    "Chile",
    "Argentina",
    "Venezuela",
    "Brazil",
    "Paraguay",
    "Uruguay",
  ],
  "South Asian": [
    "India",
    "Bangladesh",
    "Pakistan",
    "Nepal",
    "Sri Lanka",
    "Afghanistan",
    "Bhutan",
  ],
  "East Asian": ["China", "Korea", "Japan", "Taiwan", "Hong Kong", "Mongolia", "Tibet"],
  "Southeast Asian": [
    "Philippines",
    "Vietnam",
    "Indonesia",
    "Thailand",
    "Myanmar",
    "Malaysia",
    "Cambodia",
    "Laos",
    "Singapore",
  ],
  "West African": [
    "Nigeria",
    "Ghana",
    "Senegal",
    "Liberia",
    "Ivory Coast",
    "Guinea",
    "Mali",
    "Sierra Leone",
    "Gambia",
    "Togo",
    "Burkina Faso",
    "Cameroon",
  ],
  "East African": [
    "Ethiopia",
    "Kenya",
    "Somalia",
    "Uganda",
    "Tanzania",
    "Eritrea",
    "Rwanda",
  ],
  "Central & Southern African": [
    "South Africa",
    "Zimbabwe",
    "Congo",
    "Sudan",
    "Angola",
  ],
  "Middle Eastern & North African": [
    "Yemen",
    "Egypt",
    "Lebanon",
    "Syria",
    "Iran",
    "Iraq",
    "Israel",
    "Jordan",
    "Saudi Arabia",
    "Morocco",
    "Algeria",
    "Tunisia",
    "Turkey",
    "Palestine",
    "Kuwait",
  ],
  "Eastern European & Central Asian": [
    "Poland",
    "Russia",
    "Ukraine",
    "Albania",
    "Romania",
    "Serbia",
    "Bosnia",
    "Bulgaria",
    "Hungary",
    "Moldova",
    "Czech Republic",
    "Croatia",
    "Lithuania",
    "Georgia",
    "Armenia",
    "Azerbaijan",
    "Uzbekistan",
    "Kazakhstan",
  ],
  European: [
    "Italy",
    "Ireland",
    "United Kingdom",
    "Greece",
    "Germany",
    "France",
    "Spain",
    "Portugal",
    "Netherlands",
    "Sweden",
  ],
  Pacific: ["Australia", "Fiji"],
};

export const HERITAGE_BY_COUNTRY: Record<string, string> = Object.fromEntries(
  Object.entries(HERITAGE_GROUPS).flatMap(([heritage, countries]) =>
    countries.map((c) => [c, heritage])
  )
);

/** Cultural heritage for an origin country (null if unknown / withheld). */
export function heritageOf(origin: string): string | null {
  if (!origin || /withheld/i.test(origin)) return null;
  return HERITAGE_BY_COUNTRY[origin] ?? null;
}

/**
 * Context tags derivable straight from a story's metadata (no transcript
 * needed): cultural heritage, NY region, and the member org. Used to enrich
 * both the curated seed stories and the synthetic archive.
 */
export function deriveContextTags(
  origin: string,
  location: string,
  memberOrg?: string
): StoryTag[] {
  const out: StoryTag[] = [];
  const heritage = heritageOf(origin);
  if (heritage) out.push({ label: heritage, category: "heritage" });
  const place = statePlaceOf(location);
  if (place) out.push({ label: place.region, category: "region" });
  if (memberOrg) out.push({ label: memberOrg, category: "org" });
  return out;
}

/** Merge tag lists, de-duplicating by label (first wins). */
export function mergeTags(...lists: StoryTag[][]): StoryTag[] {
  const seen = new Set<string>();
  const out: StoryTag[] = [];
  for (const list of lists) {
    for (const t of list) {
      const key = t.label.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(t);
    }
  }
  return out;
}
