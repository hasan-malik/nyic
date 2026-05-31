import type { Story } from "./types";

// Zero-cost text analytics computed entirely client-side from transcripts we
// already have — no extra API calls. Powers the word cloud + keyword insights.

const STOPWORDS = new Set(
  `the a an and or but if then so of to in on at for with from by as is are was
   were be been being i you he she it we they me him her us them my your his its
   our their this that these those not no yes do does did doing have has had
   having will would can could should may might must shall am what which who whom
   when where why how all any both each few more most other some such only own
   same than too very just about into over after before up down out off again
   here there once because while during above below between only really felt feel
   like get got go going one two day days time times know think want said say says
   even still much many people thing things first new york yorkers immigrant
   immigrants`.split(/\s+/)
);

export interface Word {
  text: string;
  count: number;
}

export function wordFrequencies(stories: Story[], limit = 40): Word[] {
  const counts = new Map<string, number>();
  for (const s of stories) {
    const words = `${s.transcript} ${s.pullQuote}`
      .toLowerCase()
      .replace(/[^a-z'\s]/g, " ")
      .split(/\s+/);
    for (const w of words) {
      if (w.length < 4 || STOPWORDS.has(w)) continue;
      counts.set(w, (counts.get(w) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/** Collection volume for the last 12 months, chronological. */
export function collectionByMonth(stories: Story[]): { label: string; count: number }[] {
  const counts = new Map<string, number>(); // YYYY-MM -> count
  for (const s of stories) {
    const d = new Date(s.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  // build the last 12 month buckets in order
  const out: { label: string; count: number }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    out.push({
      label: d.toLocaleString("en-US", { month: "short" }),
      count: counts.get(key) ?? 0,
    });
  }
  return out;
}
