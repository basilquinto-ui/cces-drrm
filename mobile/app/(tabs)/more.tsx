import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  AccountStatusCard,
  AppButton,
  AppCard,
  BrandMark,
  Screen,
  SectionHeader,
} from '@/components';
import { brand } from '@/constants/brand';
import { emergencyContacts } from '@/constants/emergencyContacts';
import { preparednessGuides } from '@/constants/preparednessGuides';
import { theme } from '@/constants/theme';
import { useSession } from '@/hooks/useSession';
import { signOut } from '@/services/auth';

export default function MoreScreen() {
  const { profile, user } = useSession();
  const canUseAdminTools = profile?.active !== false && profile?.role === 'admin';

  const onSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <Screen>
      <SectionHeader title="Operations Resources" subtitle="Contacts and preparedness references" />
      <AccountStatusCard email={user?.email ?? null} profile={profile} />
      <AppButton title="Sign Out" onPress={onSignOut} />

      {canUseAdminTools ? (
        <AppCard>
          <Text style={styles.cardTitle}>Admin Tools</Text>
          <Text style={styles.cardSub}>View Alerts</Text>
          <Text style={styles.cardSub}>Report Incident</Text>
          <Text style={styles.cardSub}>Check-In Monitor (coming soon)</Text>
          <Text style={styles.portalNote}>Full administration is available in the web portal.</Text>
        </AppCard>
      ) : null}

      <AppCard>
        <View style={styles.aboutRow}>
          <BrandMark size="small" showLabel />
          <Text style={styles.aboutTitle}>{brand.schoolName}</Text>
        </View>
        <Text style={styles.cardSub}>{brand.tagline}</Text>
        <Text style={styles.cardSub}>{brand.supportEmail}</Text>
      </AppCard>
      {emergencyContacts.map((c) => (
        <AppCard key={c.name}>
          <Text style={styles.cardTitle}>{c.name}</Text>
          <Text style={styles.cardSub}>{c.phone}</Text>
        </AppCard>
      ))}
      <SectionHeader title="Preparedness Guides" />
      {preparednessGuides.map((g) => (
        <AppCard key={g.title} variant="outline">
          <Text style={styles.cardTitle}>{g.title}</Text>
          <Text style={styles.cardSub}>{g.summary}</Text>
        </AppCard>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  aboutRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  aboutTitle: { color: theme.colors.text, fontWeight: '600', fontSize: 13 },
  cardTitle: { fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  cardSub: { color: theme.colors.muted },
  portalNote: { color: theme.colors.muted, marginTop: 8, fontSize: 12 },
});
