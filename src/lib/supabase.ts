import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env['VITE_SUPABASE_URL'] as string | undefined;
const supabaseAnonKey = import.meta.env['VITE_SUPABASE_ANON_KEY'] as string | undefined;

// Only create client if configured, otherwise provide a dummy that won't be used
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Create client only when properly configured
let supabaseClient: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  supabaseClient = createClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'implicit',
        storage: window.localStorage,
        storageKey: 'supabase.auth.token',
      },
    }
  );
}

// Export a proxy that throws helpful error if used when not configured
export const supabase = supabaseClient as SupabaseClient;
