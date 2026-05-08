import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { AppButton, AppCard, RoleGate, Screen, SectionHeader, StatusBadge } from '@/components';
import { checkinStatusMeta, checkinStatuses, type CheckinStatus } from '@/constants/checkinStatuses';
import { theme } from '@/constants/theme';
import { useSession } from '@/hooks/useSession';
import { upsertCheckin } from '@/services/checkins';
import { today } from '@/utils/dates';

export default function CheckinScreen() {
  const { profile } = useSession();
  const [status, setStatus] = useState<CheckinStatus>('safe');
  const [message, setMessage] = useState('');

  const isInactive = profile?.active === false;
  const isViewer = profile?.role === 'viewer';
  const missingStaffId = !profile?.staff_id;
  const canSubmit = !!profile?.active && (profile.role === 'staff' || profile.role === 'admin') && !!profile.staff_id;

  const fallbackMessage = isInactive
    ? 'Account inactive'
    : isViewer
      ? 'Check-in is limited to linked staff accounts'
      : missingStaffId
        ? 'Staff profile is not linked'
        : 'Check-in is unavailable for this account.';

  const submit = async () => {
    if (!canSubmit || !profile?.staff_id) return;
    await upsertCheckin(profile.staff_id, status, today());
    setMessage(`Check-in submitted: ${checkinStatusMeta[status].label}`);
  };

  return (
    <Screen>
      <SectionHeader title="Staff Check-In" subtitle="Log your daily status" />
      {message ? <StatusBadge label={message} tone="success" /> : null}
      <RoleGate
        allowedRoles={['staff', 'admin']}
        profile={profile}
        fallbackTitle="Check-in unavailable"
        fallbackMessage={fallbackMessage}
      >
        {missingStaffId ? (
          <AppCard variant="outline">
            <Text style={styles.blocked}>Staff profile is not linked</Text>
          </AppCard>
        ) : (
          <>
            {checkinStatuses.map((item) => {
              const statusMeta = checkinStatusMeta[item];
              const selected = item === status;

              return (
                <AppCard key={item} variant={selected ? 'highlight' : 'default'}>
                  <Text style={styles.label}>{statusMeta.label}</Text>
                  <Text style={styles.description}>{statusMeta.description}</Text>
                  <StatusBadge label={selected ? 'Selected' : 'Available'} tone={selected ? statusMeta.tone : 'info'} />
                  <AppButton
                    title={selected ? 'Selected' : `Set ${statusMeta.label}`}
                    onPress={() => setStatus(item)}
                  />
                </AppCard>
              );
            })}
            {canSubmit ? <AppButton title="Submit Check-In" onPress={submit} /> : null}
          </>
        )}
      </RoleGate>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: '700', color: theme.colors.text, marginBottom: 6 },
  description: { color: theme.colors.muted, marginBottom: 10 },
  blocked: { color: theme.colors.muted, fontWeight: '600' },
});
