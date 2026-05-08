import { useState } from 'react';
import { Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppButton, AppTextInput, Screen, SectionHeader } from '@/components';
import { createIncident, uploadIncidentPhoto } from '@/services/incidents';
import { useSession } from '@/hooks/useSession';
export default function IncidentsScreen() {
  const { session, profile } = useSession();
  const [description, setDescription] = useState('');
  const submit = async () => {
    const img = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'] });
    const photo = !img.canceled && session?.user.id ? await uploadIncidentPhoto(session.user.id, img.assets[0].uri) : null;
    await createIncident({ location: 'Campus', hazard_type: 'general', description, severity: 'medium', photo_url: photo, reported_by: profile?.full_name || session?.user.email, status: 'new' });
  };
  return <Screen><SectionHeader title="Incidents" /><AppTextInput value={description} onChangeText={setDescription} placeholder="Describe incident" /><AppButton title="Submit Incident" onPress={submit} /><Text>Capture and submit field reports.</Text></Screen>;
}
