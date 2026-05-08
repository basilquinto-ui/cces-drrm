import { useState } from 'react';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { AppButton, AppTextInput, Screen, SectionHeader } from '@/components';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signIn = async () => { await supabase.auth.signInWithPassword({ email, password }); router.replace('/(tabs)'); };
  return <Screen><SectionHeader title="CCES DRRM Login" /><AppTextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" /><AppTextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} /><AppButton title="Sign In" onPress={signIn} /></Screen>;
}
