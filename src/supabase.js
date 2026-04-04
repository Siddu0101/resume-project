import { createClient } from '@supabase/supabase-js';

// ─── Replace these with your actual Supabase project values ───
// You can find them in: Supabase Dashboard → Settings → API
const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ─── Database helpers ─────────────────────────────────────────

/** Load a user's saved progress row (creates one if missing) */
export async function loadUserProgress(userId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code === 'PGRST116') {
    // Row doesn't exist yet — create it
    const { data: newRow } = await supabase
      .from('user_progress')
      .insert({ user_id: userId })
      .select()
      .single();
    return newRow;
  }
  return data;
}

/** Upsert (save/update) any fields in a user's progress row */
export async function saveUserProgress(userId, updates) {
  const { error } = await supabase
    .from('user_progress')
    .upsert({ user_id: userId, ...updates, updated_at: new Date().toISOString() });
  return !error;
}

/** Log a resume scan event */
export async function logResumeScan(userId, summary) {
  await supabase.from('resume_scans').insert({
    user_id: userId,
    summary,
    scanned_at: new Date().toISOString(),
  });
}
