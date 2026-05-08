import { useState } from 'react';
import { Text } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { AppButton, AppTextInput, ErrorState, Screen, SectionHeader } from '@/components';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const signIn = async () => {
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      return;
    }
    router.replace('/(tabs)');
  };

  return <Screen><SectionHeader title="CCES DRRM Login" />{error ? <ErrorState message={error} /> : null}<AppTextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" /><AppTextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} /><AppButton title="Sign In" onPress={signIn} /><Text>Use your assigned DRRM account credentials.</Text></Screen>;
}
