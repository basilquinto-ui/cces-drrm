import { supabase } from '../lib/supabase'

export async function fetchPublicSafetyUpdates(limit = 6) {
  const { data, error } = await supabase
    .from('public_safety_updates')
    .select('id, title, message, category, severity, source, created_at, starts_at')
    .eq('published', true)
    .eq('active', true)
    .order('starts_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}
