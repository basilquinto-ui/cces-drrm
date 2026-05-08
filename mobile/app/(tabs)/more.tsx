import { Pressable, Text, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/hooks/useSession';

export default function MoreScreen() {
  const { role, session } = useSession();
  const isAdmin = role === 'admin';
  return <View style={{ flex: 1, padding: 16, gap: 10 }}>
    <Text style={{ fontSize: 20, fontWeight: '700' }}>More / Admin</Text>
    <Text>User: {session?.user?.email}</Text>
    <Text>Role-protected actions:</Text>
    {isAdmin ? <Text>Admin quick actions visible.</Text> : <Text>Admin actions hidden for non-admin users.</Text>}
    {/* TODO: Finalize Supabase RLS policies so only admins can mutate protected records. */}
    <Pressable onPress={() => supabase.auth.signOut()} style={{ backgroundColor: '#111827', padding: 12, borderRadius: 8 }}><Text style={{ color: '#fff' }}>Sign out</Text></Pressable>
  </View>;
}
