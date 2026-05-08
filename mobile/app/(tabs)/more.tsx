import { StyleSheet, Text, View } from 'react-native';
import { AppCard, BrandMark, ErrorState, Screen, SectionHeader, StatusBadge } from '@/components';
import { brand } from '@/constants/brand';
import { emergencyContacts } from '@/constants/emergencyContacts';
import { preparednessGuides } from '@/constants/preparednessGuides';
import { theme } from '@/constants/theme';
import { useSession } from '@/hooks/useSession';

export default function MoreScreen() {
  const { profile } = useSession();
  const linked = !!profile?.staff_id;

  return (
    <Screen>
      <SectionHeader title="Operations Resources" subtitle="Contacts and preparedness references" />
      {profile?.active === false ? <ErrorState message="Account inactive" /> : null}
      <AppCard>
        <Text style={styles.cardTitle}>Profile Access</Text>
        <Text style={styles.cardSub}>Role: {profile?.role ?? 'viewer'}</Text>
        <StatusBadge label={linked ? 'staff linked' : 'staff not linked'} tone={linked ? 'success' : 'warning'} />
      </AppCard>
      <AppCard>
        <View style={styles.aboutRow}><BrandMark size="small" showLabel /><Text style={styles.aboutTitle}>{brand.schoolName}</Text></View>
        <Text style={styles.cardSub}>{brand.tagline}</Text><Text style={styles.cardSub}>{brand.supportEmail}</Text>
      </AppCard>
      {emergencyContacts.map((c) => <AppCard key={c.name}><Text style={styles.cardTitle}>{c.name}</Text><Text style={styles.cardSub}>{c.phone}</Text></AppCard>)}
      <SectionHeader title="Preparedness Guides" />
      {preparednessGuides.map((g) => <AppCard key={g.title} variant="outline"><Text style={styles.cardTitle}>{g.title}</Text><Text style={styles.cardSub}>{g.summary}</Text></AppCard>)}
    </Screen>
  );
}

const styles = StyleSheet.create({
  aboutRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  aboutTitle: { color: theme.colors.text, fontWeight: '600', fontSize: 13 },
  cardTitle: { fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  cardSub: { color: theme.colors.muted },
});
