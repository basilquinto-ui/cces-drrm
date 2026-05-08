import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { AppButton, AppCard, AppTextInput, Screen, SectionHeader } from '@/components';
import { listAlerts, createAlert } from '@/services/alerts';
import { useSession } from '@/hooks/useSession';
import { alertTemplates } from '@/constants/alertTemplates';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const { role, profile } = useSession();
  const load = () => listAlerts().then((v) => setAlerts(v as any[]));
  useEffect(() => { load(); }, []);

  const createFromTemplate = async (template: { level: string; message: string }) => {
    await createAlert({ hazard_type: 'general', level: template.level, message: template.message, issued_by: profile?.full_name ?? 'Admin', active: true });
    setMessage('Alert created.');
    load();
  };

  return <Screen><SectionHeader title="Alerts" /><Text>{message}</Text>{alerts.map((a) => <AppCard key={a.id}><Text>Hazard: {a.hazard_type}</Text><Text>Level: {a.level}</Text><Text>Message: {a.message}</Text><Text>Issued by: {a.issued_by}</Text><Text>Status: {a.active ? 'active' : 'resolved'}</Text><Text>Created: {a.created_at}</Text></AppCard>)}{role === 'admin' ? <><SectionHeader title="Admin Templates" />{alertTemplates.map((t) => <AppButton key={`${t.level}-${t.message}`} title={`${t.level}: ${t.message}`} onPress={() => createFromTemplate({ level: t.level, message: t.message })} />)}</> : null}<AppTextInput value={message} onChangeText={setMessage} placeholder="Operational note" /></Screen>;
}
