import type { Story } from "./types";
import { SEED_STORIES } from "./seed";

// Tiny localStorage-backed store with a pub/sub so the UI stays in sync.
// This is the "demo" backend; the live backend (Supabase) mirrors this API.
//
// Snapshots are memoized so `all()` returns a STABLE reference between
// mutations — required by useSyncExternalStore (otherwise it loops forever).

const KEY = "ichoose_stories_v1";
type Listener = () => void;
const listeners = new Set<Listener>();

let cache: Story[] | null = null; // raw, insertion order
let sortedCache: Story[] | null = null; // memoized sorted snapshot

function loadFromStorage(): Story[] {
  if (typeof localStorage === "undefined") return [...SEED_STORIES];
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(SEED_STORIES));
    return [...SEED_STORIES];
  }
  try {
    return JSON.parse(raw) as Story[];
  } catch {
    return [...SEED_STORIES];
  }
}

function raw(): Story[] {
  if (!cache) cache = loadFromStorage();
  return cache;
}

function commit(next: Story[]) {
  cache = next;
  sortedCache = null; // invalidate memoized snapshot
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(next));
  }
  listeners.forEach((l) => l());
}

export const store = {
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },

  /** Stable, memoized, newest-first snapshot. */
  all(): Story[] {
    if (!sortedCache) {
      sortedCache = [...raw()].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt)
      );
    }
    return sortedCache;
  },

  get(id: string): Story | undefined {
    return raw().find((s) => s.id === id);
  },

  add(story: Story) {
    commit([story, ...raw()]);
  },

  update(id: string, patch: Partial<Story>) {
    commit(raw().map((s) => (s.id === id ? { ...s, ...patch } : s)));
  },

  /** Wipe local edits and restore the curated seed set (handy before a demo). */
  reset() {
    if (typeof localStorage !== "undefined") localStorage.removeItem(KEY);
    cache = null;
    sortedCache = null;
    commit(loadFromStorage());
  },
};
