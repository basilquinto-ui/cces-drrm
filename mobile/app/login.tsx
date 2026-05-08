import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { brand } from '@/constants/brand';
import { theme } from '@/constants/theme';
import { AppButton, AppCard, AppTextInput, BrandMark, ErrorState, Screen } from '@/components';

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
    if (authError) return setError(authError.message);
    router.replace('/(tabs)');
  };

  return (
    <Screen>
      <View style={styles.header}>
        <BrandMark size="large" showLabel />
        <Text style={styles.title}>{brand.appName}</Text>
        <Text style={styles.school}>{brand.schoolName}</Text>
      </View>
      <AppCard>
        {error ? <ErrorState message={error} /> : null}
        <AppTextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <AppTextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        <AppButton title={loading ? 'Signing In...' : 'Sign In'} onPress={loading ? () => undefined : signIn} />
        <Text style={styles.note}>{brand.emergencyNote}</Text>
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: theme.spacing(2), gap: 4 },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: '700' },
  school: { color: theme.colors.muted, fontSize: 14 },
  note: { color: theme.colors.muted, fontSize: 12, marginTop: 4 },
});
