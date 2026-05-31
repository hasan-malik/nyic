import type { Story } from "./types";

export interface TagCount {
  label: string;
  count: number;
}

/** Aggregate tag counts across stories, optionally within one category. */
export function tagCounts(
  stories: Story[],
  category?: Story["tags"][number]["category"]
): TagCount[] {
  const map = new Map<string, number>();
  for (const s of stories) {
    for (const t of s.tags) {
      if (category && t.category !== category) continue;
      map.set(t.label, (map.get(t.label) ?? 0) + 1);
    }
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export function sentimentBreakdown(stories: Story[]): TagCount[] {
  const map = new Map<string, number>();
  for (const s of stories) {
    map.set(s.sentiment, (map.get(s.sentiment) ?? 0) + 1);
  }
  return [...map.entries()].map(([label, count]) => ({ label, count }));
}

/** Stories grouped by the NYIC member org that collected them (coalition view). */
export function memberOrgBreakdown(stories: Story[]): TagCount[] {
  const map = new Map<string, number>();
  for (const s of stories) {
    if (!s.memberOrg) continue;
    map.set(s.memberOrg, (map.get(s.memberOrg) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export function originBreakdown(stories: Story[]): TagCount[] {
  const map = new Map<string, number>();
  for (const s of stories) {
    if (!s.origin || /withheld/i.test(s.origin)) continue;
    map.set(s.origin, (map.get(s.origin) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export interface DashboardStats {
  total: number;
  published: number;
  inReview: number;
  processing: number;
  totalNominations: number;
  totalMinutes: number;
  languages: number;
}

export function dashboardStats(stories: Story[]): DashboardStats {
  return {
    total: stories.length,
    published: stories.filter((s) => s.status === "published").length,
    inReview: stories.filter((s) => s.status === "in_review").length,
    processing: stories.filter((s) => s.status === "processing").length,
    totalNominations: stories.reduce((n, s) => n + s.nominations, 0),
    totalMinutes: Math.round(
      stories.reduce((n, s) => n + s.durationSec, 0) / 60
    ),
    languages: new Set(stories.flatMap((s) => s.language.split(/[+,]/).map((l) => l.trim()))).size,
  };
}

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
