import { StyleSheet, Text } from 'react-native';
import { AppCard } from './AppCard';
import { ErrorState } from './ErrorState';
import { StatusBadge } from './StatusBadge';
import { theme } from '@/constants/theme';
import { Profile } from '@/types/domain';

interface AccountStatusCardProps {
  email: string | null;
  profile: Profile | null;
}

export function AccountStatusCard({ email, profile }: AccountStatusCardProps) {
  const hasStaffLink = !!profile?.staff_id;

  return (
    <AppCard>
      <Text style={styles.title}>Account Status</Text>
      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{email ?? 'Not available'}</Text>

      {!profile ? (
        <ErrorState
          message="No profile record is linked to this account. Access is limited until an administrator creates a profile."
        />
      ) : (
        <>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>{profile.full_name ?? 'Not set'}</Text>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{profile.role}</Text>
          <Text style={styles.label}>Account State</Text>
          <StatusBadge label={profile.active ? 'active' : 'inactive'} tone={profile.active ? 'success' : 'warning'} />
          <Text style={styles.label}>Staff Link</Text>
          <StatusBadge label={hasStaffLink ? 'staff linked' : 'staff not linked'} tone={hasStaffLink ? 'success' : 'warning'} />
          {profile.active === false ? <ErrorState message="This account is inactive. Contact an administrator for reactivation." /> : null}
        </>
      )}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  title: { fontWeight: '700', color: theme.colors.text, marginBottom: 8 },
  label: { color: theme.colors.muted, fontSize: 12, marginTop: 8 },
  value: { color: theme.colors.text, fontWeight: '600' },
});
