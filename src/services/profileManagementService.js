import { supabase } from '../lib/supabase'

const PROFILE_FIELDS = 'id, full_name, role, staff_id, active, email'
const STAFF_ROLE_FIELDS = ['id, full_name, role, active', 'id, name, role, active', 'id, full_name', 'id, name']

export async function fetchProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_FIELDS)
    .order('full_name', { ascending: true })

  if (error && error.message?.toLowerCase().includes('email')) {
    const fallback = await supabase
      .from('profiles')
      .select('id, full_name, role, staff_id, active')
      .order('full_name', { ascending: true })
    return fallback
  }

  return { data, error }
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
  for (const fields of STAFF_ROLE_FIELDS) {
    const { data, error } = await supabase.from('staff').select(fields).order('id', { ascending: true })
    if (!error) {
      return {
        data: (data || []).map((row) => ({
          id: row.id,
          label: row.full_name || row.name || row.id,
          role: row.role || null,
          active: row.active,
        })),
        error: null,
      }
    }
  }

  return { data: [], error: null }
}
