/**
 * Check if Supabase environment variables are configured
 * Supports both NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_KEY naming conventions
 */
export function checkSupabaseEnv(): { valid: boolean; error?: string } {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === "production";
    return {
      valid: false,
      error: isProduction
        ? "Supabase URL is not set. Please configure NEXT_PUBLIC_SUPABASE_URL in your Vercel project settings (Settings > Environment Variables)."
        : "Supabase URL is not set. Please set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL in your .env.local file.",
    };
  }

  if (!supabaseKey) {
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === "production";
    return {
      valid: false,
      error: isProduction
        ? "Supabase key is not set. Please configure NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel project settings (Settings > Environment Variables)."
        : "Supabase key is not set. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_KEY in your .env.local file.",
    };
  }

  return { valid: true };
}

/**
 * Get Supabase URL from environment variables
 */
export function getSupabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ""
  );
}

/**
 * Get Supabase key from environment variables
 */
export function getSupabaseKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    ""
  );
}

