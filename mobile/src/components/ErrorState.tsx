import { Text } from 'react-native';
import { theme } from '@/constants/theme';
export function ErrorState({ message }: { message: string }) { return <Text style={{ color: theme.colors.danger }}>{message}</Text>; }
