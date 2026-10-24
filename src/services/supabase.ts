import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | undefined;

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
    string | undefined;
  if (!url || !key) throw new Error('Serviço de autenticação não configurado.');
  client = createClient(url, key, {
    // TanStack/UI owns explicit retries; the SDK otherwise retries 503 reads.
    db: { retry: false, timeout: 8000 },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
  return client;
}
