import { Slot, Stack } from 'expo-router';
import { useSession } from '@/hooks/useSession';

export default function RootLayout() {
  const { session } = useSession();
  if (!session) return <Stack screenOptions={{ headerShown: false }}><Stack.Screen name="login" /></Stack>;
  return <Slot />;
}
