import { AppButton, Screen, SectionHeader } from '@/components';
import { useSession } from '@/hooks/useSession';
import { upsertCheckin } from '@/services/checkins';
import { today } from '@/utils/dates';
export default function CheckinScreen() {
  const { profile } = useSession();
  return <Screen><SectionHeader title="Staff Check-In" /><AppButton title="Check In" onPress={() => { if (profile?.staff_id) void upsertCheckin(profile.staff_id, 'on_site', today()); }} /></Screen>;
}
