import { supabase } from '../lib/supabase'

export const HAZARD_SUMMARY = [
  { area: 'Main Gate', risk: 'Low', note: 'Routine checks complete' },
  { area: 'Classroom Blocks', risk: 'Moderate', note: 'Wet floor monitoring' },
  { area: 'Covered Court', risk: 'Low', note: 'Cleared for activities' },
]

export async function fetchDashboardData() {
  const today = new Date().toISOString().split('T')[0]
  const [alertsRes, incidentsRes, checkinsRes, recentRes] = await Promise.all([
    supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('incidents').select('*', { count: 'exact', head: true }).neq('status', 'resolved'),
    supabase.from('checkins').select('*', { count: 'exact', head: true }).eq('date', today),
    supabase.from('incidents').select('id,location,status,created_at').order('created_at', { ascending: false }).limit(5),
  ])

  return {
    stats: {
      alerts: alertsRes.count || 0,
      incidents: incidentsRes.count || 0,
      checkins: checkinsRes.count || 0,
    },
    recentIncidents: recentRes.data || [],
    hazardSummary: HAZARD_SUMMARY,
  }
}
