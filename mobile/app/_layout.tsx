import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSession } from '@/hooks/useSession';
import { LoadingState, Screen } from '@/components';

export default function RootLayout() {
  const { session, loading } = useSession();

  if (loading) return <SafeAreaProvider><Screen><LoadingState /></Screen></SafeAreaProvider>;

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {!session ? <Stack.Screen name="login" /> : <Stack.Screen name="(tabs)" />}
      </Stack>
    </SafeAreaProvider>
  );
}
