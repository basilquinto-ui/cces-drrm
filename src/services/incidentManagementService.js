import { supabase } from '../lib/supabase'

const BASE_FIELDS = 'id, created_at, location, hazard_type, description, severity, photo_url, status, reported_by, admin_notes'

export async function fetchIncidents(filters = {}) {
  let query = supabase.from('incidents').select(BASE_FIELDS).order('created_at', { ascending: false })

  if (filters.status && filters.status !== 'all') query = query.eq('status', filters.status)
  if (filters.severity && filters.severity !== 'all') query = query.eq('severity', filters.severity)
  if (filters.hazardType && filters.hazardType !== 'all') query = query.eq('hazard_type', filters.hazardType)

  const { data, error } = await query
  if (error) throw new Error(error.message)

  const search = (filters.search || '').trim().toLowerCase()
  if (!search) return data || []

  return (data || []).filter((incident) => {
    const haystack = [incident.location, incident.reported_by, incident.description]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(search)
  })
}

export async function updateIncidentStatus(id, status) {
  const { data, error } = await supabase
    .from('incidents')
    .update({ status })
    .eq('id', id)
    .select(BASE_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateIncidentNotes(id, admin_notes) {
  const { data, error } = await supabase
    .from('incidents')
    .update({ admin_notes })
    .eq('id', id)
    .select(BASE_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return data
}
