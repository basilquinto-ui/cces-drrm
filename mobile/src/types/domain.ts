export type AppRole = 'admin' | 'staff' | 'viewer';

export type AlertItem = {
  id: number;
  title: string;
  message: string;
  severity: 'info' | 'watch' | 'critical';
  created_at: string;
};

export type IncidentRecord = {
  id: number;
  location: string;
  hazard_type: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe';
  reported_by: string;
  status: string;
  photo_url: string | null;
  created_at: string;
};
