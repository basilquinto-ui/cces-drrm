import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Bell, ClipboardList, ShieldCheck, UserCheck, type LucideIcon } from 'lucide-react-native';
import { AppCard, BrandMark, DailyHazardMap, DashboardQuickActions, EmptyState, ErrorState, LoadingState, Screen, SectionHeader, StatusBadge, WeatherRiskCard } from '@/components';
import { brand } from '@/constants/brand';
import { theme } from '@/constants/theme';
import { getDashboardMetrics, type DashboardMetrics } from '@/services/dashboard';

type MetricCardProps = { label: string; value: string; Icon: LucideIcon };
const EMPTY_METRICS: DashboardMetrics = { activeAlerts: 0, openIncidents: 0, todayCheckins: 0, resolvedToday: 0 };

function MetricCard({ label, value, Icon }: MetricCardProps) {
  return <AppCard style={styles.metricCard}><View style={styles.metricRow}><Text style={styles.metricLabel}>{label}</Text><Icon size={16} color={theme.colors.muted} strokeWidth={2.1} /></View><Text style={styles.metricValue}>{value}</Text></AppCard>;
}

export default function DashboardScreen() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getDashboardMetrics();
        if (mounted) setMetrics(data);
      } catch {
        if (mounted) setError('Unable to load live dashboard metrics. Please try again.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const data = metrics ?? EMPTY_METRICS;
  const isEmpty = useMemo(() => Object.values(data).every((value) => value === 0), [data]);

  return (
    <Screen>
      <SectionHeader title={brand.appName} subtitle={brand.tagline} />

      <AppCard variant="highlight">
        <View style={styles.statusTitleRow}><BrandMark size="small" /><Text style={styles.metricLabel}>School Safety Status</Text></View>
        <StatusBadge label="Normal Operations" tone="info" />
        <Text style={styles.metricValue}>No active emergency reported</Text>
      </AppCard>

      <WeatherRiskCard />

      {loading ? <LoadingState message="Loading live dashboard metrics..." /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && isEmpty ? <EmptyState message="No live metrics yet for today. Submit a check-in or monitor alerts and incidents." /> : null}
      {!loading && !error ? <>
        <View style={styles.grid}><MetricCard label="Active Alerts" value={`${data.activeAlerts}`} Icon={Bell} /><MetricCard label="Open Incidents" value={`${data.openIncidents}`} Icon={ClipboardList} /></View>
        <View style={styles.grid}><MetricCard label="Staff Check-In" value={`${data.todayCheckins}`} Icon={UserCheck} /><MetricCard label="Resolved Today" value={`${data.resolvedToday}`} Icon={ShieldCheck} /></View>
      </> : null}

      <DashboardQuickActions />
      <DailyHazardMap />

      <SectionHeader title="Recent Incidents" subtitle="Most recent reports" />
      <EmptyState message="No incidents reported yet." />
    </Screen>
  );
}

const styles = StyleSheet.create({
  statusTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  metricRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  metricLabel: { color: theme.colors.muted, fontSize: 12, marginBottom: 6, fontWeight: '600' },
  metricValue: { color: theme.colors.text, fontWeight: '700', fontSize: 18, marginTop: 8 },
  grid: { flexDirection: 'row', gap: 10 },
  metricCard: { flex: 1, minHeight: 92 },
});
