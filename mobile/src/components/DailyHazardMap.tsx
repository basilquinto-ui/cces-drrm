import { StyleSheet, Text, View } from 'react-native';
import { Building2, HeartPulse, Route, ShieldAlert, TriangleAlert, Users } from 'lucide-react-native';
import { AppCard } from '@/components/AppCard';
import { SectionHeader } from '@/components/SectionHeader';
import { HAZARD_AREAS, type HazardArea, type HazardRiskLevel } from '@/constants/hazardMap';
import { theme } from '@/constants/theme';

const RISK_COLORS: Record<HazardRiskLevel, string> = {
  high: theme.colors.danger,
  moderate: theme.colors.warning,
  low: theme.colors.success,
  assembly: theme.colors.info,
};

const RISK_LABELS: Record<HazardRiskLevel, string> = { high: 'High Risk', moderate: 'Moderate', low: 'Low Risk', assembly: 'Assembly' };

function iconForArea(area: HazardArea) {
  if (area.iconKey === 'building') return Building2;
  if (area.iconKey === 'heart') return HeartPulse;
  if (area.iconKey === 'route') return Route;
  if (area.iconKey === 'users') return Users;
  if (area.iconKey === 'triangle') return TriangleAlert;
  return ShieldAlert;
}

export function DailyHazardMap() {
  return (
    <View>
      <SectionHeader title="Daily Hazard Map" subtitle="Operational risk summary for campus zones" />
      <AppCard>
        <View style={styles.legendRow}>
          {(['high', 'moderate', 'low', 'assembly'] as const).map((risk) => (
            <View key={risk} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: RISK_COLORS[risk] }]} />
              <Text style={styles.legendLabel}>{RISK_LABELS[risk]}</Text>
            </View>
          ))}
        </View>
        <View style={styles.areaList}>
          {HAZARD_AREAS.map((area) => {
            const Icon = iconForArea(area);
            return (
              <View key={area.id} style={styles.areaItem}>
                <View style={[styles.areaIconWrap, { backgroundColor: `${RISK_COLORS[area.riskLevel]}20` }]}>
                  <Icon size={16} color={RISK_COLORS[area.riskLevel]} strokeWidth={2.1} />
                </View>
                <View style={styles.areaTextWrap}>
                  <Text style={styles.areaName}>{area.name}</Text>
                  <Text style={styles.areaDescription}>{area.description}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 10 },
  legendLabel: { color: theme.colors.muted, fontSize: 12, fontWeight: '600' },
  areaList: { gap: 10 },
  areaItem: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.sm, padding: 10, backgroundColor: theme.colors.surface, flexDirection: 'row', gap: 10 },
  areaIconWrap: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  areaTextWrap: { flex: 1 },
  areaName: { color: theme.colors.text, fontWeight: '700', fontSize: 13, marginBottom: 2 },
  areaDescription: { color: theme.colors.muted, fontSize: 12, lineHeight: 17 },
});
