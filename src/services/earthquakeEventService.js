import { supabase } from '../lib/supabase'

export async function fetchActiveEarthquakeEvents() {
  const { data, error } = await supabase
    .from('earthquake_events')
    .select('*')
    .eq('active', true)
    .eq('is_relevant_to_school', true)
    .in('relevance_scope', ['quezon_city', 'camp_crame', 'ncr'])
    .order('event_time', { ascending: false })
    .limit(20)

  if (error) throw error
  return data || []
}

export async function createEarthquakeEvent(payload) {
  const { data, error } = await supabase.from('earthquake_events').insert(payload).select('*').single()
  if (error) throw error
  return data
}

export async function updateEarthquakeEvent(id, payload) {
  const { data, error } = await supabase.from('earthquake_events').update(payload).eq('id', id).select('*').single()
  if (error) throw error
  return data
}

export async function resolveEarthquakeEvent(id) {
  return updateEarthquakeEvent(id, { active: false })
}
