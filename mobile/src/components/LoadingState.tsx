import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

export function LoadingState({ message = 'Loading operations data...' }: { message?: string }) {
  return <View style={styles.wrap}><ActivityIndicator color={theme.colors.primary} size="large" /><Text style={styles.text}>{message}</Text></View>;
}
const styles = StyleSheet.create({ wrap: { alignItems: 'center', gap: 10, paddingVertical: 24 }, text: { color: theme.colors.muted } });
