import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { AppCard, Screen, SectionHeader } from '@/components';
import { listAlerts } from '@/services/alerts';
export default function AlertsScreen() { const [alerts, setAlerts] = useState<any[]>([]); useEffect(() => { listAlerts().then(setAlerts); }, []); return <Screen><SectionHeader title="Alerts" />{alerts.map((a) => <AppCard key={a.id}><Text>{a.message}</Text></AppCard>)}</Screen>; }
