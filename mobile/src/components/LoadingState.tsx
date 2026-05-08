import { ActivityIndicator, View } from 'react-native';
import { theme } from '@/constants/theme';
export function LoadingState() { return <View><ActivityIndicator color={theme.colors.primary} /></View>; }
