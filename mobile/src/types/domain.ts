export type UserRole = 'admin' | 'staff' | 'viewer';

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  staff_id: string | null;
  active: boolean;
}
