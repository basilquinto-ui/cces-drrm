import { supabase } from '../lib/supabase'

export async function fetchActiveOfficialAdvisories() {
  const { data, error } = await supabase
    .from('official_advisories')
    .select('*')
    .eq('active', true)
    .eq('is_relevant_to_school', true)
    .in('relevance_scope', ['quezon_city', 'camp_crame', 'ncr'])
    .order('effective_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function createOfficialAdvisory(payload) {
  const { data, error } = await supabase.from('official_advisories').insert(payload).select('*').single()
  if (error) throw error
  return data
}

export async function updateOfficialAdvisory(id, payload) {
  const { data, error } = await supabase.from('official_advisories').update(payload).eq('id', id).select('*').single()
  if (error) throw error
  return data
}

export async function resolveOfficialAdvisory(id) {
  return updateOfficialAdvisory(id, { active: false, updated_at: new Date().toISOString() })
}
