import { StyleSheet, Text, View } from 'react-native';
import { Screen, AppCard, SectionHeader, StatusBadge } from '@/components';
import { theme } from '@/constants/theme';

export default function DashboardScreen() {
  return <Screen><SectionHeader title="Operations Dashboard" subtitle="Community command center overview" /><AppCard variant="highlight"><Text style={styles.metricLabel}>Current posture</Text><StatusBadge label="monitoring" tone="info" /><Text style={styles.metricValue}>No severe active incidents</Text></AppCard><View style={styles.grid}><AppCard style={styles.gridCard}><Text style={styles.metricLabel}>Check-ins today</Text><Text style={styles.metricValue}>0</Text></AppCard><AppCard style={styles.gridCard}><Text style={styles.metricLabel}>Open incidents</Text><Text style={styles.metricValue}>0</Text></AppCard></View></Screen>;
}
const styles = StyleSheet.create({ metricLabel: { color: theme.colors.muted, fontSize: 12, marginBottom: 6 }, metricValue: { color: theme.colors.text, fontWeight: '700', fontSize: 18, marginTop: 8 }, grid: { flexDirection: 'row', gap: 10 }, gridCard: { flex: 1 } });
