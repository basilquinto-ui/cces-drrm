import { Stack } from 'expo-router';
import { useSession } from '@/hooks/useSession';
import { LoadingState, Screen } from '@/components';

export default function RootLayout() {
  const { session, loading } = useSession();

  if (loading) return <Screen><LoadingState /></Screen>;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!session ? <Stack.Screen name="login" /> : <Stack.Screen name="(tabs)" />}
    </Stack>
  );
}
