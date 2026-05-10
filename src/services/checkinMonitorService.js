import { supabase } from '../lib/supabase'

const STATUS_KEYS = ['safe', 'needs_help', 'medical', 'evacuation', 'not_on_campus']

function getTodayDateKey() {
  return new Date().toISOString().slice(0, 10)
}

function getStaffName(staff) {
  return staff?.name || `Staff ID: ${staff?.id ?? 'Unknown'}`
}

function buildStatusCounts(checkins) {
  const counts = {
    totalCheckedIn: checkins.length,
    safe: 0,
    needs_help: 0,
    medical: 0,
    evacuation: 0,
    not_on_campus: 0,
  }

  checkins.forEach((item) => {
    if (STATUS_KEYS.includes(item.status)) counts[item.status] += 1
  })

  return counts
}

export async function fetchTodayCheckins() {
  const dateKey = getTodayDateKey()
  const { data, error } = await supabase
    .from('checkins')
    .select('id, created_at, staff_id, date, status')
    .eq('date', dateKey)
    .order('created_at', { ascending: false })

  if (error) throw error
  return { dateKey, checkinsToday: data || [] }
}

export async function fetchStaffRoster() {
  const { data, error } = await supabase
    .from('staff')
    .select('id, name, role, active')
    .eq('active', true)
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

export async function fetchCheckinMonitorSummary() {
  const { dateKey, checkinsToday } = await fetchTodayCheckins()

  let staffRoster = null
  let staffRosterAvailable = false
  try {
    staffRoster = await fetchStaffRoster()
    staffRosterAvailable = true
  } catch {
    staffRoster = null
    staffRosterAvailable = false
  }

  const staffById = new Map((staffRoster || []).map((item) => [item.id, item]))
  const rows = checkinsToday.map((item) => {
    const staff = staffById.get(item.staff_id)
    return {
      ...item,
      staffName: staff ? getStaffName(staff) : `Staff ID: ${item.staff_id}`,
    }
  })

  const statusCounts = buildStatusCounts(checkinsToday)
  const notCheckedInCount = staffRosterAvailable ? Math.max(staffRoster.length - checkinsToday.length, 0) : null

  return {
    dateKey,
    checkinsToday: rows,
    staffRoster,
    statusCounts,
    notCheckedInCount,
    staffRosterAvailable,
  }
}
