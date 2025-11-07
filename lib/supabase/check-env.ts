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
    return {
      valid: false,
      error:
        "Supabase URL is not set. Please set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL in your .env.local file.",
    };
  }

  if (!supabaseKey) {
    return {
      valid: false,
      error:
        "Supabase key is not set. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_KEY in your .env.local file.",
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

