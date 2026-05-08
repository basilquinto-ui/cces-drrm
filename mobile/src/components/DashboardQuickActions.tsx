import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, ClipboardList, MapPinned, Phone, UserCheck, type LucideIcon } from 'lucide-react-native';
import { SectionHeader } from '@/components/SectionHeader';
import { theme } from '@/constants/theme';

type ActionItem = { label: string; Icon: LucideIcon; route: '/(tabs)/incidents' | '/(tabs)/checkin' | '/(tabs)/alerts' | '/(tabs)/more' };

const ACTIONS: ActionItem[] = [
  { label: 'Report Incident', Icon: ClipboardList, route: '/(tabs)/incidents' },
  { label: 'Check In', Icon: UserCheck, route: '/(tabs)/checkin' },
  { label: 'View Alerts', Icon: Bell, route: '/(tabs)/alerts' },
  { label: 'Emergency Contacts', Icon: Phone, route: '/(tabs)/more' },
  { label: 'Evacuation Guide', Icon: MapPinned, route: '/(tabs)/more' },
];

export function DashboardQuickActions() {
  const router = useRouter();
  return (
    <View>
      <SectionHeader title="Quick Actions" subtitle="Preparedness and response tools" />
      <View style={styles.grid}>
        {ACTIONS.map(({ label, Icon, route }) => (
          <Pressable key={label} onPress={() => router.push(route)} style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}>
            <Icon size={16} color={theme.colors.primary} strokeWidth={2.1} />
            <Text style={styles.actionLabel}>{label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  actionButton: { width: '48%', minHeight: 54, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.sm, backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionButtonPressed: { opacity: 0.75 },
  actionLabel: { color: theme.colors.text, fontWeight: '600', fontSize: 13 },
});
