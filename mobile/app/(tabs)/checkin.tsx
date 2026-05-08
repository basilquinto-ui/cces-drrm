import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { AppButton, AppCard, ErrorState, Screen, SectionHeader, StatusBadge } from '@/components';
import { useSession } from '@/hooks/useSession';
import { upsertCheckin } from '@/services/checkins';
import { today } from '@/utils/dates';
import { checkinStatuses } from '@/constants/checkinStatuses';
import { theme } from '@/constants/theme';

export default function CheckinScreen() {
  const { profile } = useSession();
  const [status, setStatus] = useState<(typeof checkinStatuses)[number]>('safe');
  const [message, setMessage] = useState('');

  const submit = async () => {
    if (!profile?.staff_id) {
      setMessage('Your account is not linked to a staff profile yet. Contact the DRRM admin.');
      return;
    }
    await upsertCheckin(profile.staff_id, status, today());
    setMessage('Check-in submitted.');
  };

  return <Screen><SectionHeader title="Staff Check-In" subtitle="Log your daily status" />{message.includes('not linked') ? <ErrorState message={message} /> : null}{message === 'Check-in submitted.' ? <StatusBadge label="submitted" tone="success" /> : null}{checkinStatuses.map((item) => <AppCard key={item} variant={item === status ? 'highlight' : 'default'}><Text style={styles.label}>{item}</Text><AppButton title={item === status ? 'Selected' : 'Set status'} onPress={() => setStatus(item)} /></AppCard>)}<AppButton title="Submit Check-In" onPress={submit} /></Screen>;
}
const styles = StyleSheet.create({ label: { textTransform: 'capitalize', fontWeight: '700', color: theme.colors.text, marginBottom: 8 } });
