import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

export function StatusBadge({ label, tone }: { label: string; tone: 'danger' | 'warning' | 'success' | 'info' }) {
  return (
    <View style={[styles.badge, { backgroundColor: `${theme.colors[tone]}1A`, borderColor: `${theme.colors[tone]}66` }]}> 
      <View style={[styles.dot, { backgroundColor: theme.colors[tone] }]} />
      <Text style={[styles.text, { color: theme.colors[tone] }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  text: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
});
