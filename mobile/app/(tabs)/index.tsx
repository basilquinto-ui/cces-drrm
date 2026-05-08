import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Bell, ClipboardList, MapPinned, Phone, ShieldCheck, UserCheck, type LucideIcon } from 'lucide-react-native';
import { AppCard, BrandMark, EmptyState, ErrorState, LoadingState, Screen, SectionHeader, StatusBadge } from '@/components';
import { brand } from '@/constants/brand';
import { theme } from '@/constants/theme';
import { getDashboardMetrics, type DashboardMetrics } from '@/services/dashboard';

type MetricCardProps = { label: string; value: string; Icon: LucideIcon };
type QuickActionProps = { label: string; Icon: LucideIcon };

const EMPTY_METRICS: DashboardMetrics = { activeAlerts: 0, openIncidents: 0, todayCheckins: 0, resolvedToday: 0 };

function MetricCard({ label, value, Icon }: MetricCardProps) {
  return <AppCard style={styles.metricCard}><View style={styles.metricRow}><Text style={styles.metricLabel}>{label}</Text><Icon size={16} color={theme.colors.muted} strokeWidth={2.1} /></View><Text style={styles.metricValue}>{value}</Text></AppCard>;
}

function QuickAction({ label, Icon }: QuickActionProps) {
  return <Pressable style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}><Icon size={16} color={theme.colors.primary} strokeWidth={2.1} /><Text style={styles.actionLabel}>{label}</Text></Pressable>;
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

      {loading ? <LoadingState message="Loading live dashboard metrics..." /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && isEmpty ? <EmptyState message="No live metrics yet for today. Submit a check-in or monitor alerts and incidents." /> : null}

      {!loading && !error ? <>
        <View style={styles.grid}>
          <MetricCard label="Active Alerts" value={`${data.activeAlerts}`} Icon={Bell} />
          <MetricCard label="Open Incidents" value={`${data.openIncidents}`} Icon={ClipboardList} />
        </View>
        <View style={styles.grid}>
          <MetricCard label="Staff Check-In" value={`${data.todayCheckins}`} Icon={UserCheck} />
          <MetricCard label="Resolved Today" value={`${data.resolvedToday}`} Icon={ShieldCheck} />
        </View>
      </> : null}

      <SectionHeader title="Quick Actions" subtitle="Preparedness and response tools" />
      <View style={styles.actionsGrid}>
        <QuickAction label="Report Incident" Icon={ClipboardList} />
        <QuickAction label="Check In" Icon={UserCheck} />
        <QuickAction label="View Alerts" Icon={Bell} />
        <QuickAction label="Emergency Contacts" Icon={Phone} />
        <QuickAction label="Evacuation Guide" Icon={MapPinned} />
      </View>
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
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  actionButton: { width: '48%', minHeight: 54, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.sm, backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionButtonPressed: { opacity: 0.75 },
  actionLabel: { color: theme.colors.text, fontWeight: '600', fontSize: 13 },
});
