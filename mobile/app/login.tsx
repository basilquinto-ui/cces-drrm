import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onLogin = async () => {
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    router.replace('/(tabs)');
  };

  return <View style={s.wrap}><ShieldCheck color="#0f4c81" size={42} /><Text style={s.title}>CCES DRRM Login</Text>
    <TextInput style={s.i} autoCapitalize="none" placeholder="Email" value={email} onChangeText={setEmail} />
    <TextInput style={s.i} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
    {!!error && <Text style={s.err}>{error}</Text>}
    <Pressable style={s.b} onPress={onLogin} disabled={loading}>{loading ? <ActivityIndicator color="#fff" /> : <Text style={s.bt}>Sign in</Text>}</Pressable>
  </View>;
}
const s = StyleSheet.create({wrap:{flex:1,justifyContent:'center',padding:20,gap:12,backgroundColor:'#f7fafc'},title:{fontSize:24,fontWeight:'700'},i:{backgroundColor:'#fff',padding:14,borderRadius:10},b:{backgroundColor:'#0f4c81',padding:14,borderRadius:10,alignItems:'center'},bt:{color:'#fff',fontWeight:'600'},err:{color:'#b42318'}});
