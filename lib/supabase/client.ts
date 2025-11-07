import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseUrl, getSupabaseKey } from "./check-env";

export function createClient() {
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseKey();

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase URL and key must be set. Please check your environment variables."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}

