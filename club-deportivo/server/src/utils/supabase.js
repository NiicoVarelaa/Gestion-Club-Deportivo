import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;

export function getSupabase() {
  if (!supabaseInstance) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set');
    }
    supabaseInstance = createClient(url, key);
  }
  return supabaseInstance;
}
