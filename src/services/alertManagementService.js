import { supabase } from '../lib/supabase'

const TABLE = 'alerts'

const applyFilters = (query, filters = {}) => {
  const { activeStatus = 'all', level = 'all', hazardType = 'all', search = '' } = filters
  let next = query

  if (activeStatus === 'active') next = next.eq('active', true)
  if (activeStatus === 'inactive') next = next.eq('active', false)
  if (level !== 'all') next = next.eq('level', level)
  if (hazardType !== 'all') next = next.eq('hazard_type', hazardType)
  if (search.trim()) next = next.or(`message.ilike.%${search.trim()}%,issued_by.ilike.%${search.trim()}%`)

  return next
}

export async function fetchAlerts(filters = {}) {
  let query = supabase
    .from(TABLE)
    .select('id, created_at, hazard_type, level, message, issued_by, active')
    .order('created_at', { ascending: false })

  query = applyFilters(query, filters)

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function createAlert(payload) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      hazard_type: payload.hazard_type,
      level: payload.level,
      message: payload.message,
      issued_by: payload.issued_by,
      active: payload.active ?? true,
    })
    .select('id')
    .single()

  if (error) throw error
  return data
}

export async function updateAlertActive(id, active) {
  const { error } = await supabase.from(TABLE).update({ active }).eq('id', id)
  if (error) throw error
}
