import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://swksnhnsojlymsapcpoq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3a3NuaG5zb2pseW1zYXBjcG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODcxMjIsImV4cCI6MjA2Mzg2MzEyMn0.45MnMRdO4w26wZTtM82bFjL7GQEV1IBBAWdOxCOpTH4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  created_at: string;
};