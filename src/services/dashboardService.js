import { supabase } from '../lib/supabase'

const OPEN_STATUSES = ['reported', 'acknowledged', 'responding']

function todayRange() {
  const now = new Date()
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(end.getDate() + 1)

  return { startIso: start.toISOString(), endIso: end.toISOString(), dateKey: start.toISOString().slice(0, 10) }
}

export async function fetchDashboardSummary() {
  const { startIso, endIso, dateKey } = todayRange()

  const [
    activeAlertsRes,
    openIncidentsRes,
    checkinsTodayRes,
    resolvedTodayRes,
    recentIncidentsRes,
  ] = await Promise.all([
    supabase.from('alerts').select('id', { count: 'exact', head: true }).eq('active', true),
    supabase.from('incidents').select('id', { count: 'exact', head: true }).in('status', OPEN_STATUSES),
    supabase.from('checkins').select('id', { count: 'exact', head: true }).eq('date', dateKey),
    supabase.from('incidents').select('id', { count: 'exact', head: true }).eq('status', 'resolved').gte('created_at', startIso).lt('created_at', endIso),
    supabase
      .from('incidents')
      .select('id, created_at, location, hazard_type, severity, status, reported_by')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const firstError = [
    activeAlertsRes.error,
    openIncidentsRes.error,
    checkinsTodayRes.error,
    resolvedTodayRes.error,
    recentIncidentsRes.error,
  ].find(Boolean)

  if (firstError) throw firstError

  return {
    activeAlertsCount: activeAlertsRes.count ?? 0,
    openIncidentsCount: openIncidentsRes.count ?? 0,
    staffCheckinsTodayCount: checkinsTodayRes.count ?? 0,
    resolvedIncidentsTodayCount: resolvedTodayRes.count ?? 0,
    recentIncidents: recentIncidentsRes.data || [],
  }
}
