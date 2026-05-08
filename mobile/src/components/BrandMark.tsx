import { StyleSheet, Text, View } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { theme } from '@/constants/theme';

type BrandMarkProps = { size?: 'small' | 'large'; showLabel?: boolean };

export function BrandMark({ size = 'large', showLabel = false }: BrandMarkProps) {
  const compact = size === 'small';

  return (
    <View style={[styles.wrap, compact && styles.wrapSmall]}>
      <View style={[styles.badge, compact && styles.badgeSmall]}>
        <ShieldCheck size={compact ? 14 : 20} color={theme.colors.surface} strokeWidth={2.2} />
      </View>
      {showLabel ? <Text style={[styles.label, compact && styles.labelSmall]}>CCES DRRM</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  wrapSmall: { gap: 6 },
  badge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    borderWidth: 1,
    borderColor: theme.colors.safetyBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeSmall: { width: 28, height: 28, borderRadius: 9 },
  label: { color: theme.colors.primary, fontSize: 16, fontWeight: '700' },
  labelSmall: { fontSize: 13 },
});
