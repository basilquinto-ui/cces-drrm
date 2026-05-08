import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Bell,
  ClipboardList,
  MapPinned,
  Phone,
  ShieldCheck,
  UserCheck,
  type LucideIcon,
} from 'lucide-react-native';
import { AppCard, Screen, SectionHeader, StatusBadge } from '@/components';
import { theme } from '@/constants/theme';

type MetricCardProps = { label: string; value: string; Icon: LucideIcon };
type QuickActionProps = { label: string; Icon: LucideIcon };

function MetricCard({ label, value, Icon }: MetricCardProps) {
  return (
    <AppCard style={styles.metricCard}>
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Icon size={16} color={theme.colors.muted} strokeWidth={2.1} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
    </AppCard>
  );
}

function QuickAction({ label, Icon }: QuickActionProps) {
  return (
    <Pressable style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}>
      <Icon size={16} color={theme.colors.primary} strokeWidth={2.1} />
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

export default function DashboardScreen() {
  return (
    <Screen>
      <SectionHeader
        title="CCES DRRM Command Center"
        subtitle="School safety status and emergency operations"
      />

      <AppCard variant="highlight">
        <View style={styles.statusTitleRow}>
          <ShieldCheck size={18} color={theme.colors.info} strokeWidth={2.2} />
          <Text style={styles.metricLabel}>School Safety Status</Text>
        </View>
        <StatusBadge label="Normal Operations" tone="info" />
        <Text style={styles.metricValue}>No active emergency reported</Text>
      </AppCard>

      <View style={styles.grid}>
        <MetricCard label="Active Alerts" value="0" Icon={Bell} />
        <MetricCard label="Open Incidents" value="0" Icon={ClipboardList} />
      </View>
      <View style={styles.grid}>
        <MetricCard label="Staff Check-In" value="0" Icon={UserCheck} />
        <MetricCard label="Resolved Today" value="0" Icon={ShieldCheck} />
      </View>

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
  actionButton: {
    width: '48%',
    minHeight: 54,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButtonPressed: { opacity: 0.75 },
  actionLabel: { color: theme.colors.text, fontWeight: '600', fontSize: 13 },
});
