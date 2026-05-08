import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

export function AppTextInput(props: TextInputProps) {
  return <TextInput placeholderTextColor={theme.colors.muted} style={[styles.input, props.multiline && styles.multiline]} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: theme.colors.text,
  },
  multiline: { minHeight: 110, textAlignVertical: 'top' },
});
