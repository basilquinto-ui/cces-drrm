import { supabase } from '../lib/supabase'

const STATUS_ORDER = ['safe', 'needs_help', 'medical', 'evacuation', 'not_on_campus']

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function getStaffName(staff) {
  if (staff.name) return staff.name
  if (staff.full_name) return staff.full_name
  const full = [staff.first_name, staff.last_name].filter(Boolean).join(' ').trim()
  return full || `Staff #${staff.id}`
}

function isActiveStaff(staff) {
  if (!Object.prototype.hasOwnProperty.call(staff, 'active')) return true
  return staff.active !== false
}

function toStatusCounts(checkins) {
  const base = {
    totalCheckedIn: checkins.length,
    safe: 0,
    needs_help: 0,
    medical: 0,
    evacuation: 0,
    not_on_campus: 0,
  }

  checkins.forEach((checkin) => {
    if (STATUS_ORDER.includes(checkin.status)) base[checkin.status] += 1
  })

  return base
}

export async function fetchCheckinMonitorData() {
  const dateKey = getTodayKey()

  const [checkinsRes, staffRes] = await Promise.all([
    supabase
      .from('checkins')
      .select('id, created_at, staff_id, date, status')
      .eq('date', dateKey)
      .order('created_at', { ascending: false }),
    supabase
      .from('staff')
      .select('id, name, full_name, first_name, last_name, role, position, active')
      .order('name', { ascending: true }),
  ])

  const checkinsError = checkinsRes.error
  const staffError = staffRes.error
  if (checkinsError) throw checkinsError

  const checkins = checkinsRes.data || []
  const staff = staffError ? null : (staffRes.data || []).filter(isActiveStaff)

  const rosterById = new Map((staff || []).map(item => [item.id, item]))

  const checkinRows = checkins.map((checkin) => {
    const roster = rosterById.get(checkin.staff_id)
    return {
      ...checkin,
      staffName: roster ? getStaffName(roster) : `Staff #${checkin.staff_id}`,
      role: roster?.role || roster?.position || 'Unknown role',
    }
  })

  const statusCounts = toStatusCounts(checkins)
  const notCheckedInCount = staff ? Math.max(staff.length - checkins.length, 0) : null

  return {
    dateKey,
    staffAvailable: Boolean(staff),
    staffCount: staff?.length ?? null,
    statusCounts: {
      ...statusCounts,
      not_checked_in: notCheckedInCount,
    },
    checkinRows,
  }
}
