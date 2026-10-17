import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Checks whether Supabase public environment variables are present.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && anonKey && !url.includes('your-project-id'));
}

let publicClientInstance: SupabaseClient | null = null;

/**
 * Public Supabase Client (Browser and Server safe)
 * Uses NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * Restricted by PostgreSQL Row Level Security (RLS) policies.
 */
export function getSupabaseClient(): SupabaseClient {
  if (publicClientInstance) {
    return publicClientInstance;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url.includes('your-project-id')) {
    throw new Error(
      'Supabase credentials are not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'
    );
  }

  publicClientInstance = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return publicClientInstance;
}

/**
 * Server-Only Administrative Supabase Client
 * Uses SUPABASE_SERVICE_ROLE_KEY.
 *
 * CRITICAL SECURITY RULE:
 * This function MUST NEVER be called in browser/client components.
 * Throws immediately if invoked in a client-side environment.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error('SECURITY VIOLATION: getSupabaseAdminClient cannot be called from the browser.');
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey || serviceRoleKey.includes('your-service-role-key')) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not configured in .env.local. Admin operations require this server key.'
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
