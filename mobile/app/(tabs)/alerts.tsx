import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { AppButton, AppCard, EmptyState, RoleGate, Screen, SectionHeader, StatusBadge } from '@/components';
import { listAlerts, createAlert } from '@/services/alerts';
import { useSession } from '@/hooks/useSession';
import { alertTemplates } from '@/constants/alertTemplates';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [notice, setNotice] = useState('');
  const { role, profile } = useSession();
  const canView = profile?.active !== false;
  const isActiveAdmin = profile?.active !== false && role === 'admin';

  const load = () => listAlerts().then((v) => setAlerts(v as any[]));
  useEffect(() => {
    if (canView) load();
  }, [canView]);

  const createFromTemplate = async (template: { level: string; message: string }) => {
    await createAlert({
      hazard_type: 'general',
      level: template.level,
      message: template.message,
      issued_by: profile?.full_name ?? 'Admin',
      active: true,
    });
    setNotice('Alert created.');
    load();
  };

  return (
    <Screen>
      <SectionHeader title="Alerts" subtitle="Broadcast and monitor advisories" />
      {notice ? <StatusBadge label={notice} tone="success" /> : null}
      {!canView ? (
        <EmptyState message="Account inactive" />
      ) : (
        <>
          {alerts.length === 0 ? (
            <EmptyState message="No active advisories are currently posted." />
          ) : (
            alerts.map((a) => (
              <AppCard key={a.id}>
                <StatusBadge label={a.active ? 'active' : 'resolved'} tone={a.active ? 'warning' : 'info'} />
                <Text>Hazard: {a.hazard_type}</Text>
                <Text>Level: {a.level}</Text>
                <Text>Message: {a.message}</Text>
                <Text>Issued by: {a.issued_by}</Text>
              </AppCard>
            ))
          )}
          {isActiveAdmin ? (
            <RoleGate
              allowedRoles={['admin']}
              profile={profile}
              fallbackTitle="Admin controls hidden"
              fallbackMessage="Only active admin accounts can create new alerts."
            >
              <SectionHeader title="Admin Templates" subtitle="Quickly issue standardized notices" />
              {alertTemplates.map((t) => (
                <AppButton
                  key={`${t.level}-${t.message}`}
                  title={`${t.level}: ${t.message}`}
                  onPress={() => createFromTemplate({ level: t.level, message: t.message })}
                />
              ))}
            </RoleGate>
          ) : null}
        </>
      )}
    </Screen>
  );
}
