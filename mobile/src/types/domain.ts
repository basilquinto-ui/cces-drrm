export type UserRole = 'admin' | 'staff' | 'viewer';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  staff_id: string | null;
  active: boolean;
}

export interface AlertItem {
  id: string;
  hazard_type: string;
  level: 'info' | 'warning' | 'danger';
  message: string;
  issued_by: string;
  active: boolean;
  created_at: string;
  cancelled_at: string | null;
}

export interface Incident {
  id: string;
  location: string;
  hazard_type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  photo_url: string | null;
  reported_by: string;
  status: string;
  created_at: string;
}

export interface Checkin {
  staff_id: string;
  date: string;
  status: string;
  checked_in_at: string;
}
