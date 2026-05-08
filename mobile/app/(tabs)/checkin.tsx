import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function CheckinScreen() {
  const [name, setName] = useState(''); const [msg, setMsg] = useState('');
  async function submit() {
    const date = new Date().toISOString().slice(0, 10);
    const { error } = await supabase.from('checkins').insert({ staff_name: name, date, status: 'present' });
    setMsg(error ? error.message : 'Checked in successfully.');
  }
  return <View style={{ flex: 1, padding: 16, gap: 10 }}><Text style={{ fontSize: 20, fontWeight: '700' }}>Staff Check-in</Text><TextInput placeholder="Full name" value={name} onChangeText={setName} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8 }} /><Pressable onPress={submit} style={{ backgroundColor: '#0f4c81', padding: 12, borderRadius: 8 }}><Text style={{ color: '#fff', textAlign: 'center' }}>Check in</Text></Pressable><Text>{msg}</Text></View>;
}
