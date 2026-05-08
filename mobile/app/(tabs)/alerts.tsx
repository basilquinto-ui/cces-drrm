import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import { AlertItem } from '@/types/domain';

export default function AlertsScreen() {
  const [items, setItems] = useState<AlertItem[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { (async () => { const { data, error } = await supabase.from('alerts').select('*').order('created_at', { ascending: false }).limit(40); if (error) setError(error.message); else setItems(data || []); setLoading(false); })(); }, []);
  if (loading) return <ActivityIndicator style={{ marginTop: 30 }} />;
  if (error) return <Text style={{ margin: 16, color: 'red' }}>{error}</Text>;
  if (!items.length) return <Text style={{ margin: 16 }}>No active alerts.</Text>;
  return <FlatList data={items} keyExtractor={(i) => String(i.id)} renderItem={({ item }) => <View style={{ padding: 14, borderBottomWidth: 1, borderColor: '#ddd' }}><Text style={{ fontWeight: '700' }}>{item.title}</Text><Text>{item.message}</Text></View>} />;
}
