import { Text, View } from 'react-native';
import { useSession } from '@/hooks/useSession';

export default function HomeScreen() {
  const { session, role } = useSession();
  return <View style={{ flex: 1, padding: 16, gap: 8 }}>
    <Text style={{ fontSize: 22, fontWeight: '700' }}>Dashboard</Text>
    <Text>Signed in as: {session?.user?.email ?? 'Guest'}</Text>
    <Text>Role: {role}</Text>
    <Text>Emergency status cards, weather, and quick actions can be added here from web prototype.</Text>
  </View>;
}
