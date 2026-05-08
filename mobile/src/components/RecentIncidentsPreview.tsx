import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppCard } from '@/components/AppCard';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { SectionHeader } from '@/components/SectionHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { theme } from '@/constants/theme';
import { getRecentIncidents, type RecentIncident } from '@/services/incidents';
import { formatDateTime } from '@/utils/formatters';

const toneMap: Record<string, 'danger' | 'warning' | 'success' | 'info'> = {
  severe: 'danger',
  moderate: 'warning',
  minor: 'success',
  reported: 'warning',
  acknowledged: 'info',
  responding: 'warning',
  resolved: 'success',
};

const toTone = (value: string | null) => toneMap[value?.toLowerCase() ?? ''] ?? 'info';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function IncidentCard({ incident }: { incident: RecentIncident }) {
  const severity = incident.severity?.trim() || 'Unknown';
  const status = incident.status?.trim() || 'Unknown';
  return (
    <AppCard style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.hazard}>{incident.hazard_type?.trim() || 'Unspecified hazard'}</Text>
        <StatusBadge label={severity} tone={toTone(severity)} />
      </View>
      <Row label="Location" value={incident.location?.trim() || 'Unknown location'} />
      <Row label="Status" value={status} />
      <Text style={styles.date}>{formatDateTime(incident.created_at)}</Text>
    </AppCard>
  );
}

export function RecentIncidentsPreview() {
  const [incidents, setIncidents] = useState<RecentIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getRecentIncidents();
        if (mounted) setIncidents(data);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : 'Unable to load recent incidents.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View>
      <SectionHeader title="Recent Incidents" subtitle="Most recent reports" />
      {loading ? <LoadingState message="Loading recent incidents..." /> : null}
      {error ? <ErrorState message={error} /> : null}
      {!loading && !error && incidents.length === 0 ? <EmptyState message="No incidents reported yet." /> : null}
      {!loading && !error ? incidents.map((incident) => <IncidentCard key={incident.id} incident={incident} />) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 10 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 8 },
  hazard: { color: theme.colors.text, fontWeight: '700', fontSize: 16, flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, gap: 8 },
  label: { color: theme.colors.muted, fontWeight: '600', fontSize: 12 },
  value: { color: theme.colors.text, fontSize: 13, flexShrink: 1, textAlign: 'right' },
  date: { color: theme.colors.muted, marginTop: 8, fontSize: 12 },
});
