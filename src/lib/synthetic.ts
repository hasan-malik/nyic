import type { Story, StoryTag } from "./types";
import { SEED_STORIES } from "./seed";
import { BOROUGHS, NEIGHBORHOODS, NY_CITY_POOL, ORIGIN_POOL } from "./geo";
import {
  EMOTION_TAGS,
  LIFE_STAGES,
  STRUGGLE_TAGS,
  THEME_TAGS,
  TOPIC_TAGS,
  deriveContextTags,
  mergeTags,
} from "./tags";

// Deterministically generates a large, realistic background archive so the
// counts, maps, and globe feel like a living movement — while the curated seed
// stories remain the rich, clickable "hero" voices. Synthetic stories are
// NOT persisted to localStorage (see store.ts); they're regenerated identically
// on every load from a fixed seed.

const TOTAL_PUBLISHED_TARGET = 3761;

// tiny seeded RNG (mulberry32) for stable output
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NAMES = [
  "Maria", "José", "Ana", "Mohammed", "Fatima", "Wei", "Mei", "Aisha", "Kwame",
  "Priya", "Ravi", "Sofia", "Luis", "Carmen", "Ibrahim", "Yusuf", "Grace",
  "Daniel", "Elena", "Hassan", "Leila", "Min-jun", "Thanh", "Olu", "Amara",
  "Diego", "Rosa", "Sunil", "Nadia", "Kofi", "Yara", "Tenzin", "Pedro", "Lin",
  "Aaliyah", "Marco", "Svetlana", "Mateo", "Zara", "Emeka", "Camila", "Dmitri",
];

const MEMBER_ORGS = [
  "Make the Road New York", "Chinese-American Planning Council", "UnLocal",
  "African Communities Together", "DRUM – Desis Rising Up & Moving",
  "Arab American Association of New York", "MinKwon Center for Community Action",
  "Mixteca Organization", "Damayan", "Adhikaar", "New York Legal Assistance Group",
  "Violence Intervention Program", "Neighbors Link", "Catholic Charities",
];

const LANGUAGES = [
  "Spanish", "Mandarin", "Cantonese", "Bengali", "Arabic", "French", "Wolof",
  "Korean", "Haitian Creole", "Punjabi", "Urdu", "Russian", "Igbo", "Twi",
  "Nepali", "Vietnamese", "Tagalog", "English",
];

const PULL_QUOTES = [
  "I belong here not because of what I give, but because someone chose me.",
  "My worth did not start at a paycheck.",
  "The day a stranger learned my name, I stopped being invisible.",
  "We did not come to take. We came to set one more place at the table.",
  "Belonging is not a transaction. It is a block party in the dark.",
  "I was a whole person long before this city asked what I do.",
  "On Saturdays I was a teacher. History forgets that part.",
  "Home is the chair where strangers become aunties.",
  "I kept my mother's language. That was my act of resistance.",
  "Someone called me by my real name, and the city finally felt like mine.",
  "I am more than the work my hands have done.",
  "We taught each other to belong, one basement at a time.",
  "The first winter, a stranger walked me to my bus stop. I never forgot.",
  "My grandmother's recipe is my passport.",
  "I did not earn my place. I was always already here.",
  "When they came for one of us, the whole block came outside.",
];

const SENTIMENTS: Story["sentiment"][] = [
  "hopeful", "hopeful", "uplifting", "uplifting", "bittersweet", "somber",
];

// extra mood tags beyond the base sentiment, for richer emotional texture
const EXTRA_MOODS = EMOTION_TAGS.filter(
  (m) => !["Hopeful", "Uplifting", "Bittersweet", "Somber"].includes(m)
);

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function baseEmotion(sentiment: Story["sentiment"]): string {
  return sentiment === "uplifting"
    ? "Uplifting"
    : sentiment === "somber"
      ? "Somber"
      : sentiment === "bittersweet"
        ? "Bittersweet"
        : "Hopeful";
}

// Rich, multi-dimensional tags: two themes, a topic, a struggle, mood(s), a
// life stage, plus context tags (heritage, NY region, member org).
function buildSyntheticTags(
  rng: () => number,
  origin: string,
  location: string,
  memberOrg: string,
  sentiment: Story["sentiment"]
): StoryTag[] {
  const generated: StoryTag[] = [
    { label: "Belonging", category: "theme" },
    { label: pick(rng, THEME_TAGS), category: "theme" },
    { label: pick(rng, THEME_TAGS), category: "theme" },
    { label: pick(rng, TOPIC_TAGS), category: "topic" },
    { label: pick(rng, STRUGGLE_TAGS), category: "struggle" },
    { label: baseEmotion(sentiment), category: "emotion" },
    { label: pick(rng, LIFE_STAGES), category: "lifeStage" },
  ];
  if (rng() < 0.5) {
    generated.push({ label: pick(rng, EXTRA_MOODS), category: "emotion" });
  }
  return mergeTags(generated, deriveContextTags(origin, location, memberOrg));
}

function generate(): Story[] {
  const rng = mulberry32(20260531);
  const publishedSeed = SEED_STORIES.filter((s) => s.status === "published").length;
  const count = Math.max(0, TOTAL_PUBLISHED_TARGET - publishedSeed);
  const out: Story[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    // ~85% of stories sit in the five boroughs; the rest are spread across the
    // rest of New York State (NYIC is a statewide coalition).
    let location: string;
    if (rng() < 0.85) {
      const borough = pick(rng, BOROUGHS as unknown as string[]);
      const hood = pick(rng, NEIGHBORHOODS[borough]);
      location = `${hood}, ${borough}`;
    } else {
      const city = pick(rng, NY_CITY_POOL);
      location = `${city.name}, NY`;
    }
    const origin = pick(rng, ORIGIN_POOL);
    const sentiment = pick(rng, SENTIMENTS);
    const quote = pick(rng, PULL_QUOTES);
    const name = pick(rng, NAMES);
    const memberOrg = pick(rng, MEMBER_ORGS);
    const track = rng() < 0.25 ? "legacy" : "new";
    // spread creation across the last ~22 months
    const daysAgo = Math.floor(rng() * 670);
    const createdAt = new Date(now - daysAgo * 86400000).toISOString();

    out.push({
      id: `syn_${i}`,
      memberOrg,
      track,
      narratorDisplay: name,
      interviewerName: "A friend",
      location,
      origin,
      yearsInNY: 1 + Math.floor(rng() * 39),
      status: "published",
      stages: [],
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      durationSec: 120 + Math.floor(rng() * 180),
      language: pick(rng, LANGUAGES),
      transcript: `${quote} ${name} shared this in a five-minute interview with a friend, in ${pick(rng, LANGUAGES)}.`,
      summary: quote,
      pullQuote: quote,
      tags: buildSyntheticTags(rng, origin, location, memberOrg, sentiment),
      sentiment,
      moderation: { flagged: false, sensitive: false },
      consent: {
        publicShare: true,
        identity: "name",
        displayName: name,
        anonymizeVoice: false,
        allowCampaignUse: rng() < 0.8,
      },
      featured: false,
      animationStatus: rng() < 0.04 ? "rendered" : "none",
      nominations: Math.floor(rng() * 4),
      views: Math.floor(rng() * 4000),
      createdAt,
      cta: { label: "Add your voice", href: "/share" },
    });
  }
  return out;
}

export const SYNTHETIC_STORIES: Story[] = generate();
