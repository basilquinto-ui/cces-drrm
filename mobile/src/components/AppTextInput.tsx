import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
export function AppTextInput(props: TextInputProps) { return <TextInput placeholderTextColor={theme.colors.muted} style={styles.input} {...props} />; }
const styles = StyleSheet.create({ input: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10, backgroundColor: '#fff' } });
