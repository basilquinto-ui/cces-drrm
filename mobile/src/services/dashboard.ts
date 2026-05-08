import { supabase } from '@/lib/supabase';
import { today } from '@/utils/dates';

export type DashboardMetrics = {
  activeAlerts: number;
  openIncidents: number;
  todayCheckins: number;
  resolvedToday: number;
};

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const date = today();

  const [activeAlertsRes, openIncidentsRes, todayCheckinsRes, resolvedTodayRes] = await Promise.all([
    supabase.from('alerts').select('id', { count: 'exact', head: true }).eq('active', true),
    supabase.from('incidents').select('id', { count: 'exact', head: true }).neq('status', 'resolved'),
    supabase.from('checkins').select('id', { count: 'exact', head: true }).eq('date', date),
    supabase.from('incidents').select('id', { count: 'exact', head: true }).eq('status', 'resolved').gte('updated_at', `${date}T00:00:00Z`).lt('updated_at', `${date}T23:59:59Z`),
  ]);

  const firstError = [activeAlertsRes, openIncidentsRes, todayCheckinsRes, resolvedTodayRes].find((res) => res.error)?.error;
  if (firstError) throw new Error(firstError.message);

  return {
    activeAlerts: activeAlertsRes.count ?? 0,
    openIncidents: openIncidentsRes.count ?? 0,
    todayCheckins: todayCheckinsRes.count ?? 0,
    resolvedToday: resolvedTodayRes.count ?? 0,
  };
}
