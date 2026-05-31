import type { Story } from "./types";

// "Belonging Circles" — the community-connection engine.
//
// In LIVE mode this runs on pgvector cosine similarity over story embeddings
// (semantic, language-agnostic). In DEMO mode we approximate that signal with
// tag/theme/sentiment overlap so the feature is fully demoable offline. Either
// way the output is identical: clusters of members who share a subtle thread,
// plus an AI-suggested monthly bonding session.

export interface Connection {
  a: Story;
  b: Story;
  score: number; // 0..1
  sharedThemes: string[];
}

export interface Circle {
  id: string;
  name: string; // AI-suggested ("Sonnet" in live mode)
  thread: string; // the subtle connection, in plain language
  members: Story[];
  sharedThemes: string[];
  /** Suggested monthly bonding session. */
  session: { title: string; prompt: string };
  strength: number; // avg pairwise similarity
}

function tagSet(s: Story): Set<string> {
  return new Set(s.tags.map((t) => t.label.toLowerCase()));
}

/** Jaccard overlap of themes + sentiment bump = stand-in for cosine similarity. */
export function similarity(a: Story, b: Story): Connection {
  const ta = tagSet(a);
  const tb = tagSet(b);
  const shared = [...ta].filter((x) => tb.has(x));
  const union = new Set([...ta, ...tb]);
  let score = union.size ? shared.length / union.size : 0;
  if (a.sentiment === b.sentiment) score += 0.12;
  if (a.origin === b.origin && !/withheld/i.test(a.origin)) score += 0.08;
  score = Math.min(1, score);
  return {
    a,
    b,
    score,
    sharedThemes: shared.map((s) =>
      a.tags.find((t) => t.label.toLowerCase() === s)!.label
    ),
  };
}

/** All meaningful pairwise connections above a threshold, strongest first. */
export function connections(stories: Story[], threshold = 0.18): Connection[] {
  const eligible = stories.filter((s) => s.tags.length > 0);
  const out: Connection[] = [];
  for (let i = 0; i < eligible.length; i++) {
    for (let j = i + 1; j < eligible.length; j++) {
      const c = similarity(eligible[i], eligible[j]);
      if (c.score >= threshold) out.push(c);
    }
  }
  return out.sort((x, y) => y.score - x.score);
}

const SESSION_IDEAS: Record<string, { title: string; prompt: string }> = {
  Belonging: {
    title: "The Welcome Table",
    prompt:
      "Share the first moment a stranger made you feel you belonged here.",
  },
  Motherhood: {
    title: "Mothers of New York",
    prompt: "What do you want your children to inherit about this city?",
  },
  Work: {
    title: "More Than Our Work",
    prompt: "Tell us who you were before anyone asked what you do.",
  },
  Family: {
    title: "Tables & Kitchens",
    prompt: "Bring the dish that tastes like home — and the story behind it.",
  },
  Resilience: {
    title: "What Carried Us",
    prompt: "Name the one phone call, person, or promise that kept you going.",
  },
  Legacy: {
    title: "40 Years, In Our Voices",
    prompt: "What has changed — and what hasn't — since you arrived?",
  },
};

function circleName(themes: string[]): string {
  const key = themes[0] ?? "Belonging";
  const names: Record<string, string> = {
    Belonging: "Chosen First",
    Motherhood: "The Mothers' Circle",
    Work: "Beyond the Paycheck",
    Family: "Kitchen-Table Coalition",
    Resilience: "What Carried Us",
    Legacy: "Keepers of the 40 Years",
    "40-year history": "Keepers of the 40 Years",
    Community: "Block by Block",
  };
  return names[key] ?? `The ${key} Circle`;
}

/**
 * Greedy clustering over the connection graph into Belonging Circles.
 * Each member joins the circle it connects to most strongly.
 */
export function belongingCircles(stories: Story[]): Circle[] {
  const conns = connections(stories, 0.2);
  const assigned = new Map<string, number>(); // storyId -> circle index
  const clusters: Story[][] = [];

  for (const c of conns) {
    const ia = assigned.get(c.a.id);
    const ib = assigned.get(c.b.id);
    if (ia === undefined && ib === undefined) {
      clusters.push([c.a, c.b]);
      const idx = clusters.length - 1;
      assigned.set(c.a.id, idx);
      assigned.set(c.b.id, idx);
    } else if (ia !== undefined && ib === undefined) {
      clusters[ia].push(c.b);
      assigned.set(c.b.id, ia);
    } else if (ib !== undefined && ia === undefined) {
      clusters[ib].push(c.a);
      assigned.set(c.a.id, ib);
    }
  }

  return clusters
    .filter((m) => m.length >= 2)
    .map((members, i) => {
      // shared themes across the whole circle
      const counts = new Map<string, number>();
      for (const m of members)
        for (const t of m.tags)
          counts.set(t.label, (counts.get(t.label) ?? 0) + 1);
      const shared = [...counts.entries()]
        .filter(([, n]) => n >= 2)
        .sort((a, b) => b[1] - a[1])
        .map(([label]) => label);

      const themeKey =
        shared.find((s) => SESSION_IDEAS[s]) ?? shared[0] ?? "Belonging";
      const session = SESSION_IDEAS[themeKey] ?? SESSION_IDEAS.Belonging;

      const pairScores: number[] = [];
      for (let x = 0; x < members.length; x++)
        for (let y = x + 1; y < members.length; y++)
          pairScores.push(similarity(members[x], members[y]).score);
      const strength = pairScores.length
        ? pairScores.reduce((s, n) => s + n, 0) / pairScores.length
        : 0;

      const names = members.map((m) => m.narratorDisplay).join(", ");
      return {
        id: `circle_${i}`,
        name: circleName(shared),
        thread: `${members.length} members — ${names} — share a thread around ${shared
          .slice(0, 3)
          .join(", ")}. Different countries, same heart.`,
        members,
        sharedThemes: shared.slice(0, 4),
        session,
        strength,
      } satisfies Circle;
    })
    .sort((a, b) => b.members.length - a.members.length);
}
