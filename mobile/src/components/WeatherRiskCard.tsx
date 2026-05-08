import { StyleSheet, Text, View } from 'react-native';
import { Activity, CloudSun, Droplets, Radio, Wind } from 'lucide-react-native';
import { AppCard } from '@/components/AppCard';
import { SectionHeader } from '@/components/SectionHeader';
import { theme } from '@/constants/theme';

const weatherSnapshot = {
  condition: 'Monitoring',
  temperature: '--',
  humidity: '--',
  wind: '--',
  typhoonSignal: 'No Typhoon Signal',
  seismicRisk: 'Monitoring',
};

// Placeholder snapshot only. Live weather and risk integration will be connected in a future update.
export function WeatherRiskCard() {
  return (
    <View>
      <SectionHeader title="Weather and Risk" subtitle="Daily environmental status" />
      <AppCard>
        <View style={styles.headerRow}>
          <CloudSun size={20} color={theme.colors.info} strokeWidth={2.1} />
          <Text style={styles.conditionText}>{weatherSnapshot.condition}</Text>
        </View>
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}><Text style={styles.metricLabel}>Temperature</Text><Text style={styles.metricValue}>{weatherSnapshot.temperature}</Text></View>
          <View style={styles.metricItem}><Droplets size={14} color={theme.colors.primary} strokeWidth={2.1} /><Text style={styles.metricLabel}>Humidity</Text><Text style={styles.metricValue}>{weatherSnapshot.humidity}</Text></View>
          <View style={styles.metricItem}><Wind size={14} color={theme.colors.primary} strokeWidth={2.1} /><Text style={styles.metricLabel}>Wind</Text><Text style={styles.metricValue}>{weatherSnapshot.wind}</Text></View>
        </View>
        <View style={styles.statusRow}>
          <Radio size={16} color={theme.colors.warning} strokeWidth={2.1} />
          <Text style={styles.statusLabel}>Typhoon Signal</Text>
          <Text style={styles.statusValue}>{weatherSnapshot.typhoonSignal}</Text>
        </View>
        <View style={styles.statusRow}>
          <Activity size={16} color={theme.colors.danger} strokeWidth={2.1} />
          <Text style={styles.statusLabel}>Seismic Risk</Text>
          <Text style={styles.statusValue}>{weatherSnapshot.seismicRisk}</Text>
        </View>
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  conditionText: { color: theme.colors.text, fontSize: 16, fontWeight: '700' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  metricItem: { minWidth: 90, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.sm, paddingVertical: 8, paddingHorizontal: 10, backgroundColor: theme.colors.surface, flexDirection: 'row', alignItems: 'center', gap: 6 },
  metricLabel: { color: theme.colors.muted, fontSize: 12, fontWeight: '600' },
  metricValue: { color: theme.colors.text, fontSize: 13, fontWeight: '700' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 6 },
  statusLabel: { color: theme.colors.muted, fontSize: 12, fontWeight: '600' },
  statusValue: { color: theme.colors.text, fontSize: 13, fontWeight: '700' },
});
