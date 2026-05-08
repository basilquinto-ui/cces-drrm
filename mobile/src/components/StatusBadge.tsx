import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
export function StatusBadge({ label, tone }: { label: string; tone: 'danger'|'warning'|'success'|'info' }) { return <View style={[styles.badge, { backgroundColor: theme.colors[tone] }]}><Text style={styles.t}>{label}</Text></View>; }
const styles = StyleSheet.create({ badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }, t: { color: '#fff', fontSize: 12 } });
