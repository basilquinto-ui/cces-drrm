import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@/constants/theme';
export function AppCard({ children }: PropsWithChildren) { return <View style={styles.card}>{children}</View>; }
const styles = StyleSheet.create({ card: { backgroundColor: theme.colors.card, borderRadius: theme.radius, padding: 16, marginBottom: 12 } });
