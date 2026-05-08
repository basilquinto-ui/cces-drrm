import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
export function SectionHeader({ title }: { title: string }) { return <View><Text style={styles.t}>{title}</Text></View>; }
const styles = StyleSheet.create({ t: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 8 } });
