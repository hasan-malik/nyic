// Runtime configuration + backend selection.
//
// The app runs fully offline on seeded data by default (perfect for a live
// demo with no network risk). The moment real Supabase env vars are present,
// it transparently switches to the live backend + pipeline. Nothing else in
// the UI changes.

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfig = {
  url,
  anonKey,
};

/** True when a real Supabase project is wired up. */
export const isLiveBackend = Boolean(url && anonKey);

/** Label shown in the UI so demoers know which mode they're in. */
export const backendMode = isLiveBackend ? "live" : "demo";
