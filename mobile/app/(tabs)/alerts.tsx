import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { AppButton, AppCard, EmptyState, ErrorState, RoleGate, Screen, SectionHeader, StatusBadge } from '@/components';
import { alertTemplates } from '@/constants/alertTemplates';
import { useSession } from '@/hooks/useSession';
import { createAlert, listAlerts } from '@/services/alerts';
import { formatDateTime, formatLabel } from '@/utils/formatters';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const { role, profile } = useSession();
  const canView = profile?.active !== false;
  const isActiveAdmin = canView && role === 'admin';

  const load = async () => {
    setError('');
    try {
      const data = await listAlerts();
      setAlerts((data as any[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load alerts.');
    }
  };

  useEffect(() => {
    if (canView) load();
  }, [canView]);

  const createFromTemplate = async (template: { level: string; message: string }) => {
    setError('');
    setNotice('');
    const { error: createError } = await createAlert({
      hazard_type: 'general',
      level: template.level,
      message: template.message,
      issued_by: profile?.full_name ?? 'Admin',
      active: true,
    });
    if (createError) {
      setError(createError.message);
      return;
    }
    setNotice('Alert created.');
    load();
  };

  return (
    <Screen>
      <SectionHeader title="Alerts" subtitle="Broadcast and monitor advisories" />
      {notice ? <StatusBadge label={notice} tone="success" /> : null}
      {!canView ? <EmptyState message="Account inactive" /> : null}
      {canView && error ? <ErrorState message={error} /> : null}
      {canView && !error && alerts.length === 0 ? <EmptyState message="No active advisories are currently posted." /> : null}
      {canView && !error
        ? alerts.map((a) => (
            <AppCard key={a.id}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Hazard: {formatLabel(a.hazard_type)}</Text>
                <StatusBadge label={a.active ? 'Active' : 'Resolved'} tone={a.active ? 'warning' : 'info'} />
              </View>
              <Text>Alert level: {formatLabel(a.level)}</Text>
              <Text>Message: {a.message || 'No message provided.'}</Text>
              <Text>Issued by: {a.issued_by || 'Unknown issuer'}</Text>
              <Text>Created: {formatDateTime(a.created_at)}</Text>
            </AppCard>
          ))
        : null}
      {isActiveAdmin ? (
        <RoleGate
          allowedRoles={['admin']}
          profile={profile}
          fallbackTitle="Admin controls hidden"
          fallbackMessage="Only active admin accounts can create new alerts."
        >
          <SectionHeader title="Admin Templates" subtitle="Quickly issue standardized notices" />
          {alertTemplates.map((t) => (
            <AppButton key={`${t.level}-${t.message}`} title={`${formatLabel(t.level)}: ${t.message}`} onPress={() => createFromTemplate({ level: t.level, message: t.message })} />
          ))}
        </RoleGate>
      ) : null}
    </Screen>
  );
}
