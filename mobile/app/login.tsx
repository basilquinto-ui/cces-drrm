import { useState } from 'react';
import { Text } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { AppButton, AppCard, AppTextInput, ErrorState, Screen, SectionHeader } from '@/components';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    router.replace('/(tabs)');
  };

  return <Screen><SectionHeader title="CCES DRRM" subtitle="Command Center Access" /><AppCard>{error ? <ErrorState message={error} /> : null}<AppTextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" /><AppTextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} /><AppButton title={loading ? 'Signing In...' : 'Sign In'} onPress={loading ? () => undefined : signIn} /><Text>Use your assigned DRRM account credentials.</Text></AppCard></Screen>;
}
