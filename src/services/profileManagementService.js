import { supabase } from '../lib/supabase'

const PROFILE_FIELDS = 'id, full_name, role, staff_id, active'
const STAFF_FIELD_CANDIDATES = ['id, name, role, active', 'id, full_name, role, active', 'id, name', 'id, full_name']

export async function fetchProfiles() {
  return supabase
    .from('profiles')
    .select(PROFILE_FIELDS)
    .order('full_name', { ascending: true })
}

export async function updateProfileRole(id, role) {
  return supabase.from('profiles').update({ role }).eq('id', id)
}

export async function updateProfileActive(id, active) {
  return supabase.from('profiles').update({ active }).eq('id', id)
}

export async function updateProfileStaffId(id, staff_id) {
  return supabase.from('profiles').update({ staff_id: staff_id || null }).eq('id', id)
}

export async function fetchStaffOptions() {
  for (const fields of STAFF_FIELD_CANDIDATES) {
    const result = await supabase.from('staff').select(fields).order('name', { ascending: true })
    if (!result.error) {
      return {
        data: (result.data || []).map((row) => ({
          id: row.id,
          label: row.name || row.full_name || row.id,
        })),
        error: null,
      }
    }
  }

  return { data: [], error: null }
}
