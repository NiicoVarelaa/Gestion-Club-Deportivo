import { createClient } from '@supabase/supabase-js';

const SUPABASE_TIMEOUT = 10000; // 10 seconds

function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => controller.abort(), SUPABASE_TIMEOUT);

  return fetch(url, { ...options, signal })
    .finally(() => clearTimeout(timeoutId));
}

let supabaseInstance = null;

export function getSupabase() {
  if (!supabaseInstance) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) {
      const err = new Error('Supabase client is not configured');
      err.code = 'SUPABASE_NOT_CONFIGURED';
      throw err;
    }
    supabaseInstance = createClient(url, key, {
      global: {
        fetch: fetchWithTimeout,
      },
    });
  }
  return supabaseInstance;
}
