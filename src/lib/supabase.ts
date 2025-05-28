import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase configuration is required');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    debug: true
  }
});

export type User = {
  id: string;
  email: string;
};

export type ToneProfile = {
  id: string;
  user_id: string;
  name: string;
  formality: number;
  brevity: number;
  humor: number;
  warmth: number;
  directness: number;
  expressiveness: number;
  summary: string;
  prompt: string;
  examples: string[];
  created_at: string;
};