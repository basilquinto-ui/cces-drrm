import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

export function EmptyState({ message }: { message: string }) {
  return <View style={styles.wrap}><Text style={styles.title}>No records yet</Text><Text style={styles.message}>{message}</Text></View>;
}
const styles = StyleSheet.create({ wrap: { borderWidth: 1, borderStyle: 'dashed', borderColor: theme.colors.border, borderRadius: theme.radius.md, padding: 16, marginBottom: 12, backgroundColor: '#fff' }, title: { fontSize: 15, fontWeight: '700', color: theme.colors.text, marginBottom: 4 }, message: { color: theme.colors.muted } });
