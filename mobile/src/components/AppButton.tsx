import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '@/constants/theme';
export function AppButton({ title, onPress }: { title: string; onPress: () => void }) { return <Pressable style={styles.btn} onPress={onPress}><Text style={styles.text}>{title}</Text></Pressable>; }
const styles = StyleSheet.create({ btn: { minHeight: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primary, borderRadius: 10 }, text: { color: '#fff', fontWeight: '600' } });
