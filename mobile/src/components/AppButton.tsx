import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '@/constants/theme';

export function AppButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.btn, pressed && styles.pressed]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { minHeight: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.primary, borderRadius: theme.radius.sm, marginBottom: 10 },
  pressed: { opacity: 0.9 },
  text: { color: '#fff', fontWeight: '700' },
});
