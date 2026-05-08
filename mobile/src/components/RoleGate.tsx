import { PropsWithChildren } from 'react';
import { Text } from 'react-native';
import { AppCard } from './AppCard';
import { Profile, UserRole } from '@/types/domain';
import { theme } from '@/constants/theme';

type RoleGateProps = PropsWithChildren<{
  allowedRoles: UserRole[];
  profile: Profile | null;
  fallbackTitle: string;
  fallbackMessage: string;
}>;

export function RoleGate({ allowedRoles, profile, fallbackTitle, fallbackMessage, children }: RoleGateProps) {
  const allowed = !!profile?.active && allowedRoles.includes(profile.role);
  if (!allowed) {
    return (
      <AppCard variant="outline">
        <Text style={{ color: theme.colors.text, fontWeight: '700', marginBottom: 6 }}>{fallbackTitle}</Text>
        <Text style={{ color: theme.colors.muted }}>{fallbackMessage}</Text>
      </AppCard>
    );
  }
  return <>{children}</>;
}
