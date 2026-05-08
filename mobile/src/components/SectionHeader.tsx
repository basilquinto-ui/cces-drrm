import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return <View style={styles.wrap}><Text style={styles.title}>{title}</Text>{subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}</View>;
}
const styles = StyleSheet.create({ wrap: { marginBottom: 10 }, title: { fontSize: 22, fontWeight: '700', color: theme.colors.text }, subtitle: { color: theme.colors.muted, marginTop: 2 } });
