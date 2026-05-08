import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

export function ErrorState({ message }: { message: string }) {
  return <View style={styles.wrap}><Text style={styles.label}>Action needed</Text><Text style={styles.text}>{message}</Text></View>;
}
const styles = StyleSheet.create({ wrap: { backgroundColor: '#FEF3F2', borderWidth: 1, borderColor: '#FECDCA', borderRadius: theme.radius.sm, padding: 12, marginBottom: 12 }, label: { color: theme.colors.danger, fontWeight: '700', marginBottom: 4 }, text: { color: '#912018' } });
