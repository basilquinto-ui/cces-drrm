import { useState } from 'react';
import { Text } from 'react-native';
import { AppButton, AppCard, ErrorState, Screen, SectionHeader } from '@/components';
import { useSession } from '@/hooks/useSession';
import { upsertCheckin } from '@/services/checkins';
import { today } from '@/utils/dates';
import { checkinStatuses } from '@/constants/checkinStatuses';

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

  return <Screen><SectionHeader title="Staff Check-In" />{message.includes('not linked') ? <ErrorState message={message} /> : <Text>{message}</Text>}{checkinStatuses.map((item) => <AppCard key={item}><AppButton title={item === status ? `${item} selected` : item} onPress={() => setStatus(item)} /></AppCard>)}<AppButton title="Submit Check-In" onPress={submit} /></Screen>;
}
