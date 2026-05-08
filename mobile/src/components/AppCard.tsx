import { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@/constants/theme';

type AppCardProps = PropsWithChildren<{ variant?: 'default' | 'highlight' | 'outline'; style?: ViewStyle }>;

export function AppCard({ children, variant = 'default', style }: AppCardProps) {
  return <View style={[styles.card, styles[variant], style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.md,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  default: {},
  highlight: { backgroundColor: theme.colors.primarySoft, borderColor: '#BDD0EB' },
  outline: { backgroundColor: '#F8FAFC' },
});
