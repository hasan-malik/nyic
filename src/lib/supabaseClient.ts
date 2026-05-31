import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseConfig, isLiveBackend } from "./config";

// Only instantiated when real env vars are present. In demo mode this is null
// and the app uses the local seeded store instead.
export const supabase: SupabaseClient | null = isLiveBackend
  ? createClient(supabaseConfig.url!, supabaseConfig.anonKey!)
  : null;
