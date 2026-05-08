import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { supabase } from '@/lib/supabase';
import { IncidentRecord } from '@/types/domain';

export default function IncidentScreen() {
  const [rows, setRows] = useState<IncidentRecord[]>([]); const [loading, setLoading] = useState(true);
  const [desc, setDesc] = useState(''); const [loc, setLoc] = useState(''); const [photoUri, setPhotoUri] = useState<string | null>(null); const [msg, setMsg] = useState('');
  async function load() { setLoading(true); const { data } = await supabase.from('incidents').select('*').order('created_at', { ascending: false }).limit(30); setRows(data || []); setLoading(false); }
  useEffect(() => { load(); }, []);
  async function pick() { const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 }); if (!res.canceled) setPhotoUri(res.assets[0].uri); }
  async function camera() { const p = await Camera.requestCameraPermissionsAsync(); if (!p.granted) return setMsg('Camera permission denied'); const res = await ImagePicker.launchCameraAsync({ quality: 0.7 }); if (!res.canceled) setPhotoUri(res.assets[0].uri); }
  async function submit() {
    let photo_url: string | null = null;
    if (photoUri) {
      const b = await fetch(photoUri).then((r) => r.blob());
      const path = `incidents/${Date.now()}.jpg`;
      const { error: upErr } = await supabase.storage.from('incident-photos').upload(path, b, { contentType: 'image/jpeg' });
      if (upErr) return setMsg(upErr.message);
      photo_url = supabase.storage.from('incident-photos').getPublicUrl(path).data.publicUrl;
    }
    const { error } = await supabase.from('incidents').insert({ description: desc, location: loc, hazard_type: 'general', severity: 'minor', reported_by: 'mobile-user', status: 'reported', photo_url });
    setMsg(error ? error.message : 'Incident submitted'); setDesc(''); setLoc(''); setPhotoUri(null); load();
  }
  return <FlatList ListHeaderComponent={<View style={{ padding: 16, gap: 8 }}><Text style={{ fontSize: 20, fontWeight: '700' }}>Report Incident</Text><TextInput value={loc} onChangeText={setLoc} placeholder='Location' style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} /><TextInput value={desc} onChangeText={setDesc} placeholder='Description' multiline style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8, minHeight: 80 }} />
    <View style={{ flexDirection: 'row', gap: 8 }}><Pressable onPress={pick} style={{ flex: 1, padding: 12, backgroundColor: '#dbeafe', borderRadius: 8 }}><Text>Select photo</Text></Pressable><Pressable onPress={camera} style={{ flex: 1, padding: 12, backgroundColor: '#e0e7ff', borderRadius: 8 }}><Text>Use camera</Text></Pressable></View>
    {photoUri && <Image source={{ uri: photoUri }} style={{ height: 120, borderRadius: 8 }} />}
    <Pressable onPress={submit} style={{ backgroundColor: '#0f4c81', padding: 12, borderRadius: 8 }}><Text style={{ color: '#fff', textAlign: 'center' }}>Submit</Text></Pressable><Text>{msg}</Text></View>} data={rows} keyExtractor={(i) => String(i.id)} ListEmptyComponent={loading ? <ActivityIndicator style={{ marginTop: 20 }} /> : <Text style={{ margin: 16 }}>No incidents yet.</Text>} renderItem={({ item }) => <View style={{ padding: 14, borderBottomWidth: 1, borderColor: '#ddd' }}><Text style={{ fontWeight: '700' }}>{item.location}</Text><Text numberOfLines={2}>{item.description}</Text></View>} />;
}
