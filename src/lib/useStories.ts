import { useSyncExternalStore } from "react";
import { store } from "./store";
import type { Story } from "./types";

/** Subscribe a component to the live story list (re-renders on any change). */
export function useStories(): Story[] {
  return useSyncExternalStore(store.subscribe, store.all, store.all);
}

export function usePublishedStories(): Story[] {
  return useStories().filter((s) => s.status === "published");
}

export function useStory(id: string | undefined): Story | undefined {
  const stories = useStories();
  return stories.find((s) => s.id === id);
}
